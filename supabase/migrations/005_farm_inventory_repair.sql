-- Run in Supabase SQL Editor if farm_products is missing (PGRST205).
-- Safe to re-run — skips objects that already exist.

do $$ begin
  create type public.availability_status as enum (
    'available', 'limited', 'sold_out', 'hidden'
  );
exception when duplicate_object then null;
end $$;

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

create index if not exists farm_products_category_idx on public.farm_products (category);
create index if not exists farm_products_active_idx on public.farm_products (is_active);
create index if not exists farm_availability_date_idx
  on public.farm_product_availability (available_date desc);
create index if not exists farm_availability_product_date_idx
  on public.farm_product_availability (product_id, available_date desc);
create index if not exists farm_photos_product_idx on public.farm_product_photos (product_id);

alter table public.farm_products enable row level security;
alter table public.farm_product_availability enable row level security;
alter table public.farm_product_photos enable row level security;

drop policy if exists "Public read active products" on public.farm_products;
create policy "Public read active products"
  on public.farm_products for select using (is_active = true);

drop policy if exists "Public read website availability" on public.farm_product_availability;
create policy "Public read website availability"
  on public.farm_product_availability for select
  using (show_on_website = true and status in ('available', 'limited'));

drop policy if exists "Public read product photos" on public.farm_product_photos;
create policy "Public read product photos"
  on public.farm_product_photos for select using (true);

drop trigger if exists farm_products_updated_at on public.farm_products;
create trigger farm_products_updated_at
  before update on public.farm_products
  for each row execute function public.set_updated_at();

drop trigger if exists farm_availability_updated_at on public.farm_product_availability;
create trigger farm_availability_updated_at
  before update on public.farm_product_availability
  for each row execute function public.set_updated_at();

insert into public.farm_products (name, slug, category, description, variety, is_active)
values
  ('Zinnia Bunch', 'zinnia-bunch', 'flowers', 'Colorful mixed zinnias, hand-gathered from the cutting garden.', 'Mixed zinnias', true),
  ('Dahlia Bunch', 'dahlia-bunch', 'flowers', 'Seasonal dahlias — varieties change with the week.', 'Seasonal mix', true),
  ('Sunflower Bunch', 'sunflower-bunch', 'flowers', 'Cheerful sunflowers, cut fresh for your table.', 'Sunflowers', true),
  ('Mixed Farm Bouquet', 'mixed-farm-bouquet', 'flowers', 'A hand-tied mix of the best blooms in the field today.', null, true),
  ('Herbs', 'herbs', 'produce', 'Fresh culinary herbs from the garden.', null, true),
  ('Eggs', 'eggs', 'eggs', 'Farm eggs when available — quantity varies.', null, true),
  ('Produce', 'produce', 'produce', 'Seasonal vegetables and fruit from the farm.', null, true)
on conflict (slug) do nothing;

-- Refresh API schema cache (fixes PGRST205 after creating tables)
notify pgrst, 'reload schema';

-- Verify (should return 7 rows):
-- select count(*) from public.farm_products;
