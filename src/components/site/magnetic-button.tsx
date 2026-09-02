"use client";

import * as React from "react";

/**
 * MagneticButton — wraps a child element (typically an <a>) and applies a
 * subtle magnetic translate toward the cursor on hover. Premium micro-
 * interaction. Falls back to no-op on touch / reduced motion.
 */
export function MagneticButton({
  children,
  strength = 14,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(mq.matches && !reduce.matches);
    const onMq = () => setEnabled(mq.matches && !reduce.matches);
    mq.addEventListener?.("change", onMq);
    return () => mq.removeEventListener?.("change", onMq);
  }, []);

  function onMove(e: React.MouseEvent) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({
      x: (x / rect.width) * strength,
      y: (y / rect.height) * strength,
    });
  }

  function onLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
