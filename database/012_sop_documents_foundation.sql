-- Migration: SOP Library Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS sop_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, reviewing, active, archived
    version INT NOT NULL DEFAULT 1,
    owner_name VARCHAR(100),
    related_improvement_action_id UUID REFERENCES improvement_actions(id) ON DELETE SET NULL,
    effective_date DATE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE sop_documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on sop_documents" ON sop_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on sop_documents" ON sop_documents FOR ALL TO authenticated USING (true);
