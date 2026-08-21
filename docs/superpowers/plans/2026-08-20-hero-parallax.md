# Hero Parallax Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the provisional hero artwork with a reusable layered cinematic parallax using the seven supplied transparent PNG assets.

**Architecture:** Keep `ImmersiveExperience` as the owner of header, copy, locale, audio and page-level GSAP/Lenis behavior. Add a dedicated `HeroParallaxScene` client component that renders config-driven layers and performs pointer/scroll/ambient transform animation with refs + one RAF loop. CSS handles responsive composition; no new Canvas/Three.js is introduced for the hero layers.

**Tech Stack:** Next.js, React 19, TypeScript, Next Image, CSS transforms, GSAP/ScrollTrigger already present in the shell.

**Spec:** `docs/superpowers/specs/2026-08-20-hero-parallax-design.md`

## Global Constraints
- Preserve all existing header, copy, monumental title, logo, locale and audio functionality.
- Do not mirror or modify source character assets.
- Desktop layer order and depth values must match the approved spec exactly.
- Mobile <= 680 px disables pointer parallax.
- Tablet <= 980 px reduces amplitudes.
- `prefers-reduced-motion` renders a static complete scene.
- All decorative layers are pointer-inert and hidden from assistive technology.
- Animate transforms only; clean up all listeners and RAF loops.

---

### Task 1: Bring parallax assets into the feature branch

**Files:**
- Add: `public/parallax/*.png` from `main`

**Interfaces:**
- Produces: stable public asset URLs under `/parallax/`.

- [ ] Copy the seven existing blobs from `main` into `feat/immersive-world-i18n-audio` without changing their content.
- [ ] Verify all seven paths resolve in the branch and keep original PNGs untouched.

### Task 2: Add centralized hero layer configuration

**Files:**
- Create: `src/components/experience/hero-parallax-config.ts`

**Interfaces:**
- Produces: `HeroParallaxLayer` and `heroParallaxLayers`.

- [ ] Define typed metadata for id, asset, depth, loading priority, className and motion amplitude.
- [ ] Encode depths exactly as `0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.24`.
- [ ] Keep placement/scale values in CSS classes so responsive adjustments stay centralized in one stylesheet.

### Task 3: Implement `HeroParallaxScene`

**Files:**
- Create: `src/components/experience/hero-parallax-scene.tsx`

**Interfaces:**
- Consumes: `heroParallaxLayers`.
- Produces: `<HeroParallaxScene />`.

- [ ] Render all seven PNGs as absolutely positioned `next/image` layers with `aria-hidden` and `pointer-events: none`.
- [ ] Priority-load the moon and character layers only.
- [ ] Track normalized pointer coordinates in refs and update one RAF loop with damped interpolation.
- [ ] Add subtle hero-local scroll offset and autonomous drift for mist/tree/petals.
- [ ] Disable pointer transforms below 681 px; scale amplitudes down below 981 px.
- [ ] Short-circuit all motion when `prefers-reduced-motion` matches.
- [ ] Remove pointer, scroll, resize/media-query listeners and cancel RAF in cleanup.

### Task 4: Integrate the scene into the current hero

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`

**Interfaces:**
- Consumes: `HeroParallaxScene`.

- [ ] Insert `<HeroParallaxScene />` inside `#top` behind the hero UI layers.
- [ ] Remove the provisional standalone Akari hero image only.
- [ ] Preserve hero copy, logo, monumental `TSUKIHARA`, Japanese vertical text and scroll cue.
- [ ] Remove the old GSAP `data-hero-akari` animation because the new scene owns character movement.

### Task 5: Add responsive composition styles

**Files:**
- Modify: `src/app/immersive-v2.css`

**Interfaces:**
- Defines the full visual composition for `HeroParallaxScene`.

- [ ] Add a clipping scene root with no horizontal overflow and visual layers below UI text.
- [ ] Position the moon, temple, mist, sakura, ground, characters and petals according to the approved desktop composition.
- [ ] Ensure monumental `TSUKIHARA` can visually sit behind parts of characters while copy/logo/header remain above.
- [ ] Add tablet <= 980 px composition adjustments and lower visual amplitudes through CSS variables.
- [ ] Add mobile <= 680 px simplification: disable/hide temple and reduce mist before changing character readability.
- [ ] Add reduced-motion overrides that remove ambient animation classes/transitions.

### Task 6: Verify quality and visual constraints

**Files:**
- No source changes unless verification identifies a real issue.

**Interfaces:**
- Produces: evidence that the hero is safe to review visually.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run any repository test script if present.
- [ ] Run `npm run build`.
- [ ] Inspect at ~390, 768, 1440, 1920 and ultrawide widths.
- [ ] Confirm alpha transparency/no rectangular backgrounds, no overflow, no critical subject cropping and all header/copy/audio/language controls remain usable.
- [ ] Refine composition if inspection reveals crowding, weak depth or readability issues.
