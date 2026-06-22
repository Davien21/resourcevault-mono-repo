import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { USER_ROLES, type UserRole } from "@resourcevault/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { initials, timeAgo, ROLE_META } from "@/lib/utils";

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { user: current } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["users", search, roleFilter],
    queryFn: () =>
      api.users({
        q: search || undefined,
        role: roleFilter === "all" ? undefined : (roleFilter as UserRole),
      }),
  });

  const changeRole = async (id: string, role: UserRole) => {
    try {
      await api.setUserRole(id, role);
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't update role");
    }
  };

  return (
    <div>
      <PageHeader
        title="Members"
        description="Manage who has access and what they can do."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or organisation…"
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-11 w-full sm:w-48">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_META[role].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden grid-cols-[1.6fr_1fr_0.6fr_0.8fr_140px] gap-4 border-b bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
          <span>Member</span>
          <span>Organisation</span>
          <span>Resources</span>
          <span>Active</span>
          <span>Role</span>
        </div>

        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.items.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1.6fr_1fr_0.6fr_0.8fr_140px] md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatarUrl} alt={u.name} />
                    <AvatarFallback>{initials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <span className="truncate text-sm text-muted-foreground">
                  {u.organisation || "—"}
                </span>
                <span className="text-sm text-muted-foreground">{u.contributions}</span>
                <span className="text-sm text-muted-foreground">
                  {u.lastActiveAt ? timeAgo(u.lastActiveAt) : "—"}
                </span>
                {u.id === current?.id ? (
                  <Badge variant="default" className="w-fit capitalize">
                    {ROLE_META[u.role].label} (you)
                  </Badge>
                ) : (
                  <Select value={u.role} onValueChange={(v) => changeRole(u.id, v as UserRole)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_META[role].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <UsersIcon className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No members match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
