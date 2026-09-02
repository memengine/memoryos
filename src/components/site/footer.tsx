"use client";

import { Logo } from "./logo";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Engines", href: "#product" },
      { label: "Playground", href: "#demo" },
      { label: "How it works", href: "#how" },
      { label: "Production controls", href: "#production" },
      { label: "Memory Passport", href: "#passport" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Customer Support", href: "#use-cases" },
      { label: "Education", href: "#use-cases" },
      { label: "Memory Passport", href: "#passport" },
      { label: "Multi-agent systems", href: "#use-cases" },
      { label: "AI copilots", href: "#use-cases" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#developers" },
      { label: "Quickstart", href: "#developers" },
      { label: "Python SDK", href: "#developers" },
      { label: "TypeScript SDK", href: "#developers" },
      { label: "REST API", href: "#developers" },
      { label: "MCP Server", href: "#developers" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Security & governance", href: "#production" },
      { label: "Where MemoryOS fits", href: "#fits" },
      { label: "Privacy", href: "#cta" },
      { label: "Terms", href: "#cta" },
      { label: "Contact", href: "#cta" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline bg-background">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div>
            <Logo />
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft max-w-xs">
              Governed state and context for production AI agents. Current
              context. Inspectable decisions.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[11.5px] font-mono text-ink-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
              all systems operational
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono">
                {col.title}
              </div>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13.5px] text-ink-soft hover:text-ink transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[12px] text-ink-mute font-mono">
            © 2026 MemoryOS · Governed state and context for production AI agents.
          </div>
          <div className="flex items-center gap-4 text-[12px] font-mono text-ink-mute">
            <a href="#cta" className="hover:text-ink-soft transition-colors">Privacy</a>
            <a href="#cta" className="hover:text-ink-soft transition-colors">Terms</a>
            <a href="#cta" className="hover:text-ink-soft transition-colors">Cookies</a>
            <a href="#cta" className="hover:text-ink-soft transition-colors">Security</a>
            <a href="#cta" className="hover:text-ink-soft transition-colors">DPA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
