# Farm inventory — Available Now

## Setup

1. Run `migrations/004_farm_inventory.sql` in Supabase SQL Editor (project must match `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`).
2. If you see **PGRST205 / schema cache** errors, run `migrations/005_farm_inventory_repair.sql` instead (then confirm with `select count(*) from farm_products;` — expect 7).
3. If uploads fail with **Bucket not found**, run `migrations/009_storage_bucket_repair.sql` (creates public `product-photos` bucket).
4. If **Products** admin is empty, run `005_farm_inventory_repair.sql` or `011_farm_products_seed.sql`.
3. Set `ADMIN_PASSWORD` in `.env.local` and Vercel.
4. Open `/admin` and sign in.

## Daily workflow

1. **Admin → Today** (`/admin/availability`) — set bunches, price, status.
2. **Add listing** — pick product, date, price, stems, quantity.
3. **Products** — edit catalog + upload photos (Supabase Storage `product-photos` bucket).
4. Public page: `/available-now` (also embedded on `/flowers`).

## Image priority (public cards)

1. Availability primary photo  
2. Product primary photo  
3. First product photo  
4. Placeholder  

## Seed products

Migration 004 seeds: Zinnia Bunch, Dahlia Bunch, Sunflower Bunch, Mixed Farm Bouquet, Herbs, Eggs, Produce.

Add **today's availability** before the public page shows items.

### MVP — two flowers for today

**Option A — local script** (uses `.env.local`):

```bash
# Edit prices/qty in scripts/seed-mvp-availability.mjs first
node scripts/seed-mvp-availability.mjs
```

**Option B — Supabase SQL Editor:**

Run `migrations/006_mvp_availability_seed.sql` (zinnia + dahlia for today, Eastern time).

**Option C — Admin UI:**

1. `/admin` → sign in  
2. **Add listing** — pick product, set date to today, price, stems, bunches, status  
3. **Products** → upload a photo (or use script/SQL placeholder `/images/bb.jpg`)

Then open `/available-now` — you should see both listings.

## Media library (bulk upload in browser)

1. Run `migrations/008_media_library.sql` in Supabase SQL Editor.
2. Open **`/admin/media`** — create a shoot, drag in files, use **Use on site** on each image.
   Uploads are auto-resized (2400px max edge, JPEG ~82%) for fast page loads.
   Requires **`009_storage_bucket_repair.sql`** on production (bucket `product-photos`).
3. Site slots still need `007_site_media_slots.sql` for hero / home / about.

## Site images (hero, home, about) — launch today

1. Run `migrations/007_site_media_slots.sql` in Supabase SQL Editor (once).
2. **Admin → Site images** (`/admin/site`) — upload three picks from the shoot.
3. Or bulk upload then assign:

```bash
node scripts/bulk-upload-media.mjs ./YourShootFolder --shoot may-2026 \
  --set-slot hero=IMG_1234.jpg \
  --set-slot home_feature=IMG_5678.jpg \
  --set-slot about=IMG_9012.jpg

# Product card photos (slug from catalog):
node scripts/bulk-upload-media.mjs ./YourShootFolder --assign-product zinnia-bunch=IMG_zinnia.jpg
```

Manifest written to `shoot-upload-manifest.json` with all public URLs.
