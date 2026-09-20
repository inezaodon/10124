import {
  INTERNSHIP_TRACKER_REPOS,
  INTERNSHIP_UMBRELLA_SLUG
} from "./portfolio-config";
import bundledAllowlist from "../data/portfolio-allowlist.json";

export type PendingReview = {
  repo: string;
  nonce: string;
  exp: number;
};

export type PortfolioAllowlist = {
  approved: string[];
  hidden: string[];
  pending: PendingReview[];
  consumedNonces: string[];
};

export const ALLOWLIST_PATH = "data/portfolio-allowlist.json";
export const PORTFOLIO_SITE_OWNER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "inezaodon";
export const PORTFOLIO_SITE_REPO = "10124";
export const ALLOWLIST_REVALIDATE_SECONDS = 60;
const CONSUMED_NONCE_CAP = 400;

function uniqueStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (typeof value !== "string" || !value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function normalizePending(values: unknown): PendingReview[] {
  if (!Array.isArray(values)) return [];
  const out: PendingReview[] = [];
  const seen = new Set<string>();
  for (const item of values) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const repo = typeof record.repo === "string" ? record.repo : "";
    const nonce = typeof record.nonce === "string" ? record.nonce : "";
    const exp = typeof record.exp === "number" && Number.isInteger(record.exp) ? record.exp : NaN;
    if (!repo || !nonce || !Number.isFinite(exp)) continue;
    const key = `${repo}:${nonce}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ repo, nonce, exp });
  }
  return out;
}

export function emptyAllowlist(): PortfolioAllowlist {
  return { approved: [], hidden: [], pending: [], consumedNonces: [] };
}

export function normalizeAllowlist(input: unknown): PortfolioAllowlist {
  if (!input || typeof input !== "object") return emptyAllowlist();
  const record = input as Record<string, unknown>;
  return {
    approved: uniqueStrings(record.approved),
    hidden: uniqueStrings(record.hidden),
    pending: normalizePending(record.pending),
    consumedNonces: uniqueStrings(record.consumedNonces)
  };
}

export function getBundledAllowlist(): PortfolioAllowlist {
  return normalizeAllowlist(bundledAllowlist);
}

export function serializeAllowlist(allowlist: PortfolioAllowlist): string {
  const normalized = normalizeAllowlist(allowlist);
  return `${JSON.stringify(
    {
      approved: normalized.approved,
      hidden: normalized.hidden,
      pending: normalized.pending,
      consumedNonces: normalized.consumedNonces.slice(0, CONSUMED_NONCE_CAP)
    },
    null,
    2
  )}\n`;
}

export function getAllowlistRef(): string {
  return (
    process.env.PORTFOLIO_GITHUB_BRANCH?.trim() ||
    process.env.PORTFOLIO_ALLOWLIST_REF?.trim() ||
    process.env.VERCEL_GIT_COMMIT_REF?.trim() ||
    "main"
  );
}

function hasName(list: string[], name: string): boolean {
  return list.includes(name);
}

/**
 * A GitHub repo (or the synthetic internship umbrella slug) may appear on the
 * grid / detail pages only when it is approved and not hidden.
 */
export function isRepoApprovedForPortfolio(repoName: string, allowlist: PortfolioAllowlist): boolean {
  if (hasName(allowlist.hidden, repoName)) return false;

  if (repoName === INTERNSHIP_UMBRELLA_SLUG) {
    return INTERNSHIP_TRACKER_REPOS.some(
      (name) => hasName(allowlist.approved, name) && !hasName(allowlist.hidden, name)
    );
  }

  return hasName(allowlist.approved, repoName);
}

export function findPending(allowlist: PortfolioAllowlist, repo: string, nonce: string, nowMs = Date.now()): PendingReview | null {
  const nowSec = Math.floor(nowMs / 1000);
  return (
    allowlist.pending.find((item) => item.repo === repo && item.nonce === nonce && item.exp > nowSec) ?? null
  );
}

export function hasValidPending(allowlist: PortfolioAllowlist, repo: string, nowMs = Date.now()): boolean {
  const nowSec = Math.floor(nowMs / 1000);
  return allowlist.pending.some((item) => item.repo === repo && item.exp > nowSec);
}

export function pruneExpiredPending(allowlist: PortfolioAllowlist, nowMs = Date.now()): PortfolioAllowlist {
  const nowSec = Math.floor(nowMs / 1000);
  return {
    ...allowlist,
    pending: allowlist.pending.filter((item) => item.exp > nowSec)
  };
}

function withoutName(list: string[], name: string): string[] {
  return list.filter((item) => item !== name);
}

function withName(list: string[], name: string): string[] {
  return list.includes(name) ? list : [...list, name];
}

export function applyShowRepo(allowlist: PortfolioAllowlist, repo: string, nonce: string): PortfolioAllowlist {
  return {
    approved: withName(allowlist.approved, repo),
    hidden: withoutName(allowlist.hidden, repo),
    pending: allowlist.pending.filter((item) => item.repo !== repo),
    consumedNonces: [nonce, ...allowlist.consumedNonces.filter((item) => item !== nonce)].slice(0, CONSUMED_NONCE_CAP)
  };
}

export function applyHideRepo(allowlist: PortfolioAllowlist, repo: string, nonce: string): PortfolioAllowlist {
  return {
    approved: withoutName(allowlist.approved, repo),
    hidden: withName(allowlist.hidden, repo),
    pending: allowlist.pending.filter((item) => item.repo !== repo),
    consumedNonces: [nonce, ...allowlist.consumedNonces.filter((item) => item !== nonce)].slice(0, CONSUMED_NONCE_CAP)
  };
}

export function appendPending(
  allowlist: PortfolioAllowlist,
  pending: PendingReview
): PortfolioAllowlist {
  const withoutRepo = allowlist.pending.filter((item) => item.repo !== pending.repo);
  return {
    ...allowlist,
    pending: [...withoutRepo, pending]
  };
}
