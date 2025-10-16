/**
 * Pagination utilities for API endpoints
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/**
 * Parse and validate pagination parameters
 */
export function parsePaginationParams(
  page?: string | number,
  limit?: string | number,
): { page: number; limit: number; skip: number } {
  const parsedPage = Math.max(1, Number(page) || DEFAULT_PAGE);
  const parsedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(limit) || DEFAULT_LIMIT),
  );
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
}

/**
 * Create pagination result object
 */
export function createPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Get pagination query parameters for Prisma
 */
export function getPrismaQuery(params: {
  page?: string | number;
  limit?: string | number;
  orderBy?: any;
}) {
  const { page, limit, skip } = parsePaginationParams(
    params.page,
    params.limit,
  );

  return {
    skip,
    take: limit,
    orderBy: params.orderBy || { createdAt: "desc" },
  };
}
