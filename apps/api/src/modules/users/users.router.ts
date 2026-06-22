import { Router } from "express";
import { z } from "zod";
import { User, Resource } from "@resourcevault/db";
import { USER_ROLES } from "@resourcevault/types";
import { asyncHandler, parsePagination } from "../../lib/http.ts";
import { toPublicUser } from "../../lib/serialize.ts";
import { validate } from "../../middlewares/validate.ts";
import { requireAuth, requireRole } from "../../middlewares/auth.ts";
import { BadRequestError, NotFoundError } from "../../config/errors.ts";

const router = Router();

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  title: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(500).optional(),
  organisation: z.string().trim().max(120).optional(),
});

const roleSchema = z.object({ role: z.enum(USER_ROLES) });

// Update own profile
router.patch(
  "/me",
  requireAuth,
  validate(profileSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user!.id, req.body, {
      new: true,
    }).lean();
    if (!user) throw new NotFoundError();
    res.json({ user: toPublicUser(user) });
  })
);

// Admin: list users
router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { page, pageSize } = parsePagination(req.query as any);
    const q = (req.query.q as string)?.trim();
    const role = req.query.role as string;
    const filter: Record<string, unknown> = {};
    if (role && USER_ROLES.includes(role as any)) filter.role = role;
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { organisation: rx }];
    }
    const [docs, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      User.countDocuments(filter),
    ]);
    const contributions = await Resource.aggregate<{ _id: any; count: number }>([
      { $group: { _id: "$owner", count: { $sum: 1 } } },
    ]);
    const contribMap = new Map(contributions.map((c) => [String(c._id), c.count]));
    res.json({
      items: docs.map((u) => ({
        ...toPublicUser(u),
        contributions: contribMap.get(String(u._id)) ?? 0,
        lastActiveAt: u.lastActiveAt ? new Date(u.lastActiveAt).toISOString() : null,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  })
);

// Admin: change a user's role
router.patch(
  "/:id/role",
  requireAuth,
  requireRole("admin"),
  validate(roleSchema),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user!.id) {
      throw new BadRequestError("You cannot change your own role");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).lean();
    if (!user) throw new NotFoundError("User not found");
    res.json({ user: toPublicUser(user) });
  })
);

export default router;
