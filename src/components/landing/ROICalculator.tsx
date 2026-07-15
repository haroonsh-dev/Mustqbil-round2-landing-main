import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Clock, DollarSign, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ROICalculator() {
  const [teamSize, setTeamSize] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(65);
  const [hoursWasted, setHoursWasted] = useState(4);
  const [efficiencyGain, setEfficiencyGain] = useState(60);

  // Calculations
  const weeklyHoursSaved = teamSize * hoursWasted * (efficiencyGain / 100);
  const monthlySavings = weeklyHoursSaved * 4.33 * hourlyRate;
  const annualSavings = monthlySavings * 12;
  const costPro = teamSize * 10 * 12; // $10/user/mo annually
  const netSavings = annualSavings - costPro;

  return (
    <section id="calculator" className="border-t border-border/60 bg-muted/5 py-20 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Business Case
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
            Calculate your hard ROI
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Stop losing expensive engineering hours to status meetings and fragmented tools. See your exact cost savings below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-center bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Sliders Control Panel */}
          <div className="md:col-span-7 space-y-6">
            {/* Team Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Engineering Team Size</span>
                <span className="font-mono text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded text-xs">
                  {teamSize} devs
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="150"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>2 devs</span>
                <span>150 devs</span>
              </div>
            </div>

            {/* Average Hourly Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Avg. Developer Hourly Rate</span>
                <span className="font-mono text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded text-xs">
                  ${hourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min="25"
                max="150"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$25/hr</span>
                <span>$150/hr</span>
              </div>
            </div>

            {/* Hours Wasted per Week */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Status Meetings & Admin Weekly</span>
                <span className="font-mono text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded text-xs">
                  {hoursWasted} hrs / dev
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={hoursWasted}
                onChange={(e) => setHoursWasted(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 hour</span>
                <span>12 hours</span>
              </div>
            </div>

            {/* Efficiency Gain */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Expected Administrative Reduction</span>
                <span className="font-mono text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded text-xs">
                  {efficiencyGain}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={efficiencyGain}
                onChange={(e) => setEfficiencyGain(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>10% (Pessimistic)</span>
                <span>100% (Maximum)</span>
              </div>
            </div>
          </div>

          {/* Results Display Panel */}
          <div className="md:col-span-5 bg-muted/30 border border-border/50 rounded-xl p-6 space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground text-center">
              Measurable Outcomes
            </h3>

            <div className="space-y-4">
              {/* Hours Saved */}
              <div className="flex items-center gap-3 bg-card border border-border/40 p-3.5 rounded-lg shadow-2xs">
                <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Weekly Engineering Hours Reclaimed</p>
                  <p className="text-lg font-bold font-mono text-foreground">
                    {weeklyHoursSaved.toFixed(0)} hrs
                  </p>
                </div>
              </div>

              {/* Monthly Savings */}
              <div className="flex items-center gap-3 bg-card border border-border/40 p-3.5 rounded-lg shadow-2xs">
                <div className="h-9 w-9 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <DollarSign className="h-4.5 w-4.5" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Monthly Payroll Savings</p>
                  <p className="text-lg font-bold font-mono text-emerald-500">
                    ${Math.round(monthlySavings).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Annual Net ROI */}
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 p-3.5 rounded-lg shadow-2xs relative">
                <div className="h-9 w-9 rounded bg-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-primary uppercase font-bold tracking-wider">Annual Net ROI</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <Info className="h-3 w-3 text-primary/70" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px] p-3 shadow-lg border border-primary/20">
                          <p className="font-semibold mb-1 border-b border-primary/20 pb-1">Formula</p>
                          <ul className="space-y-1 text-primary-foreground/90 font-mono">
                            <li>1. Gross Savings = ({teamSize} devs × {hoursWasted} hrs × {efficiencyGain}% reduction) × $ {hourlyRate}/hr × 52 weeks</li>
                            <li>2. License Cost = {teamSize} devs × $120/yr = ${costPro.toLocaleString()}</li>
                            <li className="pt-1 font-bold">3. Net ROI = Gross Savings - License Cost</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xl font-black font-mono text-foreground">
                    ${Math.round(netSavings).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/signup"
                className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/95 nav-cta-button"
              >
                Start saving today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
