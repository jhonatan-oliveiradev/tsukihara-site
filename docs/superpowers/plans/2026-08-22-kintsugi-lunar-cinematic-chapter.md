# Kintsugi Lunar Cinematic Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new cinematic Kintsugi Lunar chapter immediately after Akari that explains rupture, transformation, relics, gameplay, cost and climax without modifying the existing Kintsugi section.

**Architecture:** A dedicated `KintsugiLunarChapter` owns semantic content and layered visuals. A scoped GSAP/ScrollTrigger hook drives the desktop sticky timeline; mobile/reduced-motion use readable document flow and crossfades. Replaceable visual assets are routed through stable K01–K15 slots so final art can drop in later without changing choreography.

**Tech Stack:** Next.js 16, React 19, TypeScript, next/image, GSAP + ScrollTrigger, CSS/SVG.

**Spec:** `docs/superpowers/specs/2026-08-22-kintsugi-lunar-cinematic-chapter-design.md`

## Global Constraints

- Existing `KintsugiChapter` remains unchanged.
- New chapter is inserted immediately after `CharacterSpotlight` and before `ExperiencePillars`.
- Kintsugi-specific timeline logic must stay outside `immersive-experience.tsx`.
- Desktop target length is approximately 420svh with a sticky 100svh stage.
- Mobile uses normal vertical document flow and no long sticky lock.
- Reduced motion removes parallax/scrub transforms and uses readable crossfades.
- No conventional card grid should dominate the experience.
- Placeholder assets must be replaceable through K01–K15 slot mapping.

---

### Task 1: Content and asset contract

**Files:**
- Create: `src/content/kintsugi-lunar.ts`
- Create: `src/components/experience/kintsugi-lunar/asset-slot.tsx`

**Interfaces:**
- Produce `KintsugiAssetCode`, `kintsugiAssets`, `kintsugiLunarCopy`, `KintsugiAssetSlot`.
- PT/EN copy contains opening, awakening, transformation, relics, gameplay, risk, climax and closing.

- [ ] Define stable K01–K15 asset slots with current placeholder paths.
- [ ] Define localized copy arrays for 3 relics and 4 gameplay pillars.
- [ ] Implement `KintsugiAssetSlot` with next/image, semantic decorative defaults and replaceable `className`/`sizes`.
- [ ] Run Prettier/typecheck and commit.

### Task 2: Cinematic chapter semantic structure

**Files:**
- Create: `src/components/experience/kintsugi-lunar-chapter.tsx`
- Create: `src/app/kintsugi-lunar-chapter.css`

**Interfaces:**
- Consume Task 1 content/assets.
- Produce semantic section `#kintsugi-lunar` with `data-kintsugi-lunar-stage` and data hooks used by Task 3.

- [ ] Build desktop sticky stage with rupture/environment, Blood Moon, Akari standard/transformed layers, fracture SVG, particles and progress rail.
- [ ] Add semantic narrative planes for rupture, awakening and transformation.
- [ ] Add relic editorial sequence, gameplay sequence, risk/climax and closing signature.
- [ ] Add direct-flow mobile layout using the same content and asset slots.
- [ ] Ensure inactive desktop copy never visually overlaps through explicit state/opacity hooks.
- [ ] Run Prettier/typecheck and commit.

### Task 3: Dedicated scroll timeline

**Files:**
- Create: `src/components/experience/kintsugi-lunar/use-kintsugi-lunar-timeline.ts`
- Modify: `src/components/experience/kintsugi-lunar-chapter.tsx`

**Interfaces:**
- `useKintsugiLunarTimeline(rootRef)` creates/reverts only chapter-owned ScrollTriggers.

- [ ] Detect desktop (`min-width: 901px`) and reduced motion.
- [ ] Create one scrubbed timeline spanning the chapter from `top top` to `bottom bottom`.
- [ ] Animate rupture cracks 0–15%, energy 15–30%, transformation 30–55%, relics 55–70%, gameplay 70–88%, risk 88–96%, climax/exit 96–100%.
- [ ] Crossfade K01/K02 rather than hard swapping.
- [ ] Drive chapter progress CSS variable and active narrative states from progress.
- [ ] Revert all GSAP state cleanly on locale/breakpoint teardown.
- [ ] Run Prettier/typecheck and commit.

### Task 4: Integrate chapter in story order

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Import `KintsugiLunarChapter` and stylesheet only.

- [ ] Insert new component immediately after `CharacterSpotlight`.
- [ ] Pass current `locale`.
- [ ] Import `kintsugi-lunar-chapter.css` after Akari chapter styles.
- [ ] Do not edit existing `.ix-kintsugi` GSAP timeline.
- [ ] Run production build and commit.

### Task 5: Visual/reduced-motion QA

**Files:**
- Create: `.github/workflows/kintsugi-lunar-visual.yml`

**Interfaces:**
- Browser QA validates chapter presence/order, sticky desktop state, no copy overlap, mobile flow, reduced-motion and no horizontal overflow.

- [ ] Capture 1440×900 at rupture, awakening, transformation, relic, gameplay and climax milestones.
- [ ] Capture 2560×1080 ultrawide climax.
- [ ] Capture 390×844 mobile representative states.
- [ ] Validate `#kintsugi-lunar` follows `#akari` and precedes Experience Pillars.
- [ ] Validate old `.ix-kintsugi` still exists and is separate.
- [ ] Validate reduced-motion has no pinned/scrub-only dependency for reading content.
- [ ] Run Quality + visual workflow and review screenshots before marking PR ready.
