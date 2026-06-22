import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  slug,
  initial,
  variant = "icon",
  className,
}: {
  slug: string;
  initial?: boolean;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bookmarked, setBookmarked] = useState(Boolean(initial));
  const [busy, setBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast("Sign in to save resources", {
        description: "Create a free account to build your library.",
        action: { label: "Sign in", onClick: () => navigate("/login") },
      });
      return;
    }
    setBusy(true);
    const next = !bookmarked;
    setBookmarked(next);
    try {
      const res = await api.toggleBookmark(slug);
      setBookmarked(res.bookmarked);
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success(res.bookmarked ? "Saved to your library" : "Removed from saved");
    } catch {
      setBookmarked(!next);
      toast.error("Couldn't update your saved resources");
    } finally {
      setBusy(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
          bookmarked
            ? "border-primary/30 bg-primary/10 text-primary"
            : "bg-background hover:bg-muted",
          className
        )}
      >
        <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        {bookmarked ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={bookmarked ? "Remove from saved" : "Save resource"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg border bg-background/90 text-muted-foreground backdrop-blur transition-all hover:text-primary",
        bookmarked && "border-primary/30 text-primary",
        className
      )}
    >
      <Bookmark className={cn("h-[18px] w-[18px]", bookmarked && "fill-current")} />
    </button>
  );
}
