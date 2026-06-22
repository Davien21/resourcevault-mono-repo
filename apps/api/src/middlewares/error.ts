import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../config/errors.ts";
import { logger } from "../config/logger.ts";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  // Duplicate key from MongoDB
  if (typeof err === "object" && err && (err as any).code === 11000) {
    res.status(409).json({ message: "That already exists", code: "conflict" });
    return;
  }

  logger.error("Unhandled error", err);
  res.status(500).json({
    message: "Something went wrong on our end. Please try again.",
    code: "internal_error",
  });
}
