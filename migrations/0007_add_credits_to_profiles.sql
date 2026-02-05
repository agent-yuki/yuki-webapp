-- Add credits column to profiles for rate limiting/billing
-- Default to 3 credits for everyone (Free Tier)

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3;

-- Just in case the default didn't apply to existing rows (it usually does in PG 11+, but good to be safe)
UPDATE profiles 
SET credits = 3 
WHERE credits IS NULL;
