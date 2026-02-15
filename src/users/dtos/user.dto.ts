import { Expose, Transform } from 'class-transformer';

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  birthday: string;

  @Expose()
  bio: string;

  @Expose()
  imageUrl: string;

  @Expose()
  imageId: string;

  @Transform(({ obj }) => obj.posts?.map((post) => post.id) ?? [])
  @Expose()
  postIds: string[];

  @Transform(({ obj }) => obj.liked?.map((post) => post.id) ?? [])
  @Expose()
  likedIds: string[];

  @Transform(({ obj }) => obj.saved?.map((post) => post.id) ?? [])
  @Expose()
  savedIds: string[];
}
