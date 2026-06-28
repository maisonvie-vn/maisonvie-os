-- Migration: Add note column to reservation status history
-- Only perform changes if columns do not exist.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='reservation_status_history' AND column_name='status_change_note'
    ) THEN
        ALTER TABLE reservation_status_history ADD COLUMN status_change_note TEXT;
    END IF;
END $$;
