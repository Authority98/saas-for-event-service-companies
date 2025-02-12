-- Add new columns for toggle switch functionality
ALTER TABLE extras
ADD COLUMN IF NOT EXISTS left_label TEXT,
ADD COLUMN IF NOT EXISTS right_label TEXT;
