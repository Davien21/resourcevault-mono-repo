import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { UserRole } from "@resourcevault/types";
import { env } from "../config/env.ts";

export interface TokenPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export const AUTH_COOKIE = "rv_session";

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function setAuthCookie(res: Response, token: string): void {
  const isProd = env.NODE_ENV === "production";
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}
