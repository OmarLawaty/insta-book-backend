import { Post } from 'src/posts';
import { UserDTO } from './user.dto';
import { Expose, Transform } from 'class-transformer';

export class FullUserDTO extends UserDTO {
  @Transform(({ obj }) => obj.posts ?? [])
  @Expose()
  posts: Post[];

  @Transform(({ obj }) => obj.saved ?? [])
  @Expose()
  saved: Post[];

  @Transform(({ obj }) => obj.liked ?? [])
  @Expose()
  liked: Post[];
}
