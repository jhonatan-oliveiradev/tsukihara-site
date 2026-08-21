# Tsukihara Hero Eclipse Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current hero parallax with a pinned GSAP cinematic sequence that transforms a serene Tsukihara night into the crimson Kintsugi Lunar state before releasing scroll to the next section.

**Architecture:** A new focused `hero/` subsystem renders paired before/after layers from `public/hero-elements`. A single `useHeroTimeline` hook owns ScrollTrigger pinning and progress; ambient mist/petals and optional pointer parallax remain subordinate. Pure progress helpers are tested independently so phase interpolation is deterministic.

**Tech Stack:** Next.js 16, React 19, TypeScript, GSAP 3.13 + ScrollTrigger, Lenis 1.3, CSS transforms/masks, Next Image.

**Spec:** `docs/superpowers/specs/2026-08-21-hero-eclipse-sequence-design.md`

## Global Constraints
- Hero only; do not restructure sections below it.
- Use `public/hero-elements` as the definitive hero art source.
- Preserve header, language, audio, entry gate and copy functionality.
- Desktop >980px, tablet 681–980px, mobile <=680px.
- Respect `prefers-reduced-motion`.
- Do not add a hero canvas/Three.js scene.
- Next section must not visually enter until hero timeline progress reaches 1.

---

### Task 1: Measure and validate hero assets

**Files:**
- Create: `.github/workflows/hero-assets-inspect.yml` (temporary, remove before final PR)
- Create: `docs/superpowers/hero-assets-report.md`

**Produces:** exact width, height, mode/alpha and file size for every `public/hero-elements/*.png`.

- [ ] Add a temporary workflow using Pillow to inspect every new PNG.
- [ ] Run it and capture the generated report as an artifact/log.
- [ ] Commit the report to the feature branch.
- [ ] Remove the temporary inspection workflow.

### Task 2: Define deterministic timeline math with tests

**Files:**
- Create: `src/components/experience/hero/hero-timeline-math.ts`
- Create: `src/components/experience/hero/hero-timeline-math.test.mjs`
- Create: `.github/workflows/hero-tdd.yml` (temporary test runner if needed; remove before final PR)

**Interfaces:**
- Produces `clamp01(value)`, `rangeProgress(progress,start,end)`, `smoothRange(progress,start,end)`, and `phaseWeights(progress)`.

- [ ] Write failing tests for clamping, timeline range mapping and the six narrative phase intervals.
- [ ] Run tests and confirm RED because production helper is absent.
- [ ] Implement the minimal timeline math module.
- [ ] Run tests and confirm GREEN.
- [ ] Remove temporary runner once covered by final QA.

### Task 3: Build hero scene constants and layers

**Files:**
- Create: `src/components/experience/hero/constants/hero-scene.ts`
- Create: `src/components/experience/hero/hero-camera.tsx`
- Create: `src/components/experience/hero/hero-scene.tsx`
- Create: `src/components/experience/hero/layers/moon-layer.tsx`
- Create: `src/components/experience/hero/layers/environment-layer.tsx`
- Create: `src/components/experience/hero/layers/character-layer.tsx`
- Create: `src/components/experience/hero/layers/framing-layer.tsx`
- Create: `src/components/experience/hero/layers/petal-vortex.tsx`

**Interfaces:**
- Layers expose data attributes consumed by the master timeline (`data-hero-*`).
- `HeroCamera` wraps all scene layers and exposes `data-hero-camera`.

- [ ] Centralize asset paths, depth values, timeline labels and petal descriptors.
- [ ] Render normal and crimson layer pairs in identical geometry.
- [ ] Render left/right framing and controlled petal bands.
- [ ] Ensure all decorative layers are `aria-hidden` and pointer-inert.

### Task 4: Implement one master GSAP timeline

**Files:**
- Create: `src/components/experience/hero/hooks/use-hero-timeline.ts`
- Modify: `src/components/experience/immersive-experience.tsx`

**Consumes:** scene data attributes and timeline math.

**Produces:** a single ScrollTrigger with pin, scrub, responsive end distance and cleanup.

- [ ] Remove hero-specific legacy GSAP timeline from `ImmersiveExperience`.
- [ ] Create ScrollTrigger `pin: true`, `anticipatePin`, `invalidateOnRefresh`, responsive end distance.
- [ ] Coordinate all six phases: moon shadow/crossfade, sky color, environment pair interpolation, character entry/light, camera, mist, vortex intensity and final settling.
- [ ] Integrate Lenis with `ScrollTrigger.update` and refresh lifecycle so scrub stays synchronized.
- [ ] Add reduced-motion branch with shorter/simple interpolation.

### Task 5: Replace old hero rendering and style the scene

**Files:**
- Create: `src/components/experience/hero/tsukihara-hero.tsx`
- Create: `src/app/hero-eclipse-sequence.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/experience/cinematic-hero.tsx` or replace its import usage with `TsukiharaHero`.

- [ ] Preserve existing copy/logo/wordmark/scroll cue structure above the scene.
- [ ] Make hero stage exactly `100svh`; remove legacy `min-height: 205svh` sticky simulation for this hero.
- [ ] Compose layers based on measured aspect ratios using `clamp()` and responsive units.
- [ ] Keep left copy clean while adding left environmental framing and ground detail.
- [ ] Add atmospheric color/rim-light overlays instead of abrupt red filters.
- [ ] Add mobile/tablet deliberate composition rules and no horizontal overflow.

### Task 6: Retire legacy hero parallax implementation

**Files:**
- Delete or stop importing: `src/components/experience/hero-parallax-scene.tsx`
- Delete or stop importing: `src/components/experience/hero-parallax-config.ts`
- Modify: `src/app/immersive-overhaul.css` to remove conflicting hero rules, leaving below-the-fold chapters untouched.

- [ ] Confirm no old hero RAF/listeners are mounted.
- [ ] Remove only hero-specific legacy CSS that conflicts with the new subsystem.
- [ ] Keep all non-hero overhaul styles unchanged.

### Task 7: Production gates and visual timeline QA

**Files:**
- Create: `.github/workflows/hero-visual-qa.yml` (temporary; remove before final HEAD)

- [ ] Run `npm run format:check`, `npm run lint`, and `npm run build`.
- [ ] Run Chromium screenshots at progress ~0, .12, .28, .48, .68, .86, 1.0 in 1440×900.
- [ ] Capture 390×844, 768×1024, 1920×1080 and 2560×1080 final/representative states.
- [ ] Assert no horizontal overflow and next section top stays outside viewport for every progress <1.
- [ ] Verify reduced-motion mode.
- [ ] Refine positions/timing based on screenshots until composition reads as one scene.
- [ ] Remove temporary QA workflow.
- [ ] Re-run final Quality workflow on clean HEAD.
- [ ] Open/mark PR ready only after final visual and technical gates are green.