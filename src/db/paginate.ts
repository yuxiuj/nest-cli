import { Repository } from 'typeorm';

export interface Pagination {
  list: any[];
  pageInfo: {
    pageCount: number;
    page: number;
    total: number;
  };
}

interface PaginateQuery {
  page: number;
  pageSize: number;
  options: object;
}

/**
 * 分页查询
 * @param query
 * @param repository
 */
export async function paginate(
  query: PaginateQuery,
  repository: Repository<any>,
): Promise<Pagination> {
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const take = query.pageSize;
  const skip = (page - 1) * query.pageSize;

  const [result, total] = await repository.findAndCount({
    ...query.options,
    take,
    skip,
  });

  return {
    list: result,
    pageInfo: {
      pageCount: Math.ceil(total / pageSize),
      page,
      total,
    },
  };
}
