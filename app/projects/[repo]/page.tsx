import type { Metadata } from "next";

type Props = { params: Promise<{ repo: string }> };

async function getRepo(repo: string) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";
  const response = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/vnd.github+json" }
  });

  if (!response.ok) return null;
  return response.json() as Promise<{ name: string; description: string | null; html_url: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { repo } = await params;
  const project = await getRepo(repo);

  return {
    title: project ? `${project.name} | Project Details` : "Project Not Found",
    description: project?.description ?? "Project details and metrics"
  };
}

export default async function ProjectPage({ params }: Props) {
  const { repo } = await params;
  const project = await getRepo(repo);

  if (!project) {
    return <main className="mx-auto max-w-3xl p-10">Project not found.</main>;
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-10">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="text-slate-600 dark:text-slate-300">{project.description ?? "No description."}</p>
      <a href={project.html_url} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
        Open on GitHub
      </a>
    </main>
  );
}
