import { Router } from "express";
import { validate } from "../../middlewares/validate.ts";
import { requireAuth } from "../../middlewares/auth.ts";
import { loginSchema, registerSchema } from "./auth.validators.ts";
import { login, logout, me, register } from "./auth.controller.ts";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
