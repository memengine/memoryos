"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Scale,
  History,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, SectionHeading } from "./problem";

/**
 * Live Memory Demo — interactive playground.
 * User picks an input → MemoryOS shows the decision path through
 * Remember / Resolve / Consent → outputs prompt-ready context.
 */
const SAMPLES = [
  {
    id: "pref",
    text: "I prefer concise explanations.",
    title: "Preference",
    confidence: 8.2,
  },
  {
    id: "debug",
    text: "I prefer short replies while debugging, but detailed steps when learning a new framework.",
    title: "Conditional preference",
    confidence: 7.6,
  },
  {
    id: "stack",
    text: "We're building a B2B SaaS for Indian SMBs using FastAPI, Postgres, and Docker.",
    title: "Stack + project fact",
    confidence: 8.8,
  },
  {
    id: "conflict",
    text: "Actually, switch me to TypeScript — not Python anymore.",
    title: "Correction / conflict",
    confidence: 9.1,
    conflict: true,
  },
] as const;

const STAGES = [
  { id: "remember", label: "Remember", icon: History, desc: "Extract durable context" },
  { id: "resolve", label: "Resolve", icon: Scale, desc: "Reconcile two sources" },
  { id: "consent", label: "Consent", icon: KeyRound, desc: "Scope portable memory" },
] as const;

type Stage = (typeof STAGES)[number]["id"];

export function LiveDemo() {
  const [active, setActive] = React.useState<(typeof SAMPLES)[number]>(SAMPLES[0]);
  const [stage, setStage] = React.useState<Stage | null>(null);
  const [running, setRunning] = React.useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    setStage(null);
    const seq: Stage[] = ["remember", "resolve", "consent"];
    let i = 0;
    const interval = setInterval(() => {
      if (i < seq.length) {
        setStage(seq[i]);
        i++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 900);
  }

  function reset() {
    setStage(null);
    setRunning(false);
  }

  function pickSample(s: (typeof SAMPLES)[number]) {
    setActive(s);
    setStage(null);
    setRunning(false);
  }

  return (
    <section id="demo" className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-mem/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <SectionLabel>Live memory demo</SectionLabel>
        <SectionHeading>
          Test the memory decision,
          <br />
          <span className="text-ink-mute">not a fake chatbot.</span>
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
          Explore extraction, conflict handling, and consent in one compact
          console. It is simulated — no account or API key required.
        </p>

        <div className="mt-10 grid lg:grid-cols-[420px_1fr] gap-5">
          {/* Input panel */}
          <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
            <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
              <span className="text-[11.5px] font-mono text-ink-mute">
                memoryos://playground
              </span>
              <span className="text-[11px] font-mono text-mem">simulated</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono">
                Choose a decision
              </div>
              <div className="space-y-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickSample(s)}
                    className={`w-full text-left rounded-lg border px-3.5 py-3 transition-colors ${
                      active.id === s.id
                        ? "border-mem/40 bg-mem/[0.06]"
                        : "border-hairline bg-background/40 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[12.5px] font-mono ${active.id === s.id ? "text-mem" : "text-ink-soft"}`}>
                        {s.title}
                      </span>
                      {s.conflict && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber/40 bg-amber/10 text-amber">
                          conflict
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[13.5px] text-ink leading-snug">
                      “{s.text}”
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={run}
                  disabled={running}
                  className="flex-1 bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-10 rounded-lg gap-1.5"
                >
                  {running ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-[#0A0B0D]/40 border-t-[#0A0B0D] animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      Run decision
                    </>
                  )}
                </Button>
                <Button
                  onClick={reset}
                  variant="ghost"
                  className="h-10 px-3 border border-hairline hover:bg-white/[0.04]"
                  aria-label="Reset"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Decision path + response */}
          <div className="space-y-5">
            <DecisionPath stage={stage} sample={active} />
            <ResponsePanel stage={stage} sample={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionPath({
  stage,
  sample,
}: {
  stage: Stage | null;
  sample: (typeof SAMPLES)[number];
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
        <span className="text-[11.5px] font-mono text-ink-mute">decision path</span>
        <span className="text-[11px] font-mono text-ink-mute">
          {sample.title.toLowerCase()}
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {STAGES.map((s) => {
            const isDone = stage === "remember" && s.id === "remember" ? true :
              stage === "resolve" ? ["remember", "resolve"].includes(s.id) :
              stage === "consent" ? true : false;
            const isActive =
              (stage === "remember" && s.id === "remember") ||
              (stage === "resolve" && s.id === "resolve") ||
              (stage === "consent" && s.id === "consent");
            return (
              <div
                key={s.id}
                className={`relative rounded-xl border p-4 transition-colors ${
                  isActive
                    ? "border-mem/50 bg-mem/[0.06]"
                    : isDone
                    ? "border-mem/30 bg-mem/[0.03]"
                    : "border-hairline bg-background/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${
                      isActive || isDone
                        ? "bg-mem/15 text-mem"
                        : "bg-white/[0.04] text-ink-mute"
                    }`}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="text-[13px] font-semibold text-ink">{s.label}</div>
                </div>
                <p className="mt-2 text-[12px] text-ink-mute leading-snug">{s.desc}</p>

                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-3 right-3"
                    >
                      <Check className="h-3.5 w-3.5 text-mem" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Decision timeline */}
        <div className="mt-5 rounded-xl border border-hairline bg-background/40 p-4 min-h-[120px]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono mb-2">
            Decision log
          </div>
          <AnimatePresence mode="popLayout">
            {stage === null && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] text-ink-mute"
              >
                Press <span className="font-mono text-ink-soft">Run decision</span> to see MemoryOS process this input.
              </motion.div>
            )}
            {stage === "remember" && (
              <motion.div
                key="r"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[12.5px] text-ink-soft"
              >
                <span className="text-mem">extract</span> · {sample.title.toLowerCase()} → candidate memory
                <br />
                <span className="text-ink-mute">evidence:</span> conversation · user-supplied · confidence {sample.confidence}
              </motion.div>
            )}
            {stage === "resolve" && (
              <motion.div
                key="resolve"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[12.5px] text-ink-soft"
              >
                {sample.conflict ? (
                  <>
                    <span className="text-amber">conflict</span> · existing “codes in Python” ↔ new “switch to TypeScript”
                    <br />
                    <span className="text-ink-mute">decision:</span> revise · preserve version history
                  </>
                ) : (
                  <>
                    <span className="text-mem">reconcile</span> · no conflict — merges into existing user state
                    <br />
                    <span className="text-ink-mute">source authority:</span> user · recency: now
                  </>
                )}
              </motion.div>
            )}
            {stage === "consent" && (
              <motion.div
                key="consent"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[12.5px] text-ink-soft"
              >
                <span className="text-violet">govern</span> · tenant: tenant-A · user: customer-123 · scope: this agent
                <br />
                <span className="text-ink-mute">consent:</span> granted · lifecycle: active · provenance: recorded
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ResponsePanel({
  stage,
  sample,
}: {
  stage: Stage | null;
  sample: (typeof SAMPLES)[number];
}) {
  const ready = stage === "consent";
  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
        <span className="text-[11.5px] font-mono text-ink-mute">memory response</span>
        <span className={`text-[11px] font-mono ${ready ? "text-mem" : "text-ink-mute"}`}>
          {ready ? "ready · prompt-ready" : "awaiting decision"}
        </span>
      </div>
      <div className="p-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono mb-2">
          Relevant context, ready for the model
        </div>
        <div className="rounded-xl border border-hairline bg-background/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-ink-mute">output</span>
            <span className="text-[11px] font-mono text-ink-mute">·</span>
            <span className="text-[11px] font-mono text-mem">prompt_addition</span>
          </div>
          <pre className="font-mono text-[12.5px] leading-relaxed text-ink-soft whitespace-pre-wrap">
{ready ? renderContext(sample) : "// run the decision to populate context"}
          </pre>
        </div>

        {/* tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "retrieved", on: ready },
            { label: "ranked", on: ready },
            { label: "fresh", on: ready },
            { label: "consented", on: ready },
          ].map((t) => (
            <span
              key={t.label}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10.5px] font-mono transition-colors ${
                t.on
                  ? "border-mem/30 bg-mem/10 text-mem"
                  : "border-hairline text-ink-mute"
              }`}
            >
              {t.on ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-60" />}
              {t.label}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-mono text-ink-mute">
            <ShieldCheck className="h-3 w-3" /> governed
          </span>
        </div>
      </div>
    </div>
  );
}

function renderContext(sample: (typeof SAMPLES)[number]) {
  const map: Record<string, string> = {
    pref: `<memory>
  <item type="preference" confidence="8.2">
    Prefers concise explanations.
  </item>
</memory>`,
    debug: `<memory>
  <item type="preference" condition="debugging" conf="7.6">
    Short replies while debugging.
  </item>
  <item type="preference" condition="learning" conf="7.6">
    Detailed steps when learning a new framework.
  </item>
</memory>`,
    stack: `<memory>
  <item type="project" conf="8.8">
    B2B SaaS for Indian SMBs.
    Stack: FastAPI, Postgres, Docker.
  </item>
</memory>`,
    conflict: `<memory>
  <item type="fact" conf="9.1" revised="true">
    Codes primarily in TypeScript.
  </item>
  <item type="history" superseded="true">
    Previously coded in Python.
  </item>
</memory>`,
  };
  return map[sample.id];
}
