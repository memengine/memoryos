"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";
import { cn } from "@/lib/utils";

/**
 * Glossary — defines the key vocabulary of governed memory.
 * Buyer-education section: a YC startup needs to define its category.
 * Interactive: click a term to expand its definition.
 */

type Term = {
  term: string;
  short: string;
  long: string;
  accent: string;
};

const TERMS: Term[] = [
  {
    term: "Governed state",
    short: "What changed, what is current, who may reuse it.",
    long: "Learned state extracted from signals, reconciled against existing memory, scoped to a tenant/user/agent boundary, and made retrievable with provenance and consent. Distinct from raw records, transcripts, or vector embeddings.",
    accent: "#9EFF7A",
  },
  {
    term: "Provenance",
    short: "Which service wrote a memory, and why retrieval trusts it.",
    long: "Every memory carries the source that produced it, the evidence that justified it, and the authority weight used at retrieval. Provenance makes memory auditable — you can always answer 'why does the model think this?'",
    accent: "#C8A2FF",
  },
  {
    term: "Quality gate",
    short: "Blocks duplicate, low-signal, over-budget, or rate-limited writes.",
    long: "A rule evaluated before a memory is committed. Gates prevent pollution: duplicates are skipped, low-confidence candidates are dropped, over-budget writes are queued, and rate limits are enforced per tenant/user/agent.",
    accent: "#7BE3FF",
  },
  {
    term: "Conflict resolution",
    short: "Decides which fact wins when sources disagree.",
    long: "When a new memory contradicts an existing one, MemoryOS uses source authority, evidence, recency, and explicit review paths to revise, supersede, or flag for review. Version history is preserved — corrections never erase the prior state.",
    accent: "#FFB36B",
  },
  {
    term: "Tenant isolation",
    short: "Customer memory scoped to the right tenant, user, agent.",
    long: "Memory written for tenant-A is never visible to tenant-B. Isolation is enforced at the retrieval layer, not just at the storage layer — so a cross-tenant query returns empty, not an error that leaks existence.",
    accent: "#9EFF7A",
  },
  {
    term: "Memory Passport",
    short: "User-owned, portable, consent-controlled memory.",
    long: "A per-user record of what each agent is allowed to remember. Users can approve memory before it's stored, inspect what each agent sees, correct facts, resolve conflicts, grant scoped access, and revoke in one click.",
    accent: "#7BE3FF",
  },
  {
    term: "Graceful degradation",
    short: "Keep the product responsive when quotas or dependencies fail.",
    long: "If a quota is exceeded or a dependency is unavailable, get() returns an empty context with a partial_mode flag instead of failing the model call. Your product stays responsive; you can log and backfill asynchronously.",
    accent: "#FFB36B",
  },
  {
    term: "Domain schema",
    short: "Product-specific extraction, retrieval, and safety behavior.",
    long: "A configurable layer on top of the general engine. A support schema extracts open issues and resolution history; an EdTech schema extracts learner progress and weak topics. Schemas tune extraction and retrieval without changing the core.",
    accent: "#C8A2FF",
  },
];

export function Glossary() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      id="glossary"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="11" label="glossary" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-[320px] w-[480px] rounded-full bg-violet/8 blur-[140px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Glossary</SectionLabel>
          <SectionHeading>
            The vocabulary of
            <br />
            <span className="text-ink-mute">governed memory.</span>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            These are the concepts that distinguish a memory layer from a
            database, a transcript store, or a vector search. Click a term to
            expand its definition.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-3">
          {TERMS.map((t, i) => (
            <GlossaryCard
              key={t.term}
              term={t}
              index={i}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GlossaryCard({
  term,
  index,
  isOpen,
  onToggle,
}: {
  term: Term;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 2) * 0.06 }}
      onClick={onToggle}
      aria-expanded={isOpen}
      className={cn(
        "group text-left rounded-xl border bg-surface p-5 transition-colors card-lift",
        isOpen
          ? "border-mem/40 bg-mem/[0.04]"
          : "border-hairline hover:border-hairline-strong hover:bg-surface-2/50"
      )}
      style={
        isOpen
          ? { borderLeftColor: `${term.accent}66`, borderLeftWidth: 2 }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-2 w-2 rounded-full shrink-0 mt-1"
            style={{ background: term.accent }}
          />
          <h3 className="text-[15px] font-semibold text-ink">{term.term}</h3>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-4 w-4 text-ink-mute shrink-0 mt-0.5"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
        {term.short}
      </p>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? 12 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="text-[13px] leading-relaxed text-ink-soft border-t border-hairline pt-3">
          {term.long}
        </p>
      </motion.div>
    </motion.button>
  );
}
