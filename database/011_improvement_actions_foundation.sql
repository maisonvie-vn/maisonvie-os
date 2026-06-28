-- Migration: Improvement Actions Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS improvement_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_event_id UUID REFERENCES learning_events(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    owner_name VARCHAR(100),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, blocked, completed, cancelled
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    resolution_note TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE improvement_actions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on improvement_actions" ON improvement_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on improvement_actions" ON improvement_actions FOR ALL TO authenticated USING (true);
