"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress — a thin kinetic progress bar fixed to the very top of the
 * viewport. Communicates reading position and adds a premium "alive" feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-mem via-mem/70 to-mem/30"
    >
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent to-mem blur-[2px]" />
    </motion.div>
  );
}
