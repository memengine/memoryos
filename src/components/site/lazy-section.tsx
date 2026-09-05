import * as React from "react";

/**
 * Section boundary retained for page structure. Children remain mounted so
 * deep links and navigation anchors always exist before the user scrolls.
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
  return (
    <div id={id} style={{ minHeight }}>
      {children}
    </div>
  );
}
