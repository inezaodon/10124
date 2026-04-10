"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";

function chartSrc(username: string, dark: boolean) {
  const u = encodeURIComponent(username);
  if (dark) return `https://ghchart.xqsit94.in/dark:default/${u}`;
  return `https://ghchart.xqsit94.in/${u}`;
}

export function GitHubContributions() {
  const { resolvedTheme } = useTheme();
  const src = useMemo(() => chartSrc(GITHUB_USER, resolvedTheme === "dark"), [resolvedTheme]);

  return (
    <div className="pop-glass-soft overflow-hidden p-3 dark:bg-zinc-900/80">
      {/* eslint-disable-next-line @next/next/no-img-element -- external SVG; theme-specific URL */}
      <img
        src={src}
        alt="GitHub contributions in the last year"
        className="h-auto w-full max-w-full"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
