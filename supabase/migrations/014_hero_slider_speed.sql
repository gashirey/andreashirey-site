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
