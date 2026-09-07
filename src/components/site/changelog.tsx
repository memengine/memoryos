"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GitCommit, Rocket, Sparkles, Calendar } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Changelog / Roadmap — product momentum signals.
 * Shows shipped milestones + what's coming next. Communicates velocity.
 */

type Entry = {
  version: string;
  date: string;
  status: "shipped" | "next";
  title: string;
  items: string[];
  accent: string;
};

const ENTRIES: Entry[] = [
  {
    version: "1.0",
    date: "Sep 2026",
    status: "shipped",
    title: "General availability",
    items: [
      "Domain schema registry (General, EdTech, Support)",
      "Memory Passport with grant/revoke + provenance drawer",
      "MCP server for MCP-compatible agents",
      "Quality gates, conflict resolution, tenant isolation",
    ],
    accent: "#9EFF7A",
  },
  {
    version: "0.9",
    date: "Aug 2026",
    status: "shipped",
    title: "Production foundations",
    items: [
      "5-stage lifecycle (ingest → retrieve)",
      "Provenance chain + audit trail",
      "Graceful degradation on quota limits",
      "Python + TypeScript SDKs, REST API",
    ],
    accent: "#7BE3FF",
  },
  {
    version: "next",
    date: "Q4 2026",
    status: "next",
    title: "On the roadmap",
    items: [
      "Streaming extraction (SSE) for sub-second traces",
      "Self-hosted / on-prem deployment",
      "SOC 2 Type II + DPA",
      "Custom domain schemas (financial services, healthcare)",
    ],
    accent: "#C8A2FF",
  },
];

export function Changelog() {
  return (
    <section
      id="changelog"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 h-[360px] w-[480px] rounded-full bg-violet/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Changelog & roadmap</SectionLabel>
          <SectionHeading>
            Shipping continuously.
            <br />
            <span className="text-ink-mute">What's live, and what's next.</span>
          </SectionHeading>
        </div>

        <div className="mt-12 relative">
          {/* timeline rail */}
          <div className="absolute left-[19px] sm:left-[27px] top-2 bottom-2 w-px bg-hairline" />

          <div className="space-y-6">
            {ENTRIES.map((e, i) => (
              <ChangelogEntry key={e.version} entry={e} index={i} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2.5 text-[13px] text-ink-soft hover:text-mem hover:border-mem/40 transition-colors"
          >
            <Rocket className="h-3.5 w-3.5" />
            Join the design partner program for early access
            <Sparkles className="h-3 w-3 text-mem opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ChangelogEntry({ entry, index }: { entry: Entry; index: number }) {
  const isShipped = entry.status === "shipped";
  const Icon = isShipped ? GitCommit : Calendar;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-12 sm:pl-16"
    >
      {/* node */}
      <span
        className="absolute left-0 top-1 inline-flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2"
        style={{
          borderColor: `${entry.accent}55`,
          background: `${entry.accent}14`,
          color: entry.accent,
        }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>

      <div
        className="rounded-2xl border bg-surface p-5 lg:p-6 overflow-hidden"
        style={{
          borderColor: isShipped ? `${entry.accent}30` : "var(--hairline)",
        }}
      >
        <div className="flex items-center gap-2.5 flex-wrap mb-3">
          <span
            className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
            style={{
              borderColor: `${entry.accent}40`,
              color: entry.accent,
              background: `${entry.accent}12`,
            }}
          >
            v{entry.version}
          </span>
          <span className="text-[12px] font-mono text-ink-mute">{entry.date}</span>
          <span
            className={`text-[10.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
              isShipped
                ? "bg-mem/10 text-mem border border-mem/30"
                : "bg-violet/10 text-violet border border-violet/30"
            }`}
          >
            {isShipped ? "shipped" : "next"}
          </span>
        </div>

        <h3 className="text-[17px] font-semibold text-ink mb-2">{entry.title}</h3>

        <ul className="space-y-1.5">
          {entry.items.map((it) => (
            <li
              key={it}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft"
            >
              <span
                className="mt-1.5 inline-block h-1 w-3 rounded-full shrink-0"
                style={{ background: entry.accent }}
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
