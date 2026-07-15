import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { StaticBoardPreview } from "@/components/landing/StaticBoardPreview";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      <Navbar />

      <main id="main-content" className="flex-1 focus:outline-none pt-20">
        <div className="reveal"><Hero /></div>
        
        {/* Infinite Logo Scroller (Social Proof) */}
        <div className="reveal border-y border-border bg-[#F4F4F5] dark:bg-muted/5 py-20 overflow-hidden relative w-full logo-ticker-container">
          <div className="logo-ticker-track flex items-center">
            {/* Set 1 */}
            <div className="flex gap-8 md:gap-16 shrink-0 items-center justify-around pr-8 md:pr-16 text-xs md:text-sm font-semibold tracking-wider text-muted-foreground/60 uppercase">
              <span>Stripe</span>
              <span>Vercel</span>
              <span>Airbnb</span>
              <span>Linear</span>
              <span>Figma</span>
              <span>GitHub</span>
              <span>Retool</span>
              <span>Supabase</span>
            </div>
            {/* Set 2 (Duplicated for seamless loop) */}
            <div className="flex gap-8 md:gap-16 shrink-0 items-center justify-around pr-8 md:pr-16 text-xs md:text-sm font-semibold tracking-wider text-muted-foreground/60 uppercase">
              <span>Stripe</span>
              <span>Vercel</span>
              <span>Airbnb</span>
              <span>Linear</span>
              <span>Figma</span>
              <span>GitHub</span>
              <span>Retool</span>
              <span>Supabase</span>
            </div>
          </div>
        </div>

        <div className="reveal"><Features /></div>
        <div className="reveal"><StaticBoardPreview /></div>
        <div className="reveal"><Pricing /></div>
      </main>

      <div className="reveal"><Footer /></div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground shadow-sm transition-all duration-300 hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none z-40 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
        aria-hidden={!showBackToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}
