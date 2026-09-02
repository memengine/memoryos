"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, Check, ArrowDown, AlertTriangle } from "lucide-react";

/**
 * Problem section
 * Contrast "without governed memory" vs "with MemoryOS" using two
 * parallel pipelines, so the value of the product is obvious in 4 seconds.
 */
export function Problem() {
  return (
    <section id="problem" className="relative py-20 lg:py-28 border-t border-hairline">
      <div className="container-page">
        <SectionLabel>The memory problem</SectionLabel>
        <SectionHeading>
          Storage is the easy part.
          <br />
          <span className="text-ink-mute">
            Production memory must decide what is durable, what changed, which
            source to trust, what the user approved, and what context the next
            agent actually needs.
          </span>
        </SectionHeading>

        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          <WithoutCard />
          <WithCard />
        </div>

        {/* failure modes */}
        <div className="mt-12 grid md:grid-cols-3 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {FAILURE_MODES.map((f, i) => (
            <FailureCell key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAILURE_MODES = [
  {
    icon: AlertTriangle,
    title: "Durable context loss",
    desc: "A returning user repeats lasting goals, preferences, and unresolved issues because prior state was never carried forward.",
  },
  {
    icon: AlertTriangle,
    title: "Multi-agent drift",
    desc: "Support, onboarding, recommendations, and copilots each build a different picture of the same person.",
  },
  {
    icon: AlertTriangle,
    title: "Conflicting truth",
    desc: "New facts contradict old facts, but raw vector retrieval returns both — and leaves the model to guess.",
  },
];

function WithoutCard() {
  const steps = [
    "User tells agent a preference",
    "Agent responds in this session",
    "Conversation ends, transcript is stored",
    "Next session: context lost — user repeats",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-hairline bg-surface p-6 lg:p-8 overflow-hidden"
    >
      <div className="absolute top-0 right-0 h-24 w-24 bg-rose/10 blur-3xl rounded-full" />
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-rose">
          <X className="h-3 w-3" /> Without governed memory
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-hairline-strong bg-background/60 text-[12px] font-mono text-ink-mute">
              {i + 1}
            </span>
            <span className="text-[14.5px] text-ink-soft">{s}</span>
            {i < steps.length - 1 && (
              <ArrowDown className="ml-auto h-3.5 w-3.5 text-ink-mute opacity-50" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-rose/25 bg-rose/5 p-4">
        <div className="text-[11px] uppercase tracking-wider text-rose font-mono mb-1">
          Result
        </div>
        <div className="text-[14.5px] text-ink">
          Context lost. User repeats themselves. Agents contradict each other.
        </div>
      </div>
    </motion.div>
  );
}

function WithCard() {
  const steps = [
    "User tells agent a preference",
    "MemoryOS ingests the signal",
    "Extract · reconcile · govern",
    "Retrieve governed context → next call",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="relative rounded-2xl border border-mem/40 bg-surface p-6 lg:p-8 overflow-hidden glow-mem"
    >
      <div className="absolute -top-12 -right-12 h-40 w-40 bg-mem/15 blur-3xl rounded-full" />
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-mem/40 bg-mem/15 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-mem">
          <Check className="h-3 w-3" /> With MemoryOS
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-mem/40 bg-mem/10 text-[12px] font-mono text-mem">
              {i + 1}
            </span>
            <span className="text-[14.5px] text-ink">{s}</span>
            {i < steps.length - 1 && (
              <ArrowDown className="ml-auto h-3.5 w-3.5 text-mem opacity-60" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-mem/30 bg-mem/5 p-4">
        <div className="text-[11px] uppercase tracking-wider text-mem font-mono mb-1">
          Result
        </div>
        <div className="text-[14.5px] text-ink">
          Current, attributable, authorized context ready for the next model
          call. Better next interaction — every time.
        </div>
      </div>
    </motion.div>
  );
}

function FailureCell({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-surface p-5 lg:p-6"
    >
      <Icon className="h-5 w-5 text-amber" />
      <h3 className="mt-3 text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{desc}</p>
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-mem font-mono">
      <span className="h-px w-6 bg-mem/60" />
      {children}
    </div>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-4xl text-balance text-[28px] sm:text-[36px] lg:text-[44px] leading-[1.08] tracking-[-0.025em] font-semibold text-ink">
      {children}
    </h2>
  );
}
