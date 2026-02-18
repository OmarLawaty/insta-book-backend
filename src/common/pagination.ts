export interface CursorPaginationQuery {
  cursor?: string | number;
  limit?: string | number;
}

export interface NormalizedCursorPaginationQuery {
  cursor?: number;
  limit: number;
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
}

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

const parsePositiveInt = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return undefined;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;

  return parsed;
};

export const normalizeCursorPaginationQuery = (
  query: CursorPaginationQuery = {},
): NormalizedCursorPaginationQuery => {
  const cursor = parsePositiveInt(query.cursor);
  const limit = parsePositiveInt(query.limit);

  return {
    cursor,
    limit: Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT),
  };
};

export const buildCursorPaginationResult = <T>(
  entities: T[],
  limit: number,
  getCursor: (item: T) => number,
): CursorPaginationResult<T> => {
  const hasMore = entities.length > limit;
  const data = hasMore ? entities.slice(0, limit) : entities;

  const hasNoMoreData = !hasMore || !data.length;
  return {
    data,
    nextCursor: hasNoMoreData ? null : getCursor(data[data.length - 1]),
  };
};
