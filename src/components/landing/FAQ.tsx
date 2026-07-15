import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FAQ() {
  const [faqSearch, setFaqSearch] = useState("");

  const faqs = [
    {
      id: "faq-1",
      question: "How does the GitHub integration work?",
      answer:
        "Connect your repo in Settings → Integrations. Use [fixes #123] in any commit message and Clarity automatically moves the task to Done.",
    },
    {
      id: "faq-2",
      question: "Can I import my data from Jira or Linear?",
      answer:
        "Yes. Go to Settings → Import and upload a CSV or JSON export from Jira or Linear. Your tasks, statuses, and assignees transfer over.",
    },
    {
      id: "faq-3",
      question: "What happens if our team grows beyond 10 members?",
      answer:
        "Starter plan supports up to 2 members. Simply upgrade to Team plan for unlimited members at $10/user/month billed annually.",
    },
    {
      id: "faq-4",
      question: "Does Clarity offer an on-premise solution?",
      answer:
        "Not currently. Clarity is cloud-hosted with 99.99% uptime SLA on the Business plan. Enterprise on-premise is on our roadmap.",
    },
    {
      id: "faq-5",
      question: "How secure is our proprietary data?",
      answer:
        "Extremely secure. We use enterprise-grade AES-256 encryption at rest and in transit. Clarity is SOC 2 Type II certified and GDPR compliant.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()),
  );

  return (
    <section id="faq" className="border-t border-border/60 bg-muted/10">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Support Base
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
            Frequently asked questions
          </h2>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions or keywords..."
              className="h-10 pl-10 text-sm shadow-xs"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
            {faqSearch && (
              <button
                onClick={() => setFaqSearch("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-lg bg-background">
            <p className="text-muted-foreground text-sm font-medium">
              No matches found for "{faqSearch}"
            </p>
            <button
              onClick={() => setFaqSearch("")}
              className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset search queries
            </button>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
