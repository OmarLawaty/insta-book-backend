import { Body, Controller, Get, Post, Session } from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { CreateUserDTO, LoginUserDTO, UserDTO } from './dtos';

import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';

@Serialize(UserDTO)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('current-user')
  currentUser(@CurrentUser() user: User) {
    return this.authService.currentUser(user.id);
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
