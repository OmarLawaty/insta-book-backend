import { Body, Controller, Post, Session } from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { CreateUserDTO, UserDTO } from './dtos';

import { AuthService } from './auth.service';

@Serialize(UserDTO)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body);

    session.userId = user.id;

    console.log(user.id);

    return user;
  }
}
