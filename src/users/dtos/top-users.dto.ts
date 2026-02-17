import { Expose, Type } from 'class-transformer';
import { ImageDTO } from 'src/cloudinary';

export class TopUsersDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Type(() => ImageDTO)
  image: ImageDTO;

  @Expose()
  likesCount?: number;
}
