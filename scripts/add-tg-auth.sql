-- Run in Supabase Dashboard → SQL Editor

-- Password hash for custom auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id bigint;

-- Verification codes (for TG bot)
CREATE TABLE IF NOT EXISTS verification_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  token text UNIQUE NOT NULL,
  code text NOT NULL,
  telegram_chat_id bigint,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes')
);
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY vc_all ON verification_codes FOR ALL USING (true) WITH CHECK (true);
