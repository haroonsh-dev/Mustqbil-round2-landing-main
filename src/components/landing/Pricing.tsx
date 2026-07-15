import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function PricingCard({
  tier,
  price,
  features,
  recommended = false,
  billingCycle,
  description,
  cta,
  variant,
  href,
  period,
  subtext,
  onClick,
}: {
  tier: string;
  price: number | string;
  features: string[];
  recommended?: boolean;
  billingCycle?: "monthly" | "annually";
  description?: string;
  cta?: string;
  variant?: string;
  href?: string;
  period?: string;
  subtext?: string;
  onClick?: () => void;
}) {
  return (
    <div className="pricing-glow-card rounded-xl border-2 border-primary bg-background flex flex-col relative z-10 p-6">
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold">{tier}</h3>
        <div className="mt-2 flex flex-col items-start text-left">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-foreground">
              {typeof price === "number" ? `$${price}` : price}
            </span>
            <span className="text-sm text-muted-foreground">
              {period || (typeof price === "number" ? "/ user / mo" : "")}
            </span>
          </div>
          {subtext && (
            <span className="text-[10px] font-semibold text-muted-foreground mt-1 block">
              {subtext}
            </span>
          )}
        </div>
      </div>
      <ul className="mb-6 flex-1 space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {onClick ? (
        <Button
          variant={recommended ? "default" : "outline"}
          className="w-full cursor-pointer whitespace-nowrap"
          onClick={onClick}
        >
          {cta || "Contact sales"}
        </Button>
      ) : (
        <Button
          variant={recommended ? "default" : "outline"}
          className="w-full cursor-pointer whitespace-nowrap"
          asChild
        >
          <Link to={(href || "/signup") as any}>
            {cta || "Start 14-day trial"}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function Pricing({ isSubpage = false }: { isSubpage?: boolean }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [pricingCompareOpen, setPricingCompareOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <section id="pricing" className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${isSubpage ? "pt-28 pb-20 animate-fade-in" : "py-20"}`}>
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

      {/* Pricing cards showing monthly vs annual pricing comparison (PM Improvement #10) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch mb-12">
        <PricingCard
          tier="Starter"
          price="$0"
          period=" / forever free"
          subtext="No credit card required"
          description="For developers working on personal or hobby projects."
          features={[
            "Up to 3 active projects",
            "2 team members",
            "Basic task boards",
            "100MB storage limit",
            "Slack status notifications",
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
                <span>GitHub repository workflow automation</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Real-time sprint progress charts</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>10GB storage attachment space</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />{" "}
                <span>Priority email support responses</span>
              </li>
            </ul>

            <Link
              to="/signup"
              className="mt-8 w-full inline-flex h-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold shadow-xs whitespace-nowrap"
            >
              Start 14-day free trial
            </Link>
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
          onClick={() => setContactOpen(true)}
        />
      </div>
      
      {/* Contact Sales Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Sales</DialogTitle>
            <DialogDescription>
              Let us know how we can help your team get started with Clarity.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent! Our sales team will get back to you shortly.");
              setContactOpen(false);
            }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Jane Doe" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Email</label>
              <Input type="email" placeholder="jane@company.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Size</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="1-10">1 - 10 employees</option>
                <option value="11-50">11 - 50 employees</option>
                <option value="51-200">51 - 200 employees</option>
                <option value="200+">200+ employees</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">How can we help?</label>
              <Textarea placeholder="Tell us about your team's needs..." required />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
