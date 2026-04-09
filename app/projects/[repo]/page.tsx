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
    language: string | null;
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
    return <main className="mx-auto max-w-3xl p-10">Project not found.</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <Link href="/" className="inline-block text-sm text-brand-600 hover:underline">
        ← Back to portfolio
      </Link>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-brand-600">Project Case Study</p>
          <h1 className="text-4xl font-extrabold">{content?.title ?? project.name}</h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            {content?.tagline ?? project.description ?? "A practical software project with strong engineering focus."}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Stars: {project.stargazers_count}</span>
            <span>Forks: {project.forks_count}</span>
            <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
          <a href={project.html_url} className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90" target="_blank" rel="noreferrer">
            View Source on GitHub
          </a>
        </div>

        <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
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
        <article className="rounded-2xl border border-slate-200 p-5 lg:col-span-2 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Full Project Description</h2>
          <div className="mt-4 space-y-4 text-slate-700 dark:text-slate-300">
            {(content?.fullDescription ?? [project.description ?? "Description coming soon."]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h3 className="text-xl font-bold">Highlights</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {(content?.highlights ?? ["Implemented project features with clear engineering goals."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="pt-2 text-xl font-bold">Tech Used</h3>
          <ul className="flex flex-wrap gap-2">
            {(content?.stack ?? [project.language ?? "Software Engineering"]).map((tool) => (
              <li key={tool} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
                {tool}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <Image
            src={content?.galleryImage ?? "/project-covers/default.svg"}
            alt={`${project.name} supporting visual`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-500/10 via-sky-500/10 to-violet-500/10 p-6 dark:border-slate-800">
          <h3 className="text-xl font-bold">Why this project matters</h3>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {content?.shortSummary ?? "This project demonstrates practical thinking, implementation depth, and the ability to ship meaningful software."}
          </p>
        </div>
      </section>
    </main>
  );
}
