import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { PhotoSlideshow } from "@/components/photo-slideshow";
import { ProjectGrid } from "@/components/project-grid";
import { SiteHeader } from "@/components/site-header";
import { papers, resumeHighlights } from "@/lib/content";
import { getSlideshowSlides } from "@/lib/slideshow";
import {
  contributionsSvgUrl,
  getDevtoPosts,
  getDiscordPresence,
  getGitHubProjects,
  techIconMap
} from "@/lib/api";

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
    <main className="mx-auto max-w-6xl space-y-14 px-6 py-10">
      <SiteHeader />

      <section className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <p className="text-sm uppercase tracking-wide text-brand-600">Open to internships and collaborations</p>
        <h2 className="mt-2 text-3xl font-extrabold">{resumeHighlights.title}</h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{resumeHighlights.pitch}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={resumeHighlights.resumePdfPath}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            View Resume
          </a>
          <a
            href="#gallery"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Open Photo Dashboard
          </a>
          <a
            href="https://github.com/inezaodon"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Explore GitHub
          </a>
        </div>
      </section>

      <section id="projects">
        <h2 className="mb-2 text-2xl font-bold">Projects</h2>
        <p className="mb-4 text-slate-600 dark:text-slate-300">Start here: hands-on projects with real code and real outcomes.</p>
        <ProjectGrid projects={projects} />
      </section>

      <section id="resume" className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-2xl font-bold">Resume Highlights</h2>
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
              <article key={`${exp.role}-${exp.org}`} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
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
          <a href={resumeHighlights.resumePdfPath} target="_blank" rel="noreferrer" className="inline-block text-brand-600 hover:underline">
            Download full resume (PDF)
          </a>
        </div>

        <div className="space-y-4">
          <h2 id="gallery" className="text-2xl font-bold">Photo Dashboard</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Real moments, fun energy, and yes, a little chaos in the best way.</p>
          <PhotoSlideshow slides={slideshowSlides} />
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
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
        <h2 className="text-2xl font-bold">Research & Writing</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Selected papers hosted on this site, each with a short summary to make browsing easier.
        </p>
        <div className="grid gap-4">
          {papers.map((paper) => (
            <article key={paper.file} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{paper.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{paper.category}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{paper.summary}</p>
              <a href={paper.file} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-brand-600 hover:underline">
                Open PDF
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Latest Writing</h2>
          {posts.length ? (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <a href={post.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                    {post.title}
                  </a>
                  <p className="text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              <p className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                Live Dev.to posts are unavailable right now, so here are featured writings from this portfolio.
              </p>
              {papers.slice(0, 3).map((paper) => (
                <article key={paper.file} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
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
          <h2 className="text-2xl font-bold">Tech Stack</h2>
          <ul className="flex flex-wrap gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            {techStack.slice(0, 10).map((tech) => (
              <li key={tech.label} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                <i className={tech.iconClass} />
                <span className="capitalize">{tech.label}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold">Live Status</h2>
          <p className="text-slate-600 dark:text-slate-300">
            {presence?.data
              ? `Discord: ${presence.data.discord_status}${presence.data.listening_to_spotify && presence.data.spotify ? ` • Listening to ${presence.data.spotify.song} - ${presence.data.spotify.artist}` : ""}`
              : "Set NEXT_PUBLIC_DISCORD_ID to enable Lanyard live presence."}
          </p>

          <h2 className="text-2xl font-bold">GitHub Contributions</h2>
          <Image
            src={contributionsSvgUrl()}
            alt="GitHub contributions graph"
            width={720}
            height={120}
            className="w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800"
          />
        </div>
      </section>

      <div id="contact">
        <ContactForm />
      </div>
    </main>
  );
}
