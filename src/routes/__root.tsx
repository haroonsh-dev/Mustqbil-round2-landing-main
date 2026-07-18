import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Shield } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Analytics } from "@vercel/analytics/react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Clarity — Simple project management for focused teams" },
      {
        name: "description",
        content:
          "Clarity helps small teams plan work, track progress, and ship faster without the clutter of complex project management tools.",
      },
      { name: "author", content: "Clarity" },
      {
        property: "og:title",
        content: "Clarity — Simple project management for focused teams",
      },
      {
        property: "og:description",
        content:
          "Clarity helps small teams plan work, track progress, and ship faster without the clutter of complex project management tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

import { Toaster } from "../components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { ChatAssistant } from "../components/landing/ChatAssistant";
import { supabase } from "@/lib/supabase";

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookie-consent", JSON.stringify({ analytics: true, marketing: true, preferences: true }));
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-card border border-border rounded-xl shadow-2xl p-5 z-[100] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-semibold text-foreground text-left">We value your privacy</h4>
          <p className="text-xs text-muted-foreground leading-relaxed text-left">
            We use cookies to analyze site traffic, remember your settings, and deliver targeted marketing. 
            See our <Link to="/privacy" className="underline hover:text-primary">Privacy Policy</Link> and <Link to="/terms" className="underline hover:text-primary">Cookie Policy</Link>.
          </p>
        </div>
      </div>
      
      {showPreferences && (
        <div className="mb-4 space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50 text-xs text-left">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Strictly Necessary</label>
            <input type="checkbox" checked disabled className="accent-primary opacity-50 cursor-not-allowed" />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Analytics</label>
            <input 
              type="checkbox" 
              checked={preferences.analytics} 
              onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
              className="accent-primary cursor-pointer h-3 w-3" 
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Marketing</label>
            <input 
              type="checkbox" 
              checked={preferences.marketing} 
              onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
              className="accent-primary cursor-pointer h-3 w-3" 
            />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-border/60">
        {!showPreferences ? (
          <button
            onClick={() => setShowPreferences(true)}
            className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Manage preferences
          </button>
        ) : (
          <button
            onClick={savePreferences}
            className="px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Save preferences
          </button>
        )}
        <button
          onClick={acceptAllCookies}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs transition-colors"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();

  // Listen for Supabase PASSWORD_RECOVERY event and redirect to /reset-password
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate({ to: "/reset-password" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Toaster />
        <CookieBanner />
        <ChatAssistant />
      </QueryClientProvider>
    </AuthProvider>
  );
}
