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
