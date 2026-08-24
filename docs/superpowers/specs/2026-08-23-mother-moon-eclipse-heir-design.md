# Mother Moon / A Herdeira do Eclipse — Design Spec

## Status
Approved in chat on 2026-08-23. This document formalizes the approved architecture before implementation.

## Placement
Insert the new chapter immediately after **Bestiário & Bosses** and before the sections that currently follow it. The chapter is a narrative deceleration: less combat and information density, more presence, mystery, silence and philosophical weight.

## Narrative Goal
The visitor must leave understanding that:

1. the Mother Moon is the spiritual memory-core of Tsukihara;
2. the Nine Realms destabilize because the Moon is forgetting;
3. a presence is associated with the Eclipse;
4. Lady Tsukino does not seek simple destruction;
5. the central conflict is philosophical: preserve a wounded world or erase the memories that sustain its suffering.

The section must not identify Tsukino as the final boss or reveal her final form, moveset, ultimate weapon, arena, confrontation with Akari, boss UI, or full plan.

## Visual Principle
This chapter must be significantly emptier than Bestiary & Bosses. The visual language is monumental, contemplative and unsettling rather than informational.

Palette:
- near-black;
- moon ivory;
- pale rose;
- deep crimson;
- extremely restrained glow.

Typography:
- `var(--display)` for monumental headings and quotes;
- `var(--sans)` for eyebrow and microcopy;
- `JpRevealText` only for selected anchor moments such as opening and closing, not every title.

Motion rule: **smaller movement, longer duration**.

Avoid:
- glitch;
- scan language from Bestiary;
- Splash Cursor;
- aggressive distortion;
- frantic particles;
- continuous camera zoom;
- heavy WebGL.

## Assets
Use the real package already present under `public/08-mother-moon`:

- M01 `/08-mother-moon/m01-mother-moon-hero.png`
- M02 `/08-mother-moon/m02-mother-moon-forgetting.png`
- M03 `/08-mother-moon/m03-memory-fragments-overlay.png`
- M04 `/08-mother-moon/m04-tsukino-silhouette.png`
- M05 `/08-mother-moon/m05-tsukino-eye-detail.png`
- M06 `/08-mother-moon/m06-tsukino-hand-detail.png`
- M07 `/08-mother-moon/m07-tsukino-eclipse-profile.png`
- M08 `/08-mother-moon/m08-mother-moon-reflection.png`
- M09 `/08-mother-moon/m09-forget-remember-divider.png`
- M10 `/08-mother-moon/m10-section-closing-eclipse.png`

The asset map must be centralized in `src/content/mother-moon.ts` so art direction can be tuned without rewriting components.

## Architecture
Create a dedicated chapter subsystem:

- `src/content/mother-moon.ts`
  - localized PT/EN copy;
  - M01–M10 map;
  - transient memory labels/phrases;
  - semantic act data.

- `src/components/experience/mother-moon-chapter.tsx`
  - chapter root;
  - five narrative acts;
  - semantic DOM;
  - responsive composition.

- `src/components/experience/mother-moon/mother-moon-asset.tsx`
  - small Next/Image slot abstraction for M01–M10;
  - stable asset codes and framing controls.

- `src/components/experience/mother-moon/mother-moon-memory-field.tsx`
  - desktop proximity interaction around the Moon;
  - no custom cursor;
  - all decorative memories duplicated or otherwise represented semantically where necessary;
  - disabled for coarse pointer and reduced motion.

- `src/components/experience/mother-moon/use-mother-moon-motion.ts`
  - scoped GSAP/CSS motion hooks if needed;
  - no giant 500svh pinned timeline;
  - natural document scroll with local sticky compositions only where justified.

- `src/app/mother-moon-chapter.css`
  - isolated `.ix-mm-*` namespace;
  - desktop/tablet/mobile and reduced-motion fallbacks.

## Act 01 — The Mother Moon

Eyebrow:
`THE MOTHER MOON`

Headline:
`Enquanto a Lua se lembra, o mundo existe.`

Narrative copy establishes that before the Nine Realms were borders, there was memory, and the Moon preserves names, paths, promises, places and people.

### Composition
- M01 is the visual protagonist and occupies roughly 65–75% of the perceived viewport height on desktop.
- The Moon is slightly offset rather than centered as a conventional poster.
- Large negative space is preserved around it.
- M03 appears as an extremely restrained orbital/memory layer.
- M08 may appear subtly at the lower edge as a black-water reflection.

### Passive motion
- 1–2% breathing scale;
- slow halo modulation;
- very small orbital drift of M03;
- shadow movement across the Moon;
- no continuous camera movement.

### Memory proximity interaction — approved Option A
Desktop with fine pointer only:

- invisible memory zones exist around/over the Moon;
- pointer proximity increases a local memory's presence;
- a memory materializes softly, remains readable briefly, then erodes/fades even if the cursor leaves;
- typical lifecycle is approximately 1–2 seconds;
- the interaction must feel incidental rather than gamified;
- no cursor replacement, no particle trail, no click requirement.

Possible memories include:
- `HANAMORI`
- `PROMISE`
- `HOME`
- `AKARI`
- `REMEMBER`
- `A place exists because someone remembers it.`
- `A name survives because someone still speaks it.`
- `A world survives because someone refuses to forget.`

On mobile/coarse pointer, these memories appear automatically in a slow decorative sequence; lore must not depend on hover.

## Act 02 — Forgetting

Headline sequence:

`O Eclipse não começa quando a Lua fica vermelha.`

then:

`Começa quando ela deixa de lembrar.`

### Visual transition
M01 transitions toward M02 using region-based masks/shadow wipes rather than a simple full-frame crossfade. Some parts of the Moon lose information before others.

M03 changes meaning from orbiting memories to lost fragments. M08 may show a reflection that appears more complete than the sky above, suggesting that water remembers what the Moon has forgotten.

### Interaction evolution
Memory proximity still works, but memories become unstable:
- incomplete words;
- reduced dwell time;
- earlier erosion;
- occasional fragments that never fully resolve.

Narrative copy explains that what leaves the Moon's memory leaves the world: first details, then paths, homes, names, and eventually places.

## Act 03 — A Presence

Tsukino is revealed progressively rather than introduced as a character card.

Preferred reveal order:
1. M04 — silhouette;
2. M06 — hand / ornament detail;
3. M05 — eye detail;
4. M07 — partial eclipse profile.

The user should perceive that someone is present before being told who she is.

Eyebrow:
`RECORD UNKNOWN`

Headline:
`Alguém acredita que esquecer pode ser uma forma de salvação.`

Controlled identity reveal:

`LADY TSUKINO`

`HERDEIRA DO ECLIPSE`

Do not use boss-card grammar, stats, threat metadata, realm fields, classified-record UI, or gameplay terminology.

### Main quote
The quote is one of the largest typographic moments of the entire site:

`“Se ninguém lembrar da dor, ninguém precisará carregá-la.”`

Most imagery should recede around the quote to maximize negative space.

### Akari counterpoint
After a deliberate pause:

`“Então também esqueceríamos por que ainda vale a pena lutar.”`

Do not require an explicit `AKARI:` label. Alignment, tone and visual treatment may imply the second voice.

## Act 04 — Philosophy of the Eclipse

Headline:
`Apagar a dor não é o mesmo que curá-la.`

Use M09 as the visual divider.

Create an almost symmetrical composition without turning it into a poll or UI choice.

Left:

`ESQUECER`
- silêncio
- paz
- ausência
- libertação

Right:

`LEMBRAR`
- cicatriz
- identidade
- história
- reconstrução

A restrained Kintsugi fracture runs through the center. The composition must allow Tsukino's philosophy to feel genuinely tempting; it must not visually label one side as obviously correct.

Narrative thesis:
- Tsukino wants to erase the rupture;
- Akari chooses to restore it;
- Tsukihara exists between these two responses.

## Act 05 — Closing Eclipse

M10 becomes the dominant key visual.

Tsukino disappears entirely. The crimson Moon remains.

Closing copy:

`Alguns querem restaurar o mundo.`

`Outros acreditam que ele nunca deveria se lembrar.`

Signature:

`THE ECLIPSE REMEMBERS.`

### Transition seed for the next chapter
The monumental image gradually loses scale and small documentary forms begin appearing near the edges:
- document frames;
- text fragments;
- dates;
- record-like marks.

This prepares **Memórias Perdidas / Arquivos de Tsukihara** without implementing that chapter yet.

## Scroll and Layout Strategy
Do not create another long 400–500svh pinned cinematic timeline.

Use natural scroll with high-height acts and local sticky compositions where useful:

- Act 01: one monumental viewport or slightly taller section;
- Act 02: local Moon transition zone;
- Act 03: progressive Tsukino reveal with isolated details;
- Act 04: philosophy composition;
- Act 05: fullscreen-style closing that releases naturally into the next section.

Long fades/dissolves can be driven by IntersectionObserver, GSAP ScrollTrigger with short local ranges, or CSS where sufficient. Avoid a single timeline controlling the whole chapter.

## Responsiveness
### Desktop
- monumental Moon scale;
- generous negative space;
- Tsukino appears laterally and partially;
- proximity memory field enabled for fine pointer.

### Tablet
- reduce Moon and Tsukino scale;
- preserve main compositions;
- prefer tap/automatic memory moments rather than requiring precise hover.

### Mobile
Explicit vertical order:
1. Mother Moon;
2. forgetting;
3. Lady Tsukino;
4. quote/counterpoint;
5. philosophy;
6. closing eclipse.

Do not miniaturize the desktop composition. No required hover. Memory fragments appear automatically and conservatively.

## Accessibility
- all narrative text exists in the DOM;
- decorative images use appropriate empty alt semantics where copy already supplies meaning;
- no lore depends exclusively on hover or motion;
- strong contrast;
- keyboard/focus behavior only where there are true controls;
- `prefers-reduced-motion` disables breathing, orbital movement, shadow travel, automatic transient fades that impede reading, and proximity-driven decorative animation;
- reduced-motion mode presents stable readable states for all five acts.

## Performance
- `next/image` for M01–M10;
- no heavy WebGL dependency;
- no full-screen continuously running canvas;
- proximity memory field uses lightweight DOM/CSS state and pointer math scoped to the Moon act;
- pointer listeners exist only when the section is relevant and conditions permit;
- avoid animating expensive layout properties;
- use transforms, opacity and masks/clip-path conservatively.

## Localization
Provide complete PT and EN content in `src/content/mother-moon.ts`.

Japanese reveal strings may be used for opening/closing anchor titles only. Do not overuse `JpRevealText` throughout the section.

## Integration Boundary
The chapter must be imported and placed after `BestiaryBossesChapter` in the immersive experience flow. Existing Bestiary/Bosses, Companions, Gameplay, Kintsugi and Akari code must not be redesigned as part of this task.

## Validation
Primary acceptance criteria:

- section clearly feels quieter and more monumental than Bestiary;
- M01–M10 are all used intentionally, not merely loaded decoratively;
- Moon remains visual protagonist through Acts 01–02;
- memory proximity interaction feels subtle and non-gamified;
- Tsukino is revealed progressively and never as a conventional boss card;
- quote moment receives substantial negative space;
- philosophy composition presents both responses with visual parity;
- mobile reads correctly without hover;
- reduced-motion mode is fully legible;
- no horizontal overflow;
- Prettier, ESLint, TypeScript and production build pass before completion is claimed.

## Out of Scope
- final boss reveal;
- Tsukino final form;
- combat or moveset;
- final arena;
- Akari/Tsukino direct confrontation;
- implementation of Memórias Perdidas / Arquivos de Tsukihara;
- new audio system;
- new WebGL/shader dependency.
