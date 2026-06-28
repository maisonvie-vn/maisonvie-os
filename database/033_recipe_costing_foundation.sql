-- Migration: 033_recipe_costing_foundation.sql
-- Description: Create recipe_costing_runs, recipe_costing_items, and recipe_costing_lines tables with latest view

-- 1. Create recipe_costing_runs table
create table if not exists recipe_costing_runs (
  id uuid primary key default gen_random_uuid(),
  run_number text unique not null,
  run_date date not null default current_date,
  source_wac_run_id uuid null references inventory_wac_runs(id) on delete set null,
  status text not null default 'draft',
  notes text null,
  created_by text null,
  started_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_recipe_costing_run_status check (status in ('draft', 'completed', 'completed_with_warnings', 'failed', 'cancelled'))
);

-- 2. Create recipe_costing_items table
create table if not exists recipe_costing_items (
  id uuid primary key default gen_random_uuid(),
  recipe_costing_run_id uuid not null references recipe_costing_runs(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  total_recipe_cost numeric null,
  cost_per_portion numeric null,
  portion_count numeric null,
  costing_status text not null default 'pending',
  warning_message text null,
  calculated_line_count integer not null default 0,
  warning_line_count integer not null default 0,
  total_line_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_recipe_costing_item_status check (costing_status in ('pending', 'calculated', 'calculated_with_warnings', 'no_ingredients', 'incomplete', 'error')),
  constraint uq_recipe_costing_run_recipe unique(recipe_costing_run_id, recipe_id)
);

-- 3. Create recipe_costing_lines table
create table if not exists recipe_costing_lines (
  id uuid primary key default gen_random_uuid(),
  recipe_costing_item_id uuid not null references recipe_costing_items(id) on delete cascade,
  recipe_ingredient_id uuid null references recipe_ingredient_lines(id) on delete set null,
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid null references ingredient_master_items(id) on delete set null,
  ingredient_name text null,
  recipe_quantity numeric null,
  recipe_unit text null,
  costing_unit text null,
  normalized_quantity numeric null,
  wac_unit_cost numeric null,
  line_cost numeric null,
  line_status text not null default 'pending',
  warning_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_recipe_costing_line_status check (line_status in ('pending', 'calculated', 'missing_ingredient', 'missing_quantity', 'missing_unit', 'missing_wac', 'missing_conversion', 'incomplete', 'error'))
);

-- 4. Create latest_recipe_costing_items view
create or replace view latest_recipe_costing_items as
with ranked_items as (
  select
    *,
    row_number() over(partition by recipe_id order by created_at desc) as rn
  from recipe_costing_items
  where costing_status in ('calculated', 'calculated_with_warnings')
)
select
  id,
  recipe_costing_run_id,
  recipe_id,
  total_recipe_cost,
  cost_per_portion,
  portion_count,
  costing_status,
  warning_message,
  calculated_line_count,
  warning_line_count,
  total_line_count,
  created_at,
  updated_at
from ranked_items
where rn = 1;

-- 5. Enable Row Level Security (RLS)
alter table recipe_costing_runs enable row level security;
alter table recipe_costing_items enable row level security;
alter table recipe_costing_lines enable row level security;

-- 6. Create RLS Policies for recipe_costing_runs
create policy "Allow read access to recipe_costing_runs for authenticated users"
  on recipe_costing_runs for select
  to authenticated
  using (true);

create policy "Allow insert access to recipe_costing_runs for authenticated users"
  on recipe_costing_runs for insert
  to authenticated
  with check (true);

create policy "Allow update access to recipe_costing_runs for authenticated users"
  on recipe_costing_runs for update
  to authenticated
  using (true);

-- 7. Create RLS Policies for recipe_costing_items
create policy "Allow read access to recipe_costing_items for authenticated users"
  on recipe_costing_items for select
  to authenticated
  using (true);

create policy "Allow insert access to recipe_costing_items for authenticated users"
  on recipe_costing_items for insert
  to authenticated
  with check (true);

create policy "Allow update access to recipe_costing_items for authenticated users"
  on recipe_costing_items for update
  to authenticated
  using (true);

-- 8. Create RLS Policies for recipe_costing_lines
create policy "Allow read access to recipe_costing_lines for authenticated users"
  on recipe_costing_lines for select
  to authenticated
  using (true);

create policy "Allow insert access to recipe_costing_lines for authenticated users"
  on recipe_costing_lines for insert
  to authenticated
  with check (true);

create policy "Allow update access to recipe_costing_lines for authenticated users"
  on recipe_costing_lines for update
  to authenticated
  using (true);
