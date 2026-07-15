import { useAuth } from "@/hooks/use-auth";
import { Sparkles } from "lucide-react";
import { HeroEmailForm } from "./HeroEmailForm";

export function Hero() {
  const { user } = useAuth();

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
          Built for lean engineering teams that need to ship fast. Clarity gives you a lightning-fast workspace to manage sprints and backlogs without the bloated configuration of legacy enterprise tools.
        </p>

        <HeroEmailForm />

        {/* Secondary text */}
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-6">
          Loved by technical founders, product managers, and agile development agencies.
        </p>
      </div>
    </section>
  );
}
