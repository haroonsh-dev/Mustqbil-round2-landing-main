import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layout, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyComponent,
});

function PrivacyComponent() {
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
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
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
            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              At Clarity, we take your privacy seriously. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website or
              use our software development project management tools. Please read this privacy policy
              carefully. If you do not agree with the terms of this privacy policy, please do not
              access the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p className="leading-relaxed mb-2">
              We may collect information about you in a variety of ways. The information we may
              collect includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your
                name, work email address, and company name, that you voluntarily give to us when you
                register for the Site.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when
                you access the Site, such as your IP address, your browser type, your operating
                system, and your access times.
              </li>
              <li>
                <strong>Third-Party Data:</strong> Information from third parties, such as GitHub or
                Okta, if you connect your account to the third party and grant the Site permission
                to access this information.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Use of Your Information</h2>
            <p className="leading-relaxed mb-2">
              Having accurate information about you permits us to provide you with a smooth,
              efficient, and customized experience. Specifically, we may use information collected
              about you via the Site to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your workspace account.</li>
              <li>Process payments and refunds for enterprise tiers.</li>
              <li>Compile anonymous statistical data and analysis for use internally.</li>
              <li>
                Deliver targeted advertising, newsletters, and other information regarding
                promotions.
              </li>
              <li>Increase the efficiency and operation of the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Security of Your Information
            </h2>
            <p className="leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your
              personal information. While we have taken reasonable steps to secure the personal
              information you provide to us, please be aware that despite our efforts, no security
              measures are perfect or impenetrable, and no method of data transmission can be
              guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:privacy@clarity.app" className="text-primary hover:underline">
                privacy@clarity.app
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
