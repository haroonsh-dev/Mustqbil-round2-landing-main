import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout, Users, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/onboarding" }) as { email?: string; name?: string; session_id?: string };
  
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emails, setEmails] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }
    
    // If they came from checkout, we have their email. Let's create their account.
    if (search.email && search.name) {
      if (!password) {
        toast.error("Please set a password for your account");
        return;
      }
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: search.email,
        password,
        options: {
          data: {
            full_name: search.name,
          }
        }
      });
      setLoading(false);
      
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    
    setStep(2);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      // If we don't have a session, we might be in dev mode without email confirmation enabled,
      // or we just need to try getting the user.
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        // Fallback for mock demo if Supabase isn't configured
        console.warn("No authenticated user found. Skipping real inserts.");
        toast.success("Workspace setup complete!");
        navigate({ to: "/dashboard" });
        return;
      }

      // 2. Insert Workspace
      const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({ name: workspaceName, owner_id: user.id })
        .select()
        .single();
        
      if (wsError) throw wsError;

      // 3. Insert Default Board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({ name: 'Sprint 1', workspace_id: workspace.id })
        .select()
        .single();
        
      if (boardError) throw boardError;

      // 4. Insert Columns
      const columnsToInsert = [
        { board_id: board.id, title: 'To Do', order_index: 0 },
        { board_id: board.id, title: 'In Progress', order_index: 1 },
        { board_id: board.id, title: 'Done', order_index: 2 }
      ];
      
      const { data: columns, error: colError } = await supabase
        .from('columns')
        .insert(columnsToInsert)
        .select();
        
      if (colError) throw colError;

      // 5. Insert Mock Tasks into "To Do"
      const todoColumn = columns.find(c => c.title === 'To Do');
      if (todoColumn) {
        const tasksToInsert = [
          { column_id: todoColumn.id, title: 'Customize your board', status: 'todo', priority: 'high', order_index: 0 },
          { column_id: todoColumn.id, title: 'Create your first task', status: 'todo', priority: 'medium', order_index: 1 },
          { column_id: todoColumn.id, title: 'Invite team members', status: 'todo', priority: 'low', order_index: 2 }
        ];
        
        await supabase.from('tasks').insert(tasksToInsert);
      }

      // 6. Invite Team Members via Edge Function
      const validEmails = emails.filter(e => e.trim() !== "");
      if (validEmails.length > 0) {
        try {
          const { data: inviteData, error: inviteError } = await supabase.functions.invoke('send-invite', {
            body: { workspace_id: workspace.id, emails: validEmails },
          });
          
          if (inviteError) {
            console.error("Failed to invite some members:", inviteError);
            toast.warning("Workspace created, but some invites failed to send.");
          } else {
            console.log(`📧 Invited ${inviteData?.invited || 0} team member(s)`);
          }
        } catch (inviteErr) {
          console.error("Edge Function call failed:", inviteErr);
          toast.warning("Workspace created, but invitations could not be sent right now.");
        }
      }

      toast.success("Workspace setup complete!");
      navigate({ to: "/dashboard" });
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred setting up the workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-dots flex flex-col p-4 items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/5 pointer-events-none" />

      <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Layout className="h-5 w-5" />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Set up your Team Workspace</h1>
            <p className="text-sm text-muted-foreground">You're almost there! Let's get things configured.</p>
          </div>

          <div className="flex items-center gap-4 mt-4 w-full max-w-sm">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-card border border-border shadow-2xl rounded-2xl p-1">
          {step === 1 ? (
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader>
                <CardTitle>Name your workspace</CardTitle>
                <CardDescription>This is usually your company or team name.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNext} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Workspace Name</label>
                    <Input
                      autoFocus
                      placeholder="e.g. Acme Corp"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  {search.email && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Set an Account Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">This creates your account for {search.email}</p>
                    </div>
                  )}

                  <Button disabled={loading} type="submit" className="w-full h-11 cursor-pointer">
                    {loading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-none bg-transparent animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader>
                <CardTitle>Invite your team</CardTitle>
                <CardDescription>Clarity is better together. Invite them to <strong>{workspaceName}</strong> now.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFinish} className="space-y-6">
                  <div className="space-y-3">
                    {emails.map((email, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                          <Users className="h-4 w-4" />
                        </div>
                        <Input
                          type="email"
                          placeholder={`teammate${i + 1}@company.com`}
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...emails];
                            newEmails[i] = e.target.value;
                            setEmails(newEmails);
                          }}
                          className="h-10"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-11 cursor-pointer"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="w-full h-11 cursor-pointer" disabled={loading}>
                      {loading ? "Generating Workspace..." : "Finish Setup"}
                    </Button>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    You can always invite more people later from your dashboard.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
