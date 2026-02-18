import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { MailService } from 'src/mail.service';
import { AuthTokenService } from './auth-token.service';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, AuthTokenService],
  exports: [AuthTokenService],
})
export class AuthModule {}
