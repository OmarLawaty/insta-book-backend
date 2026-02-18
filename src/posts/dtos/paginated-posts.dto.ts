import { Expose, Type } from 'class-transformer';
import { PostDTO } from './post.dto';

export class PaginatedPostsDTO {
  @Expose()
  @Type(() => PostDTO)
  data: PostDTO[];

  @Expose()
  nextCursor: number | null;
}
