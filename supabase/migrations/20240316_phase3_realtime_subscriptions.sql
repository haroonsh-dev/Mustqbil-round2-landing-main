-- Phase 3: Supabase Realtime & Stripe Subscriptions

-- 1. Enable Realtime for Kanban Board
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'columns'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE columns;
  END IF;
END $$;

-- 2. Create Subscriptions Table for Stripe Webhooks
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions can be viewed by members of the workspace
CREATE POLICY "Members can view workspace subscriptions" 
  ON subscriptions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = subscriptions.workspace_id 
      AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
