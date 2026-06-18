-- Run in Supabase Dashboard → SQL Editor
-- Step 1: Add auth columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id uuid UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Step 2: Activity log for heatmap
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL, -- 'lesson_complete', 'opportunity_save', 'course_start', 'login'
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id, date);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY activity_log_all ON activity_log FOR ALL USING (true) WITH CHECK (true);

-- Step 3: Essay drafts
CREATE TABLE IF NOT EXISTS essay_drafts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  template_type text NOT NULL, -- 'montage', 'narrative'
  fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE essay_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY essay_drafts_all ON essay_drafts FOR ALL USING (true) WITH CHECK (true);
