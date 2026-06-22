import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { RESOURCE_TYPES, type ResourceType } from "@resourcevault/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradientCover } from "@/components/brand/gradient-cover";
import { RESOURCE_TYPE_META } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(4, "Give it a clear title").max(140),
  summary: z.string().min(20, "Write a short summary (20+ chars)").max(280),
  description: z.string().min(40, "Add a fuller description (40+ chars)"),
  type: z.enum(RESOURCE_TYPES),
  categoryId: z.string().min(1, "Choose a category"),
  tags: z.string().optional(),
  version: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function SubmitPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories,
  });
  const categories = categoriesData?.categories ?? [];
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "guide", version: "1.0" },
  });

  const values = watch();
  const selectedCategory = categories.find((c) => c.id === values.categoryId);
  const isAdmin = user?.role === "admin";

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const tags = (data.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const { resource } = await api.createResource({
        title: data.title,
        summary: data.summary,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
        tags,
        version: data.version || "1.0",
      });
      toast.success(
        isAdmin ? "Resource published" : "Submitted for review — an admin will approve it shortly"
      );
      navigate(`/resources/${resource.slug}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't submit the resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Submit a resource"
        description={
          isAdmin
            ? "As an admin, your resources are published immediately."
            : "Your submission enters the review queue. An admin will approve it before it's published."
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field label="Title" error={errors.title?.message}>
            <Input placeholder="e.g. Falls Prevention Assessment Pathway" {...register("title")} />
          </Field>

          <Field label="Summary" error={errors.summary?.message} hint="One or two sentences shown on cards and search results.">
            <Textarea
              className="min-h-[80px]"
              placeholder="A short, specific description of what this resource is and who it helps."
              {...register("summary")}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Type" error={errors.type?.message}>
              <Select
                defaultValue="guide"
                onValueChange={(v) => setValue("type", v as ResourceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {RESOURCE_TYPE_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Category" error={errors.categoryId?.message}>
              <Select onValueChange={(v) => setValue("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Description" error={errors.description?.message} hint="Markdown supported: use ## headings and - bullet points.">
            <Textarea
              className="min-h-[220px] font-mono text-[13px]"
              placeholder={"Explain what's inside, who it's for, and how to use it.\n\n## What's inside\n- ...\n\n## Who it's for\n..."}
              {...register("description")}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tags" hint="Comma-separated, e.g. immunisation, primary-care">
              <Input placeholder="immunisation, primary-care" {...register("tags")} />
            </Field>
            <Field label="Version">
              <Input placeholder="1.0" {...register("version")} />
            </Field>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="gradient" size="lg" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isAdmin ? "Publish resource" : "Submit for review"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Info className="h-3.5 w-3.5" /> Live preview
          </p>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <GradientCover
              token={`g:${(selectedCategory ? categories.indexOf(selectedCategory) : 0) % 12}`}
              icon={selectedCategory?.icon ?? "folder"}
              label={RESOURCE_TYPE_META[values.type ?? "guide"]?.label}
              className="aspect-[16/9] w-full"
            />
            <div className="p-5">
              <p className="text-xs font-medium text-primary">
                {selectedCategory?.name ?? "Category"}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold">
                {values.title || "Your resource title"}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {values.summary || "Your summary will appear here as you type."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
