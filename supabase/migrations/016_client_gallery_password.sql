-- Optional password protection for client viewing galleries

alter table public.client_galleries
  add column if not exists password_hash text;

comment on column public.client_galleries.password_hash is
  'HMAC hash of gallery password; null means open with link only';

notify pgrst, 'reload schema';
