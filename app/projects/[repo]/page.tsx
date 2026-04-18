import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projectContentMap } from "@/lib/project-content";

type Props = { params: Promise<{ repo: string }> };

async function getRepo(repo: string) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/vnd.github+json" }
  });

  if (!response.ok) return null;
  return response.json() as Promise<{
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    pushed_at: string;
    language: string | null;
    homepage: string | null;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { repo } = await params;
  const project = await getRepo(repo);
  const content = projectContentMap[repo];

  return {
    title: content?.title ?? (project ? `${project.name} | Project Details` : "Project Not Found"),
    description: content?.shortSummary ?? project?.description ?? "Project details and metrics"
  };
}

export default async function ProjectPage({ params }: Props) {
  const { repo } = await params;
  const project = await getRepo(repo);
  const content = projectContentMap[repo];

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl p-10">
        <p className="text-slate-600 dark:text-slate-300">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-6xl space-y-10 px-6 py-10">
      <Link
        href="/"
        className="inline-block text-sm font-semibold text-slate-600 transition hover:text-teal-700 hover:underline dark:text-zinc-400 dark:hover:text-teal-400"
      >
        ← Back to portfolio
      </Link>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="pop-kicker">Project Case Study</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
            {content?.title ?? project.name}
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {content?.tagline ?? project.description ?? "A practical software project with strong engineering focus."}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Stars: {project.stargazers_count}</span>
            <span>Forks: {project.forks_count}</span>
            <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
            <span>Last push: {new Date(project.pushed_at).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={project.html_url} className="pop-btn-primary" target="_blank" rel="noreferrer">
              View Source on GitHub
            </a>
            {liveUrl ? (
              <a href={liveUrl} className="pop-btn-secondary" target="_blank" rel="noreferrer">
                Open Live Deployment
              </a>
            ) : null}
          </div>
        </div>

        <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/10 dark:border-zinc-700 dark:shadow-black/30">
          <Image
            src={content?.coverImage ?? "/project-covers/default.svg"}
            alt={`${project.name} hero visual`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 560px, 100vw"
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <article className="pop-glass-soft p-6 lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Full Project Description</h2>
          <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
            {(content?.fullDescription ?? [project.description ?? "Description coming soon."]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="pop-glass-soft space-y-4 p-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Highlights</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {(content?.highlights ?? ["Implemented project features with clear engineering goals."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="pt-2 text-xl font-bold">Tech Used</h3>
          <ul className="flex flex-wrap gap-2">
            {(content?.stack ?? [project.language ?? "Software Engineering"]).map((tool) => (
              <li
                key={tool}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {tool}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-700">
          <Image
            src={content?.galleryImage ?? "/project-covers/default.svg"}
            alt={`${project.name} supporting visual`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-6 shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Why this project matters</h3>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {content?.shortSummary ?? "This project demonstrates practical thinking, implementation depth, and the ability to ship meaningful software."}
          </p>
        </div>
      </section>
    </main>
  );
}
