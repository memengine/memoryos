"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "./animated-counter";
import { MagneticButton } from "./magnetic-button";

export function FinalCTA() {
  return (
    <section id="cta" className="relative py-24 lg:py-32 border-t border-hairline overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[820px] rounded-full bg-mem/12 blur-[160px]" />
      </div>
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-mem/30 bg-mem/10 px-3 py-1.5 text-[12px] font-mono text-mem">
            <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
            start with your real product
          </div>

          <h2 className="mt-7 text-balance text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.05] tracking-[-0.03em] font-semibold text-ink">
            Give your next AI interaction
            <br />
            <span className="text-gradient-mem">the context the last one earned.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-[16px] leading-[1.55] text-ink-soft">
            Try the simulated playground, follow the quickstart, or talk with us
            about production onboarding.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <MagneticButton strength={10}>
              <Button
                asChild
                size="lg"
                className="group bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-12 px-7 rounded-xl text-[15px] gap-2 shadow-[0_0_0_1px_oklch(0.92_0.17_145_/_40%),0_12px_44px_-12px_oklch(0.92_0.17_145_/_70%)] hover:shadow-[0_0_0_1px_oklch(0.92_0.17_145_/_60%),0_16px_56px_-10px_oklch(0.92_0.17_145_/_85%)] transition-shadow"
              >
                <a href="#demo">
                  Try MemoryOS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            </MagneticButton>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-7 rounded-xl text-[15px] text-ink-soft hover:text-ink hover:bg-white/[0.04] gap-2 border border-hairline-strong"
            >
              <a href="#developers">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-7 rounded-xl text-[15px] text-ink-soft hover:text-ink hover:bg-white/[0.04] gap-2"
            >
              <a href="#cta">
                <MessageSquare className="h-4 w-4" />
                Talk to an expert
              </a>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-xl border border-hairline bg-hairline overflow-hidden text-left">
            {[
              { value: 5, suffix: " min", label: "to first memory", accent: "text-mem" },
              { value: 4, suffix: " SDKs", label: "Python · TS · REST · MCP", accent: "text-mem" },
              { value: 0, suffix: " lock-in", label: "keep your stack", accent: "text-mem" },
              { value: 99.9, decimals: 1, suffix: "%", label: "tenant isolated · SLA-grade", accent: "text-mem" },
            ].map((x) => (
              <div key={x.label} className="bg-surface p-4">
                <div className="text-[20px] font-semibold tabular text-ink">
                  <AnimatedCounter
                    value={x.value}
                    decimals={x.decimals || 0}
                    suffix={x.suffix}
                    className={x.accent}
                  />
                </div>
                <div className="text-[12px] text-ink-mute font-mono mt-0.5">{x.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
