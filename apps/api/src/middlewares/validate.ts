import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";
import { BadRequestError } from "../config/errors.ts";

type Source = "body" | "query" | "params";

/** Validates and replaces req[source] with the parsed, typed value. */
export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // query is a getter on some express versions — assign defensively
      (req as any)[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const key = issue.path.join(".") || "_";
          (details[key] ||= []).push(issue.message);
        }
        throw new BadRequestError("Please check the highlighted fields", details);
      }
      throw err;
    }
  };
}
