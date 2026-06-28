-- Migration: 024_recipe_ingredient_normalization.sql
-- Description: Create unit_conversion_rules table and add normalization support columns to recipe_ingredient_lines

-- 1. Extend recipe_ingredient_lines table with normalization columns
alter table recipe_ingredient_lines
add column if not exists normalized_unit text null,
add column if not exists normalized_quantity numeric null,
add column if not exists normalization_status text not null default 'unmapped',
add column if not exists normalization_note text null;

-- Add check constraint for normalization status if not already present
-- We use a safe try-catch wrapper style if constraints could already exist, or do a clean declaration:
alter table recipe_ingredient_lines
drop constraint if exists chk_recipe_line_normalization_status;

alter table recipe_ingredient_lines
add constraint chk_recipe_line_normalization_status 
check (normalization_status in ('unmapped', 'mapped', 'needs_review', 'ignored'));

-- 2. Create unit_conversion_rules table
create table if not exists unit_conversion_rules (
  id uuid primary key default gen_random_uuid(),
  from_unit text not null,
  to_unit text not null,
  conversion_factor numeric not null,
  ingredient_master_id uuid null references ingredient_master_items(id) on delete cascade,
  note text null,
  status text not null default 'active',
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint chk_unit_conversion_status check (status in ('draft', 'active', 'paused', 'archived'))
);

-- 3. Enable Row Level Security (RLS)
alter table unit_conversion_rules enable row level security;

-- 4. Create RLS Policies for unit_conversion_rules
create policy "Allow read access to unit_conversion_rules for authenticated users"
  on unit_conversion_rules for select
  to authenticated
  using (true);

create policy "Allow insert access to unit_conversion_rules for authenticated users"
  on unit_conversion_rules for insert
  to authenticated
  with check (true);

create policy "Allow update access to unit_conversion_rules for authenticated users"
  on unit_conversion_rules for update
  to authenticated
  using (true);

create policy "Allow delete access to unit_conversion_rules for authenticated users"
  on unit_conversion_rules for delete
  to authenticated
  using (true);
