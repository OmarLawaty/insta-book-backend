import { Expose } from 'class-transformer';

export class ImageDTO {
  @Expose()
  id: number;

  @Expose()
  url: string;

  @Expose()
  publicId: string;

  @Expose()
  createdAt: Date;
}
