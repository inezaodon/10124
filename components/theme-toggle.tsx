"use client";

import { useTheme } from "next-themes";

const THEMES = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-900">
      {THEMES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setTheme(item)}
          className={`px-3 py-1.5 text-sm font-semibold capitalize transition ${
            theme === item
              ? "bg-slate-900 text-white dark:bg-teal-500 dark:text-zinc-950"
              : "text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
