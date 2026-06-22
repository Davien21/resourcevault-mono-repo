import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "@resourcevault/types";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

/** Marketing + library shell: header, content, footer. */
export function RootLayout({ withFooter = true }: { withFooter?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      {withFooter && <SiteFooter />}
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-10 w-64" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full" />
        ))}
      </div>
    </div>
  );
}

/** Authenticated workspace shell: header + sidebar + content. */
export function WorkspaceLayout({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <FullScreenLoader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container-page flex flex-1 gap-8 py-8">
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border bg-card shadow-sm lg:block">
          <AppSidebar role={user.role} />
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
