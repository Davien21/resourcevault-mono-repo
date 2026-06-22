import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Library", to: "/library" },
  { label: "Categories", to: "/library?view=categories" },
  { label: "Docs", to: "/docs" },
];

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && item.to === "/docs" && "text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          {!loading && isAuthenticated && <UserMenu />}
          {!loading && !isAuthenticated && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to="/register">Create free account</Link>
              </Button>
            </div>
          )}
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-2 flex flex-col gap-2">
                <Button asChild variant="outline">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="gradient">
                  <Link to="/register">Create free account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
