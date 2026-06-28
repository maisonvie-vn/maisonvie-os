-- Migration: 026_purchase_request_foundation.sql
-- Description: Create purchase_requests and purchase_request_lines tables

-- 1. Create purchase_requests table
create table if not exists purchase_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text null,
  request_date date not null,
  requested_by text not null,
  department text not null,
  priority text not null default 'medium',
  status text not null default 'draft',
  needed_by_date date null,
  preferred_supplier_id uuid null references suppliers(id) on delete set null,
  reason text null,
  internal_note text null,
  submitted_at timestamptz null,
  reviewed_at timestamptz null,
  closed_at timestamptz null,
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_purchase_request_priority check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint chk_purchase_request_status check (status in ('draft', 'submitted', 'reviewing', 'approved_for_ordering', 'rejected', 'cancelled', 'closed', 'archived')),
  constraint chk_purchase_request_department check (department in ('boh', 'foh', 'bar', 'reservation', 'management', 'finance', 'inventory', 'stewarding', 'housekeeping', 'maintenance', 'other'))
);

-- 2. Create purchase_request_lines table
create table if not exists purchase_request_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_request_id uuid not null references purchase_requests(id) on delete cascade,
  line_order integer not null default 0,
  ingredient_master_id uuid null references ingredient_master_items(id) on delete set null,
  free_text_item_name text null,
  requested_quantity numeric null,
  requested_unit text null,
  preferred_supplier_id uuid null references suppliers(id) on delete set null,
  purpose_note text null,
  urgency_note text null,
  status text not null default 'open',
  created_by uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint chk_purchase_request_line_status check (status in ('open', 'reviewed', 'approved', 'rejected', 'cancelled', 'closed'))
);

-- 3. Enable Row Level Security (RLS)
alter table purchase_requests enable row level security;
alter table purchase_request_lines enable row level security;

-- 4. Create RLS Policies for purchase_requests
create policy "Allow read access to purchase_requests for authenticated users"
  on purchase_requests for select
  to authenticated
  using (true);

create policy "Allow insert access to purchase_requests for authenticated users"
  on purchase_requests for insert
  to authenticated
  with check (true);

create policy "Allow update access to purchase_requests for authenticated users"
  on purchase_requests for update
  to authenticated
  using (true);

create policy "Allow delete access to purchase_requests for authenticated users"
  on purchase_requests for delete
  to authenticated
  using (true);

-- 5. Create RLS Policies for purchase_request_lines
create policy "Allow read access to purchase_request_lines for authenticated users"
  on purchase_request_lines for select
  to authenticated
  using (true);

create policy "Allow insert access to purchase_request_lines for authenticated users"
  on purchase_request_lines for insert
  to authenticated
  with check (true);

create policy "Allow update access to purchase_request_lines for authenticated users"
  on purchase_request_lines for update
  to authenticated
  using (true);

create policy "Allow delete access to purchase_request_lines for authenticated users"
  on purchase_request_lines for delete
  to authenticated
  using (true);
