# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 6 (cron review #6) — Current Status Assessment
Site was stable after Round 5: lint clean, 19 sections, ~22k px tall.
VLM hero rating: 9/10. Theme toggle, OG image, accessibility hardening all
working. Real LLM backend + LiveDemo→Passport persistence verified.

## Round 6 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: the #1
unresolved recommendation — **streaming extraction (SSE)** so the LiveDemo
feels truly "live", plus light-mode polish, performance, and a11y.

### Streaming extraction (SSE) — the headline feature of this round
1. **`src/app/api/memory/extract-stream/route.ts`** (NEW API) — a
   Server-Sent Events endpoint that streams each pipeline stage as it
   completes, instead of returning the full trace at once:
   - `POST /api/memory/extract-stream` with `{ input, tenant?, user? }`.
   - Emits `data:` events: `{type:"stage",stage,detail,at}` per stage,
     then `{type:"result",job_id,memory,governed_context,latency_ms}`,
     then `{type:"done"}` (or `{type:"error"}` on failure).
   - Real LLM call happens during the "extract" stage; the other 4 stages
     have small artificial delays (180–350ms) so the user sees them flow.
   - Uses `ReadableStream` + `text/event-stream` headers + `X-Accel-Buffering: no`.
   - Same hardened JSON parsing + fallback as the non-streaming endpoint.
2. **`live-demo.tsx`** — rewired `run()` to consume the SSE stream:
   - Fetches `/api/memory/extract-stream`, reads the stream with
     `getReader()` + `TextDecoder`, parses SSE events split by `\n\n`.
   - On each `stage` event: sets the stage active, then marks it done 200ms
     later (so the user sees the "active" pulse), and pushes to the live
     trace buffer.
   - On `result`: assembles the full `ApiResponse` (with the accumulated
     trace) and sets the result + completes all stages.
   - Badge now shows **"streaming · sse"** while running, "live · llm-backed" idle.
   - Removed the old fake-timer-based stage reveal — stages now advance
     based on **real** backend progress.

### Performance + a11y + styling polish
3. **`globals.css`** — added `content-visibility: auto` +
   `contain-intrinsic-size: auto 600px` on `section[id]:not(#top)` so the
   browser skips rendering work for offscreen sections. Hero always renders.
4. **`globals.css`** — global `:focus-visible` outline (2px mint, offset 2px)
   for all interactive elements; custom page scrollbar (theme-aware track +
   thumb with mint hover).
5. **`typing-terminal.tsx`** — terminal background now theme-aware:
   `bg-background dark:bg-[#0A0B0D]` so it's light in light mode (matches
   the page) and stays the conventional dark in dark mode.
6. **`section-number.tsx`** (from Round 5) — available for editorial rhythm.

## Round 6 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200.
- **Streaming endpoint tested directly** via `curl -N`: emits 5 stage
  events over ~2.2s, then the result + done. Real LLM extraction
  (`preference · conf 9.0 · "prefers concise explanations"`). ✓
- agent-browser QA (desktop 1440×900):
  - **Streaming LiveDemo**: clicked "Run decision" → button showed
    "Extracting…" with spinner → all 5 stages got green checkmarks →
    extracted memory card showed `preference · conf 9.0` → governed
    context XML rendered. ✓
  - **Theme toggle**: light mode renders cleanly (terminal adapts to
    light background); dark mode unchanged. ✓
  - Full-page scroll (dark mode): 0 console errors. ✓
- VLM hero rating: **9/10** (held — "technically impressive, developer-first,
  uses real-time streaming and a sharp dark-mode aesthetic to make an
  abstract infrastructure product feel tangible and alive").

## Round 6 — Unresolved / Risks + Next-Phase Recommendations
- **TypingTerminal** is still canned — could replay a real extraction trace
  via the same SSE stream.
- **Light mode polish** — a few inline SVG hex colors in Architecture
  (`#0F1115`, `#16181D`) remain hardcoded; they render fine but don't
  adapt to light mode. Low priority since the diagram is legible in both.
- **Apply `SectionNumber`** to each section for editorial rhythm (component
  exists, not yet wired into sections).
- **Mobile QA** — Architecture SVG is wide; verify horizontal scroll on mobile.
- **Non-streaming `/api/memory/extract`** still exists as a fallback; could
  be removed or kept for non-SSE clients.

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
src/app/page.tsx               # section composition (19 sections + lazy)
src/app/api/memory/extract/route.ts        # real LLM extraction (non-streaming)
src/app/api/memory/extract-stream/route.ts # NEW: streaming SSE extraction
src/hooks/use-scroll-spy.ts    # scroll-spy hook
src/hooks/use-extracted-memory.ts    # pub/sub for LiveDemo → Passport
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  scroll-progress.tsx          # top kinetic progress bar
  back-to-top.tsx              # floating back-to-top button
  animated-counter.tsx         # deterministic count-up
  magnetic-button.tsx          # cursor-magnetic CTA wrapper
  command-palette.tsx          # Cmd+K fast navigation
  api-status.tsx               # live API health indicator
  theme-toggle.tsx             # dark/light mode toggle
  section-number.tsx           # editorial section index badge
  lazy-section.tsx             # IntersectionObserver lazy wrapper
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus + ThemeToggle
  hero.tsx                     # hero + MemoryGraph SVG
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes; shared primitives
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # REWRIRED: real LLM SSE streaming playground
  typing-terminal.tsx          # self-typing CLI trace (theme-aware bg)
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid
  architecture.tsx             # system diagram + request flow
  memory-passport.tsx          # interactive (drawer + grants + a11y)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle
  faq.tsx                      # 8-question accordion
  changelog.tsx                # shipped + roadmap timeline
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer
public/favicon.svg             # hexagon MemoryOS mark
public/og.png                  # 1344×768 social preview image
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
