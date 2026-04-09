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
          <h1 className="text-4xl font-extrabold">Ineza Odon</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Building useful software, shipping consistently, and solving real problems.</p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <MagneticButton href="https://github.com/inezaodon">Hire / Collaborate</MagneticButton>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-lg border border-slate-300 px-3 py-2 md:hidden dark:border-slate-700"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      <nav className="hidden gap-4 md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-brand-600 dark:text-slate-300">
            {link.label}
          </a>
        ))}
      </nav>

      {open && (
        <nav className="space-y-2 rounded-xl border border-slate-200 p-3 md:hidden dark:border-slate-800">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="block text-sm" onClick={() => setOpen(false)}>
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
