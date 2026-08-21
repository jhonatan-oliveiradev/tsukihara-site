# Tsukihara Immersive Sanctuary Experience Design

## Goal

Transform the current Tsukihara website from a premium editorial landing page into a continuous cinematic experience that feels like entering the game world. The supplied Kage screenshots/video are references for spatial rhythm, camera continuity and editorial pacing only; no Kage source code or artwork may be reused.

## Experience principles

1. **One persistent world.** A fixed Three.js/WebGL sanctuary scene remains alive behind the entire page. Sections change the scene state rather than replacing the background.
2. **The eclipse is the visual spine.** A single moon travels through the scroll, changes phase and lighting, and becomes the closing climax.
3. **Visible depth.** Foreground foliage/petals, midground torii/shrine architecture and background mountains/moon must move at clearly different rates.
4. **Editorial rhythm, not repeated sections.** The page alternates between immersive scene, manifesto, gallery, character spreads, lore grid and contemplative closing.
5. **Tsukihara identity.** Use restrained Bodoni/Didot/Mincho-like typography, Japanese red annotations, vermilion accents, negative space and sacred-Japanese visual motifs established in the user's original concept.
6. **Motion with narrative purpose.** GSAP/ScrollTrigger and Lenis control handoffs, parallax and reveals; WebGL handles world movement, camera and atmosphere.
7. **No destructive raster scaling.** Existing compressed assets remain framed at sensible sizes until master-quality replacements can be uploaded.

## Information architecture

### 00 — Sanctuary / Hero

A full-viewport scene with a shrine silhouette, torii gate, large eclipse moon, layered grasses/petals, atmospheric fog and Akari integrated as key art. Typography is composed into the scene instead of sitting in a conventional marketing column. The user immediately understands that scrolling means entering the world.

### 01 — World Manifesto

A quiet editorial spread with one large statement, supporting lore copy and a slim world-stat rail. The 3D sanctuary remains visible but camera and moon drift to create breathing room.

### 02 — Realm Archive

Hanamori, Mizukyo and Kurogane become an asymmetric image archive: one large feature image and two supporting frames. Hover movement is subtle; scroll changes ambient tint and camera framing.

### 03 — Akari / Character Spread

Akari is presented like a character dossier/artbook spread with Japanese annotation, oversized ghost kanji, state markers and a restrained parallax figure.

### 04 — Haku / Bonds Spread

The composition reverses direction to avoid repetition. Haku gets an atmospheric spread with the eclipse visible behind the scene.

### 05 — Lore Chapters

A structured grid of five world/lore themes inspired by the reference site's chapter rhythm, using Tsukihara-specific themes: Moonbound Vows, Sacred Temples, Guardian Spirits, Forgotten Iron and The Eclipse.

### 06 — Afterlight / Closing

The sanctuary darkens, the eclipse approaches totality and the page becomes sparse. Akari and the moon form the final composition, followed by Steam/trailer placeholders and the footer.

## WebGL scene

- Perspective camera with scroll-driven target positions and smooth interpolation.
- Persistent moon group with emissive red disc, halo and moving shadow disc for eclipse phase.
- Layered mountain silhouettes at separate Z depths.
- Shrine architecture built from simple original geometry: base, roof slabs, warm shoji-like windows.
- Torii gates at multiple Z positions.
- Three particle/petal depth planes with different drift speeds.
- Foreground grass/reed silhouettes using instanced planes or compact geometry.
- Lantern points with restrained flicker.
- Fog density and ambient/point-light intensity interpolate by page progress.
- Reduced-motion mode keeps a static readable scene and disables scroll-driven camera choreography.

## Motion language

- Hero copy and logo reveal through masked vertical movement and opacity, not generic bounce.
- Large statements enter line/word-by-word with low-frequency timing.
- Section media receives 3–8% scroll parallax only.
- Character figures move independently from their copy to establish depth.
- Scene changes are continuous and scrubbed; no hard cuts between WebGL states.
- Hover motion is limited to 2–4px/1–2% scale-equivalent depth cues.

## Visual system

- Background: near-black ink with blue-black atmospheric variation.
- Primary text: warm moon ivory.
- Accent: restrained vermilion/crimson.
- Secondary accent: aged gold only for tiny markers/light.
- Display typography: current Bodoni/Didot/Mincho-inspired stack; no oversized SaaS-style headline repetition.
- Japanese text: semantic/ornamental annotations used at multiple scales, especially vertical or red micro-labels.
- Fine 1px rules, restrained counters, technical indexes and generous negative space.

## Accessibility and performance

- Preserve semantic sections, headings, anchors and mobile navigation.
- Preserve `prefers-reduced-motion` handling.
- Keep the WebGL canvas pointer-events disabled.
- Cap device pixel ratio at 2.
- Use simple geometry/materials and avoid expensive post-processing in this pass.
- Keep all image paths valid and use `next/image` sizing appropriate to the compressed source files.

## Success criteria

- The hero reads as a scene with at least three obvious depth planes before the user scrolls.
- The same moon is visibly present and changing through the complete journey.
- No two adjacent content blocks use the same visual composition.
- The page remains understandable with motion disabled.
- Formatting, ESLint and production build pass in GitHub Actions.
