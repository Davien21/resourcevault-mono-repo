import type { ResourceStatus } from "@resourcevault/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_META, RESOURCE_TYPE_META } from "@/lib/utils";

export function StatusBadge({ status }: { status: ResourceStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.tone}>{meta.label}</Badge>;
}

export function TypeBadge({ type }: { type: string }) {
  const meta = RESOURCE_TYPE_META[type];
  return (
    <Badge variant="muted" className="capitalize">
      {meta?.label ?? type}
    </Badge>
  );
}
