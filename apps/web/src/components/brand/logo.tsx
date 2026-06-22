import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-[10px] bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm",
        className
      )}
    >
      <svg viewBox="0 0 64 64" className="h-[62%] w-[62%]" fill="none">
        <path
          d="M20 16h13.5c6 0 10 3.6 10 9 0 4-2.3 7-6 8.2L45 48h-7.6l-6.7-13.4H27V48h-7V16Zm7 13.6h6c2.6 0 4.2-1.4 4.2-3.7 0-2.2-1.6-3.6-4.2-3.6h-6v7.3Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  to = "/",
  showText = true,
}: {
  className?: string;
  to?: string;
  showText?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn("group flex items-center gap-2.5 font-display", className)}
    >
      <LogoMark className="h-8 w-8 transition-transform group-hover:scale-105" />
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Resource<span className="text-primary">Vault</span>
        </span>
      )}
    </Link>
  );
}
