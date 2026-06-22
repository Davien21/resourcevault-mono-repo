import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Search,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  FileSearch,
} from "lucide-react";
import type { ResourceQuery, ResourceType } from "@resourcevault/types";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resource/resource-card";
import { ResourceRow } from "@/components/resource/resource-row";
import { EmptyState } from "@/components/empty-state";
import { CategoryIcon } from "@/components/brand/icon";
import { cn, RESOURCE_TYPE_META } from "@/lib/utils";

const TYPES: ResourceType[] = [
  "guide",
  "template",
  "research",
  "toolkit",
  "checklist",
  "policy",
  "video",
  "dataset",
];

export function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"grid" | "list">(
    (params.get("view") as "grid" | "list") === "list" ? "list" : "grid"
  );
  const [searchInput, setSearchInput] = useState(params.get("q") ?? "");

  const query: ResourceQuery = useMemo(
    () => ({
      q: params.get("q") || undefined,
      category: params.get("category") || undefined,
      type: (params.get("type") as ResourceType) || undefined,
      tag: params.get("tag") || undefined,
      sort: (params.get("sort") as ResourceQuery["sort"]) || "recent",
      page: Number(params.get("page")) || 1,
      pageSize: 12,
    }),
    [params]
  );

  // Debounced search → URL
  useEffect(() => {
    const handle = setTimeout(() => {
      const current = params.get("q") ?? "";
      if (searchInput !== current) updateParam("q", searchInput || null, true);
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories,
  });
  const { data: tagsData } = useQuery({ queryKey: ["tags"], queryFn: api.tags });
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["resources", query],
    queryFn: () => api.resources(query),
    placeholderData: keepPreviousData,
  });

  const categories = categoriesData?.categories ?? [];
  const topTags = (tagsData?.tags ?? []).slice(0, 14);

  function updateParam(key: string, value: string | null, resetPage = false) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        if (resetPage) next.delete("page");
        return next;
      },
      { replace: true }
    );
  }

  const activeCategory = categories.find((c) => c.slug === query.category);
  const hasFilters = Boolean(query.q || query.category || query.type || query.tag);

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md">
          {activeCategory ? activeCategory.name : "Resource library"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {activeCategory
            ? activeCategory.description
            : "Search, filter, and download verified guides, templates, research, and toolkits from across the community."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-7">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4" /> Categories
              </h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => updateParam("category", null, true)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    !query.category
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  All categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam("category", cat.slug, true)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      query.category === cat.slug
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <CategoryIcon name={cat.icon} className="h-4 w-4" style={{ color: cat.color }} />
                    <span className="flex-1 text-left">{cat.name}</span>
                    <span className="text-xs text-muted-foreground/70">
                      {cat.resourceCount ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Popular tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {topTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() =>
                      updateParam("tag", query.tag === tag.slug ? null : tag.slug, true)
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      query.tag === tag.slug
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:border-foreground/20"
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, topic, or keyword…"
                className="pl-10"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                value={query.type ?? "all"}
                onValueChange={(v) => updateParam("type", v === "all" ? null : v, true)}
              >
                <SelectTrigger className="h-10 w-[150px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {RESOURCE_TYPE_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={query.sort ?? "recent"}
                onValueChange={(v) => updateParam("sort", v, true)}
              >
                <SelectTrigger className="h-10 w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently updated</SelectItem>
                  <SelectItem value="popular">Most downloaded</SelectItem>
                  <SelectItem value="featured">Featured first</SelectItem>
                  <SelectItem value="title">Title (A–Z)</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data ? `${data.total} result${data.total === 1 ? "" : "s"}` : ""}
                </span>
                <div className="flex rounded-lg border p-0.5">
                  <button
                    onClick={() => {
                      setView("grid");
                      updateParam("view", null);
                    }}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md transition-colors",
                      view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setView("list");
                      updateParam("view", "list");
                    }}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md transition-colors",
                      view === "list" ? "bg-muted text-foreground" : "text-muted-foreground"
                    )}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {query.tag && (
                  <FilterChip label={`#${query.tag.replace(/-/g, " ")}`} onClear={() => updateParam("tag", null, true)} />
                )}
                {query.type && (
                  <FilterChip label={RESOURCE_TYPE_META[query.type].label} onClear={() => updateParam("type", null, true)} />
                )}
                {query.category && (
                  <FilterChip label={activeCategory?.name ?? query.category} onClear={() => updateParam("category", null, true)} />
                )}
                <button
                  onClick={() => {
                    setSearchInput("");
                    setParams({}, { replace: true });
                  }}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          <div className={cn(isFetching && !isLoading && "opacity-60 transition-opacity")}>
            {isLoading ? (
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ResourceCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.items.length > 0 ? (
              view === "grid" ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((r) => (
                    <ResourceCard key={r.id} resource={r} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {data.items.map((r) => (
                    <ResourceRow key={r.id} resource={r} />
                  ))}
                </div>
              )
            ) : (
              <EmptyState
                icon={<FileSearch className="h-7 w-7" />}
                title="No resources match your search"
                description="Try a different keyword, or clear your filters to see the whole library."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchInput("");
                      setParams({}, { replace: true });
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={query.page === 1}
                onClick={() => updateParam("page", String((query.page ?? 1) - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: data.totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => updateParam("page", String(page))}
                    className={cn(
                      "h-10 min-w-10 rounded-lg border px-3 text-sm font-medium transition-colors",
                      page === (query.page ?? 1)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                disabled={query.page === data.totalPages}
                onClick={() => updateParam("page", String((query.page ?? 1) + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
      {label}
      <button onClick={onClear} aria-label={`Remove ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
