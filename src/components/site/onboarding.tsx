"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Terminal, Plug, Rocket, ArrowRight } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { Button } from "@/components/ui/button";

/**
 * Onboarding — a concrete 3-step "how teams start" section.
 * Reduces perceived integration risk for developers and buyers.
 */
const STEPS = [
  {
    n: "01",
    icon: Terminal,
    title: "Install the SDK",
    desc: "Add the Python or TypeScript SDK to your backend. Bring your existing agent, model, and tools — MemoryOS sits beside them.",
    code: "pip install memoryo-sdk",
    accent: "#9EFF7A",
  },
  {
    n: "02",
    icon: Plug,
    title: "Wire add() and get()",
    desc: "Call add() on the way in with conversation signals. Call get() before the next model call to retrieve compact, governed context.",
    code: "client.add(...); client.get(...)",
    accent: "#7BE3FF",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Govern and ship",
    desc: "Enable quality gates, tenant isolation, and Memory Passport. Watch the audit trail. Ship to production with confidence.",
    code: "quality_gates = on · tenant_isolated = true",
    accent: "#C8A2FF",
  },
];

export function Onboarding() {
  return (
    <section className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[320px] w-[680px] rounded-full bg-mem/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>How teams start</SectionLabel>
          <SectionHeading>
            From zero to governed context
            <br />
            <span className="text-ink-mute">in one afternoon.</span>
          </SectionHeading>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <StepCard key={s.n} {...s} index={i} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-11 px-5 rounded-lg gap-1.5"
          >
            <a href="#cta">
              Get an API key
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 px-5 rounded-lg border border-hairline hover:bg-white/[0.04] gap-1.5"
          >
            <a href="#developers">Read the quickstart</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  desc,
  code,
  accent,
  index,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  code: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-2xl border border-hairline bg-surface p-6 lg:p-7 hover:bg-surface-2/50 transition-colors overflow-hidden"
    >
      {/* connector arrow between steps (desktop) */}
      {index < 2 && (
        <div className="hidden lg:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
          <div className="h-px w-6 bg-gradient-to-r from-hairline-strong to-transparent" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${accent}40`,
            background: `${accent}14`,
            color: accent,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-mute">
          step {n}
        </span>
      </div>

      <h3 className="mt-4 text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{desc}</p>

      <div
        className="mt-4 rounded-lg border border-hairline bg-background/50 px-3 py-2 font-mono text-[12px] text-ink-soft overflow-x-auto scroll-thin"
        style={{ borderLeftColor: `${accent}55`, borderLeftWidth: 2 }}
      >
        <span className="text-ink-mute">$ </span>
        <span>{code}</span>
      </div>
    </motion.div>
  );
}
