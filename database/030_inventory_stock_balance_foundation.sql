-- Migration: 030_inventory_stock_balance_foundation.sql
-- Description: Create inventory_stock_balances view

create or replace view inventory_stock_balances as
select
  ingredient_master_id,
  unit,
  sum(case when direction = 'in' then quantity else 0 end) as total_in_quantity,
  sum(case when direction = 'out' then quantity else 0 end) as total_out_quantity,
  sum(case when direction = 'adjustment' then quantity else 0 end) as total_adjustment_quantity,
  sum(
    case
      when direction = 'in' then quantity
      when direction = 'out' then -quantity
      when direction = 'adjustment' then quantity
      else 0
    end
  ) as current_quantity,
  max(movement_date) as last_movement_date,
  count(*) as movement_count
from inventory_movements
group by ingredient_master_id, unit;
