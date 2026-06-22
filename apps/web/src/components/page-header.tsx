import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && (
          <span
            className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"
            style={accent ? { backgroundColor: `${accent}1a`, color: accent } : undefined}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
