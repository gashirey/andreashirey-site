-- Digital orders: Stripe checkout fields and payment statuses

alter table public.client_gallery_orders
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

alter table public.client_gallery_orders
  drop constraint if exists client_gallery_orders_status_check;

alter table public.client_gallery_orders
  add constraint client_gallery_orders_status_check
  check (status in (
    'pending_payment',
    'paid',
    'submitted',
    'confirmed',
    'fulfilled',
    'cancelled'
  ));

create unique index if not exists client_gallery_orders_stripe_session_idx
  on public.client_gallery_orders (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

notify pgrst, 'reload schema';
