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

## Rules

1. **Map key = exact GitHub repo name** (case-sensitive), e.g. `sketching_with_fouriers`, `10124`.
2. **`coverImage`** — wide image used on the home grid (cropped in a short banner). Prefer strong subject + readable contrast.
3. **`galleryImage`** — second image on `/projects/[repo]` (supporting visual). Can be more abstract or detail-oriented.
4. If a repo is **missing** from `projectContentMap`, the UI falls back to `fallbackProjectContent` in the same file (generic image + copy).
5. Use optional `liveDeployUrl` in `projectContentMap` when a project needs a fixed deployment link that should override GitHub `homepage`.

## How to pick images (for future updates)

- Match **one or two keywords** from the repo README or topic: e.g. Fourier → waves, oscillations, math chalkboard, plotting.
- Prefer **stable HTTPS URLs** (this repo uses Unsplash with `auto=format&fit=crop&w=1400&q=80`).
- After choosing URLs, **record them here** in the table so the next edit is fast and consistent.

## Repo → image notes

| GitHub repo               | Image intent                     | coverImage query / theme                                                                 | galleryImage query / theme                                                                | liveDeployUrl override              |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| `image-quality-cnn`       | Face / vision / ML quality       | `https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80` | `https://image-quality-cnn-o3zjl95wsj3bwdqevqji7n.streamlit.app` |
| `tumor-classification`    | Medical / ML analysis            | `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1400&q=80` | `https://tumor-classification-g2msv3xmrgdva6ssnvecxp.streamlit.app` |
| `sketching_with_fouriers` | Waves + digital / matrix         | `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80` | —                                   |
| `nanochat-replica`        | AI / neural                      | (existing) abstract AI                                                                    | (existing) network / chips                                                                 | —                                   |
| `brilliantsciences`       | Classroom / learning             | (existing) students                                                                       | (existing) teaching                                                                        | —                                   |
| `PRINCOMP_FINAL_PREOJECT` | City / mobility data             | (existing) skyline                                                                        | (existing) traffic / city night                                                            | —                                   |

Always verify new image URLs return **HTTP 200** (Unsplash occasionally returns **404** for mistyped or removed photo IDs).

When you add a row, paste the **full Unsplash URL** you committed in `projectContentMap` so searches stay reproducible.
