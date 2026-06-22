import type {
  Category,
  PublicUser,
  ResourceDetail,
  ResourceSummary,
  Tag,
} from "@resourcevault/types";

function id(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
}

function iso(value: any): string {
  if (!value) return new Date().toISOString();
  return new Date(value).toISOString();
}

export function toPublicUser(user: any): PublicUser {
  return {
    id: id(user),
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    organisation: user.organisation,
    isVerified: Boolean(user.isVerified),
    createdAt: iso(user.createdAt),
  };
}

export function toCategory(cat: any, resourceCount?: number): Category {
  return {
    id: id(cat),
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    coverImageUrl: cat.coverImageUrl,
    resourceCount,
  };
}

export function toTag(tag: any, resourceCount?: number): Tag {
  return {
    id: id(tag),
    name: tag.name,
    slug: tag.slug,
    resourceCount,
  };
}

export function toResourceSummary(
  resource: any,
  opts: { isBookmarked?: boolean; bookmarkCount?: number } = {}
): ResourceSummary {
  const cat = resource.category ?? {};
  const owner = resource.owner ?? {};
  return {
    id: id(resource),
    title: resource.title,
    slug: resource.slug,
    summary: resource.summary,
    type: resource.type,
    status: resource.status,
    category: {
      id: id(cat),
      name: cat.name ?? "Uncategorised",
      slug: cat.slug ?? "uncategorised",
      color: cat.color ?? "#6366f1",
      icon: cat.icon ?? "folder",
    },
    tags: resource.tags ?? [],
    coverImageUrl: resource.coverImageUrl,
    version: resource.version,
    owner: {
      id: id(owner),
      name: owner.name ?? "ICPH",
      avatarUrl: owner.avatarUrl,
      title: owner.title,
    },
    isFeatured: Boolean(resource.isFeatured),
    downloadCount: resource.downloadCount ?? 0,
    viewCount: resource.viewCount ?? 0,
    bookmarkCount: opts.bookmarkCount ?? 0,
    isBookmarked: opts.isBookmarked,
    readTimeMinutes: resource.readTimeMinutes ?? 5,
    publishedAt: resource.publishedAt ? iso(resource.publishedAt) : undefined,
    updatedAt: iso(resource.updatedAt),
    createdAt: iso(resource.createdAt),
  };
}

export function toResourceDetail(
  resource: any,
  related: ResourceSummary[],
  opts: { isBookmarked?: boolean; bookmarkCount?: number } = {}
): ResourceDetail {
  return {
    ...toResourceSummary(resource, opts),
    description: resource.description,
    asset: resource.asset
      ? {
          fileName: resource.asset.fileName,
          fileUrl: resource.asset.fileUrl,
          fileType: resource.asset.fileType,
          fileSize: resource.asset.fileSize,
        }
      : undefined,
    related,
    reviewNote: resource.reviewNote,
  };
}
