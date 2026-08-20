-- Snapshot original filenames on digital orders

alter table public.client_gallery_orders
  add column if not exists filenames text[] not null default '{}';

comment on column public.client_gallery_orders.filenames is
  'Original upload filenames for selected assets, captured at checkout';

notify pgrst, 'reload schema';
