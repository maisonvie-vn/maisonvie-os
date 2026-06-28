-- Migration: Build Reservation Foundation
-- Only create tables if they do not exist.

-- 1. GUESTS TABLE
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    vip_level VARCHAR(50) DEFAULT 'Regular',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 2,
    room_name VARCHAR(100), -- Salon Privé, Le Jardin, VIP Room 1, Main Hall
    menu_selection VARCHAR(100), -- tasting menu or specific packages
    special_requests TEXT,
    allergies TEXT,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Pending, Confirmed, Arrived, Dining, Completed, Cancelled, No Show
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. RESERVATION CONTACTS TABLE
CREATE TABLE IF NOT EXISTS reservation_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- Email, Phone, Secondary Phone
    contact_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RESERVATION NOTES TABLE
CREATE TABLE IF NOT EXISTS reservation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    note_content TEXT NOT NULL,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. RESERVATION STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS reservation_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_status_history ENABLE ROW LEVEL SECURITY;

-- Create Policies for Authenticated users (Select, Insert, Update, Delete)
CREATE POLICY "Allow read access to authenticated users on guests" ON guests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on guests" ON guests FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on reservations" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on reservations" ON reservations FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on reservation_contacts" ON reservation_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on reservation_contacts" ON reservation_contacts FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on reservation_notes" ON reservation_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on reservation_notes" ON reservation_notes FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on reservation_status_history" ON reservation_status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on reservation_status_history" ON reservation_status_history FOR ALL TO authenticated USING (true);
