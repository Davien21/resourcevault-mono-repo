import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@resourcevault/types";
import { User } from "@resourcevault/db";
import { AUTH_COOKIE, verifyToken } from "../lib/jwt.ts";
import { ForbiddenError, UnauthorizedError } from "../config/errors.ts";

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.[AUTH_COOKIE];
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Attaches req.user when a valid token is present; never throws. */
export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).lean();
    if (user) {
      req.user = {
        id: String(user._id),
        role: user.role as UserRole,
        email: user.email,
        name: user.name,
      };
    }
  } catch {
    // invalid/expired token — treat as anonymous
  }
  next();
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) throw new UnauthorizedError();
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role)) throw new ForbiddenError();
    next();
  };
}
