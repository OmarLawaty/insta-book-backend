import { Expose, Transform } from 'class-transformer';

export class BasicUserDTO {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj, options }) => {
    const currentUserId = (options as any)?.context?.currentUserId;

    return currentUserId ? obj.id === currentUserId : false;
  })
  isMe: boolean;
}
