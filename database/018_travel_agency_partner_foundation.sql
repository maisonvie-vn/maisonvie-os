-- Migration: Travel Agency Partner Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS travel_agency_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(255) NOT NULL,
    partner_code VARCHAR(50),
    partner_type VARCHAR(50) NOT NULL, -- travel_agency, tour_operator, dmc, corporate_client, hotel_concierge, event_planner, other
    market VARCHAR(50) NOT NULL, -- japan, korea, europe, france, usa, australia, vietnam, southeast_asia, global, other
    status VARCHAR(50) NOT NULL DEFAULT 'prospect', -- prospect, active, inactive, paused, blacklisted, archived
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, strategic
    contact_name VARCHAR(100),
    contact_role VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(50),
    preferred_language VARCHAR(50), -- vietnamese, english, japanese, korean, french, chinese, other
    address TEXT,
    website VARCHAR(255),
    booking_policy_note TEXT,
    menu_policy_note TEXT,
    payment_policy_note TEXT,
    vat_policy_note TEXT,
    foc_policy_note TEXT,
    surcharge_policy_note TEXT,
    allergy_policy_note TEXT,
    internal_note TEXT,
    owner_name VARCHAR(100),
    last_contact_date DATE,
    next_follow_up_date DATE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE travel_agency_partners ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on travel_agency_partners" ON travel_agency_partners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on travel_agency_partners" ON travel_agency_partners FOR ALL TO authenticated USING (true);
