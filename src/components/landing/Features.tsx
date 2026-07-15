import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Zap, Shield, Search, Terminal, GitCommit, Users, Layers, Activity, Lock, BarChart3, CheckCircle2, GitMerge, Layout, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  color?: string;
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group spotlight-card rounded-2xl border border-border bg-card p-6 shadow-sm",
        color
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary/20">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 bg-muted/10 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Core Benefits
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            We focus on making task coordination fluid and transparent, keeping clutter out of
            your workspace so your team can focus on shipping features.
          </p>
        </div>

        {/* Feature Cards Grid (with highlights and hover glow) */}
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Layout className="h-5 w-5" />}
            title="Sleek Task Boards"
            description="Organize work with drag-and-drop boards that keep things clear and out of your way."
            color="border-blue-500/25 text-blue-500 bg-blue-500/5"
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5" />}
            title="Fast Prioritization"
            description="Focus on what matters today with clear priorities, due dates, and alerts."
            color="border-yellow-500/25 text-yellow-500 bg-yellow-500/5"
          />
          <FeatureCard
            icon={<Users className="h-5 w-5" />}
            title="Team Collaboration"
            description="Comment, assign, and mention teammates in real-time, keeping everyone aligned."
            color="border-emerald-500/25 text-emerald-500 bg-emerald-500/5"
          />
        </div>
      </div>
    </section>
  );
}
