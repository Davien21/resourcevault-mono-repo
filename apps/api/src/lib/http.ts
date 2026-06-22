import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Wraps an async handler so thrown errors reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function parsePagination(query: Record<string, unknown>): {
  page: number;
  pageSize: number;
} {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(48, Math.max(1, Number(query.pageSize) || 12));
  return { page, pageSize };
}
