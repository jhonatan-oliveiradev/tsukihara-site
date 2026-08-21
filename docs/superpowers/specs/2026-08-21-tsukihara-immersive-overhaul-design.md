# Tsukihara Immersive Overhaul — Design

## Goal

Transform the current Tsukihara site from an advanced editorial prototype into a coherent premium game-universe presentation. The experience must feel directed, cinematic and spatial, not like stacked sections with decorative motion.

The implementation is based directly on `main` and preserves the current bilingual system, audio controls, preloader, existing lore copy foundation, real GLTF temple/katana, and canonical assets.

## Experience principles

1. **One continuous world, not isolated blocks.** Scroll should feel like moving through chapters of the same night rather than jumping between independent sections.
2. **Motion must communicate hierarchy and depth.** Ambient motion, pinned sequences and scroll-driven reveals should support narrative transitions rather than exist as generic animation.
3. **Use the strongest existing art aggressively.** `assets_hq` and `secret-pathways-assets` are production inputs, not fallback decoration.
4. **The game mechanic must have a visual moment.** Kintsugi Lunar becomes the first major chapter after the hero and should demonstrate restoration rather than only explain it.
5. **Akari is the visual protagonist.** Character presentation should feel like premium key art/character reveal, not a static model sheet.
6. **Respect performance and reduced motion.** Paper Shaders and WebGL effects are concentrated in high-value hero/character moments with CSS/image fallbacks.

## Page architecture

### 00 — Cinematic preloader / entry

Keep the current real 0→100 resource preloader and entry gate. Refine the transition so the preloader dissolves into the hero rather than feeling like a separate screen.

### 01 — Pinned cinematic hero

The hero becomes a scroll sequence rather than a single static viewport.

- Height: approximately 180–220svh on desktop; visual stage pinned for the first ~100svh.
- Copy remains on the left with a clean negative-space zone.
- Akari/Haku/Mochi remain on the right, but the composition is integrated by shared haze, foreground, light and depth.
- Use the existing layered parallax assets as the scene foundation.
- Use `assets_hq/Blood_Moon.png` where resolution/alpha makes it superior to the existing moon.
- Add `secret-pathways-assets/foreground/png/sakura-branch.webp`, `tall-grass.webp`, `stone-lantern.webp`, and `shrine-ruins.webp` selectively as true foreground/midground pieces.
- Motion layers: moon, distant temple, mist, sakura canopy, terrain, characters, foreground grass/ruins, petals.
- Scroll should increase depth, shift focus to Akari, then crossfade into the Kintsugi chapter without a hard section boundary.
- The monumental `TSUKIHARA` word becomes a compositional layer that is partially occluded by characters/foreground rather than a flat footer-like strip.

### 02 — Kintsugi Lunar signature chapter

Replace the current text-heavy threshold section with an interactive/pinned restoration sequence.

- Use a strong Hanamori/ruin image from `assets_hq` as the base environment.
- Show a damaged/forgotten state and a restored state using masks/clips and a luminous seam treatment inspired by kintsugi.
- As the user scrolls, the restored layer reveals progressively.
- Supporting copy explains that Akari chooses what fragments to restore and when.
- Add lightweight moonlight particles/linework to communicate memory reconstruction.
- This is the key mechanic reveal, not a generic manifesto section.

### 03 — Realm atlas

Replace the oversized current grid with a compact editorial atlas.

- One featured realm at a time on desktop, with a horizontal/stacked selector or scroll-driven transition among Hanamori, Mizukyo and Kurogane.
- Use HQ images: `templo-hanamori.png`, `mizukyo-cachoeiras.png`, `kurogane-ruinas.png`.
- Keep the section significantly shorter than the current implementation.
- Each realm gets a large kanji, realm number, one concise paragraph and a visual transition.
- Images use subtle Paper Shader image treatment only during hover/transition, never continuously at high intensity.

### 04 — Gameplay / trailer chapter

Make the existing `video_battle.mp4` a full cinematic beat.

- Video occupies the dominant visual field.
- Section transitions from dark veil/blur into clear motion as it enters.
- Use chapter copy about elegant lateral combat, bosses and 2.5D traversal.
- Keep autoplay muted, looped and inline.
- Add minimal frame lines and a small play/pause affordance only if needed; no generic video card UI.

### 05 — Akari character spotlight

Create a premium character reveal using Paper Shaders and HQ character art.

- Primary art: `AKARI_NO_REI_CANONICAL_MODEL_V02.png`.
- Secondary animation/reference assets may use `AKARI_STD_IDLE_PREVIEW_V01.gif`, `AKARI_STD_SIDE_MASTER_RIGHT_V01.png`, or run/idle keyframes as supporting visual material where tasteful.
- Add a shader-backed image layer inspired by Kage: chromatic/lens distortion or liquid-metal/heatmap accent used as a transitional echo around the silhouette, not as the primary permanent rendering.
- Keep the original image visible and legible; the shader is a secondary pass.
- Introduce Haku/Mochi through supporting copy and, where asset availability allows, Mochi image placement.
- Motion: image reveal, silhouette echo, kanji drift, subtle mask wipe.

### 06 — Experience pillars

Replace the current lore card grid with five compact narrative pillars:

- Kintsugi Lunar
- Isometric overworld
- 2.5D Metroidvania traversal
- Elegant combat / memorable bosses
- Haku & Mochi / secrets and traversal

These should read as game-system chapters, not SaaS feature cards. Use a horizontal line, chapter index, micro motion and occasional background asset fragments.

### 07 — Eclipse / epilogue footer

Merge the current final section and footer into one authored ending.

- Strong final line: official tagline/theme language.
- Use Blood Moon / Akari art in a restrained composition.
- Include minimal navigation, language, sound and project/development note.
- Avoid a conventional boxed footer.
- Motion should slow down here: petals thin out, audio remains user-controlled, moon glow becomes the final visual anchor.

## Motion system

### Scroll orchestration

Use GSAP ScrollTrigger for chapter-level choreography and Lenis as the existing scroll integrator.

- Hero: pinned stage with scrubbed timeline.
- Kintsugi: pinned or near-pinned restoration reveal.
- Realm atlas: controlled crossfades / clip reveals, not a tall static grid.
- Trailer: veil reveal + scale from ~1.04 to 1.
- Akari: shader/image echo reveal and parallax.
- Epilogue: slow convergence rather than abrupt ending.

### Ambient motion

- Sakura petals continuously drift across the viewport at multiple depths.
- Mist moves slowly and independently.
- Foreground grass/branches oscillate almost imperceptibly.
- Kanjis use slow opposing parallax.
- No card-tilt or aggressive cursor chasing.

### Pointer motion

Keep pointer parallax only in the hero and at reduced amplitude. Scroll is the primary driver.

### Reduced motion

- Remove pinning where it would create unnecessary long blank scroll.
- Render final restored Kintsugi state immediately.
- Disable continuous shader animation or set shader speed to `0`.
- Keep all content visible and navigable.

## Paper Shaders integration

Install `@paper-design/shaders-react`.

Use the library selectively:

1. **Akari spotlight:** `LensDistortion` with low spread/noise or `LiquidMetal`/`Heatmap` as a masked echo layer around transparent character art.
2. **Realm transitions:** subtle `LensDistortion` or `ImageDithering` as an animated transition layer only during active state changes/hover.
3. **Kintsugi accent:** a restrained animated shader field such as `Warp` can sit behind the restoration seam, clipped to a narrow luminous region.

Constraints:

- Keep `maxPixelCount` conservative and cap pixel ratio where supported.
- Do not apply multiple full-screen shaders simultaneously.
- Disable shader motion for reduced-motion users.
- Preserve a standard `<Image>` fallback underneath each shader.

Paper Shaders current package/install source: `npm i @paper-design/shaders-react`.

## Asset strategy

### `assets_hq`

Use production masters for:

- Akari canonical model
- Blood Moon
- Hanamori
- Mizukyo
- Kurogane
- Tsukihara logo
- battle/trailer video
- character motion/reference assets where useful

### `secret-pathways-assets`

Use foreground assets as spatial composition tools:

- `sakura-branch.webp`
- `tall-grass.webp`
- `stone-lantern.webp`
- `shrine-ruins.webp`
- `basalt-stones.webp`
- `garden-bush.webp`
- `temple-wall.webp`

Avoid relying on the `generated/kage-*` assets for core identity; they may be used only if a neutral transition texture is genuinely useful.

## Visual direction

- Night-ink background, moon ivory, crimson eclipse, aged gold, restrained sakura pink.
- Cinzel remains display type; body copy should use a readable companion serif/sans rather than forcing Cinzel everywhere.
- Large kanji are architectural elements, but should not compete with copy.
- Borders/lines are thin and editorial; avoid generic boxes.
- Atmospheric grain and haze should unify disparate source assets.

## Copy direction

Use the established game lore as source of truth:

- Mother Moon stores the memories of living beings, dead, spirits and gods.
- Crimson Eclipse causes the world to be forgotten.
- Akari wakes without memory while others remember her guilt.
- Kintsugi Lunar temporarily restores forgotten fragments.
- Nine Realms exist in lore; site may focus on the currently developed regions without exposing DLC concepts.
- Haku and Mochi support traversal, discovery and emotional contrast.

The site should communicate an actual premium 2.5D Metroidvania + isometric overworld game, not only poetic worldbuilding.

## Component architecture

Create focused components rather than expanding `immersive-experience.tsx` further:

- `cinematic-hero.tsx`
- `kintsugi-chapter.tsx`
- `realm-atlas.tsx`
- `trailer-chapter.tsx`
- `character-spotlight.tsx`
- `experience-pillars.tsx`
- `cinematic-epilogue.tsx`
- `shader-image.tsx` (Paper Shaders wrapper/fallback)

`ImmersiveExperience` owns locale, entry/audio state, header and global motion orchestration hooks, while chapter components own their own markup and local presentation.

## Performance

- Lazy-load Paper Shaders / shader-backed components where practical.
- Keep videos `preload="metadata"` unless needed immediately.
- Prefer `next/image` and existing WebP assets for non-shader layers.
- Only hero-critical image assets use `priority`.
- Avoid continuous animated CSS filters.
- Keep existing Three.js world, but ensure it supports rather than duplicates the 2D scene.

## QA / acceptance

Validate at 390, 768, 1440, 1920 and 2560+ widths.

Required:

- no horizontal overflow;
- hero reads as one coherent scene;
- hero → Kintsugi transition has no hard visual cut;
- Kintsugi restoration visibly demonstrates the mechanic;
- realms section is substantially shorter and more focused than current version;
- trailer is visually dominant;
- Akari shader effect enhances, not obscures, canonical art;
- footer/ending is authored and cinematic;
- audio, PT/EN, nav and preloader remain functional;
- reduced motion has complete static fallbacks;
- lint, formatting and production build pass.
