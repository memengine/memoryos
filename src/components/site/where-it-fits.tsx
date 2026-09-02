"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionLabel, SectionHeading } from "./problem";
import { Database, MessageSquare, Search, FileText, Hexagon } from "lucide-react";

/**
 * Core differentiator: where MemoryOS fits.
 * Visually shows the layered stack of an AI product and positions
 * MemoryOS as the *governed learned state* layer — not a replacement for
 * the other systems.
 */
export function WhereItFits() {
  return (
    <section
      id="fits"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-mem/8 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: copy */}
          <div>
            <SectionLabel>Where MemoryOS fits</SectionLabel>
            <SectionHeading>
              Your agent has storage.
              <br />
              <span className="text-ink-mute">
                It may not have governed state.
              </span>
            </SectionHeading>
            <p className="mt-6 text-[16px] leading-[1.6] text-ink-soft max-w-xl">
              MemoryOS complements the systems you already use. It does not
              replace complete transcripts, business records, document
              retrieval, or the tools that perform real actions. Send
              MemoryOS the relevant signals from those systems, and retrieve
              compact governed context before the next model call.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-3 text-[13px]">
              <span className="text-ink-mute font-mono">your app stays responsible for</span>
              <span className="text-ink font-medium">business data</span>
              <span className="text-ink-mute">·</span>
              <span className="text-ink font-medium">actions</span>
              <span className="text-ink-mute">·</span>
              <span className="text-ink font-medium">final responses</span>
            </div>
          </div>

          {/* Right: stack */}
          <StackList />
        </div>
      </div>
    </section>
  );
}

const LAYERS = [
  {
    icon: Database,
    name: "Application database / CRM",
    role: "Owns business records, transactions, and live operational truth.",
    tag: "source of record",
    color: "#8A8F98",
  },
  {
    icon: MessageSquare,
    name: "Transcript store",
    role: "Preserves complete conversations and message history.",
    tag: "history",
    color: "#8A8F98",
  },
  {
    icon: Search,
    name: "Vector search",
    role: "Finds semantically similar records and documents.",
    tag: "retrieval",
    color: "#8A8F98",
  },
  {
    icon: FileText,
    name: "Files, skills & knowledge bases",
    role: "Provide static instructions and general knowledge.",
    tag: "static",
    color: "#8A8F98",
  },
  {
    icon: Hexagon,
    name: "MemoryOS",
    role: "Governs learned state: what changed, what is current, and who may reuse it.",
    tag: "governed state",
    color: "#9EFF7A",
    highlight: true,
  },
];

function StackList() {
  return (
    <div className="relative">
      <div className="space-y-3">
        {LAYERS.map((l, i) => (
          <LayerRow key={l.name} {...l} index={i} />
        ))}
      </div>

      {/* MemoryOS glow line under highlight */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-mem/40 to-transparent" />
    </div>
  );
}

function LayerRow({
  icon: Icon,
  name,
  role,
  tag,
  color,
  highlight,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  role: string;
  tag: string;
  color: string;
  highlight?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`relative flex items-start gap-4 rounded-xl border p-4 lg:p-5 transition-colors ${
        highlight
          ? "border-mem/40 bg-mem/[0.06] ring-inset-hairline glow-mem"
          : "border-hairline bg-surface hover:bg-surface-2/60"
      }`}
    >
      <div
        className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
          highlight ? "bg-mem/15 text-mem" : "bg-white/[0.04] text-ink-soft"
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[15px] font-semibold ${highlight ? "text-mem" : "text-ink"}`}>
            {name}
          </span>
          <span
            className={`text-[10.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
              highlight
                ? "bg-mem/15 text-mem border border-mem/30"
                : "bg-white/[0.04] text-ink-mute border border-hairline"
            }`}
          >
            {tag}
          </span>
          {highlight && (
            <span className="text-[10.5px] font-mono text-mem ml-auto">
              ← this layer
            </span>
          )}
        </div>
        <p className={`mt-1 text-[13.5px] leading-relaxed ${highlight ? "text-ink-soft" : "text-ink-mute"}`}>
          {role}
        </p>
      </div>
    </motion.div>
  );
}
