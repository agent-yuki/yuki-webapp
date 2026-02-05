-- Add visibility and ownership tracking to security_incidents
-- This allows Pro users to mark their scans as PRIVATE

ALTER TABLE security_incidents 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE'));

-- Create an index to quickly filter public vs private incidents
CREATE INDEX IF NOT EXISTS idx_security_incidents_visibility ON security_incidents(visibility);
CREATE INDEX IF NOT EXISTS idx_security_incidents_user_id ON security_incidents(user_id);

-- Enable Row Level Security (RLS) to enforce privacy at the database level
ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;

-- 1. Everyone (Anon + Auth) can see PUBLIC incidents
CREATE POLICY "Public incidents are viewable by everyone" 
ON security_incidents FOR SELECT 
USING (visibility = 'PUBLIC');

-- 2. Users can see their own PRIVATE incidents
CREATE POLICY "Users can see their own private incidents" 
ON security_incidents FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Users can create incidents (linked to their ID)
CREATE POLICY "Users can create incidents" 
ON security_incidents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Users can update their own incidents (e.g. toggle visibility)
CREATE POLICY "Users can update their own incidents" 
ON security_incidents FOR UPDATE 
USING (auth.uid() = user_id);
