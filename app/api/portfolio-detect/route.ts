import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { runPortfolioDetect, type DetectRepo } from "@/lib/portfolio-detect";
import { getFreshAllowlist } from "@/lib/portfolio-github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";

async function listPublicRepos(): Promise<DetectRepo[]> {
  const token = process.env.PORTFOLIO_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=created&direction=desc&per_page=100`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  if (!response.ok) {
    throw new Error(`GitHub repos list failed (${response.status})`);
  }
  const body = (await response.json()) as DetectRepo[];
  return body.map((repo) => ({
    name: repo.name,
    description: repo.description ?? null,
    html_url: repo.html_url,
    created_at: repo.created_at,
    archived: Boolean(repo.archived)
  }));
}

async function handle(request: Request): Promise<NextResponse> {
  const auth = isAuthorizedCronRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const dryRun = new URL(request.url).searchParams.get("dry") === "1";

  try {
    const [repos, allowlist] = await Promise.all([listPublicRepos(), getFreshAllowlist()]);
    const result = await runPortfolioDetect(repos, allowlist, { dryRun });
    return NextResponse.json({
      ok: true,
      dryRun,
      skipped: result.skipped ?? null,
      candidates: result.candidates,
      results: result.results
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Detect failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
