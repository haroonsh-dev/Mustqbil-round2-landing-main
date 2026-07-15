import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Plus, Trash2, Edit2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "todo" | "progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export function InteractiveDemo() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Design login flow", status: "done", priority: "high", assignee: "H" },
    { id: "2", title: "Setup PostgreSQL", status: "progress", priority: "high", assignee: "H" },
    { id: "3", title: "Fix mobile nav", status: "todo", priority: "medium", assignee: "H" }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [boardName, setBoardName] = useState("demo");
  const [isEditingName, setIsEditingName] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [transitioningTaskId, setTransitioningTaskId] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  const triggerConfettiBurst = (x: number, y: number) => {
    const colors = ["#6366F1", "#818CF8", "#10B981", "#F59E0B", "#EF4444"];
    const initialParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: Math.random() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      speed: 3 + Math.random() * 5,
      size: 4 + Math.random() * 6,
    }));

    setParticles(initialParticles);

    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      setParticles((prev) =>
        prev
          .map((p) => {
            const vx = Math.cos(p.angle) * p.speed;
            const vy = Math.sin(p.angle) * p.speed + 0.3; // gravity
            return {
              ...p,
              x: p.x + vx,
              y: p.y + vy,
              speed: p.speed * 0.95, // friction
            };
          })
          .filter(() => ticks < 30)
      );

      if (ticks >= 30) {
        clearInterval(interval);
        setParticles([]);
      }
    }, 16);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority,
      assignee: "H"
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const moveTask = (id: string, newStatus: Task["status"], e?: React.MouseEvent) => {
    if (newStatus === "done" && e) {
      setCompletingTaskId(id);
      triggerConfettiBurst(e.clientX, e.clientY);
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        setCompletingTaskId(null);
      }, 300);
    } else {
      setTransitioningTaskId(id);
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        setTransitioningTaskId(null);
      }, 150);
    }
  };

  const deleteTask = (id: string) => {
    setDeletingTaskId(id);
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== id));
      setDeletingTaskId(null);
    }, 300);
  };
  return (
    <div className="w-full space-y-6">
        {/* Top Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            {isEditingName ? (
              <Input
                type="text"
                className="ml-2 h-7 w-48 text-xs font-mono py-0 px-1.5 focus-visible:ring-1"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false);
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => setIsEditingName(true)}
                className="ml-2 text-sm text-muted-foreground font-mono cursor-pointer hover:text-foreground hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors inline-flex items-center gap-1.5 group/name"
                title="Click to change board name"
              >
                {boardName}
                <Edit2 className="h-3.5 w-3.5 opacity-0 group-hover/name:opacity-60 transition-opacity" />
              </span>
            )}
          </div>
          <form onSubmit={handleAddTask} className="flex flex-wrap items-center gap-2">
            <Input
              type="text"
              placeholder="New task title..."
              className="h-9 w-full sm:w-48 text-sm"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as "low" | "medium" | "high")}
              className="h-9 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <Button type="submit" size="sm" className="h-9 w-full sm:w-auto gap-1 shadow-xs cursor-pointer">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </form>
        </div>

        {/* Particle Blast Effect Layer */}
        {particles.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        )}

        {/* Simplified preview disclaimer banner */}
        <div className="mb-6 rounded-lg bg-primary/5 border border-primary/25 p-3 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
          <span>
            💡 <strong>Sandbox Preview:</strong> This interactive board is a simplified preview showing 3 columns and priority levels.
          </span>
          <Link to="/signup" className="font-semibold text-primary hover:underline shrink-0">
            Create full workspace (custom workflows, tags, unlimited columns) →
          </Link>
        </div>

        {/* Board Columns Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* To Do Column */}
          <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                To Do
              </h3>
              <span className="rounded-full bg-muted border border-border/80 px-2 py-0.5 text-xs font-medium">
                {tasks.filter((t) => t.status === "todo").length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[250px]">
              {tasks.filter((t) => t.status === "todo").length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] rounded-lg border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
                  No tasks. Add one above!
                </div>
              ) : (
                tasks
                  .filter((t) => t.status === "todo")
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-md border border-border bg-background p-3 shadow-xs hover:border-primary/50 transition-colors ${
                        deletingTaskId === t.id ? "deleting-card" : ""
                      } ${
                        completingTaskId === t.id ? "completing-card" : ""
                      } ${
                        transitioningTaskId === t.id ? "transitioning-out-card" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            t.priority === "high"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : t.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold mb-3">{t.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/20">
                          {t.assignee.substring(0, 1)}
                        </div>
                        <Button
                          size="xs"
                          variant="outline"
                          className="h-6 text-xs gap-0.5 cursor-pointer"
                          onClick={() => moveTask(t.id, "progress")}
                        >
                          Start <ArrowRight className="h-3 w-3 ml-0.5" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                In Progress
              </h3>
              <span className="rounded-full bg-muted border border-border/80 px-2 py-0.5 text-xs font-medium">
                {tasks.filter((t) => t.status === "progress").length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[250px]">
              {tasks.filter((t) => t.status === "progress").length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] rounded-lg border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
                  No active tasks. Move ones from To Do!
                </div>
              ) : (
                tasks
                  .filter((t) => t.status === "progress")
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-md border border-border bg-background p-3 shadow-xs hover:border-primary/50 transition-colors ${
                        deletingTaskId === t.id ? "deleting-card" : ""
                      } ${
                        completingTaskId === t.id ? "completing-card" : ""
                      } ${
                        transitioningTaskId === t.id ? "transitioning-out-card" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            t.priority === "high"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : t.priority === "medium"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold mb-3">{t.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/20">
                          {t.assignee.substring(0, 1)}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            className="h-6 text-xs cursor-pointer"
                            onClick={() => moveTask(t.id, "todo")}
                          >
                            Back
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            className="h-6 text-xs gap-0.5 text-green-600 dark:text-green-400 hover:bg-green-500/10 cursor-pointer"
                            onClick={(e) => moveTask(t.id, "done", e)}
                          >
                            Done <Check className="h-3 w-3 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="rounded-lg bg-muted/40 p-4 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Done
              </h3>
              <span className="rounded-full bg-muted border border-border/80 px-2 py-0.5 text-xs font-medium">
                {tasks.filter((t) => t.status === "done").length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[250px]">
              {tasks.filter((t) => t.status === "done").length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] rounded-lg border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
                  No completed tasks. Work to get them done!
                </div>
              ) : (
                tasks
                  .filter((t) => t.status === "done")
                  .map((t) => (
                    <div
                      key={t.id}
                      className={`rounded-md border border-border bg-background p-3 shadow-xs hover:border-primary/50 transition-colors opacity-80 ${
                        deletingTaskId === t.id ? "deleting-card" : ""
                      } ${
                        transitioningTaskId === t.id ? "transitioning-out-card" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-xs px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          done
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold mb-3 line-through text-muted-foreground">
                        {t.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground border border-border">
                          {t.assignee.substring(0, 1)}
                        </div>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="h-6 text-xs text-muted-foreground cursor-pointer"
                          onClick={() => moveTask(t.id, "progress")}
                        >
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
