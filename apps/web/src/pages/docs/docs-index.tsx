import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { DOC_ARTICLES, DOC_SECTIONS } from "./content";
import { CategoryIcon } from "@/components/brand/icon";

export function DocsIndexPage() {
  return (
    <div>
      <div className="surface mb-8 overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground">
          <h2 className="font-display text-2xl font-bold">How can we help?</h2>
          <p className="mt-2 max-w-lg text-primary-foreground/85">
            Browse the guides below, or use the search to jump straight to an answer.
            New here? Start with <strong>Getting started</strong>.
          </p>
        </div>
      </div>

      {DOC_SECTIONS.map((section) => {
        const items = DOC_ARTICLES.filter((a) => a.section === section);
        return (
          <div key={section} className="mb-10">
            <h3 className="mb-4 font-display text-lg font-semibold">{section}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((article) => (
                <Link
                  key={article.slug}
                  to={`/docs/${article.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CategoryIcon name={article.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold transition-colors group-hover:text-primary">
                      {article.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
