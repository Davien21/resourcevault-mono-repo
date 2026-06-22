import { Link } from "react-router-dom";
import { Download, Clock, Star } from "lucide-react";
import type { ResourceSummary } from "@resourcevault/types";
import { GradientCover } from "@/components/brand/gradient-cover";
import { BookmarkButton } from "./bookmark-button";
import { StatusBadge } from "@/components/status-badge";
import { formatNumber, timeAgo, RESOURCE_TYPE_META } from "@/lib/utils";

export function ResourceRow({
  resource,
  showStatus = false,
}: {
  resource: ResourceSummary;
  showStatus?: boolean;
}) {
  const typeMeta = RESOURCE_TYPE_META[resource.type];
  return (
    <Link
      to={`/resources/${resource.slug}`}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:gap-5 sm:p-4"
    >
      <GradientCover
        token={resource.coverImageUrl}
        icon={resource.category.icon}
        className="hidden h-20 w-28 shrink-0 rounded-xl sm:block"
        compact
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="font-medium" style={{ color: resource.category.color }}>
            {resource.category.name}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground">{typeMeta?.label}</span>
          {resource.isFeatured && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          )}
          {showStatus && <StatusBadge status={resource.status} />}
        </div>
        <h3 className="truncate font-display text-base font-semibold transition-colors group-hover:text-primary">
          {resource.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
          {resource.summary}
        </p>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground md:flex">
        <span className="flex items-center gap-1">
          <Download className="h-3.5 w-3.5" /> {formatNumber(resource.downloadCount)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {resource.readTimeMinutes}m read
        </span>
        <span>{timeAgo(resource.updatedAt)}</span>
      </div>
      <div className="shrink-0" onClick={(e) => e.preventDefault()}>
        <BookmarkButton slug={resource.slug} initial={resource.isBookmarked} />
      </div>
    </Link>
  );
}
