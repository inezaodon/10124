"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/magnetic-button";

const links = [
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
  { href: "#gallery", label: "Gallery" },
  { href: "#papers", label: "Papers" },
  { href: "#contact", label: "Contact" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400">
            Ineza Odon
          </h1>
          <p className="mt-2 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Building useful software, shipping consistently, and solving real problems.
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <MagneticButton href="https://github.com/inezaodon">Hire / Collaborate</MagneticButton>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-xl border-2 border-violet-300/80 bg-white/80 px-3 py-2 text-violet-800 shadow-sm md:hidden dark:border-violet-500/40 dark:bg-slate-900/80 dark:text-fuchsia-200"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      <nav className="hidden flex-wrap gap-x-5 gap-y-2 md:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-slate-600 transition hover:text-transparent hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 hover:bg-clip-text dark:text-slate-300 dark:hover:from-violet-400 dark:hover:to-fuchsia-400"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {open && (
        <nav className="space-y-2 rounded-2xl border border-violet-200/60 bg-white/90 p-4 shadow-lg shadow-violet-500/10 backdrop-blur-sm md:hidden dark:border-violet-500/25 dark:bg-slate-900/90">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-violet-950/50 dark:hover:text-fuchsia-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
