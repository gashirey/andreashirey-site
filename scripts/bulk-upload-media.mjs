/**
 * Bulk-upload a shoot folder to Supabase Storage.
 *
 *   node scripts/bulk-upload-media.mjs ./path/to/shoot
 *   node scripts/bulk-upload-media.mjs ./shoot --shoot may-2026
 *   node scripts/bulk-upload-media.mjs ./shoot --set-slot hero=IMG_001.jpg
 *   node scripts/bulk-upload-media.mjs ./shoot --assign-product zinnia=IMG_002.jpg
 *
 * Writes ./shoot-upload-manifest.json with public URLs.
 * Requires .env.local and migration 007 for --set-slot.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, join, relative } from "node:path";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const BUCKET = "product-photos";
const CONCURRENCY = 4;

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function walkImages(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...walkImages(full));
      continue;
    }
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    if (IMAGE_EXT.has(ext)) files.push(full);
  }
  return files;
}

function parseFlags(argv) {
  const flags = { shoot: "shoot", setSlot: [], assignProduct: [] };
  const paths = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--shoot") flags.shoot = argv[++i] ?? "shoot";
    else if (a === "--set-slot") {
      const pair = argv[++i] ?? "";
      const eq = pair.indexOf("=");
      if (eq > 0) flags.setSlot.push([pair.slice(0, eq), pair.slice(eq + 1)]);
    } else if (a === "--assign-product") {
      const pair = argv[++i] ?? "";
      const eq = pair.indexOf("=");
      if (eq > 0) flags.assignProduct.push([pair.slice(0, eq), pair.slice(eq + 1)]);
    } else if (!a.startsWith("--")) paths.push(a);
  }
  return { flags, dir: paths[0] };
}

async function uploadOne(supabase, localPath, storagePrefix) {
  const name = localPath.split("/").pop();
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const storagePath = `${storagePrefix}/${name.replace(/[^a-zA-Z0-9._-]+/g, "-")}`;

  const buffer = readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
    upsert: true,
  });

  if (error) return { error: error.message, localPath, name };
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { localPath, name, storagePath, publicUrl: data.publicUrl };
}

async function pool(items, fn, limit) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

function findByFilename(manifest, filename) {
  const base = filename.toLowerCase();
  return manifest.find(
    (m) =>
      m.name?.toLowerCase() === base ||
      m.name?.toLowerCase().includes(base.replace(/\.[^.]+$/, "")),
  );
}

loadEnvLocal();
const { flags, dir } = parseFlags(process.argv.slice(2));

if (!dir || !existsSync(dir)) {
  console.error("Usage: node scripts/bulk-upload-media.mjs <folder> [--shoot name] [--set-slot hero=file.jpg]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const files = walkImages(resolve(dir));
if (!files.length) {
  console.error("No images found in", dir);
  process.exit(1);
}

const prefix = `library/${flags.shoot}`;
console.log(`Uploading ${files.length} files → ${BUCKET}/${prefix}/ …\n`);

const manifest = await pool(
  files,
  (f) => uploadOne(supabase, f, prefix),
  CONCURRENCY,
);

const ok = manifest.filter((m) => m.publicUrl);
const failed = manifest.filter((m) => m.error);

for (const m of ok) {
  console.log(`  ✓ ${relative(dir, m.localPath)}`);
}
for (const m of failed) {
  console.error(`  ✗ ${m.localPath}: ${m.error}`);
}

const outPath = resolve(process.cwd(), "shoot-upload-manifest.json");
writeFileSync(
  outPath,
  JSON.stringify(
    {
      shoot: flags.shoot,
      uploadedAt: new Date().toISOString(),
      files: ok.map((m) => ({
        name: m.name,
        localPath: m.localPath,
        storagePath: m.storagePath,
        publicUrl: m.publicUrl,
      })),
    },
    null,
    2,
  ),
);
console.log(`\nManifest: ${outPath}`);

for (const [slot, filename] of flags.setSlot) {
  const hit = findByFilename(ok, filename);
  if (!hit) {
    console.error(`--set-slot: no upload matched ${filename}`);
    continue;
  }
  const { error } = await supabase.from("site_media_slots").upsert({
    slot_key: slot,
    image_url: hit.publicUrl,
    alt_text: hit.name.replace(/\.[^.]+$/, ""),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error(`  slot ${slot}: ${error.message} (run migration 007?)`);
  } else {
    console.log(`  → site slot "${slot}" set`);
  }
}

for (const [slug, filename] of flags.assignProduct) {
  const hit = findByFilename(ok, filename);
  if (!hit) {
    console.error(`--assign-product: no upload matched ${filename}`);
    continue;
  }
  const { data: product } = await supabase
    .from("farm_products")
    .select("id, name")
    .eq("slug", slug)
    .maybeSingle();
  if (!product) {
    console.error(`  product slug not found: ${slug}`);
    continue;
  }
  const { count } = await supabase
    .from("farm_product_photos")
    .select("id", { count: "exact", head: true })
    .eq("product_id", product.id)
    .is("availability_id", null);
  const { error } = await supabase.from("farm_product_photos").insert({
    product_id: product.id,
    image_url: hit.publicUrl,
    alt_text: product.name,
    is_primary: !count,
    display_order: 10,
  });
  if (error) console.error(`  ${slug}: ${error.message}`);
  else console.log(`  → product "${slug}" photo added`);
}

console.log("\nNext: /admin/site for hero / home / about, /admin/products for more assignments.");
