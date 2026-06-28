-- Migration: Guest Feedback Foundation
-- Only create tables if they do not exist.

CREATE TABLE IF NOT EXISTS guest_feedback_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_date DATE NOT NULL,
    visit_date DATE,
    guest_name VARCHAR(100),
    guest_contact VARCHAR(100),
    source_channel VARCHAR(50) NOT NULL, -- onsite, email, phone, zalo, google_review, tripadvisor, facebook, tour_guide, travel_agency, manager_note, other
    feedback_type VARCHAR(50) NOT NULL, -- complaint, compliment, suggestion, incident, service_issue, kitchen_issue, reservation_issue, email_issue, review, other
    rating NUMERIC,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- new, reviewing, action_required, resolved, archived
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reservation_id UUID, -- Optional soft link or foreign key
    daily_report_id UUID REFERENCES daily_operation_reports(id) ON DELETE SET NULL,
    learning_event_id UUID REFERENCES learning_events(id) ON DELETE SET NULL,
    improvement_action_id UUID REFERENCES improvement_actions(id) ON DELETE SET NULL,
    owner_name VARCHAR(100),
    action_required BOOLEAN NOT NULL DEFAULT FALSE,
    ceo_attention_required BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_note TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE guest_feedback_records ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access
CREATE POLICY "Allow read access to authenticated users on guest_feedback_records" ON guest_feedback_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on guest_feedback_records" ON guest_feedback_records FOR ALL TO authenticated USING (true);
