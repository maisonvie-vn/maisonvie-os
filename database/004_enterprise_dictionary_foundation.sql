-- Migration: Build Enterprise Dictionary Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS enterprise_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term_code VARCHAR(50) UNIQUE NOT NULL,
    term_name VARCHAR(100) NOT NULL,
    vietnamese_name VARCHAR(100) NOT NULL,
    english_name VARCHAR(100) NOT NULL,
    domain VARCHAR(100),
    definition TEXT,
    business_owner VARCHAR(100),
    related_module VARCHAR(100),
    related_database_table VARCHAR(100),
    related_workflow VARCHAR(100),
    related_kpi VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Draft',
    version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE enterprise_terms ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access to authenticated users on enterprise_terms" ON enterprise_terms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on enterprise_terms" ON enterprise_terms FOR ALL TO authenticated USING (true);
