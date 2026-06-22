import { Router } from "express";
import { User, Resource, Activity } from "@resourcevault/db";
import { RESOURCE_STATUSES } from "@resourcevault/types";
import { asyncHandler } from "../../lib/http.ts";
import { requireAuth, requireRole } from "../../middlewares/auth.ts";
import { toResourceSummary } from "../../lib/serialize.ts";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    const [
      totalUsers,
      totalResources,
      pendingReview,
      statusAgg,
      typeAgg,
      categoryAgg,
      downloadAgg,
      activity,
      top,
    ] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
      Resource.countDocuments({ status: "pending" }),
      Resource.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Resource.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      Resource.aggregate<{ name: string; color: string; count: number }>([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "cat",
          },
        },
        { $unwind: "$cat" },
        {
          $project: {
            _id: 0,
            name: "$cat.name",
            color: "$cat.color",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]),
      Resource.aggregate<{ _id: null; total: number }>([
        { $group: { _id: null, total: { $sum: "$downloadCount" } } },
      ]),
      Activity.find().sort({ createdAt: -1 }).limit(12).lean(),
      Resource.find({ status: "published" })
        .populate([
          { path: "category", select: "name slug color icon" },
          { path: "owner", select: "name avatarUrl title" },
        ])
        .sort({ downloadCount: -1 })
        .limit(5)
        .lean(),
    ]);

    const byStatus = Object.fromEntries(
      RESOURCE_STATUSES.map((s) => [s, 0])
    ) as Record<string, number>;
    for (const row of statusAgg) byStatus[row._id] = row.count;

    const byType: Record<string, number> = {};
    for (const row of typeAgg) byType[row._id] = row.count;

    res.json({
      totalUsers,
      totalResources,
      pendingReview,
      totalDownloads: downloadAgg[0]?.total ?? 0,
      byStatus,
      byType,
      byCategory: categoryAgg,
      recentActivity: activity.map((a) => ({
        id: String(a._id),
        type: a.type,
        actor: a.actor,
        target: a.target,
        createdAt: new Date(a.createdAt).toISOString(),
      })),
      topResources: top.map((r) => toResourceSummary(r)),
    });
  })
);

// Admin review queue (pending resources)
router.get(
  "/review-queue",
  asyncHandler(async (_req, res) => {
    const docs = await Resource.find({ status: "pending" })
      .populate([
        { path: "category", select: "name slug color icon" },
        { path: "owner", select: "name avatarUrl title" },
      ])
      .sort({ updatedAt: 1 })
      .lean();
    res.json({ items: docs.map((r) => toResourceSummary(r)) });
  })
);

export default router;
