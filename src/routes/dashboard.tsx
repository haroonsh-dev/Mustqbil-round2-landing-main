import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchWorkspaces, createWorkspace, Workspace } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    // Basic protection to redirect if unauthenticated, 
    // although useAuth will also handle client-side protection.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardComponent,
});

function DashboardComponent() {
  const { user, isLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user]);

  async function loadWorkspaces() {
    try {
      const data = await fetchWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.error("Failed to load workspaces", error);
    } finally {
      setIsLoadingWorkspaces(false);
    }
  }

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !user) return;
    
    setIsCreating(true);
    try {
      const newWs = await createWorkspace(newWorkspaceName, user.id);
      setWorkspaces([...workspaces, newWs]);
      setNewWorkspaceName("");
      toast.success("Workspace created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create workspace");
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading || isLoadingWorkspaces) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Layout className="h-4.5 w-4.5" />
            </div>
            <span>Clarity</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => supabase.auth.signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
            <p className="text-muted-foreground mt-1">Select a workspace to view your sprint boards.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Create New Workspace Card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors bg-muted/20">
            <CardContent className="pt-6">
              <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Create New Workspace</h3>
                  <Input 
                    placeholder="E.g. Engineering, Marketing..." 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newWorkspaceName.trim() || isCreating}
                  className="w-full gap-2"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List existing workspaces */}
          {workspaces.map((ws) => (
            <Link key={ws.id} to="/workspace/$workspaceId" params={{ workspaceId: ws.id }} className="block h-full">
              <Card className="h-full hover:border-primary/50 transition-colors spotlight-card cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{ws.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(ws.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
