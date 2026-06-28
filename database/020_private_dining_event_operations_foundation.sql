-- Migration: Private Dining & Event Operations Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS private_dining_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID, -- Soft link or foreign key if reservations table exists
    agency_partner_id UUID REFERENCES travel_agency_partners(id) ON DELETE SET NULL,
    checklist_run_id UUID, -- Soft link or foreign key to checklist runs
    event_code VARCHAR(100),
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- private_dining, corporate, birthday, anniversary, proposal, wine_dinner, banquet, meeting, family_event, press_event, other
    host_name VARCHAR(100),
    host_contact VARCHAR(100),
    company_name VARCHAR(255),
    guest_count INTEGER NOT NULL DEFAULT 0,
    confirmed_guest_count INTEGER,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    room_area VARCHAR(50) NOT NULL, -- floor_1, vip_1, vip_2, vip_3, vip_4, floor_3, full_restaurant, offsite, other
    setup_style VARCHAR(50) NOT NULL, -- standard_dining, u_shape, long_table, round_table, cocktail, theater, classroom, buffet_style, custom
    menu_name VARCHAR(255),
    menu_note TEXT,
    beverage_note TEXT,
    allergy_note TEXT,
    special_request_note TEXT,
    decoration_note TEXT,
    cake_note TEXT,
    flower_note TEXT,
    av_equipment_note TEXT,
    kitchen_note TEXT,
    service_note TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'inquiry', -- inquiry, tentative, confirmed, changed, cancelled, completed, archived
    operation_status VARCHAR(50) NOT NULL DEFAULT 'not_ready', -- not_ready, preparing, ready, in_service, completed, issue
    owner_name VARCHAR(100),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE private_dining_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on private_dining_events" ON private_dining_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on private_dining_events" ON private_dining_events FOR ALL TO authenticated USING (true);
