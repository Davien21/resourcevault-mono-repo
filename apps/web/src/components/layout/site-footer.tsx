import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Browse the library", to: "/library" },
      { label: "Categories", to: "/library?view=categories" },
      { label: "Featured resources", to: "/library?sort=featured" },
      { label: "Recently updated", to: "/library?sort=recent" },
    ],
  },
  {
    title: "Help centre",
    links: [
      { label: "Getting started", to: "/docs/getting-started" },
      { label: "Finding resources", to: "/docs/finding-resources" },
      { label: "Contributing", to: "/docs/contributing" },
      { label: "FAQ", to: "/docs/faq" },
    ],
  },
  {
    title: "Roles",
    links: [
      { label: "For members", to: "/docs/roles#member" },
      { label: "For contributors", to: "/docs/roles#contributor" },
      { label: "For admins", to: "/docs/roles#admin" },
      { label: "The review workflow", to: "/docs/workflow" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            The resource library for professional and membership organisations.
            One trusted home for the knowledge your members rely on.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ResourceVault. A demonstration product.</p>
          <p className="flex items-center gap-4">
            <span>Built for the Institute for Community &amp; Public Health</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
