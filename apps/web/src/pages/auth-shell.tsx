import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const HIGHLIGHTS = [
  "64 seeded resources across 8 categories",
  "Full admin, contributor & member roles",
  "Real downloads, search, and review workflow",
];

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-display-md">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary to-accent lg:block">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Logo to="/" className="[&_span]:text-white [&_.text-primary]:text-white/80" />
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">
              The resource library your members actually use.
            </h2>
            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-primary-foreground/70">
            A demonstration product for the Institute for Community &amp; Public Health.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthSwitch({
  prompt,
  linkLabel,
  to,
}: {
  prompt: string;
  linkLabel: string;
  to: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link to={to} className="font-semibold text-primary hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}
