-- Phase 2: Team Invites Engine & Realtime Multiplayer

-- 1. Create workspace_members table
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(workspace_id, email)
);

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Workspace members can view members of their own workspace
CREATE POLICY "Users can view workspace members" 
  ON workspace_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspaces WHERE workspaces.id = workspace_members.workspace_id AND workspaces.owner_id = auth.uid()
    )
    OR email = (auth.jwt()->>'email')::text
  );

-- Only workspace owners can invite members
CREATE POLICY "Owners can insert workspace members" 
  ON workspace_members FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces WHERE workspaces.id = workspace_id AND workspaces.owner_id = auth.uid()
    )
  );

-- 2. Update existing policies to grant access to members
-- We are adding the condition that a user can access the board/task if they are IN the workspace_members table.

-- Workspaces
CREATE POLICY "Members can view workspaces" 
  ON workspaces FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = workspaces.id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );

-- Boards
CREATE POLICY "Members can view boards" 
  ON boards FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = boards.workspace_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can insert boards" 
  ON boards FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = workspace_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can update boards" 
  ON boards FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members WHERE workspace_members.workspace_id = boards.workspace_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );

-- Columns
CREATE POLICY "Members can view columns" 
  ON columns FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE boards.id = columns.board_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );

CREATE POLICY "Members can insert columns" 
  ON columns FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE boards.id = board_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can update columns" 
  ON columns FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM boards 
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE boards.id = columns.board_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );

-- Tasks
CREATE POLICY "Members can view tasks" 
  ON tasks FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE columns.id = tasks.column_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can insert tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE columns.id = column_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can update tasks" 
  ON tasks FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE columns.id = tasks.column_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
  
CREATE POLICY "Members can delete tasks" 
  ON tasks FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM columns 
      JOIN boards ON boards.id = columns.board_id
      JOIN workspace_members ON workspace_members.workspace_id = boards.workspace_id
      WHERE columns.id = tasks.column_id AND workspace_members.email = (auth.jwt()->>'email')::text
    )
  );
