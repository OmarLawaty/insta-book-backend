import { IsDateString, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @IsDateString()
  birthday: string;

  @IsString()
  imageId: string;

  @IsString()
  bio: string;
}
