import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark,
  User as UserIcon,
  Shield,
  LogOut,
  Upload,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";
import { initials, ROLE_META } from "@/lib/utils";

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border bg-background py-1 pl-1 pr-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-7 w-7">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden font-medium sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2.5 py-2">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <Badge variant="default" className="mt-2 capitalize">
            {ROLE_META[user.role]?.label ?? user.role}
          </Badge>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/app">
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app/saved">
            <Bookmark /> Saved resources
          </Link>
        </DropdownMenuItem>
        {(user.role === "contributor" || user.role === "admin") && (
          <DropdownMenuItem asChild>
            <Link to="/app/submit">
              <Upload /> Submit a resource
            </Link>
          </DropdownMenuItem>
        )}
        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/app/admin">
              <Shield /> Admin console
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/app/profile">
            <UserIcon /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
