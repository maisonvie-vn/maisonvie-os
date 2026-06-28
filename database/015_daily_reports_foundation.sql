-- Migration: Manager Daily Report Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS daily_operation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL,
    shift_type VARCHAR(50) NOT NULL, -- lunch, dinner, full_day, event, other
    department VARCHAR(50) NOT NULL, -- foh, boh, reservation, email, management, all, other
    manager_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, submitted, reviewed, archived
    overall_summary TEXT NOT NULL,
    guest_notes TEXT,
    service_issues TEXT,
    kitchen_issues TEXT,
    reservation_issues TEXT,
    email_issues TEXT,
    maintenance_issues TEXT,
    staff_notes TEXT,
    checklist_run_id UUID REFERENCES operational_checklist_runs(id) ON DELETE SET NULL,
    improvement_action_id UUID REFERENCES improvement_actions(id) ON DELETE SET NULL,
    action_required BOOLEAN NOT NULL DEFAULT FALSE,
    ceo_attention_required BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE daily_operation_reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on daily_operation_reports" ON daily_operation_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on daily_operation_reports" ON daily_operation_reports FOR ALL TO authenticated USING (true);
