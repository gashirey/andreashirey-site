# Supabase — mailing & SMS lists

Same pattern as SCS Surge: subscribers live in Supabase; the Next.js site writes via **API routes** using the **service role** key (never exposed to the browser).

## 1. Create a Supabase project

1. [supabase.com](https://supabase.com) → New project (e.g. `greygablesfarm`).
2. Note **Project URL** and **service_role** key (Settings → API).

## 2. Run the migration

In the Supabase dashboard → **SQL Editor**, paste and run:

`supabase/migrations/001_mailing_and_sms_lists.sql`

This creates:

| Table | Purpose |
|-------|---------|
| `mailing_list` | Email subscribers |
| `sms_list` | SMS subscribers (E.164 phone numbers) |

## 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Add the same variables in **Vercel** → Project → Settings → Environment Variables.

`NEXT_PUBLIC_SUPABASE_URL` is safe in the browser (used only to detect “configured” state).  
`SUPABASE_SERVICE_ROLE_KEY` is **server-only** — never prefix with `NEXT_PUBLIC_`.

## 4. Verify

1. `npm run dev`
2. Footer → subscribe with email and/or phone
3. Supabase → Table Editor → confirm rows in `mailing_list` / `sms_list`

## Exporting for campaigns

- **Email:** export `mailing_list` where `unsubscribed_at` is null → CSV → Mailchimp, Resend audiences, etc.
- **SMS:** export `sms_list` where `unsubscribed_at` is null → Twilio, etc. (wire sending separately)

## Unsubscribes (later)

Add `/unsubscribe` routes that set `unsubscribed_at` using signed tokens or admin tools.
