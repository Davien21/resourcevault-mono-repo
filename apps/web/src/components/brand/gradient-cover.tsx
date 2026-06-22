import { useState } from "react";
import { gradientCss, cn } from "@/lib/utils";
import { CategoryIcon } from "./icon";

interface GradientCoverProps {
  /** Either a real image URL (https://…) or a gradient token ("g:N"). */
  token?: string;
  icon?: string;
  label?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Resource / category cover artwork. Renders curated real photography when the
 * cover is an image URL, with a brand scrim for legibility. Falls back to a
 * branded gradient for generated covers ("g:N") or if an image fails to load —
 * so a cover is never blank or broken.
 */
export function GradientCover({
  token,
  icon = "folder",
  label,
  title,
  className,
  compact = false,
}: GradientCoverProps) {
  const [errored, setErrored] = useState(false);
  const isImage = Boolean(token && /^https?:\/\//.test(token)) && !errored;

  if (isImage) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <img
          src={token}
          alt={title ?? label ?? "Resource cover"}
          loading="lazy"
          onError={() => setErrored(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5" />
        {(label || title) && (
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {label && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <CategoryIcon name={icon} className="h-3.5 w-3.5" />
                {label}
              </span>
            )}
            {title && !compact && (
              <h3 className="max-w-[88%] font-display text-lg font-semibold leading-snug text-white drop-shadow">
                {title}
              </h3>
            )}
          </div>
        )}
      </div>
    );
  }

  // Generated gradient fallback
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundImage: gradientCss(token) }}
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="absolute -right-6 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/10 blur-2xl" />

      <CategoryIcon
        name={icon}
        className={cn(
          "absolute text-white/25",
          compact ? "-bottom-3 -right-2 h-20 w-20" : "-bottom-5 -right-3 h-32 w-32"
        )}
      />

      {(label || title) && (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {label && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              <CategoryIcon name={icon} className="h-3.5 w-3.5" />
              {label}
            </span>
          )}
          {title && !compact && (
            <h3 className="max-w-[85%] font-display text-lg font-semibold leading-snug text-white drop-shadow-sm">
              {title}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}
