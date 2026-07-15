import { supabase } from "./supabase";
import { toast } from "sonner";

export type Workspace = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export type Board = {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
};

export type Column = {
  id: string;
  board_id: string;
  title: string;
  order_index: number;
  created_at: string;
};

export type Task = {
  id: string;
  column_id: string;
  title: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  order_index: number;
  created_at: string;
};

// --- WORKSPACES ---
export async function fetchWorkspaces() {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Workspace[];
}

export async function createWorkspace(name: string, userId: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .insert([{ name, owner_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data as Workspace;
}

// --- BOARDS ---
export async function fetchBoards(workspaceId: string) {
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Board[];
}

export async function createBoard(workspaceId: string, name: string) {
  const { data, error } = await supabase
    .from("boards")
    .insert([{ workspace_id: workspaceId, name }])
    .select()
    .single();
  if (error) throw error;
  return data as Board;
}

// --- COLUMNS ---
export async function fetchColumns(boardId: string) {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", boardId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data as Column[];
}

export async function createColumn(boardId: string, title: string, orderIndex: number) {
  const { data, error } = await supabase
    .from("columns")
    .insert([{ board_id: boardId, title, order_index: orderIndex }])
    .select()
    .single();
  if (error) throw error;
  return data as Column;
}

// --- TASKS ---
export async function fetchTasks(boardId: string) {
  // We need to fetch tasks that belong to columns in this board.
  // Using a join query via Supabase:
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      columns!inner(board_id)
    `)
    .eq("columns.board_id", boardId)
    .order("order_index", { ascending: true });
    
  if (error) throw error;
  return data as (Task & { columns: { board_id: string } })[];
}

export async function createTask(
  columnId: string, 
  title: string, 
  priority: string = "medium", 
  status: string = "todo", 
  orderIndex: number = 0
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ column_id: columnId, title, priority, status, order_index: orderIndex }])
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId);
  if (error) {
    toast.error("Failed to update task: " + error.message);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);
  if (error) {
    toast.error("Failed to delete task: " + error.message);
    throw error;
  }
}
