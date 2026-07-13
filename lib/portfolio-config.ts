/**
 * Personal GitHub repos that must NOT appear on 10124.vercel.app.
 *
 * The portfolio self-updates from the GitHub API (`getGitHubProjects` in lib/api.ts).
 * New repos are picked up automatically — add any personal/non-showcase repo here
 * so it stays hidden from the project grid and detail pages.
 */
export const PERSONAL_REPOS_EXCLUDED_FROM_PORTFOLIO = [
  "funcomp_homeworks", // course homework — not portfolio work
  "cheatsheet", // personal reference notes
  "inezaodon", // GitHub profile repo
  "10124" // this portfolio site itself
] as const;

export type ExcludedPortfolioRepo = (typeof PERSONAL_REPOS_EXCLUDED_FROM_PORTFOLIO)[number];

const excludedRepoSet = new Set<string>(PERSONAL_REPOS_EXCLUDED_FROM_PORTFOLIO);

export function isExcludedPortfolioRepo(repoName: string): boolean {
  return excludedRepoSet.has(repoName);
}
