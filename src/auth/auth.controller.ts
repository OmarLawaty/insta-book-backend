import { Body, Controller, Post, Session } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;

    return user;
  }
}
