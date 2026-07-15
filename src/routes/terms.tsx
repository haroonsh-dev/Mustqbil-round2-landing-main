import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layout, FileText } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsComponent,
});

function TermsComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                <Layout className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight">Clarity</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8 py-12 max-w-3xl">
        <div className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing our website and using Clarity's project management software, you agree to
              be bound by these Terms of Service. If you disagree with any part of the terms, you
              may not access the service. These Terms apply to all visitors, users, and others who
              access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Enterprise Subscription and Billing
            </h2>
            <p className="leading-relaxed mb-2">
              Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You
              will be billed in advance on a recurring and periodic basis (such as monthly or
              annually), depending on the type of subscription plan you select.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fees are non-refundable except as required by law or as explicitly stated.</li>
              <li>
                Your Subscription will automatically renew under the exact same conditions unless
                you cancel it or Clarity cancels it.
              </li>
              <li>
                You must provide a valid payment method, and you authorize Clarity to automatically
                charge all Subscription fees incurred to such payment instruments.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Acceptable Use and Restrictions
            </h2>
            <p className="leading-relaxed mb-2">
              You agree not to use the Service in any way that violates any applicable national or
              international law or regulation. Additionally, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Use the Service to transmit any advertising or promotional material without our
                prior written consent.
              </li>
              <li>
                Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the
                Service.
              </li>
              <li>
                Attempt to bypass any measures of the Site designed to prevent or restrict access to
                the Site, or any portion of the Site.
              </li>
              <li>
                Reverse engineer, decompile, or otherwise attempt to derive source code from any
                part of the Service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p className="leading-relaxed">
              The Service and its original content (excluding Content provided by you or other
              users), features, and functionality are and will remain the exclusive property of
              Clarity and its licensors. The Service is protected by copyright, trademark, and other
              laws of both the United States and foreign countries. Our trademarks and trade dress
              may not be used in connection with any product or service without the prior written
              consent of Clarity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us at:{" "}
              <a href="mailto:legal@clarity.app" className="text-primary hover:underline">
                legal@clarity.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Clarity App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
