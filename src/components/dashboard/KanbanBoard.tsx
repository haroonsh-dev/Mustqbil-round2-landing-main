import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Plus, Trash2, Loader2, Layout } from "lucide-react";
import { fetchColumns, createColumn, fetchTasks, createTask, updateTask, deleteTask, Column, Task } from "@/lib/api";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function KanbanBoard({ boardId, boardName }: { boardId: string, boardName: string }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  useEffect(() => {
    loadBoardData();
  }, [boardId]);

  async function loadBoardData() {
    setIsLoading(true);
    try {
      const [colsData, tasksData] = await Promise.all([
        fetchColumns(boardId),
        fetchTasks(boardId)
      ]);
      setColumns(colsData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to load board data", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Setup Realtime Sync — scoped to this board's columns
    const columnIds = columns.map(c => c.id);
    
    const channel = supabase.channel(`board-${boardId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        const newTask = payload.new as Task;
        // Only add if this task belongs to one of our columns
        if (!columnIds.includes(newTask.column_id)) return;
        setTasks((prev) => {
          if (prev.some(t => t.id === newTask.id)) return prev;
          return [...prev, newTask];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
        const updated = payload.new as Task;
        setTasks((prev) => {
          // If task moved INTO our board, add it
          if (columnIds.includes(updated.column_id) && !prev.some(t => t.id === updated.id)) {
            return [...prev, updated];
          }
          // If task moved OUT of our board, remove it
          if (!columnIds.includes(updated.column_id)) {
            return prev.filter(t => t.id !== updated.id);
          }
          // Normal update within our board
          return prev.map(t => t.id === updated.id ? updated : t);
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
        setTasks((prev) => prev.filter(t => t.id !== payload.old.id));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` }, (payload) => {
        setColumns((prev) => {
          if (prev.some(c => c.id === payload.new.id)) return prev;
          return [...prev, payload.new as Column];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` }, (payload) => {
        setColumns((prev) => prev.map(c => c.id === payload.new.id ? (payload.new as Column) : c));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` }, (payload) => {
        setColumns((prev) => prev.filter(c => c.id !== payload.old.id));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`🔴 Realtime connected for board ${boardId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, columns.length]);

  async function handleAddColumn(e: React.FormEvent) {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    
    setIsCreatingColumn(true);
    try {
      const newCol = await createColumn(boardId, newColumnTitle, columns.length);
      setColumns([...columns, newCol]);
      setNewColumnTitle("");
    } catch (error: any) {
      toast.error("Failed to create column");
    } finally {
      setIsCreatingColumn(false);
    }
  }

  async function handleAddTask(e: React.FormEvent, columnId: string) {
    e.preventDefault();
    const title = newTaskTitles[columnId];
    if (!title?.trim()) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      column_id: columnId,
      title,
      status: 'todo',
      priority: 'medium',
      assignee_id: null,
      order_index: tasks.filter(t => t.column_id === columnId).length,
      created_at: new Date().toISOString()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitles(prev => ({ ...prev, [columnId]: "" }));

    try {
      const createdTask = await createTask(columnId, title, "medium", "todo", newTask.order_index);
      setTasks(prev => prev.map(t => t.id === tempId ? createdTask : t));
    } catch (error) {
      toast.error("Failed to add task");
      setTasks(prev => prev.filter(t => t.id !== tempId));
    }
  }

  async function handleMoveTask(taskId: string, targetColumnId: string) {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column_id: targetColumnId } : t));
    
    try {
      await updateTask(taskId, { column_id: targetColumnId });
    } catch (error) {
      // Revert on failure
      toast.error("Failed to move task");
      loadBoardData();
    }
  }

  async function handleDeleteTask(taskId: string) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await deleteTask(taskId);
    } catch (error) {
      loadBoardData();
    }
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">{boardName}</h2>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.column_id === column.id).sort((a, b) => a.order_index - b.order_index);
          const nextColumn = columns[columns.findIndex(c => c.id === column.id) + 1];
          const prevColumn = columns[columns.findIndex(c => c.id === column.id) - 1];

          return (
            <div key={column.id} className="w-80 shrink-0 rounded-lg bg-muted/40 p-4 border border-border/50 flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  {column.title}
                </h3>
                <span className="rounded-full bg-muted border border-border/80 px-2 py-0.5 text-xs font-medium">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-3 custom-scrollbar">
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    className="rounded-md border border-border bg-background p-3 shadow-xs hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {task.priority}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-0.5 opacity-0 group-hover:opacity-100"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <h4 className={`text-sm font-bold mb-3 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    
                    {/* Action buttons based on column position */}
                    <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-2">
                      {prevColumn ? (
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          className="h-6 text-[10px] px-2 text-muted-foreground"
                          onClick={() => handleMoveTask(task.id, prevColumn.id)}
                        >
                          Back
                        </Button>
                      ) : <div />}
                      
                      {nextColumn ? (
                        <Button 
                          size="xs" 
                          variant="outline" 
                          className="h-6 text-[10px] px-2 gap-1"
                          onClick={() => handleMoveTask(task.id, nextColumn.id)}
                        >
                          Next <ArrowRight className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button 
                          size="xs" 
                          variant="outline" 
                          className="h-6 text-[10px] px-2 gap-1 text-green-600 hover:bg-green-50"
                        >
                          Done <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <div className="pt-3 mt-3 border-t border-border/60 shrink-0">
                <form onSubmit={(e) => handleAddTask(e, column.id)} className="flex gap-2">
                  <Input 
                    placeholder="Add task..." 
                    value={newTaskTitles[column.id] || ""}
                    onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [column.id]: e.target.value }))}
                    className="h-8 text-sm"
                  />
                  <Button type="submit" size="sm" className="h-8 px-2 shrink-0" disabled={!newTaskTitles[column.id]?.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          );
        })}

        {/* Add Column Button */}
        <div className="w-80 shrink-0 rounded-lg border border-dashed border-border/80 bg-muted/10 p-4">
          <form onSubmit={handleAddColumn} className="flex flex-col gap-2">
            <Input 
              placeholder="New column title..." 
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="h-9"
            />
            <Button type="submit" disabled={!newColumnTitle.trim() || isCreatingColumn} className="w-full h-9">
              {isCreatingColumn ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Column
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
