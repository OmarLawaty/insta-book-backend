import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Serialize } from 'src/interceptors';
import type { Response } from 'express';

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
    console.log(user);

    return !!(await this.authService.isLoggedIn(user));
  }

  @Serialize(AuthResponseDTO)
  @Post('signup')
  async signup(
    @Body() body: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(body);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Serialize(AuthResponseDTO)
  @Post('login')
  async login(
    @Body() body: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('signout')
  signout(@Res({ passthrough: true }) res: Response) {
    this.authService.signout(res);
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

  private setAuthCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
