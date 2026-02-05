-- Function to safely increment credits atomically
CREATE OR REPLACE FUNCTION increment_credits(user_id_input UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + amount
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql;
