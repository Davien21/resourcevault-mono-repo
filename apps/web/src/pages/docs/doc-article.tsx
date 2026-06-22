import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { DOC_ARTICLES, getArticle } from "./content";

export function DocArticlePage() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="surface p-10 text-center">
        <h2 className="font-display text-xl font-semibold">Article not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The help article you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-5">
          <Link to="/docs">Back to help centre</Link>
        </Button>
      </div>
    );
  }

  const index = DOC_ARTICLES.findIndex((a) => a.slug === slug);
  const prev = DOC_ARTICLES[index - 1];
  const next = DOC_ARTICLES[index + 1];

  return (
    <article className="max-w-3xl">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/docs" className="hover:text-foreground">Help centre</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{article.section}</span>
      </nav>

      <h1 className="font-display text-display-md">{article.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{article.description}</p>

      <hr className="my-7" />

      <Markdown content={article.body} />

      <div className="mt-12 grid gap-3 border-t pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/docs/${prev.slug}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="text-sm font-medium group-hover:text-primary">{prev.title}</p>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/docs/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-xl border bg-card p-4 text-right transition-colors hover:border-primary/30"
          >
            <div>
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="text-sm font-medium group-hover:text-primary">{next.title}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </article>
  );
}
