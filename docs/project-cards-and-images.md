# Project cards, images, and new repos

When a new GitHub repo appears on the home page, the **card image** and **project detail hero/gallery** come from `lib/project-content.ts` (`projectContentMap`), not from GitHub automatically.

## Personal repos (never show on the live site)

`10124.vercel.app` **self-updates** from the GitHub API. Any new public repo can appear automatically unless it is listed in `lib/portfolio-config.ts` → `PERSONAL_REPOS_EXCLUDED_FROM_PORTFOLIO`.

**Do not remove or showcase these as portfolio projects:**

| Repo | Why excluded |
| ---- | ------------ |
| `funcomp_homeworks` | Course homework — not showcase work |
| `cheatsheet` | Personal reference notes |
| `inezaodon` | GitHub profile repo |
| `10124` | This portfolio site itself |

When you add another personal repo (notes, configs, classwork), add its exact GitHub name to that list.

## Collapsed internship trackers

`ndpeeps_cs_internships` and `ndpeeps_ee_internships` are **hidden as separate cards**. They are injected as one umbrella project:

| Portfolio slug | Title | Canonical GitHub repo |
| -------------- | ----- | --------------------- |
| `cicd-internship-page` | CI/CD Self-Updating Internship Page | `ndpeeps_cs_internships` |

Old URLs `/projects/ndpeeps_cs_internships` and `/projects/ndpeeps_ee_internships` **redirect** to `/projects/cicd-internship-page` (`next.config.ts`). Extra live + GitHub links for both trackers live on `extraLinks`.

## Rules

1. **Map key = exact GitHub repo name** (case-sensitive), e.g. `sketching_with_fouriers`, `intro_to_iris_recognition`. Umbrella cards may use a synthetic slug (`cicd-internship-page`) plus `canonicalGitHubRepo`.
2. **`coverImage`** — wide image used on the home grid and the project-detail hero. Prefer a live-site screenshot under `public/images/projects/` (object-top crop) or a strong Unsplash subject.
3. **`galleryImage`** — supporting visual beside “Why this project matters”.
4. **`galleryImages[]`** — extra captioned shots interleaved through the detail page (after the first description paragraph, “Inside the live site”, and the bottom gallery). Mix live screenshots with thematic Unsplash URLs.
5. **`extraLinks[]`** — additional live / GitHub / section links on the detail page. Set `showOnCard: true` to also show them on the home grid.
6. If a repo is **missing** from `projectContentMap`, the UI falls back to `fallbackProjectContent` in the same file (generic image + copy).
7. Use optional `liveDeployUrl` in `projectContentMap` when a project needs a fixed deployment link that should override GitHub `homepage`.

## How to pick images (for future updates)

- Match **one or two keywords** from the repo README or topic: e.g. Fourier → waves, oscillations, math chalkboard, plotting.
- Prefer **live screenshots** of the deployed app (Chrome headless, saved under `public/images/projects/`) plus **stable HTTPS Unsplash URLs** (`auto=format&fit=crop&w=1400&q=80`).
- After choosing URLs, **record them here** in the table so the next edit is fast and consistent.

Local files under `public/` need no `next.config.ts` image host. Remote hosts must be listed in `images.remotePatterns` (currently `images.unsplash.com`, `avatars.githubusercontent.com`, `opengraph.githubassets.com`).

## Repo → image notes

| GitHub repo / slug | Image intent | coverImage | galleryImage | liveDeployUrl |
| --- | --- | --- | --- | --- |
| `image-quality-cnn` | Face / vision / ML quality | `https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80` | `https://image-quality-cnn-o3zjl95wsj3bwdqevqji7n.streamlit.app` |
| `tumor-classification` | Medical / ML analysis | `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1400&q=80` | `https://tumor-classification-g2msv3xmrgdva6ssnvecxp.streamlit.app` |
| `sketching_with_fouriers` | Waves + digital / matrix | `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80` | — |
| `nanochat-replica` | AI / neural (Andrej Karpathy) | `/images/projects/andrej-karpathy.webp` | (existing) network / chips | — |
| `brilliantsciences` | Classroom / learning | (existing) students | (existing) teaching | — |
| `PRINCOMP_FINAL_PREOJECT` | City / mobility data | (existing) skyline | (existing) traffic / city night | — |
| `intro_to_iris_recognition` | Live study-site tabs + iris close-up | `/images/projects/iris-start.png` | `https://images.unsplash.com/photo-1494869042583-f6c911f04b4c?auto=format&fit=crop&w=1400&q=80` (eye / iris) | `https://intro-to-iris-recognition.vercel.app` |
| `trading-model` | Firebase umbrella + market charts | `/images/projects/trading-home.png` | `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80` (candlesticks) | `https://trading-model-oineza-8280d.web.app` |
| `cicd-internship-page` | CS + EE live trackers + CI/CD imagery | `/images/projects/internships-cs.png` | `/images/projects/internships-ee.png` | `https://ndpeeps-cs-internships.vercel.app` |

### Extra local screenshots (`public/images/projects/`)

| File | What it shows |
| ---- | ------------- |
| `iris-start.png` | Start here tab (stats + four-block plan) |
| `iris-pipeline.png` | Six-step pipeline |
| `iris-daugman.png` | Daugman 2004 slides |
| `iris-dl.png` | Deep learning tab |
| `iris-arciris.png` | ArcIris vs TripletIris |
| `iris-irex.png` | NIST IREX metrics |
| `iris-quiz.png` | Readiness quiz |
| `trading-home.png` | Firebase umbrella hero |
| `trading-gbm.png` | GBM simulator |
| `trading-heston.png` | Heston SV |
| `trading-var.png` | Monte Carlo VaR |
| `internships-cs.png` | CS tracker (by day) |
| `internships-cs-bigtech.png` | CS tracker (big tech) |
| `internships-ee.png` | EE tracker (all tracks) |
| `internships-ee-semiconductors.png` | EE semiconductors track |

Always verify new image URLs return **HTTP 200** (Unsplash occasionally returns **404** for mistyped or removed photo IDs).

When you add a row, paste the **full Unsplash URL** you committed in `projectContentMap` so searches stay reproducible.
