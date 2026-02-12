import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { UsersService } from 'src/users';

import { CreateUserDTO, LoginUserDTO } from './dtos';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async currentUser(userId: any) {
    if (!userId) return null;

    return this.usersService.findOne(userId);
  }

  async signup(createUserDTO: CreateUserDTO) {
    const user = await this.usersService.find(createUserDTO.email);
    if (user.length) throw new BadRequestException('Email is already used');

    const salt = randomBytes(8).toString('hex');
    const hashed = (await scrypt(createUserDTO.password, salt, 32)) as Buffer;
    const result = `${salt}.${hashed.toString('hex')}`;

    return this.usersService.create({ ...createUserDTO, password: result });
  }

  async login(loginUserDTO: LoginUserDTO) {
    const [user] = await this.usersService.find(loginUserDTO.email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, hash] = user.password.split('.');

    const userHash = (await scrypt(loginUserDTO.password, salt, 32)) as Buffer;

    if (hash !== userHash.toString('hex'))
      throw new BadRequestException('Password is incorrect');

    return user;
  }
}
