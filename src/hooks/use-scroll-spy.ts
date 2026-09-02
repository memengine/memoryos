"use client";

import * as React from "react";

/**
 * useScrollSpy — returns the id of the section currently most in view.
 * Used by Navigation to highlight the active section.
 */
export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = React.useState<string>(ids[0] ?? "");

  React.useEffect(() => {
    const handler = () => {
      const pos = window.scrollY + offset;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= pos) current = id;
      }
      // bottom of page -> last id
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 4
      ) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [ids.join(","), offset]);

  return active;
}
