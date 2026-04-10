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
  const stripRef = useRef<HTMLDivElement | null>(null);
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

  /** Scroll only the thumbnail strip horizontally; never scrollIntoView (that pulls the whole page). */
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];
    if (!strip || !thumb) return;

    const align = () => {
      const s = stripRef.current;
      const t = thumbRefs.current[index];
      if (!s || !t) return;
      const stripRect = s.getBoundingClientRect();
      const thumbRect = t.getBoundingClientRect();
      const thumbCenter = thumbRect.left + thumbRect.width / 2;
      const stripCenter = stripRect.left + stripRect.width / 2;
      s.scrollBy({ left: thumbCenter - stripCenter, behavior: "auto" });
    };

    requestAnimationFrame(align);
  }, [index]);

  if (!orderedSlides.length) return null;

  const active = orderedSlides[index];

  return (
    <div className="pop-glass-soft space-y-3 p-5">
      <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">
        Order shuffles on its own; thumbnails move too.
      </p>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-300/80 dark:bg-zinc-800 dark:ring-zinc-600">
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
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">All photos (order reshuffles)</p>
        <div ref={stripRef} className="-mx-1 flex gap-2 overflow-x-auto overflow-y-hidden pb-1 pt-0.5 [overflow-anchor:none]">
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
                  ? "border-teal-600 ring-2 ring-teal-500/30 dark:border-teal-400 dark:ring-teal-400/25"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={slide.src} alt="" fill className="object-cover" sizes="80px" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
