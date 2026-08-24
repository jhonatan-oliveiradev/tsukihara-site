# Final Epilogue + Cinematic Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the site's final `CinematicEpilogue` into a short layered horizon epilogue plus a cinematic footer that continues the same scene.

**Architecture:** Keep the existing `CinematicEpilogue` export/integration point so the immersive sequence does not need structural rewiring. Move localized copy and final asset paths into `final-journey.ts`, isolate quiet GSAP/CSS motion to the final section, and split the visual epilogue/footer into focused child components.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript, Next/Image, GSAP 3.13, existing global Lenis/ScrollTrigger environment, CSS.

**Spec:** `docs/superpowers/specs/2026-08-24-final-epilogue-footer-design.md`

## Global Constraints

- Branch from current `main`; Lost Memories is already merged.
- Preserve the existing `#eclipse` anchor and `data-section` behavior.
- Use F01–F07 from `public/11-final`; no placeholder or generated substitute.
- No new runtime dependency, WebGL sequence, long pinning, custom global cursor or heavy interaction.
- Hide CTA/social/legal links when no real destination exists.
- Mobile uses F01 as the consolidated scene and avoids desktop freeform depth layering.
- Reduced motion must remain fully readable and functional.
- Automated validation remains the existing repository Quality gate: Prettier, ESLint and production build; visual calibration is manual.

---

### Task 1 — Final journey copy and asset contract

**Files:**
- Create `src/content/final-journey.ts`

- [ ] Define F01–F07 canonical paths.
- [ ] Add PT/EN eyebrow, headline, support copy, horizon line, signature, footer labels, nav labels and easter-egg line.
- [ ] Model CTA/social/legal destinations as nullable/empty data so nothing fake renders.
- [ ] Keep nav hrefs limited to `#top`, `#akari`, `#realms`, `#gameplay`, `#lore`.

### Task 2 — Quiet motion and easter-egg behavior

**Files:**
- Create `src/components/experience/final-journey/use-final-journey-motion.ts`
- Create `src/components/experience/final-journey/final-moon-easter-egg.tsx`

- [ ] Scope GSAP to a final-section ref and revert context on cleanup.
- [ ] Add only fade/translate/camera drift/moon breathing/atmosphere movement.
- [ ] Disable decorative motion for `prefers-reduced-motion`.
- [ ] Implement lunar button hover/tap eclipse and timed message reveal without navigation.

### Task 3 — Epilogue visual composition

**Files:**
- Create `src/components/experience/final-journey/final-epilogue.tsx`

- [ ] Desktop layer order: F03 environment, F04 moon, F02 characters, F05 foreground, F06 atmosphere.
- [ ] Do not render F01 simultaneously as the desktop base behind duplicated characters.
- [ ] Mobile renders F01 as the consolidated visual.
- [ ] Add eyebrow, chosen headline, support copy and horizon microcopy.
- [ ] Render CTA only when `ctaHref` is non-null.

### Task 4 — Cinematic footer

**Files:**
- Create `src/components/experience/final-journey/cinematic-footer.tsx`

- [ ] Continue the epilogue's atmosphere into the footer rather than creating a boxed footer.
- [ ] Render large TSUKIHARA identity, subtitle and final `REMEMBER WHAT REMAINS.` signature.
- [ ] Render only real anchor navigation.
- [ ] Render social/legal areas only when configured.
- [ ] Include the F07 lunar easter egg.

### Task 5 — Replace current epilogue shell

**Files:**
- Modify `src/components/experience/cinematic-epilogue.tsx`

- [ ] Convert to client component with root ref.
- [ ] Preserve props `{ copy, locale }` for compatibility, even if only locale is needed for new final copy.
- [ ] Root remains `<section id="eclipse" data-section ...>`.
- [ ] Mount `FinalEpilogue`, `CinematicFooter` and local motion hook.
- [ ] Remove old Blood Moon, canonical front-facing Akari, old sakura branch and generic footer layout.

### Task 6 — Final visual system

**Files:**
- Create `src/app/final-journey-closing.css`
- Modify `src/app/layout.tsx`

- [ ] Build one continuous dark landscape surface from epilogue into footer.
- [ ] Desktop scene should be cinematic but shorter/less energetic than major chapters.
- [ ] Add subtle Kintsugi underline hovers for footer links.
- [ ] Ensure lower footer reaches absolute black only near copyright.
- [ ] Add mobile layout at `<= 900px` and reduced-motion rules.
- [ ] Import new CSS after `lost-memories-chapter.css`/final section styles so it overrides legacy epilogue rules without rewriting unrelated global CSS.

### Task 7 — Verification and handoff

- [ ] Confirm main sequence remains `Lost Memories -> CinematicEpilogue`.
- [ ] Confirm all F01–F07 URLs exist.
- [ ] Confirm no fake CTA/social/privacy/terms link renders.
- [ ] Confirm footer anchors are valid.
- [ ] Run `npm run format:check`, `npm run lint`, `npm run build` through the existing Quality workflow before claiming ready.
- [ ] Keep branch isolated; do not merge without explicit authorization.