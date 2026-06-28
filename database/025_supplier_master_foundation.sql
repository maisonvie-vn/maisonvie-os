-- Migration: 025_supplier_master_foundation.sql
-- Description: Create suppliers and supplier_ingredient_capabilities tables

-- 1. Create suppliers table
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_code text null,
  supplier_name text not null,
  supplier_type text not null,
  status text not null default 'prospect',
  priority text not null default 'medium',
  contact_name text null,
  contact_role text null,
  contact_email text null,
  contact_phone text null,
  address text null,
  website text null,
  tax_code text null,
  invoice_note text null,
  delivery_note text null,
  payment_term_note text null,
  quality_note text null,
  storage_handling_note text null,
  category_note text null,
  internal_note text null,
  owner_name text null,
  last_contact_date date null,
  next_review_date date null,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_supplier_status check (status in ('prospect', 'active', 'paused', 'inactive', 'blocked', 'archived')),
  constraint chk_supplier_priority check (priority in ('low', 'medium', 'high', 'strategic'))
);

-- 2. Create supplier_ingredient_capabilities table
create table if not exists supplier_ingredient_capabilities (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  ingredient_master_id uuid null references ingredient_master_items(id) on delete set null,
  ingredient_category text null,
  capability_note text null,
  quality_note text null,
  lead_time_note text null,
  minimum_order_note text null,
  status text not null default 'active',
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_supplier_capability_status check (status in ('draft', 'active', 'paused', 'archived'))
);

-- 3. Enable Row Level Security (RLS)
alter table suppliers enable row level security;
alter table supplier_ingredient_capabilities enable row level security;

-- 4. Create RLS Policies for suppliers
create policy "Allow read access to suppliers for authenticated users"
  on suppliers for select
  to authenticated
  using (true);

create policy "Allow insert access to suppliers for authenticated users"
  on suppliers for insert
  to authenticated
  with check (true);

create policy "Allow update access to suppliers for authenticated users"
  on suppliers for update
  to authenticated
  using (true);

create policy "Allow delete access to suppliers for authenticated users"
  on suppliers for delete
  to authenticated
  using (true);

-- 5. Create RLS Policies for supplier_ingredient_capabilities
create policy "Allow read access to supplier_capabilities for authenticated users"
  on supplier_ingredient_capabilities for select
  to authenticated
  using (true);

create policy "Allow insert access to supplier_capabilities for authenticated users"
  on supplier_ingredient_capabilities for insert
  to authenticated
  with check (true);

create policy "Allow update access to supplier_capabilities for authenticated users"
  on supplier_ingredient_capabilities for update
  to authenticated
  using (true);

create policy "Allow delete access to supplier_capabilities for authenticated users"
  on supplier_ingredient_capabilities for delete
  to authenticated
  using (true);
