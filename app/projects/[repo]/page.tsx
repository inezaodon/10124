import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isRepoApprovedForPortfolio } from "@/lib/portfolio-allowlist";
import { getPortfolioAllowlist } from "@/lib/portfolio-github";
import { INTERNSHIP_UMBRELLA_SLUG, isCollapsedInternshipRepo, isExcludedPortfolioRepo } from "@/lib/portfolio-config";
import {
  projectContentMap,
  resolveGitHubRepoName,
  type ProjectGalleryImage
} from "@/lib/project-content";

type Props = { params: Promise<{ repo: string }> };

async function getRepo(repo: string) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";
  const githubRepo = resolveGitHubRepoName(repo);
  const response = await fetch(`https://api.github.com/repos/${username}/${githubRepo}`, {
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
  if (isExcludedPortfolioRepo(repo)) {
    return { title: "Project Not Found" };
  }
  if (isCollapsedInternshipRepo(repo)) {
    return { title: "CI/CD Self-Updating Internship Page" };
  }
  const allowlist = await getPortfolioAllowlist();
  if (!isRepoApprovedForPortfolio(repo, allowlist)) {
    return { title: "Project Not Found" };
  }
  const project = await getRepo(repo);
  const content = projectContentMap[repo];

  return {
    title: content?.title ?? (project ? `${project.name} | Project Details` : "Project Not Found"),
    description: content?.shortSummary ?? project?.description ?? "Project details and metrics"
  };
}

function Shot({ image, className }: { image: ProjectGalleryImage; className?: string }) {
  return (
    <figure className={className}>
      <div className="relative h-64 overflow-hidden rounded-3xl border border-slate-200 shadow-md shadow-slate-900/5 dark:border-zinc-700 dark:shadow-black/30 md:h-80">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover object-top"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      </div>
      {image.caption ? (
        <figcaption className="mt-2 px-1 text-sm text-slate-500 dark:text-zinc-400">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { repo } = await params;
  if (isExcludedPortfolioRepo(repo)) {
    notFound();
  }
  if (isCollapsedInternshipRepo(repo)) {
    redirect(`/projects/${INTERNSHIP_UMBRELLA_SLUG}`);
  }
  const allowlist = await getPortfolioAllowlist();
  if (!isRepoApprovedForPortfolio(repo, allowlist)) {
    notFound();
  }
  const project = await getRepo(repo);
  const content = projectContentMap[repo];

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl p-10">
        <p className="text-slate-600 dark:text-slate-300">Project not found.</p>
      </main>
    );
  }

  const liveUrl =
    content?.liveDeployUrl ??
    (project.homepage && /^https?:\/\//.test(project.homepage) ? project.homepage : null);
  const displayName = content?.title ?? project.name;
  const extras = content?.galleryImages ?? [];
  const inlineImage = extras[0];
  const midImages = extras.slice(1, 3);
  const restImages = extras.slice(3);
  const extraLinks = content?.extraLinks ?? [];
  const paragraphs = content?.fullDescription ?? [project.description ?? "Description coming soon."];

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
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{displayName}</h1>
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
          {extraLinks.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {extraLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative h-72 overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/10 dark:border-zinc-700 dark:shadow-black/30 md:h-96">
          <Image
            src={content?.coverImage ?? "/project-covers/default.svg"}
            alt={`${displayName} hero visual`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
          />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <article className="pop-glass-soft space-y-6 p-6 lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Full Project Description</h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            {paragraphs.map((paragraph, index) => (
              <div key={paragraph} className="space-y-5">
                <p>{paragraph}</p>
                {index === 0 && inlineImage ? <Shot image={inlineImage} /> : null}
              </div>
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

      {midImages.length ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Inside the live site</h2>
          <div className={`grid gap-5 ${midImages.length > 1 ? "md:grid-cols-2" : ""}`}>
            {midImages.map((image) => (
              <Shot key={image.src} image={image} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-3xl border border-slate-200 dark:border-zinc-700 md:h-80">
          <Image
            src={content?.galleryImage ?? content?.coverImage ?? "/project-covers/default.svg"}
            alt={`${displayName} supporting visual`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-6 shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Why this project matters</h3>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {content?.shortSummary ??
              "This project demonstrates practical thinking, implementation depth, and the ability to ship meaningful software."}
          </p>
          {extraLinks.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {extraLinks.map((link) => (
                <a
                  key={`matter-${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-link text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {restImages.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Gallery</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {restImages.map((image) => (
              <Shot key={image.src} image={image} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
