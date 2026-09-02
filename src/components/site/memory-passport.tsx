"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Scale,
  KeyRound,
  ShieldOff,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Memory Passport — a productized capability where users control their
 * own memory. Gets its own visual identity: a passport-style card mockup
 * + an activity feed of consents/revocations.
 */
export function MemoryPassport() {
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
              Let users approve categories, inspect grants, correct facts,
              resolve questions, and revoke agent access.
            </span>
          </SectionHeading>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
          <PassportCard />
          <ConsentFeed />
        </div>

        {/* capability grid */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {CAPS.map((c, i) => (
            <CapabilityCell key={c.label} {...c} index={i} />
          ))}
        </div>
      </div>
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

function PassportCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="relative rounded-2xl border border-hairline-strong bg-gradient-to-br from-surface to-surface-2 p-6 lg:p-7 overflow-hidden ring-inset-hairline">
        {/* passport header */}
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

        {/* identity row */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { k: "memories", v: "47" },
            { k: "agents", v: "3" },
            { k: "grants", v: "2 active" },
          ].map((x) => (
            <div key={x.k} className="rounded-lg border border-hairline bg-background/40 px-3 py-2">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">{x.k}</div>
              <div className="text-[14px] font-semibold text-ink">{x.v}</div>
            </div>
          ))}
        </div>

        {/* memory list */}
        <div className="mt-5 space-y-2">
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">
            Recent memories
          </div>
          {[
            { t: "Preference", s: "Prefers concise explanations", st: "approved", a: "9EFF7A" },
            { t: "Fact", s: "Codes primarily in TypeScript", st: "corrected", a: "FFB36B" },
            { t: "Goal", s: "Shipping B2B SaaS for Indian SMBs", st: "approved", a: "9EFF7A" },
            { t: "Fact", s: "Uses FastAPI, Postgres, Docker", st: "approved", a: "9EFF7A" },
          ].map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-background/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">{m.t}</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9.5px] font-mono"
                    style={{
                      borderColor: `#${m.a}55`,
                      background: `#${m.a}1a`,
                      color: `#${m.a}`,
                    }}
                  >
                    {m.st}
                  </span>
                </div>
                <div className="mt-0.5 text-[12.5px] text-ink truncate">{m.s}</div>
              </div>
              <Eye className="h-3.5 w-3.5 text-ink-mute shrink-0" />
            </div>
          ))}
        </div>

        {/* signature line */}
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-hairline pt-4">
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">
              issued by
            </div>
            <div className="text-[13px] font-mono text-ink-soft">memoryos://user/customer-123</div>
          </div>
          <svg viewBox="0 0 80 24" className="h-8 w-24 text-mem" fill="none">
            <path
              d="M2 20 C 12 4, 22 4, 32 16 C 38 22, 44 6, 54 14 C 62 20, 70 4, 78 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* corner chip */}
      <div className="absolute -top-2 -right-2 rounded-md border border-mem/40 bg-mem/15 px-2 py-1 text-[10.5px] font-mono text-mem">
        v1.0 · portable
      </div>
    </motion.div>
  );
}

function ConsentFeed() {
  const events = [
    { icon: CheckCircle2, color: "#9EFF7A", title: "Approved · support-bot", desc: "Preference: Prefers concise explanations", time: "2m ago" },
    { icon: Pencil, color: "#FFB36B", title: "Corrected · copilot", desc: "Fact: Codes primarily in TypeScript", time: "1h ago" },
    { icon: KeyRound, color: "#C8A2FF", title: "Granted · tutor agent", desc: "Scope: learning progress only", time: "3h ago" },
    { icon: Scale, color: "#FFB36B", title: "Resolved · conflict", desc: "Two sources reconciled via authority", time: "5h ago" },
    { icon: ShieldOff, color: "#FF6B6B", title: "Revoked · recommendations agent", desc: "Access removed by user", time: "1d ago" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="rounded-2xl border border-hairline bg-surface overflow-hidden"
    >
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
        <span className="text-[11.5px] font-mono text-ink-mute">activity · consent ledger</span>
        <Clock className="h-3.5 w-3.5 text-ink-mute" />
      </div>
      <div className="p-3 sm:p-4">
        <ol className="relative space-y-1">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-hairline" />
          {events.map((e, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
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
                <e.icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-ink truncate">{e.title}</span>
                  <span className="text-[11px] font-mono text-ink-mute shrink-0">{e.time}</span>
                </div>
                <p className="text-[12.5px] text-ink-soft truncate">{e.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
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
