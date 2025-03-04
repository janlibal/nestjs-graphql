import { InfinityPaginationResponseInput } from './dto/infinity-pagination-response.input';
import { IPaginationOptions } from './types/pagination-options';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseInput<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};