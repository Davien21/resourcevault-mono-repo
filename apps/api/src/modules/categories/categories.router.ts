import { Router } from "express";
import { z } from "zod";
import { Category, Resource } from "@resourcevault/db";
import { asyncHandler } from "../../lib/http.ts";
import { toCategory } from "../../lib/serialize.ts";
import { validate } from "../../middlewares/validate.ts";
import { requireAuth, requireRole } from "../../middlewares/auth.ts";
import { NotFoundError } from "../../config/errors.ts";

const router = Router();

const upsertSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(10).max(280),
  icon: z.string().trim().default("folder"),
  color: z
    .string()
    .trim()
    .regex(/^#?[0-9a-fA-F]{6}$/, "Use a hex colour")
    .default("#6366f1"),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    const counts = await Resource.aggregate<{ _id: any; count: number }>([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    res.json({
      categories: categories.map((c) =>
        toCategory(c, countMap.get(String(c._id)) ?? 0)
      ),
    });
  })
);

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const color = req.body.color.startsWith("#")
      ? req.body.color
      : `#${req.body.color}`;
    const cat = await Category.create({
      ...req.body,
      color,
      slug: slugify(req.body.name),
    });
    res.status(201).json({ category: toCategory(cat, 0) });
  })
);

router.patch(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(upsertSchema.partial()),
  asyncHandler(async (req, res) => {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();
    if (!cat) throw new NotFoundError("Category not found");
    res.json({ category: toCategory(cat) });
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const inUse = await Resource.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      res
        .status(409)
        .json({ message: `Move the ${inUse} resources in this category first` });
      return;
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  })
);

export default router;
