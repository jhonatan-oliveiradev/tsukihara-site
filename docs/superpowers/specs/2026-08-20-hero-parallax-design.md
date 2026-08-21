# Tsukihara Hero Parallax Design

## Goal

Replace only the provisional hero composition with a cinematic layered parallax built from the seven transparent assets in `public/parallax`, preserving all existing header, copy, monumental `TSUKIHARA` typography, audio, language, navigation and narrative behavior.

## Baseline

Use `feat/immersive-world-i18n-audio` as the experience baseline, then bring the seven `public/parallax/*.png` assets from the updated `main` into the branch.

## Architecture

Create a dedicated client component `HeroParallaxScene` plus a central `heroParallaxLayers` configuration. The scene renders CSS-positioned transparent image layers and drives only transform values. It does not own copy, header, controls, locale or audio.

Use pointer-normalized values in `[-1, 1]` and a single `requestAnimationFrame` loop with damped interpolation. Pointer values stay in refs so frequent motion does not cause React renders. Scroll contributes a subtle vertical offset derived from the hero section only. No Canvas or Three.js is used for these PNG layers.

## Layer order

1. Blood moon eclipse — depth 0.02
2. Distant temple — depth 0.04
3. Lunar mist — depth 0.06
4. Sakura tree — depth 0.08
5. Ground — depth 0.10
6. Akari, Haku and Mochi — depth 0.12
7. Petals — depth 0.24
8. Copy, monumental title, logo, header and controls — above all visual layers

## Composition

- Preserve a clean reading zone on the left.
- Characters stay in the right third, oriented as supplied, occupying roughly 48–56% viewport width on desktop.
- Blood moon sits around x 62–70%, y 18–30%, behind Haku and partially behind sakura branches.
- Temple remains distant and low contrast below the moon.
- Mist crosses moon and temple but must not obscure Akari's face or the copy.
- Sakura originates from the extreme right and arches over the group.
- Ground visually anchors the group without reading as a rectangular platform.
- Petals travel right-to-left at low density.
- Monumental `TSUKIHARA` may pass behind part of the characters while remaining recognizable.
- Vertical Japanese navigation and all header controls remain unobstructed.

## Motion

Desktop maximum pointer amplitudes:

- moon: 4–8 px
- temple: 6–10 px
- mist: 8–14 px plus autonomous slow horizontal drift
- sakura: 8–12 px plus imperceptible sway
- ground: 14–20 px
- characters: 12–18 px plus slight vertical motion
- petals: 24–40 px plus autonomous drift

Motion is damped and cinematic with no card tilt, aggressive tracking, excessive rotation or zoom. Scroll adds only a subtle vertical parallax while the hero remains in view.

## Responsive behavior

- Desktop: full composition.
- Tablet <= 980 px: reduce amplitudes and reposition group away from copy.
- Mobile <= 680 px: pointer parallax disabled; environmental drift only. Temple and mist may be reduced/hidden before sacrificing Akari/readability.
- Use `clamp()`, percentages and viewport-relative sizing; avoid fragile fixed coordinates.
- Never crop faces, ears, wings, feet or Mochi's head.
- Prevent horizontal overflow at all breakpoints.

## Accessibility and performance

- `prefers-reduced-motion`: static complete composition, no pointer, scroll or ambient transforms.
- Decorative layers use `pointer-events: none` and `aria-hidden`.
- Characters and moon are priority-loaded; other layers load normally.
- Preserve original PNG files. No asset redesign or mirroring.
- Cleanup pointer/scroll/resize listeners and RAF on unmount.
- Animate transforms only; avoid continuously animated heavy filters.

## Validation

Run formatting, lint, available tests and production build. Validate approximately 390, 768, 1440, 1920 and ultrawide widths. Confirm real alpha transparency, no checkerboard/rectangular backgrounds, no broken controls, no horizontal overflow and no critical subject cropping. Visual review is required before completion.
