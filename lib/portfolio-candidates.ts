import { isExcludedPortfolioRepo } from "./portfolio-config";
import { hasValidPending, type PortfolioAllowlist } from "./portfolio-allowlist";
import { isValidRepoName } from "./portfolio-inbox-token";

export type DetectRepo = {
  name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  archived: boolean;
};

export function isConfigNamedRepo(name: string): boolean {
  return name.toLowerCase().includes("config");
}

/** Public repos that may trigger a review email (not shown until approved). */
export function findDetectCandidates(
  repos: DetectRepo[],
  allowlist: PortfolioAllowlist,
  nowMs = Date.now()
): DetectRepo[] {
  return repos.filter((repo) => {
    if (!isValidRepoName(repo.name)) return false;
    if (repo.archived) return false;
    if (isConfigNamedRepo(repo.name)) return false;
    if (isExcludedPortfolioRepo(repo.name)) return false;
    if (allowlist.approved.includes(repo.name)) return false;
    if (allowlist.hidden.includes(repo.name)) return false;
    if (hasValidPending(allowlist, repo.name, nowMs)) return false;
    return true;
  });
}
