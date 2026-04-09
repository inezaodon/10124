"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
};

export function PhotoSlideshow({ slides, intervalMs = 3200 }: Props) {
  const [index, setIndex] = useState(0);

  const safeSlides = useMemo(() => (slides.length ? slides : []), [slides]);

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, safeSlides.length]);

  if (!safeSlides.length) return null;

  const active = safeSlides[index];

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
        <Image src={active.src} alt={active.alt} fill className="object-cover" sizes="(min-width: 1024px) 500px, 100vw" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{active.caption}</p>
      <div className="flex flex-wrap gap-2">
        {safeSlides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            aria-label={`Go to slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              slideIndex === index ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
