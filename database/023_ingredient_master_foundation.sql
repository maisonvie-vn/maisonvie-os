-- Migration: 023_ingredient_master_foundation.sql
-- Description: Create ingredient_master_items table and add ingredient_master_id reference to recipe_ingredient_lines

-- 1. Create ingredient_master_items table
create table if not exists ingredient_master_items (
  id uuid primary key default gen_random_uuid(),
  ingredient_code text null,
  ingredient_name_vi text not null,
  ingredient_name_en text null,
  ingredient_name_fr text null,
  category text not null,
  subcategory text null,
  default_unit text not null,
  purchase_unit_note text null,
  recipe_unit_note text null,
  storage_type text null,
  shelf_life_note text null,
  allergy_note text null,
  dietary_note text null,
  quality_specification text null,
  preparation_note text null,
  kitchen_note text null,
  status text not null default 'draft',
  owner_name text null,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_ingredient_master_status check (status in ('draft', 'active', 'paused', 'archived')),
  constraint chk_ingredient_master_category check (category in (
    'protein', 'beef', 'poultry', 'pork', 'lamb', 'seafood', 'fish', 'shellfish',
    'vegetable', 'fruit', 'dairy', 'cheese', 'butter', 'egg', 'dry_goods', 'flour',
    'rice_grain', 'pasta', 'spice', 'herb', 'oil_fat', 'sauce', 'stock', 'garnish',
    'pastry', 'chocolate', 'beverage', 'wine', 'non_food', 'other'
  )),
  constraint chk_ingredient_master_unit check (default_unit in (
    'g', 'kg', 'ml', 'l', 'pcs', 'portion', 'bunch', 'bottle', 'can', 'pack', 'box', 'tray', 'bag', 'other'
  )),
  constraint chk_ingredient_master_storage check (storage_type in (
    'dry', 'chilled', 'frozen', 'ambient', 'wine_cellar', 'chemical_safe', 'other'
  ))
);

-- 2. Add ingredient_master_id to recipe_ingredient_lines
alter table recipe_ingredient_lines
add column if not exists ingredient_master_id uuid null references ingredient_master_items(id) on delete set null;

-- 3. Enable Row Level Security (RLS)
alter table ingredient_master_items enable row level security;

-- 4. Create RLS Policies for ingredient_master_items
create policy "Allow read access to ingredient_master_items for authenticated users"
  on ingredient_master_items for select
  to authenticated
  using (true);

create policy "Allow insert access to ingredient_master_items for authenticated users"
  on ingredient_master_items for insert
  to authenticated
  with check (true);

create policy "Allow update access to ingredient_master_items for authenticated users"
  on ingredient_master_items for update
  to authenticated
  using (true);

create policy "Allow delete access to ingredient_master_items for authenticated users"
  on ingredient_master_items for delete
  to authenticated
  using (true);
