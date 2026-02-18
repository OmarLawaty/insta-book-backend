import { Body, Controller, Get, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors';

import {
  CreateUserDTO,
  LoginUserDTO,
  AuthResponseDTO,
  ResendOTPDTO,
  VerifyOTPDTO,
} from './dtos';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users';
import { User } from 'src/users';
import { Public } from './decorators';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async isLoggedIn(@CurrentUser() user: User) {
    return !!(await this.authService.isLoggedIn(user));
  }

  @Serialize(AuthResponseDTO)
  @Post('signup')
  async signup(@Body() body: CreateUserDTO) {
    return this.authService.signup(body);
  }

  @Serialize(AuthResponseDTO)
  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    return this.authService.login(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: LoginUserDTO) {
    const authId = await this.authService.forgotPassword(body);

    return { authId };
  }

  @Post('verify-otp')
  async verifyOTP(@Body() body: VerifyOTPDTO) {
    return await this.authService.verifyOTP(body);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOTPDTO) {
    return this.authService.resendOTP(body.authId);
  }
}
