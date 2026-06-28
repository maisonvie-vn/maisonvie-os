-- Migration: 029_inventory_movement_foundation.sql
-- Description: Create inventory_movements table

-- 1. Create inventory_movements table
create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  movement_number text unique not null,
  ingredient_master_id uuid not null references ingredient_master_items(id) on delete cascade,
  movement_date date not null default current_date,
  movement_type text not null,
  direction text not null,
  quantity numeric not null,
  unit text null,
  source_type text null,
  source_id uuid null,
  source_line_id uuid null,
  reference_number text null,
  reason text null,
  notes text null,
  created_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_inventory_movement_qty check (quantity > 0),
  constraint chk_inventory_movement_direction check (direction in ('in', 'out', 'adjustment')),
  constraint chk_inventory_movement_type check (movement_type in ('purchase_receipt', 'manual_adjustment', 'waste', 'spoilage', 'staff_meal', 'internal_use', 'correction'))
);

-- 2. Enable Row Level Security (RLS)
alter table inventory_movements enable row level security;

-- 3. Create RLS Policies for inventory_movements
create policy "Allow read access to inventory_movements for authenticated users"
  on inventory_movements for select
  to authenticated
  using (true);

create policy "Allow insert access to inventory_movements for authenticated users"
  on inventory_movements for insert
  to authenticated
  with check (true);

create policy "Allow update access to inventory_movements for authenticated users"
  on inventory_movements for update
  to authenticated
  using (true);
