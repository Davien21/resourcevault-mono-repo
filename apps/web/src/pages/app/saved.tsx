import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource/resource-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

export function SavedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: api.bookmarks,
  });

  return (
    <div>
      <PageHeader
        title="Saved resources"
        description="Your personal library of bookmarked resources."
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="h-7 w-7" />}
          title="Nothing saved yet"
          description="Save resources from the library to build your own collection for quick access."
          action={
            <Button asChild>
              <Link to="/library">Browse the library</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
