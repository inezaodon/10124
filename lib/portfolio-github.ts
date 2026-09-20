import path from "node:path";
import {
  ALLOWLIST_PATH,
  ALLOWLIST_REVALIDATE_SECONDS,
  getAllowlistRef,
  getBundledAllowlist,
  normalizeAllowlist,
  PORTFOLIO_SITE_OWNER,
  PORTFOLIO_SITE_REPO,
  serializeAllowlist,
  type PortfolioAllowlist
} from "@/lib/portfolio-allowlist";

type FetchMode = { noStore: true } | { revalidateSeconds: number };

function githubToken(): string | null {
  const token =
    process.env.PORTFOLIO_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || "";
  return token || null;
}

export function hasGitHubWriteToken(): boolean {
  return Boolean(githubToken());
}

function githubHeaders(extra?: Record<string, string>): HeadersInit {
  const token = githubToken();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

function allowlistApiUrl(ref: string): string {
  return `https://api.github.com/repos/${PORTFOLIO_SITE_OWNER}/${PORTFOLIO_SITE_REPO}/contents/${ALLOWLIST_PATH}?ref=${encodeURIComponent(ref)}`;
}

function fetchCacheInit(mode: FetchMode): RequestInit & { next?: { revalidate: number } } {
  if ("noStore" in mode && mode.noStore) {
    return { cache: "no-store" };
  }
  const revalidateSeconds = "revalidateSeconds" in mode ? mode.revalidateSeconds : ALLOWLIST_REVALIDATE_SECONDS;
  return { next: { revalidate: revalidateSeconds } };
}

function localAllowlistFilePath(): string {
  return path.join(process.cwd(), "data", "portfolio-allowlist.json");
}

async function readLocalAllowlistFile(): Promise<PortfolioAllowlist | null> {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const { promises: fs } = await import("node:fs");
    const raw = await fs.readFile(localAllowlistFilePath(), "utf8");
    return normalizeAllowlist(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export async function fetchRemoteAllowlist(mode: FetchMode): Promise<PortfolioAllowlist | null> {
  const ref = getAllowlistRef();
  try {
    const response = await fetch(allowlistApiUrl(ref), {
      ...fetchCacheInit(mode),
      headers: {
        ...githubHeaders(),
        Accept: "application/vnd.github.raw+json"
      }
    });
    if (!response.ok) return null;
    return normalizeAllowlist((await response.json()) as unknown);
  } catch {
    return null;
  }
}

export async function getPortfolioAllowlist(): Promise<PortfolioAllowlist> {
  const remote = await fetchRemoteAllowlist({ revalidateSeconds: ALLOWLIST_REVALIDATE_SECONDS });
  if (remote) return remote;
  const local = await readLocalAllowlistFile();
  return local ?? getBundledAllowlist();
}

export async function getFreshAllowlist(): Promise<PortfolioAllowlist> {
  const remote = await fetchRemoteAllowlist({ noStore: true });
  if (remote) return remote;
  const local = await readLocalAllowlistFile();
  return local ?? getBundledAllowlist();
}

async function writeLocalAllowlist(allowlist: PortfolioAllowlist): Promise<void> {
  const { promises: fs } = await import("node:fs");
  await fs.writeFile(localAllowlistFilePath(), serializeAllowlist(allowlist), "utf8");
}

type ContentsMeta = { sha: string; content?: string };

async function getRemoteContentsMeta(ref: string): Promise<ContentsMeta | null> {
  const response = await fetch(allowlistApiUrl(ref), {
    cache: "no-store",
    headers: githubHeaders()
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub Contents GET failed (${response.status})`);
  }
  const body = (await response.json()) as { sha?: string; content?: string };
  if (!body.sha) throw new Error("GitHub Contents GET missing sha");
  return { sha: body.sha, content: body.content };
}

export type PersistResult = { ok: true; via: "github" | "local" } | { ok: false; error: string };

export async function persistAllowlist(allowlist: PortfolioAllowlist, message: string): Promise<PersistResult> {
  const serialized = serializeAllowlist(allowlist);
  const token = githubToken();

  if (token) {
    const ref = getAllowlistRef();
    const putUrl = `https://api.github.com/repos/${PORTFOLIO_SITE_OWNER}/${PORTFOLIO_SITE_REPO}/contents/${ALLOWLIST_PATH}`;
    const attempt = async (sha?: string) => {
      const payload: Record<string, string> = {
        message,
        content: Buffer.from(serialized, "utf8").toString("base64"),
        branch: ref
      };
      if (sha) payload.sha = sha;
      const response = await fetch(putUrl, {
        method: "PUT",
        cache: "no-store",
        headers: {
          ...githubHeaders({ "Content-Type": "application/json" })
        },
        body: JSON.stringify(payload)
      });
      return response;
    };

    try {
      const meta = await getRemoteContentsMeta(ref);
      let response = await attempt(meta?.sha);
      if (response.status === 409 || response.status === 422) {
        const retryMeta = await getRemoteContentsMeta(ref);
        response = await attempt(retryMeta?.sha);
      }
      if (!response.ok) {
        const detail = await response.text();
        return { ok: false, error: `GitHub Contents PUT failed (${response.status}): ${detail.slice(0, 300)}` };
      }
      return { ok: true, via: "github" };
    } catch (error) {
      const text = error instanceof Error ? error.message : "GitHub write failed";
      return { ok: false, error: text };
    }
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      await writeLocalAllowlist(allowlist);
      return { ok: true, via: "local" };
    } catch (error) {
      const text = error instanceof Error ? error.message : "Local allowlist write failed";
      return { ok: false, error: text };
    }
  }

  return {
    ok: false,
    error: "PORTFOLIO_GITHUB_TOKEN (or GITHUB_TOKEN) is required to update the allowlist in production."
  };
}
