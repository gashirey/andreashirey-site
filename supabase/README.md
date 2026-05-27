# Supabase Setup

Use this when moving Andrea Shirey Photography to its own Supabase project instead of the copied Grey Gables project.

## 1. Create the Andrea project

1. Create a new project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the project URL and the server-only secret/service-role key.
3. Do not reuse the Grey Gables project URL or key.

## 2. Run the required migrations

For a clean Andrea project, the easiest option is to open
`supabase/migrations/000_andrea_full_setup.sql`, copy the full file into
Supabase **SQL Editor**, and run it once. The file combines the required app
migrations below in dependency order and is safe to retry where the underlying
statements support it.

If you prefer to run the individual files instead, run these files in **SQL
Editor** in this exact order:

1. `supabase/migrations/002_unified_contacts.sql`
2. `supabase/migrations/004_farm_inventory.sql`
3. `supabase/migrations/007_site_media_slots.sql`
4. `supabase/migrations/008_media_library.sql`
5. `supabase/migrations/009_storage_bucket_repair.sql`
6. `supabase/migrations/010_site_hero_slides.sql`
7. `supabase/migrations/012_site_cms.sql`
8. `supabase/migrations/013_site_typography.sql`
9. `supabase/migrations/014_hero_slider_speed.sql`

This creates contacts, farm product availability, media library tables, CMS/navigation settings, hero slides, the `hero_slide_interval_ms` setting, and the public `product-photos` storage bucket.

## 3. Skip or reserve these migrations

- `001_mailing_and_sms_lists.sql` is only for the old separate Grey Gables mailing/SMS list schema.
- `003_migrate_legacy_lists.sql` is only for importing rows from those old legacy tables.
- `005_farm_inventory_repair.sql` is a repair fallback if `004` partially failed or PostgREST reports `PGRST205`.
- `006_mvp_availability_seed.sql` creates demo availability for today. Run only if you want launch/test listings.
- `011_farm_products_seed.sql` is a safe reseed if `farm_products` is unexpectedly empty.

## 4. Set environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-secret
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=optional-stable-cookie-signing-secret
```

Add the same variables in **Vercel → Project → Settings → Environment Variables** for Production, Preview, and Development as needed. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or screenshots.

## 5. Verify the setup

After `.env.local` points to the Andrea project, run:

```bash
npm run supabase:check
```

You can also verify in SQL Editor:

```sql
select count(*) from public.farm_products; -- expect at least 7
select slot_key from public.site_media_slots order by slot_key;
select hero_slide_interval_ms from public.site_settings where id = 'default';
select id, public from storage.buckets where id = 'product-photos';
```

## CLI notes

No Supabase CLI project config is committed here, and `supabase db push` would apply every migration file, including legacy/optional seed files. For a clean Andrea project, prefer the SQL Editor order above unless you intentionally want the legacy/demo migrations too.
