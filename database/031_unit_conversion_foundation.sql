-- Migration: 031_unit_conversion_foundation.sql
-- Description: Create unit_conversions table

-- 1. Create unit_conversions table
create table if not exists unit_conversions (
  id uuid primary key default gen_random_uuid(),
  ingredient_master_id uuid null references ingredient_master_items(id) on delete cascade,
  from_unit text not null,
  to_unit text not null,
  factor numeric not null,
  conversion_type text not null default 'global',
  is_active boolean not null default true,
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_unit_conversion_factor check (factor > 0),
  constraint chk_unit_conversion_type check (conversion_type in ('global', 'ingredient_specific')),
  constraint chk_unit_conversion_not_same check (from_unit <> to_unit),
  constraint chk_unit_conversion_ingredient_req check (
    (conversion_type = 'ingredient_specific' and ingredient_master_id is not null) or
    (conversion_type = 'global' and ingredient_master_id is null)
  )
);

-- 2. Enable Row Level Security (RLS)
alter table unit_conversions enable row level security;

-- 3. Create RLS Policies for unit_conversions
create policy "Allow read access to unit_conversions for authenticated users"
  on unit_conversions for select
  to authenticated
  using (true);

create policy "Allow insert access to unit_conversions for authenticated users"
  on unit_conversions for insert
  to authenticated
  with check (true);

create policy "Allow update access to unit_conversions for authenticated users"
  on unit_conversions for update
  to authenticated
  using (true);

create policy "Allow delete access to unit_conversions for authenticated users"
  on unit_conversions for delete
  to authenticated
  using (true);
