import { Link } from "react-router-dom";
import { Download, Eye, Clock, Star } from "lucide-react";
import type { ResourceSummary } from "@resourcevault/types";
import { GradientCover } from "@/components/brand/gradient-cover";
import { BookmarkButton } from "./bookmark-button";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  formatNumber,
  timeAgo,
  RESOURCE_TYPE_META,
  initials,
} from "@/lib/utils";

export function ResourceCard({
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
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative">
        <GradientCover
          token={resource.coverImageUrl}
          icon={resource.category.icon}
          label={typeMeta?.label ?? resource.type}
          className="aspect-[16/9] w-full"
        />
        <div className="absolute right-3 top-3">
          <BookmarkButton slug={resource.slug} initial={resource.isBookmarked} />
        </div>
        {resource.isFeatured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-amber-500 shadow-sm backdrop-blur">
            <Star className="h-3 w-3 fill-current" /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1.5 font-medium"
            style={{ color: resource.category.color }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: resource.category.color }}
            />
            {resource.category.name}
          </span>
          {showStatus && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <StatusBadge status={resource.status} />
            </>
          )}
        </div>

        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {resource.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {resource.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={resource.owner.avatarUrl} alt={resource.owner.name} />
              <AvatarFallback>{initials(resource.owner.name)}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-medium text-foreground">
                {resource.owner.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {timeAgo(resource.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1" title="Downloads">
              <Download className="h-3.5 w-3.5" />
              {formatNumber(resource.downloadCount)}
            </span>
            <span className="flex items-center gap-1" title="Read time">
              <Clock className="h-3.5 w-3.5" />
              {resource.readTimeMinutes}m
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between border-t pt-4">
          <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
