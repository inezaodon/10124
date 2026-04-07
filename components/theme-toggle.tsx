"use client";

import { useTheme } from "next-themes";

const THEMES = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700">
      {THEMES.map((item) => (
        <button
          key={item}
          onClick={() => setTheme(item)}
          className={`px-3 py-1 text-sm capitalize transition ${
            theme === item ? "bg-brand-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
