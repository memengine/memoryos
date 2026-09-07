"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Database, Users, TrendingUp } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { AnimatedCounter } from "./animated-counter";

/**
 * Metrics — a real-time-looking operations dashboard.
 * Shows the shape of a production MemoryOS deployment: ops/min, p95 latency,
 * active tenants, memory growth. Communicates "this is real infra, at scale".
 * Numbers are illustrative (design-partner shape), but the visualization is
 * alive — a sparkline ticks and the counters animate on scroll.
 */
export function Metrics() {
  return (
    <section
      id="metrics"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[380px] w-[760px] rounded-full bg-mem/8 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Production at a glance</SectionLabel>
          <SectionHeading>
            Built for the shape of
            <br />
            <span className="text-ink-mute">real agent workloads.</span>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            These are the numbers that matter when memory is in the hot path
            of every model call. Illustrative — based on design-partner
            deployment shapes.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          <OpsPanel />
          <StatCards />
        </div>
      </div>
    </section>
  );
}

function OpsPanel() {
  // Generate a live-ish sparkline that ticks every 1.2s
  const [points, setPoints] = React.useState<number[]>(INITIAL_POINTS);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        // random walk with slight upward bias
        const delta = (Math.random() - 0.42) * 18;
        next.push(Math.max(10, Math.min(90, last + delta)));
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 600;
  const h = 160;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 20) - 10;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const current = points[points.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-hairline-strong bg-surface overflow-hidden ring-inset-hairline"
    >
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/40">
        <span className="text-[11.5px] font-mono text-ink-mute">
          memory operations / min · last 40 ticks
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-mem">
          <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
          live
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-end gap-3 mb-4">
          <span className="text-[34px] font-semibold tracking-tight text-ink tabular">
            {Math.round(current * 12).toLocaleString()}
          </span>
          <span className="text-[12px] font-mono text-ink-mute mb-1.5">ops/min</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[12px] font-mono text-mem">
            <TrendingUp className="h-3 w-3" />
            +12.4%
          </span>
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--mem)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--mem)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* grid lines */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1="0"
              y1={h * g}
              x2={w}
              y2={h * g}
              stroke="var(--hairline)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}
          <path d={area} fill="url(#spark-fill)" />
          <motion.path
            d={path}
            fill="none"
            stroke="var(--mem)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ d: path }}
            transition={{ duration: 0.8, ease: "linear" }}
          />
          {/* current point */}
          <circle
            cx={w}
            cy={h - ((current - min) / range) * (h - 20) - 10}
            r="3.5"
            fill="var(--mem)"
          >
            <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] font-mono">
          <div>
            <div className="text-ink-mute uppercase tracking-wider">p50</div>
            <div className="text-ink mt-0.5">42ms</div>
          </div>
          <div>
            <div className="text-ink-mute uppercase tracking-wider">p95</div>
            <div className="text-ink mt-0.5">118ms</div>
          </div>
          <div>
            <div className="text-ink-mute uppercase tracking-wider">p99</div>
            <div className="text-ink mt-0.5">204ms</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Stable initial data keeps the server and first client render identical.
const INITIAL_POINTS = Array.from(
  { length: 40 },
  (_, index) => 52 + Math.sin(index * 0.72) * 13 + Math.cos(index * 0.31) * 7,
);

const STATS = [
  { icon: Zap, value: 118, suffix: "ms", label: "p95 retrieval latency", accent: "#9EFF7A" },
  { icon: Database, value: 4.2, decimals: 1, suffix: "M", label: "memories under governance", accent: "#7BE3FF" },
  { icon: Users, value: 312, suffix: "", label: "active tenants", accent: "#C8A2FF" },
  { icon: Activity, value: 99.97, decimals: 2, suffix: "%", label: "uptime (90d)", accent: "#9EFF7A" },
];

function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="rounded-xl border border-hairline bg-surface p-4 lg:p-5"
          style={{ borderTopColor: `${s.accent}55`, borderTopWidth: 2 }}
        >
          <s.icon className="h-4 w-4" style={{ color: s.accent }} />
          <div className="mt-3 text-[26px] font-semibold tracking-tight text-ink tabular">
            <AnimatedCounter
              value={s.value}
              decimals={s.decimals || 0}
              suffix={s.suffix}
            />
          </div>
          <div className="mt-1 text-[11.5px] text-ink-mute leading-snug">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
