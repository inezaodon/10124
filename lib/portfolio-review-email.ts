import { Resend } from "resend";
import { escapeHtml } from "@/lib/html-escape";
import { actionLabel, type InboxAction } from "@/lib/portfolio-inbox-token";

const DEFAULT_TO_EMAIL = "oineza@nd.edu";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseDestinationEmails(raw: string): string[] {
  const unique = new Set<string>();
  for (const part of raw.split(/[,;]/)) {
    const email = part.trim();
    if (emailPattern.test(email)) unique.add(email);
  }
  return [...unique];
}

export function getReviewMailRecipients(): string[] {
  return parseDestinationEmails(process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL);
}

export function getReviewMailFrom(): string {
  return (process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>").trim();
}

export type ReviewMailRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  createdAt: string;
};

function buttonCell(href: string, label: string, background: string): string {
  return `
    <td style="padding-right:12px;">
      <a href="${escapeHtml(href)}"
         style="display:inline-block;background:${background};color:#ffffff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-family:Arial,sans-serif;font-size:14px;">
        ${escapeHtml(label)}
      </a>
    </td>`;
}

export function buildReviewEmailHtml(repo: ReviewMailRepo, showUrl: string, hideUrl: string): string {
  const created = repo.createdAt ? new Date(repo.createdAt).toUTCString() : "unknown";
  const description = repo.description?.trim() || "No description on GitHub.";
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <p>A new public GitHub repo is ready to review for <strong>10124.vercel.app</strong>.</p>
      <p>It is <strong>not</strong> on the live site yet. Opening these links does nothing by itself — you will confirm on the next page (Gmail prefetches GET links).</p>
      <table style="border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Repo</td><td><strong>${escapeHtml(repo.name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Description</td><td>${escapeHtml(description)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Created</td><td>${escapeHtml(created)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b;">GitHub</td><td><a href="${escapeHtml(repo.htmlUrl)}">${escapeHtml(repo.htmlUrl)}</a></td></tr>
      </table>
      <p>This signed link expires in about 48 hours and can be used once.</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          ${buttonCell(showUrl, actionLabel("show"), "#0d9488")}
          ${buttonCell(hideUrl, actionLabel("hide"), "#475569")}
        </tr>
      </table>
    </div>
  `;
}

export function buildReviewEmailText(repo: ReviewMailRepo, showUrl: string, hideUrl: string): string {
  const description = repo.description?.trim() || "No description on GitHub.";
  return [
    `New public GitHub repo ready to review for 10124.vercel.app.`,
    `It is NOT on the live site yet. Confirm on the next page — the email links only open a review screen.`,
    "",
    `Repo: ${repo.name}`,
    `Description: ${description}`,
    `Created: ${repo.createdAt}`,
    `GitHub: ${repo.htmlUrl}`,
    "",
    `${actionLabel("show")}: ${showUrl}`,
    `${actionLabel("hide")}: ${hideUrl}`,
    "",
    "Signed links expire in ~48 hours and can be used once."
  ].join("\n");
}

export async function sendPortfolioReviewEmail(
  repo: ReviewMailRepo,
  urls: Record<InboxAction, string>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not configured." };

  const to = getReviewMailRecipients();
  if (to.length === 0) return { ok: false, error: "CONTACT_TO_EMAIL is invalid." };

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getReviewMailFrom(),
    to,
    subject: `[10124] New repo ready to review: ${repo.name}`,
    text: buildReviewEmailText(repo, urls.show, urls.hide),
    html: buildReviewEmailHtml(repo, urls.show, urls.hide)
  });

  if (error) {
    const message = typeof error.message === "string" ? error.message : "Resend rejected the message.";
    return { ok: false, error: message };
  }
  return { ok: true };
}
