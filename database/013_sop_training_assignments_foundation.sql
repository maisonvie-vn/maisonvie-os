-- Migration: SOP Training & Acknowledgement Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS sop_training_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_document_id UUID NOT NULL REFERENCES sop_documents(id) ON DELETE CASCADE,
    assignee_name VARCHAR(255) NOT NULL,
    role_name VARCHAR(100),
    department VARCHAR(50) NOT NULL, -- foh, boh, reservation, email, management, finance, inventory, stewarding, housekeeping, security, other
    status VARCHAR(50) NOT NULL DEFAULT 'assigned', -- assigned, in_progress, acknowledged, overdue, cancelled
    due_date DATE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledgement_note TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE sop_training_assignments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on sop_training_assignments" ON sop_training_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on sop_training_assignments" ON sop_training_assignments FOR ALL TO authenticated USING (true);
