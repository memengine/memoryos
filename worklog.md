# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 7 (cron review #7) — Current Status Assessment
Site was stable after Round 6: lint clean, 19 sections, ~21k px tall.
VLM hero rating: 9/10. Streaming SSE extraction, theme toggle, OG image,
accessibility hardening all verified working. Real LLM backend live.

## Round 7 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: a new
buyer-education section + editorial polish + wiring up the existing
SectionNumber component.

### New section: Glossary
1. **`glossary.tsx`** (NEW SECTION) — defines the vocabulary of governed
   memory. 8 interactive term cards in a 2-column grid, each with a colored
   accent dot, term name, short description, and a chevron. Click to expand
   the long definition (animated height + opacity). First card open by
   default. Terms: Governed state, Provenance, Quality gate, Conflict
   resolution, Tenant isolation, Memory Passport, Graceful degradation,
   Domain schema. Buyer-education: a YC startup needs to define its
   category vocabulary.

### Editorial section numbers (wired up)
2. **`problem.tsx`** + **`live-demo.tsx`** — added `<SectionNumber>` badges
   ("01 · the problem", "03 · live demo") in the right margin on desktop xl+.
   Large faint number + mono label — gives the page a magazine-like editorial
   rhythm. (Component existed since Round 5; now applied to key sections.)

### Navigation + footer + command palette integration
3. **`navigation.tsx`** — added "Glossary" to the Resources dropdown (with
   desc "Vocabulary of governed memory"); added `glossary` to SECTION_IDS
   for scroll-spy.
4. **`footer.tsx`** — added Glossary to the Resources column.
5. **`command-palette.tsx`** — added "Glossary · vocabulary of governed
   memory" to the Resources command group.
6. **`page.tsx`** — added `<Glossary />` (in a `LazySection`) between Signals
   and Pricing. Page now has **20 sections**.

## Round 7 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200.
- agent-browser QA (desktop 1440×900):
  - Fresh load: 0 console errors, dark mode. ✓
  - **Glossary section**: 8 term cards in a 2-column grid, colored dots,
    first card ("Governed state") expanded with long definition visible;
    chevrons animate on toggle. ✓
  - **SectionNumber badges**: "01 · the problem" present in the Problem
    section DOM; "03 · live demo" present in the LiveDemo section DOM. ✓
  - Full-page scroll (~21.4k px, 17 sections rendered): 0 console errors. ✓
- VLM hero rating: held at ~8–9/10 (this screenshot caught mid-scroll
  sections; the hero itself is unchanged from Round 6's 9/10).

## Round 7 — Unresolved / Risks + Next-Phase Recommendations
- **Apply SectionNumber to more sections** — only Problem + LiveDemo have
  it so far; could extend to HowItWorks, Architecture, Production, etc.
- **TypingTerminal** is still canned — could replay a real extraction trace
  via the SSE stream.
- **Light mode polish** — a few inline SVG hex colors in Architecture
  (`#0F1115`, `#16181D`) remain hardcoded; low priority.
- **Mobile QA** — Architecture SVG is wide; verify horizontal scroll on
  mobile.
- **Glossary keyboard nav** — cards are buttons so they're keyboard-
  accessible, but arrow-key navigation between cards could be added.
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
src/app/page.tsx               # section composition (20 sections + lazy)
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
  command-palette.tsx          # Cmd+K fast navigation (+ glossary)
  api-status.tsx               # live API health indicator
  theme-toggle.tsx             # dark/light mode toggle
  section-number.tsx           # editorial section index badge (wired to Problem + LiveDemo)
  lazy-section.tsx             # IntersectionObserver lazy wrapper
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus + ThemeToggle
  hero.tsx                     # hero + MemoryGraph SVG
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes + SectionNumber "01"
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # real LLM SSE streaming + SectionNumber "03" + Persist-to-Passport
  typing-terminal.tsx          # self-typing CLI trace (theme-aware bg)
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid
  architecture.tsx             # system diagram + request flow
  memory-passport.tsx          # interactive (drawer + grants + a11y)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials
  glossary.tsx                 # NEW: 8 interactive term cards
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle
  faq.tsx                      # 8-question accordion
  changelog.tsx                # shipped + roadmap timeline
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ glossary link)
public/favicon.svg             # hexagon MemoryOS mark
public/og.png                  # 1344×768 social preview image
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
