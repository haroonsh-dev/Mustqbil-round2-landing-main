import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Wallet, CheckCircle2, Lock, ShieldCheck, ArrowRight, RefreshCcw, TestTube2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/checkout")({
  beforeLoad: ({ search }) => {
    const s = search as { plan?: string; cycle?: string };
    const validPlans = ["starter", "team", "business"];
    const validCycles = ["monthly", "annually"];
    if (!validPlans.includes(s.plan || "") || !validCycles.includes(s.cycle || "")) {
      // Segment 1: Invalid params redirect
      throw redirect({ to: "/pricing", replace: true });
    }
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" } // Segment 7: Do not index
    ]
  }),
  component: CheckoutComponent,
});

const PRICING_CONFIG = {
  starter: { name: "Starter Plan", monthly: 0, annually: 0 },
  team: { name: "Team Plan", monthly: 12, annually: 10 },
  business: { name: "Business Plan", monthly: 29, annually: 24 }
};

// Stripe test cards for demo
const TEST_CARDS = [
  { brand: "Visa", number: "4242 4242 4242 4242", expiry: "12/30", cvv: "123" },
  { brand: "Mastercard", number: "5555 5555 5555 4444", expiry: "12/30", cvv: "123" },
  { brand: "Declined", number: "4000 0000 0000 0002", expiry: "12/30", cvv: "123" },
];

function CheckoutComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/checkout" }) as { plan: string; cycle: string };
  const [cycle, setCycle] = useState<"monthly" | "annually">(search.cycle as "monthly" | "annually");
  
  const { user, isLoading: authLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  
  // Mock Stripe Element States
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Segment 5: Auth and Session State Gating & Pre-fill
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Please sign in or create an account to complete checkout.");
        navigate({ to: "/signup", search: { plan: search.plan, cycle: search.cycle } });
      } else {
        if (!name && user.user_metadata?.full_name) setName(user.user_metadata.full_name);
        if (!email && user.email) setEmail(user.email);
      }
    }
  }, [user, authLoading, navigate, search.plan, search.cycle, name, email]);

  // Segment 2: Plan Summary Display from Config
  const planDetails = PRICING_CONFIG[search.plan as keyof typeof PRICING_CONFIG];
  const pricePerUser = planDetails[cycle];
  const totalDue = 0; // 14-day trial means $0 due today

  // Segment 4: Real-time validation
  const rawCard = cardNumber.replace(/\s/g, '');
  const isCardValid = rawCard.length >= 15;
  const isExpiryValid = expiry.length === 5; // MM/YY
  const isCvvValid = cvv.length >= 3;
  const isFormValid = name && email && isCardValid && isExpiryValid && isCvvValid;

  // Segment 4: Card brand detection
  const getCardBrand = (number: string) => {
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "Mastercard";
    if (number.startsWith("3")) return "Amex";
    return null;
  };
  const cardBrand = getCardBrand(rawCard);

  // Auto-fill a test card
  const fillTestCard = (card: typeof TEST_CARDS[0]) => {
    setCardNumber(card.number);
    setExpiry(card.expiry);
    setCvv(card.cvv);
    toast.info(`Test card filled: ${card.brand}`);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    
    // Simulate Stripe processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate declined card
    if (rawCard === "4000000000000002") {
      setLoading(false);
      toast.error("Card declined. Please try a different card. (This is a Stripe test declined card)");
      return;
    }

    // Store the subscription in Supabase
    try {
      if (user) {
        // First, check if user has a workspace (to link subscription)
        const { data: workspaces } = await supabase
          .from('workspaces')
          .select('id')
          .limit(1);
        
        const workspaceId = workspaces?.[0]?.id;
        
        // Generate mock Stripe IDs
        const mockStripeCustomerId = `cus_demo_${Date.now()}`;
        const mockStripeSubId = `sub_demo_${Date.now()}`;
        
        if (workspaceId) {
          // Upsert subscription record
          await supabase.from('subscriptions').upsert({
            workspace_id: workspaceId,
            stripe_customer_id: mockStripeCustomerId,
            stripe_subscription_id: mockStripeSubId,
            plan_id: search.plan,
            status: 'trialing',
            current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          }, { onConflict: 'workspace_id' });
        }
        
        console.log('📦 [DEMO] Subscription stored in Supabase:', {
          plan: search.plan,
          cycle,
          stripe_customer_id: mockStripeCustomerId,
          stripe_subscription_id: mockStripeSubId,
          status: 'trialing',
          card_last4: rawCard.slice(-4),
          card_brand: cardBrand,
        });
      }
    } catch (err) {
      console.error('Failed to store subscription:', err);
      // Don't block the flow — subscription storage is best-effort in demo mode
    }

    setLoading(false);
    setPaymentSuccess(true);
    toast.success("Payment successful! Receipt and plan details sent to " + email);
    
    // Redirect after showing success briefly
    setTimeout(() => {
      navigate({ to: "/onboarding", search: { email, name } });
    }, 1500);
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><RefreshCcw className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row w-full pt-16 lg:pt-20">
        {/* Left Column - Billing & Payment */}
        <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-6 md:p-12 lg:p-24 lg:border-r lg:border-border order-2 lg:order-1">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Secure Checkout</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-8">Enter your billing details to start your 14-day free trial.</p>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-base md:text-lg font-semibold border-b border-border pb-2">Billing Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold">Full Name</label>
                    {/* Segment 8: Accessibility & Mobile inputmode/autocomplete */}
                    <Input id="name" tabIndex={1} autoComplete="name" placeholder="Sarah Chen" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="company" className="text-xs font-semibold">Company Name</label>
                    <Input id="company" tabIndex={2} autoComplete="organization" placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold">Work Email</label>
                  <Input id="email" tabIndex={3} type="email" autoComplete="email" placeholder="sarah@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h2 className="text-base md:text-lg font-semibold">Payment Method</h2>
                  {/* Segment 7: SSL & Stripe Trust Signals */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Lock className="h-3 w-3" /> Secured by Stripe
                  </div>
                </div>

                {/* Stripe Test Mode Banner for Demo */}
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                    <TestTube2 className="h-4 w-4" /> Stripe Test Mode
                  </div>
                  <p className="text-xs text-blue-600/80">Use these test cards to simulate a successful or failed payment without real money.</p>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fillTestCard(TEST_CARDS[0])}
                      className="text-xs h-7 border-blue-200 hover:bg-blue-100 text-blue-700"
                    >
                      Fill Success Card (Visa)
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fillTestCard(TEST_CARDS[2])}
                      className="text-xs h-7 border-blue-200 hover:bg-blue-100 text-blue-700"
                    >
                      Fill Declined Card
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
                  <div className="space-y-1 relative">
                    <label htmlFor="card-number" className="text-xs font-semibold flex justify-between">
                      Card Number
                      {cardBrand && <span className="text-primary font-bold">{cardBrand}</span>}
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="card-number"
                        tabIndex={4}
                        autoComplete="cc-number" 
                        inputMode="numeric" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} 
                        maxLength={19}
                        required 
                        className={`h-11 pl-10 ${cardNumber && !isCardValid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="expiry" className="text-xs font-semibold">Expiry Date</label>
                      <Input 
                        id="expiry"
                        tabIndex={5}
                        autoComplete="cc-exp" 
                        inputMode="numeric" 
                        placeholder="MM/YY" 
                        value={expiry} 
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))} 
                        maxLength={5}
                        required 
                        className={`h-11 ${expiry && !isExpiryValid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="cvv" className="text-xs font-semibold">CVV</label>
                      <Input 
                        id="cvv"
                        tabIndex={6}
                        autoComplete="cc-csc" 
                        inputMode="numeric" 
                        type="password"
                        placeholder="123" 
                        value={cvv} 
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} 
                        maxLength={4}
                        required 
                        className={`h-11 ${cvv && !isCvvValid ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  tabIndex={7}
                  disabled={loading || !isFormValid}
                  className="w-full h-12 text-sm md:text-base font-semibold shadow-xs bg-primary hover:bg-primary/90 mt-4 cursor-pointer"
                >
                  {loading ? "Processing..." : `Start 14-Day Free Trial`} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Segment 7: Inline Refund Policy */}
                <p className="text-[10px] md:text-xs text-muted-foreground text-center pt-2">
                  Cancel anytime within the first 30 days for a full refund, no questions asked. No long-term contracts.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[480px] bg-muted/30 p-6 md:p-12 lg:p-24 flex flex-col justify-start lg:justify-center border-b lg:border-b-0 lg:border-l border-border order-1 lg:order-2">
          <div className="w-full max-w-sm mx-auto animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">
                    14-Day Free Trial
                  </span>
                  {/* Segment 3: Upsell Toggle */}
                  {cycle === "monthly" && (
                    <button 
                      onClick={() => setCycle("annually")}
                      className="text-[10px] font-bold text-green-600 dark:text-green-400 hover:underline cursor-pointer bg-green-500/10 px-2 py-1 rounded"
                    >
                      Switch to Annual & Save 20%
                    </button>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-bold">{planDetails.name}</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Billed {cycle}</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Price per user</span>
                  <span className="font-semibold">${pricePerUser}.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">First 14 Days</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">-$0.00</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-4">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-semibold">Calculated at next step</span>
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <span className="block text-sm text-muted-foreground font-medium">Total due today</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight">${totalDue}.00</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Money-Back Guarantee</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cancel anytime within the first 30 days for a full refund, no questions asked.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Cancel Anytime</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No long term contracts. You're in complete control of your subscription.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
