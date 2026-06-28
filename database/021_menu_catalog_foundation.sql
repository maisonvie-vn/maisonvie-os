-- Migration: Menu Catalog Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS menu_catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_name VARCHAR(255) NOT NULL,
    menu_code VARCHAR(100),
    menu_type VARCHAR(50) NOT NULL, -- a_la_carte, business_lunch, degustation, travel_agency, tour_group, private_dining, event, beverage, wine, seasonal, special, other
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, paused, archived
    description TEXT,
    target_guest_type VARCHAR(50), -- walk_in, a_la_carte_guest, tour_group, travel_agency, private_dining, corporate, event_guest, vip, internal, other
    effective_from DATE,
    effective_to DATE,
    language_note TEXT,
    internal_note TEXT,
    owner_name VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_catalog_id UUID NOT NULL REFERENCES menu_catalogs(id) ON DELETE CASCADE,
    item_code VARCHAR(100),
    item_name_fr VARCHAR(255),
    item_name_en VARCHAR(255),
    item_name_vi VARCHAR(255),
    item_name_ja VARCHAR(255),
    item_description_vi TEXT,
    item_description_en TEXT,
    section VARCHAR(50) NOT NULL, -- amuse_bouche, starter, soup, salad, fish, meat, poultry, vegetarian, cheese, dessert, beverage, wine, other
    course_type VARCHAR(50), -- single_item, course_1, course_2, course_3, course_4, course_5, course_6, optional_choice, supplement, other
    item_type VARCHAR(50) NOT NULL DEFAULT 'food', -- food, beverage, wine, cocktail, mocktail, coffee_tea, other
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, paused, archived
    allergy_note TEXT,
    dietary_note TEXT,
    pregnancy_note TEXT,
    service_note TEXT,
    kitchen_note TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE menu_catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on menu_catalogs" ON menu_catalogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on menu_catalogs" ON menu_catalogs FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on menu_items" ON menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on menu_items" ON menu_items FOR ALL TO authenticated USING (true);
