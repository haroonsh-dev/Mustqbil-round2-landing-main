import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { Loader2 } from "lucide-react";

export function BusinessInquiryModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companySize, setCompanySize] = useState("50-200");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid work email address.");
      return;
    }
    if (!name || !requirements) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    
    // Track form submission
    trackEvent("form_submit", { 
      form_name: "contact_sales", 
      company_size: companySize 
    });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! Our enterprise team will get back to you shortly.");
      setIsOpen(false);
      // Reset form
      setEmail("");
      setName("");
      setRequirements("");
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Enterprise Sales</DialogTitle>
          <DialogDescription>
            Let us know how we can tailor Clarity for your organization.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              placeholder="Jane Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Work Email</label>
            <Input 
              type="email" 
              placeholder="jane@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Size</label>
            <select 
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="50-200">50 - 200 employees</option>
              <option value="201-500">201 - 500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Specific Requirements (e.g. Okta SSO, On-Prem)</label>
            <Textarea 
              placeholder="Tell us about your team's compliance or feature needs..." 
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required 
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
