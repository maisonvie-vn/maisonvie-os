-- Migration: 028_goods_receipt_foundation.sql
-- Description: Create goods_receipts and goods_receipt_items tables

-- 1. Create goods_receipts table
create table if not exists goods_receipts (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  receipt_number text unique not null,
  supplier_id uuid references suppliers(id) on delete set null,
  received_date date not null default current_date,
  received_by text null,
  status text not null default 'draft',
  notes text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_goods_receipt_status check (status in ('draft', 'received', 'partially_received', 'issue_reported', 'cancelled'))
);

-- 2. Create goods_receipt_items table
create table if not exists goods_receipt_items (
  id uuid primary key default gen_random_uuid(),
  goods_receipt_id uuid not null references goods_receipts(id) on delete cascade,
  purchase_order_line_id uuid references purchase_order_lines(id) on delete set null,
  ingredient_master_id uuid references ingredient_master_items(id) on delete set null,
  ordered_quantity numeric null,
  received_quantity numeric not null default 0,
  accepted_quantity numeric not null default 0,
  rejected_quantity numeric not null default 0,
  damaged_quantity numeric not null default 0,
  unit text null,
  unit_price numeric null,
  issue_note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_goods_receipt_item_received_qty check (received_quantity >= 0),
  constraint chk_goods_receipt_item_accepted_qty check (accepted_quantity >= 0),
  constraint chk_goods_receipt_item_rejected_qty check (rejected_quantity >= 0),
  constraint chk_goods_receipt_item_damaged_qty check (damaged_quantity >= 0)
);

-- 3. Enable Row Level Security (RLS)
alter table goods_receipts enable row level security;
alter table goods_receipt_items enable row level security;

-- 4. Create RLS Policies for goods_receipts
create policy "Allow read access to goods_receipts for authenticated users"
  on goods_receipts for select
  to authenticated
  using (true);

create policy "Allow insert access to goods_receipts for authenticated users"
  on goods_receipts for insert
  to authenticated
  with check (true);

create policy "Allow update access to goods_receipts for authenticated users"
  on goods_receipts for update
  to authenticated
  using (true);

-- 5. Create RLS Policies for goods_receipt_items
create policy "Allow read access to goods_receipt_items for authenticated users"
  on goods_receipt_items for select
  to authenticated
  using (true);

create policy "Allow insert access to goods_receipt_items for authenticated users"
  on goods_receipt_items for insert
  to authenticated
  with check (true);

create policy "Allow update access to goods_receipt_items for authenticated users"
  on goods_receipt_items for update
  to authenticated
  using (true);
