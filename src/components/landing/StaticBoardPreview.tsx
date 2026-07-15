import { Layout } from "lucide-react";

export function StaticBoardPreview() {
  return (
    <section className="w-full bg-[#F4F4F5] dark:bg-muted/5 py-20 border-y border-border/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Workspace Preview
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-2">
            Organized sprint boards at a glance
          </h2>
        </div>
        <div 
          className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-2 shadow-2xl overflow-hidden relative"
          style={{
            boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 24px 64px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.07)"
          }}
        >
        {/* Top window headers */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5 rounded-t-lg">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/85" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/85" />
            <div className="h-3 w-3 rounded-full bg-green-500/85" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">clarity-app/sprint-1</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground border border-border">
            JD
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 bg-background min-h-[300px] text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-bold">Active Sprint: Iteration 24</h3>
                <p className="text-xs text-muted-foreground">
                  July 10 – July 24 · 12 tasks remaining
                </p>
              </div>
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                84% Done
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Backlog Column */}
              <div className="rounded-lg bg-muted/30 p-3 border border-border/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <span>Backlog</span>
                  <span className="rounded-full bg-muted border px-1.5 py-0.2">3</span>
                </div>
                <div className="rounded-md border border-border bg-card p-3 shadow-xs space-y-2">
                  <span className="rounded-xs bg-blue-500/10 text-blue-500 text-[9px] font-bold px-1.5 py-0.5 border border-blue-500/20 uppercase">
                    chore
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Write API docs for webhooks</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>Jul 22</span>
                    <span className="h-4.5 w-4.5 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                      AM
                    </span>
                  </div>
                </div>
              </div>

              {/* In Progress Column */}
              <div className="rounded-lg bg-muted/30 p-3 border border-border/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <span>In Progress</span>
                  <span className="rounded-full bg-muted border px-1.5 py-0.2 text-amber-500 border-amber-500/20">
                    1
                  </span>
                </div>
                <div className="rounded-md border border-primary bg-card p-3 shadow-xs space-y-2">
                  <span className="rounded-xs bg-red-500/10 text-red-500 text-[9px] font-bold px-1.5 py-0.5 border border-red-500/20 uppercase">
                    feature
                  </span>
                  <h4 className="text-xs font-bold text-foreground">Refactor page layout component routing</h4>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>Jul 18</span>
                    <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
                      SC
                    </span>
                  </div>
                </div>
              </div>

              {/* Completed Column */}
              <div className="rounded-lg bg-muted/30 p-3 border border-border/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <span>Completed</span>
                  <span className="rounded-full bg-muted border px-1.5 py-0.2 text-green-500 border-green-500/20">
                    4
                  </span>
                </div>
                <div className="rounded-md border border-border bg-card p-3 shadow-xs space-y-2 opacity-70">
                  <span className="rounded-xs bg-green-500/10 text-green-500 text-[9px] font-bold px-1.5 py-0.5 border border-green-500/20 uppercase">
                    done
                  </span>
                  <h4 className="text-xs font-bold text-foreground line-through">
                    Configure light/dark design theme
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>Completed</span>
                    <span className="h-4.5 w-4.5 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                      EK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
