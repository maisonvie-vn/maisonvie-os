-- Migration: Build Email Foundation
-- Only create tables if they do not exist.

-- 1. EMAIL MESSAGES TABLE
CREATE TABLE IF NOT EXISTS email_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'New', -- New, Reading, Draft Created, Pending Review, Approved, Sent, Archived
    related_guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    related_reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EMAIL DRAFTS TABLE
CREATE TABLE IF NOT EXISTS email_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_message_id UUID REFERENCES email_messages(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    draft_subject VARCHAR(255) NOT NULL,
    draft_body TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'Vietnamese',
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Pending Review, Approved, Sent
    reviewed_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EMAIL TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) DEFAULT 'Vietnamese',
    subject_template VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    category VARCHAR(100), -- Welcome, Confirmation, Reminder, Allergy Follow-up
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for all tables
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create Policies for Authenticated users
CREATE POLICY "Allow read access to authenticated users on email_messages" ON email_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on email_messages" ON email_messages FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on email_drafts" ON email_drafts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on email_drafts" ON email_drafts FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on email_templates" ON email_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on email_templates" ON email_templates FOR ALL TO authenticated USING (true);
