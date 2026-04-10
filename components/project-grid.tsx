"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/api";
import { fallbackProjectContent, projectContentMap } from "@/lib/project-content";

type Props = { projects: Project[] };

export function ProjectGrid({ projects }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((project) => {
      const content = projectContentMap[project.name];
      const text = `${project.name} ${project.description ?? ""} ${project.language ?? ""} ${content?.tagline ?? ""} ${content?.shortSummary ?? ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [projects, query]);

  return (
    <section className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects and stack..."
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-teal-500"
      />
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, idx) => (
          <motion.article
            layout
            key={project.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <div className="relative h-44 w-full">
              <Image
                src={projectContentMap[project.name]?.coverImage ?? fallbackProjectContent.coverImage}
                alt={`${project.name} project cover`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 48vw, 100vw"
              />
            </div>
            <div className="space-y-3 p-5">
              <p className="text-lg font-semibold">{projectContentMap[project.name]?.title ?? project.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {projectContentMap[project.name]?.shortSummary ?? project.description ?? fallbackProjectContent.shortSummary}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Stars: {project.stargazers_count}</span>
                <span>Forks: {project.forks_count}</span>
                <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 pt-1 text-sm">
                <Link href={`/projects/${project.name}`} className="pop-link text-sm no-underline hover:underline">
                  View full project page
                </Link>
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-500 transition hover:text-teal-700 dark:hover:text-teal-400"
                >
                  GitHub
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
