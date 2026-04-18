# Project cards, images, and new repos

When a new GitHub repo appears on the home page, the **card image** and **project detail hero/gallery** come from `lib/project-content.ts` (`projectContentMap`), not from GitHub automatically.

## Rules

1. **Map key = exact GitHub repo name** (case-sensitive), e.g. `sketching_with_fouriers`, `10124`.
2. **`coverImage`** — wide image used on the home grid (cropped in a short banner). Prefer strong subject + readable contrast.
3. **`galleryImage`** — second image on `/projects/[repo]` (supporting visual). Can be more abstract or detail-oriented.
4. If a repo is **missing** from `projectContentMap`, the UI falls back to `fallbackProjectContent` in the same file (generic image + copy).

## How to pick images (for future updates)

- Match **one or two keywords** from the repo README or topic: e.g. Fourier → waves, oscillations, math chalkboard, plotting.
- Prefer **stable HTTPS URLs** (this repo uses Unsplash with `auto=format&fit=crop&w=1400&q=80`).
- After choosing URLs, **record them here** in the table so the next edit is fast and consistent.

## Repo → image notes

| GitHub repo              | Image intent                         | coverImage query / theme              | galleryImage query / theme        |
| ------------------------ | ------------------------------------ | ------------------------------------- | --------------------------------- |
| `sketching_with_fouriers` | Waves + digital / matrix (gallery)     | `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=80` | `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80` |

Always verify new URLs return **HTTP 200** (Unsplash occasionally returns **404** for mistyped or removed photo IDs).
| `10124`                  | Code / laptop workspace              | (existing) dev desk                   | (existing) circuits / hardware    |
| `nanochat-replica`       | AI / neural                          | (existing) abstract AI                | (existing) network / chips        |
| `brilliantsciences`      | Classroom / learning                 | (existing) students                   | (existing) teaching               |
| `PRINCOMP_FINAL_PREOJECT` | City / mobility data                 | (existing) skyline                    | (existing) traffic / city night   |
| `inezaodon`              | GitHub / code identity               | (existing) code editor vibe           | (existing) terminal / code        |

When you add a row, paste the **full Unsplash URL** you committed in `projectContentMap` so searches stay reproducible.
