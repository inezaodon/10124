# Super Dynamic Portfolio

Next.js portfolio app with live GitHub projects, optional Discord presence, Dev.to posts, animated project grid, and a serverless contact API.

The live site at **10124.vercel.app** auto-syncs projects from GitHub. Personal repos (homework, cheatsheets, profile, this site) are excluded via `lib/portfolio-config.ts` — see `docs/project-cards-and-images.md`.

## Run locally

1. Install dependencies:
   npm install
2. Create your env file:
   cp .env.example .env.local
3. Start development server:
   npm run dev
