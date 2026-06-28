import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
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

export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const onSubmit = async (values: FormValues) => {
    try {
      const { user } = await api.login({
        email: values.email,
        password: values.password,
      });
      setUser(user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      finishLogin(user.role);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your ResourceVault account to continue."
    >
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
