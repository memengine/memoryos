"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * ComparisonMatrix — detailed feature comparison.
 * MemoryOS vs Application DB vs Transcript Store vs Vector DB.
 * One of the strongest investor-facing sections.
 */

type Cell = "yes" | "no" | "partial";
type Column = {
  id: "appdb" | "transcript" | "vector" | "memoryos";
  name: string;
  sub: string;
  color: string;
  highlight?: boolean;
};

const COLS: readonly Column[] = [
  { id: "appdb", name: "Application DB", sub: "records", color: "#8A8F98" },
  { id: "transcript", name: "Transcript Store", sub: "history", color: "#8A8F98" },
  { id: "vector", name: "Vector Search", sub: "retrieval", color: "#8A8F98" },
  { id: "memoryos", name: "MemoryOS", sub: "governed state", color: "#9EFF7A", highlight: true },
] as const;

const ROWS: { group: string; label: string; cells: Record<string, Cell>; note?: string }[] = [
  {
    group: "Storage",
    label: "Owns the data it writes",
    cells: { appdb: "yes", transcript: "yes", vector: "yes", memoryos: "yes" },
  },
  {
    group: "Storage",
    label: "Complete conversation history",
    cells: { appdb: "partial", transcript: "yes", vector: "no", memoryos: "partial" },
    note: "MemoryOS extracts durable state, not raw transcripts.",
  },
  {
    group: "State",
    label: "Decides what is durable vs. transient",
    cells: { appdb: "no", transcript: "no", vector: "no", memoryos: "yes" },
  },
  {
    group: "State",
    label: "Reconciles conflicts between sources",
    cells: { appdb: "no", transcript: "no", vector: "no", memoryos: "yes" },
  },
  {
    group: "State",
    label: "Tracks what changed over time (versions)",
    cells: { appdb: "partial", transcript: "partial", vector: "no", memoryos: "yes" },
  },
  {
    group: "Governance",
    label: "Provenance & source authority",
    cells: { appdb: "partial", transcript: "no", vector: "no", memoryos: "yes" },
  },
  {
    group: "Governance",
    label: "Quality gates on writes",
    cells: { appdb: "no", transcript: "no", vector: "no", memoryos: "yes" },
  },
  {
    group: "Governance",
    label: "Tenant, user, agent isolation",
    cells: { appdb: "partial", transcript: "no", vector: "partial", memoryos: "yes" },
  },
  {
    group: "Retrieval",
    label: "Returns prompt-ready, compact context",
    cells: { appdb: "no", transcript: "no", vector: "partial", memoryos: "yes" },
  },
  {
    group: "Retrieval",
    label: "Ranks by relevance + recency + authority",
    cells: { appdb: "no", transcript: "no", vector: "partial", memoryos: "yes" },
  },
  {
    group: "Control",
    label: "User-approved memory (Memory Passport)",
    cells: { appdb: "no", transcript: "no", vector: "no", memoryos: "yes" },
  },
  {
    group: "Control",
    label: "Graceful degradation on quota limits",
    cells: { appdb: "partial", transcript: "yes", vector: "partial", memoryos: "yes" },
  },
];

export function ComparisonMatrix() {
  return (
    <section
      id="compare"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 h-[360px] w-[500px] rounded-full bg-mem/8 blur-[150px]" />
      </div>
      <div className="container-page">
        <SectionLabel>MemoryOS vs. the rest of your stack</SectionLabel>
        <SectionHeading>
          Not a vector database.
          <br />
          <span className="text-ink-mute">
            Not a transcript store. Not your app DB.
          </span>
        </SectionHeading>
        <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
          Each system owns a different job. MemoryOS is the only one that
          governs <span className="text-ink font-medium">learned state</span> —
          what changed, what is current, and who may reuse it.
        </p>

        <ComparisonTable />

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-mute">
          <LegendItem tone="yes" label="Native capability" />
          <LegendItem tone="partial" label="Partial / possible with custom work" />
          <LegendItem tone="no" label="Not designed for this" />
        </div>
      </div>
    </section>
  );
}

function ComparisonTable() {
  // group rows
  const groups = ROWS.reduce<Record<string, typeof ROWS>>((acc, r) => {
    (acc[r.group] ||= []).push(r);
    return acc;
  }, {});
  const groupNames = Object.keys(groups);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-2xl border border-hairline-strong bg-surface/60 backdrop-blur-sm overflow-hidden ring-inset-hairline"
    >
      <div className="overflow-x-auto scroll-thin">
        <div className="min-w-[680px]">
          {/* header */}
          <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] border-b border-hairline bg-surface-2/40">
            <div className="p-4 lg:p-5 text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono sticky left-0 bg-surface-2/95 backdrop-blur-sm z-10">
              Capability
            </div>
            {COLS.map((c) => (
              <div
                key={c.id}
                className={`relative p-4 lg:p-5 text-center ${
                  c.highlight ? "bg-mem/[0.06]" : ""
                }`}
              >
                {c.highlight && (
                  <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mem to-transparent" />
                )}
                <div className={`text-[13px] font-semibold ${c.highlight ? "text-mem" : "text-ink"}`}>
                  {c.name}
                </div>
                <div className="text-[10.5px] font-mono text-ink-mute mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* rows by group */}
          {groupNames.map((g) => (
            <div key={g}>
              <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] bg-background/30 border-y border-hairline">
                <div className="p-3 lg:p-4 text-[10.5px] uppercase tracking-[0.18em] text-ink-mute font-mono sticky left-0 bg-background/90 backdrop-blur-sm z-10">
                  {g}
                </div>
                <div className="col-span-4" />
              </div>
              {groups[g].map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.6fr_repeat(4,1fr)] border-b border-hairline/60 last:border-b-0 ${
                    i % 2 ? "bg-white/[0.015]" : ""
                  }`}
                >
                  <div className="p-4 lg:p-5 flex items-start gap-2 sticky left-0 bg-surface/95 backdrop-blur-sm z-10">
                    <span className="text-[13.5px] text-ink-soft leading-snug">
                      {row.label}
                    </span>
                  </div>
                  {COLS.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 lg:p-5 flex items-center justify-center ${
                        c.highlight ? "bg-mem/[0.04]" : ""
                      }`}
                    >
                      <CellMark tone={row.cells[c.id]} highlight={c.highlight} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* mobile scroll hint */}
      <div className="lg:hidden flex items-center justify-center gap-1.5 py-2 border-t border-hairline bg-surface-2/30 text-[10.5px] font-mono text-ink-mute">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        swipe to compare
      </div>
    </motion.div>
  );
}

function CellMark({ tone, highlight }: { tone: Cell; highlight?: boolean }) {
  if (tone === "yes") {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md border ${
          highlight
            ? "border-mem/40 bg-mem/15 text-mem"
            : "border-mem/30 bg-mem/[0.06] text-mem"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (tone === "partial") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-hairline-strong bg-white/[0.03] text-ink-mute">
        <Minus className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-hairline text-ink-mute/50">
      <X className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
  );
}

function LegendItem({ tone, label }: { tone: Cell; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <CellMark tone={tone} />
      <span className="font-mono text-[12px]">{label}</span>
    </span>
  );
}
