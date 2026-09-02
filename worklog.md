# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 2 (cron review #2) — Current Status Assessment
Site was stable after Round 1: lint clean, no runtime errors, 14 sections,
~16k px tall. VLM hero rating: 7.5/10. All Round 1 features (ScrollProgress,
scroll-spy nav, AnimatedCounter, MagneticButton, Traction, ComparisonMatrix,
Onboarding, TypingTerminal) verified working.

## Round 2 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focused on the
top recommendations from Round 1's "unresolved" list.

### New components added (5)
1. **`memory-passport.tsx`** — REWRITTEN to be fully interactive:
   - Clickable memories → opens a slide-in **ProvenanceDrawer** showing the
     full provenance chain (ingest → extract → reconcile → govern → store)
     with timestamps + writers, confidence, source, scope, and an
     "Archive memory" action.
   - **Agent grants** with working toggle switches (grant/revoke). Toggling
     updates the consent ledger live (new entry animates in at top).
   - Archiving a memory updates its status + logs to the feed.
   - All state is React `useState` — fully client-side, no backend needed.
2. **`command-palette.tsx`** (NEW) — Cmd+K / Ctrl+K (also `/`) fast
   navigation using the existing `cmdk` + `CommandDialog`. Groups: Navigate,
   Product, Use cases, Actions, Resources. Includes a fixed `⌘K command`
   hint badge at bottom-left (desktop only).
3. **`pricing.tsx`** (NEW SECTION) — 3 tiers (Developer $0, Team $240,
   Enterprise custom). Team plan highlighted with green glow + "popular"
   badge. Monthly/annual toggle (annual = −20%) with live price recalc.
4. **`faq.tsx`** (NEW SECTION) — 8-question accordion using the shadcn
   Accordion. Two-column sticky layout (heading+CTA left, accordion right).
   First item open by default. Covers: vector DB, transcripts, models,
   conflicts, user control, isolation, degradation, self-hosting.

### Enhancements to existing components
- **`hero.tsx`** — MemoryGraph pipeline stage labels now animate as a
  **sequential activation wave**: each of the 5 stages brightens in sequence
  (stroke-opacity, fill-opacity, text opacity, circle radius all keyed to
  staggered `keyTimes`), creating a visible "flow" around the core.
  Addresses the VLM's "make it feel alive" feedback.
- **`footer.tsx`** — added Pricing + FAQ links to the link columns.

### Page composition (new order, 16 sections)
Navigation → Hero → Traction → Problem → WhereItFits → ComparisonMatrix →
Engines → HowItWorks → LiveDemo → Developers(+TypingTerminal) → Onboarding →
Production → **MemoryPassport (interactive)** → UseCases → **Pricing** →
**FAQ** → FinalCTA → Footer + ScrollProgress + BackToTop + **CommandPalette**.

## Round 2 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors after fresh load (fast-refresh had transient
  stale-state errors during HMR, all recovered to 200).
- agent-browser QA (desktop 1440×900):
  - Full-page scroll (18,299 px): 0 console errors. ✓
  - 16 sections all present and rendered. ✓
  - **Interactive Memory Passport**:
    - Memories list renders with status badges + IDs (mem_8821 etc.). ✓
    - Click a memory → ProvenanceDrawer slides in from right with full
      provenance chain (5 numbered steps with timestamps). ✓
    - Agent grants toggle switches work. ✓
    - Toggling a grant → consent ledger updates live ("Granted ·
      recommendations · just now" appears at top). ✓
  - **Command palette**: Cmd+K opens dialog with search + 5 groups. ✓
    - `⌘K command` hint badge visible bottom-left. ✓
  - **Pricing**: 3 plans render, Team highlighted with glow + "popular". ✓
    - Monthly→Annual toggle changes Team price $240→$192 + shows
      "billed annually". ✓
  - **FAQ**: 8 questions, first expanded by default, accordion toggles. ✓
  - **Hero pipeline wave**: 5 stage labels show varying brightness
    (sequential activation). ✓
- VLM hero rating improved: **7.5/10 → 8.5/10**.

## Round 2 — Unresolved / Risks + Next-Phase Recommendations
- **No backend integration yet** — LiveDemo, TypingTerminal, Memory Passport,
  and Pricing are all client-side simulations. Highest-value next step: wire
  the LiveDemo "Run decision" to a real API route using `z-ai-web-dev-sdk`
  so it actually calls an LLM to extract/govern memory.
- **Hero ambient animation** — VLM suggested a 3-5s ambient typing/demo in
  the hero mockup. The TypingTerminal in Developers covers this, but a
  subtle version could be embedded directly in the hero MemoryGraph.
- **OG/social preview image** — still no social card; could generate with
  the image-generation skill.
- **Theme toggle (light mode)** — light tokens stubbed but unused.
- **Performance** — page is now 18k px with many framer-motion animations;
  consider `viewport={{ once: true }}` audit + lazy-loading below-the-fold
  sections if Lighthouse scores matter.
- **Accessibility audit** — command palette focus trap, drawer focus
  management, and `aria-live` for the consent feed could be hardened.
- **Pricing** — could add a feature-comparison toggle or "compare all
  features" expandable.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark, technical, infrastructure-grade. Default dark theme.
- **Primary accent**: Electric mint `oklch(0.92 0.17 145)`.
- **Secondary accents**: Warm amber (conflict), violet (multi-agent), rose (revoke).
- **Typography**: Geist Sans (display) + Geist Mono (code/metadata).
- **Custom utilities**: `container-page`, `bg-grid`, `bg-dots`, `glass`,
  `hairline`, `ring-inset-hairline`, `glow-mem`, `text-gradient-mem`,
  `mask-fade-b/x`, `tabular`, `scroll-thin`, `noise-overlay`, `vignette`.
- **Keyframes**: `mem-pulse`, `mem-flow`, `mem-rise`, `mem-shimmer`, `mem-blink`,
  `mem-orbit`, `mem-orbit-slow`, `mem-marquee`. Reduced-motion respected.

## File Map
```
src/app/layout.tsx              # dark theme, metadata, sticky footer wrapper
src/app/globals.css            # design system: tokens, utilities, keyframes
src/app/page.tsx               # section composition (16 sections + overlays)
src/hooks/use-scroll-spy.ts    # scroll-spy hook
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  scroll-progress.tsx          # top kinetic progress bar
  back-to-top.tsx              # floating back-to-top button
  animated-counter.tsx         # deterministic count-up
  magnetic-button.tsx          # cursor-magnetic CTA wrapper
  command-palette.tsx          # NEW: Cmd+K fast navigation
  navigation.tsx               # sticky nav + dropdowns + scroll-spy
  hero.tsx                     # hero + MemoryGraph SVG (sequential pipeline wave)
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes; shared primitives
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # interactive playground
  typing-terminal.tsx          # self-typing CLI trace
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid
  memory-passport.tsx          # REWRITTEN: interactive (drawer + grant toggles)
  use-cases.tsx                # 4 distinct use-case cards
  pricing.tsx                  # NEW: 3-tier pricing + monthly/annual toggle
  faq.tsx                      # NEW: 8-question accordion
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ pricing/faq links)
public/favicon.svg             # hexagon MemoryOS mark
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
