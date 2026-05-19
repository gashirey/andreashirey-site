-- Grey Gables Farm — mailing list (email) + SMS list
-- Run in Supabase SQL Editor or via: supabase db push

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Email mailing list
-- ---------------------------------------------------------------------------
create table if not exists public.mailing_list (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  source text not null default 'website',
  consent_email boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mailing_list_email_lower check (email = lower(email)),
  constraint mailing_list_email_format check (
    email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  )
);

create unique index if not exists mailing_list_email_active_idx
  on public.mailing_list (lower(email))
  where unsubscribed_at is null;

create index if not exists mailing_list_subscribed_at_idx
  on public.mailing_list (subscribed_at desc);

-- ---------------------------------------------------------------------------
-- SMS list (store E.164, e.g. +15405551234)
-- ---------------------------------------------------------------------------
create table if not exists public.sms_list (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  full_name text,
  source text not null default 'website',
  consent_sms boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sms_list_phone_e164 check (phone ~ '^\+[1-9]\d{7,14}$')
);

create unique index if not exists sms_list_phone_active_idx
  on public.sms_list (phone)
  where unsubscribed_at is null;

create index if not exists sms_list_subscribed_at_idx
  on public.sms_list (subscribed_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists mailing_list_updated_at on public.mailing_list;
create trigger mailing_list_updated_at
  before update on public.mailing_list
  for each row execute function public.set_updated_at();

drop trigger if exists sms_list_updated_at on public.sms_list;
create trigger sms_list_updated_at
  before update on public.sms_list
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — no public access; site uses service role in API routes
-- ---------------------------------------------------------------------------
alter table public.mailing_list enable row level security;
alter table public.sms_list enable row level security;

-- Optional: allow authenticated dashboard users later
-- create policy "service role only" is implicit when using service key server-side

comment on table public.mailing_list is 'Farm email newsletter / availability list';
comment on table public.sms_list is 'Farm SMS alerts (pickup, bloom updates)';
