import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 6 })
  password: string;
}
