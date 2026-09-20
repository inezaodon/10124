import type { ReactNode } from "react";
import Link from "next/link";
import { findPending } from "@/lib/portfolio-allowlist";
import { getFreshAllowlist } from "@/lib/portfolio-github";
import {
  actionLabel,
  getInboxSecret,
  verifyInboxToken,
  type InboxAction
} from "@/lib/portfolio-inbox-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review repository",
  robots: { index: false, follow: false }
};

type Props = { searchParams: Promise<{ t?: string }> };

function Shell({
  kicker,
  title,
  children
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <section className="pop-glass space-y-5 p-8">
        <p className="pop-kicker">{kicker}</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{title}</h1>
        {children}
      </section>
    </main>
  );
}

export default async function InboxReviewPage({ searchParams }: Props) {
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : "";
  const secret = getInboxSecret();
  const verified = verifyInboxToken(token, secret);

  if (!secret) {
    return (
      <Shell kicker="Portfolio inbox" title="Inbox is not configured">
        <p className="text-slate-600 dark:text-slate-300">
          PORTFOLIO_INBOX_SECRET is missing, so this link cannot be confirmed. Add it in Vercel — never commit it to git.
        </p>
        <Link href="/" className="pop-link inline-block">
          Back to portfolio
        </Link>
      </Shell>
    );
  }

  if (!verified.ok) {
    const expired = verified.reason === "expired";
    return (
      <Shell kicker="Portfolio inbox" title={expired ? "This review link has expired" : "This review link is not valid"}>
        <p className="text-slate-600 dark:text-slate-300">
          Opening the email did not publish anything. Confirm never runs on GET — and this token is not usable.
        </p>
        <Link href="/" className="pop-link inline-block">
          Back to portfolio
        </Link>
      </Shell>
    );
  }

  const { repo, action, nonce } = verified.payload;
  const allowlist = await getFreshAllowlist();

  if (allowlist.consumedNonces.includes(nonce) || !findPending(allowlist, repo, nonce)) {
    return (
      <Shell kicker="Portfolio inbox" title="This review link is no longer pending">
        <p className="text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-zinc-100">{repo}</span> is not waiting on this
          token. It may already have been shown or kept hidden.
        </p>
        <Link href="/" className="pop-link inline-block">
          Back to portfolio
        </Link>
      </Shell>
    );
  }

  const confirmLabel = action === "show" ? "Confirm: Show on site" : "Confirm: Keep hidden";
  const explanation: Record<InboxAction, string> = {
    show: "This will add the repo to the approved list. After a short GitHub cache (~60s) it can appear on the live project grid.",
    hide: "This will add the repo to the hidden list. It will stay off the live site, and detect will not email it again."
  };

  return (
    <Shell kicker="Confirm this action" title={actionLabel(action)}>
      <p className="text-slate-600 dark:text-slate-300">
        Repo: <span className="font-semibold text-slate-900 dark:text-zinc-100">{repo}</span>
      </p>
      <p className="text-slate-600 dark:text-slate-300">{explanation[action]}</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Email clients prefetch GET links, so nothing is published until you click confirm (POST).
      </p>
      <form method="POST" action="/api/portfolio-inbox" className="flex flex-wrap items-center gap-3 pt-2">
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="pop-btn-primary">
          {confirmLabel}
        </button>
        <Link href="/" className="pop-btn-secondary">
          Cancel
        </Link>
      </form>
      <p className="text-sm">
        <a
          href={`https://github.com/inezaodon/${encodeURIComponent(repo)}`}
          className="pop-link"
          target="_blank"
          rel="noreferrer"
        >
          Open {repo} on GitHub
        </a>
      </p>
    </Shell>
  );
}
