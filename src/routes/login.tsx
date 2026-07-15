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
import { Layout, Github, Sparkles, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged in! Redirecting to workspace...");
      navigate({ to: "/" });
    }
  };

  const handleOAuthLogin = async (provider: "github" | "okta" = "github") => {
    setOauthLoading(provider);

    // Note: Okta requires specific Supabase Enterprise config, using Github as the active default
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === "okta" ? "keycloak" : "github", // Mocking Okta via another provider if needed, or simply pass github
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(error.message);
      setOauthLoading(null);
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

      <Card className="w-full max-w-md shadow-2xl glow-effect border-border/80 bg-card">
        <CardHeader className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-foreground mx-auto mb-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Layout className="h-4.5 w-4.5" />
            </div>
            <span>Clarity</span>
          </Link>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and credentials to enter your sprint boards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="login-email" className="text-xs font-semibold">
                Work Email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
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

            <div className="flex items-center space-x-2 pb-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2 cursor-pointer font-semibold shadow-xs"
              disabled={loading || oauthLoading !== null}
            >
              {loading ? "Authenticating..." : "Log In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full h-10 gap-2 cursor-pointer shadow-xs"
              disabled={oauthLoading !== null}
              onClick={() => handleOAuthLogin("github")}
            >
              {oauthLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 gap-2 cursor-pointer shadow-xs"
              disabled={oauthLoading !== null}
              onClick={() => handleOAuthLogin("okta")}
            >
              {oauthLoading === "okta" ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-primary" />
              )}
              Okta SAML
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center justify-center border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">
            Don't have a workspace yet?{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Create free trial
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
