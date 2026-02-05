-- Add source_code and scanned_files columns to security_incidents

ALTER TABLE security_incidents
ADD COLUMN IF NOT EXISTS source_code TEXT,
ADD COLUMN IF NOT EXISTS scanned_files JSONB DEFAULT '[]'::jsonb;
