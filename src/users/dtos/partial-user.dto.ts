import { Expose, Transform } from 'class-transformer';

import { UserDTO } from './user.dto';

export class PartialUserDTO extends UserDTO {
  @Transform(
    ({ obj }) => obj.postIds ?? obj.posts?.map((post) => post.id) ?? [],
  )
  @Expose()
  postIds: number[];

  @Transform(
    ({ obj }) => obj.likedIds ?? obj.liked?.map((post) => post.id) ?? [],
  )
  @Expose()
  likedIds: number[];

  @Transform(
    ({ obj }) => obj.savedIds ?? obj.saved?.map((post) => post.id) ?? [],
  )
  @Expose()
  savedIds: number[];
}
