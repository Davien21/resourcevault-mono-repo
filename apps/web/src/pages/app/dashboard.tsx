import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  Upload,
  ShieldCheck,
  FileStack,
  ArrowRight,
  Clock,
  ClipboardCheck,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader, StatCard } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ResourceRow } from "@/components/resource/resource-row";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_META } from "@/lib/utils";

export function DashboardPage() {
  const { user } = useAuth();
  const isContributor = user?.role === "contributor" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const { data: bookmarks } = useQuery({ queryKey: ["bookmarks"], queryFn: api.bookmarks });
  const { data: recent, isLoading } = useQuery({
    queryKey: ["recent"],
    queryFn: api.recent,
  });
  const { data: mine } = useQuery({
    queryKey: ["resources", { mine: true }],
    queryFn: () => api.resources({ mine: true, pageSize: 48 }),
    enabled: isContributor,
  });
  const { data: queue } = useQuery({
    queryKey: ["review-queue"],
    queryFn: api.reviewQueue,
    enabled: isAdmin,
  });

  const pendingMine =
    mine?.items.filter((r) => r.status === "pending").length ?? 0;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        description={ROLE_META[user?.role ?? "member"]?.description}
        action={
          <Button asChild variant="gradient">
            <Link to="/library">
              <Search className="h-4 w-4" /> Browse library
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Saved resources"
          value={bookmarks?.items.length ?? 0}
          icon={<Bookmark className="h-5 w-5" />}
          hint="In your personal library"
        />
        {isContributor && (
          <>
            <StatCard
              label="My contributions"
              value={mine?.total ?? 0}
              icon={<FileStack className="h-5 w-5" />}
              hint="Resources you own"
            />
            <StatCard
              label="Awaiting review"
              value={pendingMine}
              icon={<Clock className="h-5 w-5" />}
              accent="#d97706"
              hint="Of yours, pending"
            />
          </>
        )}
        {isAdmin && (
          <StatCard
            label="Review queue"
            value={queue?.items.length ?? 0}
            icon={<ClipboardCheck className="h-5 w-5" />}
            accent="#db2777"
            hint="Submissions to action"
          />
        )}
        {!isContributor && (
          <StatCard
            label="Your role"
            value={ROLE_META[user?.role ?? "member"]?.label}
            icon={<Search className="h-5 w-5" />}
            hint="Full library access"
          />
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <QuickAction
          to="/app/saved"
          icon={<Bookmark className="h-5 w-5" />}
          title="Your saved library"
          desc="Pick up where you left off"
        />
        {isContributor && (
          <QuickAction
            to="/app/submit"
            icon={<Upload className="h-5 w-5" />}
            title="Submit a resource"
            desc="Share knowledge with the community"
          />
        )}
        {isAdmin && (
          <QuickAction
            to="/app/admin"
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Admin console"
            desc="Analytics, review queue & members"
          />
        )}
        {!isContributor && (
          <QuickAction
            to="/docs"
            icon={<Search className="h-5 w-5" />}
            title="Help centre"
            desc="Guides for getting the most out of it"
          />
        )}
      </div>

      {/* Recently updated */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recently updated</h2>
          <Link to="/library?sort=recent" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))
            : recent?.items.slice(0, 5).map((r) => (
                <ResourceRow key={r.id} resource={r} />
              ))}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
