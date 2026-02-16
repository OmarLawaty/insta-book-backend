import { Expose, Transform, Type } from 'class-transformer';

class CreatorSerializer {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  imageUrl: string;
}

export class PostDTO {
  @Expose()
  id: number;

  @Expose()
  caption: string;

  @Expose()
  tags: string[];

  @Expose()
  @Transform(({ obj }) => obj.image?.url ?? null)
  imageUrl: string;

  @Expose()
  location: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => CreatorSerializer)
  @Expose()
  creator: CreatorSerializer;

  @Transform(({ obj }) => obj.likes?.map((user) => user.id) ?? [])
  @Expose()
  likeIds: number[];

  @Transform(({ obj }) => obj.saves?.map((user) => user.id) ?? [])
  @Expose()
  saveIds: number[];
}
