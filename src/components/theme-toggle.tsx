"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        className="group inline-flex items-center justify-center rounded-full border border-black/10 p-2 dark:border-white/10"
      >
        <Moon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="group inline-flex items-center justify-center rounded-full border border-black/10 p-2 dark:border-white/10"
    >
      {isDark ? (
        <Sun
          className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
          aria-hidden="true"
        />
      ) : (
        <Moon
          className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45"
          aria-hidden="true"
        />
      )}
    </button>
  );
}