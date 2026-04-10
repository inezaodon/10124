"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { originStory } from "@/lib/content";

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
    // Schedule initial progress update to avoid setState-in-effect lint.
    requestAnimationFrame(() => onScroll());
  }, [open, onScroll]);

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
                  <p className="hidden text-xs leading-snug text-slate-600 dark:text-zinc-400 sm:block">
                    One continuous essay. The page behind stays visible through the glass.
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
                className="relative z-10 min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden px-4 py-6 pb-[max(3rem,env(safe-area-inset-bottom,0px))] sm:px-8 sm:py-8 sm:pb-[max(4rem,env(safe-area-inset-bottom,0px))]"
              >
                <p className="mb-8 font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                  Scroll to read. Use Back when you are done.
                </p>

                <motion.article
                  className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white/50 p-6 pb-8 shadow-sm backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/40 sm:p-8 sm:pb-10"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="space-y-5 pb-2 text-[15px] leading-[1.75] text-slate-800 dark:text-zinc-200">
                    {originStory.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </motion.article>

                <div className="mx-auto mb-0 mt-12 max-w-2xl rounded-2xl border border-dashed border-slate-300/90 bg-white/45 p-5 text-center backdrop-blur-sm dark:border-zinc-600 dark:bg-zinc-900/40">
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
