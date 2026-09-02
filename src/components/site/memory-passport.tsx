"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Pencil,
  Scale,
  KeyRound,
  ShieldOff,
  CheckCircle2,
  Clock,
  X,
  History,
  Fingerprint,
  Trash2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { useExtractedMemorySubscription } from "@/hooks/use-extracted-memory";

type MemoryStatus = "approved" | "corrected" | "pending" | "archived";

type Memory = {
  id: string;
  type: "Preference" | "Fact" | "Goal" | "Procedure";
  text: string;
  status: MemoryStatus;
  confidence: number;
  source: string;
  writtenAt: string;
  provenance: { event: string; at: string; by: string }[];
  scope: string;
};

const INITIAL_MEMORIES: Memory[] = [
  {
    id: "mem_8821",
    type: "Preference",
    text: "Prefers concise explanations.",
    status: "approved",
    confidence: 8.2,
    source: "support-bot · msg#42",
    writtenAt: "2026-09-02 12:04",
    provenance: [
      { event: "ingest", at: "12:04:21.553", by: "support-bot" },
      { event: "extract", at: "12:04:21.560", by: "extractor" },
      { event: "reconcile · no conflict", at: "12:04:21.572", by: "reconciler" },
      { event: "govern · quality ✓", at: "12:04:21.581", by: "governor" },
      { event: "store", at: "12:04:21.590", by: "store" },
    ],
    scope: "all agents · tenant-A",
  },
  {
    id: "mem_8802",
    type: "Fact",
    text: "Codes primarily in TypeScript.",
    status: "corrected",
    confidence: 9.1,
    source: "copilot · msg#118",
    writtenAt: "2026-09-02 11:08",
    provenance: [
      { event: "ingest", at: "11:08:02.110", by: "copilot" },
      { event: "extract", at: "11:08:02.119", by: "extractor" },
      { event: "conflict · vs prior 'codes in Python'", at: "11:08:02.130", by: "reconciler" },
      { event: "revise · preserve history", at: "11:08:02.141", by: "governor" },
      { event: "store · v2", at: "11:08:02.150", by: "store" },
    ],
    scope: "all agents · tenant-A",
  },
  {
    id: "mem_8765",
    type: "Goal",
    text: "Shipping B2B SaaS for Indian SMBs.",
    status: "approved",
    confidence: 8.8,
    source: "support-bot · msg#31",
    writtenAt: "2026-09-01 18:22",
    provenance: [
      { event: "ingest", at: "18:22:14.000", by: "support-bot" },
      { event: "extract", at: "18:22:14.008", by: "extractor" },
      { event: "reconcile · no conflict", at: "18:22:14.020", by: "reconciler" },
      { event: "govern · quality ✓", at: "18:22:14.029", by: "governor" },
      { event: "store", at: "18:22:14.038", by: "store" },
    ],
    scope: "all agents · tenant-A",
  },
  {
    id: "mem_8740",
    type: "Fact",
    text: "Uses FastAPI, Postgres, Docker.",
    status: "approved",
    confidence: 8.4,
    source: "copilot · msg#89",
    writtenAt: "2026-09-01 09:41",
    provenance: [
      { event: "ingest", at: "09:41:55.200", by: "copilot" },
      { event: "extract", at: "09:41:55.208", by: "extractor" },
      { event: "reconcile · no conflict", at: "09:41:55.220", by: "reconciler" },
      { event: "govern · quality ✓", at: "09:41:55.229", by: "governor" },
      { event: "store", at: "09:41:55.238", by: "store" },
    ],
    scope: "all agents · tenant-A",
  },
];

type AgentGrant = {
  id: string;
  name: string;
  scope: string;
  granted: boolean;
  color: string;
};

const INITIAL_GRANTS: AgentGrant[] = [
  { id: "support", name: "support-bot", scope: "all categories", granted: true, color: "#9EFF7A" },
  { id: "tutor", name: "tutor", scope: "learning progress only", granted: true, color: "#C8A2FF" },
  { id: "recs", name: "recommendations", scope: "preferences + goals", granted: false, color: "#FF6B6B" },
  { id: "copilot", name: "copilot", scope: "facts + procedures", granted: true, color: "#7BE3FF" },
];

const STATUS_META: Record<MemoryStatus, { color: string; label: string }> = {
  approved: { color: "#9EFF7A", label: "approved" },
  corrected: { color: "#FFB36B", label: "corrected" },
  pending: { color: "#7BE3FF", label: "pending" },
  archived: { color: "#8A8F98", label: "archived" },
};

/**
 * MemoryPassport — fully interactive.
 * - Click a memory to open a provenance drawer.
 * - Toggle agent grants (grant/revoke) with live state + audit feed update.
 */
export function MemoryPassport() {
  const [memories, setMemories] = React.useState<Memory[]>(INITIAL_MEMORIES);
  const [grants, setGrants] = React.useState<AgentGrant[]>(INITIAL_GRANTS);
  const [selected, setSelected] = React.useState<Memory | null>(null);
  const [feed, setFeed] = React.useState<{ icon: string; color: string; title: string; desc: string; time: string }[]>(
    [
      { icon: "approve", color: "#9EFF7A", title: "Approved · support-bot", desc: "Preference: Prefers concise explanations", time: "2m ago" },
      { icon: "correct", color: "#FFB36B", title: "Corrected · copilot", desc: "Fact: Codes primarily in TypeScript", time: "1h ago" },
      { icon: "grant", color: "#C8A2FF", title: "Granted · tutor agent", desc: "Scope: learning progress only", time: "3h ago" },
      { icon: "resolve", color: "#FFB36B", title: "Resolved · conflict", desc: "Two sources reconciled via authority", time: "5h ago" },
      { icon: "revoke", color: "#FF6B6B", title: "Revoked · recommendations agent", desc: "Access removed by user", time: "1d ago" },
    ]
  );
  const [newMemoryPulse, setNewMemoryPulse] = React.useState(false);

  // Subscribe to memories extracted in the LiveDemo (real LLM → passport)
  useExtractedMemorySubscription((ev) => {
    const newMemory: Memory = {
      id: ev.id,
      type: ev.type.charAt(0).toUpperCase() + ev.type.slice(1) as Memory["type"],
      text: ev.text,
      status: ev.status,
      confidence: ev.confidence,
      source: ev.source,
      writtenAt: ev.writtenAt,
      provenance: ev.provenance,
      scope: ev.scope,
    };
    setMemories((prev) => [newMemory, ...prev.filter((m) => m.id !== ev.id)]);
    setFeed((prev) => [
      {
        icon: "approve",
        color: ev.conflict ? "#FFB36B" : "#9EFF7A",
        title: `${ev.conflict ? "Corrected" : "Approved"} · live-demo`,
        desc: `${ev.type}: ${ev.text.slice(0, 60)}`,
        time: "just now",
      },
      ...prev.slice(0, 7),
    ]);
    setNewMemoryPulse(true);
    setTimeout(() => setNewMemoryPulse(false), 2400);
  });

  const activeGrants = grants.filter((g) => g.granted).length;

  function toggleGrant(g: AgentGrant) {
    setGrants((prev) =>
      prev.map((x) => (x.id === g.id ? { ...x, granted: !x.granted } : x))
    );
    const now = g.granted ? "just now" : "just now";
    setFeed((prev) => [
      {
        icon: g.granted ? "revoke" : "grant",
        color: g.granted ? "#FF6B6B" : "#C8A2FF",
        title: `${g.granted ? "Revoked" : "Granted"} · ${g.name}`,
        desc: `Scope: ${g.scope}`,
        time: now,
      },
      ...prev.slice(0, 7),
    ]);
  }

  function archiveMemory(m: Memory) {
    setMemories((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, status: "archived" } : x))
    );
    setFeed((prev) => [
      {
        icon: "revoke",
        color: "#8A8F98",
        title: `Archived · ${m.id}`,
        desc: `${m.type}: ${m.text}`,
        time: "just now",
      },
      ...prev.slice(0, 7),
    ]);
    setSelected(null);
  }

  return (
    <section
      id="passport"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 h-[420px] w-[680px] rounded-full bg-violet/12 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 h-[320px] w-[480px] rounded-full bg-mem/8 blur-[120px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Memory Passport</SectionLabel>
          <SectionHeading>
            Share memory without hiding control.
            <br />
            <span className="text-ink-mute">
              Approve, inspect, correct, resolve, grant, and revoke — live.
            </span>
          </SectionHeading>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            This is a live console, not a mockup. Click a memory to inspect its
            provenance. Toggle a grant and watch the consent ledger update.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
          <PassportCard
            memories={memories}
            onSelect={setSelected}
            grants={grants}
            onToggleGrant={toggleGrant}
            activeGrants={activeGrants}
            pulse={newMemoryPulse}
          />
          <ConsentFeed feed={feed} />
        </div>

        {/* capability grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {CAPS.map((c, i) => (
            <CapabilityCell key={c.label} {...c} index={i} />
          ))}
        </div>
      </div>

      <ProvenanceDrawer
        memory={selected}
        onClose={() => setSelected(null)}
        onArchive={archiveMemory}
      />
    </section>
  );
}

const CAPS = [
  { icon: CheckCircle2, label: "Approve", desc: "memory before it's stored" },
  { icon: Eye, label: "Inspect", desc: "what each agent sees" },
  { icon: Pencil, label: "Correct", desc: "facts that drifted" },
  { icon: Scale, label: "Resolve", desc: "conflicting versions" },
  { icon: KeyRound, label: "Grant", desc: "scoped agent access" },
  { icon: ShieldOff, label: "Revoke", desc: "access in one click" },
];

function PassportCard({
  memories,
  onSelect,
  grants,
  onToggleGrant,
  activeGrants,
  pulse,
}: {
  memories: Memory[];
  onSelect: (m: Memory) => void;
  grants: AgentGrant[];
  onToggleGrant: (g: AgentGrant) => void;
  activeGrants: number;
  pulse: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative space-y-4"
    >
      {/* Passport identity card */}
      <div
        className={`relative rounded-2xl border bg-gradient-to-br from-surface to-surface-2 p-6 lg:p-7 overflow-hidden ring-inset-hairline transition-all duration-500 ${
          pulse ? "border-mem/60 glow-mem" : "border-hairline-strong"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-mem/15 border border-mem/30">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-mem" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6.5 L12 3 L20 6.5 L20 17 L12 20.5 L4 17 Z" strokeLinejoin="round" />
                <circle cx="12" cy="11.5" r="2.2" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-mute">
                Memory Passport
              </div>
              <div className="text-[15px] font-semibold text-ink">customer-123</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10.5px] font-mono text-ink-mute">tenant</div>
            <div className="text-[12px] font-mono text-ink">tenant-A</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { k: "memories", v: String(memories.length) },
            { k: "agents", v: String(grants.length) },
            { k: "grants", v: `${activeGrants} active` },
          ].map((x) => (
            <div key={x.k} className="rounded-lg border border-hairline bg-background/40 px-3 py-2">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">{x.k}</div>
              <div className="text-[14px] font-semibold text-ink tabular">{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Memories list (clickable) */}
      <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
        <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
          <span className="text-[11.5px] font-mono text-ink-mute">memories · click to inspect</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-mem">
            {pulse && <Zap className="h-3 w-3 animate-mem-pulse" />}
            {memories.length} stored
          </span>
        </div>
        <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto scroll-thin">
          {memories.map((m) => {
            const meta = STATUS_META[m.status];
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                className="group w-full text-left flex items-center justify-between gap-3 rounded-lg border border-hairline bg-background/30 px-3 py-2.5 hover:border-mem/40 hover:bg-mem/[0.04] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">{m.type}</span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-mono"
                      style={{
                        borderColor: `${meta.color}55`,
                        background: `${meta.color}1a`,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[10px] font-mono text-ink-mute/70">{m.id}</span>
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-ink truncate">{m.text}</div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-ink-mute shrink-0 group-hover:text-mem group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Grants — interactive toggle */}
      <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
        <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
          <span className="text-[11.5px] font-mono text-ink-mute">agent grants · toggle to test</span>
          <span className="text-[11px] font-mono text-mem">{activeGrants}/{grants.length}</span>
        </div>
        <div className="p-3 space-y-1.5">
          {grants.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-background/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.granted ? g.color : "#3A3D44" }} />
                  <span className="text-[12.5px] font-mono text-ink">{g.name}</span>
                </div>
                <div className="mt-0.5 text-[11px] text-ink-mute truncate">{g.scope}</div>
              </div>
              <button
                onClick={() => onToggleGrant(g)}
                role="switch"
                aria-checked={g.granted}
                aria-label={`Toggle grant for ${g.name}`}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  g.granted ? "bg-mem/80" : "bg-white/10"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#0A0B0D] transition-transform ${
                    g.granted ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const FEED_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  approve: CheckCircle2,
  correct: Pencil,
  grant: KeyRound,
  resolve: Scale,
  revoke: ShieldOff,
};

function ConsentFeed({
  feed,
}: {
  feed: { icon: string; color: string; title: string; desc: string; time: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="rounded-2xl border border-hairline bg-surface overflow-hidden lg:sticky lg:top-24"
    >
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
        <span className="text-[11.5px] font-mono text-ink-mute">activity · consent ledger</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-mem">
          <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
          live
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <ol className="relative space-y-1">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-hairline" />
          <AnimatePresence initial={false}>
            {feed.map((e, i) => {
              const Icon = FEED_ICONS[e.icon] || Clock;
              return (
                <motion.li
                  key={`${e.title}-${i}-${e.time}`}
                  initial={{ opacity: 0, x: -8, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.02]"
                >
                  <span
                    className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border shrink-0"
                    style={{
                      borderColor: `${e.color}40`,
                      background: `${e.color}1a`,
                      color: e.color,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink truncate">{e.title}</span>
                      <span className="text-[11px] font-mono text-ink-mute shrink-0">{e.time}</span>
                    </div>
                    <p className="text-[12.5px] text-ink-soft truncate">{e.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>
    </motion.div>
  );
}

function ProvenanceDrawer({
  memory,
  onClose,
  onArchive,
}: {
  memory: Memory | null;
  onClose: () => void;
  onArchive: (m: Memory) => void;
}) {
  return (
    <AnimatePresence>
      {memory && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full sm:w-[460px] bg-surface border-l border-hairline-strong overflow-y-auto scroll-thin"
            role="dialog"
            aria-label={`Memory ${memory.id} provenance`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 h-14 border-b border-hairline bg-surface/90 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-mem" />
                <span className="text-[13px] font-mono text-ink-soft">{memory.id}</span>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-mute hover:text-ink hover:bg-white/[0.05]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* memory summary */}
              <div className="rounded-xl border border-hairline bg-background/40 p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">{memory.type}</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-mono"
                    style={{
                      borderColor: `${STATUS_META[memory.status].color}55`,
                      background: `${STATUS_META[memory.status].color}1a`,
                      color: STATUS_META[memory.status].color,
                    }}
                  >
                    {STATUS_META[memory.status].label}
                  </span>
                  <span className="ml-auto text-[11px] font-mono text-ink-mute">
                    conf <span className="text-ink">{memory.confidence.toFixed(1)}</span>
                  </span>
                </div>
                <div className="mt-2 text-[15px] text-ink leading-snug">{memory.text}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <div className="text-ink-mute uppercase tracking-wider">source</div>
                    <div className="text-ink-soft">{memory.source}</div>
                  </div>
                  <div>
                    <div className="text-ink-mute uppercase tracking-wider">written</div>
                    <div className="text-ink-soft">{memory.writtenAt}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-ink-mute uppercase tracking-wider">scope</div>
                    <div className="text-ink-soft">{memory.scope}</div>
                  </div>
                </div>
              </div>

              {/* provenance chain */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-mem" />
                  <span className="text-[12px] uppercase tracking-[0.16em] text-ink-mute font-mono">
                    provenance chain
                  </span>
                </div>
                <ol className="relative space-y-1">
                  <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-mem/40 via-hairline to-transparent" />
                  {memory.provenance.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.25 }}
                      className="relative flex items-start gap-3 pl-1 py-1.5"
                    >
                      <span className="relative z-10 inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-mem/30 bg-surface text-[10px] font-mono text-mem shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="text-[13px] text-ink font-medium">{p.event}</div>
                        <div className="text-[11px] font-mono text-ink-mute">
                          {p.at} · {p.by}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
                <button
                  onClick={() => onArchive(memory)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-background/40 px-3 py-2 text-[12.5px] text-ink-soft hover:text-amber hover:border-amber/40 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Archive memory
                </button>
                <button
                  onClick={onClose}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-mem text-[#0A0B0D] px-3 py-2 text-[12.5px] font-semibold hover:bg-mem/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CapabilityCell({
  icon: Icon,
  label,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.04, duration: 0.35 }}
      className="bg-surface p-4 lg:p-5 hover:bg-surface-2/50 transition-colors group"
    >
      <Icon className="h-4.5 w-4.5 text-mem group-hover:scale-110 transition-transform" />
      <div className="mt-3 text-[13.5px] font-semibold text-ink">{label}</div>
      <div className="text-[12px] text-ink-mute leading-snug mt-0.5">{desc}</div>
    </motion.div>
  );
}
