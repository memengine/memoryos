"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  History,
  RefreshCcw,
  Workflow,
  Lock,
  ArrowRight,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";

const PILLARS = [
  {
    icon: ShieldCheck,
    name: "Quality gates",
    desc: "Block duplicate, low-signal, over-budget, or rate-limited writes before they pollute memory.",
    code: "if signal.score < 0.35 → reject\nif is_duplicate(memory) → skip",
    color: "#9EFF7A",
  },
  {
    icon: Scale,
    name: "Conflict resolution",
    desc: "Use source authority, evidence, recency, and explicit review paths instead of storing contradictions forever.",
    code: "old: codes in Python\nnew: switch to TypeScript\n→ revise · keep history",
    color: "#FFB36B",
  },
  {
    icon: History,
    name: "Provenance",
    desc: "Track which service wrote a memory, what evidence produced it, and why retrieval trusts it.",
    code: "writer: support-bot/2.3\nevidence: msg#42 · confidence 8.8\nretrieval: weighted by source",
    color: "#C8A2FF",
  },
  {
    icon: RefreshCcw,
    name: "Lifecycle controls",
    desc: "Reinforce useful memory, archive stale facts, preserve versions, and handle corrections without losing history.",
    code: "state: active\n  → reinforced → active\n  → stale     → archived\n  → corrected  → version+1",
    color: "#7BE3FF",
  },
  {
    icon: Workflow,
    name: "Graceful degradation",
    desc: "Keep your product responsive when quotas or dependencies force a partial memory experience.",
    code: "if quota.exceeded:\n  return empty_ctx\n  log partial_mode = true",
    color: "#FFB36B",
  },
  {
    icon: Lock,
    name: "Tenant isolation",
    desc: "Keep customer memory scoped to the right tenant, user, agent, and permission boundary.",
    code: "tenant: tenant-A\nuser:   customer-123\nagent:  support-bot\nscope:  this_agent_only",
    color: "#9EFF7A",
  },
] as const;

export function Production() {
  return (
    <section
      id="production"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="06" label="production" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 h-[380px] w-[500px] rounded-full bg-violet/10 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Production foundations</SectionLabel>
          <SectionHeading>
            Reliable after the demo.
            <br />
            <span className="text-ink-mute">
              The controls teams usually discover only after their first memory
              prototype reaches real users.
            </span>
          </SectionHeading>
        </div>

        {/* Audit trail banner */}
        <div className="mt-12 rounded-2xl border border-hairline bg-surface overflow-hidden">
          <AuditTrail />
        </div>

        {/* Pillars grid */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.name} {...p} index={i} />
          ))}
        </div>

        {/* Is it your problem? */}
        <div className="mt-12 grid lg:grid-cols-2 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          <NeedCard
            tone="mem"
            title="You likely need governed context when"
            items={[
              "Multiple agents, services, or channels update context about the same user.",
              "Corrections must replace stale state without erasing history.",
              "Sources have different authority, or provenance and auditability matter.",
              "Context crosses tenant, user, agent, category, or consent boundaries.",
            ]}
          />
          <NeedCard
            tone="mute"
            title="You may not need MemoryOS yet when"
            items={[
              "Your product is a short-lived or single-session prototype.",
              "All required context already fits reliably in one prompt.",
              "You retrieve only static documents or general knowledge.",
              "There are no meaningful corrections, conflicts, permissions, or audit requirements.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function AuditTrail() {
  const rows = [
    { t: "12:04:21.553", e: "ingest", msg: "signal received · support-bot · msg#42", src: "support", ok: true },
    { t: "12:04:21.560", e: "extract", msg: "candidate: Prefers concise explanations · conf 8.2", src: "extractor", ok: true },
    { t: "12:04:21.572", e: "reconcile", msg: "no conflict · merges into user state", src: "reconciler", ok: true },
    { t: "12:04:21.581", e: "govern", msg: "quality gate ✓ · tenant tenant-A · consent granted", src: "governor", ok: true },
    { t: "12:04:21.590", e: "store", msg: "memory#mem_8821 · provenance: msg#42", src: "store", ok: true },
    { t: "12:04:24.012", e: "retrieve", msg: "query: how should I answer this user · 2 items ranked", src: "retriever", ok: true },
  ];
  return (
    <div>
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
        <div className="flex items-center gap-2 text-[11.5px] font-mono text-ink-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
          audit trail · memory#mem_8821
        </div>
        <div className="text-[11px] font-mono text-ink-mute">last 90s · tenant-A</div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="space-y-1 font-mono text-[11.5px] sm:text-[12.5px]">
          {rows.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex items-start sm:items-center gap-3 rounded px-2 py-1.5 hover:bg-white/[0.02] transition-colors flex-wrap sm:flex-nowrap"
            >
              <span className="text-ink-mute shrink-0">{r.t}</span>
              <span className={`shrink-0 inline-flex items-center gap-1 ${r.ok ? "text-mem" : "text-amber"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {r.e}
              </span>
              <span className="text-ink-soft flex-1 min-w-0 truncate">{r.msg}</span>
              <span className="text-ink-mute shrink-0 hidden sm:inline">{r.src}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PillarCard({
  icon: Icon,
  name,
  desc,
  code,
  color,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  desc: string;
  code: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
      className="group bg-surface p-5 lg:p-6 hover:bg-surface-2/50 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${color}40`,
            background: `${color}1a`,
            color,
          }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h3 className="text-[15px] font-semibold text-ink">{name}</h3>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{desc}</p>

      <pre
        className="mt-4 rounded-lg border border-hairline bg-background/40 p-3 font-mono text-[11.5px] leading-[1.55] text-ink-soft whitespace-pre overflow-x-auto scroll-thin"
        style={{ borderLeftColor: `${color}66`, borderLeftWidth: 2 }}
      >
        {code}
      </pre>
    </motion.div>
  );
}

function NeedCard({
  tone,
  title,
  items,
}: {
  tone: "mem" | "mute";
  title: string;
  items: string[];
}) {
  return (
    <div
      className={`p-6 lg:p-8 ${
        tone === "mem" ? "bg-surface" : "bg-background/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-flex h-2 w-2 rounded-full ${
            tone === "mem" ? "bg-mem" : "bg-ink-mute"
          }`}
        />
        <h3 className={`text-[14px] font-semibold ${tone === "mem" ? "text-ink" : "text-ink-soft"}`}>
          {title}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
            {tone === "mem" ? (
              <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-mem" />
            ) : (
              <span className="mt-1.5 inline-block h-1 w-3 rounded-full bg-ink-mute shrink-0" />
            )}
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
