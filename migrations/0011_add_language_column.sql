-- Add language column to security_incidents

ALTER TABLE security_incidents
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Solidity';
