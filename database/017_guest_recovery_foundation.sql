-- Migration: Guest Recovery & Follow-up Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS guest_recovery_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES guest_feedback_records(id) ON DELETE SET NULL,
    reservation_id UUID, -- Soft link or foreign key if reservations table exists
    email_draft_id UUID, -- Soft link or foreign key to email_drafts
    improvement_action_id UUID REFERENCES improvement_actions(id) ON DELETE SET NULL,
    case_date DATE NOT NULL,
    guest_name VARCHAR(100),
    guest_contact VARCHAR(100),
    recovery_type VARCHAR(50) NOT NULL, -- apology, manager_call, email_follow_up, agency_follow_up, complimentary_item, discount_offer, rebooking_offer, service_correction, internal_resolution, other
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, contacting, waiting_guest_response, recovery_offered, resolved, closed, archived
    owner_name VARCHAR(100),
    due_date DATE,
    issue_summary TEXT NOT NULL,
    recovery_plan TEXT,
    follow_up_note TEXT,
    recovery_result TEXT,
    ceo_attention_required BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE guest_recovery_cases ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on guest_recovery_cases" ON guest_recovery_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on guest_recovery_cases" ON guest_recovery_cases FOR ALL TO authenticated USING (true);
