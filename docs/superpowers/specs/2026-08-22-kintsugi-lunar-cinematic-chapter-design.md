# Kintsugi Lunar Cinematic Chapter — Design Spec

Date: 2026-08-22
Branch: `feat/kintsugi-lunar-cinematic-chapter`

## Goal

Create a new cinematic, scroll-driven chapter that explains Kintsugi Lunar as a core narrative and gameplay system of Tsukihara.

This is **not** a replacement for the existing `KintsugiChapter`. The existing section remains unchanged. The new chapter is inserted **immediately after `CharacterSpotlight` (Akari presentation)** and before `ExperiencePillars`.

The visitor should leave the chapter understanding three ideas without needing a systems document:

1. Akari can restore what the Eclipse is erasing.
2. Restoration preserves visible scars instead of undoing damage.
3. Kintsugi Lunar directly changes exploration, traversal and combat.

## Experience Model

Desktop uses one long cinematic chapter with a sticky visual stage and controlled scroll progression. Target length: approximately `420svh`, with no forced multi-screen pause beyond the sticky sequence.

The chapter is divided into six visual beats:

1. **Rupture** — darkness, broken environment, dormant cracks.
2. **Awakening** — lunar-pink/gold energy begins to travel through the fracture.
3. **Transformation** — Akari transitions from standard to full Kintsugi Lunar state.
4. **Relics / anatomy** — mask, katana and Kintsugi scars are inspected editorially.
5. **Gameplay** — restore, reveal, traverse and fight are presented as playable pillars.
6. **Cost + climax + exit** — power has a price; Akari stands between destruction and restoration; a final horizontal fracture leads into the next section.

## Scroll Timeline

The desktop chapter uses a single GSAP `ScrollTrigger` timeline scoped to the new component/hook, not the global `ImmersiveExperience` timeline.

Approximate ranges:

- `0–15%`: rupture and opening copy.
- `15–30%`: Kintsugi energy activation.
- `30–55%`: Akari transformation.
- `55–70%`: relic details.
- `70–88%`: gameplay pillars.
- `88–96%`: risk / consequence.
- `96–100%`: climax and exit fracture.

The sequence must remain scrubbed and heavy, with no bounce, spring or abrupt state swaps.

## Component Architecture

### `KintsugiLunarChapter`

Top-level semantic section. Owns content, visual layers and mobile layout.

### `useKintsugiLunarTimeline`

Dedicated GSAP/ScrollTrigger hook. Responsibilities:

- build/revert the desktop scroll timeline;
- crossfade aligned Akari states;
- reveal energy/fissure overlays;
- switch narrative copy beats;
- animate relic focus;
- sequence gameplay pillars;
- drive climax and exit fracture;
- disable complex motion for reduced-motion users.

It must not add Kintsugi-specific animation logic back into `immersive-experience.tsx`.

### `KintsugiAssetSlot`

Small presentational abstraction for replaceable visual assets. Each slot is identified by its future K-code so final artwork can replace placeholders without changing layout/timeline logic.

### Content module

Create `src/content/kintsugi-lunar.ts` with PT/EN copy and structured arrays for relics and gameplay pillars. The component should not contain large hard-coded copy blocks.

## Desktop Composition

### Persistent stage

A sticky `100svh` stage sits inside the ~420svh chapter.

Visual hierarchy:

- environment rupture / restoration layer;
- lunar fracture energy overlay;
- Akari standard/Kintsugi aligned character layer;
- Blood Moon / eclipse atmosphere;
- foreground fragments;
- editorial copy plane;
- slim chapter progress indicator.

The protagonist alternates deliberately between three focal subjects:

1. Akari;
2. rupture;
3. Kintsugi energy.

No conventional cards should dominate the chapter.

### Rupture

Start nearly black. Use the existing forgotten/restored Hanamori assets as temporary K07/K08 equivalents. A procedural/SVG crack overlay provides dormant fracture paths; GSAP animates stroke/path visibility and luminance.

Energy colors use pale lunar gold, rose and cold white rather than saturated yellow or neon pink.

### Akari transformation

The definitive implementation expects two identical-composition assets:

- K01 standard Akari;
- K02 Kintsugi Lunar Akari.

Until they exist, use the closest existing aligned states available from current public assets. The transition system is built as a layered crossfade/mask architecture so K01/K02 can later drop in without changing the timeline.

Transformation stages:

1. standard state;
2. fissure overlay appears;
3. fissures emit lunar light;
4. katana energy reacts;
5. crimson atmosphere enters;
6. mask/Kintsugi state reaches full opacity.

No hard image swap.

### Relic inspection

Relics appear as editorial focus states around the persistent Akari image rather than independent cards.

Three beats:

- `RELIC 01` — Máscara do Limiar;
- `RELIC 02` — Lâmina Lunar;
- `STATE 03` — Marcas do Kintsugi.

Each beat can use a large isolated asset floating into the composition, with a fine rule, index, title, body and microcopy. Only one detail is dominant at a time.

### Gameplay pillars

Four gameplay concepts are shown as a cinematic sequence rather than a grid of cards:

- RESTAURE;
- REVELE;
- ATRAVESSE;
- LUTE.

Desktop behavior: a horizontal/diagonal editorial rail inside the sticky stage, where the active key visual occupies most of the screen and the next/previous labels remain as understated navigation context. Scroll changes the active pillar.

The future K09–K12 assets map one-to-one to these states.

### Risk / consequence

The visual palette darkens and Kintsugi luminance reduces slightly. The copy `Toda restauração exige alguma coisa em troca.` becomes the primary focal point. A thin accumulation indicator may suggest cost without implying a finalized gameplay HUD/system.

### Climax

Full Kintsugi Akari, Blood Moon, active katana, visible fracture energy and environmental fragments. The image must read as Akari standing literally between destruction and restoration.

The final copy resolves to:

- `O Eclipse apaga.`
- `Akari restaura.`
- `Mas cada memória recuperada deixa uma nova marca.`

The chapter exits through one long pale-gold/rose fracture line and the final signature:

- `KINTSUGI LUNAR`
- `Carry the fracture.`

## Mobile Architecture

Mobile does **not** reproduce the 420svh sticky desktop choreography.

Use a direct vertical sequence:

1. rupture;
2. standard Akari;
3. transformation crossfade;
4. Kintsugi Akari;
5. relic details;
6. gameplay sequence;
7. cost;
8. climax/closing.

Use normal document flow with short reveal/parallax moments. Avoid canvas-heavy effects and long sticky locks.

Gameplay pillars become a vertically stacked editorial sequence, not a horizontal carousel requiring drag.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- disable parallax and scrub-driven transforms;
- disable shader/morph distortion;
- use simple crossfades for standard → Kintsugi;
- reveal all text in readable normal flow;
- keep final states accessible without requiring exact scroll positions.

## Placeholder Asset Strategy

The implementation uses existing assets now but exposes stable future K-slots.

| Slot | Final purpose | Initial placeholder strategy |
| --- | --- | --- |
| K01 | Akari standard | existing canonical/full-body Akari asset |
| K02 | Akari Kintsugi | closest current crimson/Kintsugi character state |
| K03 | Kitsune mask | existing Akari detail/mask crop if usable |
| K04 | Lunar katana | current katana detail or existing crimson katana model/render |
| K05 | Kintsugi fissures | generated SVG/CSS transparent fracture overlay |
| K06 | Kintsugi energy | CSS/SVG trails + restrained particles |
| K07 | Broken environment | `templo-hanamori_2.png` |
| K08 | Restored environment | `templo-hanamori.png` |
| K09 | Restore gameplay | existing scene placeholder |
| K10 | Reveal gameplay | existing scene placeholder |
| K11 | Traverse gameplay | existing scene placeholder |
| K12 | Fight gameplay | existing battle/video frame placeholder where appropriate |
| K13 | Kintsugi climax hero | closest current transformed Akari state |
| K14 | Blood Moon | existing `Blood_Moon.png` / hero Blood Moon asset |
| K15 | Environmental fragments | existing shrine ruins, petals, stones and foreground assets |

When K01–K15 are produced, asset replacement should be limited to the central slot manifest and minor art-direction coordinates, not component architecture.

## Performance

- use `next/image` for raster layers;
- mount/load heavy chapter assets when the section approaches the viewport;
- keep WebGL optional and localized; default to CSS/SVG/GSAP if equivalent;
- do not duplicate large assets in multiple simultaneously visible layers unless required for crossfade;
- preserve transparent PNG only where alpha is required;
- future opaque artwork should prefer AVIF/WebP;
- mobile avoids shader-heavy effects;
- reduced-motion avoids expensive continuous effects.

## Accessibility

- all narrative copy remains in semantic DOM order;
- decorative layers are `aria-hidden`;
- no critical meaning exists only in animation;
- section remains understandable with JS motion disabled/reduced;
- sufficient contrast against changing visual backgrounds;
- no content is trapped in a sticky state.

## Integration

Current story order remains intact except for the insertion of the new chapter:

1. Cinematic Hero
2. Existing Kintsugi Chapter — unchanged
3. Realm Atlas / Nine Realms map
4. Trailer Chapter
5. Character Spotlight / Akari
6. **New Kintsugi Lunar Cinematic Chapter**
7. Experience Pillars
8. Cinematic Epilogue

The existing Kintsugi section is not refactored, renamed or visually reused as the new chapter.

## Files Expected During Implementation

- `src/components/experience/kintsugi-lunar-chapter.tsx`
- `src/components/experience/kintsugi-lunar/asset-slot.tsx`
- `src/components/experience/kintsugi-lunar/use-kintsugi-lunar-timeline.ts`
- `src/content/kintsugi-lunar.ts`
- `src/app/kintsugi-lunar-chapter.css`
- `src/components/experience/immersive-experience.tsx` — insertion only; no Kintsugi timeline logic
- `src/app/layout.tsx` — stylesheet import
- dedicated visual/browser QA workflow if needed

## Validation

Before merge:

- Prettier;
- ESLint;
- TypeScript / production build;
- desktop screenshots across transformation milestones;
- 1440×900 and ultrawide desktop;
- tablet;
- 390×844 mobile;
- reduced-motion;
- no horizontal overflow;
- no overlapping narrative copy;
- no broken sticky handoff into/out of the chapter;
- verify the old Kintsugi section remains unchanged;
- verify the new section appears immediately after Akari.
