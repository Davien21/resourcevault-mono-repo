/**
 * Shared domain + API types for ResourceVault.
 * Imported by both the API (apps/api) and the web client (apps/web)
 * so the contract between them is defined exactly once.
 */

export const USER_ROLES = ["admin", "contributor", "member"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const RESOURCE_STATUSES = [
  "draft",
  "pending",
  "published",
  "archived",
] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const RESOURCE_TYPES = [
  "guide",
  "template",
  "research",
  "toolkit",
  "checklist",
  "policy",
  "video",
  "dataset",
] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  organisation?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  coverImageUrl?: string;
  resourceCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  resourceCount?: number;
}

export interface ResourceAsset {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface ResourceSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: ResourceType;
  status: ResourceStatus;
  category: Pick<Category, "id" | "name" | "slug" | "color" | "icon">;
  tags: string[];
  coverImageUrl: string;
  version: string;
  owner: Pick<PublicUser, "id" | "name" | "avatarUrl" | "title">;
  isFeatured: boolean;
  downloadCount: number;
  viewCount: number;
  bookmarkCount: number;
  isBookmarked?: boolean;
  readTimeMinutes: number;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
}

export interface ResourceDetail extends ResourceSummary {
  description: string;
  asset?: ResourceAsset;
  related: ResourceSummary[];
  reviewNote?: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface LibraryStats {
  resources: number;
  categories: number;
  contributors: number;
  downloads: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalResources: number;
  pendingReview: number;
  totalDownloads: number;
  byStatus: Record<ResourceStatus, number>;
  byType: Record<string, number>;
  byCategory: { name: string; count: number; color: string }[];
  recentActivity: ActivityItem[];
  topResources: ResourceSummary[];
}

export interface ActivityItem {
  id: string;
  type:
    | "resource_published"
    | "resource_submitted"
    | "resource_approved"
    | "resource_rejected"
    | "user_joined"
    | "resource_downloaded";
  actor: string;
  target?: string;
  createdAt: string;
}

// ---- Request payloads ----

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organisation?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResourceQuery {
  q?: string;
  category?: string;
  type?: ResourceType;
  tag?: string;
  status?: ResourceStatus;
  sort?: "recent" | "popular" | "title" | "featured";
  featured?: boolean;
  mine?: boolean;
  owner?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateResourcePayload {
  title: string;
  summary: string;
  description: string;
  type: ResourceType;
  categoryId: string;
  tags: string[];
  version?: string;
  coverImageUrl?: string;
}

export interface ReviewDecisionPayload {
  decision: "approve" | "reject";
  note?: string;
}
