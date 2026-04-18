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

  const formatRelativeTime = (iso: string) => {
    const ms = Date.now() - new Date(iso).getTime();
    const minutes = Math.max(1, Math.floor(ms / (1000 * 60)));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  return (
    <section className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects and stack..."
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-teal-500"
      />
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, idx) => {
          const title = projectContentMap[project.name]?.title ?? project.name;
          const liveUrl = project.homepage && /^https?:\/\//.test(project.homepage) ? project.homepage : null;
          const commitsUrl = `${project.html_url}/commits`;
          return (
            <motion.article
              layout
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group relative isolate"
            >
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-900/5 transition-all duration-300 ease-out will-change-transform group-hover:z-20 group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:border-slate-300 group-hover:shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:group-hover:border-zinc-600 dark:group-hover:shadow-black/40">
                <Link
                  href={`/projects/${project.name}`}
                  className="absolute inset-0 z-10 rounded-2xl outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-teal-500 dark:ring-offset-zinc-900"
                  aria-label={`Open ${title} project page`}
                />
                <div className="pointer-events-none relative z-0 h-44 w-full">
                  <Image
                    src={projectContentMap[project.name]?.coverImage ?? fallbackProjectContent.coverImage}
                    alt={`${title} preview`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 360px, (min-width: 768px) 48vw, 100vw"
                  />
                </div>
                <div className="pointer-events-none space-y-3 p-5">
                  <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {projectContentMap[project.name]?.shortSummary ?? project.description ?? fallbackProjectContent.shortSummary}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>Stars: {project.stargazers_count}</span>
                    <span>Forks: {project.forks_count}</span>
                    <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
                    <span>Last push: {formatRelativeTime(project.pushed_at)}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-sm">
                    <span className="font-semibold text-teal-700 dark:text-teal-400">View project</span>
                    <span className="text-slate-400" aria-hidden>
                      →
                    </span>
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto relative z-20 rounded font-medium text-slate-600 underline-offset-2 transition hover:text-teal-700 hover:underline dark:text-slate-400 dark:hover:text-teal-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pointer-events-auto relative z-20 rounded font-medium text-slate-600 underline-offset-2 transition hover:text-teal-700 hover:underline dark:text-slate-400 dark:hover:text-teal-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Live App
                      </a>
                    ) : null}
                    <a
                      href={commitsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto relative z-20 rounded font-medium text-slate-600 underline-offset-2 transition hover:text-teal-700 hover:underline dark:text-slate-400 dark:hover:text-teal-400"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Recent changes
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
