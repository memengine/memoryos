"use client";

import * as React from "react";
import { useInView } from "framer-motion";

/**
 * TypingTerminal — a self-typing CLI terminal that "runs" a real MemoryOS
 * add+get flow when scrolled into view. Purely presentational, no backend.
 * Loops with a pause between cycles.
 */

const LINES = [
  { p: "$", t: "pip install memoryo-sdk", cls: "text-ink-soft" },
  { p: "✓", t: "installed memoryo-sdk==1.0.0", cls: "text-mem" },
  { p: "$", t: "python app.py", cls: "text-ink-soft" },
  { p: "→", t: "ingest · msg#42 · customer-123", cls: "text-ink-mute" },
  { p: "→", t: 'extract · "prefers concise explanations" · conf 8.2', cls: "text-ink-mute" },
  { p: "→", t: "reconcile · no conflict", cls: "text-ink-mute" },
  { p: "→", t: "govern · quality ✓ · tenant-A · consent granted", cls: "text-ink-mute" },
  { p: "✓", t: "memory#mem_8821 stored · provenance recorded", cls: "text-mem" },
  { p: "$", t: 'client.get("how should I answer this user?")', cls: "text-ink-soft" },
  { p: "✓", t: "2 memories retrieved · ranked · fresh · prompt-ready", cls: "text-mem" },
  { p: "→", t: "system_prompt_addition attached", cls: "text-ink-mute" },
  { p: "✓", t: "model call complete · 312ms", cls: "text-mem" },
];

export function TypingTerminal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [typed, setTyped] = React.useState("");

  // Typewriter effect across all lines, looped.
  React.useEffect(() => {
    if (!inView) {
      setVisibleCount(0);
      setTyped("");
      return;
    }
    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    let pauseTicks = 0;

    const tick = () => {
      if (cancelled) return;
      if (lineIdx >= LINES.length) {
        // pause then restart
        pauseTicks++;
        if (pauseTicks > 80) {
          lineIdx = 0;
          charIdx = 0;
          pauseTicks = 0;
          setVisibleCount(0);
          setTyped("");
        }
        timer = window.setTimeout(tick, 60);
        return;
      }
      const line = LINES[lineIdx];
      if (charIdx <= line.t.length) {
        setVisibleCount(lineIdx + 1);
        setTyped(line.t.slice(0, charIdx));
        charIdx++;
        timer = window.setTimeout(tick, 28 + Math.random() * 22);
      } else {
        // line finished — small gap, move on
        lineIdx++;
        charIdx = 0;
        setVisibleCount(lineIdx + 1);
        setTyped("");
        timer = window.setTimeout(tick, 220);
      }
    };
    let timer = window.setTimeout(tick, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-hairline bg-[#0A0B0D] overflow-hidden ring-inset-hairline"
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
          running
        </span>
      </div>
      <div className="p-3.5 font-mono text-[12px] leading-[1.7] min-h-[280px]">
        {LINES.slice(0, visibleCount).map((line, i) => {
          const isLast = i === visibleCount - 1;
          const text = isLast ? typed : line.t;
          return (
            <div key={i} className="flex gap-2">
              <span className={`shrink-0 w-3 ${line.p === "$" ? "text-mem" : line.p === "✓" ? "text-mem" : "text-ink-mute"}`}>
                {line.p}
              </span>
              <span className={line.cls}>
                {text}
                {isLast && <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-mem align-middle animate-mem-blink" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
