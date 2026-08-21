# Immersive Sanctuary Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Tsukihara site around a persistent Three.js sanctuary scene, an eclipse-driven scroll journey and varied editorial chapters that reach the immersion level of the supplied reference without copying its code or artwork.

**Architecture:** Keep one fixed React Three Fiber canvas mounted behind the HTML story. The canvas derives a normalized page progress and interpolates camera, eclipse, fog, shrine and foreground states continuously. HTML sections expose semantic chapters and use GSAP/ScrollTrigger for masked reveals and restrained parallax while Lenis remains the single smooth-scroll engine.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, React Three Fiber / Three.js, GSAP + ScrollTrigger, Lenis, next/image.

**Spec:** `docs/superpowers/specs/2026-08-20-immersive-sanctuary-experience-design.md`

## Global Constraints

- Do not reuse or redistribute Kage source code or artwork.
- Preserve the existing Next.js/Tailwind/R3F/GSAP/Lenis stack; add no new runtime dependency.
- The eclipse must be one persistent WebGL object across the complete scroll.
- Preserve semantic anchors, mobile navigation and `prefers-reduced-motion`.
- Cap canvas DPR at 2 and avoid post-processing in this pass.
- Existing compressed raster assets must not be stretched destructively across full viewports.

---

### Task 1: Persistent sanctuary world

**Files:**

- Modify: `src/components/experience/world-canvas.tsx`

**Interfaces:**

- Consumes: browser scroll position and existing `@react-three/fiber` / `three` dependencies.
- Produces: `WorldCanvas` with one continuous `SanctuaryWorld`, persistent eclipse, shrine, torii, mountains, lanterns, grasses and multi-depth particles.

- [ ] **Step 1:** Replace the current background primitives with original shrine/torii/moon/foreground scene geometry.
- [ ] **Step 2:** Add normalized document progress and interpolate camera X/Y/Z, look target, fog and scene group offsets in `useFrame`.
- [ ] **Step 3:** Implement the moon as a group containing red disc, halo, crater marks and a dark shadow disc whose X position follows progress.
- [ ] **Step 4:** Add three particle planes with distinct Z-depths and drift speeds plus foreground reed/grass silhouettes.
- [ ] **Step 5:** Keep `Canvas` at `dpr={[1, 2]}`, pointer-events disabled through CSS, and simple basic/standard materials only.

**Verification:** TypeScript compile through `next build`; visually the static first frame must show foreground, midground and background separation.

### Task 2: Narrative page architecture

**Files:**

- Modify: `src/components/experience/experience-shell.tsx`
- Modify: `src/content/game.ts`

**Interfaces:**

- Consumes: `WorldCanvas`, current Tsukihara image assets and `realms` content.
- Produces: semantic chapters `#top`, `#manifesto`, `#realms`, `#akari`, `#bonds`, `#lore`, `#eclipse` and matching nav/rail state.

- [ ] **Step 1:** Rebuild the hero as an immersive sanctuary composition with centered logo/copy, Akari key art, Japanese vertical annotation and compact progress index.
- [ ] **Step 2:** Add a manifesto spread with a large statement, supporting lore paragraph and slim world-stat row.
- [ ] **Step 3:** Rebuild realms into one large feature frame plus two supporting frames using the existing Hanamori/Mizukyo/Kurogane assets.
- [ ] **Step 4:** Create alternating Akari and Haku character spreads with Japanese annotations and figure/copy parallax separation.
- [ ] **Step 5:** Add five lore chapter cells using Tsukihara-specific themes and restrained metadata.
- [ ] **Step 6:** Rebuild the closing as an Afterlight composition that relies on the persistent WebGL eclipse instead of a duplicate CSS moon.

**Verification:** Every adjacent chapter uses a different layout; all anchors work and every referenced image exists in `public/images`.

### Task 3: Motion choreography

**Files:**

- Modify: `src/components/experience/experience-shell.tsx`

**Interfaces:**

- Consumes: semantic `data-*` hooks in the story markup.
- Produces: GSAP/ScrollTrigger timelines for masked words, fade/blur handoffs, image parallax, hero exit and section-state tracking.

- [ ] **Step 1:** Keep the React-native `RevealWords` markup and animate only `.word-unit` children.
- [ ] **Step 2:** Add `[data-reveal]` masked vertical reveals and `[data-fade]` low-amplitude blur/fade reveals.
- [ ] **Step 3:** Add restrained `[data-parallax]` scrub animations with 3–8% travel.
- [ ] **Step 4:** Track active chapters through ScrollTrigger and update nav/rail state.
- [ ] **Step 5:** Disable scroll choreography when `prefers-reduced-motion: reduce` is active while preserving content visibility.

**Verification:** no DOM replacement after React mount; GSAP context and all triggers are cleaned up on unmount.

### Task 4: Premium editorial visual system

**Files:**

- Modify: `src/app/globals.css`
- Remove if obsolete: `src/app/editorial-overrides.css`
- Modify if required: `src/app/layout.tsx`

**Interfaces:**

- Consumes: class names emitted by `ExperienceShell`.
- Produces: responsive visual system with Bodoni/Didot/Mincho-inspired display type, Japanese vermilion annotations, fine rules, scene overlays and unique layouts per chapter.

- [ ] **Step 1:** Consolidate visual styles into `globals.css` and remove obsolete override rules.
- [ ] **Step 2:** Build hero layers so WebGL remains visible through transparent/gradient overlays rather than opaque section backgrounds.
- [ ] **Step 3:** Implement manifesto, archive, character, lore and closing layouts with deliberate negative space and responsive breakpoints.
- [ ] **Step 4:** Ensure existing small raster assets are framed rather than stretched; constrain Akari/Haku and realm media dimensions.
- [ ] **Step 5:** Add mobile adjustments for navigation, vertical Japanese annotations, archive stacking and reduced figure scales.
- [ ] **Step 6:** Preserve visible keyboard focus and readable contrast.

**Verification:** mobile CSS has no horizontal overflow; canvas remains fixed behind story; the hero contains at least three visually legible scene depths.

### Task 5: Quality gate and PR

**Files:**

- No product-code additions unless CI reports a defect.

**Interfaces:**

- Consumes: completed feature branch.
- Produces: a draft pull request with verified quality state and visual-review notes.

- [ ] **Step 1:** Run GitHub Actions `format:check`.
- [ ] **Step 2:** Run ESLint through the same workflow.
- [ ] **Step 3:** Run the Next.js production build through the same workflow.
- [ ] **Step 4:** Fix any concrete CI issue without disabling rules.
- [ ] **Step 5:** Open a draft PR to `main`, document the reference-derived principles, asset-quality limitation and preview status.
