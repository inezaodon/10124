import { ContactForm } from "@/components/contact-form";
import { GitHubContributions } from "@/components/github-contributions";
import { OriginStoryLauncher } from "@/components/origin-story-overlay";
import { PhotoSlideshow } from "@/components/photo-slideshow";
import { ProjectGrid } from "@/components/project-grid";
import { SiteHeader } from "@/components/site-header";
import { papers, resumeHighlights } from "@/lib/content";
import { getSlideshowSlides } from "@/lib/slideshow";
import { getDevtoPosts, getDiscordPresence, getGitHubProjects, techIconMap } from "@/lib/api";

export default async function HomePage() {
  const [projectsResult, presenceResult, postsResult, slidesResult] = await Promise.allSettled([
    getGitHubProjects(),
    getDiscordPresence(),
    getDevtoPosts(),
    getSlideshowSlides()
  ]);
  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const presence = presenceResult.status === "fulfilled" ? presenceResult.value : null;
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const slideshowSlides = slidesResult.status === "fulfilled" ? slidesResult.value : [];
  const techStack = techIconMap(projects.map((project) => project.language));

  return (
    <main className="relative mx-auto max-w-6xl space-y-14 px-6 py-10">
      <SiteHeader />

      <section className="pop-glass relative overflow-hidden p-8 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl dark:bg-teal-500/10"
        />
        <div className="relative">
          <p className="pop-kicker">Open to internships and collaborations</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {resumeHighlights.title}
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">{resumeHighlights.pitch}</p>
          <div className="mt-8 flex flex-col gap-4">
            <OriginStoryLauncher />
            <div className="flex flex-wrap gap-3">
              <a href={resumeHighlights.resumePdfPath} target="_blank" rel="noreferrer" className="pop-btn-primary">
                View Resume
              </a>
              <a href="#gallery" className="pop-btn-secondary">
                Open Photo Dashboard
              </a>
              <a href="https://github.com/inezaodon" target="_blank" rel="noreferrer" className="pop-btn-secondary">
                Explore GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="space-y-1">
        <p className="section-label">Portfolio</p>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">Projects</h2>
        <p className="mb-6 max-w-2xl text-slate-600 dark:text-slate-300">
          Start here: hands-on projects with real code and real outcomes.
        </p>
        <ProjectGrid projects={projects} />
      </section>

      <section id="resume" className="grid gap-8 md:grid-cols-2">
        <div className="pop-glass-soft space-y-5 p-6">
          <p className="section-label">Experience</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Resume Highlights</h2>
          <div className="space-y-2">
            {resumeHighlights.education.map((edu) => (
              <div key={edu.school}>
                <p className="font-semibold">{edu.school}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{edu.degree}</p>
                <p className="text-sm text-slate-500">{edu.detail}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {resumeHighlights.experience.map((exp) => (
              <article
                key={`${exp.role}-${exp.org}`}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/50"
              >
                <p className="font-semibold">
                  {exp.role} · {exp.org}
                </p>
                <p className="text-xs text-slate-500">{exp.period}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <a href={resumeHighlights.resumePdfPath} target="_blank" rel="noreferrer" className="pop-link inline-block">
            Download full resume (PDF)
          </a>
        </div>

        <div className="space-y-4">
          <p className="section-label">Gallery</p>
          <h2 id="gallery" className="text-2xl font-extrabold text-slate-900 dark:text-white">Photo Dashboard</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Real moments, fun energy, and yes, a little chaos in the best way.
          </p>
          <PhotoSlideshow slides={slideshowSlides} />
          <div className="pop-glass-soft p-5">
            <h3 className="font-semibold">What teammates can expect</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {resumeHighlights.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="papers" className="space-y-4">
        <p className="section-label">Research</p>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Research & Writing</h2>
        <p className="max-w-3xl text-slate-600 dark:text-slate-300">
          Selected papers hosted on this site, each with a short summary to make browsing easier.
        </p>
        <div className="grid gap-4">
          {papers.map((paper) => (
            <article
              key={paper.file}
              className="pop-glass-soft p-5 transition hover:shadow-md dark:hover:shadow-black/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{paper.title}</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
                  {paper.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{paper.summary}</p>
              <a href={paper.file} target="_blank" rel="noreferrer" className="pop-link mt-3 inline-block text-sm">
                Open PDF
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="section-label">Blog</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Latest Writing</h2>
          {posts.length ? (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="pop-glass-soft p-4 transition hover:shadow-md dark:hover:shadow-black/20"
                >
                  <a href={post.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                    {post.title}
                  </a>
                  <p className="text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              <p className="pop-glass-soft p-4 text-sm text-slate-600 dark:text-slate-300">
                Live Dev.to posts are unavailable right now, so here are featured writings from this portfolio.
              </p>
              {papers.slice(0, 3).map((paper) => (
                <article
                  key={paper.file}
                  className="pop-glass-soft p-4"
                >
                  <a href={paper.file} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                    {paper.title}
                  </a>
                  <p className="mt-1 text-sm text-slate-500">{paper.category}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="section-label">Stack</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tech Stack</h2>
          <ul className="pop-glass-soft flex flex-wrap gap-3 p-4">
            {techStack.slice(0, 10).map((tech) => (
              <li
                key={tech.label}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm dark:bg-zinc-800 dark:text-zinc-200"
              >
                <i className={tech.iconClass} />
                <span className="capitalize">{tech.label}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100">Live Status</h2>
          <p className="text-slate-600 dark:text-slate-300">
            {presence?.data
              ? `Discord: ${presence.data.discord_status}${presence.data.listening_to_spotify && presence.data.spotify ? ` • Listening to ${presence.data.spotify.song} - ${presence.data.spotify.artist}` : ""}`
              : "Set NEXT_PUBLIC_DISCORD_ID to enable Lanyard live presence."}
          </p>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-100">GitHub Contributions</h2>
          <GitHubContributions />
        </div>
      </section>

      <div id="contact">
        <ContactForm />
      </div>
    </main>
  );
}
