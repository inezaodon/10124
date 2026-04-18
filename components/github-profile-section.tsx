import { parseProfileReadmeBullets, readGithubProfileReadme } from "@/lib/github-profile";

const PROFILE_REPO_URL = "https://github.com/inezaodon/inezaodon";

export async function GitHubProfileSection() {
  const raw = readGithubProfileReadme();
  const bullets = parseProfileReadmeBullets(raw);

  return (
    <section id="github-profile" className="scroll-mt-8 space-y-4" aria-labelledby="github-profile-heading">
      <p className="section-label">GitHub profile</p>
      <div className="pop-glass-soft space-y-4 p-6 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <h2 id="github-profile-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Same intro as my GitHub profile
          </h2>
          <a
            href={PROFILE_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="pop-link shrink-0 text-sm font-semibold"
          >
            inezaodon/inezaodon →
          </a>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This site ships the README from my special GitHub profile repository, so the story stays one source of truth
          alongside the portfolio.
        </p>
        <ul className="space-y-2 text-slate-800 dark:text-slate-200">
          {bullets.map((line) => (
            <li key={line} className="flex gap-2 text-base leading-relaxed">
              <span className="select-none" aria-hidden>
                •
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
