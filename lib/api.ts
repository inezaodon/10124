export type Project = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
};

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";
const DEVTO_USERNAME = process.env.NEXT_PUBLIC_DEVTO_USERNAME || "inezaodon";
const LANYARD_ID = process.env.NEXT_PUBLIC_DISCORD_ID || "";

async function fetchJson<T>(url: string, revalidateSeconds = 300): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: revalidateSeconds },
    headers: { Accept: "application/vnd.github+json" }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${url}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubProjects(): Promise<Project[]> {
  const repos = await fetchJson<Project[]>(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`
  );

  return repos.filter((repo) => !repo.name.toLowerCase().includes("config"));
}

export async function getDiscordPresence() {
  if (!LANYARD_ID) return null;
  return fetchJson<{ data: { discord_status: string; listening_to_spotify: boolean; spotify?: { song: string; artist: string } } }>(
    `https://api.lanyard.rest/v1/users/${LANYARD_ID}`,
    45
  );
}

export async function getDevtoPosts() {
  return fetchJson<Array<{ id: number; title: string; url: string; published_at: string }>>(
    `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=5`,
    900
  );
}

export function techIconMap(stack: Array<string | null | undefined>) {
  const map: Record<string, string> = {
    typescript: "devicon-typescript-plain",
    javascript: "devicon-javascript-plain",
    python: "devicon-python-plain",
    java: "devicon-java-plain",
    react: "devicon-react-original",
    nextjs: "devicon-nextjs-original"
  };

  return stack
    .filter(Boolean)
    .map((item) => item!.toLowerCase())
    .map((item) => ({ label: item, iconClass: map[item] ?? "devicon-devicon-plain" }));
}

export function contributionsSvgUrl(username = GITHUB_USER) {
  return `https://ghchart.rshah.org/${encodeURIComponent(username)}`;
}
