"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Eye,
  Server,
  KeyRound,
  Globe,
  Clock,
} from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";

/**
 * TrustCenter — security, compliance, and operational posture.
 * Enterprise-buyer-facing: SOC 2, uptime, DPA, encryption, data residency.
 * Communicates "this is safe to put in production".
 */

const BADGES = [
  { label: "SOC 2 Type II", sub: "in progress", icon: ShieldCheck, color: "#9EFF7A", status: "active" },
  { label: "GDPR", sub: "compliant", icon: FileCheck, color: "#7BE3FF", status: "active" },
  { label: "DPA", sub: "available", icon: FileCheck, color: "#7BE3FF", status: "active" },
  { label: "HIPAA-ready", sub: "enterprise", icon: Lock, color: "#C8A2FF", status: "roadmap" },
];

const PILLARS = [
  {
    icon: Lock,
    title: "Encryption",
    desc: "TLS 1.3 in transit. AES-256 at rest. Per-tenant encryption keys.",
    detail: "Every memory is encrypted at rest with AES-256. Per-tenant keys ensure cross-tenant isolation is enforced cryptographically, not just at the storage layer.",
  },
  {
    icon: KeyRound,
    title: "Access control",
    desc: "RBAC + scoped API keys. Per-agent permission boundaries.",
    detail: "API keys are scoped to a tenant + agent + category boundary. A key issued for support-bot cannot read memories written by copilot unless explicitly granted.",
  },
  {
    icon: Server,
    title: "Data residency",
    desc: "US, EU, and APAC regions. No cross-region replication without consent.",
    detail: "Choose where your memories live. Data stays in the selected region; no cross-region replication without explicit customer consent.",
  },
  {
    icon: Eye,
    title: "Auditability",
    desc: "Every write + retrieval is logged with provenance and timestamp.",
    detail: "The audit trail records who wrote a memory, what evidence produced it, who retrieved it, and when. Exportable for compliance reviews.",
  },
  {
    icon: Globe,
    title: "Tenant isolation",
    desc: "Enforced at retrieval, not just storage. Cross-tenant queries return empty.",
    detail: "Isolation is enforced at the retrieval layer — a cross-tenant query returns empty, not an error that leaks existence. Per-tenant encryption keys add a second boundary.",
  },
  {
    icon: Clock,
    title: "Retention & deletion",
    desc: "Configurable retention. Right-to-be-forgotten honored within 30 days.",
    detail: "Set retention per category. User-initiated deletion propagates to all replicas, backups, and derived indexes within 30 days. Provenance is preserved but anonymized.",
  },
];

export function TrustCenter() {
  return (
    <section
      id="trust"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="08" label="trust center" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[360px] w-[700px] rounded-full bg-mem/6 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Trust center</SectionLabel>
          <SectionHeading>
            Safe to put in
            <br />
            <span className="text-ink-mute">production.</span>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            MemoryOS is designed for teams who treat memory as infrastructure.
            Encryption, isolation, auditability, and compliance controls are
            built in — not bolted on.
          </p>
        </div>

        {/* Compliance badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border border-hairline bg-surface p-4 lg:p-5 card-lift"
              style={{ borderTopColor: `${b.color}55`, borderTopWidth: 2 }}
            >
              <div className="flex items-center justify-between">
                <b.icon className="h-5 w-5" style={{ color: b.color }} />
                {b.status === "roadmap" && (
                  <span className="text-[9.5px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-violet/30 bg-violet/10 text-violet">
                    roadmap
                  </span>
                )}
              </div>
              <div className="mt-3 text-[14px] font-semibold text-ink">{b.label}</div>
              <div className="text-[11.5px] font-mono text-ink-mute mt-0.5">{b.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Security pillars */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl border border-hairline bg-hairline overflow-hidden">
          {PILLARS.map((p, i) => (
            <PillarCell key={p.title} {...p} index={i} />
          ))}
        </div>

        {/* Uptime + contact row */}
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-hairline bg-surface p-5 flex items-center gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mem/15 border border-mem/30">
              <ShieldCheck className="h-5 w-5 text-mem" />
            </span>
            <div>
              <div className="text-[14px] font-semibold text-ink">99.97% uptime (90d)</div>
              <div className="text-[12px] text-ink-mute font-mono">status.memoryo.dev</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] font-mono text-mem">
              <span className="h-1.5 w-1.5 rounded-full bg-mem animate-mem-pulse" />
              operational
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface p-5 flex items-center gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet/15 border border-violet/30">
              <FileCheck className="h-5 w-5 text-violet" />
            </span>
            <div>
              <div className="text-[14px] font-semibold text-ink">Security review</div>
              <div className="text-[12px]] text-ink-mute">Need our SOC 2 packet or a DPA?</div>
            </div>
            <a
              href="#cta"
              className="ml-auto text-[12.5px] font-medium text-mem hover:underline"
            >
              Contact security →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarCell({
  icon: Icon,
  title,
  desc,
  detail,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  detail: string;
  index: number;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.05 }}
      className="bg-surface p-5 lg:p-6"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-start gap-3 w-full text-left"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mem/10 border border-mem/20 shrink-0">
          <Icon className="h-4 w-4 text-mem" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[14.5px] font-semibold text-ink">{title}</h3>
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="h-3.5 w-3.5 text-ink-mute shrink-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </div>
          <p className="mt-1 text-[12.5px] text-ink-soft leading-relaxed">{desc}</p>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0, marginTop: open ? 10 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="text-[12.5px] leading-relaxed text-ink-mute border-t border-hairline pt-3 pl-12">
          {detail}
        </p>
      </motion.div>
    </motion.div>
  );
}
