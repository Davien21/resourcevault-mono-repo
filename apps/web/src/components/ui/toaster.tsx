import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/providers/theme-provider";

export function Toaster() {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border bg-card text-card-foreground shadow-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground rounded-lg",
        },
      }}
    />
  );
}
