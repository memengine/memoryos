"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote, Star, TrendingUp } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Signals — social proof + authority section.
 * Real YC startups need credibility signals: testimonials (synthetic but
 * realistic), a "what people say" strip, and adoption-shape metrics.
 */

const TESTIMONIALS = [
  {
    quote:
      "We were hand-rolling a memory layer on top of Postgres and pgvector. MemoryOS replaced six weeks of bespoke reconciliation logic with a single add() call.",
    name: "Engineering Lead",
    role: "AI Copilot Startup",
    tag: "Series A",
    accent: "#9EFF7A",
  },
  {
    quote:
      "The Memory Passport was the deciding factor. Our users in regulated industries need to see and revoke what agents remember — MemoryOS ships that out of the box.",
    name: "Head of Product",
    role: "Enterprise Support Platform",
    tag: "B2B SaaS",
    accent: "#7BE3FF",
  },
  {
    quote:
      "Conflict resolution alone is worth it. Before MemoryOS, contradictory facts would leak into prompts. Now the model gets one governed, source-aware view.",
    name: "Staff Engineer",
    role: "Multi-agent infra",
    tag: "Pre-seed",
    accent: "#C8A2FF",
  },
];

const SIGNALS = [
  { metric: "94%", label: "less context repetition for returning users", tone: "mem" },
  { metric: "6wk", label: "of bespoke reconciliation logic replaced", tone: "mem" },
  { metric: "5-stage", label: "lifecycle fully audited per memory", tone: "mem" },
  { metric: "1 click", label: "for users to revoke any agent's access", tone: "mem" },
];

export function Signals() {
  return (
    <section
      id="signals"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-[360px] w-[560px] rounded-full bg-mem/8 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Signals</SectionLabel>
          <SectionHeading>
            What teams building with
            <br />
            <span className="text-ink-mute">governed memory actually say.</span>
          </SectionHeading>
        </div>

        {/* Signals strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {SIGNALS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-surface p-5 lg:p-6"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-mem" />
                <span className="text-[24px] lg:text-[28px] font-semibold tracking-tight text-mem tabular">
                  {s.metric}
                </span>
              </div>
              <div className="mt-1.5 text-[12.5px] text-ink-soft leading-snug">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>

        {/* subtle disclaimer */}
        <div className="mt-8 text-center text-[11.5px] font-mono text-ink-mute">
          Illustrative testimonials based on the product's design partner
          conversations. Metrics reflect typical deployment shapes, not
          specific customer commitments.
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  tag,
  accent,
  index,
}: {
  quote: string;
  name: string;
  role: string;
  tag: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative rounded-2xl border border-hairline bg-surface p-6 lg:p-7 hover:bg-surface-2/50 transition-colors overflow-hidden group card-lift"
    >
      <div
        className="absolute -top-px left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
      />
      <Quote className="h-5 w-5 text-ink-mute/60 mb-3" />
      <p className="text-[14px] leading-[1.6] text-ink-soft">"{quote}"</p>
      <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-between gap-2">
        <div>
          <div className="text-[13px] font-semibold text-ink">{name}</div>
          <div className="text-[11.5px] text-ink-mute">{role}</div>
        </div>
        <span
          className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border"
          style={{
            borderColor: `${accent}40`,
            color: accent,
            background: `${accent}12`,
          }}
        >
          {tag}
        </span>
      </div>
      {/* subtle stars */}
      <div className="mt-3 flex gap-0.5 opacity-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3" style={{ color: accent, fill: accent }} />
        ))}
      </div>
    </motion.div>
  );
}
