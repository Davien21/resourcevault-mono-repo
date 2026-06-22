import type { FilterQuery } from "mongoose";
import { Resource, Category, Bookmark, Activity } from "@resourcevault/db";
import type {
  Paginated,
  ResourceSummary,
  ResourceDetail,
} from "@resourcevault/types";
import {
  toResourceDetail,
  toResourceSummary,
} from "../../lib/serialize.ts";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../config/errors.ts";
import type { AuthUser } from "../../middlewares/auth.ts";
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from "./resources.validators.ts";

interface ListParams {
  q?: string;
  category?: string;
  type?: string;
  tag?: string;
  status?: string;
  sort?: "recent" | "popular" | "title" | "featured";
  featured?: boolean;
  mine?: boolean;
  page?: number;
  pageSize?: number;
}

const POPULATE = [
  { path: "category", select: "name slug color icon" },
  { path: "owner", select: "name avatarUrl title" },
];

function sortClause(sort?: string): Record<string, 1 | -1> {
  switch (sort) {
    case "popular":
      return { downloadCount: -1, updatedAt: -1 };
    case "title":
      return { title: 1 };
    case "featured":
      return { isFeatured: -1, updatedAt: -1 };
    default:
      return { updatedAt: -1 };
  }
}

async function bookmarkedSet(userId?: string): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await Bookmark.find({ user: userId }).select("resource").lean();
  return new Set(rows.map((r) => String(r.resource)));
}

export async function listResources(
  params: ListParams,
  viewer?: AuthUser
): Promise<Paginated<ResourceSummary>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  const filter: FilterQuery<any> = {};

  // ---- Visibility ----
  if (params.mine && viewer) {
    filter.owner = viewer.id;
    if (params.status) filter.status = params.status;
  } else if (viewer?.role === "admin") {
    if (params.status) filter.status = params.status;
  } else {
    // Public / member / contributor browsing the library only sees published.
    filter.status = "published";
  }

  if (params.category) {
    const cat = await Category.findOne({ slug: params.category }).select("_id").lean();
    if (cat) filter.category = cat._id;
    else return emptyPage(page, pageSize);
  }
  if (params.type) filter.type = params.type;
  if (params.tag) filter.tags = params.tag;
  if (params.featured !== undefined) filter.isFeatured = params.featured;

  if (params.q) {
    const rx = new RegExp(escapeRegex(params.q), "i");
    filter.$or = [{ title: rx }, { summary: rx }, { description: rx }, { tags: rx }];
  }

  const [docs, total, marks] = await Promise.all([
    Resource.find(filter)
      .populate(POPULATE)
      .sort(sortClause(params.sort))
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Resource.countDocuments(filter),
    bookmarkedSet(viewer?.id),
  ]);

  return {
    items: docs.map((d) =>
      toResourceSummary(d, { isBookmarked: marks.has(String(d._id)) })
    ),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

function emptyPage(page: number, pageSize: number): Paginated<ResourceSummary> {
  return { items: [], total: 0, page, pageSize, totalPages: 1 };
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getResourceBySlug(
  slug: string,
  viewer?: AuthUser,
  countView = true
): Promise<ResourceDetail> {
  const doc = await Resource.findOne({ slug }).populate(POPULATE).lean();
  if (!doc) throw new NotFoundError("We couldn't find that resource");

  const isOwner = viewer && String((doc.owner as any)?._id) === viewer.id;
  const canSeeUnpublished = viewer?.role === "admin" || isOwner;
  if (doc.status !== "published" && !canSeeUnpublished) {
    throw new NotFoundError("We couldn't find that resource");
  }

  if (countView && doc.status === "published") {
    await Resource.updateOne({ _id: doc._id }, { $inc: { viewCount: 1 } });
  }

  const [related, marks, bookmarkCount] = await Promise.all([
    Resource.find({
      _id: { $ne: doc._id },
      category: (doc.category as any)?._id,
      status: "published",
    })
      .populate(POPULATE)
      .sort({ downloadCount: -1 })
      .limit(3)
      .lean(),
    bookmarkedSet(viewer?.id),
    Bookmark.countDocuments({ resource: doc._id }),
  ]);

  return toResourceDetail(
    doc,
    related.map((r) => toResourceSummary(r, { isBookmarked: marks.has(String(r._id)) })),
    { isBookmarked: marks.has(String(doc._id)), bookmarkCount }
  );
}

export async function createResource(
  input: CreateResourceInput,
  viewer: AuthUser
): Promise<ResourceDetail> {
  const category = await Category.findById(input.categoryId).lean();
  if (!category) throw new BadRequestError("Choose a valid category");

  const slug = await uniqueSlug(input.title);
  // Contributors submit straight into the review queue; admins publish on create.
  const status = viewer.role === "admin" ? "published" : "pending";

  const doc = await Resource.create({
    title: input.title,
    slug,
    summary: input.summary,
    description: input.description,
    type: input.type,
    category: category._id,
    tags: normaliseTags(input.tags),
    coverImageUrl: input.coverImageUrl || `g:${Math.floor(Math.random() * 12)}`,
    version: input.version || "1.0",
    owner: viewer.id,
    status,
    publishedAt: status === "published" ? new Date() : undefined,
    readTimeMinutes: estimateReadTime(input.description),
  });

  await Activity.create({
    type: status === "published" ? "resource_published" : "resource_submitted",
    actor: viewer.name,
    actorId: viewer.id,
    target: doc.title,
    resourceId: doc._id,
  });

  return getResourceBySlug(slug, viewer, false);
}

export async function updateResource(
  slug: string,
  input: UpdateResourceInput,
  viewer: AuthUser
): Promise<ResourceDetail> {
  const doc = await Resource.findOne({ slug });
  if (!doc) throw new NotFoundError("We couldn't find that resource");

  const isOwner = String(doc.owner) === viewer.id;
  if (!isOwner && viewer.role !== "admin") throw new ForbiddenError();

  if (input.categoryId) {
    const category = await Category.findById(input.categoryId).lean();
    if (!category) throw new BadRequestError("Choose a valid category");
    doc.category = category._id as any;
  }
  if (input.title !== undefined) doc.title = input.title;
  if (input.summary !== undefined) doc.summary = input.summary;
  if (input.description !== undefined) {
    doc.description = input.description;
    doc.readTimeMinutes = estimateReadTime(input.description);
  }
  if (input.type !== undefined) doc.type = input.type;
  if (input.tags !== undefined) doc.tags = normaliseTags(input.tags);
  if (input.version !== undefined) doc.version = input.version;
  if (input.coverImageUrl !== undefined) doc.coverImageUrl = input.coverImageUrl;

  await doc.save();
  return getResourceBySlug(doc.slug, viewer, false);
}

export async function submitForReview(slug: string, viewer: AuthUser) {
  const doc = await Resource.findOne({ slug });
  if (!doc) throw new NotFoundError("We couldn't find that resource");
  if (String(doc.owner) !== viewer.id && viewer.role !== "admin") {
    throw new ForbiddenError();
  }
  if (doc.status === "published") {
    throw new BadRequestError("This resource is already published");
  }
  doc.status = "pending";
  await doc.save();
  await Activity.create({
    type: "resource_submitted",
    actor: viewer.name,
    actorId: viewer.id,
    target: doc.title,
    resourceId: doc._id,
  });
  return getResourceBySlug(doc.slug, viewer, false);
}

export async function reviewResource(
  slug: string,
  decision: "approve" | "reject",
  note: string | undefined,
  viewer: AuthUser
) {
  const doc = await Resource.findOne({ slug });
  if (!doc) throw new NotFoundError("We couldn't find that resource");
  if (doc.status !== "pending") {
    throw new BadRequestError("Only resources awaiting review can be decided");
  }

  if (decision === "approve") {
    doc.status = "published";
    doc.publishedAt = new Date();
  } else {
    doc.status = "draft";
  }
  doc.reviewNote = note;
  doc.reviewedBy = viewer.id as any;
  await doc.save();

  await Activity.create({
    type: decision === "approve" ? "resource_approved" : "resource_rejected",
    actor: viewer.name,
    actorId: viewer.id,
    target: doc.title,
    resourceId: doc._id,
  });

  return getResourceBySlug(doc.slug, viewer, false);
}

export async function archiveResource(slug: string, viewer: AuthUser) {
  const doc = await Resource.findOne({ slug });
  if (!doc) throw new NotFoundError("We couldn't find that resource");
  if (String(doc.owner) !== viewer.id && viewer.role !== "admin") {
    throw new ForbiddenError();
  }
  doc.status = "archived";
  await doc.save();
  return getResourceBySlug(doc.slug, viewer, false);
}

export async function registerDownload(slug: string, viewer?: AuthUser) {
  const doc = await Resource.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { downloadCount: 1 } },
    { new: true }
  ).lean();
  if (!doc) throw new NotFoundError("We couldn't find that resource");
  await Activity.create({
    type: "resource_downloaded",
    actor: viewer?.name ?? "A visitor",
    actorId: viewer?.id,
    target: doc.title,
    resourceId: doc._id,
  });
  return { fileUrl: doc.asset?.fileUrl, downloadCount: doc.downloadCount };
}

// ---- helpers ----

async function uniqueSlug(title: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  let slug = base || "resource";
  let n = 1;
  while (await Resource.exists({ slug })) slug = `${base}-${n++}`;
  return slug;
}

function normaliseTags(tags: string[]): string[] {
  return [
    ...new Set(
      tags
        .map((t) => t.toLowerCase().trim().replace(/\s+/g, "-"))
        .filter(Boolean)
    ),
  ].slice(0, 8);
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}
