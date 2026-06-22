import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Download,
  Clock,
  Eye,
  CalendarDays,
  Tag as TagIcon,
  ChevronRight,
  FileText,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { api, ApiError, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Markdown } from "@/components/markdown";
import { GradientCover } from "@/components/brand/gradient-cover";
import { CategoryIcon } from "@/components/brand/icon";
import { BookmarkButton } from "@/components/resource/bookmark-button";
import { ResourceCard } from "@/components/resource/resource-card";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import {
  formatDate,
  formatNumber,
  formatFileSize,
  timeAgo,
  initials,
} from "@/lib/utils";

export function ResourceDetailPage() {
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resource", slug],
    queryFn: () => api.resource(slug),
    retry: false,
  });
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={<FileText className="h-7 w-7" />}
          title="Resource not found"
          description="This resource may have been moved, archived, or you may not have access to it."
          action={
            <Button asChild>
              <Link to="/library">Back to library</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const resource = data.resource;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.download(resource.slug);
      const url = res.fileUrl?.startsWith("http")
        ? res.fileUrl
        : `${API_BASE}${res.fileUrl}`;
      window.open(url, "_blank", "noopener");
      toast.success("Download started");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't download");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="relative">
        <GradientCover
          token={resource.coverImageUrl}
          icon={resource.category.icon}
          className="h-44 w-full sm:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container-page -mt-16 sm:-mt-20">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/library" className="hover:text-foreground">Library</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={`/library?category=${resource.category.slug}`}
            className="hover:text-foreground"
          >
            {resource.category.name}
          </Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <article className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: resource.category.color }}
              >
                <CategoryIcon name={resource.category.icon} className="h-3.5 w-3.5" />
                {resource.category.name}
              </span>
              <TypeBadge type={resource.type} />
              {resource.status !== "published" && <StatusBadge status={resource.status} />}
            </div>

            <h1 className="font-display text-display-md">{resource.title}</h1>
            <p className="mt-3 text-lg leading-8 text-muted-foreground">
              {resource.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> Updated {timeAgo(resource.updatedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {resource.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4" /> {formatNumber(resource.downloadCount)} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {formatNumber(resource.viewCount)} views
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleDownload} variant="gradient" size="lg" disabled={downloading}>
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download {resource.asset ? formatFileSize(resource.asset.fileSize) : "file"}
              </Button>
              <BookmarkButton slug={resource.slug} initial={resource.isBookmarked} variant="full" />
            </div>

            <hr className="my-8" />

            <Markdown content={resource.description} />

            {/* Tags */}
            {resource.tags.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <TagIcon className="h-4 w-4" /> Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/library?tag=${tag}`}
                      className="rounded-full border px-3 py-1 text-sm font-medium capitalize text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {tag.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="surface p-5">
              <h3 className="mb-4 text-sm font-semibold">Resource details</h3>
              <dl className="space-y-3 text-sm">
                <DetailRow label="Type"><TypeBadge type={resource.type} /></DetailRow>
                <DetailRow label="Version">v{resource.version}</DetailRow>
                <DetailRow label="Status"><StatusBadge status={resource.status} /></DetailRow>
                <DetailRow label="Published">{formatDate(resource.publishedAt)}</DetailRow>
                <DetailRow label="Last updated">{formatDate(resource.updatedAt)}</DetailRow>
                {resource.asset && (
                  <DetailRow label="File">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-destructive" />
                      PDF · {formatFileSize(resource.asset.fileSize)}
                    </span>
                  </DetailRow>
                )}
              </dl>
            </div>

            <div className="surface p-5">
              <h3 className="mb-4 text-sm font-semibold">Contributed by</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={resource.owner.avatarUrl} alt={resource.owner.name} />
                  <AvatarFallback>{initials(resource.owner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{resource.owner.name}</p>
                  {resource.owner.title && (
                    <p className="text-xs text-muted-foreground">{resource.owner.title}</p>
                  )}
                </div>
              </div>
              {resource.reviewNote && resource.status === "published" && (
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-success/10 p-3 text-xs text-success">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  Reviewed and approved by the standards board.
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Related */}
        {resource.related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold">Related resources</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              More from {resource.category.name}.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resource.related.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Button asChild variant="ghost">
            <Link to="/library">
              <ArrowLeft className="h-4 w-4" /> Back to library
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="pb-20">
      <Skeleton className="h-44 w-full rounded-none sm:h-56" />
      <div className="container-page -mt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-6 h-12 w-56" />
            <div className="space-y-3 pt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
