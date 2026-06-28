-- Migration: 022_recipe_foundation.sql
-- Description: Create recipes and recipe_ingredient_lines tables for Maison Vie Recipe Foundation

-- 1. Create recipes table
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid null references menu_items(id) on delete set null,
  recipe_code text null,
  recipe_name text not null,
  recipe_type text not null default 'standard',
  status text not null default 'draft',
  version integer not null default 1,
  yield_quantity numeric null,
  yield_unit text null,
  portion_quantity numeric null,
  portion_unit text null,
  prep_time_minutes integer null,
  cook_time_minutes integer null,
  difficulty_level text null,
  method text null,
  plating_note text null,
  prep_note text null,
  service_note text null,
  kitchen_note text null,
  allergy_note text null,
  dietary_note text null,
  storage_note text null,
  owner_name text null,
  effective_from date null,
  effective_to date null,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint chk_recipe_type check (recipe_type in ('standard', 'prep', 'sauce', 'stock', 'garnish', 'pastry', 'beverage', 'staff_meal', 'other')),
  constraint chk_recipe_status check (status in ('draft', 'active', 'paused', 'archived')),
  constraint chk_recipe_difficulty check (difficulty_level in ('low', 'medium', 'high', 'chef_only'))
);

-- 2. Create recipe_ingredient_lines table
create table if not exists recipe_ingredient_lines (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  line_order integer not null default 0,
  ingredient_name text not null,
  ingredient_category text null,
  quantity numeric null,
  unit text null,
  preparation_note text null,
  waste_note text null,
  optional boolean not null default false,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_ingredient_category check (ingredient_category in ('protein', 'seafood', 'vegetable', 'fruit', 'dairy', 'dry_goods', 'spice', 'herb', 'sauce', 'stock', 'garnish', 'pastry', 'beverage', 'other'))
);

-- 3. Enable Row Level Security (RLS)
alter table recipes enable row level security;
alter table recipe_ingredient_lines enable row level security;

-- 4. Create RLS Policies for recipes
create policy "Allow read access to recipes for authenticated users"
  on recipes for select
  to authenticated
  using (true);

create policy "Allow insert access to recipes for authenticated users"
  on recipes for insert
  to authenticated
  with check (true);

create policy "Allow update access to recipes for authenticated users"
  on recipes for update
  to authenticated
  using (true);

create policy "Allow delete access to recipes for authenticated users"
  on recipes for delete
  to authenticated
  using (true);

-- 5. Create RLS Policies for recipe_ingredient_lines
create policy "Allow read access to recipe_ingredient_lines for authenticated users"
  on recipe_ingredient_lines for select
  to authenticated
  using (true);

create policy "Allow insert access to recipe_ingredient_lines for authenticated users"
  on recipe_ingredient_lines for insert
  to authenticated
  with check (true);

create policy "Allow update access to recipe_ingredient_lines for authenticated users"
  on recipe_ingredient_lines for update
  to authenticated
  using (true);

create policy "Allow delete access to recipe_ingredient_lines for authenticated users"
  on recipe_ingredient_lines for delete
  to authenticated
  using (true);
