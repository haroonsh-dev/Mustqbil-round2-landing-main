import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout, Github, Mail, Shield, Check, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  component: SignupComponent,
});

function SignupComponent() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTos, setAcceptedTos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !workspace || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!acceptedTos) {
      toast.error("You must accept the Terms of Service to create a workspace");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          workspace_name: workspace,
        },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else if (!data.session) {
      toast.success("Account created! Please check your email to verify your account.");
      navigate({ to: `/login` });
    } else {
      toast.success("Workspace created successfully!");
      navigate({ to: `/dashboard` });
    }
  };

  const handleGitHubSignup = async () => {
    setOauthLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
      setOauthLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid-dots flex items-center justify-center p-4">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/5 pointer-events-none" />

      {/* Floating Theme Button */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-xs transition-colors hover:bg-muted cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <Link
          to="/"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground bg-card border border-border px-3 py-2 rounded-md transition-colors"
        >
          Back to site
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 max-w-4xl w-full items-stretch">
        {/* Left Side: Product Value & Safeguards */}
        <div className="hidden lg:flex flex-col justify-between p-8 rounded-xl border border-border bg-card shadow-lg relative overflow-hidden">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Layout className="h-4.5 w-4.5" />
              </div>
              <span>Clarity</span>
            </Link>

            <h2 className="text-3xl font-extrabold tracking-tight">
              Create your 14-day free trial workspace
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience project management designed specifically for focused software engineering
              teams. No credit card required.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Unlimited active boards and tasks</p>
                  <p className="text-muted-foreground text-[10px]">
                    Invite all developers, coordinate sprints, and structure releases.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Automated repository sync</p>
                  <p className="text-muted-foreground text-[10px]">
                    Link commits and pull requests directly to cards. Auto-close issues.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">SAML Single Sign-On Ready</p>
                  <p className="text-muted-foreground text-[10px]">
                    Secure team credentials with Okta, Azure, or Auth0 integrations.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-border flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            <Shield className="h-4 w-4 text-primary" /> SOC 2 Type II Certified Workspace
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <Card className="w-full shadow-2xl glow-effect border-border/80 bg-card flex flex-col justify-between">
          <CardHeader className="text-center lg:text-left">
            <CardTitle className="text-xl">Get started with Clarity</CardTitle>
            <CardDescription>Setup your organization domain and invite your team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="signup-name" className="text-xs font-semibold">
                  Your Full Name
                </label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="signup-email" className="text-xs font-semibold">
                  Work Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="sarah@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="signup-workspace" className="text-xs font-semibold">
                  Workspace Name
                </label>
                <Input
                  id="signup-workspace"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="signup-password" className="text-xs font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2 pb-2">
                <input
                  type="checkbox"
                  id="tos"
                  checked={acceptedTos}
                  onChange={(e) => setAcceptedTos(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
                  required
                />
                <label
                  htmlFor="tos"
                  className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              <Button
                type="submit"
                className="w-full h-10 mt-2 cursor-pointer font-semibold shadow-xs"
                disabled={loading || oauthLoading}
              >
                {loading ? "Initializing..." : "Create Free Workspace"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or integrate with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 gap-2 cursor-pointer shadow-xs"
              disabled={oauthLoading}
              onClick={handleGitHubSignup}
            >
              {oauthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              Sign Up with GitHub
            </Button>
          </CardContent>
          <CardFooter className="text-center justify-center border-t border-border/50 pt-4">
            <p className="text-xs text-muted-foreground">
              Already have a workspace?{" "}
              <Link to="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
