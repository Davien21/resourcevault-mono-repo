import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark,
  Upload,
  FileStack,
  User as UserIcon,
  Shield,
  Users,
  FolderTree,
  ClipboardCheck,
  Library,
} from "lucide-react";
import type { UserRole } from "@resourcevault/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  roles?: UserRole[];
}

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", to: "/app", icon: LayoutDashboard, end: true },
      { label: "Saved resources", to: "/app/saved", icon: Bookmark },
      { label: "Browse library", to: "/library", icon: Library },
    ],
  },
  {
    title: "Contribute",
    items: [
      {
        label: "My contributions",
        to: "/app/contributions",
        icon: FileStack,
        roles: ["contributor", "admin"],
      },
      {
        label: "Submit a resource",
        to: "/app/submit",
        icon: Upload,
        roles: ["contributor", "admin"],
      },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Analytics", to: "/app/admin", icon: Shield, end: true, roles: ["admin"] },
      { label: "Review queue", to: "/app/admin/review", icon: ClipboardCheck, roles: ["admin"] },
      { label: "Members", to: "/app/admin/users", icon: Users, roles: ["admin"] },
      { label: "Categories", to: "/app/admin/categories", icon: FolderTree, roles: ["admin"] },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", to: "/app/profile", icon: UserIcon }],
  },
];

export function AppSidebar({ role }: { role: UserRole }) {
  return (
    <nav className="flex flex-col gap-6 p-4">
      {SECTIONS.map((section) => {
        const items = section.items.filter(
          (item) => !item.roles || item.roles.includes(role)
        );
        if (items.length === 0) return null;
        return (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
