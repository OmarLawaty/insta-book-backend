import { Body, Controller, Get, Post, Session } from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { CreateUserDTO, LoginUserDTO, UserDTO } from './dtos';

import { AuthService } from './auth.service';

@Serialize(UserDTO)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('current-user')
  currentUser(@Session() session: any) {
    return this.authService.currentUser(session.userId);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body);

    session.userId = user.id;

    return user;
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO, @Session() session: any) {
    const user = await this.authService.login(body);

    session.userId = user.id;

    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }
}
