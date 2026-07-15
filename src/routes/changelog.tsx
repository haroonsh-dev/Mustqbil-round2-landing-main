import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layout,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  Check,
  Zap,
  Github,
  RefreshCw,
  Rss,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/changelog")({
  component: ChangelogComponent,
  head: () => ({
    meta: [
      { title: "Changelog — Clarity" },
      {
        name: "description",
        content: "Stay up to date with the latest features, releases, and fixes in Clarity.",
      },
    ],
  }),
});

function ChangelogComponent() {
  const { theme, toggleTheme } = useTheme();

  const logs = [
    {
      version: "v2.0.0",
      date: "July 12, 2026",
      title: "Clarity 2.0 Redesign & Interactive Playgrounds",
      description:
        "We completely overhauled our system core, rendering engine, and visual layout. This release includes light/dark theme persistence, built-in Kanban sandboxes, and automated help assistants.",
      highlights: [
        "Interactive Kanban Sandboxes directly inside layouts",
        "Light & Dark theme provider with localStorage preference sync",
        "GDPR-compliant cookie customization banner",
        "Automated live support chat bot integration",
        "Fuzzy search query filter for help bases",
      ],
      icon: <Sparkles className="h-5 w-5 text-primary" />,
    },
    {
      version: "v1.8.2",
      date: "June 20, 2026",
      title: "Active Webhook Repositories Automation Integration",
      description:
        "Connect workspaces directly to GitHub. Task status fields now transition dynamically based on PR pushes, commit tags, and branch names.",
      highlights: [
        "Commit parsing for ticket closure tags e.g. `[fixes #123]`",
        "Auto-transition to 'In Progress' on PR creation",
        "Multi-repository workspace sync support",
      ],
      icon: <Github className="h-5 w-5 text-primary" />,
    },
    {
      version: "v1.5.0",
      date: "May 15, 2026",
      title: "High-Performance Analytics Baselines",
      description:
        "Added vector SVG-based Burndown charts that load under 15ms. Managers can track velocity statistics and task completions automatically without bloated manual configs.",
      highlights: [
        "Instant SVG Burndown baseline graphs",
        "Cumulative sprint velocity charts",
        "Weekly summary newsletter digests",
      ],
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
    {
      version: "v1.2.0",
      date: "April 02, 2026",
      title: "Legacy CSV/JSON Workspace Migrator Assistant",
      description:
        "Migrating from Asana, Jira, or Trello is now frictionless. Use the new import controller to map assignees, description markdown, and status logs in under two minutes.",
      highlights: [
        "CSV & JSON backlog upload parser",
        "Column and assignee key mappings selector",
        "Auto markdown rendering on card descriptions",
      ],
      icon: <RefreshCw className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-background bg-grid-dots font-sans antialiased text-foreground">
      {/* Decorative Top Glow */}
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] dark:bg-primary/5 pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <Layout className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold">Clarity</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground bg-card border border-border px-3 py-2 rounded-md transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            Product Updates
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-4 text-gradient flex justify-center items-center gap-3">
            What's New in Clarity
            <button
              className="text-muted-foreground hover:text-orange-500 transition-colors cursor-pointer"
              title="Subscribe to RSS feed"
              aria-label="Subscribe to RSS"
            >
              <Rss className="h-6 w-6" />
            </button>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Weekly release logs, feature additions, and performance updates from our engineering
            team.
          </p>
        </div>

        {/* Timeline Log Grid */}
        <div className="space-y-12 relative border-l border-border/80 pl-6 ml-4">
          {logs.map((log) => (
            <div key={log.version} className="relative group">
              {/* Dot indicator */}
              <div className="absolute -left-10 top-1 h-8 w-8 rounded-full border border-border bg-card shadow-xs flex items-center justify-center transition-colors group-hover:border-primary/50">
                {log.icon}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                    {log.version}
                  </span>
                  <span className="text-xs text-muted-foreground">{log.date}</span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-foreground">{log.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{log.description}</p>

                <Card className="border-border bg-card shadow-xs">
                  <CardContent className="p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Release Highlights
                    </h3>
                    <ul className="space-y-2 text-xs">
                      {log.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
