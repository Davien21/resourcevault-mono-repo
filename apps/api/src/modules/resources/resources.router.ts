import { Router } from "express";
import { validate } from "../../middlewares/validate.ts";
import { requireAuth, requireRole } from "../../middlewares/auth.ts";
import {
  createResourceSchema,
  listQuerySchema,
  reviewSchema,
  updateResourceSchema,
} from "./resources.validators.ts";
import * as controller from "./resources.controller.ts";

const router = Router();

router.get("/", validate(listQuerySchema, "query"), controller.list);
router.post(
  "/",
  requireAuth,
  requireRole("contributor", "admin"),
  validate(createResourceSchema),
  controller.create
);

router.get("/:slug", controller.getOne);
router.patch(
  "/:slug",
  requireAuth,
  requireRole("contributor", "admin"),
  validate(updateResourceSchema),
  controller.update
);
router.post("/:slug/submit", requireAuth, controller.submit);
router.post(
  "/:slug/review",
  requireAuth,
  requireRole("admin"),
  validate(reviewSchema),
  controller.review
);
router.post("/:slug/archive", requireAuth, controller.archive);
router.post("/:slug/download", controller.download);

export default router;
