-- Migration: 034_menu_item_costing_foundation.sql
-- Description: Create menu_item_recipe_mappings, menu_item_costing_runs, menu_item_costing_items, and menu_item_costing_lines tables with latest view

-- 1. Create menu_item_recipe_mappings table
create table if not exists menu_item_recipe_mappings (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  recipe_id uuid not null references recipes(id) on delete cascade,
  component_type text not null default 'main',
  cost_basis text not null default 'per_portion',
  quantity_multiplier numeric not null default 1,
  is_active boolean not null default true,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_menu_item_recipe_component check (component_type in ('main', 'sauce', 'garnish', 'side', 'prep', 'bread', 'petit_four', 'amuse_bouche', 'other')),
  constraint chk_menu_item_recipe_basis check (cost_basis in ('per_portion', 'full_recipe')),
  constraint chk_menu_item_recipe_mult check (quantity_multiplier > 0)
);

-- 2. Create menu_item_costing_runs table
create table if not exists menu_item_costing_runs (
  id uuid primary key default gen_random_uuid(),
  run_number text unique not null,
  run_date date not null default current_date,
  source_recipe_costing_run_id uuid null references recipe_costing_runs(id) on delete set null,
  status text not null default 'draft',
  notes text null,
  created_by text null,
  started_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_menu_item_costing_run_status check (status in ('draft', 'completed', 'completed_with_warnings', 'failed', 'cancelled'))
);

-- 3. Create menu_item_costing_items table
create table if not exists menu_item_costing_items (
  id uuid primary key default gen_random_uuid(),
  menu_item_costing_run_id uuid not null references menu_item_costing_runs(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  total_menu_item_cost numeric null,
  costing_status text not null default 'pending',
  warning_message text null,
  calculated_line_count integer not null default 0,
  warning_line_count integer not null default 0,
  total_line_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_menu_item_costing_item_status check (costing_status in ('pending', 'calculated', 'calculated_with_warnings', 'no_mapping', 'incomplete', 'error')),
  constraint uq_menu_item_costing_run_item unique(menu_item_costing_run_id, menu_item_id)
);

-- 4. Create menu_item_costing_lines table
create table if not exists menu_item_costing_lines (
  id uuid primary key default gen_random_uuid(),
  menu_item_costing_item_id uuid not null references menu_item_costing_items(id) on delete cascade,
  menu_item_recipe_mapping_id uuid null references menu_item_recipe_mappings(id) on delete set null,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  recipe_id uuid null references recipes(id) on delete set null,
  recipe_name text null,
  component_type text null,
  cost_basis text null,
  quantity_multiplier numeric null,
  source_recipe_costing_item_id uuid null references recipe_costing_items(id) on delete set null,
  source_recipe_cost numeric null,
  source_cost_per_portion numeric null,
  line_cost numeric null,
  line_status text not null default 'pending',
  warning_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_menu_item_costing_line_status check (line_status in ('pending', 'calculated', 'missing_mapping', 'missing_recipe', 'missing_recipe_cost', 'missing_portion_cost', 'incomplete', 'error'))
);

-- 5. Create latest_menu_item_costing_items view
create or replace view latest_menu_item_costing_items as
with ranked_items as (
  select
    *,
    row_number() over(partition by menu_item_id order by created_at desc) as rn
  from menu_item_costing_items
  where costing_status in ('calculated', 'calculated_with_warnings')
)
select
  id,
  menu_item_costing_run_id,
  menu_item_id,
  total_menu_item_cost,
  costing_status,
  warning_message,
  calculated_line_count,
  warning_line_count,
  total_line_count,
  created_at,
  updated_at
from ranked_items
where rn = 1;

-- 6. Enable Row Level Security (RLS)
alter table menu_item_recipe_mappings enable row level security;
alter table menu_item_costing_runs enable row level security;
alter table menu_item_costing_items enable row level security;
alter table menu_item_costing_lines enable row level security;

-- 7. Create RLS Policies for menu_item_recipe_mappings
create policy "Allow read access to menu_item_recipe_mappings for authenticated users"
  on menu_item_recipe_mappings for select
  to authenticated
  using (true);

create policy "Allow insert access to menu_item_recipe_mappings for authenticated users"
  on menu_item_recipe_mappings for insert
  to authenticated
  with check (true);

create policy "Allow update access to menu_item_recipe_mappings for authenticated users"
  on menu_item_recipe_mappings for update
  to authenticated
  using (true);

create policy "Allow delete access to menu_item_recipe_mappings for authenticated users"
  on menu_item_recipe_mappings for delete
  to authenticated
  using (true);

-- 8. Create RLS Policies for menu_item_costing_runs
create policy "Allow read access to menu_item_costing_runs for authenticated users"
  on menu_item_costing_runs for select
  to authenticated
  using (true);

create policy "Allow insert access to menu_item_costing_runs for authenticated users"
  on menu_item_costing_runs for insert
  to authenticated
  with check (true);

create policy "Allow update access to menu_item_costing_runs for authenticated users"
  on menu_item_costing_runs for update
  to authenticated
  using (true);

-- 9. Create RLS Policies for menu_item_costing_items
create policy "Allow read access to menu_item_costing_items for authenticated users"
  on menu_item_costing_items for select
  to authenticated
  using (true);

create policy "Allow insert access to menu_item_costing_items for authenticated users"
  on menu_item_costing_items for insert
  to authenticated
  with check (true);

create policy "Allow update access to menu_item_costing_items for authenticated users"
  on menu_item_costing_items for update
  to authenticated
  using (true);

-- 10. Create RLS Policies for menu_item_costing_lines
create policy "Allow read access to menu_item_costing_lines for authenticated users"
  on menu_item_costing_lines for select
  to authenticated
  using (true);

create policy "Allow insert access to menu_item_costing_lines for authenticated users"
  on menu_item_costing_lines for insert
  to authenticated
  with check (true);

create policy "Allow update access to menu_item_costing_lines for authenticated users"
  on menu_item_costing_lines for update
  to authenticated
  using (true);
