-- Migration: Tour Group Booking Operations Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS tour_group_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_partner_id UUID REFERENCES travel_agency_partners(id) ON DELETE SET NULL,
    reservation_id UUID, -- Soft link or foreign key if reservations table exists
    tour_code VARCHAR(100),
    booking_reference VARCHAR(100),
    group_name VARCHAR(255) NOT NULL,
    market VARCHAR(50) NOT NULL, -- japan, korea, europe, france, usa, australia, vietnam, southeast_asia, global, other
    guest_count INTEGER NOT NULL DEFAULT 0,
    confirmed_guest_count INTEGER,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    departure_time TIME,
    menu_name VARCHAR(255),
    menu_note TEXT,
    allergy_note TEXT,
    special_request_note TEXT,
    guide_name VARCHAR(100),
    guide_phone VARCHAR(50),
    leader_name VARCHAR(100),
    leader_phone VARCHAR(50),
    floor_table_note TEXT,
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
ALTER TABLE tour_group_bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on tour_group_bookings" ON tour_group_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on tour_group_bookings" ON tour_group_bookings FOR ALL TO authenticated USING (true);
