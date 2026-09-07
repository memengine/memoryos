"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionLabel, SectionHeading } from "./problem";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "Is MemoryOS a vector database?",
    a: "No. Vector search finds semantically similar records and documents — it does not decide what is durable, what changed, or who may reuse it. MemoryOS governs learned state: facts, preferences, goals, and procedures, with provenance, conflict resolution, and access policy. You can still use a vector store alongside MemoryOS; we complement it, not replace it.",
  },
  {
    q: "Does it replace my conversation transcript store?",
    a: "No. Keep your complete transcripts. MemoryOS ingests relevant signals from them and extracts durable memory. Your transcript store remains the source of truth for raw history; MemoryOS is the source of truth for current, governed user state.",
  },
  {
    q: "What models and agent frameworks does it work with?",
    a: "Any. MemoryOS is model- and framework-agnostic. You call add() on the way in and get() before your next model call — the retrieved context is a compact system_prompt_addition that works with OpenAI, Anthropic, open-source models, LangChain, LlamaIndex, or your own agent loop.",
  },
  {
    q: "How does MemoryOS handle conflicting facts?",
    a: "When a new fact conflicts with an existing one, MemoryOS uses source authority, supporting evidence, recency, and explicit review paths to decide whether to revise, supersede, or flag for review. Version history is preserved — corrections never erase the prior state.",
  },
  {
    q: "Is user data really under user control?",
    a: "Yes — via the Memory Passport. Users can approve memory before it's stored, inspect what each agent sees, correct facts that drifted, resolve conflicting versions, grant scoped agent access, and revoke access in one click. All of this is audit-logged.",
  },
  {
    q: "How is memory scoped and isolated?",
    a: "Every memory is scoped to a tenant, a user, an agent, and a category boundary. Tenant isolation is enforced at the retrieval layer — a memory written for tenant-A is never visible to tenant-B. You can also scope per-agent so a support-bot only sees what it was granted.",
  },
  {
    q: "What happens when quotas or dependencies fail?",
    a: "MemoryOS degrades gracefully. If a quota is exceeded or a dependency is unavailable, get() returns an empty context (with a partial_mode flag) instead of failing your model call. Your product stays responsive; you can log and backfill asynchronously.",
  },
  {
    q: "Can I self-host?",
    a: "Cloud and dedicated deployments are available on Team and Enterprise plans. For air-gapped or strict-residency requirements, talk to us about on-prem deployment with the same governance controls.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[480px] rounded-full bg-violet/8 blur-[130px]" />
      </div>
      <div className="container-page grid lg:grid-cols-[0.9fr_1.3fr] gap-12 lg:gap-16">
        {/* Left: heading + CTA */}
        <div className="lg:sticky lg:top-24 self-start">
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>
            Questions teams ask
            <br />
            <span className="text-ink-mute">before they ship.</span>
          </SectionHeading>
          <p className="mt-5 text-[15px] leading-[1.6] text-ink-soft max-w-md">
            Short, technical answers. If something here doesn't cover your case,
            talk to us — we work through architecture with every team.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-mem text-[#0A0B0D] hover:bg-mem/90 font-semibold h-10 px-4 rounded-lg gap-1.5"
            >
              <a href="#cta">
                Talk to an expert
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-10 px-4 rounded-lg border border-hairline hover:bg-white/[0.04]"
            >
              <a href="#developers">Read the docs</a>
            </Button>
          </div>
        </div>

        {/* Right: accordion */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-hairline bg-surface overflow-hidden"
        >
          <Accordion type="single" collapsible className="w-full" defaultValue="faq-0">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-hairline last:border-b-0 px-5"
              >
                <AccordionTrigger className="text-left text-[14.5px] font-medium text-ink hover:no-underline py-4 hover:text-mem transition-colors [&[data-state=open]>svg]:text-mem">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-[1.65] text-ink-soft pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
