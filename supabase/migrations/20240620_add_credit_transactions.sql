-- supabase/migrations/20240620_add_credit_transactions.sql

CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  phone text,
  amount integer NOT NULL,
  transaction_type text NOT NULL, -- 'purchase' | 'spend' | 'refund'
  stripe_session_id text,
  task_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Function to safely increment concierge credits
CREATE OR REPLACE FUNCTION increment_concierge_credits(x_user_id uuid, x_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET concierge_credits = COALESCE(concierge_credits, 0) + x_amount
  WHERE id = x_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
