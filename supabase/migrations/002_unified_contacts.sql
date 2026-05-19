-- Grey Gables Farm — unified contacts (replaces separate mailing/SMS lists)
-- Run after 001, or on a fresh project instead of 001.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- contacts — one person, channel opt-ins as attributes
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  full_name text,
  email text,
  phone text,
  preferred_contact_method text,
  email_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  email_opt_in_at timestamptz,
  sms_opt_in_at timestamptz,
  source text not null default 'website',
  customer_type text,
  notes text,
  needs_review boolean not null default false,
  review_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_email_lower check (email is null or email = lower(email)),
  constraint contacts_email_format check (
    email is null
    or email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  ),
  constraint contacts_phone_e164 check (
    phone is null or phone ~ '^\+[1-9]\d{7,14}$'
  ),
  constraint contacts_preferred_method check (
    preferred_contact_method is null
    or preferred_contact_method in ('email', 'sms', 'either')
  ),
  constraint contacts_has_channel check (email is not null or phone is not null)
);

create unique index if not exists contacts_email_unique_idx
  on public.contacts (lower(email))
  where email is not null;

create unique index if not exists contacts_phone_unique_idx
  on public.contacts (phone)
  where phone is not null;

create index if not exists contacts_source_idx on public.contacts (source);
create index if not exists contacts_email_opt_in_idx
  on public.contacts (email_opt_in)
  where email_opt_in = true;
create index if not exists contacts_sms_opt_in_idx
  on public.contacts (sms_opt_in)
  where sms_opt_in = true;
create index if not exists contacts_needs_review_idx
  on public.contacts (needs_review)
  where needs_review = true;

-- ---------------------------------------------------------------------------
-- contact_tags — segmentation (wedding_inquiry, flowers, newsletter, …)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_tags (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  constraint contact_tags_tag_format check (
    tag ~ '^[a-z][a-z0-9_]*$'
  ),
  constraint contact_tags_unique unique (contact_id, tag)
);

create index if not exists contact_tags_tag_idx on public.contact_tags (tag);

-- ---------------------------------------------------------------------------
-- contact_activity — lightweight audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.contact_activity (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  activity_type text not null,
  activity_detail text,
  source text,
  created_at timestamptz not null default now(),
  constraint contact_activity_type_format check (
    activity_type ~ '^[a-z][a-z0-9_]*$'
  )
);

create index if not exists contact_activity_contact_idx
  on public.contact_activity (contact_id, created_at desc);

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

drop trigger if exists contacts_updated_at on public.contacts;
create trigger contacts_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — service role via API routes only
-- ---------------------------------------------------------------------------
alter table public.contacts enable row level security;
alter table public.contact_tags enable row level security;
alter table public.contact_activity enable row level security;

comment on table public.contacts is 'Unified farm contacts; email/SMS are opt-in attributes';
comment on table public.contact_tags is 'Tags for dynamic segmentation (wedding_inquiry, flowers, …)';
comment on table public.contact_activity is 'Contact timeline (form_submitted, opt-ins, …)';
