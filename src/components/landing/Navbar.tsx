import { Link } from "@tanstack/react-router";
import { Menu, X, Layout, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state checks
      setScrolled(currentScrollY > 10);

      // Hide / Show animation checks
      if (currentScrollY <= 80) {
        // Keep navbar visible at the top
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide
        setVisible(false);
      } else {
        // Scrolling up -> show
        setVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Active section scrollspy check
      const sections = ["demo", "pricing", "faq"];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
      else setActiveSection("");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? "scrolled border-b py-3 shadow-xs"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground group"
          aria-label="Clarity Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <Layout className="h-5 w-5" />
          </div>
          <span className="text-xl tracking-tight font-bold">
            Clarity<span className="text-primary font-light">.</span>
          </span>
        </a>

        {/* Active indicator scrollspy linked navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            to="/features"
            className="nav-link-hover transition-colors text-muted-foreground"
            activeProps={{ className: "text-[#5B5BD6] font-bold border-b-2 border-[#5B5BD6] pb-1" }}
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="nav-link-hover transition-colors text-muted-foreground"
            activeProps={{ className: "text-[#5B5BD6] font-bold border-b-2 border-[#5B5BD6] pb-1" }}
          >
            Pricing
          </Link>
          <Link
            to="/demo"
            className="nav-link-hover transition-colors text-muted-foreground"
            activeProps={{ className: "text-[#5B5BD6] font-bold border-b-2 border-[#5B5BD6] pb-1" }}
          >
            Demo
          </Link>
          <Link
            to="/changelog"
            className="nav-link-hover transition-colors text-muted-foreground"
            activeProps={{ className: "text-[#5B5BD6] font-bold border-b-2 border-[#5B5BD6] pb-1" }}
          >
            Changelog
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition-colors hover:bg-muted cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle dark/light theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </button>
          {user ? (
            <>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-muted-foreground nav-link-hover cursor-pointer transition-colors"
              >
                Log out
              </button>
              <Link
                to="/"
                className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium nav-cta-button"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground nav-link-hover transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium nav-cta-button"
              >
                Start free trial
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 border-b border-border bg-background px-6 py-6 shadow-lg animate-in slide-in-from-top-4 duration-200 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground py-1"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground py-1"
            >
              Pricing
            </Link>
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground py-1"
            >
              Demo
            </Link>
            <Link
              to="/changelog"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-foreground py-1"
            >
              Changelog
            </Link>
            <hr className="border-border" />
            <div className="flex flex-col gap-2 pt-2">
              {user ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-9 items-center justify-center rounded-md nav-cta-button"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-muted cursor-pointer"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-muted"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-9 items-center justify-center rounded-md nav-cta-button"
                  >
                    Start free trial
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
