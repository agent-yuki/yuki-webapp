-- Link security_incidents to profiles to enable joins
-- This is necessary because security_incidents.user_id originally referenced auth.users(id)
-- but we need to join with public.profiles to get avatar and name.

-- 1. Data Cleanup Step:
-- Before enforcing the relationship, we must ensure all existing user_ids 
-- in security_incidents actually exist in the profiles table.
-- If they don't, we set them to NULL to avoid constraint violations.
UPDATE security_incidents
SET user_id = NULL
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM profiles);

DO $$ 
BEGIN 
  -- Check if the constraint already exists to avoid errors on re-run
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_security_incidents_profiles'
  ) THEN 
    ALTER TABLE security_incidents 
    ADD CONSTRAINT fk_security_incidents_profiles 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id)
    ON DELETE SET NULL;
  END IF; 
END $$;
