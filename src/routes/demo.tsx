import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  head: () => ({
    meta: [
      { title: "Interactive Sandbox Demo — Clarity" },
      {
        name: "description",
        content: "Try our interactive project board live. Drag cards, assign tasks, and feel the flow of Clarity.",
      },
    ],
  }),
});

function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <Navbar />

      <main className="pt-20">
        {/* 1. Small Hero */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-8 text-center sm:px-6 lg:px-8 relative">
          <div className="absolute -top-30 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[90px] pointer-events-none" />
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-4 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" /> Interactive Sandbox
          </span>
          
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-gradient leading-tight">
            Try Clarity right now
          </h1>
          
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            No signup needed. Feel the spring physics and drag-and-drop feedback of our core iteration boards.
          </p>
        </section>

        {/* 2. Full Width Interactive Board Sandbox */}
        <section className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <InteractiveDemo />
        </section>

        {/* 3. CTA Section Below Sandbox */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready for the real thing?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Save sprints permanently, invite team members, configure repository sync, and unlock unlimited projects.
            </p>
            <div className="flex justify-center pt-2">
              <Link
                to="/signup"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold px-8 shadow-md hover:bg-primary/95 transition-colors nav-cta-button"
              >
                Start Free Trial <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Free forever for up to 2 members. No credit card required.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
