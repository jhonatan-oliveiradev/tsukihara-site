# Companions Interactive Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new Haku & Mochi interactive companions section immediately after Gameplay, with hover/focus/click state changes on desktop and a simplified touch/mobile flow.

**Architecture:** Keep all interaction state local to a new `CompanionsChapter`. Split presentation into a desktop hub, reusable companion content panel, mobile flow, and an isolated section-scoped canvas atmosphere. Reuse the existing `JpRevealText` and project typography tokens; do not add a new global animation system or state store.

**Tech Stack:** Next.js 16.3.1, React, TypeScript, CSS, Next Image, existing `JpRevealText`, lightweight Canvas 2D.

**Spec:** `docs/superpowers/specs/2026-08-23-companions-interactive-hub-design.md`

## Global Constraints

- TDD is explicitly out of scope for this task per user instruction.
- No long pinned scroll sequence.
- Cursor effect is local to the companions section and disabled for touch/coarse pointers and `prefers-reduced-motion`.
- Use `var(--display)` for editorial headings and existing sans tokens for UI/body text.
- Hover, keyboard focus and click/tap must expose equivalent companion states.
- Canonical assets come from `/06-companions/...` paths documented in the spec.
- Primary visual validation is performed by the user locally.
- Before handoff, run formatting, lint and production build through the repository's existing Quality workflow where practical.

---

### Task 1: Content and component skeleton

**Files:**
- Create: `src/content/companions.ts`
- Create: `src/components/experience/companions-chapter.tsx`

**Interfaces:**
- Produces `companionsCopy[locale]`, `CompanionId = "haku" | "mochi"`, and `CompanionsChapter({ locale })`.

- [x] Define PT/EN copy, Japanese source labels, tags and canonical asset paths.
- [x] Build semantic section markup with intro, desktop hub, mobile flow and closing hero.
- [x] Reuse `JpRevealText` for intro, Haku, Mochi and closing headlines.
- [x] Keep active desktop state local as `base | haku | mochi`.

### Task 2: Interactive desktop hub

**Files:**
- Modify: `src/components/experience/companions-chapter.tsx`
- Create: `src/app/companions-chapter.css`

**Interfaces:**
- Haku/Mochi targets are real `<button>` elements.
- Hover previews a companion; pointer leave returns to the click-selected state.
- Focus and click select the same state.

- [x] Create the central group composition and orbital focus targets.
- [x] Add Haku/Mochi isolated character layers and key visuals.
- [x] Add dynamic contextual copy, tags and microcopy without card styling.
- [x] Implement restrained dissolve, drift, halo and illumination state transitions in CSS.

### Task 3: Section-scoped cursor atmosphere

**Files:**
- Create: `src/components/experience/companions-atmosphere.tsx`
- Modify: `src/components/experience/companions-chapter.tsx`
- Modify: `src/app/companions-chapter.css`

**Interfaces:**
- `CompanionsAtmosphere({ mode })`, where mode is `base | haku | mochi`.

- [x] Add an absolutely positioned canvas behind content.
- [x] Observe section visibility and only animate while visible.
- [x] Spawn a capped number of soft particles/rings from pointer movement velocity.
- [x] Shift palette by state: lunar/ivory for Haku, wine/crimson for Mochi, balanced palette for base.
- [x] Disable on coarse pointers, touch devices and reduced motion.

### Task 4: Mobile/touch and closing composition

**Files:**
- Modify: `src/components/experience/companions-chapter.tsx`
- Modify: `src/app/companions-chapter.css`

**Interfaces:**
- Mobile uses explicit Haku/Mochi segmented controls; no hover dependency and no cursor canvas.

- [x] Build intro group composition.
- [x] Add two-state touch controls and vertical companion details.
- [x] Add closing hero with `/06-companions/scenes/c06-akari-haku-hero-flight.png`.
- [x] Ensure reduced motion retains all readable content with stable transitions.

### Task 5: Integrate and verify

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- `GameplayChapter` is immediately followed by `CompanionsChapter`.

- [x] Import and render `CompanionsChapter` after Gameplay.
- [x] Import the section stylesheet using the project's existing CSS pattern.
- [ ] Open a draft PR to `main`.
- [ ] Run existing Quality workflow and confirm formatting, lint, TypeScript and production build.
- [ ] Leave the PR unmerged for user visual validation.
