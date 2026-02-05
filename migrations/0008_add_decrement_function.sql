-- Function to safely decrement credits atomically
CREATE OR REPLACE FUNCTION decrement_credits(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET credits = credits - 1
  WHERE id = p_user_id AND credits > 0;
END;
$$ LANGUAGE plpgsql;
