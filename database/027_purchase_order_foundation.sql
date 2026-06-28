-- Migration: 027_purchase_order_foundation.sql
-- Description: Create purchase_orders and purchase_order_lines tables

-- 1. Create purchase_orders table
create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  purchase_order_code text null,
  purchase_request_id uuid null references purchase_requests(id) on delete set null,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  order_date date not null,
  expected_delivery_date date null,
  ordered_by text not null,
  department text not null,
  priority text not null default 'medium',
  status text not null default 'draft',
  delivery_address_note text null,
  delivery_time_note text null,
  quality_note text null,
  internal_note text null,
  sent_at timestamptz null,
  confirmed_at timestamptz null,
  closed_at timestamptz null,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_purchase_order_priority check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint chk_purchase_order_status check (status in ('draft', 'sent', 'supplier_confirmed', 'partially_received', 'received', 'cancelled', 'closed', 'archived')),
  constraint chk_purchase_order_department check (department in ('boh', 'foh', 'bar', 'reservation', 'management', 'finance', 'inventory', 'stewarding', 'housekeeping', 'maintenance', 'other'))
);

-- 2. Create purchase_order_lines table
create table if not exists purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  purchase_request_line_id uuid null references purchase_request_lines(id) on delete set null,
  ingredient_master_id uuid null references ingredient_master_items(id) on delete set null,
  line_order integer not null default 0,
  item_name text null,
  ordered_quantity numeric null,
  ordered_unit text null,
  supplier_item_note text null,
  quality_requirement_note text null,
  delivery_note text null,
  status text not null default 'open',
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_purchase_order_line_status check (status in ('open', 'ordered', 'supplier_confirmed', 'partially_received', 'received', 'cancelled', 'closed'))
);

-- 3. Enable Row Level Security (RLS)
alter table purchase_orders enable row level security;
alter table purchase_order_lines enable row level security;

-- 4. Create RLS Policies for purchase_orders
create policy "Allow read access to purchase_orders for authenticated users"
  on purchase_orders for select
  to authenticated
  using (true);

create policy "Allow insert access to purchase_orders for authenticated users"
  on purchase_orders for insert
  to authenticated
  with check (true);

create policy "Allow update access to purchase_orders for authenticated users"
  on purchase_orders for update
  to authenticated
  using (true);

create policy "Allow delete access to purchase_orders for authenticated users"
  on purchase_orders for delete
  to authenticated
  using (true);

-- 5. Create RLS Policies for purchase_order_lines
create policy "Allow read access to purchase_order_lines for authenticated users"
  on purchase_order_lines for select
  to authenticated
  using (true);

create policy "Allow insert access to purchase_order_lines for authenticated users"
  on purchase_order_lines for insert
  to authenticated
  with check (true);

create policy "Allow update access to purchase_order_lines for authenticated users"
  on purchase_order_lines for update
  to authenticated
  using (true);

create policy "Allow delete access to purchase_order_lines for authenticated users"
  on purchase_order_lines for delete
  to authenticated
  using (true);
