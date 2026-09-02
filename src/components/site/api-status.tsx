"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

/**
 * ApiStatus — pings /api/memory/extract (GET) every 30s and shows a small
 * "live backend" indicator in the nav. Communicates that this is a real
 * product, not a static site.
 */
export function ApiStatus() {
  const [status, setStatus] = React.useState<"checking" | "ok" | "down">("checking");
  const [latency, setLatency] = React.useState<number | null>(null);

  const check = React.useCallback(async () => {
    const start = Date.now();
    try {
      const res = await fetch("/api/memory/extract", { method: "GET" });
      const ms = Date.now() - start;
      if (res.ok) {
        setStatus("ok");
        setLatency(ms);
      } else {
        setStatus("down");
      }
    } catch {
      setStatus("down");
    }
  }, []);

  React.useEffect(() => {
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [check]);

  if (status === "checking") {
    return (
      <span
        className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-mute"
        title="Checking API status"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ink-mute animate-mem-pulse" />
        checking api
      </span>
    );
  }
  if (status === "down") {
    return (
      <span
        className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-rose"
        title="API unreachable"
      >
        <AlertCircle className="h-3 w-3" />
        api down
      </span>
    );
  }
  return (
    <span
      className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-mem"
      title={`MemoryOS extract API · ${latency}ms`}
    >
      <span className="relative inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
      </span>
      api live
      {latency !== null && (
        <span className="text-ink-mute">· {latency}ms</span>
      )}
    </span>
  );
}
