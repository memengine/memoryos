"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Database,
  MessageSquare,
  Search,
  FileText,
  Bot,
  Cpu,
  Wrench,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";

/**
 * Architecture — a detailed system diagram showing how MemoryOS sits inside
 * a real production AI stack. Investor/buyer-facing. Shows the request flow:
 * user → app → agent → MemoryOS (govern) → model → response.
 */
export function Architecture() {
  return (
    <section
      id="architecture"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="07" label="architecture" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[420px] w-[820px] rounded-full bg-mem/8 blur-[160px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Architecture</SectionLabel>
          <SectionHeading>
            Where MemoryOS sits in your stack.
            <br />
            <span className="text-ink-mute">
              One govern layer between your agent and your model.
            </span>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            MemoryOS does not replace your databases, transcripts, vector store,
            or tools. It sits beside them — ingesting signals, governing state,
            and returning compact context before the next model call. Your
            application keeps full responsibility for business data, actions,
            and final responses.
          </p>
        </div>

        <ArchitectureDiagram />

        {/* legend */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-mono text-ink-mute">
          <LegendItem color="#9EFF7A" label="MemoryOS govern layer" />
          <LegendItem color="#7BE3FF" label="Your existing systems" />
          <LegendItem color="#8A8F98" label="Signal / data flow" />
        </div>
      </div>
    </section>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function ArchitectureDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mt-12 rounded-2xl border border-hairline-strong bg-surface/60 backdrop-blur-sm overflow-hidden ring-inset-hairline"
    >
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
        <span className="text-[11.5px] font-mono text-ink-mute">
          production stack · request flow
        </span>
        <span className="text-[11px] font-mono text-mem">governed path</span>
      </div>

      <div className="p-5 lg:p-8">
        {/* SVG flow diagram */}
        <ArchFlow />

        {/* annotated steps below */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((s, i) => (
            <StepBox key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "App receives user input",
    desc: "Your application handles the request. Existing systems (DB, transcript, tools) stay where they are.",
    accent: "#7BE3FF",
  },
  {
    n: "02",
    title: "Agent calls add() / get()",
    desc: "On the way in: add() the conversation signal. Before the model call: get() governed context.",
    accent: "#9EFF7A",
  },
  {
    n: "03",
    title: "MemoryOS governs state",
    desc: "Extract · reconcile · govern. Quality gates, tenant isolation, provenance, and consent enforced.",
    accent: "#9EFF7A",
  },
  {
    n: "04",
    title: "Model gets compact context",
    desc: "system_prompt_addition attached. Model responds. App owns the final response and any actions.",
    accent: "#7BE3FF",
  },
];

function StepBox({
  n,
  title,
  desc,
  accent,
  index,
}: {
  n: string;
  title: string;
  desc: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-xl border border-hairline bg-background/40 p-4"
      style={{ borderLeftColor: `${accent}66`, borderLeftWidth: 2 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-[11px] font-mono font-semibold"
          style={{ color: accent }}
        >
          {n}
        </span>
        <span className="text-[13px] font-semibold text-ink">{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed text-ink-soft">{desc}</p>
    </motion.div>
  );
}

function ArchFlow() {
  return (
    <svg
      viewBox="0 0 1000 360"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="mem-arch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B6FF8C" />
          <stop offset="100%" stopColor="#5BE3A2" />
        </linearGradient>
        <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7BE3FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#9EFF7A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7BE3FF" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Left: User → App → Agent (existing systems) */}
      <g transform="translate(20, 40)">
        <ArchBox x={0} y={0} w={120} h={48} label="User" sub="request" color="#7BE3FF" />
        <ArchBox x={0} y={84} w={120} h={48} label="Application" sub="your backend" color="#7BE3FF" />
        <ArchBox x={0} y={168} w={120} h={48} label="Agent" sub="your loop" color="#7BE3FF" />
        {/* vertical arrows */}
        <FlowArrow x1={60} y1={48} x2={60} y2={84} />
        <FlowArrow x1={60} y1={132} x2={60} y2={168} />
      </g>

      {/* existing systems (bottom-left, muted) */}
      <g transform="translate(20, 250)">
        <text x={0} y={-6} fill="#8A8F98" fontSize="9.5" fontFamily="ui-monospace" letterSpacing="0.1em">
          EXISTING SYSTEMS (untouched)
        </text>
        <ArchBoxMini x={0} y={4} label="App DB" icon="db" />
        <ArchBoxMini x={88} y={4} label="Transcripts" icon="msg" />
        <ArchBoxMini x={184} y={4} label="Vector" icon="search" />
        <ArchBoxMini x={272} y={4} label="Tools" icon="tool" />
      </g>

      {/* Center: MemoryOS govern layer (highlighted) */}
      <g transform="translate(340, 60)">
        {/* glow */}
        <rect x="-6" y="-6" width="312" height="252" rx="16" fill="url(#mem-arch)" opacity="0.06" />
        <rect
          x="0"
          y="0"
          width="300"
          height="240"
          rx="12"
          fill="#0F1115"
          stroke="#9EFF7A"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        {/* top accent line */}
        <rect x="0" y="0" width="300" height="2" rx="1" fill="url(#mem-arch)" opacity="0.8" />

        {/* header */}
        <g transform="translate(150, 24)">
          <circle cx="0" cy="0" r="6" fill="#9EFF7A" />
          <text x="0" y="22" textAnchor="middle" fill="#F4F6F8" fontSize="14" fontWeight="700" fontFamily="ui-sans-serif">
            MemoryOS
          </text>
          <text x="0" y="37" textAnchor="middle" fill="#9EFF7A" fontSize="9" fontFamily="ui-monospace" letterSpacing="0.08em">
            GOVERN LAYER
          </text>
        </g>

        {/* 5 stage chips */}
        {["ingest", "extract", "reconcile", "govern", "retrieve"].map((s, i) => {
          const x = 18 + (i % 3) * 92;
          const y = 90 + Math.floor(i / 3) * 40;
          return (
            <g key={s} transform={`translate(${x}, ${y})`}>
              <rect width="80" height="28" rx="6" fill="#16181D" stroke="#9EFF7A" strokeOpacity="0.3" />
              <circle cx="12" cy="14" r="3" fill="#9EFF7A" />
              <text x="44" y="18" textAnchor="middle" fill="#E6E8EC" fontSize="10" fontFamily="ui-monospace">
                {s}
              </text>
            </g>
          );
        })}

        {/* footer note */}
        <text x="150" y="222" textAnchor="middle" fill="#8A8F98" fontSize="8.5" fontFamily="ui-monospace">
          quality · provenance · tenant · consent
        </text>
      </g>

      {/* flow arrows: agent → MemoryOS */}
      <path
        d="M140 208 C 220 208, 260 180, 340 180"
        stroke="url(#flow-grad)"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="4 5"
      >
        <animate attributeName="stroke-dashoffset" values="0;-36" dur="1.4s" repeatCount="indefinite" />
      </path>
      <text x="220" y="196" fill="#9EFF7A" fontSize="9" fontFamily="ui-monospace">add()</text>

      {/* flow arrows: MemoryOS → model */}
      <path
        d="M640 180 C 720 180, 760 208, 840 208"
        stroke="url(#flow-grad)"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="4 5"
      >
        <animate attributeName="stroke-dashoffset" values="0;-36" dur="1.4s" repeatCount="indefinite" />
      </path>
      <text x="720" y="196" fill="#9EFF7A" fontSize="9" fontFamily="ui-monospace">get() → ctx</text>

      {/* Right: Model → Response → User */}
      <g transform="translate(840, 40)">
        <ArchBox x={0} y={0} w={120} h={48} label="Model" sub="prompt + ctx" color="#7BE3FF" />
        <ArchBox x={0} y={84} w={120} h={48} label="App" sub="final response" color="#7BE3FF" />
        <ArchBox x={0} y={168} w={120} h={48} label="User" sub="response" color="#7BE3FF" />
        <FlowArrow x1={60} y1={48} x2={60} y2={84} />
        <FlowArrow x1={60} y1={132} x2={60} y2={168} />
      </g>

      {/* loop-back arrow (response → agent learns) */}
      <path
        d="M900 28 C 940 380, 60 380, 60 240"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2 6"
      />
      <text x="500" y="372" textAnchor="middle" fill="#5A5E66" fontSize="8.5" fontFamily="ui-monospace">
        agent learns · next call carries governed context
      </text>
    </svg>
  );
}

function ArchBox({
  x,
  y,
  w,
  h,
  label,
  sub,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={w} height={h} rx="8" fill="#16181D" stroke={`${color}40`} />
      <circle cx="14" cy={h / 2} r="4" fill={color} opacity="0.8" />
      <text x="28" y={h / 2 - 2} fill="#E6E8EC" fontSize="11" fontWeight="600" fontFamily="ui-sans-serif">
        {label}
      </text>
      <text x="28" y={h / 2 + 11} fill="#8A8F98" fontSize="8.5" fontFamily="ui-monospace">
        {sub}
      </text>
    </g>
  );
}

function ArchBoxMini({
  x,
  y,
  label,
  icon,
}: {
  x: number;
  y: number;
  label: string;
  icon: "db" | "msg" | "search" | "tool";
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="78" height="28" rx="6" fill="#16181D" stroke="rgba(255,255,255,0.08)" />
      <circle cx="12" cy="14" r="3" fill="#5A5E66" />
      <text x="44" y="18" textAnchor="middle" fill="#8A8F98" fontSize="9.5" fontFamily="ui-monospace">
        {label}
      </text>
    </g>
  );
}

function FlowArrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        strokeDasharray="3 4"
      >
        <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.4s" repeatCount="indefinite" />
      </line>
      <polygon
        points={`${x2 - 3},${y2 - 5} ${x2 + 3},${y2 - 5} ${x2},${y2}`}
        fill="rgba(255,255,255,0.3)"
      />
    </g>
  );
}
