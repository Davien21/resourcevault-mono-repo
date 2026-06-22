import { Router } from "express";
import { Resource, Category } from "@resourcevault/db";
import { asyncHandler } from "../../lib/http.ts";
import { toResourceSummary } from "../../lib/serialize.ts";

const router = Router();

const POPULATE = [
  { path: "category", select: "name slug color icon" },
  { path: "owner", select: "name avatarUrl title" },
];

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [resources, categories, contributors, downloadAgg] = await Promise.all([
      Resource.countDocuments({ status: "published" }),
      Category.countDocuments(),
      Resource.distinct("owner", { status: "published" }),
      Resource.aggregate<{ _id: null; total: number }>([
        { $match: { status: "published" } },
        { $group: { _id: null, total: { $sum: "$downloadCount" } } },
      ]),
    ]);
    res.json({
      resources,
      categories,
      contributors: contributors.length,
      downloads: downloadAgg[0]?.total ?? 0,
    });
  })
);

router.get(
  "/featured",
  asyncHandler(async (_req, res) => {
    const docs = await Resource.find({ status: "published", isFeatured: true })
      .populate(POPULATE)
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean();
    res.json({ items: docs.map((r) => toResourceSummary(r)) });
  })
);

router.get(
  "/recent",
  asyncHandler(async (_req, res) => {
    const docs = await Resource.find({ status: "published" })
      .populate(POPULATE)
      .sort({ publishedAt: -1, updatedAt: -1 })
      .limit(6)
      .lean();
    res.json({ items: docs.map((r) => toResourceSummary(r)) });
  })
);

export default router;
