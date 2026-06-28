import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials, formatDate, ROLE_META } from "@/lib/utils";

interface ProfileForm {
  name: string;
  title: string;
  organisation: string;
  bio: string;
}

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? "",
      title: user?.title ?? "",
      organisation: user?.organisation ?? "",
      bio: user?.bio ?? "",
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      const { user: updated } = await api.updateProfile(data);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Your profile" description="Manage how you appear across ResourceVault." />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="surface h-fit p-6 text-center">
          <Avatar className="mx-auto h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-2xl">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 font-display text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge variant="default" className="mt-3 capitalize">
            {ROLE_META[user.role]?.label}
          </Badge>
          <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="surface space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Job title</Label>
              <Input id="title" placeholder="e.g. Health Promotion Practitioner" {...register("title")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organisation">Organisation</Label>
            <Input id="organisation" {...register("organisation")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A short bio shown on your contributions." {...register("bio")} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user.email} disabled />
            <p className="text-xs text-muted-foreground">
              Contact an administrator to change your email.
            </p>
          </div>
          <Button type="submit" variant="gradient" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
