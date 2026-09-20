import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  applyHideRepo,
  applyShowRepo,
  findPending,
  hasValidPending,
  isRepoApprovedForPortfolio,
  normalizeAllowlist,
  type PortfolioAllowlist
} from "./portfolio-allowlist";
import { findDetectCandidates } from "./portfolio-candidates";
import { INTERNSHIP_UMBRELLA_SLUG } from "./portfolio-config";

const seed = normalizeAllowlist(
  JSON.parse(readFileSync(new URL("../data/portfolio-allowlist.json", import.meta.url), "utf8")) as unknown
);

const SHOWCASE = [
  "image-quality-cnn",
  "tumor-classification",
  "nanochat-replica",
  "brilliantsciences",
  "PRINCOMP_FINAL_PREOJECT",
  "sketching_with_fouriers",
  "intro_to_iris_recognition",
  "trading-model",
  "ndpeeps_cs_internships",
  "ndpeeps_ee_internships"
];

test("seed allowlist includes every currently showcased repo", () => {
  for (const name of SHOWCASE) {
    assert.ok(seed.approved.includes(name), `missing ${name}`);
  }
  assert.deepEqual(seed.hidden, []);
  assert.deepEqual(seed.pending, []);
});

test("existing cards stay visible; unknown repos do not", () => {
  assert.equal(isRepoApprovedForPortfolio("image-quality-cnn", seed), true);
  assert.equal(isRepoApprovedForPortfolio("trading-model", seed), true);
  assert.equal(isRepoApprovedForPortfolio(INTERNSHIP_UMBRELLA_SLUG, seed), true);
  assert.equal(isRepoApprovedForPortfolio("brand-new-unseen-repo", seed), false);
  assert.equal(isRepoApprovedForPortfolio("10124", seed), false);
});

test("hidden wins over approved", () => {
  const allowlist: PortfolioAllowlist = {
    ...seed,
    hidden: ["trading-model"]
  };
  assert.equal(isRepoApprovedForPortfolio("trading-model", allowlist), false);
});

test("show/hide mutations consume the nonce and clear pending", () => {
  const pending = { repo: "brand-new-unseen-repo", nonce: "aa".repeat(16), exp: 9_999_999_999 };
  const withPending: PortfolioAllowlist = { ...seed, pending: [pending] };
  const shown = applyShowRepo(withPending, pending.repo, pending.nonce);
  assert.equal(isRepoApprovedForPortfolio("brand-new-unseen-repo", shown), true);
  assert.equal(shown.pending.length, 0);
  assert.ok(shown.consumedNonces.includes(pending.nonce));

  const hidden = applyHideRepo(withPending, pending.repo, pending.nonce);
  assert.equal(isRepoApprovedForPortfolio("brand-new-unseen-repo", hidden), false);
  assert.ok(hidden.hidden.includes("brand-new-unseen-repo"));
  assert.equal(findPending(hidden, pending.repo, pending.nonce), null);
});

test("detect skips excluded, approved, hidden, archived, config, and live pending", () => {
  const now = Date.now();
  const pendingExp = Math.floor(now / 1000) + 3600;
  const allowlist: PortfolioAllowlist = {
    approved: ["image-quality-cnn"],
    hidden: ["already-hidden"],
    pending: [{ repo: "waiting-on-odon", nonce: "ab".repeat(16), exp: pendingExp }],
    consumedNonces: []
  };
  const candidates = findDetectCandidates(
    [
      { name: "image-quality-cnn", description: null, html_url: "", created_at: "", archived: false },
      { name: "10124", description: null, html_url: "", created_at: "", archived: false },
      { name: "funcomp_homeworks", description: null, html_url: "", created_at: "", archived: false },
      { name: "already-hidden", description: null, html_url: "", created_at: "", archived: false },
      { name: "waiting-on-odon", description: null, html_url: "", created_at: "", archived: false },
      { name: "old-config-repo", description: null, html_url: "", created_at: "", archived: false },
      { name: "archived-lab", description: null, html_url: "", created_at: "", archived: true },
      { name: "brand-new-unseen-repo", description: "fresh", html_url: "https://github.com/inezaodon/brand-new-unseen-repo", created_at: "2026-09-17", archived: false }
    ],
    allowlist,
    now
  );
  assert.deepEqual(
    candidates.map((repo) => repo.name),
    ["brand-new-unseen-repo"]
  );
  assert.equal(hasValidPending(allowlist, "waiting-on-odon", now), true);
});
