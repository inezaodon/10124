"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/api";

type Props = { projects: Project[] };

export function ProjectGrid({ projects }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((project) => {
      const text = `${project.name} ${project.description ?? ""} ${project.language ?? ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [projects, query]);

  return (
    <section className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects and stack..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, idx) => (
          <motion.a
            layout
            key={project.id}
            href={project.html_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-lg font-semibold">{project.name}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.description ?? "No description provided."}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Stars: {project.stargazers_count}</span>
              <span>Forks: {project.forks_count}</span>
              <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
