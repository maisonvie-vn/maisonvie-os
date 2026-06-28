-- Migration: Add review_note column to email drafts
-- Only perform changes if columns do not exist.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='email_drafts' AND column_name='review_note'
    ) THEN
        ALTER TABLE email_drafts ADD COLUMN review_note TEXT;
    END IF;
END $$;
