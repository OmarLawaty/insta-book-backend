import { PostDTO } from 'src/posts/dtos';
import { UserDTO } from './user.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class FullUserDTO extends UserDTO {
  @Transform(({ value }) => value ?? [])
  @Type(() => PostDTO)
  @Expose()
  posts: PostDTO[];

  @Transform(({ value }) => value ?? [])
  @Type(() => PostDTO)
  @Expose()
  saved: PostDTO[];

  @Transform(({ value }) => value ?? [])
  @Type(() => PostDTO)
  @Expose()
  liked: PostDTO[];
}
