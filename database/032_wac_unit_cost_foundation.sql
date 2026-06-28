-- Migration: 032_wac_unit_cost_foundation.sql
-- Description: Create inventory_wac_runs and inventory_wac_items tables with latest view

-- 1. Create inventory_wac_runs table
create table if not exists inventory_wac_runs (
  id uuid primary key default gen_random_uuid(),
  run_number text unique not null,
  run_date date not null default current_date,
  status text not null default 'draft',
  notes text null,
  created_by text null,
  started_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_inventory_wac_run_status check (status in ('draft', 'completed', 'completed_with_warnings', 'failed', 'cancelled'))
);

-- 2. Create inventory_wac_items table
create table if not exists inventory_wac_items (
  id uuid primary key default gen_random_uuid(),
  wac_run_id uuid not null references inventory_wac_runs(id) on delete cascade,
  ingredient_master_id uuid not null references ingredient_master_items(id) on delete cascade,
  costing_unit text null,
  total_accepted_quantity numeric not null default 0,
  total_normalized_quantity numeric not null default 0,
  total_purchase_cost numeric not null default 0,
  wac_unit_cost numeric null,
  calculation_status text not null default 'pending',
  warning_message text null,
  source_line_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_inventory_wac_item_status check (calculation_status in ('pending', 'calculated', 'missing_costing_unit', 'missing_conversion', 'missing_price', 'no_receipts', 'incomplete', 'error')),
  constraint uq_wac_run_ingredient_unit unique(wac_run_id, ingredient_master_id, costing_unit)
);

-- 3. Create latest_inventory_wac_items read-only view
create or replace view latest_inventory_wac_items as
with ranked_items as (
  select
    *,
    row_number() over(partition by ingredient_master_id, costing_unit order by created_at desc) as rn
  from inventory_wac_items
  where calculation_status in ('calculated', 'incomplete')
)
select
  id,
  wac_run_id,
  ingredient_master_id,
  costing_unit,
  total_accepted_quantity,
  total_normalized_quantity,
  total_purchase_cost,
  wac_unit_cost,
  calculation_status,
  warning_message,
  source_line_count,
  created_at,
  updated_at
from ranked_items
where rn = 1;

-- 4. Enable Row Level Security (RLS)
alter table inventory_wac_runs enable row level security;
alter table inventory_wac_items enable row level security;

-- 5. Create RLS Policies for inventory_wac_runs
create policy "Allow read access to inventory_wac_runs for authenticated users"
  on inventory_wac_runs for select
  to authenticated
  using (true);

create policy "Allow insert access to inventory_wac_runs for authenticated users"
  on inventory_wac_runs for insert
  to authenticated
  with check (true);

create policy "Allow update access to inventory_wac_runs for authenticated users"
  on inventory_wac_runs for update
  to authenticated
  using (true);

-- 6. Create RLS Policies for inventory_wac_items
create policy "Allow read access to inventory_wac_items for authenticated users"
  on inventory_wac_items for select
  to authenticated
  using (true);

create policy "Allow insert access to inventory_wac_items for authenticated users"
  on inventory_wac_items for insert
  to authenticated
  with check (true);

create policy "Allow update access to inventory_wac_items for authenticated users"
  on inventory_wac_items for update
  to authenticated
  using (true);
