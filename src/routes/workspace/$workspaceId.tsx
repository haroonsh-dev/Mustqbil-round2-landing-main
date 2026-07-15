import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchBoards, createBoard, Board } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";

export const Route = createFileRoute("/workspace/$workspaceId")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: WorkspaceComponent,
});

function WorkspaceComponent() {
  const { workspaceId } = Route.useParams();
  const { user, loading } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user, workspaceId]);

  async function loadBoards() {
    try {
      const data = await fetchBoards(workspaceId);
      setBoards(data);
      if (data.length > 0 && !activeBoardId) {
        setActiveBoardId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load boards", error);
    } finally {
      setIsLoadingBoards(false);
    }
  }

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    
    setIsCreating(true);
    try {
      const newBoard = await createBoard(workspaceId, newBoardName);
      setBoards([...boards, newBoard]);
      setActiveBoardId(newBoard.id);
      setNewBoardName("");
      toast.success("Board created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create board");
    } finally {
      setIsCreating(false);
    }
  }

  if (loading || isLoadingBoards) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 font-bold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Layout className="h-4.5 w-4.5" />
              </div>
              <span>Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">{user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Split between Sidebar and Board */}
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Sidebar for Boards */}
        <aside className="w-64 border-r border-border bg-muted/10 flex flex-col p-4 shrink-0 overflow-y-auto hidden md:flex">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Your Boards
          </h2>
          <div className="space-y-1 mb-6 flex-1">
            {boards.map(board => (
              <button
                key={board.id}
                onClick={() => setActiveBoardId(board.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeBoardId === board.id 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {board.name}
              </button>
            ))}
            {boards.length === 0 && (
              <div className="text-sm text-muted-foreground italic px-2">No boards yet.</div>
            )}
          </div>
          
          <div className="pt-4 border-t border-border shrink-0">
            <form onSubmit={handleCreateBoard} className="flex flex-col gap-2">
              <Input 
                placeholder="New board name..." 
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="h-8 text-sm"
              />
              <Button type="submit" size="sm" disabled={!newBoardName.trim() || isCreating} className="w-full h-8">
                {isCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3 mr-1" />}
                Add Board
              </Button>
            </form>
          </div>
        </aside>

        {/* Active Board Area */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden bg-muted/5 relative">
          {activeBoardId ? (
            <KanbanBoard boardId={activeBoardId} boardName={boards.find(b => b.id === activeBoardId)?.name || ""} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <Layout className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No Board Selected</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Create a new board in the sidebar to start organizing your tasks.
              </p>
              
              {/* Mobile create board fallback */}
              <div className="mt-8 p-4 border border-border rounded-lg bg-card w-full max-w-xs md:hidden">
                <form onSubmit={handleCreateBoard} className="flex flex-col gap-2">
                  <Input 
                    placeholder="New board name..." 
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                  />
                  <Button type="submit" disabled={!newBoardName.trim() || isCreating} className="w-full">
                    Create Board
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
