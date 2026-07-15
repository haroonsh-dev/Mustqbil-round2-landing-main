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
import { Layout, ArrowLeft, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type VerifySearch = {
  email?: string;
};

export const Route = createFileRoute("/verify")({
  component: VerifyComponent,
  validateSearch: (search: Record<string, unknown>): VerifySearch => {
    return {
      email: search.email as string | undefined,
    };
  },
});

function VerifyComponent() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }
    if (!email) {
      toast.error("Email address is missing. Please try signing up again.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to verify code");
    } else if (data?.user) {
      toast.success("Email verified successfully! Welcome to Clarity.");
      navigate({ to: "/" });
    }
  };

  const handleResend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verification code resent to your email.");
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
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent a 6-digit verification code to <br />
            <span className="font-semibold text-foreground">{email || "your email"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="verify-code" className="text-xs font-semibold text-center block mb-2">
                Verification Code
              </label>
              <Input
                id="verify-code"
                type="text"
                placeholder="123456"
                className="text-center text-lg tracking-[0.5em] font-mono h-12"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ""))}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-10 mt-4 cursor-pointer font-semibold shadow-xs"
              disabled={loading || token.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Click to resend
              </button>
            </p>
          </div>
        </CardContent>
        <CardFooter className="text-center justify-center border-t border-border/50 pt-4">
          <Link
            to="/signup"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
