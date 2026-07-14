-- Andrea Shirey Photography — consolidated Supabase setup
--
-- Use this file for a fresh Andrea Supabase project when running setup manually
-- in the Supabase SQL Editor. It combines the required application migrations in
-- dependency order:
--
--   002_unified_contacts.sql
--   004_farm_inventory.sql
--   007_site_media_slots.sql
--   008_media_library.sql
--   009_storage_bucket_repair.sql
--   010_site_hero_slides.sql
--   012_site_cms.sql
--   013_site_typography.sql
--   014_hero_slider_speed.sql
--
-- The original migration statements are preserved except for small idempotency
-- guards around enum/policy creation so the full setup can be safely retried.

-- ============================================================================
-- 002_unified_contacts.sql
-- ============================================================================

-- Grey Gables Farm — unified contacts (replaces separate mailing/SMS lists)
-- Run after 001, or on a fresh project instead of 001.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- contacts — one person, channel opt-ins as attributes
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  full_name text,
  email text,
  phone text,
  preferred_contact_method text,
  email_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  email_opt_in_at timestamptz,
  sms_opt_in_at timestamptz,
  source text not null default 'website',
  customer_type text,
  notes text,
  needs_review boolean not null default false,
  review_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_lower check (email is null or email = lower(email)),
  constraint contacts_email_format check (
    email is null
    or email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  ),
  constraint contacts_phone_e164 check (
    phone is null or phone ~ '^\+[1-9]\d{7,14}$'
  ),
  constraint contacts_preferred_method check (
    preferred_contact_method is null
    or preferred_contact_method in ('email', 'sms', 'either')
  ),
  constraint contacts_has_channel check (email is not null or phone is not null)
);

create unique index if not exists contacts_email_unique_idx
  on public.contacts (lower(email))
  where email is not null;

create unique index if not exists contacts_phone_unique_idx
  on public.contacts (phone)
  where phone is not null;

create index if not exists contacts_source_idx on public.contacts (source);
create index if not exists contacts_email_opt_in_idx
  on public.contacts (email_opt_in)
  where email_opt_in = true;
create index if not exists contacts_sms_opt_in_idx
  on public.contacts (sms_opt_in)
  where sms_opt_in = true;
create index if not exists contacts_needs_review_idx
  on public.contacts (needs_review)
  where needs_review = true;

-- ---------------------------------------------------------------------------
-- contact_tags — segmentation (wedding_inquiry, flowers, newsletter, …)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_tags (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  constraint contact_tags_tag_format check (
    tag ~ '^[a-z][a-z0-9_]*$'
  ),
  constraint contact_tags_unique unique (contact_id, tag)
);

create index if not exists contact_tags_tag_idx on public.contact_tags (tag);

-- ---------------------------------------------------------------------------
-- contact_activity — lightweight audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.contact_activity (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  activity_type text not null,
  activity_detail text,
  source text,
  created_at timestamptz not null default now(),
  constraint contact_activity_type_format check (
    activity_type ~ '^[a-z][a-z0-9_]*$'
  )
);

create index if not exists contact_activity_contact_idx
  on public.contact_activity (contact_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_updated_at on public.contacts;
create trigger contacts_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — service role via API routes only
-- ---------------------------------------------------------------------------
alter table public.contacts enable row level security;
alter table public.contact_tags enable row level security;
alter table public.contact_activity enable row level security;

comment on table public.contacts is 'Unified farm contacts; email/SMS are opt-in attributes';
comment on table public.contact_tags is 'Tags for dynamic segmentation (wedding_inquiry, flowers, …)';
comment on table public.contact_activity is 'Contact timeline (form_submitted, opt-ins, …)';

-- ============================================================================
-- 004_farm_inventory.sql
-- ============================================================================

-- Grey Gables Farm — products, daily availability, photos

do $$
begin
  create type public.availability_status as enum (
    'available',
    'limited',
    'sold_out',
    'hidden'
  );
exception
  when duplicate_object then null;
end;
$$;

-- ---------------------------------------------------------------------------
-- farm_products — reusable product catalog
-- ---------------------------------------------------------------------------
create table if not exists public.farm_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  category text not null default 'flowers',
  description text,
  variety text,
  color text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint farm_products_slug_unique unique (slug),
  constraint farm_products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists farm_products_category_idx on public.farm_products (category);
create index if not exists farm_products_active_idx on public.farm_products (is_active);

-- ---------------------------------------------------------------------------
-- farm_product_availability — what is for sale on a given day
-- ---------------------------------------------------------------------------
create table if not exists public.farm_product_availability (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.farm_products (id) on delete cascade,
  available_date date not null,
  status public.availability_status not null default 'available',
  bunch_price numeric(8, 2) not null,
  stems_per_bunch int not null,
  bunches_available int not null default 0,
  harvest_date date,
  notes text,
  display_order int not null default 100,
  show_on_website boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint farm_availability_stems_positive check (stems_per_bunch > 0),
  constraint farm_availability_price_positive check (bunch_price >= 0),
  constraint farm_availability_bunches_nonnegative check (bunches_available >= 0)
);

create index if not exists farm_availability_date_idx
  on public.farm_product_availability (available_date desc);
create index if not exists farm_availability_product_date_idx
  on public.farm_product_availability (product_id, available_date desc);
create index if not exists farm_availability_show_idx
  on public.farm_product_availability (available_date, show_on_website, status);

-- ---------------------------------------------------------------------------
-- farm_product_photos — product defaults + optional per-day overrides
-- ---------------------------------------------------------------------------
create table if not exists public.farm_product_photos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.farm_products (id) on delete cascade,
  availability_id uuid references public.farm_product_availability (id) on delete cascade,
  image_url text not null,
  alt_text text,
  is_primary boolean not null default false,
  display_order int not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists farm_photos_product_idx
  on public.farm_product_photos (product_id);
create index if not exists farm_photos_availability_idx
  on public.farm_product_photos (availability_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists farm_products_updated_at on public.farm_products;
create trigger farm_products_updated_at
  before update on public.farm_products
  for each row execute function public.set_updated_at();

drop trigger if exists farm_availability_updated_at on public.farm_product_availability;
create trigger farm_availability_updated_at
  before update on public.farm_product_availability
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — public read via anon for available items; writes via service role API
-- ---------------------------------------------------------------------------
alter table public.farm_products enable row level security;
alter table public.farm_product_availability enable row level security;
alter table public.farm_product_photos enable row level security;

drop policy if exists "Public read active products" on public.farm_products;
create policy "Public read active products"
  on public.farm_products for select
  using (is_active = true);

drop policy if exists "Public read website availability" on public.farm_product_availability;
create policy "Public read website availability"
  on public.farm_product_availability for select
  using (
    show_on_website = true
    and status in ('available', 'limited')
  );

drop policy if exists "Public read product photos" on public.farm_product_photos;
create policy "Public read product photos"
  on public.farm_product_photos for select
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product photos (public read)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos',
  'product-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Public read product photos storage" on storage.objects;
create policy "Public read product photos storage"
  on storage.objects for select
  using (bucket_id = 'product-photos');

-- ---------------------------------------------------------------------------
-- Seed products (no availability — add via admin for today)
-- ---------------------------------------------------------------------------
insert into public.farm_products (name, slug, category, description, variety, is_active)
values
  (
    'Zinnia Bunch',
    'zinnia-bunch',
    'flowers',
    'Colorful mixed zinnias, hand-gathered from the cutting garden.',
    'Mixed zinnias',
    true
  ),
  (
    'Dahlia Bunch',
    'dahlia-bunch',
    'flowers',
    'Seasonal dahlias — varieties change with the week.',
    'Seasonal mix',
    true
  ),
  (
    'Sunflower Bunch',
    'sunflower-bunch',
    'flowers',
    'Cheerful sunflowers, cut fresh for your table.',
    'Sunflowers',
    true
  ),
  (
    'Mixed Farm Bouquet',
    'mixed-farm-bouquet',
    'flowers',
    'A hand-tied mix of the best blooms in the field today.',
    null,
    true
  ),
  (
    'Herbs',
    'herbs',
    'produce',
    'Fresh culinary herbs from the garden.',
    null,
    true
  ),
  (
    'Eggs',
    'eggs',
    'eggs',
    'Farm eggs when available — quantity varies.',
    null,
    true
  ),
  (
    'Produce',
    'produce',
    'produce',
    'Seasonal vegetables and fruit from the farm.',
    null,
    true
  )
on conflict (slug) do nothing;

comment on table public.farm_products is 'Reusable farm product catalog';
comment on table public.farm_product_availability is 'Daily availability, pricing, and quantity';
comment on table public.farm_product_photos is 'Product and per-day photos';

-- ============================================================================
-- 007_site_media_slots.sql
-- ============================================================================

-- Editable marketing images (hero, home feature, about) — Phase 0 site slots

create table if not exists public.site_media_slots (
  slot_key text primary key,
  image_url text not null,
  alt_text text,
  updated_at timestamptz not null default now(),
  constraint site_media_slots_key_format check (
    slot_key ~ '^[a-z][a-z0-9_]*$'
  )
);

alter table public.site_media_slots enable row level security;

drop policy if exists "Public read site media slots" on public.site_media_slots;
create policy "Public read site media slots"
  on public.site_media_slots for select using (true);

-- Defaults match current static assets until you upload from the shoot
insert into public.site_media_slots (slot_key, image_url, alt_text)
values
  (
    'hero',
    '/images/hero.jpg',
    'Cut flowers at Grey Gables Farm, Louisa Virginia'
  ),
  (
    'home_feature',
    '/images/bb.jpg',
    'Seasonal cut flowers from Grey Gables Farm'
  ),
  (
    'about',
    '/images/garden_row.jpg',
    'Cutting garden at Grey Gables Farm'
  )
on conflict (slot_key) do nothing;

comment on table public.site_media_slots is 'Public site image slots (hero, home feature, about)';

-- ============================================================================
-- 008_media_library.sql
-- ============================================================================

-- Media library: shoots + uploaded assets (admin bulk upload)

create table if not exists public.media_shoots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shot_on date,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  shoot_id uuid references public.media_shoots (id) on delete set null,
  storage_path text not null,
  public_url text not null,
  filename text not null,
  alt_text text,
  in_gallery boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists media_assets_shoot_created_idx
  on public.media_assets (shoot_id, created_at desc);

create index if not exists media_assets_in_gallery_created_idx
  on public.media_assets (in_gallery, created_at desc)
  where in_gallery = true;

alter table public.media_shoots enable row level security;
alter table public.media_assets enable row level security;

-- Admin APIs use service role; no public policies on these tables.

insert into public.media_shoots (name, shot_on)
select 'Default shoot', (timezone('America/New_York', now()))::date
where not exists (select 1 from public.media_shoots limit 1);

comment on table public.media_shoots is 'Photo shoot / upload session grouping';
comment on table public.media_assets is 'Uploaded images in the media library';

alter table public.media_assets
  add column if not exists in_gallery boolean not null default false;

create index if not exists media_assets_in_gallery_created_idx
  on public.media_assets (in_gallery, created_at desc)
  where in_gallery = true;

comment on column public.media_assets.in_gallery is
  'When true, asset appears on the public Work gallery (/gallery)';

notify pgrst, 'reload schema';

-- ============================================================================
-- 009_storage_bucket_repair.sql
-- ============================================================================

-- Storage bucket for admin uploads (media library, products, site images).
-- Run in Supabase SQL Editor if uploads fail with "Bucket not found".
-- Safe to re-run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos',
  'product-photos',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product photos storage" on storage.objects;
create policy "Public read product photos storage"
  on storage.objects for select
  using (bucket_id = 'product-photos');

-- ============================================================================
-- 010_site_hero_slides.sql
-- ============================================================================

-- Optional hero carousel (slow crossfade on homepage when 2+ slides exist)

create table if not exists public.site_hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  display_order int not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists site_hero_slides_order_idx
  on public.site_hero_slides (display_order asc, created_at asc);

alter table public.site_hero_slides enable row level security;

drop policy if exists "Public read hero slides" on public.site_hero_slides;
create policy "Public read hero slides"
  on public.site_hero_slides for select using (true);

comment on table public.site_hero_slides is 'Homepage hero carousel images (ordered)';

notify pgrst, 'reload schema';

-- ============================================================================
-- 012_site_cms.sql
-- ============================================================================

-- Site CMS: designer-editable theme, copy, navigation, image focal points

create table if not exists public.site_settings (
  id text primary key default 'default',
  direction_id text not null default 'b',
  hero_layout text not null default 'immersive',
  hero_frame text not null default 'bleed',
  color_overrides jsonb not null default '{}'::jsonb,
  content_overrides jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_direction check (direction_id ~ '^[a-e]$'),
  constraint site_settings_hero_layout check (
    hero_layout in ('immersive', 'split', 'grounded', 'standard')
  ),
  constraint site_settings_hero_frame check (hero_frame in ('bleed', 'inset'))
);

insert into public.site_settings (id)
values ('default')
on conflict (id) do nothing;

create table if not exists public.site_nav_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order int not null default 100,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  constraint site_nav_href_format check (href ~ '^/')
);

create index if not exists site_nav_items_order_idx
  on public.site_nav_items (sort_order asc, created_at asc);

insert into public.site_nav_items (label, href, sort_order)
select v.label, v.href, v.sort_order
from (
  values
    ('Home', '/', 10),
    ('Availability', '/available-now', 20),
    ('About', '/about', 30),
    ('Contact', '/contact', 40)
) as v(label, href, sort_order)
where not exists (select 1 from public.site_nav_items limit 1);

alter table public.site_media_slots
  add column if not exists focal_x numeric(5, 2) not null default 50,
  add column if not exists focal_y numeric(5, 2) not null default 50;

alter table public.site_media_slots
  drop constraint if exists site_media_slots_focal_x_range;
alter table public.site_media_slots
  add constraint site_media_slots_focal_x_range
  check (focal_x >= 0 and focal_x <= 100);

alter table public.site_media_slots
  drop constraint if exists site_media_slots_focal_y_range;
alter table public.site_media_slots
  add constraint site_media_slots_focal_y_range
  check (focal_y >= 0 and focal_y <= 100);

alter table public.site_hero_slides
  add column if not exists focal_x numeric(5, 2) not null default 50,
  add column if not exists focal_y numeric(5, 2) not null default 50;

alter table public.site_hero_slides
  drop constraint if exists site_hero_slides_focal_x_range;
alter table public.site_hero_slides
  add constraint site_hero_slides_focal_x_range
  check (focal_x >= 0 and focal_x <= 100);

alter table public.site_hero_slides
  drop constraint if exists site_hero_slides_focal_y_range;
alter table public.site_hero_slides
  add constraint site_hero_slides_focal_y_range
  check (focal_y >= 0 and focal_y <= 100);

alter table public.site_settings enable row level security;
alter table public.site_nav_items enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
  on public.site_settings for select using (true);

drop policy if exists "Public read site nav" on public.site_nav_items;
create policy "Public read site nav"
  on public.site_nav_items for select using (true);

comment on table public.site_settings is 'Live site theme and copy overrides (singleton)';
comment on table public.site_nav_items is 'Header/footer navigation links';

notify pgrst, 'reload schema';

-- ============================================================================
-- 013_site_typography.sql
-- ============================================================================

-- Per-section font, size, and color overrides for the public site

alter table public.site_settings
  add column if not exists typography_overrides jsonb not null default '{}'::jsonb;

comment on column public.site_settings.typography_overrides is
  'Section typography: fontId, fontSize, color, fontWeight per region (hero, nav, body, etc.)';

notify pgrst, 'reload schema';

-- ============================================================================
-- 014_hero_slider_speed.sql
-- ============================================================================

-- Admin-adjustable homepage hero slideshow speed

alter table public.site_settings
  add column if not exists hero_slide_interval_ms integer not null default 7000;

alter table public.site_settings
  drop constraint if exists site_settings_hero_slide_interval_range;
alter table public.site_settings
  add constraint site_settings_hero_slide_interval_range
  check (hero_slide_interval_ms >= 5000 and hero_slide_interval_ms <= 20000);

comment on column public.site_settings.hero_slide_interval_ms is
  'Homepage hero slideshow interval in milliseconds. Admin-editable, clamped to 5-20 seconds.';

notify pgrst, 'reload schema';
