import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_PASSWORD",
];

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

function requireEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(", ")}`);
  }
}

function describeError(error) {
  return [error.code, error.message].filter(Boolean).join(" ");
}

async function check(label, task) {
  try {
    await task();
    console.log(`✓ ${label}`);
    return true;
  } catch (error) {
    console.error(`✗ ${label}`);
    console.error(`  ${error.message}`);
    return false;
  }
}

function throwIfError(error) {
  if (error) throw new Error(describeError(error));
}

loadEnvLocal();
requireEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const checks = [
  check("contacts tables are reachable", async () => {
    const { error } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true });
    throwIfError(error);
  }),
  check("farm product catalog is seeded", async () => {
    const { count, error } = await supabase
      .from("farm_products")
      .select("id", { count: "exact", head: true });
    throwIfError(error);

    if ((count ?? 0) < 7) {
      throw new Error(`Expected at least 7 farm products, found ${count ?? 0}`);
    }
  }),
  check("media library tables are reachable", async () => {
    const { error } = await supabase
      .from("media_shoots")
      .select("id", { count: "exact", head: true });
    throwIfError(error);
  }),
  check("site media slots are seeded", async () => {
    const { count, error } = await supabase
      .from("site_media_slots")
      .select("slot_key", { count: "exact", head: true });
    throwIfError(error);

    if ((count ?? 0) < 3) {
      throw new Error(`Expected at least 3 site media slots, found ${count ?? 0}`);
    }
  }),
  check("hero slides table is reachable", async () => {
    const { error } = await supabase
      .from("site_hero_slides")
      .select("id", { count: "exact", head: true });
    throwIfError(error);
  }),
  check("site settings include hero speed", async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_slide_interval_ms")
      .eq("id", "default")
      .single();
    throwIfError(error);

    if (typeof data?.hero_slide_interval_ms !== "number") {
      throw new Error("Missing site_settings.hero_slide_interval_ms");
    }
  }),
  check("product-photos bucket exists", async () => {
    const { data, error } = await supabase.storage.getBucket("product-photos");
    throwIfError(error);

    if (!data.public) {
      throw new Error("product-photos bucket exists but is not public");
    }
  }),
];

const results = await Promise.all(checks);
const failures = results.filter((ok) => !ok).length;

if (failures) {
  console.error(`\n${failures} Supabase setup check(s) failed.`);
  process.exit(1);
}

console.log("\nSupabase setup checks passed.");
