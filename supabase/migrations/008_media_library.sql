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
  created_at timestamptz not null default now()
);

create index if not exists media_assets_shoot_created_idx
  on public.media_assets (shoot_id, created_at desc);

alter table public.media_shoots enable row level security;
alter table public.media_assets enable row level security;

-- Admin APIs use service role; no public policies on these tables.

insert into public.media_shoots (name, shot_on)
select 'Default shoot', (timezone('America/New_York', now()))::date
where not exists (select 1 from public.media_shoots limit 1);

comment on table public.media_shoots is 'Photo shoot / upload session grouping';
comment on table public.media_assets is 'Uploaded images in the media library';

notify pgrst, 'reload schema';
