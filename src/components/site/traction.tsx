"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

/**
 * Traction — a compact proof strip placed right after the hero.
 * Communicates momentum + authority without faking customer logos.
 */
export function Traction() {
  return (
    <section className="relative py-10 border-t border-hairline">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-surface p-5 lg:p-6"
            >
              <div className="flex items-baseline gap-1.5">
                <AnimatedCounter
                  value={s.value}
                  decimals={s.decimals || 0}
                  prefix={s.prefix || ""}
                  suffix={s.suffix || ""}
                  className={`text-[28px] lg:text-[32px] font-semibold tracking-tight text-ink tabular ${s.accent || ""}`}
                />
              </div>
              <div className="mt-1.5 text-[12.5px] text-ink-soft leading-snug">
                {s.label}
              </div>
              <div className="mt-1 text-[11px] font-mono text-ink-mute uppercase tracking-wider">
                {s.tag}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee of "shape of the product" tokens — feels alive without faking logos */}
        <div className="mt-6 relative overflow-hidden mask-fade-x">
          <div className="flex gap-8 animate-[mem-marquee_28s_linear_infinite] whitespace-nowrap will-change-transform">
            {[...TOKENS, ...TOKENS].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-[12.5px] font-mono text-ink-mute"
              >
                <span className="h-1 w-1 rounded-full bg-mem/70" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: 5, suffix: "-stage", label: "Ingest → Retrieve pipeline", tag: "lifecycle", accent: "text-mem" },
  { value: 4, suffix: " SDKs", label: "Python · TS · REST · MCP", tag: "developer surface", accent: "text-mem" },
  { value: 6, suffix: " controls", label: "Quality, conflict, provenance, lifecycle, degradation, isolation", tag: "production gates", accent: "text-mem" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Designed for SLA-grade AI workloads", tag: "tenant isolated", accent: "text-mem" },
] as const;

const TOKENS = [
  "memory.add()",
  "memory.get()",
  "tenant-A · customer-123",
  "quality gate ✓",
  "conflict resolved",
  "provenance: msg#42",
  "consent granted",
  "context · ranked · fresh",
  "lifecycle: active",
  "scope: this_agent_only",
];

// Add the marquee keyframe via a style tag is messy; instead rely on a CSS class
// defined in globals.css. We declare it here for clarity but the animation
// must exist in CSS.
