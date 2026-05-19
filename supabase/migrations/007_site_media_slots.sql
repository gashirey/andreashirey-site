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
