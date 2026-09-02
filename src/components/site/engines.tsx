"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Engines / Domain schema registry
 * One governance layer, multiple production paths.
 */
const ENGINES = [
  {
    id: "general",
    name: "General Engine",
    tag: "default",
    desc: "Durable user state for facts, goals, preferences, and procedures. Use the general engine when you want durable user context without choosing an industry schema first.",
    items: ["facts", "goals", "preferences", "procedures"],
    active: true,
  },
  {
    id: "edtech",
    name: "EdTech Schema",
    tag: "domain",
    desc: "Extraction, retrieval, and safety tuned for learning products. Tracks learner progress, weak topics, and exam context.",
    items: ["learner progress", "weak topics", "exam context", "learning style"],
  },
  {
    id: "support",
    name: "Support Schema",
    tag: "domain",
    desc: "Remembers open issues, account context, sentiment risk, communication preferences, and resolution history.",
    items: ["open issues", "account context", "sentiment", "resolution history"],
  },
  {
    id: "passport",
    name: "Memory Passport",
    tag: "user-owned",
    desc: "Portable, consent-controlled memory the user can approve, inspect, correct, and revoke.",
    items: ["approve", "inspect", "correct", "revoke"],
  },
];

export function Engines() {
  return (
    <section id="product" className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 h-[360px] w-[500px] rounded-full bg-mem/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <SectionLabel>Domain schema registry</SectionLabel>
        <SectionHeading>
          One governance layer.
          <br />
          <span className="text-ink-mute">Multiple production paths.</span>
        </SectionHeading>
        <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
          Start with the general engine. Add a domain schema when your agent
          needs product-specific extraction, retrieval, and safety behavior.
        </p>

        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          {ENGINES.map((e, i) => (
            <EngineCard key={e.id} {...e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EngineCard({
  name,
  tag,
  desc,
  items,
  active,
  index,
}: {
  name: string;
  tag: string;
  desc: string;
  items: string[];
  active?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.06 }}
      className={`relative rounded-2xl border p-6 lg:p-7 overflow-hidden transition-colors ${
        active
          ? "border-mem/40 bg-mem/[0.05] ring-inset-hairline"
          : "border-hairline bg-surface hover:bg-surface-2/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
              active ? "bg-mem/15 text-mem" : "bg-white/[0.04] text-ink-soft"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <h3 className="text-[16.5px] font-semibold text-ink">{name}</h3>
        </div>
        <span
          className={`text-[10.5px] font-mono uppercase tracking-wider px-2 py-1 rounded border ${
            active
              ? "border-mem/40 bg-mem/10 text-mem"
              : "border-hairline text-ink-mute"
          }`}
        >
          {tag}
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`text-[11px] font-mono px-2 py-1 rounded-md border ${
              active
                ? "border-mem/30 bg-mem/10 text-mem"
                : "border-hairline bg-background/40 text-ink-soft"
            }`}
          >
            {it}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
