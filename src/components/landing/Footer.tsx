import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function Footer() {
  const [contactMessage, setContactMessage] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [footerEmail, setFooterEmail] = useState("");
  const [footerEmailError, setFooterEmailError] = useState("");
  const [footerEmailSuccess, setFooterEmailSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = footerEmail.trim();
    if (!trimmedEmail) {
      setFooterEmailError("Email address is required.");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      setFooterEmailError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFooterEmailSuccess(true);
      setFooterEmail("");
      toast.success("Welcome to Clarity newsletter!");
    }, 1000);
  };

  return (
    <footer className="border-t border-border bg-muted/20" aria-label="Global Footer">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4 border-b border-border/60 pb-12 mb-8">
          <div className="md:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Layout className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold">Clarity</span>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
              Focused sprint and iteration planner engineered for engineering teams prioritizing
              speed and modularity over enterprise form-filling.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product Hub
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-foreground">
                  Board Sandbox
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/pricing" hash="calculator" className="hover:text-foreground">
                  ROI Calculator
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="hover:text-foreground">
                  What's New (Changelog)
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" /> System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter form with validation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
            <p className="text-xs text-muted-foreground">
              Receive weekly developer productivity hacks and software design articles.
            </p>
            <form
              onSubmit={handleFooterSubmit}
              noValidate
              className="flex flex-col gap-2"
              aria-label="Newsletter sign-up"
            >
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  className={`h-9 text-xs bg-background ${
                    footerEmailError
                      ? "border-destructive"
                      : footerEmailSuccess
                        ? "border-green-500"
                        : ""
                  }`}
                  value={footerEmail}
                  onChange={(e) => {
                    setFooterEmail(e.target.value);
                    if (footerEmailError) setFooterEmailError("");
                  }}
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 shadow-xs cursor-pointer"
                  disabled={isSubmitting || footerEmailSuccess}
                >
                  Join
                </Button>
              </div>
              {footerEmailError && (
                <p className="text-[10px] font-medium text-destructive">{footerEmailError}</p>
              )}
              {footerEmailSuccess && (
                <p className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                  ✓ Welcome to the list!
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-xs text-muted-foreground">
          <nav className="flex flex-wrap gap-6 justify-center">
            <Link to="/privacy" className="hover:text-foreground cursor-pointer">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground cursor-pointer">
              Terms of Service
            </Link>
            <Link to="/security" className="hover:text-foreground cursor-pointer">
              Security Disclosure
            </Link>
            <button
              onClick={() => {
                setContactMessage("I'd like to learn about current hiring opportunities.");
                setContactOpen(true);
              }}
              className="hover:text-foreground cursor-pointer"
            >
              Careers (Hiring!)
            </button>
          </nav>
          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} Clarity, Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Careers / Hiring Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join our Team</DialogTitle>
            <DialogDescription>
              We're always looking for talented developers and designers. Tell us about yourself!
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Application submitted successfully! We'll review your details.");
              setContactOpen(false);
            }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Alex River" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="alex@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message / cover letter</label>
              <Textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Why would you like to join Clarity?"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Submit Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
