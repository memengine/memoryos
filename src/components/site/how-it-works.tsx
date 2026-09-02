"use client";

import * as React from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";

/**
 * How it works — the 5-stage MemoryOS pipeline.
 * Scroll-driven pipeline. As the user scrolls, the active stage
 * advances and the central diagram reflects that stage's state change.
 */

const STAGES = [
  {
    id: "ingest",
    n: "01",
    name: "Ingest",
    desc: "Relevant conversations, corrections, and application events enter MemoryOS as raw signals.",
    detail: "Signals arrive from agents, transcripts, and your backend. Nothing is committed as memory yet — they are candidates pending decisions.",
    chips: ["messages", "corrections", "events"],
    accent: "#9EFF7A",
  },
  {
    id: "extract",
    n: "02",
    name: "Extract",
    desc: "Candidate durable state is extracted with supporting evidence.",
    detail: "MemoryOS pulls facts, preferences, goals, and procedures — each one attached to the source and the evidence that produced it.",
    chips: ["facts", "preferences", "goals", "procedures"],
    accent: "#B6FF8C",
  },
  {
    id: "reconcile",
    n: "03",
    name: "Reconcile",
    desc: "Existing claims, revisions, corrections, and conflicts are resolved.",
    detail: "When a new fact conflicts with an old one, MemoryOS uses source authority, evidence, and recency to decide — and preserves the version history.",
    chips: ["merge", "revise", "correct", "conflict"],
    accent: "#FFB36B",
  },
  {
    id: "govern",
    n: "04",
    name: "Govern",
    desc: "Validity, provenance, authority, lifecycle, and access policy are enforced.",
    detail: "Each memory is checked by quality gates, scoped to the right tenant, user, and agent boundary, and tagged with who may reuse it.",
    chips: ["quality gate", "provenance", "tenant scope", "consent"],
    accent: "#C8A2FF",
  },
  {
    id: "retrieve",
    n: "05",
    name: "Retrieve",
    desc: "Current, authorized context is returned — compact and prompt-ready.",
    detail: "Relevant memories are ranked, source-aware, and small enough to use without handing the model an unfiltered history.",
    chips: ["rank", "compact", "prompt-ready"],
    accent: "#7BE3FF",
  },
] as const;

export function HowItWorks() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.4"],
  });

  // 5 stages across scroll range
  const stageIndex = useTransform(scrollYProgress, (v) => {
    return Math.min(STAGES.length - 1, Math.floor(v * STAGES.length));
  });

  return (
    <section
      id="how"
      ref={ref}
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="02" label="how it works" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-[0.4] mask-fade-b" />
      </div>
      <div className="container-page">
        <SectionLabel>From signals to governed context</SectionLabel>
        <SectionHeading>
          Five stages. One governed context layer.
          <br />
          <span className="text-ink-mute">
            Keep your model, tools, and agent framework — MemoryOS handles the
            memory lifecycle around them.
          </span>
        </SectionHeading>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14">
          {/* Left: stage list */}
          <StageList stageIndex={stageIndex} />

          {/* Right: live diagram */}
          <StageDiagram stageIndex={stageIndex} scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

function StageList({
  stageIndex,
}: {
  stageIndex: MotionValue<number>;
}) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const unsub = stageIndex.on("change", (v) => setActive(Math.round(v)));
    return () => unsub();
  }, [stageIndex]);

  return (
    <ol className="relative">
      {/* progress rail */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-hairline" />
      <motion.div
        className="absolute left-[19px] top-2 w-px bg-mem"
        style={{ height: useTransform(stageIndex, (v) => `${(v / (STAGES.length - 1)) * 100}%`) }}
      />

      {STAGES.map((s, i) => {
        const isActive = active === i;
        return (
          <li
            key={s.id}
            className="relative pl-12 pb-8 last:pb-0 cursor-pointer"
            data-active={isActive}
          >
            {/* node */}
            <span
              className={`absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border text-[12px] font-mono transition-all duration-300 ${
                isActive
                  ? "border-mem bg-mem/15 text-mem glow-mem"
                  : "border-hairline-strong bg-surface text-ink-mute"
              }`}
            >
              {s.n}
            </span>

            <div
              className={`transition-colors duration-300 ${
                isActive ? "text-ink" : "text-ink-mute"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <h3 className={`text-[18px] font-semibold ${isActive ? "text-ink" : "text-ink-soft"}`}>
                  {s.name}
                </h3>
                <div className="flex gap-1.5 flex-wrap">
                  {s.chips.map((c) => (
                    <span
                      key={c}
                      className={`text-[10.5px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        isActive
                          ? "border-mem/30 bg-mem/10 text-mem"
                          : "border-hairline text-ink-mute"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <p
                className={`mt-1 text-[14px] leading-relaxed transition-colors ${
                  isActive ? "text-ink-soft" : "text-ink-mute"
                }`}
              >
                {s.desc}
              </p>

              {/* expandable detail when active */}
              <motion.div
                initial={false}
                animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft max-w-md">
                  {s.detail}
                </p>
              </motion.div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StageDiagram({
  stageIndex,
  scrollYProgress,
}: {
  stageIndex: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const unsub = stageIndex.on("change", (v) => setActive(Math.round(v)));
    return () => unsub();
  }, [stageIndex]);

  const activeStage = STAGES[active];

  return (
    <div className="lg:sticky lg:top-24 self-start">
      <div className="relative rounded-2xl border border-hairline-strong bg-surface/60 backdrop-blur-sm overflow-hidden ring-inset-hairline min-h-[460px]">
        {/* header */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-hairline">
          <div className="flex items-center gap-2 text-[11.5px] font-mono text-ink-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
            pipeline · stage {active + 1} / {STAGES.length}
          </div>
          <div className="text-[11.5px] font-mono text-mem">
            {activeStage.name.toLowerCase()}
          </div>
        </div>

        <div className="relative p-6 lg:p-8">
          {/* central visual */}
          <PipelineVisual activeStage={activeStage} stage={active} />

          {/* caption */}
          <div className="mt-6 rounded-xl border border-hairline bg-background/40 p-4">
            <div className="flex items-center gap-2 text-[12px] font-mono text-ink-mute">
              <span
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: activeStage.accent }}
              />
              <span>{activeStage.name}</span>
              <span className="opacity-50">·</span>
              <span>state change</span>
            </div>
            <p className="mt-2 text-[14px] text-ink leading-relaxed">
              {activeStage.detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineVisual({
  activeStage,
  stage,
}: {
  activeStage: (typeof STAGES)[number];
  stage: number;
}) {
  return (
    <svg viewBox="0 0 480 280" className="w-full h-auto" aria-hidden>
      <defs>
        <linearGradient id="pipe-flow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9EFF7A" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#9EFF7A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#9EFF7A" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* pipeline rail */}
      <line
        x1="30"
        y1="140"
        x2="450"
        y2="140"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
      />
      {/* animated fill */}
      <motion.line
        x1="30"
        y1="140"
        x2="450"
        y2="140"
        stroke="url(#pipe-flow)"
        strokeWidth="2"
        strokeDasharray="6 6"
        initial={false}
        animate={{ strokeDashoffset: stage >= 0 ? 0 : 24 }}
      />

      {/* stage nodes */}
      {STAGES.map((s, i) => {
        const x = 30 + i * ((450 - 30) / (STAGES.length - 1));
        const isDone = i < stage;
        const isActive = i === stage;
        const isFuture = i > stage;
        return (
          <g key={s.id} transform={`translate(${x}, 140)`}>
            <circle
              r={isActive ? 22 : 16}
              fill={isActive ? s.accent : isDone ? `${s.accent}22` : "#0F1115"}
              stroke={isActive || isDone ? s.accent : "rgba(255,255,255,0.18)"}
              strokeWidth={isActive ? 2 : 1.2}
              style={{ transition: "all 0.4s ease" }}
            />
            {isActive && (
              <circle r="30" fill="none" stroke={s.accent} strokeOpacity="0.4" strokeWidth="1">
                <animate attributeName="r" values="22;34;22" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            <text
              y="4"
              textAnchor="middle"
              fill={isActive ? "#0A0B0D" : isDone ? s.accent : "#8A8F98"}
              fontSize="11"
              fontWeight="700"
              fontFamily="ui-monospace"
            >
              {s.n}
            </text>
            <text
              y={isActive ? 50 : 38}
              textAnchor="middle"
              fill={isActive || isDone ? "#E6E8EC" : "#8A8F98"}
              fontSize="11.5"
              fontFamily="ui-sans-serif"
              opacity={isFuture ? 0.5 : 1}
            >
              {s.name}
            </text>
          </g>
        );
      })}

      {/* input (left) */}
      <g transform="translate(20, 30)">
        <rect x="-12" y="0" width="64" height="22" rx="6" fill="#16181D" stroke="rgba(255,255,255,0.10)" />
        <text x="20" y="14" textAnchor="middle" fill="#8A8F98" fontSize="10" fontFamily="ui-monospace">
          signal
        </text>
      </g>
      {/* output (right) */}
      <g transform="translate(420, 30)">
        <rect x="-12" y="0" width="64" height="22" rx="6" fill="#16181D" stroke={stage >= STAGES.length - 1 ? "#9EFF7A" : "rgba(255,255,255,0.10)"} />
        <text x="20" y="14" textAnchor="middle" fill={stage >= STAGES.length - 1 ? "#9EFF7A" : "#8A8F98"} fontSize="10" fontFamily="ui-monospace">
          context
        </text>
      </g>

      {/* live mini memory chips */}
      <g transform="translate(30, 220)">
        {["pref", "fact", "goal", "conflict", "scoped"].map((c, i) => {
          const on = i <= stage;
          return (
            <g key={c} transform={`translate(${i * 86}, 0)`}>
              <rect
                width="78"
                height="28"
                rx="6"
                fill="#0F1115"
                stroke={on ? activeStage.accent : "rgba(255,255,255,0.08)"}
                strokeOpacity={on ? 0.6 : 0.2}
              />
              <circle cx="12" cy="14" r="3" fill={on ? activeStage.accent : "#3A3D44"} />
              <text x="40" y="18" textAnchor="middle" fill={on ? "#E6E8EC" : "#5A5E66"} fontSize="10" fontFamily="ui-monospace">
                {c}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
