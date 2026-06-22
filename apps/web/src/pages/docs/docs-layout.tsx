import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Search, LifeBuoy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DOC_ARTICLES, DOC_SECTIONS } from "./content";
import { cn } from "@/lib/utils";

export function DocsLayout() {
  const [query, setQuery] = useState("");
  const location = useLocation();

  const filtered = useMemo(() => {
    if (!query.trim()) return DOC_ARTICLES;
    const q = query.toLowerCase();
    return DOC_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="border-t bg-muted/20">
      <div className="container-page py-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Help centre</h1>
            <p className="text-sm text-muted-foreground">
              Everything you need to get the most out of ResourceVault.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the docs…"
                className="pl-10"
              />
            </div>

            <nav className="space-y-5">
              {DOC_SECTIONS.map((section) => {
                const items = filtered.filter((a) => a.section === section);
                if (items.length === 0) return null;
                return (
                  <div key={section}>
                    <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {section}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((article) => (
                        <NavLink
                          key={article.slug}
                          to={`/docs/${article.slug}`}
                          className={({ isActive }) =>
                            cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )
                          }
                        >
                          {article.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 text-sm text-muted-foreground">
                  No articles match "{query}".
                </p>
              )}
            </nav>
          </aside>

          <div className="min-w-0">
            <div key={location.pathname} className="animate-fade-up">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
