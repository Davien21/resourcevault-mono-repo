import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/brand/icon";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const ICON_CHOICES = [
  "stethoscope", "users", "flask-conical", "graduation-cap",
  "landmark", "layout-template", "shield-check", "line-chart",
  "book-open", "wrench", "list-checks", "database",
];
const COLOR_CHOICES = [
  "#4f46e5", "#0ea5e9", "#0d9488", "#d97706",
  "#db2777", "#7c3aed", "#dc2626", "#059669",
];

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: ICON_CHOICES[0],
    color: COLOR_CHOICES[0],
  });
  const [busy, setBusy] = useState(false);

  const categories = data?.categories ?? [];

  const create = async () => {
    if (form.name.length < 2 || form.description.length < 10) {
      toast.error("Add a name and a longer description");
      return;
    }
    setBusy(true);
    try {
      await api.createCategory(form);
      toast.success("Category created");
      setOpen(false);
      setForm({ name: "", description: "", icon: ICON_CHOICES[0], color: COLOR_CHOICES[0] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't create category");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string, name: string) => {
    try {
      await api.deleteCategory(id);
      toast.success(`Deleted "${name}"`);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't delete category");
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organise the library into curated collections."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="h-4 w-4" /> New category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a category</DialogTitle>
                <DialogDescription>
                  Add a new collection for resources to be organised into.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Workforce Wellbeing"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="A short description of what belongs in this category."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {ICON_CHOICES.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors ${
                          form.icon === icon ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <CategoryIcon name={icon} className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Colour</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_CHOICES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm({ ...form, color })}
                        className={`h-9 w-9 rounded-lg ring-2 ring-offset-2 ring-offset-background transition-all ${
                          form.color === color ? "ring-foreground" : "ring-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="gradient" onClick={create} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="surface group flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                </span>
                <button
                  onClick={() => remove(cat.id, cat.name)}
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete ${cat.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 font-display font-semibold">{cat.name}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">
                {cat.description}
              </p>
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                {cat.resourceCount ?? 0} published resources
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
