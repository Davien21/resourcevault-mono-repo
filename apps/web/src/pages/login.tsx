import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, ShieldCheck, Upload, Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@resourcevault/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { AuthShell, AuthSwitch } from "./auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

const DEMO_ACCOUNTS: {
  role: UserRole;
  email: string;
  label: string;
  desc: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    role: "admin",
    email: "admin@resourcevault.demo",
    label: "Explore as Admin",
    desc: "Review queue, members, analytics",
    icon: ShieldCheck,
  },
  {
    role: "contributor",
    email: "contributor@resourcevault.demo",
    label: "Explore as Contributor",
    desc: "Submit & manage resources",
    icon: Upload,
  },
  {
    role: "member",
    email: "member@resourcevault.demo",
    label: "Explore as Member",
    desc: "Browse, save & download",
    icon: Search,
  },
];

const DEMO_PASSWORD = "Demo1234!";

export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const from = (location.state as { from?: string })?.from;

  const finishLogin = (role: UserRole) => {
    if (from) return navigate(from, { replace: true });
    navigate(role === "member" ? "/library" : "/app");
  };

  const doLogin = async (email: string, password: string, role?: UserRole) => {
    const { user } = await api.login({ email, password });
    setUser(user);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
    finishLogin(role ?? user.role);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await doLogin(values.email, values.password);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  const exploreAs = async (role: UserRole, email: string) => {
    setPendingRole(role);
    try {
      await doLogin(email, DEMO_PASSWORD, role);
    } catch {
      toast.error("Couldn't sign in to the demo account");
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your ResourceVault account to continue."
    >
      {/* One-click demo logins */}
      <div className="rounded-2xl border bg-muted/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Instant demo access
        </p>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              disabled={Boolean(pendingRole)}
              onClick={() => exploreAs(account.role, account.email)}
              className="group flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm disabled:opacity-60"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                {pendingRole === account.role ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <account.icon className="h-5 w-5" />
                )}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{account.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {account.desc}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          All demo accounts use the password{" "}
          <code className="rounded bg-background px-1.5 py-0.5 font-mono">
            {DEMO_PASSWORD}
          </code>
        </p>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or sign in manually
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@organisation.org"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>

      <AuthSwitch
        prompt="New to ResourceVault?"
        linkLabel="Create a free account"
        to="/register"
      />
    </AuthShell>
  );
}
