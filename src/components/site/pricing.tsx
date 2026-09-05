"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Building2, Rocket, Scaling, Terminal } from "lucide-react";
import { SectionLabel, SectionHeading } from "./problem";
import { SectionNumber } from "./section-number";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  priceMonthly: number | null;
  priceAnnual: number | null;
  priceNote: string;
  cta: string;
  href: string;
  features: string[];
  highlighted?: boolean;
  accent: string;
};

const PLANS: Plan[] = [
  { id: "free", name: "Free", icon: Terminal, tagline: "For prototyping and side projects.", priceMonthly: 0, priceAnnual: 0, priceNote: "free forever", cta: "Start free", href: "https://app.memoryo.dev/sign-up?redirect=%2F", accent: "#8A8F98", features: ["5,000 memory operations / mo", "2M memory tokens / mo", "3 calls / user / minute", "Core memory lifecycle", "Community support"] },
  { id: "starter", name: "Starter", icon: Rocket, tagline: "For early production agents.", priceMonthly: 1800, priceAnnual: 18000, priceNote: "per tenant / mo", cta: "Choose Starter", href: "", highlighted: true, accent: "#9EFF7A", features: ["50,000 memory operations / mo", "25M memory tokens / mo", "10 calls / user / minute", "Core memory lifecycle", "Usage alerts"] },
  { id: "growth", name: "Growth", icon: Sparkles, tagline: "For growing multi-agent products.", priceMonthly: 6000, priceAnnual: 60000, priceNote: "per tenant / mo", cta: "Choose Growth", href: "", accent: "#62D9FF", features: ["500,000 memory operations / mo", "250M memory tokens / mo", "30 calls / user / minute", "Core memory lifecycle", "Usage alerts"] },
  { id: "scale", name: "Scale", icon: Scaling, tagline: "For high-volume production systems.", priceMonthly: 18000, priceAnnual: 180000, priceNote: "per tenant / mo", cta: "Choose Scale", href: "", accent: "#FFB86B", features: ["1M memory operations / mo", "500M memory tokens / mo", "80 calls / user / minute", "Core memory lifecycle", "Priority usage alerts"] },
  { id: "enterprise", name: "Enterprise", icon: Building2, tagline: "For regulated, multi-agent systems.", priceMonthly: null, priceAnnual: null, priceNote: "custom", cta: "Talk to us", href: "https://docs.memoryo.dev/contact", accent: "#C8A2FF", features: ["Custom operations & schemas", "Tenant isolation + SSO/SAML", "Custom domain schemas", "Graceful degradation + SLA", "DPA · SOC 2 · audit exports", "Dedicated solutions engineer"] },
];

export function Pricing() {
  const [billing, setBilling] = React.useState<"monthly" | "annual">("monthly");

  return (
    <section
      id="pricing"
      className="relative py-20 lg:py-28 border-t border-hairline overflow-hidden"
    >
      <SectionNumber n="12" label="pricing" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[360px] w-[700px] rounded-full bg-mem/8 blur-[150px]" />
      </div>
      <div className="container-page">
        <div className="max-w-3xl">
          <SectionLabel>Pricing</SectionLabel>
          <SectionHeading>
            Pay for governed context.
            <br />
            <span className="text-ink-mute">Not for idle storage.</span>
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.6] text-ink-soft">
            Start small. Upgrade when your agents reach real users. Every plan
            includes the full lifecycle — ingest, extract, reconcile, govern,
            retrieve.
          </p>
        </div>

        {/* billing toggle */}
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center rounded-lg border border-hairline bg-surface p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                billing === "monthly" ? "bg-mem/15 text-mem" : "text-ink-mute hover:text-ink"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[12.5px] font-medium transition-colors flex items-center gap-1.5",
                billing === "annual" ? "bg-mem/15 text-mem" : "text-ink-mute hover:text-ink"
              )}
            >
              Annual
              <span className="text-[10px] font-mono text-mem/80">2 months free</span>
            </button>
          </div>
        </div>

        {/* plans */}
        <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {PLANS.map((p, i) => (
            <PlanCard key={p.id} plan={p} billing={billing} index={i} />
          ))}
        </div>

        {/* footnote */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-mono text-ink-mute">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3 w-3 text-mem" /> simple monthly billing
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3 w-3 text-mem" /> secure Razorpay checkout
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3 w-3 text-mem" /> keep your stack
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3 w-3 text-mem" /> SOC 2 ready
          </span>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  billing,
  index,
}: {
  plan: Plan;
  billing: "monthly" | "annual";
  index: number;
}) {
  const monthly = plan.priceMonthly;
  const effective = monthly === null ? null : billing === "annual" && plan.priceAnnual !== null ? plan.priceAnnual / 12 : monthly;
  const checkoutHref = ["starter", "growth", "scale"].includes(plan.id)
    ? `https://app.memoryo.dev/billing/checkout?plan=${plan.id}&billing=${billing}&currency=inr`
    : plan.href;
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "relative rounded-2xl border p-6 lg:p-7 overflow-hidden transition-colors",
        plan.highlighted
          ? "border-mem/40 bg-mem/[0.04] ring-inset-hairline glow-mem"
          : "border-hairline bg-surface hover:bg-surface-2/50"
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-mem to-transparent" />
      )}
      {plan.highlighted && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-mem/40 bg-mem/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-mem">
          <Sparkles className="h-3 w-3" /> popular
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
          style={{
            borderColor: `${plan.accent}40`,
            background: `${plan.accent}14`,
            color: plan.accent,
          }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h3 className="text-[16.5px] font-semibold text-ink">{plan.name}</h3>
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">{plan.tagline}</p>

      {/* price */}
      <div className="mt-5 flex items-baseline gap-1.5">
        {effective === null ? (
          <span className="text-[34px] font-semibold tracking-tight text-ink">Custom</span>
        ) : (
          <>
            <span className="text-[34px] font-semibold tracking-tight text-ink tabular">
              ₹{effective.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            <span className="text-[12.5px] text-ink-mute font-mono">/ mo</span>
          </>
        )}
      </div>
      <div className="mt-0.5 text-[11.5px] font-mono text-ink-mute">
        {plan.priceNote}
        {billing === "annual" && effective !== null && monthly !== null && plan.priceAnnual !== null && (
          <span className="ml-1.5 text-mem">billed ₹{plan.priceAnnual.toLocaleString("en-IN")} annually</span>
        )}
      </div>

      <Button
        asChild
        className={cn(
          "mt-5 w-full h-10 rounded-lg font-semibold gap-1.5",
          plan.highlighted
            ? "bg-mem text-[#0A0B0D] hover:bg-mem/90"
            : "bg-white/[0.05] text-ink hover:bg-white/[0.08] border border-hairline-strong"
        )}
      >
        <a href={checkoutHref}>{plan.cta}</a>
      </Button>

      <ul className="mt-6 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-ink-soft">
            <Check
              className={cn(
                "mt-0.5 h-3.5 w-3.5 shrink-0",
                plan.highlighted ? "text-mem" : "text-ink-mute"
              )}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
