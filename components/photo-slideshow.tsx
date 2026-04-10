"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
};

export function PhotoSlideshow({ slides, intervalMs = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const safeSlides = useMemo(() => (slides.length ? slides : []), [slides]);

  useEffect(() => {
    setIndex((current) => (safeSlides.length ? Math.min(current, safeSlides.length - 1) : 0));
  }, [safeSlides.length]);

  const go = useCallback(
    (next: number) => {
      if (!safeSlides.length) return;
      const wrapped = ((next % safeSlides.length) + safeSlides.length) % safeSlides.length;
      setIndex(wrapped);
    },
    [safeSlides.length]
  );

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, safeSlides.length]);

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  if (!safeSlides.length) return null;

  const active = safeSlides[index];

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
        <Image src={active.src} alt={active.alt} fill className="object-cover" sizes="(min-width: 1024px) 500px, 100vw" priority={index === 0} />
        <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-3 pt-10">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(index - 1)}
            className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
          >
            Prev
          </button>
          <span className="self-center rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white">
            {index + 1} / {safeSlides.length}
          </span>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(index + 1)}
            className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{active.caption}</p>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">All photos — tap a thumbnail</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-0.5">
          {safeSlides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              ref={(el) => {
                thumbRefs.current[slideIndex] = el;
              }}
              type="button"
              aria-label={`Photo ${slideIndex + 1} of ${safeSlides.length}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                slideIndex === index ? "border-brand-600 ring-2 ring-brand-500/30" : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={slide.src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
