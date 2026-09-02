"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Activity, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "./magnetic-button";

/**
 * Hero — MemoryOS
 * Communicates "governed memory for production AI agents" with a live
 * Agent → MemoryOS → Governed Context → Model visualization.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-28 lg:pt-32 pb-16 lg:pb-24 overflow-hidden noise-overlay"
    >
      {/* Background: layered gradients + grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-mem/10 blur-[140px]" />
        <div className="absolute top-32 -right-32 h-[380px] w-[380px] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute top-44 -left-32 h-[320px] w-[320px] rounded-full bg-amber/10 blur-[120px]" />
        {/* subtle radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,transparent_30%,rgba(10,11,13,0.6)_100%)]" />
      </div>

      <div className="container-page">
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="#product"
            className="group inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface/60 backdrop-blur px-3 py-1.5 text-[12.5px] text-ink-soft hover:border-mem/40 transition-colors"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
            <span className="font-medium text-ink">MemoryOS 1.0</span>
            <span className="text-ink-mute">— domain schemas, MCP server, Memory Passport</span>
            <ArrowRight className="h-3.5 w-3.5 text-ink-mute group-hover:translate-x-0.5 group-hover:text-mem transition-all" />
          </a>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-8 mx-auto max-w-5xl text-center"
        >
          <h1 className="text-balance text-[40px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.03em] font-semibold">
            Governed memory for
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient-mem">production AI agents</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-[16.5px] sm:text-[18px] leading-[1.55] text-ink-soft text-balance">
            Give every authorized agent context it can trust. MemoryOS turns
            relevant conversations, corrections, and events into current,
            attributable, prompt-ready context — without replacing your
            databases, transcripts, or models.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <MagneticButton strength={10}>
            <Button
              asChild
              size="lg"
              className="group bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-12 px-6 rounded-xl text-[15px] gap-2 shadow-[0_0_0_1px_oklch(0.92_0.17_145_/_40%),0_10px_40px_-12px_oklch(0.92_0.17_145_/_60%)] hover:shadow-[0_0_0_1px_oklch(0.92_0.17_145_/_60%),0_14px_50px_-10px_oklch(0.92_0.17_145_/_75%)] transition-shadow"
            >
              <a href="#cta">
                Try MemoryOS
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </MagneticButton>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 px-6 rounded-xl text-[15px] text-ink hover:text-white hover:bg-white/[0.06] gap-2 border border-hairline-strong bg-white/[0.02]"
          >
            <a href="#demo">
              <Play className="h-4 w-4" />
              See the live playground
            </a>
          </Button>
        </motion.div>

        {/* SDK chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12.5px] text-ink-mute"
        >
          {[
            "Python SDK",
            "TypeScript SDK",
            "REST API",
            "MCP Server",
          ].map((s, i) => (
            <React.Fragment key={s}>
              <a href="#developers" className="hover:text-mem transition-colors font-mono">
                {s}
              </a>
              {i < 3 && <span className="opacity-40">·</span>}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Hero visualization */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-14 lg:mt-20"
        >
          <MemoryGraph />
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 lg:mt-14 grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl border border-hairline bg-hairline overflow-hidden"
        >
          {[
            { icon: ShieldCheck, label: "Governed", value: "validity · provenance · consent" },
            { icon: Activity, label: "Production-ready", value: "quality gates · conflict resolution" },
            { icon: Database, label: "Complements", value: "your DB · transcripts · vector store" },
            { icon: ShieldCheck, label: "Tenant isolated", value: "scoped per user · agent · tenant" },
          ].map((s) => (
            <div key={s.label} className="bg-surface p-4">
              <div className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-mem" />
                <span className="text-[12.5px] font-medium text-ink">{s.label}</span>
              </div>
              <div className="mt-1 text-[12px] text-ink-mute font-mono">{s.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * MemoryGraph — Agent → MemoryOS → Governed Context → Model
 * A live, breathing visual: 3 agents on the left feed into a central
 * MemoryOS core that reconciles/governs memory, then emits a compact
 * context packet to a model on the right. SVG flows animate continuously.
 */
function MemoryGraph() {
  return (
    <div className="relative rounded-2xl border border-hairline-strong bg-surface/50 backdrop-blur-sm overflow-hidden ring-inset-hairline">
      {/* window chrome */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-hairline bg-surface/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="text-[11.5px] font-mono text-ink-mute">
          memoryos://live · governed-context-001
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
          <span className="text-[11px] text-mem font-mono">live</span>
        </div>
      </div>

      <div className="relative p-4 sm:p-8 lg:p-10 min-h-[420px] sm:min-h-[460px]">
        <div className="absolute inset-0 bg-dots opacity-[0.35] mask-fade-b" />
        <GraphSvg />
      </div>
    </div>
  );
}

function GraphSvg() {
  const agents = [
    { id: "support", label: "Support", y: 18, color: "#9EFF7A" },
    { id: "copilot", label: "Copilot", y: 50, color: "#FFB36B" },
    { id: "edu", label: "Tutor", y: 82, color: "#C8A2FF" },
  ];

  return (
    <svg
      viewBox="0 0 1000 460"
      className="relative w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="mem-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B6FF8C" />
          <stop offset="100%" stopColor="#5BE3A2" />
        </linearGradient>
        <linearGradient id="ink-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="core-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#9EFF7A" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#9EFF7A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#9EFF7A" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Agents (left column) */}
      {agents.map((a, i) => (
        <g key={a.id} transform={`translate(40, ${a.y * 4 + 20})`}>
          <rect
            x="0"
            y="0"
            width="150"
            height="64"
            rx="10"
            className="svg-card-fill"
            stroke="var(--hairline-strong)"
          />
          <circle cx="22" cy="32" r="9" fill={a.color} opacity="0.85" />
          <text x="44" y="26" className="svg-text-primary" fontSize="13" fontWeight="600" fontFamily="ui-sans-serif">
            {a.label}
          </text>
          <text x="44" y="44" className="svg-text-secondary" fontSize="10.5" fontFamily="ui-monospace">
            agent · tenant-A
          </text>
          <rect x="120" y="12" width="22" height="8" rx="4" fill={a.color} opacity="0.25">
            <animate
              attributeName="opacity"
              values="0.15;0.7;0.15"
              dur="2.4s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}

      {/* Flow lines: agents -> core (left) */}
      {agents.map((a, i) => {
        const y1 = a.y * 4 + 52;
        const y2 = 230;
        return (
          <path
            key={`l-${a.id}`}
            d={`M190 ${y1} C 340 ${y1}, 380 ${y2}, 470 ${y2}`}
            stroke={a.color}
            strokeWidth="1.4"
            strokeOpacity="0.45"
            fill="none"
            strokeDasharray="3 6"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-36"
              dur="1.6s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </path>
        );
      })}

      {/* Core: MemoryOS */}
      <g transform="translate(420, 150)">
        <circle cx="120" cy="80" r="120" fill="url(#core-glow)" />
        <circle
          cx="120"
          cy="80"
          r="78"
          fill="url(#mem-grad)"
          opacity="0.07"
          stroke="var(--mem)"
          strokeOpacity="0.25"
          strokeWidth="1"
          className="animate-mem-orbit-slow"
          style={{ transformOrigin: "120px 80px" }}
        />
        <circle
          cx="120"
          cy="80"
          r="58"
          fill="var(--background)"
          stroke="var(--hairline-strong)"
        />
        {/* hexagon core */}
        <g
          transform="translate(120 80) rotate(0)"
          stroke="var(--mem)"
          strokeWidth="1.4"
          fill="none"
          strokeLinejoin="round"
          opacity="0.7"
        >
          <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="22s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
        {/* text backdrop */}
        <rect x="78" y="62" width="84" height="36" rx="10" className="svg-textbackdrop-fill" opacity="0.85" />
        <text
          x="120"
          y="74"
          textAnchor="middle"
          className="svg-text-primary"
          fontSize="13"
          fontWeight="700"
          fontFamily="ui-sans-serif"
        >
          MemoryOS
        </text>
        <text
          x="120"
          y="89"
          textAnchor="middle"
          className="svg-flowline-mem"
          fontSize="8.5"
          fontFamily="ui-monospace"
          letterSpacing="0.06em"
        >
          GOVERNED CONTEXT
        </text>
      </g>

      {/* Pipeline stage ticks around core — sequential activation wave */}
      {[
        { label: "01 Ingest", x: 510, y: 110 },
        { label: "02 Extract", x: 590, y: 175 },
        { label: "03 Reconcile", x: 560, y: 250 },
        { label: "04 Govern", x: 460, y: 250 },
        { label: "05 Retrieve", x: 410, y: 175 },
      ].map((p, i) => {
        const cycleDur = 5; // seconds per full cycle
        const stageStart = i * 0.7; // staggered activation
        return (
        <g key={p.label} transform={`translate(${p.x}, ${p.y})`}>
          <rect
            x="-44"
            y="-9"
            width="88"
            height="18"
            rx="9"
            className="svg-chip-fill"
            stroke="var(--mem)"
            strokeWidth="1"
          >
            <animate
              attributeName="stroke-opacity"
              values={`0.15;0.7;0.15;0.15`}
              keyTimes={`0;${stageStart / cycleDur};${(stageStart + 0.6) / cycleDur};1`}
              dur={`${cycleDur}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              values={`1;1;0.4;1`}
              keyTimes={`0;${stageStart / cycleDur};${(stageStart + 0.3) / cycleDur};1`}
              dur={`${cycleDur}s`}
              repeatCount="indefinite"
            />
          </rect>
          <text
            x="0"
            y="4"
            textAnchor="middle"
            className="svg-flowline-mem"
            fontSize="9.5"
            fontFamily="ui-monospace"
          >
            <animate
              attributeName="opacity"
              values={`0.45;1;0.45;0.45`}
              keyTimes={`0;${stageStart / cycleDur};${(stageStart + 0.6) / cycleDur};1`}
              dur={`${cycleDur}s`}
              repeatCount="indefinite"
            />
            {p.label}
          </text>
          <circle cx="-44" cy="0" r="2.2" fill="var(--mem)">
            <animate
              attributeName="opacity"
              values={`0.2;1;0.2;0.2`}
              keyTimes={`0;${stageStart / cycleDur};${(stageStart + 0.5) / cycleDur};1`}
              dur={`${cycleDur}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`2.2;3.2;2.2;2.2`}
              keyTimes={`0;${stageStart / cycleDur};${(stageStart + 0.4) / cycleDur};1`}
              dur={`${cycleDur}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
        );
      })}

      {/* Flow lines: core -> model (right) */}
      <path
        d="M680 230 C 780 230, 820 230, 880 230"
        className="svg-flowline-mem"
        strokeWidth="1.6"
        strokeOpacity="0.7"
        fill="none"
        strokeDasharray="4 5"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-36"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>

      {/* Model card (right) */}
      <g transform="translate(810, 198)">
        <rect
          x="0"
          y="0"
          width="150"
          height="64"
          rx="10"
          className="svg-card-fill"
          stroke="var(--hairline-strong)"
        />
        <circle cx="22" cy="32" r="9" className="svg-text-primary" opacity="0.8" />
        <text x="44" y="26" className="svg-text-primary" fontSize="13" fontWeight="600" fontFamily="ui-sans-serif">
          Model
        </text>
        <text x="44" y="44" className="svg-text-secondary" fontSize="10" fontFamily="ui-monospace">
          prompt + ctx
        </text>
        <rect x="118" y="20" width="22" height="22" rx="6" className="svg-flowline-mem" opacity="0.18" />
        <text x="129" y="34" textAnchor="middle" className="svg-flowline-mem" fontSize="11" fontWeight="700">
          ✓
        </text>
      </g>

      {/* Returning arrow back to agents (subtle) */}
      <path
        d="M885 230 C 885 380, 60 380, 60 70"
        className="svg-flowline"
        strokeWidth="1"
        strokeOpacity="0.5"
        fill="none"
        strokeDasharray="2 6"
      />

      {/* Memory nodes orbiting core (decorative, contextual) */}
      {[
        { angle: 0, r: 96 },
        { angle: 60, r: 110 },
        { angle: 120, r: 96 },
        { angle: 200, r: 104 },
        { angle: 260, r: 96 },
        { angle: 320, r: 112 },
      ].map((n, i) => {
        const cx = 540 + n.r * Math.cos((n.angle * Math.PI) / 180);
        const cy = 230 + n.r * Math.sin((n.angle * Math.PI) / 180);
        return (
          <circle key={i} cx={cx} cy={cy} r="2.5" className="svg-flowline-mem" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.2;0.95;0.2"
              dur="3s"
              begin={`${i * 0.35}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </svg>
  );
}
