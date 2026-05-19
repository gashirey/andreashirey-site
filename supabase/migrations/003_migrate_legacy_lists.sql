-- Optional one-time merge from legacy mailing_list / sms_list into contacts.
-- Run in SQL Editor after 002. Adjust if 001 was never applied.

-- Emails from mailing_list
insert into public.contacts (email, full_name, email_opt_in, email_opt_in_at, source, created_at, updated_at)
select
  m.email,
  nullif(trim(m.full_name), ''),
  (m.consent_email and m.unsubscribed_at is null),
  case when m.consent_email and m.unsubscribed_at is null then m.subscribed_at end,
  coalesce(nullif(trim(m.source), ''), 'legacy_mailing_list'),
  m.created_at,
  m.updated_at
from public.mailing_list m
where not exists (
  select 1 from public.contacts c where c.email = m.email
);

-- Phones from sms_list (skip if phone already exists)
insert into public.contacts (phone, full_name, sms_opt_in, sms_opt_in_at, source, created_at, updated_at)
select
  s.phone,
  nullif(trim(s.full_name), ''),
  (s.consent_sms and s.unsubscribed_at is null),
  case when s.consent_sms and s.unsubscribed_at is null then s.subscribed_at end,
  coalesce(nullif(trim(s.source), ''), 'legacy_sms_list'),
  s.created_at,
  s.updated_at
from public.sms_list s
where not exists (
  select 1 from public.contacts c where c.phone = s.phone
);

-- Rows that share email on one legacy row and phone on another need manual review in contacts.needs_review.
