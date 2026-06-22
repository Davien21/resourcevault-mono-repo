import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, ClipboardCheck, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ResourceSummary } from "@resourcevault/types";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GradientCover } from "@/components/brand/gradient-cover";
import { TypeBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { timeAgo, initials } from "@/lib/utils";

export function AdminReviewPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["review-queue"],
    queryFn: api.reviewQueue,
  });
  const [rejectTarget, setRejectTarget] = useState<ResourceSummary | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["review-queue"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    queryClient.invalidateQueries({ queryKey: ["resources"] });
  };

  const approve = async (r: ResourceSummary) => {
    setBusy(r.id);
    try {
      await api.reviewResource(r.slug, "approve");
      toast.success(`Published "${r.title}"`);
      refresh();
    } catch {
      toast.error("Couldn't approve");
    } finally {
      setBusy(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setBusy(rejectTarget.id);
    try {
      await api.reviewResource(rejectTarget.slug, "reject", note);
      toast.success("Sent back to the contributor as a draft");
      setRejectTarget(null);
      setNote("");
      refresh();
    } catch {
      toast.error("Couldn't reject");
    } finally {
      setBusy(null);
    }
  };

  const items = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Review queue"
        description="Approve submissions to publish them, or send them back with feedback."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-7 w-7" />}
          title="The queue is clear"
          description="There are no resources awaiting review right now. Nicely done."
        />
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div key={r.id} className="surface flex flex-col gap-4 p-4 md:flex-row md:items-center">
              <GradientCover
                token={r.coverImageUrl}
                icon={r.category.icon}
                className="h-20 w-full shrink-0 rounded-xl md:w-32"
                compact
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: r.category.color }}>
                    {r.category.name}
                  </span>
                  <TypeBadge type={r.type} />
                  <span className="text-xs text-muted-foreground">
                    Submitted {timeAgo(r.updatedAt)}
                  </span>
                </div>
                <Link to={`/resources/${r.slug}`} className="font-display text-lg font-semibold hover:text-primary">
                  {r.title}
                </Link>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={r.owner.avatarUrl} alt={r.owner.name} />
                    <AvatarFallback>{initials(r.owner.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{r.owner.name}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/resources/${r.slug}`}>
                    <ExternalLink className="h-3.5 w-3.5" /> Preview
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setRejectTarget(r)} disabled={busy === r.id}>
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button variant="default" size="sm" onClick={() => approve(r)} disabled={busy === r.id}>
                  {busy === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send back for changes</DialogTitle>
            <DialogDescription>
              "{rejectTarget?.title}" will return to the contributor as a draft. Add an optional note explaining what to change.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="note">Feedback (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Please add the source for the figures in section 2."
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={Boolean(busy)}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
