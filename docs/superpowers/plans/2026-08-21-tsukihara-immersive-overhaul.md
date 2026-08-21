# Tsukihara Immersive Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Tsukihara site into a coherent premium cinematic game presentation with scroll-directed chapters, stronger use of existing HQ assets, selective Paper Shaders effects, a compact realm atlas, a visual Kintsugi Lunar mechanic reveal, and an authored epilogue/footer.

**Architecture:** Keep `ImmersiveExperience` as the global shell for locale, audio, header, preloader, Lenis and shared GSAP lifecycle, while moving each major narrative chapter into a focused component. Introduce a reusable Paper Shaders wrapper with a standard-image fallback. Replace the tall static section stack with pinned/scrubbed chapter choreography and shared atmospheric assets.

**Tech Stack:** Next.js 16.3.1, React 19, TypeScript, GSAP + ScrollTrigger, Lenis, Three.js/R3F, Next Image, `@paper-design/shaders-react`, CSS.

**Spec:** `docs/superpowers/specs/2026-08-21-tsukihara-immersive-overhaul-design.md`

## Global Constraints

- Start from `main` via `feat/immersive-overhaul-main`.
- Preserve PT/EN, preloader, audio controls and existing entry gate.
- Paper Shaders must be selective and never replace canonical art permanently.
- Use `assets_hq` and `secret-pathways-assets` aggressively where composition benefits.
- Do not expose DLC concepts.
- Hero, Kintsugi and chapter transitions must have complete `prefers-reduced-motion` fallbacks.
- Validate 390, 768, 1440, 1920 and 2560+ widths.
- No horizontal overflow.

---

### Task 1: Add shader dependency and reusable shader image wrapper

**Files:**

- Modify: `package.json`
- Create: `src/components/experience/shader-image.tsx`

**Interfaces:**

- Produces: `ShaderImageProps` and `ShaderImage` for character/realm image treatments.

- [ ] Add `@paper-design/shaders-react` to dependencies.
- [ ] Implement `ShaderImage` as a client component that always renders a normal image fallback and conditionally overlays `LensDistortion`, `Heatmap` or `LiquidMetal` based on a `variant` prop.
- [ ] Respect `prefers-reduced-motion` by setting shader speed/motion to static values or hiding the overlay.
- [ ] Cap shader processing using `maxPixelCount`/pixel ratio props where supported.
- [ ] Run `npm install`, `npm run format:check`, `npm run lint`.

### Task 2: Rebuild the hero as a pinned cinematic stage

**Files:**

- Create: `src/components/experience/cinematic-hero.tsx`
- Modify: `src/components/experience/hero-parallax-scene.tsx`
- Modify: `src/components/experience/hero-parallax-config.ts`
- Create: `src/app/immersive-overhaul.css`

**Interfaces:**

- `CinematicHero({ copy, locale })` renders `#top` and uses the existing `HeroParallaxScene` as the layered stage.

- [ ] Extend hero parallax config with foreground layers from `secret-pathways-assets` where useful.
- [ ] Make scroll the primary parallax input and pointer motion secondary.
- [ ] Keep the visual stage pinned/viewport-bound while the hero wrapper provides ~190–210svh of scroll travel.
- [ ] Choreograph copy, logo, monumental word, Akari group, mist, moon, temple and foreground with GSAP data hooks.
- [ ] Add continuous ambient mist/branch/petal movement without animated heavy filters.
- [ ] Add CSS atmosphere that unifies lighting and prevents the layers from reading as separate cutouts.
- [ ] Ensure the hero dissolves gradually into the Kintsugi chapter.

### Task 3: Build the Kintsugi Lunar restoration chapter

**Files:**

- Create: `src/components/experience/kintsugi-chapter.tsx`
- Modify: `src/content/immersive-copy.ts`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `KintsugiChapter({ copy, locale })` renders `#gate` and exposes `[data-kintsugi-progress]` elements for the global GSAP timeline.

- [ ] Use an HQ Hanamori environment image as the base scene.
- [ ] Render a second restored layer with a CSS clip-path/mask whose reveal is controlled by scroll.
- [ ] Add a narrow luminous seam / memory line using gradients and a low-intensity `Warp` shader accent or CSS fallback.
- [ ] Add copy explaining that Akari chooses which forgotten fragments to restore and when.
- [ ] On reduced motion, render the fully restored state with no pinning.

### Task 4: Replace the oversized realm grid with a compact realm atlas

**Files:**

- Create: `src/components/experience/realm-atlas.tsx`
- Modify: `src/content/game.ts`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `RealmAtlas({ copy })` renders `#realms` using the three current realm records.

- [ ] Keep Hanamori, Mizukyo and Kurogane HQ imagery.
- [ ] Implement a compact active-realm stage plus index rail instead of three tall static cards.
- [ ] On desktop, use scroll/hover to crossfade/clip between realm images while keeping section height controlled.
- [ ] Apply a short-lived low-spread Paper `LensDistortion` overlay to the active image during state change/hover.
- [ ] On mobile, render a horizontal snap strip or compact stacked version without shader dependency on interaction.

### Task 5: Elevate the gameplay trailer chapter

**Files:**

- Create: `src/components/experience/trailer-chapter.tsx`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `TrailerChapter({ copy, locale })` renders the gameplay video chapter.

- [ ] Use `/assets_hq/video_battle.mp4` as the dominant visual field.
- [ ] Add a veil that opens as the section enters and a subtle scrubbed scale movement.
- [ ] Place `shrine-ruins`, `tall-grass` or `basalt-stones` foreground elements around the video stage to integrate it with the world.
- [ ] Keep autoplay muted/loop/playsInline and preserve user soundtrack behavior independently.

### Task 6: Create premium Akari character spotlight

**Files:**

- Create: `src/components/experience/character-spotlight.tsx`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `CharacterSpotlight({ copy, locale })` renders `#akari`.

- [ ] Use `AKARI_NO_REI_CANONICAL_MODEL_V02.png` as the canonical art.
- [ ] Add `ShaderImage` as a secondary silhouette echo, using low-intensity LensDistortion/Heatmap/LiquidMetal treatment inspired by Kage-like transition energy.
- [ ] Use side/idle reference assets as secondary editorial strips only where they improve hierarchy.
- [ ] Add Mochi image from `assets_hq/mochi.png` as a smaller companion beat.
- [ ] Keep copy focused on Akari's missing memory, the guilt others remember and Haku/Mochi's role in the journey.

### Task 7: Replace lore cards with experience pillars

**Files:**

- Create: `src/components/experience/experience-pillars.tsx`
- Modify: `src/content/immersive-copy.ts`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `ExperiencePillars({ copy })` renders `#lore`.

- [ ] Replace generic lore cards with five game-system chapters: Kintsugi Lunar, isometric overworld, 2.5D Metroidvania, combat/bosses, Haku & Mochi/secrets.
- [ ] Use thin editorial rails, numbered chapter progress and occasional background fragments from `temple-wall`, `stone-lantern`, `garden-bush` or `maple-leaves`.
- [ ] Animate chapter activation with small line/kanji movement, not card tilt.

### Task 8: Build an authored cinematic epilogue/footer

**Files:**

- Create: `src/components/experience/cinematic-epilogue.tsx`
- Modify: `src/app/immersive-overhaul.css`

**Interfaces:**

- `CinematicEpilogue({ copy })` renders `#eclipse` and final navigation/footer controls.

- [ ] Combine the final narrative section and footer into one composed ending.
- [ ] Use Blood Moon, restrained Akari/foreground art, sparse petals and official tagline/theme language.
- [ ] Include minimal navigation, project/development note, language/sound references where appropriate without a generic box footer.
- [ ] Slow ambient motion toward the end of the page.

### Task 9: Refactor shell and global motion orchestration

**Files:**

- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/immersive-v2.css`
- Modify: `src/app/immersive-polish.css`

**Interfaces:**

- `ImmersiveExperience` retains locale/audio/menu state and composes all new chapter components.

- [ ] Replace existing inline section markup with the new chapter components.
- [ ] Consolidate GSAP setup into chapter data hooks and avoid duplicate ScrollTriggers.
- [ ] Keep nav anchors stable: `#top`, `#gate`, `#realms`, `#akari`, `#lore`, `#eclipse`.
- [ ] Preserve header Japanese hover, PT/EN and simplified sound control.
- [ ] Ensure old styles do not fight the new overhaul stylesheet; remove/neutralize obsolete rules only where required.

### Task 10: Full verification and visual QA

**Files:**

- Temporary QA workflow only if Vercel preview is unavailable; remove it before final PR state.

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Verify preloader → entry → hero → Kintsugi → realms → trailer → Akari → pillars → epilogue in Chromium.
- [ ] Capture 390, 768, 1440, 1920 and 2560 screenshots.
- [ ] Check horizontal overflow and reduced-motion rendering.
- [ ] Check that shaders never obscure canonical art and are disabled/static in reduced-motion.
- [ ] Remove temporary QA workflow/artifacts from the branch.
- [ ] Re-run format, lint and build on the final clean HEAD.
- [ ] Open PR `feat/immersive-overhaul-main` → `main` with visual QA notes.
