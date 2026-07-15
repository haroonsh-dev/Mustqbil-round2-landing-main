import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Layout, ArrowLeft, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordComponent,
});

function ForgotPasswordComponent() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
      toast.success("Password reset instructions sent.");
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
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>
            {submitted
              ? "Check your email for a reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="reset-email" className="text-xs font-semibold">
                  Email address
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 mt-2 cursor-pointer font-semibold shadow-xs"
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                We sent an email to <span className="font-semibold text-foreground">{email}</span>{" "}
                with a link to reset your password.
              </p>
              <Button
                variant="outline"
                className="w-full cursor-pointer shadow-xs"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center justify-center border-t border-border/50 pt-4">
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
