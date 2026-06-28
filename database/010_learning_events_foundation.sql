-- Migration: Continuous Learning Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS learning_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'manual', -- reservation, email, dashboard, guest_feedback, service, kitchen, finance, inventory, manual
    source_id UUID,
    category VARCHAR(100) NOT NULL, -- guest_experience, service_quality, kitchen_quality, reservation_process, email_process, communication, cost_control, staffing, compliance, system, other
    severity VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, reviewing, action_required, resolved, archived
    owner_name VARCHAR(100),
    lesson TEXT,
    proposed_action TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on learning_events" ON learning_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on learning_events" ON learning_events FOR ALL TO authenticated USING (true);
