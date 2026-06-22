import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { RootLayout, WorkspaceLayout } from "@/components/layout/layouts";
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { LibraryPage } from "@/pages/library";
import { ResourceDetailPage } from "@/pages/resource-detail";
import { DocsLayout } from "@/pages/docs/docs-layout";
import { DocsIndexPage } from "@/pages/docs/docs-index";
import { DocArticlePage } from "@/pages/docs/doc-article";
import { DashboardPage } from "@/pages/app/dashboard";
import { SavedPage } from "@/pages/app/saved";
import { ContributionsPage } from "@/pages/app/contributions";
import { SubmitPage } from "@/pages/app/submit";
import { ProfilePage } from "@/pages/app/profile";
import { AdminAnalyticsPage } from "@/pages/app/admin/analytics";
import { AdminReviewPage } from "@/pages/app/admin/review";
import { AdminUsersPage } from "@/pages/app/admin/users";
import { AdminCategoriesPage } from "@/pages/app/admin/categories";
import { NotFoundPage } from "@/pages/not-found";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Marketing + public library */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<DocsIndexPage />} />
            <Route path=":slug" element={<DocArticlePage />} />
          </Route>
        </Route>

        {/* Auth (no footer) */}
        <Route element={<RootLayout withFooter={false} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Authenticated workspace */}
        <Route path="/app" element={<WorkspaceLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Contributor + admin */}
        <Route path="/app" element={<WorkspaceLayout roles={["contributor", "admin"]} />}>
          <Route path="contributions" element={<ContributionsPage />} />
          <Route path="submit" element={<SubmitPage />} />
        </Route>

        {/* Admin only */}
        <Route path="/app/admin" element={<WorkspaceLayout roles={["admin"]} />}>
          <Route index element={<AdminAnalyticsPage />} />
          <Route path="review" element={<AdminReviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
