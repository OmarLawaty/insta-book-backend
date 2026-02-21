import { Expose, Transform } from 'class-transformer';
import { BasicUserDTO } from 'src/users';

export class CreatorDto extends BasicUserDTO {
  @Transform(({ obj }) => obj.image?.url ?? null)
  @Expose()
  imageUrl: string;
}
