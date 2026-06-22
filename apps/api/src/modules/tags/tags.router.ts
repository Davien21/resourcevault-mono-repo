import { Router } from "express";
import { Resource, Tag } from "@resourcevault/db";
import { asyncHandler } from "../../lib/http.ts";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tags = await Tag.find().sort({ name: 1 }).lean();
    const counts = await Resource.aggregate<{ _id: string; count: number }>([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id, c.count]));
    res.json({
      tags: tags
        .map((t) => ({
          id: String(t._id),
          name: t.name,
          slug: t.slug,
          resourceCount: countMap.get(t.slug) ?? 0,
        }))
        .sort((a, b) => b.resourceCount - a.resourceCount),
    });
  })
);

export default router;
