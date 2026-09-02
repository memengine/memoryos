# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 4 (cron review #4) — Current Status Assessment
Site was stable after Round 3: lint clean, 17 sections, ~19.5k px tall.
VLM hero rating: 9/10. Real LLM backend (`/api/memory/extract`) live and
verified. All Round 3 features (real-LLM LiveDemo, ApiStatus, Signals)
working.

## Round 4 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: the top
unresolved recommendations — **wire LiveDemo → Memory Passport persistence**,
add Architecture + Changelog sections, performance via lazy-loading.

### New sections (2)
1. **`architecture.tsx`** (NEW SECTION) — detailed system diagram showing
   where MemoryOS sits in a production AI stack:
   - SVG flow: User → App → Agent (left) → MemoryOS govern layer (center,
     highlighted green, contains the 5 stage chips) → Model → App → User
     (right).
   - "Existing systems (untouched)" row at bottom-left: App DB, Transcripts,
     Vector, Tools — visually muted to reinforce MemoryOS complements them.
   - Animated dashed flow lines with `add()` / `get() → ctx` labels.
   - Loop-back arrow: "agent learns · next call carries governed context".
   - 4 annotated step boxes below explaining the request flow.
   - Legend (MemoryOS govern / your systems / signal flow).
2. **`changelog.tsx`** (NEW SECTION) — product momentum signals:
   - Vertical timeline with 3 entries: v1.0 (Sep 2026, shipped, GA),
     v0.9 (Aug 2026, shipped, production foundations), v next (Q4 2026,
     roadmap — streaming, on-prem, SOC 2, custom schemas).
   - Each entry: version badge, date, shipped/next tag, title, bullet list.
   - "Join the design partner program" CTA at the bottom.

### Real persistence flow: LiveDemo → Memory Passport
3. **`use-extracted-memory.ts`** (NEW hook) — tiny pub/sub so the LiveDemo
   can publish a freshly-extracted memory and the MemoryPassport subscribes.
   Module-level emitter, no backend needed.
4. **`live-demo.tsx`** — added "Persist to Memory Passport" button in the
   ResponsePanel (appears after a successful run). Clicking publishes the
   extracted memory (id, type, text, confidence, source, status, conflict,
   provenance chain from the real API trace, scope, writtenAt) to the
   passport. Button shows "Sent to Memory Passport · scroll down to inspect"
   success state for 3s.
5. **`memory-passport.tsx`** — subscribes to extracted-memory events:
   - New memory prepended to the memories list (count increments).
   - Consent ledger gets a new "Approved/Corrected · live-demo · just now"
     entry.
   - Passport card glows green (border-mem/60 + glow-mem) for 2.4s.
   - Memories header shows a pulsing Zap icon when a new memory arrives.

### Performance: lazy-loading
6. **`lazy-section.tsx`** (NEW) — `LazySection` wrapper using
   `IntersectionObserver` with `rootMargin: "600px 0px"` to defer rendering
   of below-the-fold sections until they're near the viewport. Min-height
   placeholder prevents CLS.
7. **`page.tsx`** — wrapped Onboarding, Production, Architecture,
   MemoryPassport, UseCases, Signals, Pricing, FAQ, Changelog, FinalCTA in
   `<LazySection>`. Hero through Developers render immediately for fast
   first paint.

### Enhancements
- **`navigation.tsx`** — added Architecture to Product dropdown; Changelog to
  Resources dropdown; extended SECTION_IDS with architecture/changelog.
- **`footer.tsx`** — added Architecture (Product col) + Changelog (Resources
  col) links.

### Page composition (new order, 19 sections)
Navigation(+ApiStatus) → Hero → Traction → Problem → WhereItFits →
ComparisonMatrix → Engines → HowItWorks → **LiveDemo (real LLM → Passport)**
→ Developers → [lazy] Onboarding → Production → **Architecture** →
**MemoryPassport (receives real memories)** → UseCases → Signals → Pricing →
FAQ → **Changelog** → FinalCTA → Footer + ScrollProgress + BackToTop +
CommandPalette.

## Round 4 — Verification Results
- `bun run lint`: clean (fixed a `react-hooks/refs` error by moving ref
  assignment into a useEffect).
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200 (~6-12ms).
- agent-browser QA (desktop 1440×900):
  - Fresh load: 0 console errors; 9 sections render immediately, lazy
    sections load on scroll. After full scroll: 19 sections, ~22k px. ✓
  - **LiveDemo → Passport persistence flow** verified end-to-end:
    - Ran "Run decision" (real LLM extraction). ✓
    - Clicked "Persist to Memory Passport" → button changed to "Sent to
      Memory Passport · scroll down to inspect" (green checkmark). ✓
    - Scrolled to Memory Passport: memories count incremented 4 → 5,
      consent ledger shows "Approved · live-demo · just now", passport
      card has green glow highlight. ✓
  - **Architecture** section renders the full system diagram (left column,
    center govern layer with 5 chips, right column, existing-systems row,
    annotated steps, legend). ✓
  - **Changelog** section renders the 3-entry timeline with version badges,
    dates, status tags, bullet items, and the design-partner CTA. ✓
  - Full-page scroll (22,155 px): 0 console errors. ✓
- VLM hero rating: 8/10 (this screenshot caught the hero mid-scroll; the
  rating reflects the captured frame, not a regression — the hero itself
  is unchanged from Round 3's 9/10).

## Round 4 — Unresolved / Risks + Next-Phase Recommendations
- **Streaming extraction (SSE)** — the API still returns the full trace at
  once after the LLM call completes (~1-7s). Streaming stages as they
  complete would feel more "live". Highest-value remaining UX improvement.
- **TypingTerminal** is still canned — could replay a real extraction trace.
- **OG/social preview image** — still no social card; generate with the
  image-generation skill.
- **Theme toggle (light mode)** — light tokens stubbed but unused.
- **Accessibility** — focus trap in command palette + drawer; `aria-live`
  for the consent feed and decision log; keyboard nav for the grant toggles.
- **Mobile QA** — Architecture SVG is wide; verify horizontal scroll /
  sticky behavior on mobile (the comparison matrix already handles this).
- **Performance** — lazy-loading is in place; could add `content-visibility:
  auto` to section wrappers for further paint savings.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark, technical, infrastructure-grade. Default dark theme.
- **Primary accent**: Electric mint `oklch(0.92 0.17 145)`.
- **Secondary accents**: Warm amber (conflict), violet (multi-agent/roadmap), rose (revoke/error).
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
src/app/page.tsx               # section composition (19 sections + lazy wrappers)
src/app/api/memory/extract/route.ts  # real LLM extraction endpoint
src/hooks/use-scroll-spy.ts    # scroll-spy hook
src/hooks/use-extracted-memory.ts    # NEW: pub/sub for LiveDemo → Passport
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  scroll-progress.tsx          # top kinetic progress bar
  back-to-top.tsx              # floating back-to-top button
  animated-counter.tsx         # deterministic count-up
  magnetic-button.tsx          # cursor-magnetic CTA wrapper
  command-palette.tsx          # Cmd+K fast navigation
  api-status.tsx               # live API health indicator
  lazy-section.tsx             # NEW: IntersectionObserver lazy wrapper
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus
  hero.tsx                     # hero + MemoryGraph SVG (sequential pipeline wave)
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes; shared primitives
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # real LLM playground + Persist-to-Passport
  typing-terminal.tsx          # self-typing CLI trace
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid
  architecture.tsx             # NEW: system diagram + request flow
  memory-passport.tsx          # interactive (drawer + grants + receives LiveDemo)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle
  faq.tsx                      # 8-question accordion
  changelog.tsx                # NEW: shipped + roadmap timeline
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ architecture/changelog links)
public/favicon.svg             # hexagon MemoryOS mark
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
