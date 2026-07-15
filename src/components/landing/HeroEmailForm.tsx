import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function HeroEmailForm() {
  const [heroEmail, setHeroEmail] = useState("");
  const [heroEmailError, setHeroEmailError] = useState("");
  const [heroEmailSuccess, setHeroEmailSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail.includes("@")) {
      setHeroEmailError("Please include an '@' in the email address.");
      return;
    }
    setIsSubmitting(true);
    
    import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent("form_submit", { form_name: "hero_email_capture", email: heroEmail });
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setHeroEmailSuccess(true);
      navigate({ to: "/signup", search: { email: heroEmail } });
    }, 600);
  };

  return (
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
  );
}
