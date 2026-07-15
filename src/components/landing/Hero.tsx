import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Github, ArrowRight, MessageSquare, Check, Mail, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const { user } = useAuth();
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailError, setHeroEmailError] = useState("");
  const [heroEmailSuccess, setHeroEmailSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoView, setDemoView] = useState("board");

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail.includes("@")) {
      setHeroEmailError("Please include an '@' in the email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setHeroEmailSuccess(true);
    }, 1000);
  };

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-3xl mb-12">
        <div 
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold mb-6 animate-pulse hero-badge"
        >
          <Sparkles className="h-3 w-3" />
          <span>Introducing Clarity 2.0</span>
        </div>

        <h1
          id="hero-title"
          className="text-gradient leading-tight"
          style={{
            fontSize: "clamp(3rem,6vw,5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em"
          }}
        >
          Project management without the <span className="noise-gradient-text">noise</span>
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Clarity is a clean, focused, and lightning-fast developer workspace to plan sprints, track
          backlogs, and ship code without clunky configuration tables.
        </p>

        {user ? (
          <div className="mt-10 flex justify-center">
            <Button
              size="lg"
              className="h-12 px-8 cursor-pointer font-bold shadow-md hover:scale-[1.02] transition-transform shimmer-button"
              asChild
            >
              <Link to="/">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center">
            <form
              onSubmit={handleHeroSubmit}
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
              aria-label="Hero trial sign-up"
              noValidate
            >
              <div className="relative flex-grow">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  className={`h-11 pl-10 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    heroEmailError
                      ? "border-destructive focus-visible:ring-destructive"
                      : heroEmailSuccess
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                  }`}
                  value={heroEmail}
                  onChange={(e) => {
                    setHeroEmail(e.target.value);
                    if (heroEmailError) setHeroEmailError("");
                  }}
                  aria-invalid={!!heroEmailError}
                  aria-describedby={heroEmailError ? "hero-email-error" : undefined}
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="shrink-0 h-11 cursor-pointer font-semibold shadow-xs shimmer-button"
                disabled={isSubmitting || heroEmailSuccess}
              >
                {isSubmitting
                  ? "Connecting..."
                  : heroEmailSuccess
                    ? "Signed Up!"
                    : "Get started free"}
              </Button>
            </form>

            {heroEmailError && (
              <p
                id="hero-email-error"
                className="mt-2 text-xs font-medium text-destructive text-left w-full max-w-md pl-2"
              >
                {heroEmailError}
              </p>
            )}
            {heroEmailSuccess && (
              <p className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400 text-left w-full max-w-md pl-2">
                ✓ Check your email! We've sent your setup link.
              </p>
            )}
          </div>
        )}
        {/* Secondary text */}
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-6">
          Built for focused product teams that want less admin and clearer sprint flow.
        </p>
      </div>
    </section>
  );
}
