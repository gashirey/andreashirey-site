-- Storage bucket for admin uploads (media library, products, site images).
-- Run in Supabase SQL Editor if uploads fail with "Bucket not found".
-- Safe to re-run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos',
  'product-photos',
  true,
  12582912,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read product photos storage" on storage.objects;
create policy "Public read product photos storage"
  on storage.objects for select
  using (bucket_id = 'product-photos');
