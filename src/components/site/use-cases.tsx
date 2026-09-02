"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Headset,
  GraduationCap,
  Network,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Use Cases — each card has its own visual identity, not a generic grid.
 */
export function UseCases() {
  return (
    <section id="use-cases" className="relative py-20 lg:py-28 border-t border-hairline">
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Built around real workflows</SectionLabel>
          <SectionHeading>
            Context shaped for the product it serves.
          </SectionHeading>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          <SupportCard />
          <EducationCard />
          <PassportUseCaseCard />
          <MultiAgentCard />
        </div>
      </div>
    </section>
  );
}

function CardShell({
  accent,
  children,
  className,
}: {
  accent: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl border border-hairline-strong bg-surface overflow-hidden ring-inset-hairline ${className ?? ""}`}
    >
      <div
        className="absolute -top-px left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}

function CardHead({
  icon: Icon,
  eyebrow,
  title,
  accent,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  accent: string;
  desc: string;
}) {
  return (
    <div className="p-6 lg:p-7">
      <div className="flex items-start justify-between">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}1f`,
            color: accent,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className="text-[10.5px] font-mono uppercase tracking-wider px-2 py-1 rounded border"
          style={{
            borderColor: `${accent}40`,
            color: accent,
            background: `${accent}12`,
          }}
        >
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}

function SupportCard() {
  return (
    <CardShell accent="#9EFF7A">
      <CardHead
        icon={Headset}
        eyebrow="Customer Support"
        accent="#9EFF7A"
        title="Pick up where the last ticket ended."
        desc="Remember open issues, account context, sentiment risk, communication preferences, and resolution history — across channels and over time."
      />
      <div className="px-6 lg:px-7 pb-6 lg:pb-7">
        <div className="rounded-xl border border-hairline bg-background/40 p-3 space-y-2">
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">
            customer-123 · last 30 days
          </div>
          {[
            { k: "open issue", v: "billing discrepancy · $240", c: "#FFB36B" },
            { k: "preference", v: "prefers email · 9-5 ET", c: "#9EFF7A" },
            { k: "sentiment", v: "elevated risk · last 3 tickets", c: "#FF6B6B" },
            { k: "resolution", v: "refund issued 2025-11-12", c: "#7BE3FF" },
          ].map((r) => (
            <div key={r.k} className="flex items-center gap-2.5 rounded-md bg-white/[0.02] px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.c }} />
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-mute w-24 shrink-0">{r.k}</span>
              <span className="text-[12.5px] text-ink-soft truncate">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

function EducationCard() {
  return (
    <CardShell accent="#C8A2FF">
      <CardHead
        icon={GraduationCap}
        eyebrow="Education"
        accent="#C8A2FF"
        title="Teach the learner you already know."
        desc="Carry weak topics, exam context, learning style, language comfort, and progress signals into every session."
      />
      <div className="px-6 lg:px-7 pb-6 lg:pb-7">
        <div className="rounded-xl border border-hairline bg-background/40 p-3.5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-ink-mute">
              learner progress
            </span>
            <span className="text-[11px] font-mono text-violet">12 memories</span>
          </div>
          <div className="space-y-2.5">
            {[
              { t: "Calculus · integration by parts", p: 64 },
              { t: "Reading comprehension", p: 82 },
              { t: "Spanish · past tense", p: 41 },
            ].map((s) => (
              <div key={s.t}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-soft truncate">{s.t}</span>
                  <span className="font-mono text-ink-mute shrink-0">{s.p}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.p}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #C8A2FF, #B6FF8C)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function PassportUseCaseCard() {
  return (
    <CardShell accent="#7BE3FF">
      <CardHead
        icon={Bot}
        eyebrow="Memory Passport"
        accent="#7BE3FF"
        title="Share memory without hiding control."
        desc="Let users approve categories, inspect grants, correct facts, resolve questions, and revoke agent access — at any time."
      />
      <div className="px-6 lg:px-7 pb-6 lg:pb-7">
        <div className="rounded-xl border border-hairline bg-background/40 p-3.5">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { k: "approved", v: "34" },
              { k: "revoked", v: "2" },
              { k: "agents", v: "3" },
            ].map((x) => (
              <div key={x.k} className="rounded-md bg-white/[0.03] px-2.5 py-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink-mute">{x.k}</div>
                <div className="text-[15px] font-semibold text-ink">{x.v}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {[
              { a: "support-bot", s: "granted · all categories", c: "#9EFF7A" },
              { a: "tutor", s: "granted · learning only", c: "#9EFF7A" },
              { a: "recommendations", s: "revoked", c: "#FF6B6B" },
            ].map((g) => (
              <div key={g.a} className="flex items-center gap-2 rounded-md bg-white/[0.02] px-2.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.c }} />
                <span className="text-[12px] font-mono text-ink-soft">{g.a}</span>
                <span className="ml-auto text-[11.5px] text-ink-mute">{g.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function MultiAgentCard() {
  return (
    <CardShell accent="#FFB36B">
      <CardHead
        icon={Network}
        eyebrow="Multi-agent systems"
        accent="#FFB36B"
        title="One governed picture of the same person."
        desc="Support, onboarding, recommendations, and copilots each build a different picture of the same person. MemoryOS reconciles them."
      />
      <div className="px-6 lg:px-7 pb-6 lg:pb-7">
        <svg viewBox="0 0 360 140" className="w-full" aria-hidden>
          <defs>
            <linearGradient id="multi-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFB36B" />
              <stop offset="100%" stopColor="#9EFF7A" />
            </linearGradient>
          </defs>
          {/* left agents */}
          {[
            { y: 20, label: "support", c: "#9EFF7A" },
            { y: 65, label: "copilot", c: "#C8A2FF" },
            { y: 110, label: "tutor", c: "#7BE3FF" },
          ].map((a) => (
            <g key={a.label} transform={`translate(8, ${a.y})`}>
              <rect width="80" height="22" rx="5" fill="#16181D" stroke="rgba(255,255,255,0.10)" />
              <circle cx="11" cy="11" r="4" fill={a.c} />
              <text x="22" y="15" fill="#E6E8EC" fontSize="10.5" fontFamily="ui-monospace">{a.label}</text>
            </g>
          ))}

          {/* arrows */}
          {[30, 75, 120].map((y, i) => (
            <path
              key={i}
              d={`M88 ${y+11} C 130 ${y+11}, 150 70, 180 70`}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3 4"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* core */}
          <g transform="translate(180, 50)">
            <rect width="100" height="40" rx="8" fill="#16181D" stroke="url(#multi-grad)" strokeWidth="1.4" />
            <text x="50" y="17" textAnchor="middle" fill="#E6E8EC" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif">MemoryOS</text>
            <text x="50" y="31" textAnchor="middle" fill="#9EFF7A" fontSize="9" fontFamily="ui-monospace">reconcile · govern</text>
          </g>

          {/* output */}
          <g transform="translate(290, 50)">
            <rect width="62" height="40" rx="8" fill="#16181D" stroke="rgba(255,255,255,0.10)" />
            <text x="31" y="17" textAnchor="middle" fill="#E6E8EC" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif">Model</text>
            <text x="31" y="31" textAnchor="middle" fill="#FFB36B" fontSize="9" fontFamily="ui-monospace">shared ctx</text>
          </g>
          <path d="M280 70 L 290 70" stroke="url(#multi-grad)" strokeWidth="1.6" fill="none" strokeDasharray="3 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.2s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      <a href="#cta" className="group flex items-center justify-between gap-2 px-6 lg:px-7 py-4 border-t border-hairline bg-surface-2/30 hover:bg-surface-2/60 transition-colors">
        <span className="text-[12.5px] font-mono text-ink-mute group-hover:text-ink-soft">explore use case</span>
        <ArrowUpRight className="h-4 w-4 text-ink-mute group-hover:text-mem transition-colors" />
      </a>
    </CardShell>
  );
}
