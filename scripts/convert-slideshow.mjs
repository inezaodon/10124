/**
 * Build web-ready JPEGs without re-encoding existing JPG/JPEG (avoids quality loss / corruption).
 * - .jpg / .jpeg: copied to stem.jpg (normalized extension)
 * - .heic / .HEIC: converted with macOS `sips` (Sharp often lacks HEIC codecs here)
 * - .png / .webp: converted with Sharp → JPEG
 *
 * Run on macOS: npm run slideshow:build-jpegs
 */
import { execFileSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "public", "images", "slideshow");
const tmp = path.join(root, "public", "images", ".slideshow-out");

const IMAGE_RE = /\.(heic|HEIC|jpe?g|JPE?G|png|PNG|webp|WEBP)$/;

function extLower(p) {
  return path.extname(p).toLowerCase();
}

async function validateJpeg(fp) {
  try {
    const m = await sharp(fp, { failOn: "none" }).metadata();
    return Boolean(m.width && m.height && m.width > 32 && m.height > 32);
  } catch {
    return false;
  }
}

async function main() {
  await fs.rm(tmp, { recursive: true, force: true });
  await fs.mkdir(tmp, { recursive: true });

  const names = (await fs.readdir(dir)).filter((f) => IMAGE_RE.test(f) && !f.startsWith("."));
  const byStem = new Map();

  for (const n of names) {
    const stem = path.parse(n).name;
    if (!byStem.has(stem)) byStem.set(stem, []);
    const fp = path.join(dir, n);
    const st = await fs.stat(fp);
    byStem.get(stem).push({ name: n, fp, size: st.size, ext: extLower(fp) });
  }

  const failures = [];

  for (const [stem, variants] of byStem) {
    variants.sort((a, b) => b.size - a.size);
    const outPath = path.join(tmp, `${stem}.jpg`);
    let ok = false;

    for (const src of variants) {
      try {
        if (src.ext === ".jpg" || src.ext === ".jpeg") {
          await fs.copyFile(src.fp, outPath);
        } else if (src.ext === ".heic") {
          execFileSync("sips", ["-s", "format", "jpeg", src.fp, "--out", outPath], {
            stdio: "pipe",
            encoding: "utf8"
          });
        } else if (src.ext === ".png" || src.ext === ".webp") {
          await sharp(src.fp, { failOn: "none" }).rotate().jpeg({ quality: 93, mozjpeg: true }).toFile(outPath);
        } else {
          continue;
        }

        const st = await fs.stat(outPath);
        if (st.size < 5000) {
          await fs.rm(outPath, { force: true });
          throw new Error(`Output too small (${st.size} bytes)`);
        }
        if (!(await validateJpeg(outPath))) {
          await fs.rm(outPath, { force: true });
          throw new Error("Output failed image validation");
        }
        ok = true;
        break;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn(`try ${src.name}:`, msg);
      }
    }

    if (!ok) {
      failures.push(stem);
    }
  }

  const outs = await fs.readdir(tmp);
  if (!outs.length) {
    throw new Error("No slideshow JPEGs produced; leaving originals untouched.");
  }

  for (const n of await fs.readdir(dir)) {
    await fs.unlink(path.join(dir, n));
  }
  for (const n of outs) {
    await fs.rename(path.join(tmp, n), path.join(dir, n));
  }
  await fs.rm(tmp, { recursive: true, force: true });

  console.log("Slideshow JPEG count:", outs.length);
  if (failures.length) {
    console.warn("Stems that could not be converted:", failures.join(", "));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
