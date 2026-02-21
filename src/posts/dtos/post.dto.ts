import { Expose, Transform, Type } from 'class-transformer';
import { ImageDTO } from 'src/cloudinary';
import { CreatorDto } from './creator.dto';

export class PostDTO {
  @Expose()
  id: number;

  @Expose()
  caption: string;

  @Expose()
  tags: string[];

  @Expose()
  @Type(() => ImageDTO)
  image: ImageDTO;

  @Expose()
  location: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => CreatorDto)
  @Expose()
  creator: CreatorDto;

  @Transform(({ obj }) => obj.likes?.length ?? 0)
  @Expose()
  likes: number;

  @Transform(({ obj, options }) => {
    const currentUserId = (options as any)?.context?.currentUserId;

    if (!currentUserId) return false;

    return obj.likes?.some((user) => user.id === currentUserId) ?? false;
  })
  @Expose()
  isLiked: boolean;

  @Transform(({ obj, options }) => {
    const currentUserId = (options as any)?.context?.currentUserId;

    if (!currentUserId) return false;

    return obj.saves?.some((user) => user.id === currentUserId) ?? false;
  })
  @Expose()
  isSaved: boolean;
}
