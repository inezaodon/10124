"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

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
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">Ineza Odon</h1>
          <p className="mt-2 max-w-xl text-base text-slate-600 dark:text-zinc-400">
            Building useful software, shipping consistently, and solving real problems.
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a href="#contact" className="pop-btn-primary px-5 py-2.5 text-sm">
            Contact Me
          </a>
          <a
            href="https://github.com/inezaodon"
            target="_blank"
            rel="noreferrer"
            className="pop-btn-secondary px-5 py-2.5 text-sm"
          >
            GitHub
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 shadow-sm md:hidden dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
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
            className="text-sm font-semibold text-slate-600 transition hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {open && (
        <nav className="space-y-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-sm md:hidden dark:border-zinc-700 dark:bg-zinc-900/95">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href="#contact"
              className="pop-btn-primary px-3 py-2 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              Contact Me
            </a>
            <a
              href="https://github.com/inezaodon"
              target="_blank"
              rel="noreferrer"
              className="pop-btn-secondary px-3 py-2 text-center text-sm"
              onClick={() => setOpen(false)}
            >
              GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
