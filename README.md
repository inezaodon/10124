# Super Dynamic Portfolio

Next.js portfolio app with live GitHub projects, optional Discord presence, Dev.to posts, animated project grid, and a serverless contact API.

The live site at **10124.vercel.app** auto-syncs projects from GitHub, but **new public repos stay hidden until Odon approves them by email**. Personal repos (homework, cheatsheets, profile, this site) are always excluded via `lib/portfolio-config.ts`. Details: `docs/project-cards-and-images.md` and **[docs/portfolio-inbox.md](docs/portfolio-inbox.md)**.

The home-page **Email me** form sends topic-specific questions through Resend (`/api/contact`). Setup steps: **[docs/resend-contact.md](docs/resend-contact.md)**. The same Resend key sends “new repo to review” mail for the portfolio inbox.

## Run locally

1. Install dependencies:
   npm install
2. Create your env file:
   cp .env.example .env.local
3. Add `RESEND_API_KEY` (and optional `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`) so the contact form can send mail. For the new-repo approval loop, also add `PORTFOLIO_INBOX_SECRET` (see [docs/portfolio-inbox.md](docs/portfolio-inbox.md)).
4. Start development server:
   npm run dev
