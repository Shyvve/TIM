-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS chat_rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL UNIQUE,
  message_timestamps timestamptz[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_messages_all ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY chat_rate_limits_all ON chat_rate_limits FOR ALL USING (true) WITH CHECK (true);
