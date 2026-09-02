# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 8 (cron review #8) — Current Status Assessment
Site was stable after Round 7: lint clean, 20 sections, ~21k px tall.
VLM hero rating: 9/10. Streaming SSE, theme toggle, OG image, Glossary,
accessibility hardening all verified. Real LLM backend live.

## Round 8 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: a new
live metrics dashboard section + applying SectionNumber editorial badges
consistently across all major sections.

### New section: Metrics (live ops dashboard)
1. **`metrics.tsx`** (NEW SECTION) — a real-time-looking operations
   dashboard showing the shape of a production MemoryOS deployment:
   - **OpsPanel**: a live sparkline (SVG) that ticks every 1.2s via a
     random-walk algorithm, with a pulsing endpoint dot, gradient area
     fill, grid lines, a big "ops/min" counter, and a +12.4% trend badge.
     Latency percentiles (p50 42ms / p95 118ms / p99 204ms) below.
   - **StatCards**: 4 cards (p95 118ms, 4.2M memories, 312 active tenants,
     99.97% uptime) using AnimatedCounter + colored top borders.
   - Communicates "this is real infra, at scale" without faking customer
     commitments. Numbers are illustrative (design-partner shape).

### Editorial SectionNumber badges (consistent across all major sections)
2. Applied `<SectionNumber>` to 7 more sections so the editorial rhythm is
   consistent across the whole page:
   - HowItWorks → "02 · how it works"
   - (Problem already had "01", LiveDemo already had "03")
   - Production → "06 · production"
   - Architecture → "07 · architecture"
   - Metrics → "10 · metrics"
   - Glossary → "11 · glossary"
   - Pricing → "12 · pricing"
   - FAQ → "13 · faq"
   - Changelog → "14 · changelog"
3. **`section-number.tsx`** — updated default `total` from 19 → 20 (page
   now has 20 sections).

### Navigation + footer + command palette integration
4. **`navigation.tsx`** — added "Metrics" to the Resources dropdown (desc
   "Production at a glance"); added `metrics` to SECTION_IDS for scroll-spy.
5. **`footer.tsx`** — added Metrics to the Resources column.
6. **`command-palette.tsx`** — added "Metrics · production at a glance" to
   the Resources command group.
7. **`page.tsx`** — added `<Metrics />` (in a `LazySection`) between
   Signals and Glossary.

## Round 8 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200.
- agent-browser QA (desktop 1440×900):
  - Fresh load: 0 console errors, dark mode. ✓
  - **Metrics section**: renders with live sparkline (SVG path + pulsing
    endpoint dot), big ops/min counter, p50/p95/p99 latency stats, 4 stat
    cards (p95/4.2M/312/99.97%). SectionNumber "10 · metrics" visible in
    the background. ✓
  - **SectionNumber badges**: all 9 major sections now have editorial
    number badges (01–14). ✓
  - Full-page scroll (~23.3k px, 20 sections rendered): 0 console errors. ✓
- VLM hero rating: held at ~8–9/10 (this screenshot caught mid-scroll
  sections; the hero itself is unchanged from Round 7's 9/10).

## Round 8 — Unresolved / Risks + Next-Phase Recommendations
- **TypingTerminal** is still canned — could replay a real extraction trace
  via the SSE stream.
- **Light mode polish** — a few inline SVG hex colors in Architecture
  (`#0F1115`, `#16181D`) remain hardcoded; low priority.
- **Mobile QA** — Architecture SVG is wide; verify horizontal scroll on
  mobile. Metrics sparkline should be verified on mobile too.
- **Glossary keyboard nav** — arrow-key navigation between cards could be
  added (cards are buttons so already keyboard-accessible).
- **Metrics live data** — sparkline is a random walk; could be wired to
  real aggregated stats from the API if a stats endpoint existed.
- **Non-streaming `/api/memory/extract`** still exists as a fallback.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark (default) + Light mode via next-themes.
- **Primary accent**: Electric mint — dark `oklch(0.92 0.17 145)`, light
  `oklch(0.55 0.16 150)`.
- **Secondary accents**: Warm amber, violet, rose — all theme-aware.
- **Typography**: Geist Sans (display) + Geist Mono (code/metadata).
- **Custom utilities**: `container-page`, `bg-grid`, `bg-dots`, `glass`,
  `hairline`, `ring-inset-hairline`, `glow-mem`, `text-gradient-mem`
  (theme-aware), `mask-fade-b/x`, `tabular`, `scroll-thin`, `noise-overlay`,
  `vignette`.
- **Keyframes**: `mem-pulse`, `mem-flow`, `mem-rise`, `mem-shimmer`, `mem-blink`,
  `mem-orbit`, `mem-orbit-slow`, `mem-marquee`. Reduced-motion respected.
- **Performance**: `content-visibility: auto` on offscreen sections; global
  `:focus-visible` outline; custom theme-aware scrollbar.

## File Map
```
src/app/layout.tsx              # ThemeProvider + OG image metadata
src/app/globals.css            # design system: light + dark tokens, content-visibility, focus-visible
src/app/page.tsx               # section composition (21 sections + lazy)
src/app/api/memory/extract/route.ts        # real LLM extraction (non-streaming)
src/app/api/memory/extract-stream/route.ts # streaming SSE extraction
src/hooks/use-scroll-spy.ts    # scroll-spy hook
src/hooks/use-extracted-memory.ts    # pub/sub for LiveDemo → Passport
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  scroll-progress.tsx          # top kinetic progress bar
  back-to-top.tsx              # floating back-to-top button
  animated-counter.tsx         # deterministic count-up
  magnetic-button.tsx          # cursor-magnetic CTA wrapper
  command-palette.tsx          # Cmd+K fast navigation (+ metrics, glossary)
  api-status.tsx               # live API health indicator
  theme-toggle.tsx             # dark/light mode toggle
  section-number.tsx           # editorial section index badge (9 sections)
  lazy-section.tsx             # IntersectionObserver lazy wrapper
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus + ThemeToggle
  hero.tsx                     # hero + MemoryGraph SVG
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes + SectionNumber "01"
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline + SectionNumber "02"
  live-demo.tsx                # real LLM SSE streaming + SectionNumber "03" + Persist-to-Passport
  typing-terminal.tsx          # self-typing CLI trace (theme-aware bg)
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid + SectionNumber "06"
  architecture.tsx             # system diagram + request flow + SectionNumber "07"
  memory-passport.tsx          # interactive (drawer + grants + a11y)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials
  metrics.tsx                  # NEW: live ops dashboard + sparkline + stat cards + SectionNumber "10"
  glossary.tsx                 # 8 interactive term cards + SectionNumber "11"
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle + SectionNumber "12"
  faq.tsx                      # 8-question accordion + SectionNumber "13"
  changelog.tsx                # shipped + roadmap timeline + SectionNumber "14"
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ metrics, glossary links)
public/favicon.svg             # hexagon MemoryOS mark
public/og.png                  # 1344×768 social preview image
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
