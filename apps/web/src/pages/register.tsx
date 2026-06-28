import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { AuthShell, AuthSwitch } from "./auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  organisation: z.string().optional(),
  password: z.string().min(8, "Use at least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const password = watch("password") ?? "";

  const onSubmit = async (values: FormValues) => {
    try {
      const { user } = await api.register(values);
      setUser(user);
      toast.success(`Welcome to ResourceVault, ${user.name.split(" ")[0]}!`);
      navigate("/library");
    } catch (err) {
      if (err instanceof ApiError && err.details?.email) {
        setError("email", { message: err.details.email[0] });
      } else {
        toast.error(err instanceof ApiError ? err.message : "Something went wrong");
      }
    }
  };

  return (
    <AuthShell
      title="Create your free account"
      subtitle="Join in seconds and explore the entire library — no approval needed."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jordan Hayes" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@organisation.org" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="organisation">
            Organisation <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="organisation" placeholder="Your team or council" {...register("organisation")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" {...register("password")} />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2
                className={`h-3.5 w-3.5 ${password.length >= 8 ? "text-success" : "text-muted-foreground/40"}`}
              />
              8+ characters
            </p>
          )}
        </div>

        <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create free account
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          New accounts join as <strong>Members</strong>, so you're in straight away.
        </p>
      </form>

      <AuthSwitch prompt="Already have an account?" linkLabel="Sign in" to="/login" />
    </AuthShell>
  );
}
