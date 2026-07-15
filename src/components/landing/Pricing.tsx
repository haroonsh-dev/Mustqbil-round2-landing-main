import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { BusinessInquiryModal } from "@/components/pricing/BusinessInquiryModal";

export function Pricing({ isSubpage = false }: { isSubpage?: boolean }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [businessContactOpen, setBusinessContactOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <section id="pricing" className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${isSubpage ? "pt-28 pb-20 animate-in fade-in duration-700" : "py-20"}`}>
      <div className="mb-12 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Pricing
        </span>
        {isSubpage ? (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gradient mt-2 leading-tight">
              Simple, honest pricing
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              No hidden fees. No long-term contracts. Cancel anytime.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2 leading-tight">
              Straightforward pricing
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Simple tiers with no hidden contracts. Save 20% by billing annually.
            </p>
          </>
        )}

        {/* Billing Switcher */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === "annually"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annually (Save 20%)
            <span className="absolute -top-3 -right-3 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground tracking-wider animate-bounce">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Who uses Clarity segment */}
      <div className="mb-12 border-y border-border/50 bg-muted/20 py-8 px-6 rounded-xl">
        <h3 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
          Who uses Clarity?
        </h3>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto text-left">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">1. The Solo Founder</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses the <strong className="text-foreground">Starter</strong> plan to map out an MVP backlog and keep their personal side-projects organized without paying a dime.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">2. The 10-Person Dev Shop</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses the <strong className="text-foreground">Team</strong> plan to coordinate fast-paced client sprints, integrating directly with GitHub to automate issue tracking.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">3. The Scaling Startup PM</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uses the <strong className="text-foreground">Business</strong> plan to enforce SOC 2 compliance via SSO while keeping their cross-functional squads perfectly aligned.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing cards showing monthly vs annual pricing comparison (PM Improvement #10) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch mb-12">
        <PricingCard
          tier="Starter"
          price="$0"
          period=" / forever free"
          subtext="No credit card required"
          description="For individuals exploring Clarity with strict limits."
          features={[
            "Maximum 3 active projects",
            "Up to 2 team members max",
            "Standard task boards only",
            "100MB storage limit",
            "No third-party integrations",
          ]}
          cta="Get started free"
          variant="outline"
          href="/signup"
        />

        {/* Highlighted Sprints Team Card */}
        <div className="pricing-glow-card rounded-xl border-2 border-primary bg-background flex flex-col relative z-10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
            MOST POPULAR FOR TEAMS
          </div>
          <div className="flex flex-1 flex-col p-6 pt-8">
            <h3 className="text-lg font-bold text-foreground">Team</h3>
            <div className="mt-4 flex flex-col items-start">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight text-foreground transition-all">
                  {billingCycle === "annually" ? "$10" : "$12"}
                </span>
                <span className="ml-1 text-sm font-medium text-muted-foreground">/user/month</span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground mt-1 block">
                {billingCycle === "annually"
                  ? "Billed annually ($120/yr) — Save $24/yr per user"
                  : "Billed monthly ($12/user/mo)"}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              For growing product teams looking to coordinate sprints and connect code repos.
            </p>

            <ul className="mt-6 flex-1 space-y-3 border-t border-border/80 pt-6">
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Unlimited projects & boards</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Unlimited members & guests</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Basic GitHub issue integration</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Sprint velocity reporting</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>10GB storage attachment space</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Priority email support</span>
              </li>
            </ul>

            <Button
              onClick={() => {
                import("@/lib/analytics").then(({ trackEvent }) => {
                  trackEvent("cta_click", { button_name: "pricing_cta_team", cycle: billingCycle });
                });
                navigate({ to: `/checkout`, search: { plan: "team", cycle: billingCycle } });
              }}
              className="mt-8 w-full inline-flex h-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold shadow-xs whitespace-nowrap cursor-pointer"
            >
              Start 14-day free trial
            </Button>
          </div>
        </div>

        {/* Business Plan (Interactive contact Trigger) */}
        <PricingCard
          tier="Business"
          price={billingCycle === "annually" ? "$24" : "$29"}
          period="/user/month"
          subtext={
            billingCycle === "annually"
              ? "Billed annually ($288/yr) — Save $60/yr per user"
              : "Billed monthly ($29/user/mo)"
          }
          description="For scaling organizations that need enterprise security, SSO, and dedicated support."
          features={[
            "Everything included in Team plan",
            "SAML SSO & Okta identity sync",
            "Custom webhooks & public API limits",
            "Dedicated customer success rep",
            "99.99% system availability SLA",
            "Annual invoice/PO billing options",
          ]}
          cta="Contact sales"
          variant="outline"
          onClick={() => setBusinessContactOpen(true)}
        />
      </div>
      
      <BusinessInquiryModal isOpen={businessContactOpen} setIsOpen={setBusinessContactOpen} />
    </section>
  );
}
