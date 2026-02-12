import {
  IsDateString,
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  birthday: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 6 })
  password: string;
}
