"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop — floating button that appears after scrolling past the hero.
 * Smooth scroll to top. Respects reduced motion.
 */
export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="group fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong bg-surface/80 backdrop-blur-md text-ink-soft hover:text-mem hover:border-mem/40 transition-colors shadow-lg shadow-black/40"
        >
          <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          <span className="absolute inset-0 rounded-full ring-1 ring-mem/0 group-hover:ring-mem/30 transition-all" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
