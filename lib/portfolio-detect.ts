import {
  appendPending,
  pruneExpiredPending,
  type PortfolioAllowlist
} from "@/lib/portfolio-allowlist";
import { findDetectCandidates, type DetectRepo } from "@/lib/portfolio-candidates";
import { persistAllowlist } from "@/lib/portfolio-github";
import {
  getInboxSecret,
  inboxExpiryUnix,
  newInboxNonce,
  signInboxToken,
  type InboxAction
} from "@/lib/portfolio-inbox-token";
import { sendPortfolioReviewEmail } from "@/lib/portfolio-review-email";
import { getSiteUrl } from "@/lib/site-url";

export type { DetectRepo } from "@/lib/portfolio-candidates";
export { findDetectCandidates } from "@/lib/portfolio-candidates";

export type DetectedCandidate = {
  repo: string;
  emailed: boolean;
  persisted: boolean;
  error?: string;
};

function reviewUrl(token: string): string {
  return `${getSiteUrl()}/inbox/review?t=${encodeURIComponent(token)}`;
}

export async function runPortfolioDetect(
  repos: DetectRepo[],
  allowlist: PortfolioAllowlist,
  options?: { dryRun?: boolean }
): Promise<{
  skipped?: string;
  candidates: string[];
  results: DetectedCandidate[];
  allowlist: PortfolioAllowlist;
}> {
  const secret = getInboxSecret();
  if (!secret) {
    return {
      skipped: "missing_PORTFOLIO_INBOX_SECRET",
      candidates: [],
      results: [],
      allowlist
    };
  }

  let next = pruneExpiredPending(allowlist);
  const candidates = findDetectCandidates(repos, next);

  if (options?.dryRun) {
    return {
      candidates: candidates.map((repo) => repo.name),
      results: [],
      allowlist: next
    };
  }

  const results: DetectedCandidate[] = [];

  for (const repo of candidates) {
    const nonce = newInboxNonce();
    const exp = inboxExpiryUnix();
    const tokens: Record<InboxAction, string> = {
      show: signInboxToken({ repo: repo.name, action: "show", exp, nonce }, secret),
      hide: signInboxToken({ repo: repo.name, action: "hide", exp, nonce }, secret)
    };

    next = appendPending(next, { repo: repo.name, nonce, exp });
    const persisted = await persistAllowlist(
      next,
      `portfolio-inbox: pending review for ${repo.name}`
    );

    if (!persisted.ok) {
      next = {
        ...next,
        pending: next.pending.filter((item) => !(item.repo === repo.name && item.nonce === nonce))
      };
      results.push({
        repo: repo.name,
        emailed: false,
        persisted: false,
        error: persisted.error
      });
      console.info(`[portfolio-detect] skip ${repo.name}: persist failed (${persisted.error})`);
      continue;
    }

    const mailed = await sendPortfolioReviewEmail(
      {
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        createdAt: repo.created_at
      },
      { show: reviewUrl(tokens.show), hide: reviewUrl(tokens.hide) }
    );

    if (!mailed.ok) {
      results.push({
        repo: repo.name,
        emailed: false,
        persisted: true,
        error: mailed.error
      });
      console.info(`[portfolio-detect] ${repo.name} pending saved but email failed: ${mailed.error}`);
      continue;
    }

    results.push({ repo: repo.name, emailed: true, persisted: true });
    console.info(`[portfolio-detect] emailed review for ${repo.name}`);
  }

  return {
    candidates: candidates.map((repo) => repo.name),
    results,
    allowlist: next
  };
}
