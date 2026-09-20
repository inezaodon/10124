import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/html-escape";
import {
  applyHideRepo,
  applyShowRepo,
  findPending,
  isRepoApprovedForPortfolio
} from "@/lib/portfolio-allowlist";
import { getFreshAllowlist, persistAllowlist } from "@/lib/portfolio-github";
import {
  actionLabel,
  getInboxSecret,
  isInboxAction,
  verifyInboxToken,
  type InboxAction
} from "@/lib/portfolio-inbox-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function htmlPage(title: string, body: string, status: number): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background: #fafaf8; color: #0f172a; margin: 0; padding: 48px 20px; }
      main { max-width: 36rem; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 28px; box-shadow: 0 10px 30px rgba(15,23,42,.06); }
      h1 { font-size: 1.4rem; margin: 0 0 12px; }
      p { line-height: 1.55; color: #334155; }
      a { color: #0f766e; font-weight: 600; }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>
      ${body}
    </main>
  </body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function readToken(request: Request): Promise<string> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as { token?: unknown };
      return typeof body.token === "string" ? body.token : "";
    } catch {
      return "";
    }
  }
  try {
    const form = await request.formData();
    const token = form.get("token");
    return typeof token === "string" ? token : "";
  } catch {
    return "";
  }
}

function successCopy(action: InboxAction, repo: string): { title: string; body: string } {
  if (action === "show") {
    return {
      title: "Shown on the site",
      body: `<p><strong>${escapeHtml(repo)}</strong> is now on the approved list. The live grid reads this file from GitHub (about a minute of cache), so the card appears without a full Vercel rebuild.</p>
             <p><a href="/">Back to portfolio</a> · <a href="https://github.com/inezaodon/${encodeURIComponent(repo)}">Open GitHub repo</a></p>`
    };
  }
  return {
    title: "Kept hidden",
    body: `<p><strong>${escapeHtml(repo)}</strong> will stay off 10124.vercel.app. Detect will not email this repo again.</p>
           <p><a href="/">Back to portfolio</a></p>`
  };
}

export async function GET() {
  const response = htmlPage(
    "This link cannot publish a repo",
    `<p>Gmail and other clients prefetch GET URLs, so <strong>Show on site</strong> / <strong>Keep hidden</strong> never run on GET. Open the review page from the email and use the Confirm button, which sends POST /api/portfolio-inbox.</p>
     <p><a href="/">Back to portfolio</a></p>`,
    405
  );
  response.headers.set("Allow", "POST");
  return response;
}

export async function POST(request: Request) {
  const secret = getInboxSecret();
  if (!secret) {
    return htmlPage(
      "Inbox is not configured",
      `<p>PORTFOLIO_INBOX_SECRET is missing on this deployment, so review links cannot be confirmed. Add it in the Vercel dashboard — never commit it to git.</p>`,
      503
    );
  }

  const token = await readToken(request);
  const verified = verifyInboxToken(token, secret);
  if (!verified.ok) {
    const expired = verified.reason === "expired";
    return htmlPage(
      expired ? "This review link has expired" : "This review link is not valid",
      `<p>No change was made. Ask detect to send a fresh email, or ignore this if the repo was already reviewed.</p>
       <p><a href="/">Back to portfolio</a></p>`,
      403
    );
  }

  if (!isInboxAction(verified.payload.action)) {
    return htmlPage("This review link is not valid", `<p>No change was made.</p>`, 403);
  }

  const { repo, action, nonce } = verified.payload;

  let allowlist;
  try {
    allowlist = await getFreshAllowlist();
  } catch {
    return htmlPage(
      "Could not load the allowlist",
      `<p>No change was made. Try again in a moment.</p>`,
      503
    );
  }

  if (allowlist.consumedNonces.includes(nonce)) {
    return htmlPage(
      "This review link was already used",
      `<p>The one-time token for <strong>${escapeHtml(repo)}</strong> is consumed. No further change was made.</p>
       <p><a href="/">Back to portfolio</a></p>`,
      403
    );
  }

  const pending = findPending(allowlist, repo, nonce);
  if (!pending) {
    const already = isRepoApprovedForPortfolio(repo, allowlist);
    return htmlPage(
      "This review link is no longer pending",
      `<p>No change was made for <strong>${escapeHtml(repo)}</strong>${already ? " (it is already on the approved list)." : "."}</p>
       <p><a href="/">Back to portfolio</a></p>`,
      403
    );
  }

  const next =
    action === "show" ? applyShowRepo(allowlist, repo, nonce) : applyHideRepo(allowlist, repo, nonce);
  const persisted = await persistAllowlist(
    next,
    action === "show" ? `portfolio-inbox: show ${repo} on site` : `portfolio-inbox: keep ${repo} hidden`
  );

  if (!persisted.ok) {
    return htmlPage(
      "Could not save the decision",
      `<p>${escapeHtml(persisted.error)}</p>
       <p>The confirm did not succeed, so the repo is still unpublished. Check PORTFOLIO_GITHUB_TOKEN on Vercel.</p>`,
      503
    );
  }

  const copy = successCopy(action, repo);
  return htmlPage(
    copy.title,
    `${copy.body}<p style="color:#64748b;font-size:.9rem;">Action: ${escapeHtml(actionLabel(action))} · Saved via ${escapeHtml(persisted.via)}.</p>`,
    200
  );
}
