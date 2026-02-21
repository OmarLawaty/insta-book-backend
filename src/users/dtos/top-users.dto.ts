import { Expose, Type } from 'class-transformer';
import { ImageDTO } from 'src/cloudinary';

import { BasicUserDTO } from './basic-user.dto';

export class TopUsersDTO extends BasicUserDTO {
  @Expose()
  @Type(() => ImageDTO)
  image: ImageDTO;

  @Expose()
  likesCount: number;
}
