# Bestiary & Bosses Forbidden Records Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a two-act Bestiary & Bosses chapter immediately after Companions using stable B01–B12 asset slots and mock imagery.

**Architecture:** Keep content and assets centralized in one manifest. Build a desktop proximity-driven Bestiary with a shared metadata rail and a separate dominant Boss stage with vertical navigation. Mobile uses simplified readable flows without proximity/canvas dependence.

**Tech Stack:** Next.js 16.3.1, React, TypeScript, CSS, Next Image, existing `JpRevealText`, lightweight Canvas/SVG/CSS effects.

**Spec:** `docs/superpowers/specs/2026-08-23-bestiary-bosses-forbidden-records-design.md`

## Global Constraints

- No long pinned-scroll sequence.
- No conventional cards or ecommerce carousel behavior.
- No WebGL requirement.
- Stable B01–B12 ids must isolate future asset replacement.
- Use existing `var(--display)` and `var(--sans)` typography tokens.
- Desktop proximity is progressive enhancement; keyboard/click must expose equivalent content.
- Tablet reduces proximity intensity; mobile removes it.
- Lady Tsukino remains classified and partially obscured.
- Primary visual validation is manual/local.
- Before handoff, run formatting, lint and production build.

---

### Task 1: Stable content manifest

**Files:**
- Create: `src/content/bestiary.ts`

- [ ] Define `BestiaryAssetCode` B01–B12 and centralized mock source mapping.
- [ ] Define PT/EN copies for six specimens and four bosses.
- [ ] Include threat, realm, type/aspect, status and accent metadata.

### Task 2: Bestiary act

**Files:**
- Create: `src/components/experience/bestiary-bosses-chapter.tsx`
- Create: `src/components/experience/bestiary-specimen.tsx`
- Create: `src/app/bestiary-bosses.css`

- [ ] Build intro and six semantic specimen buttons.
- [ ] Implement asymmetric desktop matrix.
- [ ] Implement pointer-distance reveal strength with CSS custom properties.
- [ ] Add active metadata rail and keyboard/click activation.
- [ ] Add B11/B12 placeholder layers to the composition.

### Task 3: Boss act

**Files:**
- Create: `src/components/experience/boss-record.tsx`
- Modify: `src/components/experience/bestiary-bosses-chapter.tsx`
- Modify: `src/app/bestiary-bosses.css`

- [ ] Build vertical boss index and active boss stage.
- [ ] Add slow dissolve/scale/ambient accent transitions.
- [ ] Keep Tsukino classified and visually restricted.
- [ ] Add final `O Eclipse não cria monstros.` transition.

### Task 4: Responsive and reduced motion

**Files:**
- Modify: `src/components/experience/bestiary-bosses-chapter.tsx`
- Modify: `src/app/bestiary-bosses.css`

- [ ] Simplify tablet interaction to focus/click dominant behavior.
- [ ] Build mobile vertical Bestiary records and full-width Boss presentation.
- [ ] Disable proximity/jitter effects for reduced motion.

### Task 5: Integration and verification

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

- [ ] Render `BestiaryBossesChapter` immediately after `CompanionsChapter`.
- [ ] Import section stylesheet.
- [ ] Open a draft PR to `main`.
- [ ] Run existing Quality workflow and fix formatting/lint/build issues.
- [ ] Leave unmerged for local visual validation.
