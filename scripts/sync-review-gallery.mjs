/**
 * Scan public/images/review/ and generate lib/gallery-review.generated.ts
 * for masonry gallery lazy-load testing.
 *
 *   npm run gallery:sync-review
 */

import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, extname, basename } from "node:path";
import sharp from "sharp";

const ROOT = resolve(process.cwd());
const REVIEW_DIR = join(ROOT, "public/images/review");
const OUT_FILE = join(ROOT, "lib/gallery-review.generated.ts");
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function slug(name) {
  return basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  if (!existsSync(REVIEW_DIR)) {
    console.error("Missing folder: public/images/review/");
    process.exit(1);
  }

  const files = readdirSync(REVIEW_DIR)
    .filter((f) => EXT.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) {
    console.log("No images in public/images/review/ — add files and run again.");
  }

  const entries = [];
  for (const file of files) {
    const src = `/images/review/${file}`;
    const full = join(REVIEW_DIR, file);
    const meta = await sharp(full).metadata();
    const width = meta.width ?? 1600;
    const height = meta.height ?? 1200;
    const id = `review-${slug(file)}`;
    entries.push({
      id,
      src,
      alt: `Review photograph — ${basename(file, extname(file))}`,
      width,
      height,
    });
  }

  const body = `/** Auto-generated — do not edit. Run: npm run gallery:sync-review */
import type { GalleryImage } from "@/lib/content";

export const reviewGalleryImages: GalleryImage[] = ${JSON.stringify(entries, null, 2)};
`;

  writeFileSync(OUT_FILE, body, "utf8");
  console.log(`Wrote ${entries.length} image(s) → lib/gallery-review.generated.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
