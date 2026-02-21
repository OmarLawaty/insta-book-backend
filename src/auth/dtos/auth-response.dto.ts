import { Expose, Type } from 'class-transformer';

import { AuthUserDTO } from './auth-user.dto';

export class AuthResponseDTO {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => AuthUserDTO)
  user: AuthUserDTO;
}
