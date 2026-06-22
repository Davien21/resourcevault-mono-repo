import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-xl border bg-background text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {theme === "dark" ? (
            <Moon className="h-[18px] w-[18px]" />
          ) : (
            <Sun className="h-[18px] w-[18px]" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
