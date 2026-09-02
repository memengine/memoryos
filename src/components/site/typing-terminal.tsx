"use client";

import * as React from "react";
import { useInView } from "framer-motion";

/**
 * TypingTerminal — a CLI terminal that calls the REAL streaming extraction
 * endpoint and types out the actual trace as stages arrive over SSE.
 *
 * When scrolled into view, it POSTs a sample input to /api/memory/extract-stream,
 * consumes the SSE stream, and types each stage's detail as it arrives.
 * After completion, it pauses and re-runs with the next sample. This is
 * genuinely "live" — the trace comes from the real LLM, not a canned script.
 */

const SAMPLE_INPUTS = [
  "I prefer concise explanations while debugging.",
  "We're building a B2B SaaS for Indian SMBs using FastAPI and Postgres.",
  "Actually, switch me to TypeScript — not Python anymore.",
  "My goal this quarter is to ship the onboarding flow end-to-end.",
];

type Line = { p: string; t: string; cls: string };

export function TypingTerminal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [lines, setLines] = React.useState<Line[]>([]);
  const [typed, setTyped] = React.useState("");
  const [activeLine, setActiveLine] = React.useState<Line | null>(null);
  const [sampleIdx, setSampleIdx] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  // Drive a single extraction cycle: call the SSE endpoint, type lines as
  // stages arrive, then pause before the next cycle.
  React.useEffect(() => {
    if (!inView || running) return;
    let cancelled = false;
    setRunning(true);

    async function runCycle() {
      const input = SAMPLE_INPUTS[sampleIdx % SAMPLE_INPUTS.length];
      const collected: Line[] = [
        { p: "$", t: `client.add(${JSON.stringify(input.slice(0, 50))}…)`, cls: "text-ink-soft" },
      ];
      setLines(collected);
      setTyped("");
      setActiveLine(null);

      try {
        const res = await fetch("/api/memory/extract-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const evt of events) {
            if (cancelled) break;
            const line = evt.trim();
            if (!line.startsWith("data: ")) continue;
            let data: any;
            try {
              data = JSON.parse(line.slice(6));
            } catch {
              continue;
            }
            if (data.type === "stage") {
              const newLine: Line = {
                p: data.stage === "extract" ? "✓" : "→",
                t: `${data.stage} · ${data.detail}`,
                cls:
                  data.stage === "extract" || data.stage === "retrieve"
                    ? "text-mem"
                    : data.stage === "reconcile" && data.detail.includes("conflict")
                    ? "text-amber"
                    : "text-ink-mute",
              };
              // Type out this line character by character
              await typeLine(newLine, () => cancelled);
              collected.push(newLine);
              setLines([...collected]);
              setTyped("");
              setActiveLine(null);
            } else if (data.type === "result") {
              const resultLine: Line = {
                p: "✓",
                t: `memory#${data.job_id} stored · ${data.latency_ms}ms · prompt-ready`,
                cls: "text-mem",
              };
              await typeLine(resultLine, () => cancelled);
              collected.push(resultLine);
              setLines([...collected]);
              setTyped("");
              setActiveLine(null);
            }
          }
        }
      } catch {
        if (!cancelled) {
          const errLine: Line = {
            p: "✗",
            t: "extraction failed · retrying…",
            cls: "text-rose",
          };
          await typeLine(errLine, () => cancelled);
          collected.push(errLine);
          setLines([...collected]);
        }
      }

      if (cancelled) return;
      // Pause before next cycle
      await new Promise((r) => setTimeout(r, 2400));
      if (cancelled) return;
      setSampleIdx((i) => i + 1);
      setRunning(false);
    }

    runCycle();
    return () => {
      cancelled = true;
    };
  }, [inView, sampleIdx]);

  // Type a line character by character, with a blinking cursor.
  async function typeLine(line: Line, isCancelled: () => boolean) {
    setActiveLine(line);
    for (let i = 0; i <= line.t.length; i++) {
      if (isCancelled()) return;
      setTyped(line.t.slice(0, i));
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 14));
    }
  }

  return (
    <div
      ref={ref}
      className="rounded-xl border border-hairline bg-background overflow-hidden ring-inset-hairline shadow-lg shadow-black/20 dark:bg-[#0A0B0D]"
    >
      <div className="flex items-center justify-between px-3 h-8 border-b border-hairline bg-surface-2/40">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="text-[10.5px] font-mono text-ink-mute">
          memoryos · live trace
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-mem">
          <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
          {running ? "streaming" : "live"}
        </span>
      </div>
      <div className="p-3.5 font-mono text-[12px] leading-[1.7] min-h-[280px]">
        {lines.map((line, i) => {
          const isActive = activeLine && i === lines.length - 1;
          const text = isActive ? typed : line.t;
          return (
            <div key={i} className="flex gap-2">
              <span
                className={`shrink-0 w-3 ${
                  line.p === "$"
                    ? "text-mem"
                    : line.p === "✓"
                    ? "text-mem"
                    : line.p === "✗"
                    ? "text-rose"
                    : "text-ink-mute"
                }`}
              >
                {line.p}
              </span>
              <span className={line.cls}>
                {text}
                {isActive && (
                  <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-mem align-middle animate-mem-blink" />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
