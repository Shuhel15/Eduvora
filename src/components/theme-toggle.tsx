"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="group inline-flex items-center justify-center rounded-full border border-black/10 p-2 dark:border-white/10"
    >
      <Sun className="hidden h-5 w-5 transition-transform duration-300 group-hover:rotate-45 dark:block" />

      <Moon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45 dark:hidden" />
    </button>
  );
}