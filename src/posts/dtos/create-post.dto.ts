import { IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  caption: string;

  @IsString({ each: true })
  tags: string[];

  @IsString()
  imageId: string;

  @IsString()
  location: string;
}
