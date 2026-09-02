"use client";

import * as React from "react";

/**
 * LazySection — defers rendering of children until the section scrolls near
 * the viewport. Improves first paint on long pages by avoiding hydration of
 * below-the-fold sections. Falls back to a min-height placeholder so layout
 * is stable (no CLS).
 */
export function LazySection({
  id,
  minHeight = 400,
  children,
}: {
  id?: string;
  minHeight?: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IntersectionObserver is unavailable, just render.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
}
