import { formatDistanceToNow, format } from "date-fns";

export { cn, gradientCss, coverGradient, RESOURCE_TYPE_META, STATUS_META, ROLE_META } from "@resourcevault/ui";

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export function formatDate(value?: string): string {
  if (!value) return "—";
  return format(new Date(value), "d MMM yyyy");
}

export function timeAgo(value?: string): string {
  if (!value) return "";
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
