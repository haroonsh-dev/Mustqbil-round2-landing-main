import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function PricingCard({
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
          onClick={() => {
            import("@/lib/analytics").then(({ trackEvent }) => {
              trackEvent("cta_click", { button_name: `pricing_cta_${tier.toLowerCase()}` });
            });
            onClick();
          }}
        >
          {cta || "Contact sales"}
        </Button>
      ) : (
        <Button
          variant={recommended ? "default" : "outline"}
          className="w-full cursor-pointer whitespace-nowrap"
          onClick={() => {
            import("@/lib/analytics").then(({ trackEvent }) => {
              trackEvent("cta_click", { button_name: `pricing_cta_${tier.toLowerCase()}` });
            });
          }}
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
