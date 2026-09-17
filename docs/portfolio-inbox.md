# Portfolio inbox — hold new GitHub repos for approval

The live project grid still **self-updates from GitHub**, but a newly created public repo is **invisible** until Odon confirms it. Detect emails a heads-up; a successful **confirm POST** is what publishes or hides.

Unknown repos stay off production until approved. Forwarded mail cannot publish a repo: links are HMAC-signed, expire in ~48 hours, are one-time use, and **never** approve on GET (Gmail prefetches GET).

## What visitors see

`getGitHubProjects()` (`lib/api.ts`) still:

1. Fetches `https://api.github.com/users/inezaodon/repos`
2. Drops archived repos, names containing `config`, and `PERSONAL_REPOS_EXCLUDED_FROM_PORTFOLIO`
3. Collapses `ndpeeps_cs_internships` + `ndpeeps_ee_internships` into the umbrella slug `cicd-internship-page`

**Plus** a repo appears on the grid / detail pages only if its name is in `approved` and not in `hidden` (`data/portfolio-allowlist.json`). The umbrella card shows when its canonical tracker (`ndpeeps_cs_internships`) is approved.

Personal repos are never emailed and never shown:

`funcomp_homeworks`, `cheatsheet`, `inezaodon`, `10124`

## State file

```json
{
  "approved": ["image-quality-cnn", "..."],
  "hidden": [],
  "pending": [{ "repo": "name", "nonce": "...", "exp": 1234567890 }],
  "consumedNonces": []
}
```

The seed `approved` list is every repo that is already on the live grid (internship trackers included so the umbrella does not disappear).

At runtime the site **fetches this file from GitHub** (`inezaodon/10124`, ~60s revalidate) so an email confirm can take effect without waiting for a Vercel rebuild. If GitHub is unreachable, it falls back to the JSON bundled in the deployment.

Confirms write the file through the [GitHub Contents API](https://docs.github.com/en/rest/repos/contents). No human merge is required after the first deploy of this feature.

## Email + confirm loop

1. **Detect** `GET`/`POST` `/api/portfolio-detect` (Vercel Cron, hourly). Lists public repos, skips excluded / archived / config / approved / hidden / still-pending. For each new candidate it appends `pending` (nonce + 48h expiry), then emails Odon.
2. **Email** (Resend, same `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` as the contact form). Subject: `[10124] New repo ready to review: <name>`. Two HTML `<a>` buttons: **Show on site** and **Keep hidden**. They open `/inbox/review?t=…` — they do **not** publish.
3. **Interstitial** `/inbox/review` verifies signature, expiry, and pending nonce **without** changing state. Confirm is a form **POST** to `/api/portfolio-inbox`.
4. **Inbox POST** verifies HMAC + expiry + unused nonce, then:
   - `show` → add to `approved`, drop pending, consume nonce, commit JSON
   - `hide` → add to `hidden` (and remove from `approved`), consume nonce, commit JSON — detect will not email that repo again
5. `GET /api/portfolio-inbox` is **405** and never mutates (prefetch-safe). Invalid / expired / reused tokens → **403**, no state change. Missing `PORTFOLIO_INBOX_SECRET` → detect no-ops; inbox returns **503**.

Tokens: `HMAC-SHA256` over `v1`, repo, action, expiry, nonce, keyed by `PORTFOLIO_INBOX_SECRET`. Binding all of those means a forwarded mail cannot be rewritten into a different repo or action.

## Environment variables

Set these in the **Vercel dashboard** (Production and Preview). **Never commit secrets.** `.env.local` is gitignored. `.env.example` has empty placeholders only.

| Name | Purpose |
| ---- | ------- |
| `PORTFOLIO_INBOX_SECRET` | Long random HMAC key for review tokens |
| `PORTFOLIO_GITHUB_TOKEN` | Fine-grained PAT: **Contents read/write** on `inezaodon/10124`. `GITHUB_TOKEN` is also accepted. |
| `CRON_SECRET` | Vercel Cron sends `Authorization: Bearer CRON_SECRET`. Required in production. |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for email links, e.g. `https://10124.vercel.app` |
| `RESEND_API_KEY` | Same key as the contact form |
| `CONTACT_TO_EMAIL` | Inbox(es) for review mail. Comma-separated is ok. Default `oineza@nd.edu` |
| `CONTACT_FROM_EMAIL` | Same From address as the contact form |
| `PORTFOLIO_GITHUB_BRANCH` | Optional. Branch for Contents API read/write. Defaults to `VERCEL_GIT_COMMIT_REF` or `main`. |

### Generate `PORTFOLIO_INBOX_SECRET`

```bash
openssl rand -base64 48
```

Paste the output into Vercel → Settings → Environment Variables. Do not put it in git.

### GitHub token

1. GitHub → Settings → Developer settings → Fine-grained personal access tokens
2. Resource owner: `inezaodon`. Repository access: only `10124`
3. Permissions: **Contents: Read and write**
4. Store as `PORTFOLIO_GITHUB_TOKEN` on Vercel

Without this token in production, confirm cannot save and detect will not persist pending (so it will not email). In **local development**, detect logs candidates and inbox can write `data/portfolio-allowlist.json` on disk.

## Vercel Cron

`vercel.json` schedules:

```
0 * * * *  →  GET /api/portfolio-detect
```

Vercel Cron [Hobby](https://vercel.com/docs/cron-jobs) only runs **once per day**. The hourly expression is correct for Pro; on Hobby Vercel will still invoke detect, just not every hour. That is enough — new repos are rare.

If cron is unavailable, call the endpoint yourself:

```bash
curl -X POST "https://10124.vercel.app/api/portfolio-detect" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Manual test (same secret as query or header):

```bash
curl "https://10124.vercel.app/api/portfolio-detect?secret=$CRON_SECRET&dry=1"
```

`dry=1` lists candidates without writing or emailing.

Locally, if `CRON_SECRET` is unset, detect is allowed (development only):

```bash
curl http://localhost:3000/api/portfolio-detect?dry=1
```

If `PORTFOLIO_INBOX_SECRET` is missing, detect returns `skipped: missing_PORTFOLIO_INBOX_SECRET` and does nothing.

## Local `.env.local`

```
cp .env.example .env.local
```

Fill Resend as in [resend-contact.md](./resend-contact.md), then:

```
PORTFOLIO_INBOX_SECRET=   # openssl rand -base64 48
PORTFOLIO_GITHUB_TOKEN=
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Leave tokens blank for a dry local loop (detect logs; inbox writes the JSON file). Never commit `.env.local`.

## Gmail prefetch

Do not “fix” this by making the email buttons hit `/api/portfolio-inbox` on GET. Clients will follow those links and publish without a human click. The interstitial + POST confirm is required.
