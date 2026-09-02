# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 10 (cron review #10) — Current Status Assessment
Site was stable after Round 9: lint clean, 21 sections, ~23k px tall.
VLM hero rating: 9/10. Real SSE streaming (LiveDemo + TypingTerminal),
theme toggle, Metrics dashboard, editorial SectionNumber badges all
verified. Real LLM backend live.

## Round 10 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: a new
enterprise-buyer-facing **Trust Center** section — security & compliance
posture (SOC 2, encryption, isolation, auditability, residency).

### New section: Trust Center
1. **`trust-center.tsx`** (NEW SECTION) — security, compliance, and
   operational posture. Enterprise-buyer-facing:
   - **Compliance badges** (4): SOC 2 Type II (in progress), GDPR
     (compliant), DPA (available), HIPAA-ready (roadmap badge).
   - **6 security pillars** (interactive, click to expand): Encryption
     (TLS 1.3 + AES-256 + per-tenant keys), Access control (RBAC +
     scoped keys), Data residency (US/EU/APAC, no cross-region without
     consent), Auditability (every write/retrieval logged), Tenant
     isolation (enforced at retrieval), Retention & deletion (30-day
     right-to-be-forgotten).
   - **Bottom row**: uptime card (99.97% / status.memoryo.dev /
     "operational" pulse) + security contact card ("Contact security →").
   - SectionNumber "08 · trust center" editorial badge.
   - Each pillar uses `card-lift` hover + animated chevron + expandable
     detail with the full explanation.

### Navigation + footer + command palette integration
2. **`navigation.tsx`** — added "Trust center" to the Product dropdown
   (desc "Security & compliance posture"); added `trust` to SECTION_IDS
   for scroll-spy.
3. **`footer.tsx`** — added Trust center to the Product column.
4. **`command-palette.tsx`** — added "Trust center · security &
   compliance" to the Product command group.
5. **`page.tsx`** — added `<TrustCenter />` (in a `LazySection`) between
   Architecture and MemoryPassport. Page now has **22 sections**.

## Round 10 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200.
- agent-browser QA (desktop 1440×900):
  - Fresh load: 0 console errors, dark mode. ✓
  - **Trust Center section**: renders with 4 compliance badges (SOC 2 /
    GDPR / DPA / HIPAA-ready with roadmap tag), 6 interactive security
    pillars (click to expand), uptime + security contact row.
    SectionNumber "08 · trust center" visible in background. ✓
  - Full-page scroll (~23.6k px, 20 sections rendered): 0 console errors. ✓
- VLM hero rating: 8/10 (held — "visually striking, technically
  sophisticated, effective dark-mode aesthetic").

## Round 11 (user request) — Dev server restart + Light mode SVG fixes

### Issue: "why ui not shown"
- User reported the preview showing "No content".
- Root cause: the **dev server had stopped running** (process died, no
  `next dev` in `ps`, curl returned HTTP 000). Not a code issue.
- Fix: restarted `bun run dev` in the background. Server came back in 1.3s.
- Verified: page loads HTTP 200, title + nav + hero content all render,
  0 console errors.

### Light mode SVG fixes (continuing from Round 10)
User uploaded two screenshots showing dark SVG cards on white background
in light mode. The hero MemoryGraph and Architecture diagram used hardcoded
dark hex colors (`#16181D`, `#0F1115`, `#E6E8EC`, `#8A8F98`, `#F4F6F8`,
`#0A0B0D`, `rgba(255,255,255,...)`) that didn't adapt to light mode.

1. **`globals.css`** — added 8 theme-aware SVG utility classes:
   `.svg-card-fill` (var(--surface)), `.svg-card-stroke` (var(--hairline-strong)),
   `.svg-chip-fill` (var(--surface-2)), `.svg-text-primary` (var(--ink)),
   `.svg-text-secondary` (var(--ink-mute)), `.svg-textbackdrop-fill`
   (var(--background)), `.svg-flowline` (var(--hairline-strong)),
   `.svg-flowline-mem` (var(--mem)). These work in SVG `fill`/`stroke`
   via CSS classes, adapting to dark/light automatically.

2. **`hero.tsx` MemoryGraph SVG** — replaced all hardcoded hex colors:
   - Agent cards (Support/Copilot/Tutor): fill → `.svg-card-fill`,
     stroke → `var(--hairline-strong)`, text → `.svg-text-primary`/secondary.
   - Core circle: inner ring fill → `var(--background)`, stroke →
     `var(--hairline-strong)`, hexagon stroke → `var(--mem)`, text backdrop
     → `.svg-textbackdrop-fill`, labels → `.svg-text-primary`/flowline-mem.
   - Pipeline chips (01–05): fill → `.svg-chip-fill`, stroke/text/dots →
     `var(--mem)` (via `.svg-flowline-mem`).
   - Flow line (core→model): stroke → `.svg-flowline-mem`.
   - Model card: same treatment as agent cards.
   - Returning arrow + orbiting nodes: → `.svg-flowline` / `.svg-flowline-mem`.

3. **`architecture.tsx` ArchFlow SVG** — replaced all hardcoded hex colors:
   - MemoryOS center box: fill → `.svg-card-fill`, stroke → `var(--mem)`.
   - Stage chips (ingest/extract/...): fill → `.svg-chip-fill`,
     stroke/dots → `var(--mem)`, text → `.svg-text-primary`.
   - ArchBox (User/App/Agent/Model): fill → `.svg-card-fill`,
     text → `.svg-text-primary`/secondary.
   - ArchBoxMini (App DB/Transcripts/Vector/Tools): fill → `.svg-chip-fill`,
     stroke → `var(--hairline-strong)`, text → `.svg-text-secondary`.
   - FlowArrow lines + arrowheads: → `.svg-flowline` (opacity 0.6).
   - Loop-back arrow + bottom caption: → `.svg-flowline` / secondary.
   - add()/get() labels: → `.svg-flowline-mem`.
   - **Fixed the "EXISTING SYSTEMS" text overlap**: moved the label
     `y` from -6 to -10 and the group `translate` y from 250 to 256 so it
     no longer collides with the Agent box above.

### Verification (light mode)
- VLM confirmed hero cards now use **white backgrounds with dark text**
  (Support/Copilot/Tutor, MemoryOS core, pipeline chips, Model card).
- VLM confirmed Architecture boxes use **light backgrounds with dark text**,
  connection lines are **visible** (no longer invisible), and **no text
  overlap** in the EXISTING SYSTEMS area.
- Dark mode still works: VLM confirmed dark backgrounds + light text +
  vibrant green accents, everything readable.
- `bun run lint`: clean.

## Round 10 — Unresolved / Risks + Next-Phase Recommendations
- **Light mode SVG polish** — ✅ DONE in Round 11 (hero + architecture
  SVGs now use theme-aware CSS variable classes).
- **Glossary keyboard nav** — arrow-key navigation between cards could be
  added (cards are buttons so already keyboard-accessible).
- **Metrics live data** — sparkline is a random walk; could be wired to
  real aggregated stats from the API if a stats endpoint existed.
- **Mobile lazy-loading** — requires multiple scroll-to-bottom triggers;
  could tune the IntersectionObserver rootMargin or remove
  content-visibility on mobile for smoother scroll.
- **Non-streaming `/api/memory/extract`** still exists as a fallback.
- **Trust Center** — could add a real status page embed or a security
  questionnaire download CTA.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark (default) + Light mode via next-themes.
- **Primary accent**: Electric mint — dark `oklch(0.92 0.17 145)`, light
  `oklch(0.55 0.16 150)`.
- **Secondary accents**: Warm amber, violet, rose — all theme-aware.
- **Typography**: Geist Sans (display) + Geist Mono (code/metadata).
- **Custom utilities**: `container-page`, `bg-grid`, `bg-dots`, `glass`,
  `hairline`, `ring-inset-hairline`, `glow-mem`, `text-gradient-mem`
  (theme-aware), `mask-fade-b/x`, `tabular`, `scroll-thin`, `noise-overlay`,
  `vignette`, `card-lift`, `section-divider`, `section-divider-glow`.
- **Keyframes**: `mem-pulse`, `mem-flow`, `mem-rise`, `mem-shimmer`, `mem-blink`,
  `mem-orbit`, `mem-orbit-slow`, `mem-marquee`. Reduced-motion respected.
- **Performance**: `content-visibility: auto` on offscreen sections; global
  `:focus-visible` outline; custom theme-aware scrollbar.

## File Map
```
src/app/layout.tsx              # ThemeProvider + OG image metadata
src/app/globals.css            # design system + card-lift + section-divider utilities
src/app/page.tsx               # section composition (22 sections + lazy)
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
  command-palette.tsx          # Cmd+K fast navigation (+ trust center)
  api-status.tsx               # live API health indicator
  theme-toggle.tsx             # dark/light mode toggle
  section-number.tsx           # editorial section index badge (10 sections)
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
  typing-terminal.tsx          # real SSE streaming trace replay (cycles 4 samples)
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start" + card-lift
  production.tsx               # 6 pillars + audit trail + needs grid + SectionNumber "06"
  architecture.tsx             # system diagram + request flow + SectionNumber "07"
  trust-center.tsx             # NEW: compliance badges + 6 security pillars + uptime row + SectionNumber "08"
  memory-passport.tsx          # interactive (drawer + grants + a11y)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials + card-lift
  metrics.tsx                  # live ops dashboard + sparkline + stat cards + SectionNumber "10"
  glossary.tsx                 # 8 interactive term cards + SectionNumber "11" + card-lift
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle + SectionNumber "12"
  faq.tsx                      # 8-question accordion + SectionNumber "13"
  changelog.tsx                # shipped + roadmap timeline + SectionNumber "14"
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ trust center link)
public/favicon.svg             # hexagon MemoryOS mark
public/og.png                  # 1344×768 social preview image
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
