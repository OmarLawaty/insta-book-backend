import { Expose } from 'class-transformer';

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
  isAdmin: boolean;

  @Expose()
  authId: string;
}
