# Tsukihara Hero Eclipse Sequence Design

## Goal

Rebuild only the hero as a pinned, scroll-driven cinematic transformation: serene night → omen → eclipse → Kintsugi Lunar, using the new `public/hero-elements` transparent before/after layers.

## Scope

- Hero only. Existing header, language, audio, entry gate, copy system and all sections below the hero remain functionally intact.
- Branch starts from `main` commit `cccd74180bc09ab02328e7961aae48a3115ee974`.
- The next section must not enter the viewport until the hero timeline reaches 100%.

## Architecture

The current `HeroParallaxScene` manual RAF/scroll interpreter is replaced by a focused `Hero/` subsystem. One GSAP + ScrollTrigger timeline owns scroll progress, pinning, state transformation, camera movement, and before/after interpolation. Ambient motion is independent but subordinate to the master timeline.

### Components

- `src/components/experience/hero/tsukihara-hero.tsx`: public hero composition and content shell.
- `src/components/experience/hero/hero-scene.tsx`: render scene layers.
- `src/components/experience/hero/hero-camera.tsx`: camera wrapper and transforms.
- `src/components/experience/hero/layers/*`: moon, atmosphere/temple, characters, sakura/ground, petal vortex.
- `src/components/experience/hero/hooks/use-hero-timeline.ts`: master GSAP ScrollTrigger timeline and reduced-motion behavior.
- `src/components/experience/hero/constants/hero-scene.ts`: asset map, depths, breakpoints and timing labels.
- `src/components/experience/hero/hero-timeline-math.ts`: pure progress helpers for deterministic tests.
- `src/app/hero-eclipse-sequence.css`: hero-only composition and responsive styles.

## Layer stack

0. CSS sky/atmospheric gradient.
1. `moon-before.png` + `moon-after.png`.
2. Distant atmosphere/mountain mass. Mountains are not separate new assets; use temple master/environment and fog/color treatment rather than inventing an unsupported pair.
3. `mist-before.png` + `mist-after.png`.
4. `temple-before.png` + `temple-after.png`.
5. `mist-2-after.png` as intermediate crimson haze.
6. `ground-before.png` + `ground-after.png`.
7. `characters-before.png` + `characters-after.png`.
8. Left sakura framing from `left-sakura-tree-after.png`, introduced progressively.
9. Right sakura pair `right-sakura-tree-before.png` + `right-sakura-tree-after.png`.
10. Petal vortex: left pair plus `right-petals-after.png`, augmented by a controlled set of DOM petals for three depth bands.
11. Optional `secret-pathways-assets` foreground accents on the left: lantern/rocks/grass only if composition needs balance.
12. Camera light, vignette and crimson rim-light overlays.
13. Monumental wordmark and content/UI above scene.

## Timeline

- 0–12% Serenity: normal moon/blue night, character entry, minimal wind.
- 12–28% Omen: desaturation, halo reduction, mist/wind increase, subtle crimson hints.
- 28–48% Eclipse: moon shadow and red state become legible, temple/ground crossfade begins.
- 48–68% Kintsugi Awakens: fastest lunar transformation, stronger lantern/rim light, vortex convergence, camera pushes to ~1.025.
- 68–86% Crimson Dominion: after-state dominates, foreground responds more strongly.
- 86–100% Resolve: wind relaxes, camera settles, final crimson key visual holds before unpin.

## Scroll/pinning

Desktop target: ~300vh virtual scroll with the visual stage pinned at exactly `100svh`. Tablet target ~250vh. Mobile target ~200vh. Actual values may be calibrated after visual QA. Use `ScrollTrigger` pinning rather than sticky-height simulation.

## Motion

- Master progress is ScrollTrigger-controlled with `scrub`.
- Pointer parallax is secondary and disabled on mobile.
- Camera moves only a few percent and scales 1 → max 1.03.
- Mist drifts continuously and changes color/opacity with progress.
- Character entrance uses x/y/scale with a subtle settled overshoot; after entrance the character remains in scene and changes lighting rather than disappearing.
- Petals use three depth bands and two asymmetric flows converging around the center. Ambient drift persists while scroll intensity modulates velocity/amplitude.

## Responsive

Breakpoints stay aligned with project convention: desktop >980, tablet 681–980, mobile <=680. Mobile preserves pin/eclipsing narrative while reducing petal count, pointer motion, secondary atmosphere and total scroll distance.

## Reduced motion

No large parallax or vortex. Keep the hero pinned for a shorter transition and use simple before/after interpolation so the narrative remains understandable.

## Performance

- CSS transforms/opacity/clip/masks only; no new canvas/Three.js for hero.
- `will-change` only on animated elements.
- Controlled petal DOM count; no thousands of nodes.
- Hero-critical assets preloaded/prioritized; below-the-fold remains lazy.
- Clean up all ScrollTriggers, pointer listeners and ambient tweens.

## Acceptance

The hero remains pinned until progress 1; next section is invisible during transformation; before/after changes are organic rather than abrupt; Akari/Haku/Mochi remain integrated; left/right sakura frame the scene; petals form an asymmetric converging vortex; final state settles before unpin; responsive/reduced-motion variants preserve narrative; no horizontal overflow or hydration mismatch.
