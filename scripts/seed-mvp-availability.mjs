/**
 * Seed today's flower availability for MVP launch.
 *
 * Usage:
 *   node scripts/seed-mvp-availability.mjs
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Edit LISTINGS below with your real prices and quantities.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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

function todayFarmDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
}

/** Edit these before running — slugs must exist in farm_products (from migration 004). */
const LISTINGS = [
  {
    slug: "zinnia-bunch",
    bunch_price: 18,
    stems_per_bunch: 12,
    bunches_available: 8,
    status: "available",
    display_order: 10,
    notes: "Mixed colors from the cutting garden.",
    photo: "/images/bb.jpg",
  },
  {
    slug: "dahlia-bunch",
    bunch_price: 24,
    stems_per_bunch: 5,
    bunches_available: 4,
    status: "limited",
    display_order: 20,
    notes: "Seasonal varieties — changes weekly.",
    photo: "/images/bb.jpg",
  },
];

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const availableDate = todayFarmDate();

async function main() {
  const { data: products, error: productsError } = await supabase
    .from("farm_products")
    .select("id, slug, name")
    .in(
      "slug",
      LISTINGS.map((l) => l.slug),
    );

  if (productsError) {
    console.error("Could not read farm_products:", productsError.message);
    if (productsError.code === "PGRST205") {
      console.error(
        "\nRun supabase/migrations/004_farm_inventory.sql (or 005_farm_inventory_repair.sql) in the Supabase SQL Editor first.",
      );
    }
    process.exit(1);
  }

  const bySlug = new Map((products ?? []).map((p) => [p.slug, p]));
  const missing = LISTINGS.filter((l) => !bySlug.has(l.slug));
  if (missing.length) {
    console.error(
      "Missing products in database:",
      missing.map((m) => m.slug).join(", "),
    );
    console.error("Run migration 004/005 first.");
    process.exit(1);
  }

  console.log(`Seeding availability for ${availableDate} (America/New_York)…\n`);

  for (const listing of LISTINGS) {
    const product = bySlug.get(listing.slug);

    const { data: existing } = await supabase
      .from("farm_product_availability")
      .select("id")
      .eq("product_id", product.id)
      .eq("available_date", availableDate)
      .maybeSingle();

    let availabilityId = existing?.id;

    if (availabilityId) {
      const { error: updateError } = await supabase
        .from("farm_product_availability")
        .update({
          status: listing.status,
          bunch_price: listing.bunch_price,
          stems_per_bunch: listing.stems_per_bunch,
          bunches_available: listing.bunches_available,
          notes: listing.notes,
          display_order: listing.display_order,
          show_on_website: true,
          harvest_date: availableDate,
        })
        .eq("id", availabilityId);

      if (updateError) {
        console.error(`  ✗ ${listing.slug}: ${updateError.message}`);
        continue;
      }
      console.log(`  ↻ ${product.name} — updated existing listing`);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("farm_product_availability")
        .insert({
          product_id: product.id,
          available_date: availableDate,
          status: listing.status,
          bunch_price: listing.bunch_price,
          stems_per_bunch: listing.stems_per_bunch,
          bunches_available: listing.bunches_available,
          notes: listing.notes,
          display_order: listing.display_order,
          show_on_website: true,
          harvest_date: availableDate,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error(`  ✗ ${listing.slug}: ${insertError.message}`);
        continue;
      }
      availabilityId = inserted.id;
      console.log(
        `  ✓ ${product.name} — $${listing.bunch_price}, ${listing.bunches_available} bunches`,
      );
    }

    const { count } = await supabase
      .from("farm_product_photos")
      .select("id", { count: "exact", head: true })
      .eq("product_id", product.id)
      .is("availability_id", null);

    if (!count) {
      await supabase.from("farm_product_photos").insert({
        product_id: product.id,
        image_url: listing.photo,
        alt_text: product.name,
        is_primary: true,
        display_order: 10,
      });
      console.log(`    + photo ${listing.photo}`);
    }
  }

  console.log("\nDone. Check /available-now and /admin/availability");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
