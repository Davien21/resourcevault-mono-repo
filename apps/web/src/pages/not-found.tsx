import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[8rem] font-bold leading-none text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for has moved or never existed. Let's get you back to
        something useful.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="gradient">
          <Link to="/">
            <Home className="h-4 w-4" /> Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/library">
            <Search className="h-4 w-4" /> Browse the library
          </Link>
        </Button>
      </div>
    </div>
  );
}
