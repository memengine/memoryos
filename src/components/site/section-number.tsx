"use client";

import * as React from "react";

/**
 * SectionNumber — a fixed-position section index badge that appears in the
 * top-right margin of each section (desktop only). Gives the page a
 * magazine-like editorial rhythm and helps visitors track their position.
 */
export function SectionNumber({
  n,
  total = 20,
  label,
  className,
}: {
  n: string;
  total?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`hidden xl:flex pointer-events-none absolute top-24 right-8 z-10 flex-col items-end gap-1 ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="text-[60px] leading-none font-semibold tracking-tighter text-ink-mute/15 tabular">
        {n}
      </span>
      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-mute/50">
        {label ?? `section ${n} / ${total}`}
      </span>
    </div>
  );
}
