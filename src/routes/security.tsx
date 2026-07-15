import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Layout, Lock } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/security")({
  component: SecurityComponent,
});

function SecurityComponent() {
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
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Security & Compliance</h1>
          <p className="text-muted-foreground">
            Enterprise-grade protection for your most sensitive code and project data.
          </p>
        </div>

        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">SOC 2 Type II Certified</h2>
            <p className="leading-relaxed">
              Clarity is audited annually by independent third-party firms to ensure our security
              practices meet the stringent requirements of the Service Organization Control (SOC) 2
              Type II framework. We maintain strict controls over security, availability, and
              confidentiality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Data Encryption</h2>
            <p className="leading-relaxed mb-2">
              We employ state-of-the-art encryption protocols across our entire infrastructure:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>In Transit:</strong> All data sent to or from our infrastructure is
                encrypted using TLS 1.3 with Perfect Forward Secrecy (PFS).
              </li>
              <li>
                <strong>At Rest:</strong> Customer data is encrypted at rest using AES-256
                block-level storage encryption. Keys are managed through AWS Key Management Service
                (KMS).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Access Control & SSO</h2>
            <p className="leading-relaxed mb-2">
              Enterprise teams have full control over their organization's authentication perimeter:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                SAML 2.0 and OpenID Connect (OIDC) support for seamless integration with Okta,
                Microsoft Entra ID (Azure AD), Google Workspace, and Auth0.
              </li>
              <li>Enforced Multi-Factor Authentication (MFA) capabilities.</li>
              <li>Role-Based Access Control (RBAC) with granular repository-level permissions.</li>
              <li>Comprehensive audit logging for all authentication events and data access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Infrastructure Security</h2>
            <p className="leading-relaxed">
              Our service is hosted on AWS, utilizing multiple Availability Zones (AZs) to ensure
              high availability and disaster recovery readiness. We employ regular vulnerability
              scanning, continuous dependency monitoring, and conduct third-party penetration tests
              on a bi-annual basis to proactively identify and remediate risks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Reporting Vulnerabilities</h2>
            <p className="leading-relaxed">
              We welcome reports from security researchers and experts. If you believe you have
              discovered a vulnerability in a Clarity product or service, please contact our
              security team immediately at:{" "}
              <a href="mailto:security@clarity.app" className="text-primary hover:underline">
                security@clarity.app
              </a>
              . We ask that you do not publicly disclose the issue until we have had a chance to
              address it.
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
