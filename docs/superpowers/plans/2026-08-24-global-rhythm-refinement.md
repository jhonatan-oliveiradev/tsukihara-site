# Tsukihara Global Rhythm Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize the hero eclipse, materially shorten the site, improve Realm/Akari/Bestiary continuity, fold the trailer into Gameplay, and convert Lost Memories into a bounded horizontal archive on desktop without changing the established art direction.

**Architecture:** Implement the pass in four waves with isolated ownership: semantic hero beats and global density first; Realm interaction second; Akari/Bestiary continuity third; structural compression of Gameplay and Lost Memories last. Existing data contracts and viewer behavior stay intact. New WebGL work is isolated inside the realm ripple component, and desktop-only pinned behavior always has reduced-motion/mobile fallbacks.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, GSAP 3.13 + ScrollTrigger, Lenis 1.3, Next/Image, OGL 1.0.x for the water ripple only.

**Spec:** `docs/superpowers/specs/2026-08-24-global-rhythm-refinement-design.md`

## Global Constraints

- Preserve the current visual identity, content, navigation anchors, Mother Moon, Lost Memories viewer, and final epilogue/footer unless the spec explicitly changes them.
- Respect `prefers-reduced-motion` everywhere.
- Do not add a new site-wide pin sequence beyond the bounded desktop Lost Memories horizontal archive.
- Internal scroll regions must remain keyboard/wheel accessible.
- Do not trap keyboard navigation in sticky/pinned sections.
- Keep text present in the DOM while animated.
- Automated coverage stays minimal: only hero semantic-boundary regression tests plus format, lint, and production build.
- Mobile Lost Memories remains vertical; mobile/touch Realm ripple remains performant and may fall back to the static image.
- No new trailer modal/lightbox.

---

## File Structure

### New files

- `src/app/global-rhythm-refinement.css` — final cascade overrides for density, scrollbar, section handoffs, Realm list sizing, Bestiary stacking, and Akari transition masks.
- `src/components/experience/lost-memories/use-lost-memories-horizontal.ts` — desktop-only horizontal archive ScrollTrigger ownership.

### Existing files with focused changes

- `src/components/experience/hero/hero-timeline-math.ts` — semantic eclipse beat boundaries.
- `src/components/experience/hero/hero-timeline-math.test.ts` — only new behavioral regression coverage.
- `src/components/experience/hero/hooks/use-hero-timeline.ts` — copy changes driven by the semantic eclipse beats.
- `src/app/memory-bridge.css` — centered/contained Kintsugi separator.
- `src/app/layout.tsx` — imports final refinement stylesheet last.
- `src/components/experience/ripple-distortion-image.tsx` — replace generic lens distortion with OGL water displacement.
- `src/app/nine-realms-world.css` — water canvas surface styling and Realm Atlas density/overflow.
- `src/components/experience/realm-atlas.tsx` — bounded scrollable realm index and active-item visibility.
- `src/components/experience/nine-realms-map.tsx` — inspector width/overflow hardening.
- `src/components/experience/character-spotlight.tsx` — Akari entry/release hooks and Japanese→localized closing copy.
- `src/app/akari-chapter.css`, `src/app/akari-mosaic.css`, `src/app/akari-chapter-refinement.css` — reduced scroll distance and softened sticky handoffs.
- `src/components/experience/bestiary-bosses-chapter.tsx` — relocate transition phrase into restricted-boss editorial region.
- `src/app/bestiary-bosses.css`, `src/app/bestiary-inspector-refinement.css` — card stacking and transition-density reduction.
- `src/components/experience/gameplay-chapter.tsx` — compact combat reel using `/assets_hq/video_battle.mp4`.
- `src/app/gameplay-chapter.css` — reel framing and responsive sizing.
- `src/components/experience/immersive-experience.tsx` — remove standalone `TrailerChapter` and its obsolete GSAP selectors.
- `src/components/experience/lost-memories-chapter.tsx` — desktop horizontal track wrapper while preserving viewer state ownership.
- `src/components/experience/lost-memories/archive-table.tsx` — mark archive groups as horizontal panels without changing record contracts.
- `src/components/experience/lost-memories/use-lost-memories-motion.ts` — retain local micro-motion, avoid competing vertical ScrollTriggers on desktop horizontal mode.
- `src/app/lost-memories-chapter.css`, `src/app/lost-memories-crops-refinement.css` — horizontal table dimensions and vertical fallback.
- `package.json`, `package-lock.json` — add `ogl` and a focused hero test command.
- `.github/workflows/ci.yml` — run only the focused hero regression before format/lint/build.

---

### Task 1: Semantic eclipse beats and synchronized hero copy

**Files:**
- Modify: `src/components/experience/hero/hero-timeline-math.ts`
- Modify: `src/components/experience/hero/hero-timeline-math.test.ts`
- Modify: `src/components/experience/hero/hooks/use-hero-timeline.ts`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `HERO_ECLIPSE_BEATS` and `heroCopyPhase(progress)`.
- `heroCopyPhase(progress)` returns `"intro" | "transit" | "crimson"`.
- The visual timeline and copy timeline consume the same normalized boundaries.

- [ ] **Step 1: Add failing semantic-boundary regression tests**

Update `hero-timeline-math.test.ts` to import `HERO_ECLIPSE_BEATS` and `heroCopyPhase`, then add:

```ts
test("hero copy follows visible eclipse contact, transit and crimson beats", () => {
  const { contact, crimson } = HERO_ECLIPSE_BEATS;

  assert.equal(heroCopyPhase(contact - 0.001), "intro");
  assert.equal(heroCopyPhase(contact), "transit");
  assert.equal(heroCopyPhase((contact + crimson) / 2), "transit");
  assert.equal(heroCopyPhase(crimson - 0.001), "transit");
  assert.equal(heroCopyPhase(crimson), "crimson");
});
```

- [ ] **Step 2: Add the smallest semantic helper**

In `hero-timeline-math.ts`, define the normalized visual boundaries around the existing moon-shadow choreography:

```ts
export const HERO_ECLIPSE_BEATS = {
  contact: 0.24,
  transitEnd: 0.68,
  crimson: 0.68,
} as const;

export type HeroCopyPhase = "intro" | "transit" | "crimson";

export const heroCopyPhase = (progress: number): HeroCopyPhase => {
  if (progress < HERO_ECLIPSE_BEATS.contact) return "intro";
  if (progress < HERO_ECLIPSE_BEATS.crimson) return "transit";
  return "crimson";
};
```

If visual validation shows first physical contact occurs a few hundredths earlier/later, change only `HERO_ECLIPSE_BEATS`; do not reintroduce independent copy timestamps.

- [ ] **Step 3: Rewire copy animation to semantic visual beats**

In `use-hero-timeline.ts`, remove the current copy tweens positioned at timeline times `0.9`, `1.55`, `1.65`, `4.35`, and `4.55` as timing owners. Place copy crossfades at timeline positions derived from normalized beat values multiplied by the base 10-second timeline:

```ts
const contactAt = HERO_ECLIPSE_BEATS.contact * 10;
const crimsonAt = HERO_ECLIPSE_BEATS.crimson * 10;

// Intro stays visible until physical contact.
timeline
  .to(q("[data-copy-intro]"), { y: -24, opacity: 0, duration: 0.34 }, contactAt)
  .fromTo(
    q("[data-copy-omen]"),
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.38, ease: "power2.out" },
    contactAt + 0.12,
  )
  .to(q("[data-copy-omen]"), { y: -20, opacity: 0, duration: 0.32 }, crimsonAt - 0.18)
  .fromTo(
    q("[data-copy-eclipse]"),
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" },
    crimsonAt,
  );
```

Keep phase labels synchronized to the same points.

- [ ] **Step 4: Add the focused test command and CI step**

Add to `package.json`:

```json
"test:hero": "node --test src/components/experience/hero/hero-timeline-math.test.ts"
```

Add immediately after dependency installation in `.github/workflows/ci.yml`:

```yaml
- name: Hero timeline regression
  run: npm run test:hero
```

Do not add a general test framework.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run test:hero
npm run lint
```

Expected: hero regression passes; ESLint passes for touched files/project.

Commit:

```bash
git add src/components/experience/hero package.json package-lock.json .github/workflows/ci.yml
git commit -m "fix: sync hero copy with eclipse beats"
```

---

### Task 2: Global density, Kintsugi separator, and thematic scrollbars

**Files:**
- Create: `src/app/global-rhythm-refinement.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/memory-bridge.css`

**Interfaces:**
- Produces: final cascade overrides loaded after all chapter-specific refinement CSS.
- Nested scroll surfaces use `.ix-themed-scroll` or existing selectors targeted directly.

- [ ] **Step 1: Fix the separator at the source**

Replace the stretching rules in `memory-bridge.css`:

```css
.ix-kintsugi-entry-veil img {
  right: 50% !important;
  bottom: -18% !important;
  left: auto !important;
  width: min(92vw, 1380px) !important;
  height: 58% !important;
  object-fit: contain;
  object-position: center;
  transform: translateX(50%);
}
```

Use a proportional mobile width, still `contain`; never return to `object-fit: fill`.

- [ ] **Step 2: Add global rhythm and scrollbar CSS**

Create `global-rhythm-refinement.css` with final-cascade rules:

```css
:root {
  --scroll-track: #050507;
  --scroll-thumb: #6f303b;
  --scroll-thumb-hover: #9b5660;
}

html {
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
  scrollbar-width: thin;
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--scroll-track); }
::-webkit-scrollbar-thumb {
  border: 2px solid var(--scroll-track);
  border-radius: 999px;
  background: linear-gradient(180deg, #7a3944, #4d252d);
}
::-webkit-scrollbar-thumb:hover { background: #8f4653; }

.ix-realm-index,
.ix-archive-horizontal-track {
  scrollbar-width: thin;
}

/* Reduce only oversized editorial entrances, not cinematic climax typography. */
.ix-realm-atlas-head h2,
.ix-world-map__intro h2,
.ix-forbidden-intro h2,
.ix-forbidden-transition h2 {
  font-size: clamp(3.25rem, 6.2vw, 7rem);
}
```

Add targeted padding reductions of approximately 15–25% to the section intro wrappers seen in visual review; do not use a universal `section { padding: ... }` rule.

- [ ] **Step 3: Import refinement CSS last**

In `layout.tsx`, import after all existing section/refinement files:

```ts
import "./global-rhythm-refinement.css";
```

- [ ] **Step 4: Verify density and reduced-motion behavior**

Run:

```bash
npm run format:check
npm run lint
```

Manual viewport checks: 1550×900, 1180×820, 390×844. Confirm separator remains centered and no global typography unexpectedly shrinks.

- [ ] **Step 5: Commit**

```bash
git add src/app/global-rhythm-refinement.css src/app/layout.tsx src/app/memory-bridge.css
git commit -m "style: tighten global rhythm and transition chrome"
```

---

### Task 3: Replace generic Realm lens effect with water ripple

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Rewrite: `src/components/experience/ripple-distortion-image.tsx`
- Modify: `src/app/nine-realms-world.css`

**Interfaces:**
- Keep the existing `RippleDistortionImageProps` API so `RealmAtlas` does not change for the shader replacement.
- OGL must be created/disposed inside the component; no global renderer.

- [ ] **Step 1: Add OGL only**

Run:

```bash
npm install ogl@^1.0.11
```

Do not add React Bits as a package. Implement the isolated behavior locally, informed by the reference interaction.

- [ ] **Step 2: Replace `LensDistortion` with an OGL displacement surface**

Remove `@paper-design/shaders-react/LensDistortion` usage from `ripple-distortion-image.tsx`. Build a full-screen OGL `Renderer`, `Triangle`, `Program`, and texture. Maintain a small fixed-size ripple buffer, e.g. 8 active ripples:

```ts
type WaterRipple = { x: number; y: number; age: number; strength: number };
const MAX_RIPPLES = 8;
```

The fragment shader must distort UVs with radial waves and decay rather than chromatic lens warping. Conceptually:

```glsl
vec2 displacedUv = vUv;
for (int i = 0; i < 8; i++) {
  vec2 delta = vUv - uRipplePos[i];
  float dist = length(delta);
  float wave = sin(dist * uFrequency - uRippleAge[i] * uSpeed);
  float envelope = exp(-dist * uSpread) * (1.0 - uRippleAge[i]);
  displacedUv += normalize(delta + 0.0001) * wave * envelope * uStrength;
}
gl_FragColor = texture2D(tMap, displacedUv);
```

Pointer movement injects a ripple only after minimum distance/time thresholds, leaving a decaying wake. Clamp device pixel ratio and pause RAF when the element is not visible.

- [ ] **Step 3: Preserve accessibility/performance fallbacks**

If `prefers-reduced-motion`, touch-only pointer, image load failure, or WebGL initialization failure occurs, render the existing Next/Image base without canvas interaction. Ensure renderer cleanup removes the canvas and cancels RAF.

- [ ] **Step 4: Update CSS for water canvas layering**

In `nine-realms-world.css`, keep the base image as fallback and layer the OGL canvas exactly over it:

```css
.ix-ripple-distortion__water {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}

.ix-ripple-distortion__water canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

Remove CSS concentric-ring visuals if they visually read as UI circles rather than water.

- [ ] **Step 5: Verify**

Run:

```bash
npm run format:check
npm run lint
npm run build
```

Visual acceptance: moving the pointer creates expanding liquid displacement/wake; stopping the pointer lets the surface settle; there is no purple/chromatic glitch effect.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/experience/ripple-distortion-image.tsx src/app/nine-realms-world.css
git commit -m "feat: replace realm lens effect with water ripple"
```

---

### Task 4: Compact Realm Atlas and remove inspector overflow

**Files:**
- Modify: `src/components/experience/realm-atlas.tsx`
- Modify: `src/components/experience/nine-realms-map.tsx`
- Modify: `src/app/nine-realms-world.css`
- Modify: `src/app/global-rhythm-refinement.css`

**Interfaces:**
- `activeRealm` remains the single selection source.
- The realm index becomes an internal vertical scroller on desktop, not a new tab system.

- [ ] **Step 1: Keep active realm visible in the internal list**

Add a ref to the selected index button and call `scrollIntoView({ block: "nearest" })` whenever `activeRealm` changes:

```ts
const activeButtonRef = useRef<HTMLButtonElement | null>(null);

useEffect(() => {
  activeButtonRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}, [activeRealm]);
```

Attach the ref only to the selected button.

- [ ] **Step 2: Bound the realm index height**

Desktop CSS:

```css
.ix-realm-index {
  max-height: min(62svh, 38rem);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding-right: 0.4rem;
}

.ix-realm-atlas-grid {
  align-items: start;
}
```

Shorten stage and section paddings enough that the stage + list fit materially closer to one viewport.

- [ ] **Step 3: Harden all Realm inspectors against horizontal overflow**

Apply to inspector/sheet content:

```css
.ix-world-map__inspector,
.ix-world-map__inspector-content,
.ix-world-map__sheet,
.ix-world-map__sheet * {
  min-width: 0;
}

.ix-world-map__inspector {
  width: min(22rem, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  overflow-x: clip;
}

.ix-world-map__inspector h3,
.ix-world-map__inspector p,
.ix-world-map__inspector dd {
  overflow-wrap: anywhere;
}
```

Do not use a horizontal scroll container as a workaround.

- [ ] **Step 4: Verify**

Manual: select Tsuki no Miya and other long-copy realms at 1550px, 1180px, 900px, 390px. Confirm no horizontal browser or inspector scrollbar appears.

Run:

```bash
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/realm-atlas.tsx src/components/experience/nine-realms-map.tsx src/app/nine-realms-world.css src/app/global-rhythm-refinement.css
git commit -m "refactor: compact nine realms exploration"
```

---

### Task 5: Smooth Akari sticky entry/release and animate manifesto

**Files:**
- Modify: `src/components/experience/character-spotlight.tsx`
- Modify: `src/app/akari-chapter.css`
- Modify: `src/app/akari-mosaic.css`
- Modify: `src/app/akari-chapter-refinement.css`
- Modify: `src/app/global-rhythm-refinement.css`

**Interfaces:**
- Existing `setPhase()` remains the detail state owner.
- New DOM hooks: `data-akari-details-shell`, `data-akari-release`, `data-akari-closing-copy`.

- [ ] **Step 1: Add explicit entry and release hooks**

Wrap the details stage with a shell or mark the existing container:

```tsx
<div
  className="akari-details akari-details--mosaic"
  data-akari-details-stage
  data-akari-details-shell
>
```

Mark the closing area after the mosaic with `data-akari-release`.

- [ ] **Step 2: Shorten the mosaic scroll runway**

Reduce desktop `.akari-details--mosaic` from `620svh` toward `420–460svh`. With six reveal states plus the complete state, target approximately 55–60svh of wheel travel per beat rather than ~88svh.

Keep mobile separately calibrated; do not blindly copy the desktop value.

- [ ] **Step 3: Add entry and release ScrollTriggers**

Inside the existing `gsap.context` in `CharacterSpotlight`:

```ts
if (detailStage) {
  gsap.fromTo(
    detailStage,
    { autoAlpha: 0.72, y: 40, clipPath: "inset(5% 0 0 0)" },
    {
      autoAlpha: 1,
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      ease: "none",
      scrollTrigger: { trigger: detailStage, start: "top 92%", end: "top 58%", scrub: 0.8 },
    },
  );
}

if (mosaicBoard) {
  gsap.to(mosaicBoard, {
    autoAlpha: 0.58,
    y: -28,
    scale: 0.985,
    ease: "none",
    scrollTrigger: {
      trigger: detailStage,
      start: "bottom 118%",
      end: "bottom 82%",
      scrub: 0.85,
    },
  });
}
```

The final full-figure state must remain readable before the release begins.

- [ ] **Step 4: Reuse `JpRevealText` for the manifesto**

Replace static closing strings with the existing component, using the already available localized copy and a Japanese pair in the narrative object:

```tsx
<JpRevealText
  jp={beat.closingAJp}
  text={beat.closingA}
  locale={locale}
  duration={980}
  delay={40}
/>
```

Do the same for closing B. Add `closingAJp`/`closingBJp` to both locale records once; do not create a new animation system.

- [ ] **Step 5: Verify and commit**

Manual: scroll slowly into details, through all fragments, pause on full Akari, then continue into Kintsugi Lunar. There must be no abrupt sticky grab/release.

Run:

```bash
npm run format:check
npm run lint
```

Commit:

```bash
git add src/components/experience/character-spotlight.tsx src/app/akari-*.css src/app/global-rhythm-refinement.css
git commit -m "refactor: smooth akari detail handoffs"
```

---

### Task 6: Fix Bestiary stacking and compress the restricted-entity transition

**Files:**
- Modify: `src/components/experience/bestiary-bosses-chapter.tsx`
- Modify: `src/app/bestiary-bosses.css`
- Modify: `src/app/bestiary-inspector-refinement.css`
- Modify: `src/app/global-rhythm-refinement.css`

**Interfaces:**
- `activeSpecimenId` and `activeBossId` stay unchanged.
- The transition phrase stays semantic content but moves into the boss-index editorial column.

- [ ] **Step 1: Give active/hover/focus specimens real stacking priority**

Add explicit z-index rules:

```css
.ix-bestiary-grid .ix-archive-specimen { z-index: 1; }
.ix-bestiary-grid .ix-archive-specimen:hover,
.ix-bestiary-grid .ix-archive-specimen:focus-visible { z-index: 20; }
.ix-bestiary-grid .ix-archive-specimen.is-active { z-index: 24; }
```

Ensure parent containers do not create clipping that prevents visual overlap.

- [ ] **Step 2: Remove the standalone oversized transition act**

Delete the standalone `.ix-forbidden-transition` block from its current location. Place the transition copy inside `.ix-bosses-layout`, above the boss navigation:

```tsx
<div className="ix-boss-index-editorial">
  <span>ARCHIVE LIMIT EXCEEDED</span>
  <h2>
    <JpRevealText jp={copy.transitionJp} text={copy.transitionTitle} locale={locale} />
  </h2>
</div>
<nav className="ix-boss-index" ...>
```

- [ ] **Step 3: Size it as a caption, not a section headline**

```css
.ix-boss-index-editorial h2 {
  max-width: 8ch;
  margin: 1rem 0 2rem;
  font-family: var(--display);
  font-size: clamp(1.7rem, 2.6vw, 3.2rem);
  font-weight: 400;
  line-height: 1.02;
}
```

Remove the old `clamp(4rem, 8vw, 9rem)` transition sizing and reclaimed padding.

- [ ] **Step 4: Verify and commit**

Manual: hover specimen 01 while it overlaps specimen 05; specimen 01 must visibly render above it. Confirm boss section begins substantially earlier after the bestiary grid.

Run:

```bash
npm run lint
```

Commit:

```bash
git add src/components/experience/bestiary-bosses-chapter.tsx src/app/bestiary-bosses.css src/app/bestiary-inspector-refinement.css src/app/global-rhythm-refinement.css
git commit -m "refactor: tighten bestiary to boss transition"
```

---

### Task 7: Fold trailer into Gameplay as a compact combat reel

**Files:**
- Modify: `src/components/experience/gameplay-chapter.tsx`
- Modify: `src/app/gameplay-chapter.css`
- Modify: `src/components/experience/immersive-experience.tsx`
- Delete after references are gone: `src/components/experience/trailer-chapter.tsx`

**Interfaces:**
- Video source remains `/assets_hq/video_battle.mp4`.
- No new open/close state; the reel is inline and lightweight.

- [ ] **Step 1: Add the reel inside Gameplay after the pinned desktop/mobile beat flow and before the closing block**

```tsx
<section className="ix-gameplay-reel" aria-label="Combat reel" data-reveal>
  <div className="ix-gameplay-reel__meta">
    <span>COMBAT REEL / FIELD FOOTAGE</span>
    <small>2.5D · ACTION · EXPLORATION</small>
  </div>
  <div className="ix-gameplay-reel__frame">
    <video autoPlay muted loop playsInline preload="metadata">
      <source src="/assets_hq/video_battle.mp4" type="video/mp4" />
    </video>
    <span className="ix-gameplay-reel__veil" aria-hidden="true" />
  </div>
</section>
```

- [ ] **Step 2: Bound its size**

```css
.ix-gameplay-reel {
  width: min(92vw, 1240px);
  margin: clamp(3rem, 6vw, 6rem) auto;
}

.ix-gameplay-reel__frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 21 / 9;
  max-height: 55svh;
}

.ix-gameplay-reel__frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 3: Remove the standalone trailer chapter and stale global animations**

In `immersive-experience.tsx`, remove:

```ts
import { TrailerChapter } from "@/components/experience/trailer-chapter";
```

Remove `<TrailerChapter ... />` from the story order and delete the two GSAP blocks targeting `[data-trailer-video]`, `[data-trailer-stage]`, and `[data-trailer-veil]`.

Delete `trailer-chapter.tsx` only after repository search confirms no imports remain.

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run format:check
npm run lint
npm run build
```

Manual: Gameplay still reads as a single chapter; the video no longer creates a standalone full-height chapter.

Commit:

```bash
git add src/components/experience/gameplay-chapter.tsx src/app/gameplay-chapter.css src/components/experience/immersive-experience.tsx src/components/experience/trailer-chapter.tsx
git commit -m "refactor: fold trailer into gameplay reel"
```

---

### Task 8: Convert Lost Memories to a bounded horizontal archive on desktop

**Files:**
- Create: `src/components/experience/lost-memories/use-lost-memories-horizontal.ts`
- Modify: `src/components/experience/lost-memories-chapter.tsx`
- Modify: `src/components/experience/lost-memories/archive-table.tsx`
- Modify: `src/components/experience/lost-memories/use-lost-memories-motion.ts`
- Modify: `src/app/lost-memories-chapter.css`
- Modify: `src/app/lost-memories-crops-refinement.css`

**Interfaces:**
- Existing `ArchiveRecord`, `onOpen(record, trigger)`, BLACK-00 viewer, Memory Decay, and focus restoration remain unchanged.
- New hook signature: `useLostMemoriesHorizontal(rootRef: RefObject<HTMLElement | null>, disabled: boolean)` where `disabled` is true while a record is open.

- [ ] **Step 1: Mark horizontal panels without changing archive data**

Add `data-archive-panel` to intro, each archive group, thesis/Akari end section as appropriate. Wrap desktop content in:

```tsx
<div className="ix-archive-horizontal" data-archive-horizontal>
  <div className="ix-archive-horizontal-track" data-archive-horizontal-track>
    <header className="ix-archive-intro" data-archive-panel>...</header>
    <ArchiveTable copy={copy} onOpen={handleOpen} />
    <section className="ix-archive-thesis" data-archive-panel>...</section>
    <section className="ix-archive-akari" data-archive-panel>...</section>
  </div>
</div>
```

Keep the final polarity transition outside the horizontal track so vertical flow resumes before the epilogue.

- [ ] **Step 2: Make archive groups explicit horizontal panels**

In `archive-table.tsx`, add `data-archive-panel` to Letters, Photographs, Relics, Realms, and Lunar sections. Preserve current IDs so the archive index remains valid.

- [ ] **Step 3: Implement desktop-only horizontal ScrollTrigger**

Create `use-lost-memories-horizontal.ts`:

```ts
"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLostMemoriesHorizontal(
  rootRef: RefObject<HTMLElement | null>,
  disabled: boolean,
) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || disabled) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const viewport = root.querySelector<HTMLElement>("[data-archive-horizontal]");
      const track = root.querySelector<HTMLElement>("[data-archive-horizontal-track]");
      if (!viewport || !track) return;

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => tween.kill();
    });

    return () => media.revert();
  }, [disabled, rootRef]);
}
```

When the viewer opens, disable/rebuild the horizontal trigger so background scrolling cannot fight the focused record.

- [ ] **Step 4: Make L11 one continuous horizontal table**

Desktop CSS:

```css
.ix-archive-horizontal {
  position: relative;
  height: 100svh;
  overflow: clip;
}

.ix-archive-horizontal-track {
  display: flex;
  align-items: stretch;
  width: max-content;
  min-height: 100svh;
  background-image: url("/09-lore-archives/backgrounds/l11-archive-table-background.png");
  background-repeat: repeat-x;
  background-size: auto 100%;
  background-position: left center;
}

[data-archive-panel] {
  flex: 0 0 auto;
}
```

Assign varied desktop widths rather than seven `100vw` slides, e.g. intro `82vw`, letters `120vw`, photos `112vw`, relics `105vw`, realms `128vw`, lunar `112vw`, thesis/Akari combined `100vw`. Calibrate after visual review.

- [ ] **Step 5: Prevent old vertical reveal triggers from fighting the horizontal track**

In `use-lost-memories-motion.ts`, keep local hover/one-time micro-motion but gate vertical-position-based `ScrollTrigger`s to mobile/reduced contexts or convert their triggers to work with `containerAnimation` only if genuinely needed. Prefer fewer animations: the horizontal movement is the primary motion language.

- [ ] **Step 6: Preserve mobile vertical flow**

Under `max-width: 900px` and reduced motion, restore:

```css
.ix-archive-horizontal { height: auto; overflow: visible; }
.ix-archive-horizontal-track { display: block; width: auto; min-height: 0; background: none; }
```

Existing vertical section styling remains authoritative.

- [ ] **Step 7: Verify and commit**

Manual desktop: use wheel/trackpad from archive intro through AKR-001; vertical scroll must map smoothly to horizontal travel, then release back to vertical before the final transition. Open/close Hanamori, BLACK-00 and AKR-related records while in the pinned section and confirm focus restoration.

Manual mobile: no pin, no horizontal track, no drag requirement.

Run:

```bash
npm run format:check
npm run lint
npm run build
```

Commit:

```bash
git add src/components/experience/lost-memories src/components/experience/lost-memories-chapter.tsx src/app/lost-memories-chapter.css src/app/lost-memories-crops-refinement.css
git commit -m "refactor: turn lost memories into horizontal archive"
```

---

### Task 9: Final integration gate and rhythm review

**Files:**
- Review only; modify only files implicated by actual failures.

**Interfaces:**
- No new features in this task.

- [ ] **Step 1: Run the complete minimal automated gate**

```bash
npm run test:hero
npm run format:check
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Search for stale trailer/shader references**

```bash
rg "TrailerChapter|data-trailer-|LensDistortion|ix-ripple-distortion__waves" src package.json
```

Expected: no obsolete standalone-trailer or LensDistortion references. Any retained `RippleDistortionImage` naming is acceptable because the public component API is intentionally stable.

- [ ] **Step 3: Visual rhythm checklist**

Validate in this order at desktop 1550×900, tablet 1180×820, mobile 390×844:

1. hero phrase 2 begins exactly when the black moon touches the yellow moon;
2. phrase 2 remains while it crosses;
3. phrase 3 begins only when Crimson Moon is established;
4. separator is centered and undistorted;
5. Realm ripple reads as water;
6. Realm list scrolls internally and inspector has no horizontal scroll;
7. Akari sticky entry/release has no hard cuts;
8. specimen 01 can rise above later specimen cards;
9. restricted-boss transition no longer burns a full viewport;
10. trailer appears only as compact Gameplay reel;
11. Lost Memories traverses horizontally only on desktop and releases cleanly;
12. final epilogue/footer remains visually unchanged from the approved state.

- [ ] **Step 4: Compare branch scope before PR**

```bash
git diff --stat feat/final-epilogue-footer...HEAD
git log --oneline feat/final-epilogue-footer..HEAD
```

Confirm changes correspond only to this refinement spec.

- [ ] **Step 5: Final commit only if gate fixes were necessary**

```bash
git add -A
git commit -m "fix: close final rhythm refinement gate"
```

Do not create an empty commit.
