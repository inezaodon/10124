"use client";

import { useTheme } from "next-themes";

const THEMES = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex overflow-hidden rounded-xl border-2 border-violet-200/80 bg-white/80 shadow-sm dark:border-violet-500/35 dark:bg-slate-900/80">
      {THEMES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setTheme(item)}
          className={`px-3 py-1.5 text-sm font-semibold capitalize transition ${
            theme === item
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-inner"
              : "text-slate-600 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-violet-950/60"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
