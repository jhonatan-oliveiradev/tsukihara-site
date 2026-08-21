# Kage Engine Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Kage's continuous WebGL/editorial interaction model into the Tsukihara Next.js site as an educational implementation.

**Architecture:** React owns the editorial document and interaction state. React Three Fiber owns one persistent world, while `scroll-path.ts` converts page progress into interpolated camera/moon/fog state. Binary Tsukihara assets plug into stable manifest paths later without changing the core choreography.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, React Three Fiber, Three.js, GSAP ScrollTrigger, Lenis.

**Spec:** `docs/superpowers/specs/2026-08-20-kage-engine-port-design.md`

## Global Constraints

- Preserve explicit Kage attribution.
- No hard scene swaps; one WebGL world persists through the document.
- Keep reduced-motion support.
- Keep the site functional before the supplied GLTF/MP3 binaries are committed.
- Run Prettier, ESLint and production build before visual review.

---

### Task 1: Scroll director

**Files:**
- Create: `src/experience/kage-port/scroll-path.ts`
- Modify: `src/components/experience/world-canvas.tsx`

- [x] Define five composed camera shots with position, look target, fog, moon position/scale and eclipse phase.
- [x] Interpolate shots with smoothed local progress.
- [x] Drive the R3F camera and scene fog from sampled state.

### Task 2: Persistent world

**Files:**
- Modify: `src/components/experience/world-canvas.tsx`

- [x] Add layered ridges, shrine geometry and torii at different depths.
- [x] Add persistent eclipse moon and shadow-disc progression.
- [x] Add lantern flicker, three petal planes and pointer-responsive embers.

### Task 3: Editorial chapter port

**Files:**
- Modify: `src/components/experience/experience-shell.tsx`
- Modify: `src/content/game.ts`
- Create: `src/app/kage-port.css`
- Modify: `src/app/layout.tsx`

- [x] Rebuild information architecture as hero, threshold, realm archive, Akari spread, lore grid and afterlight.
- [x] Keep word reveals, smooth scrolling and active chapter navigation.
- [x] Add explicit sound/silent entry gate and soundtrack control wiring.

### Task 4: Asset integration contract

**Files:**
- Create: `src/experience/kage-port/assets.ts`
- Create: `docs/ATTRIBUTION-KAGE.md`

- [x] Define stable paths for soundtrack, Japanese temple GLTF and crimson katana GLTF.
- [x] Record educational source attribution.
- [ ] Copy binary soundtrack/model assets into those paths when a binary-capable repository channel is available.
- [ ] Replace procedural shrine with the supplied GLTF and add the katana transition after the files are versioned.

### Task 5: Verification

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Open a draft PR and keep visual review as a separate gate before merge.
