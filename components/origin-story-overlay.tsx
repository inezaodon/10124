"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { originStory } from "@/lib/content";

const flavorStyles: Record<NonNullable<(typeof originStory.chapters)[0]["flavor"]>, string> = {
  meme: "border-amber-400/40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-500/15 dark:to-orange-500/10",
  turn: "border-teal-400/40 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 dark:from-teal-500/15 dark:to-cyan-500/10",
  future: "border-violet-400/35 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 dark:from-violet-500/15 dark:to-fuchsia-500/10",
  punch: "border-rose-400/50 bg-gradient-to-br from-rose-500/15 to-amber-500/10 dark:from-rose-500/20 dark:to-amber-500/10"
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
        className="group relative flex w-full max-w-lg flex-col items-start gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-teal-500/50 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-6 text-left shadow-md transition hover:scale-[1.01] hover:border-teal-500 hover:shadow-lg dark:from-zinc-800 dark:via-zinc-900 dark:to-teal-950/60 dark:hover:border-teal-400"
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
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Side quest (100% true)</span>
        <span className="relative text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">{originStory.launchCta}</span>
        <span className="relative text-sm text-slate-600 dark:text-zinc-400">{originStory.launchHint}</span>
        <span className="relative mt-3 inline-flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
          Enter the pipeline
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
            className="fixed inset-0 z-[100] flex items-stretch justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
              aria-label="Close story"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="relative m-0 flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl sm:m-4 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl"
              initial={reduceMotion ? false : { y: 48, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { y: 24, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                <div className="absolute -left-1/4 top-0 h-64 w-[150%] bg-gradient-to-r from-teal-500/20 via-transparent to-amber-500/15 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
              </div>

              <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md sm:px-5">
                <div className="min-w-0">
                  <p id={titleId} className="truncate font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal-400/90">
                    origin.exe — story_mode
                  </p>
                  <p className="truncate text-sm text-zinc-500">Rwanda → memes → ML (chronological chaos)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-xl border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-teal-500 hover:bg-zinc-800 hover:text-white"
                >
                  Close
                </button>
              </header>

              <div className="relative z-10 h-1 w-full shrink-0 bg-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-amber-400 transition-[width] duration-150 ease-out"
                  style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
                />
              </div>

              <div
                ref={scrollRef}
                onScroll={onScroll}
                className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 sm:px-8"
              >
                <p className="mb-10 font-mono text-xs uppercase tracking-widest text-zinc-500">Scroll. Reflect. Resume scrolling memes later.</p>

                <div className="space-y-10 pb-16">
                  {originStory.chapters.map((chapter, i) => (
                    <motion.article
                      key={chapter.id}
                      className={`relative rounded-2xl border p-5 sm:p-6 ${
                        chapter.flavor ? flavorStyles[chapter.flavor] : "border-zinc-700/60 bg-zinc-900/40"
                      }`}
                      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-2xl" aria-hidden>
                          {chapter.badge}
                        </span>
                        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                          Segment {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold leading-snug text-white sm:text-xl">{chapter.headline}</h3>
                      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-zinc-300">
                        {chapter.body.map((p, j) => (
                          <p key={`${chapter.id}-${j}`}>{p}</p>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>

                <div className="mb-8 rounded-2xl border border-dashed border-zinc-600 bg-zinc-900/50 p-5 text-center">
                  <p className="font-mono text-xs text-zinc-500">EOF — thanks for reading</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-4 rounded-xl bg-teal-500 px-6 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-teal-400"
                  >
                    Back to portfolio
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
