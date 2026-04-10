"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { originStory } from "@/lib/content";

const flavorStyles: Record<NonNullable<(typeof originStory.chapters)[0]["flavor"]>, string> = {
  meme: "border-amber-400/50 bg-white/55 dark:border-amber-400/35 dark:bg-zinc-900/45",
  turn: "border-teal-400/50 bg-white/55 dark:border-teal-400/35 dark:bg-zinc-900/45",
  future: "border-violet-400/45 bg-white/55 dark:border-violet-400/30 dark:bg-zinc-900/45",
  punch: "border-rose-400/50 bg-white/60 dark:border-rose-400/40 dark:bg-zinc-900/50"
};


export function OriginStoryLauncher() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 1);
  }, []);

  useEffect(() => {
    if (!open) return;
    onScroll();
  }, [open, onScroll]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex w-full max-w-xl flex-col items-start gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-teal-500/50 bg-gradient-to-br from-amber-50/95 via-white to-teal-50/95 p-6 text-left shadow-md transition hover:scale-[1.01] hover:border-teal-500 hover:shadow-lg dark:from-zinc-800 dark:via-zinc-900 dark:to-teal-950/60 dark:hover:border-teal-400"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
      >
        <span
          className="pointer-events-none absolute -right-8 -top-8 text-7xl opacity-[0.12] transition group-hover:rotate-12 group-hover:opacity-20"
          aria-hidden
        >
          🧠
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Personal story</span>
        <span className="relative text-base font-bold leading-snug text-slate-900 dark:text-zinc-50 sm:text-lg">
          {originStory.launchCta}
        </span>
        <span className="relative text-sm text-slate-600 dark:text-zinc-400">{originStory.launchHint}</span>
        <span className="relative mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
          Read the story
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {/* Frosted full-screen layer: main page stays visible behind the blur */}
            <motion.div
              className="flex h-full min-h-0 w-full flex-col border border-white/25 bg-white/45 shadow-2xl backdrop-blur-lg dark:border-zinc-600/35 dark:bg-zinc-950/40"
              initial={reduceMotion ? false : { opacity: 0.92 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <header className="relative z-10 flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200/80 bg-white/40 px-3 py-3 backdrop-blur-md dark:border-zinc-700/60 dark:bg-zinc-950/35 sm:px-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:border-teal-500 hover:bg-white dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-100 dark:hover:border-teal-400"
                >
                  <span aria-hidden className="text-lg leading-none">
                    ←
                  </span>
                  Back to main page
                </button>
                <div className="min-w-0 flex-1">
                  <p id={titleId} className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400 sm:text-xs">
                    My path into CS
                  </p>
                  <p className="hidden truncate text-xs text-slate-600 dark:text-zinc-400 sm:block">
                    Rwanda → memes → ML (you can still see the portfolio behind this panel)
                  </p>
                </div>
              </header>

              <div className="relative z-10 h-1 w-full shrink-0 bg-slate-200/80 dark:bg-zinc-800/80">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-amber-400 transition-[width] duration-150 ease-out"
                  style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
                />
              </div>

              <div
                ref={scrollRef}
                onScroll={onScroll}
                className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-8 sm:py-8"
              >
                <p className="mb-8 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                  Scroll to read — then use Back to return to the homepage.
                </p>

                <div className="mx-auto max-w-2xl space-y-10 pb-12">
                  {originStory.chapters.map((chapter, i) => (
                    <motion.article
                      key={chapter.id}
                      className={`relative rounded-2xl border p-5 shadow-sm backdrop-blur-sm sm:p-6 ${
                        chapter.flavor ? flavorStyles[chapter.flavor] : "border-slate-200/80 bg-white/50 dark:border-zinc-700/60 dark:bg-zinc-900/40"
                      }`}
                      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-2xl" aria-hidden>
                          {chapter.badge}
                        </span>
                        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                          Segment {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold leading-snug text-slate-900 dark:text-white sm:text-xl">
                        {chapter.headline}
                      </h3>
                      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate-700 dark:text-zinc-300">
                        {chapter.body.map((p, j) => (
                          <p key={`${chapter.id}-${j}`}>{p}</p>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-dashed border-slate-300/90 bg-white/45 p-5 text-center backdrop-blur-sm dark:border-zinc-600 dark:bg-zinc-900/40">
                  <p className="font-mono text-xs text-slate-500 dark:text-zinc-500">End of story</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-teal-500 dark:bg-teal-500 dark:text-zinc-950 dark:hover:bg-teal-400"
                  >
                    <span aria-hidden>←</span> Back to main page
                  </button>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
