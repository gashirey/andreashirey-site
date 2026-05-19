-- MVP: today's flower listings (zinnia + dahlia)
-- Safe to re-run: updates rows for today's date (US/Eastern) if they already exist.

do $$
declare
  v_date date := (timezone('America/New_York', now()))::date;
  v_zinnia uuid;
  v_dahlia uuid;
  v_avail uuid;
begin
  select id into v_zinnia from public.farm_products where slug = 'zinnia-bunch';
  select id into v_dahlia from public.farm_products where slug = 'dahlia-bunch';

  if v_zinnia is null or v_dahlia is null then
    raise exception 'Run 004/005 first — zinnia-bunch and dahlia-bunch products missing';
  end if;

  -- Zinnia
  select id into v_avail
  from public.farm_product_availability
  where product_id = v_zinnia and available_date = v_date;

  if v_avail is null then
    insert into public.farm_product_availability (
      product_id, available_date, status, bunch_price, stems_per_bunch,
      bunches_available, harvest_date, notes, display_order, show_on_website
    ) values (
      v_zinnia, v_date, 'available', 18.00, 12, 8, v_date,
      'Mixed colors from the cutting garden.', 10, true
    )
    returning id into v_avail;
  else
    update public.farm_product_availability set
      status = 'available',
      bunch_price = 18.00,
      stems_per_bunch = 12,
      bunches_available = 8,
      harvest_date = v_date,
      notes = 'Mixed colors from the cutting garden.',
      display_order = 10,
      show_on_website = true
    where id = v_avail;
  end if;

  -- Dahlia
  select id into v_avail
  from public.farm_product_availability
  where product_id = v_dahlia and available_date = v_date;

  if v_avail is null then
    insert into public.farm_product_availability (
      product_id, available_date, status, bunch_price, stems_per_bunch,
      bunches_available, harvest_date, notes, display_order, show_on_website
    ) values (
      v_dahlia, v_date, 'limited', 24.00, 5, 4, v_date,
      'Seasonal varieties — changes weekly.', 20, true
    );
  else
    update public.farm_product_availability set
      status = 'limited',
      bunch_price = 24.00,
      stems_per_bunch = 5,
      bunches_available = 4,
      harvest_date = v_date,
      notes = 'Seasonal varieties — changes weekly.',
      display_order = 20,
      show_on_website = true
    where product_id = v_dahlia and available_date = v_date;
  end if;

  -- Placeholder photos (site static paths) if none yet
  insert into public.farm_product_photos (product_id, image_url, alt_text, is_primary, display_order)
  select v_zinnia, '/images/bb.jpg', 'Zinnia Bunch', true, 10
  where not exists (
    select 1 from public.farm_product_photos where product_id = v_zinnia and availability_id is null
  );

  insert into public.farm_product_photos (product_id, image_url, alt_text, is_primary, display_order)
  select v_dahlia, '/images/bb.jpg', 'Dahlia Bunch', true, 10
  where not exists (
    select 1 from public.farm_product_photos where product_id = v_dahlia and availability_id is null
  );
end $$;

notify pgrst, 'reload schema';
