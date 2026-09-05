"use client";

import * as React from "react";
import { useInView } from "framer-motion";

/**
 * Zero-cost pipeline preview. The protected, user-triggered live demo will be
 * connected separately; this visual must never generate API traffic on scroll.
 */
const PREVIEW_LINES = [
  { p: "$", t: 'client.add("I prefer concise explanations.")', cls: "text-ink-soft" },
  { p: "→", t: "ingest · signal accepted and scoped", cls: "text-ink-mute" },
  { p: "✓", t: "extract · durable preference candidate", cls: "text-mem" },
  { p: "→", t: "reconcile · current state evaluated", cls: "text-ink-mute" },
  { p: "→", t: "govern · quality and provenance checks", cls: "text-ink-mute" },
  { p: "✓", t: "retrieve · ranked, prompt-ready context", cls: "text-mem" },
] as const;

export function TypingTerminal() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleCount, setVisibleCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView || visibleCount >= PREVIEW_LINES.length) return;
    const timer = window.setTimeout(() => setVisibleCount((count) => count + 1), 260);
    return () => clearTimeout(timer);
  }, [inView, visibleCount]);

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
        <span className="text-[10.5px] font-mono text-ink-mute">memoryos · pipeline preview</span>
        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-ink-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-mute" />
          preview
        </span>
      </div>
      <div className="p-3.5 font-mono text-[12px] leading-[1.7] min-h-[280px]">
        {PREVIEW_LINES.slice(0, visibleCount).map((line, index) => (
          <div key={line.t} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <span className={`shrink-0 w-3 ${line.p === "$" || line.p === "✓" ? "text-mem" : "text-ink-mute"}`}>
              {line.p}
            </span>
            <span className={line.cls}>
              {line.t}
              {index === visibleCount - 1 && visibleCount < PREVIEW_LINES.length && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 bg-mem align-middle animate-mem-blink" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
