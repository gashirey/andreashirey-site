-- Per-section font, size, and color overrides for the public site

alter table public.site_settings
  add column if not exists typography_overrides jsonb not null default '{}'::jsonb;

comment on column public.site_settings.typography_overrides is
  'Section typography: fontId, fontSize, color, fontWeight per region (hero, nav, body, etc.)';

notify pgrst, 'reload schema';
