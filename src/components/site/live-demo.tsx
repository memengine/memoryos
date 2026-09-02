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
  AlertCircle,
  Sparkles,
  Zap,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";
import { publishMemory, type ExtractedMemoryEvent } from "@/hooks/use-extracted-memory";

/**
 * Live Memory Demo — now backed by a REAL LLM via /api/memory/extract.
 * User picks a sample OR types their own input → MemoryOS calls the real
 * extraction API → stages animate with real data → governed context emitted.
 */

const SAMPLES = [
  {
    id: "pref",
    text: "I prefer concise explanations.",
    label: "Preference",
  },
  {
    id: "debug",
    text: "I prefer short replies while debugging, but detailed steps when learning a new framework.",
    label: "Conditional preference",
  },
  {
    id: "stack",
    text: "We're building a B2B SaaS for Indian SMBs using FastAPI, Postgres, and Docker.",
    label: "Stack + project fact",
  },
  {
    id: "conflict",
    text: "Actually, switch me to TypeScript — not Python anymore.",
    label: "Correction / conflict",
  },
  {
    id: "goal",
    text: "My goal this quarter is to ship the onboarding flow end-to-end.",
    label: "Goal",
  },
];

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
  latency_ms: number;
  error?: string;
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
  const [error, setError] = React.useState<string | null>(null);
  const [sentToPassport, setSentToPassport] = React.useState(false);

  function sendToPassport() {
    if (!result) return;
    const ev: ExtractedMemoryEvent = {
      id: result.job_id,
      type: result.memory.memory_type,
      text: result.memory.text,
      confidence: result.memory.confidence,
      source: `live-demo · ${result.input.slice(0, 40)}`,
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
      fromApi: true,
    };
    publishMemory(ev);
    setSentToPassport(true);
    setTimeout(() => setSentToPassport(false), 3000);
  }

  async function run() {
    if (running || !input.trim()) return;
    setRunning(true);
    setError(null);
    setResult(null);
    setDoneStages([]);
    setActiveStage(null);

    // Live trace buffer for the decision log
    const trace: { stage: string; status: "done"; detail: string; at: string }[] = [];
    let streamError: string | null = null;

    try {
      const res = await fetch("/api/memory/extract-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Read SSE stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse complete SSE events (separated by \n\n)
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);
          let data: any;
          try {
            data = JSON.parse(json);
          } catch {
            continue; // ignore parse errors on partial chunks
          }
          if (data.type === "stage") {
            // Highlight the stage as active briefly, then mark done
            setActiveStage(data.stage);
            setTimeout(() => {
              setDoneStages((prev) =>
                prev.includes(data.stage) ? prev : [...prev, data.stage]
              );
              setActiveStage((cur) => (cur === data.stage ? null : cur));
            }, 200);
            trace.push({
              stage: data.stage,
              status: "done",
              detail: data.detail,
              at: data.at,
            });
          } else if (data.type === "result") {
            const apiResult: ApiResponse = {
              ok: true,
              job_id: data.job_id,
              tenant: data.tenant,
              user: data.user,
              input: data.input,
              trace,
              memory: data.memory,
              governed_context: data.governed_context,
              latency_ms: data.latency_ms,
            };
            setResult(apiResult);
            // Ensure all stages are marked done
            setDoneStages(STAGES.map((s) => s.id));
            setActiveStage(null);
          } else if (data.type === "error") {
            streamError = data.message;
          }
        }
      }
      if (streamError) throw new Error(streamError);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setDoneStages([]);
    setActiveStage(null);
    setResult(null);
    setError(null);
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
      <SectionNumber n="03" label="live demo" className="top-24" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-mem/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <SectionLabel>Live memory demo</SectionLabel>
        <SectionHeading>
          Test the memory decision —
          <br />
          <span className="text-ink-mute">powered by a real LLM.</span>
        </SectionHeading>
        <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
          Pick a sample or type your own input. MemoryOS calls a real
          extraction model, runs the governance pipeline, and returns
          prompt-ready governed context. No fake mockups.
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
                {running ? "streaming · sse" : "live · llm-backed"}
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

              {/* Custom input */}
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-ink-mute font-mono mb-1.5">
                  or type your own
                </div>
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setActiveSample("custom");
                  }}
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-hairline bg-background/40 px-3 py-2.5 text-[13px] text-ink placeholder:text-ink-mute/60 focus:outline-none focus:border-mem/40 focus:bg-background/60 transition-colors scroll-thin"
                  placeholder="Tell the agent something it should remember…"
                />
                <div className="mt-1 flex justify-end text-[10.5px] font-mono text-ink-mute">
                  {input.length}/500
                </div>
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
              error={error}
              input={input}
            />
            <ResponsePanel
              ready={ready}
              result={result}
              error={error}
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
  error,
  input,
}: {
  doneStages: string[];
  activeStage: string | null;
  result: ApiResponse | null;
  error: string | null;
  input: string;
}) {
  // Map API trace stages to our display stages
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
          {result ? `${result.job_id} · ${result.latency_ms}ms` : "awaiting run"}
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
            {!result && !error && doneStages.length === 0 && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] text-ink-mute"
              >
                Press <span className="font-mono text-ink-soft">Run decision</span> to call the real extraction model.
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[12.5px] text-rose"
              >
                <AlertCircle className="inline h-3.5 w-3.5 mr-1" />
                <span className="text-rose">error</span> · {error}
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
  error,
  sentToPassport,
  onSendToPassport,
}: {
  ready: boolean;
  result: ApiResponse | null;
  error: string | null;
  sentToPassport: boolean;
  onSendToPassport: () => void;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
      <div className="px-4 h-10 flex items-center justify-between border-b border-hairline bg-surface-2/50">
        <span className="text-[11.5px] font-mono text-ink-mute">memory response</span>
        <span className={`text-[11px] font-mono ${ready ? "text-mem" : error ? "text-rose" : "text-ink-mute"}`}>
          {ready ? "ready · prompt-ready" : error ? "failed" : "awaiting decision"}
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

        {/* Send to Memory Passport — real persistence flow */}
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
                  Sent to Memory Passport · scroll down to inspect
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                  Persist to Memory Passport
                </>
              )}
            </button>
            <p className="mt-2 text-[11px] font-mono text-ink-mute">
              Writes this memory into the interactive passport below —
              inspectable, correctable, revocable.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
