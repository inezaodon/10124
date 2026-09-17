import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const INBOX_TOKEN_TTL_SECONDS = 48 * 60 * 60;
export const INBOX_TOKEN_VERSION = "v1";

export type InboxAction = "show" | "hide";

export type InboxTokenPayload = {
  repo: string;
  action: InboxAction;
  exp: number;
  nonce: string;
};

export type TokenVerifyOk = { ok: true; payload: InboxTokenPayload };
export type TokenVerifyFail = {
  ok: false;
  reason: "missing_secret" | "bad_format" | "bad_sig" | "expired" | "bad_action" | "bad_repo";
};
export type TokenVerifyResult = TokenVerifyOk | TokenVerifyFail;

const REPO_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
const NONCE_PATTERN = /^[a-f0-9]{32}$/;

export function getInboxSecret(): string | null {
  const secret = process.env.PORTFOLIO_INBOX_SECRET?.trim();
  return secret ? secret : null;
}

export function isInboxAction(value: string): value is InboxAction {
  return value === "show" || value === "hide";
}

export function isValidRepoName(value: string): boolean {
  return REPO_NAME_PATTERN.test(value);
}

export function newInboxNonce(): string {
  return randomBytes(16).toString("hex");
}

export function inboxExpiryUnix(nowMs = Date.now()): number {
  return Math.floor(nowMs / 1000) + INBOX_TOKEN_TTL_SECONDS;
}

function signedBytes(payload: InboxTokenPayload, secret: string): Buffer {
  return createHmac("sha256", secret)
    .update(`${INBOX_TOKEN_VERSION}\n${payload.repo}\n${payload.action}\n${payload.exp}\n${payload.nonce}`)
    .digest();
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signInboxToken(payload: InboxTokenPayload, secret: string): string {
  if (!isValidRepoName(payload.repo) || !isInboxAction(payload.action) || !NONCE_PATTERN.test(payload.nonce)) {
    throw new Error("Refusing to sign an invalid inbox token payload");
  }
  const body = Buffer.from(
    JSON.stringify({
      repo: payload.repo,
      action: payload.action,
      exp: payload.exp,
      nonce: payload.nonce
    }),
    "utf8"
  ).toString("base64url");
  const sig = signedBytes(payload, secret).toString("base64url");
  return `${body}.${sig}`;
}

export function verifyInboxToken(token: string, secret: string | null, nowMs = Date.now()): TokenVerifyResult {
  if (!secret) return { ok: false, reason: "missing_secret" };
  if (typeof token !== "string" || token.length < 16 || token.length > 2000) {
    return { ok: false, reason: "bad_format" };
  }

  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: "bad_format" };

  const body = token.slice(0, dot);
  const sigPart = token.slice(dot + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as unknown;
  } catch {
    return { ok: false, reason: "bad_format" };
  }

  if (!parsed || typeof parsed !== "object") return { ok: false, reason: "bad_format" };
  const record = parsed as Record<string, unknown>;
  const repo = typeof record.repo === "string" ? record.repo : "";
  const action = typeof record.action === "string" ? record.action : "";
  const exp = typeof record.exp === "number" && Number.isFinite(record.exp) ? record.exp : NaN;
  const nonce = typeof record.nonce === "string" ? record.nonce : "";

  if (!isValidRepoName(repo)) return { ok: false, reason: "bad_repo" };
  if (!isInboxAction(action)) return { ok: false, reason: "bad_action" };
  if (!Number.isInteger(exp) || !NONCE_PATTERN.test(nonce)) return { ok: false, reason: "bad_format" };

  const payload: InboxTokenPayload = { repo, action, exp, nonce };

  let provided: Buffer;
  try {
    provided = Buffer.from(sigPart, "base64url");
  } catch {
    return { ok: false, reason: "bad_format" };
  }

  const expected = signedBytes(payload, secret);
  if (!safeEqual(provided, expected)) return { ok: false, reason: "bad_sig" };

  const nowSec = Math.floor(nowMs / 1000);
  if (payload.exp <= nowSec) return { ok: false, reason: "expired" };

  return { ok: true, payload };
}

export function actionLabel(action: InboxAction): string {
  return action === "show" ? "Show on site" : "Keep hidden";
}
