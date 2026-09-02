# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 3 (cron review #3) — Current Status Assessment
Site was stable after Round 2: lint clean, 16 sections, ~18k px tall.
VLM hero rating: 8.5/10. All Round 2 features (interactive Memory Passport,
CommandPalette, Pricing, FAQ, hero pipeline wave) verified working.

## Round 3 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: the top
unresolved recommendation — **real backend integration via z-ai-web-dev-sdk**.

### New backend
1. **`src/app/api/memory/extract/route.ts`** (NEW API) — real LLM-backed
   memory extraction endpoint:
   - `POST /api/memory/extract` with `{ input, tenant?, user? }`.
   - Uses `z-ai-web-dev-sdk` (`ZAI.create()` → `chat.completions.create`)
     with a strict JSON-schema system prompt to extract a single durable
     memory candidate (type, text, confidence, evidence, conflict).
   - Builds the full 5-stage trace (ingest → extract → reconcile → govern →
     retrieve) + emits a prompt-ready governed context packet.
   - `GET` returns service metadata (used by the ApiStatus widget).
   - Hardened: JSON body validation, length cap (2000 chars), safe JSON parse
     with markdown-fence stripping, low-confidence fallback so the UI never
     breaks, 502 on SDK failure.

### New frontend components (2)
2. **`live-demo.tsx`** — REWRITTEN to call the real `/api/memory/extract`:
   - Now accepts **custom input** via a textarea (not just samples).
   - "Run decision" fetches the real API; stages animate sequentially while
     the call is in flight, then complete all at once when the response
     arrives.
   - **Decision log** renders the real trace details from the API
     (stage · detail string), not canned mockups.
   - **Response panel** shows the real `governed_context` XML returned by
     the LLM + an "extracted memory" card with type/confidence/evidence/
     conflict tags.
   - Badge updated to "live · llm-backed"; nav header shows job_id + latency.
   - Error state handled (rose-colored error log).
3. **`signals.tsx`** (NEW SECTION) — social proof:
   - 4-metric strip (94% less repetition, 6wk replaced, 5-stage audited,
     1-click revoke).
   - 3 testimonial cards with quotes, role, funding-stage tags, star
     ratings, and a transparent disclaimer (illustrative, not specific
     commitments).

### New widget
4. **`api-status.tsx`** — pings `GET /api/memory/extract` every 30s and
   shows an "api live · {latency}ms" indicator in the nav (desktop xl+).
   States: checking / ok / down. Communicates "this is a real product"
   without faking customer logos.

### Enhancements
- **`navigation.tsx`** — added ApiStatus to the right-side CTA row;
  updated Resources dropdown (Pricing, Signals, FAQ, Contact);
  extended SECTION_IDS with signals/pricing/faq.
- **`footer.tsx`** — added Signals + FAQ to the Resources column.
- **`page.tsx`** — added `<Signals />` between UseCases and Pricing.

### Page composition (new order, 17 sections)
Navigation(+ApiStatus) → Hero → Traction → Problem → WhereItFits →
ComparisonMatrix → Engines → HowItWorks → **LiveDemo (real LLM)** →
Developers(+TypingTerminal) → Onboarding → Production →
**MemoryPassport (interactive)** → UseCases → **Signals** → Pricing → FAQ →
FinalCTA → Footer + ScrollProgress + BackToTop + CommandPalette.

## Round 3 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200 (~10-15ms).
- agent-browser QA (desktop 1440×900):
  - Fresh load: 0 console errors, 17 sections, ~19.5k px. ✓
  - **API route tested directly** via curl: returns real LLM extraction
    (preference, conf 9.0, evidence, governed_context XML, 5-stage trace,
    latency_ms). ✓
  - **LiveDemo "Run decision" with sample**: all 5 stages show checkmarks;
    extracted memory card shows `preference · conf 9.0 · "prefers concise
    explanations"`; governed context XML rendered; tags lit. ✓
  - **LiveDemo with custom input** ("backend engineer, Go, Kubernetes…"):
    LLM extracted `preference · "prefers technical deep-dives over
    high-level summaries" · conf 9.0` — correctly picked the most durable
    signal. ✓
  - **ApiStatus** visible in nav as "api live · 38ms". ✓
  - **Signals** section renders 4 metrics + 3 testimonial cards with tags
    + stars + disclaimer. ✓
  - Full-page scroll (19,502 px): 0 console errors. ✓
- VLM hero rating improved: **8.5/10 → 9/10** ("Elite-tier developer
  infrastructure marketing"). Cited the live API status indicator and
  architectural specificity as the credibility signals that pushed it to 9.

## Round 3 — Unresolved / Risks + Next-Phase Recommendations
- **LLM latency** — extraction takes ~3-7s (cold) / ~1-3s (warm). The UI
  already animates stages during the call, but a streaming response would
  feel more "live". Consider SSE/streaming the trace stages as they
  complete.
- **Memory Passport** is still client-side only — could persist extracted
  memories into the passport via the same API (write through add()).
- **TypingTerminal** is still canned — could be wired to replay a real
  extraction trace.
- **OG/social preview image** — still no social card; generate with the
  image-generation skill.
- **Theme toggle (light mode)** — light tokens stubbed but unused.
- **Accessibility** — focus trap in command palette + drawer; `aria-live`
  for the consent feed and decision log.
- **Performance** — page is now 19.5k px; consider lazy-loading
  below-the-fold sections (Signals/Pricing/FAQ/CTA) for faster first paint.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark, technical, infrastructure-grade. Default dark theme.
- **Primary accent**: Electric mint `oklch(0.92 0.17 145)`.
- **Secondary accents**: Warm amber (conflict), violet (multi-agent), rose (revoke/error).
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
src/app/page.tsx               # section composition (17 sections + overlays)
src/app/api/memory/extract/route.ts  # NEW: real LLM extraction endpoint
src/hooks/use-scroll-spy.ts    # scroll-spy hook
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  scroll-progress.tsx          # top kinetic progress bar
  back-to-top.tsx              # floating back-to-top button
  animated-counter.tsx         # deterministic count-up
  magnetic-button.tsx          # cursor-magnetic CTA wrapper
  command-palette.tsx          # Cmd+K fast navigation
  api-status.tsx               # NEW: live API health indicator
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus
  hero.tsx                     # hero + MemoryGraph SVG (sequential pipeline wave)
  traction.tsx                 # proof strip + counters + marquee
  problem.tsx                  # Without/With + failure modes; shared primitives
  where-it-fits.tsx            # 5-layer stack comparison
  comparison-matrix.tsx        # 12×4 feature matrix
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # REWRITTEN: real LLM-backed playground
  typing-terminal.tsx          # self-typing CLI trace
  developers.tsx               # code tabs + token highlighter + typing terminal
  onboarding.tsx               # 3-step "how teams start"
  production.tsx               # 6 pillars + audit trail + needs grid
  memory-passport.tsx          # interactive (drawer + grant toggles)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # NEW: social proof + testimonials
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle
  faq.tsx                      # 8-question accordion
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer (+ signals/faq links)
public/favicon.svg             # hexagon MemoryOS mark
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
