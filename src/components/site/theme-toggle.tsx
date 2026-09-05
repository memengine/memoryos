"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — switches between dark (default) and light mode.
 * Uses next-themes. Renders a compact icon button.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const current = mounted ? (theme === "system" ? resolvedTheme : theme) : "dark";
  const isDark = current === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-white/[0.05] transition-colors",
        className
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        // SSR placeholder to avoid hydration mismatch
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
