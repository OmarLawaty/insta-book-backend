import { Expose, Type } from 'class-transformer';

import { ImageDTO } from 'src/cloudinary';

import { BasicUserDTO } from './basic-user.dto';

export class UserDTO extends BasicUserDTO {
  @Expose()
  birthday: string;

  @Expose()
  bio: string;

  @Expose()
  @Type(() => ImageDTO)
  image: ImageDTO;
}
