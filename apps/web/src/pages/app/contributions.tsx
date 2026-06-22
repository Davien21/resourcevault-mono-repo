import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Send, Archive, ExternalLink, FileStack } from "lucide-react";
import { toast } from "sonner";
import type { ResourceStatus } from "@resourcevault/types";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { GradientCover } from "@/components/brand/gradient-cover";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo, formatNumber } from "@/lib/utils";

const TABS: { value: string; label: string; status?: ResourceStatus }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts", status: "draft" },
  { value: "pending", label: "In review", status: "pending" },
  { value: "published", label: "Published", status: "published" },
  { value: "archived", label: "Archived", status: "archived" },
];

export function ContributionsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["resources", { mine: true }],
    queryFn: () => api.resources({ mine: true, pageSize: 60 }),
  });

  const items = data?.items ?? [];

  const counts = {
    all: items.length,
    draft: items.filter((r) => r.status === "draft").length,
    pending: items.filter((r) => r.status === "pending").length,
    published: items.filter((r) => r.status === "published").length,
    archived: items.filter((r) => r.status === "archived").length,
  };

  const act = async (slug: string, action: "submit" | "archive") => {
    try {
      if (action === "submit") {
        await api.submitResource(slug);
        toast.success("Submitted for review");
      } else {
        await api.archiveResource(slug);
        toast.success("Resource archived");
      }
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    } catch {
      toast.error("Couldn't update the resource");
    }
  };

  return (
    <div>
      <PageHeader
        title="My contributions"
        description="Manage the resources you've authored and track their review status."
        action={
          <Button asChild variant="gradient">
            <Link to="/app/submit">
              <Upload className="h-4 w-4" /> Submit a resource
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1.5 rounded-full bg-muted-foreground/15 px-1.5 text-xs">
                {counts[tab.value as keyof typeof counts]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => {
          const filtered = tab.status
            ? items.filter((r) => r.status === tab.status)
            : items;
          return (
            <TabsContent key={tab.value} value={tab.value}>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<FileStack className="h-7 w-7" />}
                  title="Nothing here yet"
                  description="Resources you create will appear here once you add them."
                  action={
                    <Button asChild>
                      <Link to="/app/submit">Submit your first resource</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {filtered.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      <GradientCover
                        token={r.coverImageUrl}
                        icon={r.category.icon}
                        className="hidden h-16 w-24 shrink-0 rounded-xl sm:block"
                        compact
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <StatusBadge status={r.status} />
                          <TypeBadge type={r.type} />
                          <span className="text-xs text-muted-foreground">
                            Updated {timeAgo(r.updatedAt)}
                          </span>
                        </div>
                        <Link
                          to={`/resources/${r.slug}`}
                          className="font-display font-semibold hover:text-primary"
                        >
                          {r.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(r.downloadCount)} downloads · {formatNumber(r.viewCount)} views
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {(r.status === "draft") && (
                          <Button size="sm" variant="outline" onClick={() => act(r.slug, "submit")}>
                            <Send className="h-3.5 w-3.5" /> Submit
                          </Button>
                        )}
                        {r.status !== "archived" && (
                          <Button size="sm" variant="ghost" onClick={() => act(r.slug, "archive")}>
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/resources/${r.slug}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
