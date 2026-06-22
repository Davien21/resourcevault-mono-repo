import { Router } from "express";
import { Bookmark, Resource } from "@resourcevault/db";
import { asyncHandler } from "../../lib/http.ts";
import { requireAuth } from "../../middlewares/auth.ts";
import { toResourceSummary } from "../../lib/serialize.ts";
import { NotFoundError } from "../../config/errors.ts";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const marks = await Bookmark.find({ user: req.user!.id })
      .sort({ createdAt: -1 })
      .lean();
    const ids = marks.map((m) => m.resource);
    const resources = await Resource.find({ _id: { $in: ids } })
      .populate([
        { path: "category", select: "name slug color icon" },
        { path: "owner", select: "name avatarUrl title" },
      ])
      .lean();
    const order = new Map(ids.map((id, i) => [String(id), i]));
    const items = resources
      .map((r) => toResourceSummary(r, { isBookmarked: true }))
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    res.json({ items });
  })
);

router.post(
  "/:slug/toggle",
  asyncHandler(async (req, res) => {
    const resource = await Resource.findOne({ slug: req.params.slug })
      .select("_id")
      .lean();
    if (!resource) throw new NotFoundError("We couldn't find that resource");

    const existing = await Bookmark.findOne({
      user: req.user!.id,
      resource: resource._id,
    });
    if (existing) {
      await existing.deleteOne();
      res.json({ bookmarked: false });
    } else {
      await Bookmark.create({ user: req.user!.id, resource: resource._id });
      res.json({ bookmarked: true });
    }
  })
);

export default router;
