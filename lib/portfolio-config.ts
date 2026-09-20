/**
 * Personal GitHub repos that must NOT appear on 10124.vercel.app.
 *
 * The portfolio self-updates from the GitHub API (`getGitHubProjects` in lib/api.ts).
 * New public repos are emailed for approval and stay off the grid until confirmed
 * (`docs/portfolio-inbox.md`). Repos listed here are never emailed and never shown.
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

/**
 * CS + EE internship trackers are collapsed into one umbrella card
 * (`INTERNSHIP_UMBRELLA_SLUG`) instead of appearing as separate project cards.
 * Old `/projects/<repo>` URLs redirect to the umbrella page (see next.config.ts).
 */
export const INTERNSHIP_UMBRELLA_SLUG = "cicd-internship-page";
export const INTERNSHIP_UMBRELLA_CANONICAL_REPO = "ndpeeps_cs_internships";
export const INTERNSHIP_TRACKER_REPOS = ["ndpeeps_cs_internships", "ndpeeps_ee_internships"] as const;

const collapsedInternshipSet = new Set<string>(INTERNSHIP_TRACKER_REPOS);

export function isCollapsedInternshipRepo(repoName: string): boolean {
  return collapsedInternshipSet.has(repoName);
}
