-- Client gallery digital file orders (selection + package)

create table if not exists public.client_gallery_orders (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.client_galleries (id) on delete cascade,
  package_id text not null,
  package_label text not null,
  photo_count int not null,
  price_cents int not null,
  asset_ids uuid[] not null default '{}',
  client_name text not null,
  client_email text not null,
  notes text,
  status text not null default 'submitted'
    check (status in ('submitted', 'confirmed', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_gallery_orders_gallery_created_idx
  on public.client_gallery_orders (gallery_id, created_at desc);

create index if not exists client_gallery_orders_status_idx
  on public.client_gallery_orders (status, created_at desc);

alter table public.client_gallery_orders enable row level security;

comment on table public.client_gallery_orders is
  'Digital package orders from client gallery photo selection';

notify pgrst, 'reload schema';
