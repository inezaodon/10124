"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  slides: Slide[];
  /** How often the main image auto-advances */
  intervalMs?: number;
  /** How often the whole gallery order shuffles (thumbnails + sequence) */
  shuffleReorderMs?: number;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function slidesSignature(slides: Slide[]): string {
  return slides
    .map((s) => s.src)
    .sort()
    .join("\0");
}

export function PhotoSlideshow({ slides, intervalMs = 4000, shuffleReorderMs = 14000 }: Props) {
  const [orderedSlides, setOrderedSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sigRef = useRef("");

  const incoming = useMemo(() => (slides.length ? slides : []), [slides]);
  const incomingSig = useMemo(() => slidesSignature(incoming), [incoming]);

  useEffect(() => {
    if (incomingSig === sigRef.current) return;
    sigRef.current = incomingSig;
    setOrderedSlides(shuffle(incoming));
    setIndex(0);
  }, [incoming, incomingSig]);

  useEffect(() => {
    const n = orderedSlides.length;
    if (n < 2) return;
    const id = window.setInterval(() => {
      setOrderedSlides((prev) => (prev.length < 2 ? prev : shuffle([...prev])));
      setIndex(() => Math.floor(Math.random() * n));
    }, shuffleReorderMs);
    return () => window.clearInterval(id);
  }, [shuffleReorderMs, orderedSlides.length]);

  const go = useCallback(
    (next: number) => {
      if (!orderedSlides.length) return;
      const wrapped = ((next % orderedSlides.length) + orderedSlides.length) % orderedSlides.length;
      setIndex(wrapped);
    },
    [orderedSlides.length]
  );

  useEffect(() => {
    if (orderedSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % orderedSlides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, orderedSlides.length]);

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  if (!orderedSlides.length) return null;

  const active = orderedSlides[index];

  return (
    <div className="pop-glass-soft space-y-3 border-pink-200/50 p-5 shadow-lg shadow-pink-500/5 dark:border-pink-500/20">
      <p className="text-xs font-medium text-fuchsia-700/80 dark:text-fuchsia-300/90">
        Order shuffles on its own — thumbnails move too.
      </p>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 ring-2 ring-fuchsia-200/50 dark:from-violet-950/50 dark:to-fuchsia-950/50 dark:ring-fuchsia-500/30">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={active.src} alt={active.alt} fill className="object-cover" sizes="(min-width: 1024px) 500px, 100vw" priority={index === 0} />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 pt-10">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className="pointer-events-auto rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
          >
            Prev
          </button>
          <span className="pointer-events-none self-center rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white">
            {index + 1} / {orderedSlides.length}
          </span>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className="pointer-events-auto rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{active.caption}</p>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">All photos — order reshuffles</p>
        <motion.div layout className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5">
          {orderedSlides.map((slide, slideIndex) => (
            <motion.button
              layout
              key={slide.src}
              ref={(el) => {
                thumbRefs.current[slideIndex] = el;
              }}
              type="button"
              aria-label={`Photo ${slideIndex + 1} of ${orderedSlides.length}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                slideIndex === index
                  ? "border-fuchsia-500 ring-2 ring-fuchsia-400/40 dark:border-fuchsia-400"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={slide.src} alt="" fill className="object-cover" sizes="80px" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
