"use client";

import * as React from "react";

/**
 * Tiny pub/sub used to pass a representative memory from the guided demo to
 * the local Memory Passport preview.
 *
 * No backend persistence — just in-memory cross-component state via a
 * module-level emitter.
 */

export type ExtractedMemoryEvent = {
  id: string;
  type: "preference" | "fact" | "goal" | "procedure";
  text: string;
  confidence: number;
  source: string;
  status: "approved" | "corrected" | "pending" | "archived";
  conflict: boolean;
  conflict_with?: string | null;
  provenance: { event: string; at: string; by: string }[];
  scope: string;
  writtenAt: string;
  fromApi: boolean;
};

type Listener = (m: ExtractedMemoryEvent) => void;

let listeners: Listener[] = [];

export function publishMemory(m: ExtractedMemoryEvent) {
  listeners.forEach((l) => l(m));
}

export function useExtractedMemorySubscription(onMemory: (m: ExtractedMemoryEvent) => void) {
  const ref = React.useRef(onMemory);
  React.useEffect(() => {
    ref.current = onMemory;
  });

  React.useEffect(() => {
    const l: Listener = (m) => ref.current(m);
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);
}
