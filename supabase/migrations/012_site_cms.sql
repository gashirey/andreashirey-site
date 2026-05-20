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
