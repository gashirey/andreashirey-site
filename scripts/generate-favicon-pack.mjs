/**
 * Generate Andrea Shirey Photography "A" favicon pack into public/ + app/.
 * Run: node scripts/generate-favicon-pack.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public");

const BLACK = "#111111";
const WHITE = "#FFFFFF";
/** Hot corner badge — same on GG / ASP / Surge so local tabs read instantly */
const LOCAL_BADGE = "#FF2D55";

/**
 * Bold capital A — high-contrast for 16px tabs.
 * @param {number} size
 * @param {{ opaque?: boolean }} [opts]
 */
function letterASvg(size, opts = {}) {
  const opaque = opts.opaque === true;
  const pad = opaque ? 0 : size * 0.04;
  const radius = opaque ? 0 : size * 0.22;
  const w = size - pad * 2;
  const fontSize = w * 0.72;
  // Optical vertical center (capitals sit slightly high with dominant-baseline)
  const cy = pad + w * 0.54;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${pad}" y="${pad}" width="${w}" height="${w}" rx="${radius}" ry="${radius}" fill="${BLACK}"/>
  <text x="${pad + w / 2}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
    font-family="Georgia, 'Times New Roman', Times, serif" font-weight="700"
    font-size="${fontSize.toFixed(2)}" fill="${WHITE}">A</text>
</svg>`;
}

/** Minimal ICO with embedded PNG images. */
function pngBuffersToIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];

  for (const png of pngBuffers) {
    const meta = readPngSize(png);
    entries.push({
      width: meta.width >= 256 ? 0 : meta.width,
      height: meta.height >= 256 ? 0 : meta.height,
      size: png.length,
      offset,
      png,
    });
    offset += png.length;
  }

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);

  let entryAt = 6;
  for (const e of entries) {
    buf.writeUInt8(e.width, entryAt);
    buf.writeUInt8(e.height, entryAt + 1);
    buf.writeUInt8(0, entryAt + 2);
    buf.writeUInt8(0, entryAt + 3);
    buf.writeUInt16LE(1, entryAt + 4);
    buf.writeUInt16LE(32, entryAt + 6);
    buf.writeUInt32LE(e.size, entryAt + 8);
    buf.writeUInt32LE(e.offset, entryAt + 12);
    entryAt += 16;
  }

  for (const e of entries) {
    e.png.copy(buf, e.offset);
  }
  return buf;
}

function readPngSize(png) {
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

/** @param {number} size @param {{ opaque?: boolean }} [opts] */
async function renderPng(size, opts = {}) {
  const svg = Buffer.from(letterASvg(size, opts));
  return sharp(svg, { density: 288 })
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "favicon-a.svg"), letterASvg(512));

  /** @type {Array<[string, number, { opaque?: boolean }]>} */
  const sizes = [
    ["favicon-16x16.png", 16, {}],
    ["favicon-32x32.png", 32, {}],
    ["favicon-48x48.png", 48, {}],
    ["icon.png", 32, {}],
    ["apple-touch-icon.png", 180, { opaque: true }],
    ["icon-192.png", 192, {}],
    ["icon-512.png", 512, {}],
  ];

  /** @type {Record<string, Buffer>} */
  const pngs = {};
  for (const [name, size, opts] of sizes) {
    pngs[name] = await renderPng(size, opts);
    writeFileSync(join(outDir, name), pngs[name]);
    console.log(`wrote ${name} (${size}x${size}${opts.opaque ? ", opaque" : ""})`);
  }

  const ico = pngBuffersToIco([
    pngs["favicon-16x16.png"],
    pngs["favicon-32x32.png"],
    pngs["favicon-48x48.png"],
  ]);
  writeFileSync(join(outDir, "favicon.ico"), ico);
  console.log("wrote favicon.ico");

  const manifest = {
    name: "Andrea Shirey Photography",
    short_name: "ASP",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: BLACK,
    background_color: "#ffffff",
    display: "standalone",
  };
  writeFileSync(
    join(outDir, "site.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log("wrote site.webmanifest");

  // Prefer public/ + metadata icons (no app/favicon.ico) so localhost can swap packs.

  await writeLocalBadgePack(outDir, pngs, {
    name: "[local] Andrea Shirey Photography",
    short_name: "local",
    theme_color: LOCAL_BADGE,
    background_color: "#ffffff",
  });

  console.log(`\nA pack ready in ${outDir} (+ public/local badge pack)`);
  console.log(`Colors: black ${BLACK}, white ${WHITE}`);
}

/** @param {string} publicDir @param {Record<string, Buffer>} pngs */
async function writeLocalBadgePack(publicDir, pngs, manifestBase) {
  const localDir = join(publicDir, "local");
  mkdirSync(localDir, { recursive: true });

  async function badge(buf, size) {
    const r = Math.max(3, Math.round(size * 0.22));
    const cx = size - Math.round(size * 0.22);
    const cy = Math.round(size * 0.22);
    const ring = Math.max(1, Math.round(size * 0.04));
    const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${cx}" cy="${cy}" r="${r + ring}" fill="#FFFFFF"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${LOCAL_BADGE}"/>
</svg>`);
    return sharp(buf)
      .resize(size, size)
      .composite([{ input: await sharp(overlay).png().toBuffer(), top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  const localPngs = {};
  for (const [name, size] of [
    ["favicon-16x16.png", 16],
    ["favicon-32x32.png", 32],
    ["favicon-48x48.png", 48],
    ["icon.png", 32],
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
  ]) {
    const src = pngs[name] || pngs["icon-512.png"];
    localPngs[name] = await badge(src, size);
    writeFileSync(join(localDir, name), localPngs[name]);
  }

  const localIco = pngBuffersToIco([
    localPngs["favicon-16x16.png"],
    localPngs["favicon-32x32.png"],
    localPngs["favicon-48x48.png"],
  ]);
  writeFileSync(join(localDir, "favicon.ico"), localIco);

  writeFileSync(
    join(localDir, "site.webmanifest"),
    `${JSON.stringify(
      {
        ...manifestBase,
        icons: [
          { src: "/local/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/local/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        display: "standalone",
      },
      null,
      2,
    )}\n`,
  );
  console.log("wrote public/local/* (badged for localhost tabs)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
