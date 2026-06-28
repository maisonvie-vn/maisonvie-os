-- Migration: Daily Operations Checklist Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS operational_checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(50) NOT NULL, -- foh, boh, reservation, email, management, etc.
    shift_type VARCHAR(50) NOT NULL, -- opening, pre_service, lunch, dinner, closing, full_day, event, other
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, archived
    owner_name VARCHAR(100),
    related_sop_document_id UUID REFERENCES sop_documents(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS operational_checklist_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES operational_checklist_templates(id) ON DELETE CASCADE,
    run_date DATE NOT NULL,
    department VARCHAR(50) NOT NULL,
    shift_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, in_progress, completed, overdue, cancelled
    responsible_name VARCHAR(100),
    completed_items JSONB NOT NULL DEFAULT '[]'::JSONB,
    note TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE operational_checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_checklist_runs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on operational_checklist_templates" ON operational_checklist_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on operational_checklist_templates" ON operational_checklist_templates FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on operational_checklist_runs" ON operational_checklist_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on operational_checklist_runs" ON operational_checklist_runs FOR ALL TO authenticated USING (true);
