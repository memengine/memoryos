# MemoryOS Website Redesign — Worklog

## Project Overview
Complete redesign of https://memoryo.dev/ as a premium YC-level startup website.
The site is a single-page Next.js 16 app at `/` (`src/app/page.tsx`) composed of
modular section components under `src/components/site/`.

## Design System (in `src/app/globals.css`)
- **Aesthetic**: Dark, technical, infrastructure-grade. Default dark theme.
- **Primary accent**: Electric mint `oklch(0.92 0.17 145)` — "active/governed memory"
- **Secondary accents**: Warm amber `oklch(0.86 0.16 75)` (conflict), violet (multi-agent),
  rose (revoke/destructive).
- **Typography**: Geist Sans (display) + Geist Mono (code/metadata), no extra font deps.
- **Custom utilities**: `container-page`, `bg-grid`, `bg-dots`, `glass`,
  `hairline`, `ring-inset-hairline`, `glow-mem`, `text-gradient-mem`,
  `mask-fade-b/x`, `tabular`, `scroll-thin`, `noise-overlay`, `vignette`.
- **Keyframes**: `mem-pulse`, `mem-flow`, `mem-rise`, `mem-shimmer`, `mem-blink`,
  `mem-orbit`, `mem-orbit-slow`. Reduced-motion respected.

## Page Sections (in order)
1. **Navigation** (`navigation.tsx`) — sticky, scroll-aware. 4 dropdown groups
   (Product, Developers, Solutions, Resources), Docs + "Try MemoryOS" CTA,
   mobile hamburger w/ expand panel.
2. **Hero** (`hero.tsx`) — headline + subhead, dual CTAs, SDK chips, animated
   MemoryGraph SVG (agents → MemoryOS core → model, with orbiting nodes + flow
   lines), 4-up trust strip.
3. **Problem** (`problem.tsx`) — "Storage is the easy part." + Without/With
   comparison cards + 3 failure-mode cells (durable context loss, multi-agent
   drift, conflicting truth). Exports shared `SectionLabel`/`SectionHeading`.
4. **WhereItFits** (`where-it-fits.tsx`) — 5-layer stack comparison. MemoryOS
   row highlighted with green glow.
5. **Engines** (`engines.tsx`) — domain schema registry (General, EdTech, Support,
   Memory Passport).
6. **HowItWorks** (`how-it-works.tsx`) — scroll-driven 5-stage pipeline. Sticky
   diagram updates as user scrolls. Animated SVG pipeline with stage chips.
7. **LiveDemo** (`live-demo.tsx`) — interactive playground. Pick a sample →
   Run decision → stages Remember/Resolve/Consent animate → XML context output.
   No backend, fully client-side.
8. **Developers** (`developers.tsx`) — Python/TypeScript/REST/MCP code tabs with
   layout-animated active state (green accent + bottom bar). Custom token
   highlighter (no external dep). Copy-to-clipboard.
9. **Production** (`production.tsx`) — 6 pillars (quality gates, conflict
   resolution, provenance, lifecycle, graceful degradation, tenant isolation)
   with pseudo-code snippets. Audit trail mock + "Is this your problem?" grid.
10. **MemoryPassport** (`memory-passport.tsx`) — passport-style card mockup +
    consent ledger timeline + 6 capability cells.
11. **UseCases** (`use-cases.tsx`) — 4 cards w/ distinct visual identities:
    Customer Support (issue list), Education (progress bars), Memory Passport
    (grant table), Multi-agent (animated SVG diagram).
12. **FinalCTA** (`final-cta.tsx`) — big headline + 3 CTAs + 4-up stats strip.
13. **Footer** (`footer.tsx`) — brand block + 4 link columns + status pill +
    legal row. Sticky to bottom via `mt-auto` on flex-col root layout.

## Layout (`src/app/layout.tsx`)
- `<html className="dark">` — dark theme is default.
- Body has `min-h-screen flex flex-col` so footer sticks to bottom and is
  pushed down naturally on long pages.
- Metadata: title, description, OG/Twitter cards, keywords, favicon.

## Verification (agent-browser + VLM)
- Lint: clean (`bun run lint`).
- Dev log: no runtime errors during testing.
- Hero VLM rating: **8–8.5/10** ("YC-caliber infrastructure company").
- Interactive tests:
  - Nav dropdowns expand and show descriptions. ✓
  - Mobile hamburger menu expands correctly. ✓
  - Live Demo "Run decision" animates stages and emits XML context. ✓
  - Developer tabs switch with green active state. ✓
- Mobile viewport (iPhone 14, 390×844) hero & menu render cleanly.
- Fixed during verification:
  - Hero SVG: shortened "INGEST · GOVERN · RETRIEVE" → "GOVERNED CONTEXT",
    "prompt + governed ctx" → "prompt + ctx", added text backdrop, smaller
    hexagon — fixes text clipping in central core & Model card.
  - Dev tabs: stronger active state (green bg + bottom bar).
  - Secondary hero CTA: brighter text for WCAG-friendly contrast.
  - Hero: added subtle radial fade + noise overlay for premium feel.

## Cron Job
A recurring `webDevReview` cron job runs every 15 minutes (Asia/Shanghai) to
auto-QA and continue iterating on the site.

## File Map
```
src/app/layout.tsx              # dark theme, metadata, sticky footer wrapper
src/app/globals.css            # design system: tokens, utilities, keyframes
src/app/page.tsx               # section composition
src/components/site/
  logo.tsx                     # LogoMark + Logo + Wordmark
  navigation.tsx               # sticky nav + dropdowns + mobile menu
  hero.tsx                     # hero + MemoryGraph SVG
  problem.tsx                  # Without/With + failure modes; shared Section primitives
  where-it-fits.tsx            # 5-layer stack comparison
  engines.tsx                  # domain schema registry
  how-it-works.tsx             # scroll-driven 5-stage pipeline
  live-demo.tsx                # interactive playground
  developers.tsx               # code tabs + token highlighter
  production.tsx               # 6 pillars + audit trail + needs grid
  memory-passport.tsx          # passport card + consent feed
  use-cases.tsx                # 4 distinct use-case cards
  final-cta.tsx                # closing CTA + stats strip
  footer.tsx                   # footer
public/favicon.svg             # hexagon MemoryOS mark
```

## Notes for Next Phase
- No backend integration yet — LiveDemo and Developer code are static.
- Memory Passport card is a mockup; not interactive yet.
- Could add: live API playground backed by z-ai-web-dev-sdk, blog/docs routes,
  theme toggle (light mode tokens are stubbed in globals.css but unused).
