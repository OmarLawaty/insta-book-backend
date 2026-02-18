import { Expose, Type } from 'class-transformer';

import { UserDTO } from './user.dto';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => UserDTO)
  user: UserDTO;
}
