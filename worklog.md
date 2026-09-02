# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
Single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of modular
section components under `src/components/site/`.

---

## Round 5 (cron review #5) — Current Status Assessment
Site was stable after Round 4: lint clean, 19 sections, ~22k px tall.
VLM hero rating: 9/10. Real LLM backend + LiveDemo→Passport persistence
working. All Round 4 features (Architecture, Changelog, lazy-loading,
persistence flow) verified.

## Round 5 — Goals / Completed Modifications
Mandate: more styling detail + more features/functionality. Focus: the top
unresolved recommendations — **theme toggle (light/dark mode)**, **OG image**,
**accessibility hardening**, styling polish.

### Theme toggle (light/dark mode) — the headline feature of this round
1. **`layout.tsx`** — wrapped app in `next-themes` `<ThemeProvider>` with
   `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`,
   `disableTransitionOnChange`. Removed the hardcoded `className="dark"` on
   `<html>` so the theme is driven by next-themes (persisted to localStorage).
2. **`globals.css`** — split `:root` (light mode) and `.dark` (dark mode)
   into two complete token sets:
   - **Light mode**: white/near-white backgrounds, darker mint
     (`oklch(0.55 0.16 150)`) for contrast, darker amber/violet/rose, dark
     ink on light surface, dark hairlines (rgba on dark ink).
   - **Dark mode**: unchanged (the original aesthetic).
   - Made `text-gradient-mem`, `text-gradient-ink`, and `::selection`
     theme-aware via CSS variables (`var(--ink)`, `var(--mem)`, etc.).
   - Added `transition: background-color 0.3s, color 0.3s` on `body` for
     smooth theme switching.
3. **`theme-toggle.tsx`** (NEW) — Sun/Moon icon button using `useTheme()`.
   SSR-safe (mounts before showing icon to avoid hydration mismatch).
   Focus-visible styling. Added to both desktop nav (right CTA row) and
   mobile menu (under an "appearance" label).

### OG / social preview image
4. **`public/og.png`** (NEW) — generated a 1344×768 social preview image
   via the image-generation skill (`z-ai image`). Dark, technical, hexagonal
   grid + glowing mint hexagon + data flow nodes — matches the brand.
   Referenced in `layout.tsx` metadata `openGraph.images` and
   `twitter.images`.

### Accessibility hardening
5. **`memory-passport.tsx`** ProvenanceDrawer:
   - `aria-modal="true"` + `aria-hidden="true"` on the backdrop.
   - Focus trap: close button auto-focuses 50ms after open.
   - `Escape` key closes the drawer.
   - Close button has `focus:ring-2 focus:ring-mem/50` + improved
     `aria-label="Close provenance drawer"`.
6. **Consent ledger** `<ol>` — `aria-live="polite"` + `aria-label` so screen
   readers announce new grant/revoke/approve events as they stream in.

### Styling polish
7. **`section-number.tsx`** (NEW) — `SectionNumber` component: a large,
   faint section-index number (e.g. "04") that sits in the right margin of
   each section on desktop xl+, giving the page a magazine-like editorial
   rhythm. (Available for use; not yet applied to every section.)
8. Gradient text utilities made theme-aware (no more washed-out mint on
   light backgrounds).
9. Body color transition for smooth dark↔light switching.

## Round 5 — Verification Results
- `bun run lint`: clean.
- Dev log: 0 runtime errors; `GET /api/memory/extract` returning 200.
- agent-browser QA (desktop 1440×900):
  - **Dark mode** (default): 0 console errors, all sections render, hero
    VLM rating 9/10. ✓
  - **Light mode** (after toggle): `html.light`, background is white, 0
    console errors during full-page scroll. Headline gradient text
    readable (ink→mem gradient). ✓
  - **Theme toggle**: button present in desktop nav + mobile menu; clicking
    switches theme and persists to localStorage. ✓
  - **OG image**: `public/og.png` generated (106KB, 1344×768). ✓
  - **Drawer accessibility**: clicking a memory opens the drawer; close
    button is auto-focused (visible green focus ring); `Escape` key closes
    the drawer. ✓
  - **Consent ledger**: `aria-live="polite"` on the `<ol>`. ✓
  - Full-page scroll (dark mode, ~19k px): 0 console errors. ✓
- VLM hero rating: **9/10** (held — "technically dense, developer-first,
  masterfully uses contrast to visualize the before/after value prop").

## Round 5 — Unresolved / Risks + Next-Phase Recommendations
- **Streaming extraction (SSE)** — still the highest-value remaining UX
  improvement; the API returns the full trace at once after the LLM call
  (~1-7s). Streaming stages as they complete would feel more "live".
- **TypingTerminal** is still canned — could replay a real extraction trace.
- **Light mode polish** — a handful of components use hardcoded dark hex
  colors (e.g. `#0A0B0D`, `#16181D` in SVG fills and terminal backgrounds).
  These render fine but don't adapt to light mode. A full pass to replace
  them with `var(--surface)` / `var(--ink)` tokens would make light mode
  fully consistent. (The theme tokens themselves are complete; only a few
  inline hex values in SVGs remain.)
- **Apply `SectionNumber`** to each section for the editorial rhythm.
- **Performance** — could add `content-visibility: auto` to section wrappers.
- **Mobile QA** — Architecture SVG is wide; verify horizontal scroll on mobile.

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

## File Map
```
src/app/layout.tsx              # ThemeProvider + OG image metadata
src/app/globals.css            # design system: light + dark token sets
src/app/page.tsx               # section composition (19 sections + lazy)
src/app/api/memory/extract/route.ts  # real LLM extraction endpoint
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
  theme-toggle.tsx             # NEW: dark/light mode toggle
  section-number.tsx           # NEW: editorial section index badge
  lazy-section.tsx             # IntersectionObserver lazy wrapper
  navigation.tsx               # sticky nav + dropdowns + scroll-spy + ApiStatus + ThemeToggle
  hero.tsx                     # hero + MemoryGraph SVG
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
  architecture.tsx             # system diagram + request flow
  memory-passport.tsx          # interactive (drawer + grants + a11y: focus trap, Escape, aria-live)
  use-cases.tsx                # 4 distinct use-case cards
  signals.tsx                  # social proof + testimonials
  pricing.tsx                  # 3-tier pricing + monthly/annual toggle
  faq.tsx                      # 8-question accordion
  changelog.tsx                # shipped + roadmap timeline
  final-cta.tsx                # closing CTA + animated counters + magnetic CTA
  footer.tsx                   # footer
public/favicon.svg             # hexagon MemoryOS mark
public/og.png                  # NEW: 1344×768 social preview image
```

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai,
`fixed_rate: 900s`, job_id 353175) to auto-QA via agent-browser and continue
iterating on styling and features. This worklog is updated each round.
