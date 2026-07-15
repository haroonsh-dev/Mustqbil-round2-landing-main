import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  Layout, 
  Zap, 
  Shield, 
  Check, 
  BarChart3, 
  GitCommit, 
  Users, 
  MessageSquare, 
  ArrowRight,
  Sparkles,
  GitBranch,
  ArrowUpRight
} from "lucide-react";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Features — Clarity" },
      {
        name: "description",
        content: "Explore the core features, git automations, and sprint board analytics of Clarity.",
      },
    ],
  }),
});

type TabType = "boards" | "analytics" | "automation" | "collaboration";

function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("boards");

  const tabData = {
    boards: {
      title: "Sleek, fluid Kanban boards",
      description: "Coordinate tasks without the admin weight. Open markdown cards, transition statuses, and set priorities instantly.",
      bullets: [
        "Drag-and-drop state updates with layout-stable animations",
        "Rich text markdown notes support inside every card",
        "Clear priority tagging and instant search filters"
      ],
      visual: (
        <div className="rounded-xl border border-border bg-background p-4 shadow-lg text-left space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kanban Board</h4>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Active iteration</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded bg-muted/40 p-2 space-y-2 border border-border/50">
              <span className="text-[9px] font-bold text-muted-foreground">TO DO</span>
              <div className="rounded bg-card border border-border p-2 shadow-2xs font-medium">Refactor forms</div>
            </div>
            <div className="rounded bg-muted/40 p-2 space-y-2 border border-border/50">
              <span className="text-[9px] font-bold text-amber-500">IN PROGRESS</span>
              <div className="rounded border border-primary bg-card p-2 shadow-2xs font-medium">SSO Login hook</div>
            </div>
            <div className="rounded bg-muted/40 p-2 space-y-2 border border-border/50">
              <span className="text-[9px] font-bold text-green-500">DONE</span>
              <div className="rounded bg-card border border-border p-2 shadow-2xs font-medium line-through opacity-60">Design FAQ tabs</div>
            </div>
          </div>
        </div>
      )
    },
    analytics: {
      title: "Real-time velocity insights",
      description: "Never configure a dashboard again. Clarity automatically plots ideal burn lines and calculates weekly team velocity.",
      bullets: [
        "Automatic SVG Burndown charts generated instantly",
        "Sprint velocity forecasting based on historical completion rates",
        "Lightweight rendering loading under 15ms"
      ],
      visual: (
        <div className="rounded-xl border border-border bg-background p-4 shadow-lg text-left space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Burndown Chart</h4>
            <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5">Ahead of target</span>
          </div>
          <div className="h-32 relative border-l border-b border-border/80 pl-2 pb-2">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="10" x2="100" y2="90" stroke="var(--color-muted-foreground)" strokeWidth="1" strokeDasharray="3" />
              <path d="M 0 10 Q 20 5, 40 28 T 70 65 T 100 90" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
            </svg>
            <div className="absolute top-2 right-2 text-[9px] space-y-1 bg-card border p-1.5 rounded">
              <div className="flex items-center gap-1">
                <div className="h-1 w-2.5 bg-primary" /> <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1 w-2.5 border border-dashed border-muted-foreground" /> <span>Guideline</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    automation: {
      title: "Zero-touch status updates",
      description: "Let your commits drive your board. Connect git repos to sync status changes naturally from development, letting the automation controller handle the rest.",
      bullets: [
        "Commit message ticket closure parsing e.g. `[fixes #123]`",
        "Auto-transition cards to 'In Progress' on PR creation",
        "Multi-repository workspace sync support"
      ],
      visual: (
        <div className="rounded-xl border border-border bg-background p-4 shadow-lg text-left space-y-3 font-mono text-[10px] leading-relaxed">
          <div className="flex items-center justify-between border-b border-border pb-2 font-sans">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Commit Logs</h4>
            <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 border border-green-500/20 rounded">Sync active</span>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p className="text-foreground font-semibold">commit 8f3c2b9a14d5e</p>
            <p className="pl-2 text-primary">Author: JD &lt;john@clarity.so&gt;</p>
            <p className="pl-2">Date: Today, 3:14 PM</p>
            <p className="pl-4 text-foreground bg-muted/50 py-1 rounded border-l-2 border-primary font-medium">
              "feat: support webhooks fixes #312"
            </p>
            <div className="flex items-center gap-1 text-[9px] bg-primary/5 text-primary p-1.5 rounded border border-primary/20">
              <GitBranch className="h-3 w-3" />
              <span>Card #312 moved to DONE automatically.</span>
            </div>
          </div>
        </div>
      )
    },
    collaboration: {
      title: "Focused team conversations",
      description: "Discuss task specifics right where they happen. Avoid fragmented chats in third-party messaging tools.",
      bullets: [
        "Task-nested comment threads and user mentions",
        "Real-time presence indicators on active cards",
        "Clean editor support for descriptions and checklists"
      ],
      visual: (
        <div className="rounded-xl border border-border bg-background p-4 shadow-lg text-left space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Comment Thread</h4>
            <span className="text-[10px] text-muted-foreground">Card #42</span>
          </div>
          <div className="space-y-3.5">
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px] shrink-0">SC</div>
              <div className="bg-muted/40 p-2 rounded-lg text-[11px] leading-normal">
                <p className="font-bold text-[10px] text-foreground mb-0.5">Sarah Chen</p>
                <p className="text-muted-foreground">I've linked the API credentials. Let me know if the build fails.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-[9px] shrink-0">EK</div>
              <div className="bg-primary/5 border border-primary/10 p-2 rounded-lg text-[11px] leading-normal">
                <p className="font-bold text-[10px] text-primary mb-0.5">Eric Kim</p>
                <p className="text-muted-foreground">Tested and working! Merging fixing PR now.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <Navbar />

      <main className="pt-20">
        {/* 1. Page Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 relative">
          <div className="absolute -top-30 left-1/2 -z-10 h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" /> Clarity Core Platform
          </span>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gradient leading-tight">
            Everything your team needs
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A developer-first product space built for planning sprints, tracking tickets, and automated workflow triggers. No bloated tables. No configuration fatigue.
          </p>
        </section>

        {/* 2. Tabbed Feature Section */}
        <section className="w-full bg-[#F4F4F5] dark:bg-muted/5 py-20 border-y border-border/40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Horizontal Tab Pills at the top */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="tablist" aria-label="Feature details">
            {(Object.keys(tabData) as TabType[]).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-5 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer focus:outline-none ${
                  activeTab === tabKey
                    ? "bg-[#5B5BD6] border-[#5B5BD6] text-white shadow-md"
                    : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {tabKey === "boards" && "Sprint Boards"}
                {tabKey === "analytics" && "Sprint Analytics"}
                {tabKey === "automation" && "Commit Automation"}
                {tabKey === "collaboration" && "Team Collaboration"}
              </button>
            ))}
          </div>

          {/* 2-column content layout */}
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Left Column (50%): title, description, bullet points */}
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {tabData[activeTab].title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {tabData[activeTab].description}
              </p>
              <ul className="space-y-2.5 pt-2">
                {tabData[activeTab].bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <Check className="h-5 w-5 text-[#5B5BD6] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column (50%): styled card/mockup */}
            <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 flex items-center justify-center min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-[#5B5BD6]/5 via-transparent to-transparent pointer-events-none" />
              <div className="w-full relative z-10 transition-all duration-300">
                {tabData[activeTab].visual}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* 3. Git Automation Section (Full Width, Dark Background) */}
        <section className="bg-slate-950 text-slate-100 dark:bg-card dark:text-foreground border-y border-border/60 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Continuous Integration Sync</span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Automate your columns from Git logs
              </h2>
              <p className="text-sm sm:text-base text-slate-400 dark:text-muted-foreground leading-relaxed">
                Clarity listens to your repositories in real-time. Link branches and commit code tags to shift board states naturally.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto text-left pt-6">
              <div className="bg-slate-900 dark:bg-background border border-slate-800 dark:border-border p-5 rounded-xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">1</div>
                <h3 className="text-sm font-semibold">1. Create local branch</h3>
                <p className="text-xs text-slate-400 dark:text-muted-foreground leading-relaxed">
                  Start coding by checking out a branch tagged with the issue number e.g. `feature/312-oauth`.
                </p>
              </div>

              <div className="bg-slate-900 dark:bg-background border border-slate-800 dark:border-border p-5 rounded-xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">2</div>
                <h3 className="text-sm font-semibold">2. Commit with fixes tag</h3>
                <p className="text-xs text-slate-400 dark:text-muted-foreground leading-relaxed">
                  Commit changes locally using `[fixes #312]` or `[resolves #312]` tag rules in your commit logs.
                </p>
              </div>

              <div className="bg-slate-900 dark:bg-background border border-slate-800 dark:border-border p-5 rounded-xl space-y-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">3</div>
                <h3 className="text-sm font-semibold">3. Merge PR & Close</h3>
                <p className="text-xs text-slate-400 dark:text-muted-foreground leading-relaxed">
                  On merging your pull request into main, Clarity immediately resolves the ticket and archives card logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Product Principles Section */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Core Principles
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
              Designed for high-agency developers
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              We build features with high empathy for developer focus. These are the three core rules that govern our product engineering.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
              <Layout className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold">Board-first interface</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Tasks, priorities, and status transitions remain directly interactive on the board, avoiding nested setting windows.
              </p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold">Zero manual status logging</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Let hooks and branch triggers do the mapping so your engineering team doesn't inherit another daily admin ritual.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-3">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-base font-bold">Security & Trust</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Zero telemetry, plain-text export controls, and GDPR compliant workspace settings keep data ownership in your hands.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CTA Banner Section */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 text-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <div className="max-w-xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Build without the noise
              </h2>
              <p className="text-sm text-muted-foreground">
                Connect your team repositories and start tracking iterations in under two minutes. No credit card required.
              </p>
              <div className="flex justify-center pt-2">
                <Link
                  to="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold px-6 shadow-md hover:bg-primary/95 transition-colors nav-cta-button"
                >
                  Start Free Trial <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
