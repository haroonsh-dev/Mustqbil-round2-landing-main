import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/5 to-primary/5 rounded-3xl blur-3xl opacity-75 -z-10" />

      <div className="rounded-3xl border border-primary/20 bg-card p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden group">
        {/* Shimmer overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Start Shipping Faster
          </span>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Focus your team. Clear the noise.
          </h2>
          
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Join thousands of developers prioritizing speed and simplicity over enterprise bureaucracy. Set up your workspace in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/95 nav-cta-button"
            >
              Start Free Trial <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Try the Sandbox
            </a>
          </div>
          
          <p className="text-[10px] text-muted-foreground pt-2">
            Free forever for up to 2 members. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
