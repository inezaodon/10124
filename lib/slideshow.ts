import fs from "fs/promises";
import path from "path";
import { slideshowCaptionFallbacks, slideshowCaptionOverrides } from "@/lib/content";

export type SlideshowSlide = {
  src: string;
  alt: string;
  caption: string;
};

function isSlideshowImage(filename: string): boolean {
  return /\.jpe?g$/i.test(filename);
}

export async function getSlideshowSlides(): Promise<SlideshowSlide[]> {
  const dir = path.join(process.cwd(), "public", "images", "slideshow");
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }

  const files = names.filter(isSlideshowImage).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return files.map((filename, index) => {
    const override = slideshowCaptionOverrides[filename];
    const caption =
      override ??
      slideshowCaptionFallbacks[index % slideshowCaptionFallbacks.length] ??
      "A moment worth keeping on repeat.";

    const label = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

    return {
      src: `/images/slideshow/${filename}`,
      alt: `Gallery photo: ${label}`,
      caption
    };
  });
}
