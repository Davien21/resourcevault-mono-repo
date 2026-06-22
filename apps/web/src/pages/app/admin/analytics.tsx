import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileStack,
  ClipboardCheck,
  Download,
  TrendingUp,
  CheckCircle2,
  Upload,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { ActivityItem } from "@resourcevault/types";
import { api } from "@/lib/api";
import { PageHeader, StatCard } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceRow } from "@/components/resource/resource-row";
import { formatNumber, timeAgo, RESOURCE_TYPE_META } from "@/lib/utils";

export function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: api.analytics,
  });

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title="Analytics" description="A health check on your library." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const maxCategory = Math.max(...data.byCategory.map((c) => c.count), 1);
  const typeEntries = Object.entries(data.byType).sort((a, b) => b[1] - a[1]);
  const maxType = Math.max(...typeEntries.map(([, n]) => n), 1);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="A real-time health check on your resource library."
        action={
          data.pendingReview > 0 ? (
            <Button asChild variant="gradient">
              <Link to="/app/admin/review">
                <ClipboardCheck className="h-4 w-4" /> Review {data.pendingReview} pending
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total members" value={data.totalUsers} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Resources" value={data.totalResources} icon={<FileStack className="h-5 w-5" />} accent="#0d9488" />
        <StatCard label="Pending review" value={data.pendingReview} icon={<ClipboardCheck className="h-5 w-5" />} accent="#d97706" />
        <StatCard label="Total downloads" value={formatNumber(data.totalDownloads)} icon={<Download className="h-5 w-5" />} accent="#db2777" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* By category */}
        <div className="surface p-6">
          <h3 className="mb-5 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" /> Published by category
          </h3>
          <div className="space-y-3.5">
            {data.byCategory.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">{cat.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(cat.count / maxCategory) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By status + type */}
        <div className="space-y-6">
          <div className="surface p-6">
            <h3 className="mb-4 font-semibold">Lifecycle status</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatusPill label="Published" value={data.byStatus.published} tone="bg-success/12 text-success" />
              <StatusPill label="Pending" value={data.byStatus.pending} tone="bg-warning/15 text-warning" />
              <StatusPill label="Draft" value={data.byStatus.draft} tone="bg-muted text-muted-foreground" />
              <StatusPill label="Archived" value={data.byStatus.archived} tone="bg-muted text-muted-foreground" />
            </div>
          </div>
          <div className="surface p-6">
            <h3 className="mb-4 font-semibold">By resource type</h3>
            <div className="space-y-2.5">
              {typeEntries.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-20 text-sm capitalize text-muted-foreground">
                    {RESOURCE_TYPE_META[type]?.label ?? type}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / maxType) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Top resources */}
        <div>
          <h3 className="mb-4 font-semibold">Most downloaded</h3>
          <div className="space-y-3">
            {data.topResources.map((r) => (
              <ResourceRow key={r.id} resource={r} />
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="surface h-fit p-6">
          <h3 className="mb-4 font-semibold">Recent activity</h3>
          <ul className="space-y-4">
            {data.recentActivity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${tone}`}>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}

const ACTIVITY_ICON: Record<string, typeof CheckCircle2> = {
  resource_published: CheckCircle2,
  resource_submitted: Upload,
  resource_approved: CheckCircle2,
  resource_rejected: XCircle,
  user_joined: UserPlus,
  resource_downloaded: Download,
};

const ACTIVITY_VERB: Record<string, string> = {
  resource_published: "published",
  resource_submitted: "submitted",
  resource_approved: "approved",
  resource_rejected: "sent back",
  user_joined: "joined",
  resource_downloaded: "downloaded",
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = ACTIVITY_ICON[item.type] ?? CheckCircle2;
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 text-sm">
        <p className="leading-snug">
          <span className="font-medium">{item.actor}</span>{" "}
          {ACTIVITY_VERB[item.type] ?? "updated"}{" "}
          {item.target && <span className="text-muted-foreground">"{item.target}"</span>}
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
      </div>
    </li>
  );
}
