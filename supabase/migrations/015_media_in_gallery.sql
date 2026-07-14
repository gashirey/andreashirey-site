-- Gallery selection: uploads stay in the library; only flagged images appear on /gallery.

alter table public.media_assets
  add column if not exists in_gallery boolean not null default false;

-- Existing Andrea portfolio uploads were previously all shown on /gallery.
update public.media_assets
set in_gallery = true
where storage_path like 'andrea-gallery/%'
  and in_gallery = false;

create index if not exists media_assets_in_gallery_created_idx
  on public.media_assets (in_gallery, created_at desc)
  where in_gallery = true;

comment on column public.media_assets.in_gallery is
  'When true, asset appears on the public Work gallery (/gallery)';
