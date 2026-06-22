import type { Request, Response } from "express";
import { asyncHandler } from "../../lib/http.ts";
import { clearAuthCookie, setAuthCookie } from "../../lib/jwt.ts";
import { getMe, loginUser, registerUser } from "./auth.service.ts";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);
  res.json(result);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ message: "Signed out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getMe(req.user!.id);
  res.json({ user });
});
