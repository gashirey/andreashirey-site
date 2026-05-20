-- Re-seed catalog if farm_products is empty (safe to re-run)

insert into public.farm_products (name, slug, category, description, variety, is_active)
values
  ('Zinnia Bunch', 'zinnia-bunch', 'flowers', 'Colorful mixed zinnias, hand-gathered from the cutting garden.', 'Mixed zinnias', true),
  ('Dahlia Bunch', 'dahlia-bunch', 'flowers', 'Seasonal dahlias — varieties change with the week.', 'Seasonal mix', true),
  ('Sunflower Bunch', 'sunflower-bunch', 'flowers', 'Cheerful sunflowers, cut fresh for your table.', 'Sunflowers', true),
  ('Mixed Farm Bouquet', 'mixed-farm-bouquet', 'flowers', 'A hand-tied mix of the best blooms in the field today.', null, true),
  ('Herbs', 'herbs', 'produce', 'Fresh culinary herbs from the garden.', null, true),
  ('Eggs', 'eggs', 'eggs', 'Farm eggs when available — quantity varies.', null, true),
  ('Produce', 'produce', 'produce', 'Seasonal vegetables and fruit from the farm.', null, true)
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
