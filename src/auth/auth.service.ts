import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis';

import { User, UsersService } from 'src/users';

import { CreateUserDTO, LoginUserDTO, VerifyOTPDTO } from './dtos';
import { REDIS_CLIENT } from 'src/redis.module';
import { MailService } from 'src/mail.service';
import { getEncryptedPassword, getHashedPassword } from './helpers';
import { randomBytes, randomInt } from 'crypto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}
  async currentUser(user: User | null) {
    if (!user) return null;

    return this.usersService.findOne(user.id);
  }

  getAuthIdKey(authId: string) {
    return `pwd-reset:${authId}`;
  }

  async signup(createUserDTO: CreateUserDTO) {
    const user = await this.usersService.find(createUserDTO.email);
    if (user.length) throw new BadRequestException('Email is already used');

    const encryptedPassword = await getEncryptedPassword(
      createUserDTO.password,
    );

    return this.usersService.create({
      ...createUserDTO,
      password: encryptedPassword,
    });
  }

  async login(loginUserDTO: LoginUserDTO) {
    const [user] = await this.usersService.find(loginUserDTO.email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, hash] = user.password.split('.');

    const userHash = await getHashedPassword(loginUserDTO.password, salt);

    if (hash !== userHash.toString('hex'))
      throw new BadRequestException('Password is incorrect');

    return user;
  }

  async forgotPassword({ email, password }: LoginUserDTO) {
    const user = await this.usersService.find(email);

    if (!user.length) return;

    const encryptedPassword = await getEncryptedPassword(password);

    const authId = randomBytes(16).toString('hex');

    const key = this.getAuthIdKey(authId);

    await this.redis.hmset(key, {
      purpose: 'reset_password',
      email,
      password: encryptedPassword,
    });

    await this.redis.expire(key, 600); // 10 minutes

    const otp = randomInt(100000, 999999).toString();
    const hashedOtp = await hash(otp, 10);

    await this.redis.hset(key, 'otp', hashedOtp, 'otp_attempts', 0);
    await this.redis.expire(key, 600);

    await this.mailService.sendResetCode(email, otp);

    return authId;
  }

  async verifyOTP({ authId, otp }: VerifyOTPDTO) {
    const key = this.getAuthIdKey(authId);
    const session = await this.redis.hgetall(key);

    if (!session || !session.email)
      throw new BadRequestException('Session expired');

    const attempts = parseInt(session.otp_attempts || '0', 10);
    if (attempts >= 5) {
      await this.redis.del(key);
      throw new BadRequestException('Too many attempts');
    }

    const isValid = await compare(otp, session.otp);
    if (!isValid) {
      await this.redis.hincrby(key, 'otp_attempts', 1);
      throw new BadRequestException('Invalid OTP');
    }

    const [user] = await this.usersService.find(session.email);
    if (!user) throw new BadRequestException('User not found');

    await this.usersService.update(user.id, { password: session.password });

    await this.redis.del(key);
  }

  async resendOTP(authId: string) {
    const key = this.getAuthIdKey(authId);
    const session = await this.redis.hgetall(key);

    if (!session || !session.email)
      throw new BadRequestException('Session expired');

    const resendCount = parseInt(session.otp_resend_count || '0', 10);
    if (resendCount >= 3)
      throw new BadRequestException('OTP resend limit reached');

    const lastSentAt = parseInt(session.otp_last_sent_at || '0', 10);
    const now = Date.now();

    if (lastSentAt && now - lastSentAt < 60_000)
      throw new BadRequestException('Please wait before resending OTP');

    const otp = randomInt(100000, 999999).toString();
    const hashedOtp = await hash(otp, 10);

    await this.redis.hmset(key, {
      otp: hashedOtp,
      otp_attempts: 0,
      otp_resend_count: resendCount + 1,
      otp_last_sent_at: now,
    });

    const ttl = await this.redis.ttl(key);
    if (ttl > 0) await this.redis.expire(key, ttl);

    await this.mailService.sendResetCode(session.email, otp);
  }
}
