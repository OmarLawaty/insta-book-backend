import { Body, Controller, Get, Post, Session } from '@nestjs/common';

import { Serialize } from 'src/interceptors';

import { CreateUserDTO, LoginUserDTO, UserDTO, VerifyOTPDTO } from './dtos';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators';
import { User } from 'src/users';

@Serialize(UserDTO)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  me(@CurrentUser() user: User) {
    return this.authService.currentUser(user);
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

  @Post('forgot-password')
  async forgotPassword(@Body() body: LoginUserDTO) {
    const authId = await this.authService.forgotPassword(body);

    return { authId };
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: VerifyOTPDTO, @Session() session: any) {
    const user = await this.authService.verifyOTP(body);

    session.userId = user.id;

    return user;
  }
}
