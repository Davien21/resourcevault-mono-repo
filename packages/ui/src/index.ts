import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Branded cover gradients. Resource & category cover images are stored as a
 * token ("g:<n>") and rendered as one of these gradients — cohesive, on-brand,
 * and impossible to render as a broken image.
 */
export const COVER_GRADIENTS: { from: string; via: string; to: string }[] = [
  { from: "#6366f1", via: "#8b5cf6", to: "#d946ef" },
  { from: "#0ea5e9", via: "#3b82f6", to: "#6366f1" },
  { from: "#0d9488", via: "#14b8a6", to: "#22d3ee" },
  { from: "#d97706", via: "#f59e0b", to: "#facc15" },
  { from: "#db2777", via: "#ec4899", to: "#f472b6" },
  { from: "#7c3aed", via: "#8b5cf6", to: "#a78bfa" },
  { from: "#dc2626", via: "#ef4444", to: "#fb923c" },
  { from: "#059669", via: "#10b981", to: "#34d399" },
  { from: "#2563eb", via: "#4f46e5", to: "#7c3aed" },
  { from: "#0891b2", via: "#06b6d4", to: "#22d3ee" },
  { from: "#9333ea", via: "#c026d3", to: "#e879f9" },
  { from: "#475569", via: "#64748b", to: "#94a3b8" },
];

export function coverGradient(token: string | undefined): {
  from: string;
  via: string;
  to: string;
} {
  if (token && token.startsWith("g:")) {
    const n = parseInt(token.slice(2), 10);
    if (!Number.isNaN(n)) return COVER_GRADIENTS[n % COVER_GRADIENTS.length];
  }
  // Stable fallback derived from the token string
  let hash = 0;
  for (let i = 0; i < (token?.length ?? 0); i++) {
    hash = (hash * 31 + token!.charCodeAt(i)) >>> 0;
  }
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

export function gradientCss(token: string | undefined, angle = 135): string {
  const g = coverGradient(token);
  return `linear-gradient(${angle}deg, ${g.from} 0%, ${g.via} 50%, ${g.to} 100%)`;
}

export const RESOURCE_TYPE_META: Record<
  string,
  { label: string; icon: string }
> = {
  guide: { label: "Guide", icon: "book-open" },
  template: { label: "Template", icon: "file-text" },
  research: { label: "Research", icon: "flask-conical" },
  toolkit: { label: "Toolkit", icon: "wrench" },
  checklist: { label: "Checklist", icon: "list-checks" },
  policy: { label: "Policy", icon: "scale" },
  video: { label: "Video", icon: "play-circle" },
  dataset: { label: "Dataset", icon: "database" },
};

export const STATUS_META: Record<
  string,
  { label: string; tone: "muted" | "warning" | "success" | "destructive" }
> = {
  draft: { label: "Draft", tone: "muted" },
  pending: { label: "Pending review", tone: "warning" },
  published: { label: "Published", tone: "success" },
  archived: { label: "Archived", tone: "muted" },
};

export const ROLE_META: Record<string, { label: string; description: string }> = {
  admin: {
    label: "Admin",
    description: "Manages members, categories, and the review queue.",
  },
  contributor: {
    label: "Contributor",
    description: "Submits resources for review and maintains their own.",
  },
  member: {
    label: "Member",
    description: "Browses, searches, saves, and downloads resources.",
  },
};
