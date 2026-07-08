-- Client viewing galleries: private share links for shoot deliverables

create table if not exists public.client_galleries (
  id uuid primary key default gen_random_uuid(),
  shoot_id uuid not null references public.media_shoots (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  share_token text not null unique,
  is_published boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists client_galleries_token_idx
  on public.client_galleries (share_token);

create index if not exists client_galleries_shoot_idx
  on public.client_galleries (shoot_id, created_at desc);

alter table public.client_galleries enable row level security;

comment on table public.client_galleries is
  'Token-gated client viewing galleries linked to media shoots';

notify pgrst, 'reload schema';
