import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { ProjectGrid } from "@/components/project-grid";
import { SiteHeader } from "@/components/site-header";
import {
  contributionsSvgUrl,
  getDevtoPosts,
  getDiscordPresence,
  getGitHubProjects,
  techIconMap
} from "@/lib/api";

export default async function HomePage() {
  const [projects, presence, posts] = await Promise.all([
    getGitHubProjects(),
    getDiscordPresence(),
    getDevtoPosts()
  ]);
  const techStack = techIconMap(projects.map((project) => project.language));

  return (
    <main className="mx-auto max-w-6xl space-y-14 px-6 py-10">
      <SiteHeader />

      <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
        <h2 className="text-2xl font-bold">Live Status</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          {presence?.data
            ? `Discord: ${presence.data.discord_status}${presence.data.listening_to_spotify && presence.data.spotify ? ` • Listening to ${presence.data.spotify.song} - ${presence.data.spotify.artist}` : ""}`
            : "Set NEXT_PUBLIC_DISCORD_ID to enable Lanyard live presence."}
        </p>
      </section>

      <section id="projects">
        <h2 className="mb-4 text-2xl font-bold">Projects</h2>
        <ProjectGrid projects={projects} />
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div id="writing" className="space-y-4">
          <h2 className="text-2xl font-bold">Latest Writing</h2>
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

          <h2 className="text-2xl font-bold">GitHub Contributions</h2>
          <Image
            src={contributionsSvgUrl()}
            alt="GitHub contributions graph"
            width={720}
            height={120}
            className="w-full rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800"
          />
          <div id="contact">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
