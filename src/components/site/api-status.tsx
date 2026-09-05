/**
 * Passive site indicator. The production API should not be polled by every
 * marketing-page visitor merely to render navigation chrome.
 */
export function ApiStatus() {
  return (
    <span
      className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-ink-mute"
      title="MemoryOS marketing site"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-mem" />
      site online
    </span>
  );
}
