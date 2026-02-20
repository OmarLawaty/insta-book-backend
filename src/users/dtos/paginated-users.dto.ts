import { Expose, Type } from 'class-transformer';
import { TopUsersDTO } from './top-users.dto';

export class PaginatedUsersDTO {
  @Expose()
  @Type(() => TopUsersDTO)
  data: TopUsersDTO[];

  @Expose()
  nextCursor: number | null;
}