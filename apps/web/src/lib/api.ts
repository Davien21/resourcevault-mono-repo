import type {
  AdminAnalytics,
  AuthResponse,
  Category,
  LibraryStats,
  LoginPayload,
  Paginated,
  PublicUser,
  RegisterPayload,
  ResourceDetail,
  ResourceQuery,
  ResourceSummary,
  Tag,
  UserRole,
} from "@resourcevault/types";

export const API_BASE =
  process.env.PUBLIC_API_BASE_URL || "http://localhost:4000";
const API = `${API_BASE}/api/v1`;

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string[]>;
  constructor(
    status: number,
    message: string,
    code?: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message || "Something went wrong",
      data?.code,
      data?.details
    );
  }
  return data as T;
}

function qs(query: Record<string, unknown> = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const str = params.toString();
  return str ? `?${str}` : "";
}

export const api = {
  // ---- auth ----
  register: (payload: RegisterPayload) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: PublicUser }>("/auth/me"),
  updateProfile: (payload: Partial<PublicUser>) =>
    request<{ user: PublicUser }>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // ---- meta ----
  stats: () => request<LibraryStats>("/meta/stats"),
  featured: () => request<{ items: ResourceSummary[] }>("/meta/featured"),
  recent: () => request<{ items: ResourceSummary[] }>("/meta/recent"),

  // ---- catalog ----
  categories: () => request<{ categories: Category[] }>("/categories"),
  tags: () => request<{ tags: Tag[] }>("/tags"),

  // ---- resources ----
  resources: (query: ResourceQuery = {}) =>
    request<Paginated<ResourceSummary>>(
      `/resources${qs(query as Record<string, unknown>)}`
    ),
  resource: (slug: string) =>
    request<{ resource: ResourceDetail }>(`/resources/${slug}`),
  createResource: (payload: unknown) =>
    request<{ resource: ResourceDetail }>("/resources", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateResource: (slug: string, payload: unknown) =>
    request<{ resource: ResourceDetail }>(`/resources/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  submitResource: (slug: string) =>
    request<{ resource: ResourceDetail }>(`/resources/${slug}/submit`, {
      method: "POST",
    }),
  reviewResource: (slug: string, decision: "approve" | "reject", note?: string) =>
    request<{ resource: ResourceDetail }>(`/resources/${slug}/review`, {
      method: "POST",
      body: JSON.stringify({ decision, note }),
    }),
  archiveResource: (slug: string) =>
    request<{ resource: ResourceDetail }>(`/resources/${slug}/archive`, {
      method: "POST",
    }),
  download: (slug: string) =>
    request<{ fileUrl: string; downloadCount: number }>(
      `/resources/${slug}/download`,
      { method: "POST" }
    ),

  // ---- bookmarks ----
  bookmarks: () => request<{ items: ResourceSummary[] }>("/bookmarks"),
  toggleBookmark: (slug: string) =>
    request<{ bookmarked: boolean }>(`/bookmarks/${slug}/toggle`, {
      method: "POST",
    }),

  // ---- admin ----
  analytics: () => request<AdminAnalytics>("/admin/analytics"),
  reviewQueue: () => request<{ items: ResourceSummary[] }>("/admin/review-queue"),
  users: (query: { q?: string; role?: UserRole; page?: number } = {}) =>
    request<
      Paginated<PublicUser & { contributions: number; lastActiveAt: string | null }>
    >(`/users${qs(query)}`),
  setUserRole: (id: string, role: UserRole) =>
    request<{ user: PublicUser }>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  createCategory: (payload: unknown) =>
    request<{ category: Category }>("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteCategory: (id: string) =>
    request<{ message: string }>(`/categories/${id}`, { method: "DELETE" }),
};
