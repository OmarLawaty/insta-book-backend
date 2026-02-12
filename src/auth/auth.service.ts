import { BadRequestException, Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt } from 'crypto';

import { UsersService } from 'src/users';

import { CreateUserDTO } from './dtos';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDTO: CreateUserDTO) {
    const user = await this.usersService.find(createUserDTO.email);

    if (user.length) throw new BadRequestException('Email is already used');

    const salt = randomBytes(8).toString('hex');
    const hashed = (await scrypt(createUserDTO.password, salt, 32)) as Buffer;
    const result = `${salt}.${hashed.toString('hex')}`;

    return this.usersService.create({ ...createUserDTO, password: result });
  }
}
