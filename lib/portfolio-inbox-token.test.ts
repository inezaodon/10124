import assert from "node:assert/strict";
import test from "node:test";
import {
  inboxExpiryUnix,
  INBOX_TOKEN_TTL_SECONDS,
  newInboxNonce,
  signInboxToken,
  verifyInboxToken
} from "./portfolio-inbox-token";

const secret = "test-portfolio-inbox-secret-value-for-hmac";

function payload(overrides?: Partial<{ repo: string; action: "show" | "hide"; exp: number; nonce: string }>) {
  return {
    repo: "new-public-demo",
    action: "show" as const,
    exp: inboxExpiryUnix(1_700_000_000_000),
    nonce: newInboxNonce(),
    ...overrides
  };
}

test("sign/verify round-trip", () => {
  const p = payload();
  const token = signInboxToken(p, secret);
  const result = verifyInboxToken(token, secret, 1_700_000_000_000);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.payload.repo, p.repo);
    assert.equal(result.payload.action, p.action);
    assert.equal(result.payload.exp, p.exp);
    assert.equal(result.payload.nonce, p.nonce);
  }
});

test("expired token is rejected", () => {
  const p = payload({ exp: Math.floor(1_700_000_000_000 / 1000) - 1 });
  const token = signInboxToken(p, secret);
  const result = verifyInboxToken(token, secret, 1_700_000_000_000);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "expired");
});

test("TTL is about 48 hours", () => {
  assert.equal(INBOX_TOKEN_TTL_SECONDS, 48 * 60 * 60);
  const now = 1_700_000_000_000;
  assert.equal(inboxExpiryUnix(now), Math.floor(now / 1000) + INBOX_TOKEN_TTL_SECONDS);
});

test("tampered repo fails signature check", () => {
  const token = signInboxToken(payload(), secret);
  const [body, sig] = token.split(".");
  const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { repo: string };
  parsed.repo = "evil-repo";
  const tampered = `${Buffer.from(JSON.stringify(parsed), "utf8").toString("base64url")}.${sig}`;
  const result = verifyInboxToken(tampered, secret, 1_700_000_000_000);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "bad_sig");
});

test("wrong secret fails", () => {
  const token = signInboxToken(payload(), secret);
  const result = verifyInboxToken(token, "other-secret", 1_700_000_000_000);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "bad_sig");
});

test("truncated token fails", () => {
  const token = signInboxToken(payload(), secret);
  const result = verifyInboxToken(token.slice(0, 20), secret, 1_700_000_000_000);
  assert.equal(result.ok, false);
});

test("missing secret fails closed", () => {
  const token = signInboxToken(payload(), secret);
  const result = verifyInboxToken(token, null, 1_700_000_000_000);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "missing_secret");
});

test("hide action is bound into the token", () => {
  const p = payload({ action: "hide" });
  const token = signInboxToken(p, secret);
  const result = verifyInboxToken(token, secret, 1_700_000_000_000);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.payload.action, "hide");
});
