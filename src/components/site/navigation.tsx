"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, BookOpen } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Product",
    items: [
      { label: "Engines", desc: "General + domain schemas", href: "#product" },
      { label: "How it works", desc: "Ingest → Retrieve pipeline", href: "#how" },
      { label: "Playground", desc: "Live memory decision demo", href: "#demo" },
      { label: "Production controls", desc: "Quality, conflict, provenance", href: "#production" },
    ],
  },
  {
    label: "Developers",
    items: [
      { label: "Python SDK", desc: "pip install memoryo-sdk", href: "#developers" },
      { label: "TypeScript SDK", desc: "npm i @memoryos/sdk", href: "#developers" },
      { label: "REST API", desc: "Stateless HTTP integration", href: "#developers" },
      { label: "MCP Server", desc: "Tools for MCP-compatible agents", href: "#developers" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Customer Support", desc: "Carry resolution history", href: "#use-cases" },
      { label: "Education", desc: "Personalized learning memory", href: "#use-cases" },
      { label: "Memory Passport", desc: "User-approved sharing", href: "#passport" },
      { label: "Multi-agent systems", desc: "Shared governed context", href: "#use-cases" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Docs", desc: "Quickstart, concepts, API", href: "#developers" },
      { label: "Security & governance", desc: "Isolation, quality, audit", href: "#production" },
      { label: "Where MemoryOS fits", desc: "vs. DB / vector / transcripts", href: "#fits" },
      { label: "Contact", desc: "Talk to us about onboarding", href: "#cta" },
    ],
  },
];

export function Navigation() {
  const [scrolled, setScrolled] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-hairline bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-page h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center" aria-label="MemoryOS home">
          <Logo />
        </a>

        {/* Desktop nav */}
        <div
          className="hidden lg:flex items-center"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {NAV.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(group.label)}
            >
              <button
                className={cn(
                  "px-3.5 py-2 text-[13.5px] font-medium text-ink-soft hover:text-ink transition-colors flex items-center gap-1",
                  openMenu === group.label && "text-ink"
                )}
                aria-expanded={openMenu === group.label}
              >
                {group.label}
                <svg
                  className={cn(
                    "h-3.5 w-3.5 opacity-60 transition-transform",
                    openMenu === group.label && "rotate-180"
                  )}
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {openMenu === group.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-full pt-2 w-[300px]"
                  >
                    <div className="rounded-xl border border-hairline-strong bg-surface/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/40">
                      {group.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenMenu(null)}
                          className="group flex flex-col gap-0.5 rounded-lg px-3 py-2 hover:bg-white/[0.04] transition-colors"
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-[13.5px] font-medium text-ink">
                              {item.label}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-ink-mute opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </span>
                          <span className="text-[12px] text-ink-mute">{item.desc}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-ink-soft hover:text-ink hover:bg-white/[0.04]"
          >
            <a href="#developers" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Docs
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-9 px-4 rounded-lg shadow-[0_0_0_1px_oklch(0.92_0.17_145_/_30%),0_8px_24px_-12px_oklch(0.92_0.17_145_/_60%)]"
          >
            <a href="#cta" className="gap-1.5">
              Try MemoryOS
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-white/[0.05]"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-b border-hairline bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container-page py-4 space-y-4 max-h-[80vh] overflow-y-auto scroll-thin">
              {NAV.map((group) => (
                <div key={group.label}>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-1.5">
                    {group.label}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col py-1.5"
                      >
                        <span className="text-[14.5px] font-medium text-ink">
                          {item.label}
                        </span>
                        <span className="text-[12px] text-ink-mute">{item.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-hairline">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start gap-2 h-11"
                >
                  <a href="#developers">
                    <BookOpen className="h-4 w-4" /> Read the docs
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-11 gap-2"
                >
                  <a href="#cta">
                    Try MemoryOS <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
