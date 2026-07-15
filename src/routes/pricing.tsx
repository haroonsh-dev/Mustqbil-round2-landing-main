import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { ROICalculator } from "@/components/landing/ROICalculator";
import { FAQ } from "@/components/landing/FAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Simple, Honest Pricing — Clarity" },
      {
        name: "description",
        content: "Explore Clarity's simple billing plans, calculate your team's return-on-investment, and find answers to common pricing questions.",
      },
    ],
  }),
});

function PricingPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/30">
      <Navbar />

      <main className="pt-20">
        {/* 1. Pricing hero & 3 cards */}
        <Pricing isSubpage />

        {/* 2. Full Feature Comparison Table */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/40">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Plan Feature Comparison Matrix</h3>
            <p className="text-xs text-muted-foreground mt-1">Detailed list of capabilities across all tiers</p>
          </div>
          <div className="border border-border rounded-xl bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20 font-bold">
                    <th className="p-4">Capabilities</th>
                    <th className="p-4">Starter</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">Sprint Task Boards</td>
                    <td className="p-4 text-muted-foreground">Basic</td>
                    <td className="p-4 text-primary font-medium">Fully Featured</td>
                    <td className="p-4 text-primary font-medium">Fully Featured</td>
                  </tr>
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">Repository Sync</td>
                    <td className="p-4 text-muted-foreground">Read Only</td>
                    <td className="p-4 text-primary font-medium">Dynamic Automation</td>
                    <td className="p-4 text-primary font-medium">Dynamic + Custom Hooks</td>
                  </tr>
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">Active Sprints Limit</td>
                    <td className="p-4 text-muted-foreground">3 Sprints</td>
                    <td className="p-4 text-primary font-medium">Unlimited</td>
                    <td className="p-4 text-primary font-medium">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">Storage Attachment Space</td>
                    <td className="p-4 text-muted-foreground">100 MB</td>
                    <td className="p-4 text-primary font-medium">10 GB</td>
                    <td className="p-4 text-primary font-medium">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">SAML Single Sign-On (SSO)</td>
                    <td className="p-4 text-muted-foreground">Unavailable</td>
                    <td className="p-4 text-muted-foreground">Unavailable</td>
                    <td className="p-4 text-primary font-medium">Available (Okta, Azure, etc.)</td>
                  </tr>
                  <tr className="hover:bg-muted/5">
                    <td className="p-4 font-semibold">Technical Support Response</td>
                    <td className="p-4 text-muted-foreground">Community</td>
                    <td className="p-4 text-primary font-medium">Priority (under 12 hrs)</td>
                    <td className="p-4 text-primary font-medium">24/7 Dedicated Rep</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. ROI Calculator */}
        <ROICalculator />

        {/* 4. FAQ Section */}
        <FAQ />

        {/* 5. Bottom CTA Banner */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 text-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-xl mx-auto space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                <HelpCircle className="h-3.5 w-3.5" /> Direct Support Line
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Still unsure? Talk to us
              </h2>
              <p className="text-sm text-muted-foreground">
                Have questions about billing, compliance, enterprise customization, or volume licensing rates? We are here to help.
              </p>
              <div className="flex justify-center pt-2">
                <Button
                  onClick={() => setContactOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold px-8 shadow-md hover:bg-primary/95 transition-colors nav-cta-button cursor-pointer"
                >
                  Contact Sales <MessageSquare className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Sales Dialog modal */}
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
              <Button type="submit" className="w-full cursor-pointer">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
