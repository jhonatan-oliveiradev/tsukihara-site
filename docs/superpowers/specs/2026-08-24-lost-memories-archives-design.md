# Lost Memories / Arquivos de Tsukihara — Design

Date: 2026-08-24

## Summary

Replace the current `ExperiencePillars` section that appears immediately after `MotherMoonChapter` with a new `LostMemoriesChapter`, preserving the existing `id="lore"` anchor so navigation remains stable.

The new chapter must create a deliberate change of scale and rhythm. Instead of another cinematic hero, the visitor enters a ritualistic archive: letters, spiritual photographs, relics, maps and lunar observations belonging to people and places being erased by the Eclipse.

The visual metaphor is a physical investigative archive inside Tsukihara, not a modern dashboard.

## Narrative goal

The chapter must move the threat of the Eclipse from abstract cosmology to human consequence.

By the end of the section, the visitor should understand that Tsukihara is losing ordinary lives and memories, not only kingdoms and legendary events:

- names;
- letters;
- families;
- records;
- photographs;
- maps;
- objects;
- small stories;
- people who would never become legends.

The emotional target is: **“people really lived here.”**

## Placement and site integration

Current sequence:

`MotherMoonChapter -> ExperiencePillars -> CinematicEpilogue`

New sequence:

`MotherMoonChapter -> LostMemoriesChapter -> CinematicEpilogue`

Rules:

- `ExperiencePillars` is removed from the immersive sequence.
- `LostMemoriesChapter` owns `id="lore"` and `data-section`.
- Existing top navigation to `#lore` continues to work.
- `CinematicEpilogue` remains unchanged in this scope.
- The archive ending should visually prepare a later philosophical climax, but must not redesign the epilogue in this PR.

## Core visual language

The chapter should feel like a hybrid of:

- historical archive;
- ritual codex;
- investigative table;
- memorial;
- archaeological collection;
- diegetic game system.

Avoid:

- SaaS cards;
- uniform grids;
- generic carousel behavior;
- tabbed dashboard UI;
- a long pinned scroll sequence;
- giant cinematic portraits dominating the chapter;
- heavy glitch effects.

Palette:

- near-black and charcoal;
- ivory paper;
- lunar white;
- wine red;
- aged gold;
- restrained spiritual pink only where appropriate.

Typography:

- serif for document/history content;
- mono or condensed sans for metadata and archive codes;
- handwritten treatment only as a small decorative detail, never for long text.

## Asset source of truth

All final archive assets already exist in `main` under `public/09-lore-archives`.

Use only these final assets for the new chapter:

- `letters/l01-hanamori-letter.png`
- `letters/l02-hinokagura-letter.png`
- `letters/l03-amahara-letter.png`
- `photographs/l04-spirit-photographs.png`
- `relics/l05-memory-relics.png`
- `records/l06-nine-realms-archive-map.png`
- `records/l07-lunar-observation-diagram.png`
- `records/l08-black-archive-document.png`
- `records/l10-akari-memory-record.png`
- `fx/l09-memory-fragments-overlay.png`
- `fx/l12-forget-remember-transition.png`
- `backgrounds/l11-archive-table-background.png`

Do not regenerate these assets or substitute generic placeholders.

## Chapter architecture

The implementation should be split into focused units rather than a single large component.

### `lost-memories-chapter.tsx`

Owns the chapter shell, headline, archive index, group ordering, transition copy and final AKR-001 reveal.

Responsibilities:

- render chapter intro;
- maintain currently opened archive item;
- coordinate close/open semantics;
- host the five archive groups;
- host final transition and signature.

### `archive-table.tsx`

Desktop archive surface.

Responsibilities:

- place document/relic/photograph records asymmetrically over L11;
- render Dormant and Inspect states;
- expose semantic buttons/focus targets for each inspectable item;
- keep decorative overlap separate from readable metadata.

This is an editorial freeform composition, not a CSS card grid.

### `archive-record-viewer.tsx`

Diegetic Open state.

The selected archive item is visually brought toward the visitor rather than displayed in a conventional modal box.

Responsibilities:

- dim and defocus the archive surface;
- promote the selected artifact/document to a foreground inspection layer;
- render archive code, status and narrative text;
- return focus to the originating item on close;
- support Escape to close;
- prevent background archive controls from receiving focus while inspection is open.

The viewer may use an overlay layer inside the chapter, but should not look like a generic modal component.

### `archive-realm-records.tsx`

Nine-Realm documentary sub-system anchored visually around L06.

It contains compact realm records without turning them into nine identical cards.

### `memory-decay-text.tsx`

A small progressive visual effect used only by selected records.

Rules:

- source text remains present and accessible in the DOM;
- only visual spans decay;
- decay begins after an item remains open for a short delay;
- hover, pointer movement or keyboard focus restores the disappearing words;
- reduced motion disables the decay animation;
- the feature is used sparingly, not globally.

### `lost-memories.ts`

Localized data and metadata for PT/EN:

- section copy;
- archive groups;
- item codes;
- rarity/status;
- stories;
- realm fragments;
- lunar record text;
- BLACK-00 copy;
- AKR-001 metadata.

### `use-lost-memories-motion.ts`

Local GSAP/ScrollTrigger behaviors only.

No new animation library.

Responsibilities:

- intro reveals;
- subtle table item entrance;
- physical lift response where CSS alone is insufficient;
- spirit photo visibility reactions;
- BLACK-00 silence/reveal timing;
- archive emptying/transition motion;
- L12 transition reveal.

The hook must not introduce long pinned scroll choreography.

## Intro

Eyebrow:

`LOST MEMORIES / ARCHIVE 09`

Headline:

**Algumas histórias só existem porque alguém se recusou a esquecê-las.**

Support copy communicates that some memories survive in paper, objects and vanished places, and that the archive preserves what the Eclipse has not yet erased.

The opening should feel quiet and documentary. L11 can begin to appear beneath the text as the visitor approaches the archive surface.

## Archive index

Desktop may include a restrained vertical index:

- `01 LETTERS`
- `02 PHOTOGRAPHS`
- `03 RELICS`
- `04 REALMS`
- `05 LUNAR RECORDS`

This is not a tab system.

Each entry scrolls/focuses its corresponding archive group using normal anchor/`scrollIntoView` behavior.

Mobile may reduce the index to a compact textual directory near the intro or omit the persistent side treatment while preserving anchor navigation semantics.

## Interaction states

Every inspectable archive item follows the same semantic model.

### Dormant

- object/document rests on the archive surface;
- minimal metadata;
- no excessive glow or obvious UI chrome.

### Inspect

Triggered by hover or keyboard focus:

- translate upward a few pixels;
- rotate no more than about 1–2 degrees;
- shadow becomes slightly clearer;
- archive code/status appears;
- texture/image contrast can increase subtly;
- optional small metadata leader lines can appear.

No large scale jump.

### Open

Triggered by click, Enter or Space:

- selected item is visually promoted toward the user;
- surrounding table loses contrast and depth;
- story/metadata becomes readable;
- close interaction is diegetic but semantically clear;
- Escape closes;
- focus is managed correctly.

Only one item may be open at a time.

## Group 01 — Letters

Headline:

**Palavras permanecem mais tempo que algumas pessoas.**

Use L01–L03 as three separate archive records.

### Hanamori

Code: `MEMORY / HNM-014`

Text:

> A árvore floresceu novamente esta manhã.
>
> Sua mãe disse que isso significa que você encontrará o caminho de volta.
>
> Eu não tive coragem de dizer a ela que já não consigo lembrar do seu rosto.

Signature appears partially erased.

This is one of the records eligible for Memory Decay. Only non-critical visual words should decay; the complete accessible text remains available.

### Hinokagura

Code: `MEMORY / HNK-032`

Text:

> Hoje queimamos o templo pela terceira vez.
>
> Amanhã ele estará de pé novamente.
>
> Não sei mais se isso é um milagre ou uma punição.

### Amahara

Code: `MEMORY / AMH-008`

Text:

> Os sinos tocaram esta noite.
>
> Nenhum de nós lembra quem deveria ouvi-los.

## Group 02 — Spiritual photographs

Headline:

**Algumas imagens continuam lembrando mesmo quando ninguém mais consegue.**

L04 is a source sheet, not a single flat card.

Desktop should crop/compose portions of L04 into multiple overlapping spiritual plate windows, suggesting:

- family before a temple;
- child with an amulet;
- priests before the Moon;
- village before the Eclipse;
- absent person represented by a white silhouette.

The interaction may selectively alter mask/opacity/contrast so parts of a photograph momentarily disappear and return.

Do not pretend these are modern photographs.

## Group 03 — Relics

Headline:

**Nem toda memória precisa de uma mente.**

L05 is displayed as one visual relic sheet with semantic interactive hotspots positioned over its individual objects.

Relics:

- ritual bell — reproduces one memory;
- comb — belonged to a person whose name was erased;
- broken mask — still reacts to lunar energy;
- amulet — contains coordinates for a place that no longer exists;
- key — no known door accepts its shape.

Hover/focus response may include a restrained localized echo ring, short memory word, or subtle glow. Do not reuse Splash Cursor.

Hotspots must have accessible names and keyboard focus.

## Group 04 — Nine Realm records

L06 is the documentary anchor.

Each realm receives a compact archive annotation with:

- record code;
- realm name;
- status;
- memory type;
- last verified;
- one-line fragment.

Fragments:

- Hanamori — “Uma casa desapareceu. A família ainda coloca quatro pratos na mesa.”
- Kurogane — “As máquinas continuam registrando funcionários que já não existem.”
- Mizukyo — “Um reflexo apareceu três dias antes da pessoa que deveria produzi-lo.”
- Amahara — “Um monge esqueceu o nome do deus para quem rezava há sessenta anos.”
- Hinokagura — “As cinzas começaram a falar com vozes que ninguém reconhece.”
- Yumegakure — “Alguns habitantes recusam-se a acordar.”
- Yoru no Mori — “A floresta começou a lembrar medos que seus visitantes já esqueceram.”
- Gekkai — “Dois lugares tentaram existir no mesmo espaço.”
- Tsuki no Miya — `RECORD SEALED`.

The records should be distributed around/map-linked rather than rendered as nine uniform cards.

## Group 05 — Lunar records

Headline:

**Antes do Eclipse, alguém já sabia que isso poderia acontecer.**

L07 anchors the technical observation material.

Primary record:

`LUNAR OBSERVATION 441`

Content:

> A Lua-Mãe não apresenta sinais de deterioração física.
>
> O problema parece estar relacionado à retenção.
>
> [linha apagada]
>
> Se a memória central falhar, os reinos...

This is the second optional Memory Decay target.

## BLACK-00 forbidden record

Use L08.

Code: `ARCHIVE / BLACK-00`

Visual treatment is darker and more restrained than surrounding records.

When opened:

1. archive background becomes nearly silent visually;
2. decorative motion/particles reduce strongly;
3. after a short intentional pause, reveal:

**“O esquecimento não começou com o Eclipse.”**

Then:

`Remaining data corrupted.`

The pause should be approximately 1–1.5 seconds, not a blocking multi-second delay that harms usability.

Keyboard/reduced-motion users receive the same content without needing to wait through theatrical motion.

## Rarity/status system

Allowed labels:

- `PRESERVED`
- `FRAGMENTED`
- `UNSTABLE`
- `CORRUPTED`
- `SEALED`

These are metadata, not collectible-game badges. Styling should stay typographic and archival.

## Motion language

Motion should feel physical and intimate:

- 4–10px lifts;
- 1–2 degree rotation maximum;
- localized shadow changes;
- paper texture/ink becoming clearer;
- restrained glass reflection;
- slow dust/fragment ambience from L09;
- small localized memory echoes around relics;
- letters or ink disappearing in Memory Decay.

Do not use:

- long pinning;
- cinematic camera zooms;
- heavy parallax;
- heavy glitch;
- global cursor effects.

`prefers-reduced-motion` disables non-essential transforms, decay, and theatrical delays while preserving all content and interactions.

## Desktop composition

Target content width: roughly 1400–1800px maximum depending on viewport.

The desktop archive has two visual scales:

1. section intro/index;
2. freeform archive surface built over L11.

The archive surface is intentionally imperfect and asymmetric:

- one large central document/record;
- photographs partly overlapping nearby;
- relic sheet positioned toward an edge;
- lunar diagram beneath or behind selected papers;
- realm map as a documentary sub-zone;
- metadata positioned with deliberate editorial spacing.

The composition may use CSS absolute positioning inside bounded group surfaces, but readable content must not depend on arbitrary overlap.

## Mobile behavior

At `<= 900px`, abandon the freeform table composition.

Use a vertical editorial sequence:

- group heading;
- large asset;
- metadata;
- narrative copy;
- next record.

Rules:

- no drag;
- no hover dependency;
- Open state works by tap;
- no clipped off-screen documents;
- realm records become a readable vertical archive sequence;
- L04 crops remain large enough to understand;
- relic hotspots become explicit tap targets or stacked relic descriptions.

## Accessibility

- all inspectable items are real buttons or equivalent semantic controls;
- keyboard focus reproduces Inspect state;
- Enter/Space opens;
- Escape closes;
- opened archive layer has an accessible heading and close control;
- focus returns to the originating archive item after close;
- decorative images use empty alt text;
- meaningful image-derived information is repeated in text, not encoded only in imagery;
- Memory Decay never removes accessible source text;
- status and archive codes remain readable without color;
- reduced motion preserves content and removes non-essential delay.

## Transition copy

After the archive exploration:

**Um mundo não desaparece quando suas cidades caem.**

Then:

**Desaparece quando ninguém consegue mais contar que elas existiram.**

The archive surface gradually loses objects and visual density.

## AKR-001 closing record

Use L10 as the final isolated record.

Visible metadata only:

`MEMORY RECORD / AKR-001`

`OWNER: AKARI`

`STATUS: UNKNOWN`

Do not reveal the record body.

Then show:

**REMEMBER WHAT REMAINS.**

## Transition out

Use L12 to create a restrained handoff toward the later philosophical climax.

The ending should imply:

- archive records disappearing;
- a mostly empty field;
- one Kintsugi-like fissure;
- conceptual polarity of `ESQUECER` and `LEMBRAR`.

In this scope, the transition ends before changing `CinematicEpilogue`.

## State and data flow

`LostMemoriesChapter` owns a single `openRecordId: string | null` state.

Child items call `onOpen(recordId)`.

`ArchiveRecordViewer` receives the resolved record object and `onClose`.

No URL routing is required for individual records in this version.

No persistence is required after reload.

No global state store is needed.

## Performance constraints

- use `next/image` for archive imagery;
- give images appropriate `sizes` values;
- only priority-load imagery needed immediately near chapter entrance;
- avoid mounting duplicate full-resolution assets unnecessarily;
- animate wrappers rather than repeatedly changing `next/image` source/state;
- no new heavy dependency;
- use existing GSAP only for motion that CSS cannot express cleanly;
- keep pointermove effects RAF-throttled or CSS-driven;
- do not create continuous React state updates on pointer movement.

## Files expected to change

Likely new files:

- `src/components/experience/lost-memories-chapter.tsx`
- `src/components/experience/lost-memories/archive-table.tsx`
- `src/components/experience/lost-memories/archive-record-viewer.tsx`
- `src/components/experience/lost-memories/archive-realm-records.tsx`
- `src/components/experience/lost-memories/memory-decay-text.tsx`
- `src/components/experience/lost-memories/use-lost-memories-motion.ts`
- `src/content/lost-memories.ts`
- `src/app/lost-memories-chapter.css`

Likely modified files:

- `src/components/experience/immersive-experience.tsx`
- `src/app/layout.tsx`

`ExperiencePillars` can remain in the repository if still useful historically, but it must no longer render in the active immersive sequence. Deleting it is optional and should be avoided unless clearly safe and useful.

## Validation expectations

Before handoff:

- Prettier/format check passes;
- ESLint passes;
- production Next.js build/type checking passes;
- verify desktop composition at representative wide and laptop widths;
- verify <=900px vertical layout;
- keyboard-open/close path works;
- Escape and focus restoration work;
- no horizontal overflow;
- no obvious image flicker or `next/image` remount artifacts during inspect/open states;
- no long scroll trap/pin introduced;
- no console errors;
- `#lore` navigation still lands in the new chapter;
- `CinematicEpilogue` still follows the chapter unchanged.

## Out of scope

- redesigning `CinematicEpilogue`;
- implementing the final philosophical climax as a standalone new chapter;
- adding new assets beyond L01–L12;
- full freeform drag-and-drop of the archive table;
- persistent archive state across reloads;
- backend/database support;
- audio playback tied to individual relics;
- a global falling-leaf or global particle redesign.

## Success criteria

The chapter succeeds when it stops reading like a feature list and starts reading like evidence that Tsukihara had ordinary lives before the Eclipse.

The visitor should be able to inspect the archive naturally, understand the relationship between personal memories and the larger cosmology, discover BLACK-00 as a meaningful mystery, and leave the chapter with AKR-001 unresolved.

The final emotional handoff is not “look at this beautiful world,” but:

**“If these memories disappear, the people who lived them disappear too.”**
