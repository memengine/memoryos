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
  Sparkles,
  Zap,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, SectionHeading } from "./problem";
import { publishMemory, type ExtractedMemoryEvent } from "@/hooks/use-extracted-memory";

/** Guided, deterministic walkthrough of representative MemoryOS decisions. */

const SAMPLES = [
  {
    id: "pref",
    text: "I prefer concise explanations.",
    label: "Preference",
    memory: { memory_type: "preference", text: "Prefers concise explanations.", confidence: 9.6, evidence: "I prefer concise explanations.", conflict: false },
    governed_context: "- Communication preference: Give concise explanations.",
  },
  {
    id: "debug",
    text: "I prefer short replies while debugging, but detailed steps when learning a new framework.",
    label: "Conditional preference",
    memory: { memory_type: "preference", text: "Prefers short debugging replies and detailed learning guidance.", confidence: 9.4, evidence: "short replies while debugging, but detailed steps when learning", conflict: false },
    governed_context: "- While debugging, keep replies short.\n- When teaching a new framework, provide detailed steps.",
  },
  {
    id: "stack",
    text: "We're building a B2B SaaS for Indian SMBs using FastAPI, Postgres, and Docker.",
    label: "Stack + project fact",
    memory: { memory_type: "fact", text: "Building B2B SaaS for Indian SMBs with FastAPI, Postgres, and Docker.", confidence: 9.3, evidence: "building a B2B SaaS for Indian SMBs using FastAPI, Postgres, and Docker", conflict: false },
    governed_context: "- Project: B2B SaaS for Indian SMBs.\n- Current stack: FastAPI, Postgres, and Docker.",
  },
  {
    id: "conflict",
    text: "Actually, switch me to TypeScript — not Python anymore.",
    label: "Correction / conflict",
    memory: { memory_type: "preference", text: "Prefers TypeScript instead of Python.", confidence: 9.8, evidence: "switch me to TypeScript — not Python anymore", conflict: true, conflict_with: "Previously preferred Python" },
    governed_context: "- Current language preference: TypeScript.\n- Do not recommend Python unless explicitly requested.",
  },
  {
    id: "goal",
    text: "My goal this quarter is to ship the onboarding flow end-to-end.",
    label: "Goal",
    memory: { memory_type: "goal", text: "Ship the onboarding flow end-to-end this quarter.", confidence: 9.5, evidence: "My goal this quarter is to ship the onboarding flow end-to-end.", conflict: false },
    governed_context: "- Current-quarter goal: Ship the onboarding flow end-to-end.",
  },
] satisfies ReadonlyArray<{
  id: string;
  text: string;
  label: string;
  memory: ExtractedMemory;
  governed_context: string;
}>;

type ExtractedMemory = {
  memory_type: "preference" | "fact" | "goal" | "procedure";
  text: string;
  confidence: number;
  evidence: string;
  conflict: boolean;
  conflict_with?: string | null;
};

type TraceEntry = {
  stage: string;
  status: "done";
  detail: string;
  at: string;
};

type ApiResponse = {
  ok: boolean;
  job_id: string;
  tenant: string;
  user: string;
  input: string;
  trace: TraceEntry[];
  memory: ExtractedMemory;
  governed_context: string;
};

const STAGES = [
  { id: "ingest", label: "Ingest", icon: History, desc: "Receive the signal" },
  { id: "extract", label: "Extract", icon: Sparkles, desc: "LLM extracts memory" },
  { id: "reconcile", label: "Reconcile", icon: Scale, desc: "Detect conflicts" },
  { id: "govern", label: "Govern", icon: KeyRound, desc: "Quality + consent" },
  { id: "retrieve", label: "Retrieve", icon: Zap, desc: "Prompt-ready context" },
] as const;

export function LiveDemo() {
  const [input, setInput] = React.useState<string>(SAMPLES[0].text);
  const [activeSample, setActiveSample] = React.useState<string>(SAMPLES[0].id);
  const [doneStages, setDoneStages] = React.useState<string[]>([]);
  const [activeStage, setActiveStage] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState<ApiResponse | null>(null);
  const [sentToPassport, setSentToPassport] = React.useState(false);

  function sendToPassport() {
    if (!result) return;
    const ev: ExtractedMemoryEvent = {
      id: result.job_id,
      type: result.memory.memory_type,
      text: result.memory.text,
      confidence: result.memory.confidence,
      source: `guided-simulation · ${result.input.slice(0, 40)}`,
      status: result.memory.conflict ? "corrected" : "approved",
      conflict: result.memory.conflict,
      conflict_with: result.memory.conflict_with ?? null,
      provenance: result.trace.map((t) => ({
        event: t.stage,
        at: t.at,
        by: t.stage,
      })),
      scope: "all agents · tenant-A",
      writtenAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      fromApi: false,
    };
    publishMemory(ev);
    setSentToPassport(true);
    setTimeout(() => setSentToPassport(false), 3000);
  }

  async function run() {
    if (running || !input.trim()) return;
    setRunning(true);
    setResult(null);
    setDoneStages([]);
    setActiveStage(null);

    const sample = SAMPLES.find((candidate) => candidate.id === activeSample) ?? SAMPLES[0];
    const now = new Date();
    const details: Record<string, string> = {
      ingest: "Signal received and scoped to the example user.",
      extract: `Durable ${sample.memory.memory_type} candidate extracted from direct evidence.`,
      reconcile: sample.memory.conflict
        ? `Correction detected; supersedes “${sample.memory.conflict_with}”.`
        : "No competing active memory found.",
      govern: "Quality and scope checks passed; provenance retained.",
      retrieve: "Current memory selected and formatted as prompt-ready context.",
    };
    const trace: TraceEntry[] = [];

    for (const [index, stage] of STAGES.entries()) {
      setActiveStage(stage.id);
      await new Promise((resolve) => window.setTimeout(resolve, 380));
      trace.push({ stage: stage.id, status: "done", detail: details[stage.id], at: new Date(now.getTime() + index * 380).toISOString() });
      setDoneStages((previous) => [...previous, stage.id]);
    }

    setResult({
      ok: true,
      job_id: `sim_${sample.id}`,
      tenant: "example-tenant",
      user: "example-user",
      input: sample.text,
      trace,
      memory: sample.memory,
      governed_context: sample.governed_context,
    });
    setActiveStage(null);
    setRunning(false);
  }

  function reset() {
    setDoneStages([]);
    setActiveStage(null);
    setResult(null);
    setRunning(false);
    setSentToPassport(false);
  }

  function pickSample(s: (typeof SAMPLES)[number]) {
    setActiveSample(s.id);
    setInput(s.text);
    reset();
  }

  const ready = !!result && doneStages.length === STAGES.length;

  return (
    <section id="demo" className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-mem/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <SectionLabel>Interactive product tour</SectionLabel>
        <SectionHeading>
          From user signal —
          <br />
          <span className="text-ink-mute">to governed context.</span>
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
          Select a common memory scenario to see how MemoryOS identifies durable
          information, handles conflicts, applies controls, and prepares context
          for an agent.
        </p>

        <div className="mt-10 grid lg:grid-cols-[420px_1fr] gap-5">
          {/* Input panel */}
          <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
            <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
              <span className="text-[11.5px] font-mono text-ink-mute">
                memoryos://playground
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-mem">
                <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
                {running ? "running simulation" : "interactive · simulated"}
              </span>
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
                    disabled={running}
                    className={`w-full text-left rounded-lg border px-3.5 py-2.5 transition-colors ${
                      activeSample === s.id
                        ? "border-mem/40 bg-mem/[0.06]"
                        : "border-hairline bg-background/40 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11.5px] font-mono ${activeSample === s.id ? "text-mem" : "text-ink-soft"}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-ink-soft leading-snug truncate">
                      {s.text}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={run}
                  disabled={running || !input.trim()}
                  className="flex-1 bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-10 rounded-lg gap-1.5"
                >
                  {running ? (
                    <>
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-[#0A0B0D]/40 border-t-[#0A0B0D] animate-spin" />
                      Extracting…
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
                  disabled={running}
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
            <DecisionPath
              doneStages={doneStages}
              activeStage={activeStage}
              result={result}
            />
            <ResponsePanel
              ready={ready}
              result={result}
              sentToPassport={sentToPassport}
              onSendToPassport={sendToPassport}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DecisionPath({
  doneStages,
  activeStage,
  result,
}: {
  doneStages: string[];
  activeStage: string | null;
  result: ApiResponse | null;
}) {
  // Map the representative trace stages to the display pipeline.
  const traceByStage: Record<string, TraceEntry> = React.useMemo(() => {
    const m: Record<string, TraceEntry> = {};
    if (result) {
      result.trace.forEach((t) => {
        m[t.stage] = t;
      });
    }
    return m;
  }, [result]);

  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
        <span className="text-[11.5px] font-mono text-ink-mute">decision path · 5-stage pipeline</span>
        <span className="text-[11px] font-mono text-ink-mute">
          {result ? `${result.job_id} · representative trace` : "awaiting run"}
        </span>
      </div>
      <div className="p-5">
        {/* Pipeline grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isDone = doneStages.includes(s.id);
            const isActive = activeStage === s.id;
            return (
              <div
                key={s.id}
                className={`relative rounded-xl border p-3 transition-colors ${
                  isActive
                    ? "border-mem/50 bg-mem/[0.06]"
                    : isDone
                    ? "border-mem/30 bg-mem/[0.03]"
                    : "border-hairline bg-background/40"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${
                      isActive || isDone
                        ? "bg-mem/15 text-mem"
                        : "bg-white/[0.04] text-ink-mute"
                    }`}
                  >
                    <s.icon className="h-3 w-3" />
                  </span>
                  <div className="text-[11.5px] font-semibold text-ink">{s.label}</div>
                </div>
                <p className="mt-1.5 text-[10.5px] text-ink-mute leading-snug">{s.desc}</p>
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 right-2"
                    >
                      <Check className="h-3 w-3 text-mem" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-xl ring-1 ring-mem/30 pointer-events-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Decision log */}
        <div className="mt-5 rounded-xl border border-hairline bg-background/40 p-4 min-h-[140px]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono mb-2">
            Decision log
          </div>
          <AnimatePresence mode="popLayout">
            {!result && doneStages.length === 0 && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] text-ink-mute"
              >
                Press <span className="font-mono text-ink-soft">Run decision</span> to play the guided decision trace.
              </motion.div>
            )}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[12px] leading-[1.7] space-y-1"
              >
                {STAGES.map((s) => {
                  const t = traceByStage[s.id];
                  if (!t) return null;
                  const color =
                    s.id === "reconcile" && result.memory.conflict
                      ? "text-amber"
                      : "text-mem";
                  return (
                    <div key={s.id} className="flex gap-2">
                      <span className={`shrink-0 ${color}`}>●</span>
                      <span className="text-ink-soft">
                        <span className={color}>{t.stage}</span> · {t.detail}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ResponsePanel({
  ready,
  result,
  sentToPassport,
  onSendToPassport,
}: {
  ready: boolean;
  result: ApiResponse | null;
  sentToPassport: boolean;
  onSendToPassport: () => void;
}) {
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
            <span className="text-[11px] font-mono text-mem">system_prompt_addition</span>
          </div>
          <pre className="font-mono text-[12px] leading-relaxed text-ink-soft whitespace-pre-wrap min-h-[80px]">
{ready && result ? result.governed_context : "// run the decision to populate governed context"}
          </pre>
        </div>

        {/* Extracted memory card (only when result) */}
        {ready && result && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-mem/30 bg-mem/[0.04] p-3.5"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mem font-mono">
                extracted memory
              </span>
              <span className="text-[10.5px] font-mono text-ink-mute">
                conf <span className="text-mem">{result.memory.confidence.toFixed(1)}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10.5px] font-mono px-1.5 py-0.5 rounded border border-mem/30 bg-mem/10 text-mem">
                {result.memory.memory_type}
              </span>
              {result.memory.conflict && (
                <span className="text-[10.5px] font-mono px-1.5 py-0.5 rounded border border-amber/40 bg-amber/10 text-amber">
                  conflict · {result.memory.conflict_with}
                </span>
              )}
            </div>
            <div className="text-[13px] text-ink leading-snug">{result.memory.text}</div>
            <div className="mt-2 text-[11px] font-mono text-ink-mute">
              evidence: {result.memory.evidence.slice(0, 80)}
            </div>
          </motion.div>
        )}

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

        {/* Local preview handoff to the interactive Passport walkthrough below. */}
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-hairline"
          >
            <button
              onClick={onSendToPassport}
              disabled={sentToPassport}
              className={`group inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium transition-all ${
                sentToPassport
                  ? "border-mem/40 bg-mem/15 text-mem cursor-default"
                  : "border-hairline-strong bg-background/40 text-ink-soft hover:border-mem/40 hover:text-mem hover:bg-mem/[0.04]"
              }`}
            >
              {sentToPassport ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Added to Passport preview · scroll down to inspect
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                  Preview in Memory Passport
                </>
              )}
            </button>
            <p className="mt-2 text-[11px] font-mono text-ink-mute">
              Adds this simulated memory to the local interactive preview below.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
