# Farm inventory — Available Now

## Setup

1. Run `migrations/004_farm_inventory.sql` in Supabase SQL Editor (project must match `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`).
2. If you see **PGRST205 / schema cache** errors, run `migrations/005_farm_inventory_repair.sql` instead (then confirm with `select count(*) from farm_products;` — expect 7).
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

Add **today's availability** in admin before the public page shows items.
