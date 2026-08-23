# Bestiary & Bosses — Forbidden Records Design

## Goal

Create a new large section immediately after Companions that changes the site's tone from beauty, exploration and bonds to threat, corruption and forbidden knowledge. The section has two acts: Bestiary and Bosses.

## Placement

Insert `BestiaryBossesChapter` immediately after `CompanionsChapter` and before `ExperiencePillars`.

## Core visual language

The section should feel like a forbidden archive, ritual field codex and diegetic record corrupted by the Crimson Eclipse. Avoid cards, long pinned scrolls, conventional parallax, slideshow-by-scroll and the same hover language used in Companions.

Base palette remains dark. Entity-specific accent colors are restrained and used only for metadata, glow, scan and local atmosphere.

## Architecture

Use one root section with two isolated acts:

1. `BestiaryAct`
   - six asymmetric specimens
   - proximity reveal on fine-pointer desktop
   - click/focus activation fallback
   - one shared diegetic metadata rail
   - CSS masks/filters plus lightweight Canvas/SVG scan/noise accents

2. `BossesAct`
   - four dominant boss records
   - vertical side index instead of carousel
   - active boss controls key visual, copy, atmosphere and accent
   - Tsukino remains classified and cannot be fully revealed

Do not introduce WebGL as a requirement. Prefer CSS, SVG and Canvas 2D.

## Stable asset slots

Define stable B01–B12 ids in a central content manifest. Temporary mock sources may point to existing project assets, but components consume only the slot manifest. Final assets should require only source replacement.

- B01 Yokai Fraturado
- B02 Guardião Lunar Corrompido
- B03 Máquina Litúrgica
- B04 Eco de Mizukyo
- B05 Predador da Noite
- B06 Aberração de Gekkai
- B07 Imperador Sem Rosto
- B08 Kaien Aramasa
- B09 Yume
- B10 Lady Tsukino teaser
- B11 Bestiary silhouettes overlay
- B12 Bestiary FX overlay

## Act 1 — Bestiary

### Intro

Eyebrow: `BESTIARY / FORBIDDEN RECORDS`

Headline: `Aquilo que o Eclipse não apaga, ele transforma.`

Support copy establishes that some memories remain, refuse to die, or learn to fight to avoid being forgotten.

### Specimen layout

Desktop uses an irregular 6-item matrix rather than repeated cards. Each specimen is a semantic button.

Inactive specimen:
- dark silhouette
- grayscale
- blur/noise
- low contrast
- scan artifacts
- metadata mostly withheld

Proximity reveal:
- pointer distance maps to a 0–1 reveal strength
- strength controls grayscale, blur, contrast, overlay opacity and mask size
- nearest specimen gains texture and depth
- active specimen persists after click/focus
- proximity is enhancement only, never the sole access path

Active metadata rail:
- `ENTRY NN / 06`
- name
- realm
- type
- status `UNSTABLE`
- threat level
- one or two line description

### Bestiary transition

After the sixth record, archive organization visibly degrades:
- grid lines break
- offsets appear
- micro-jitter increases slightly
- noise rises modestly
- some labels disappear

Then reveal: `Alguns seres não cabem em um registro.`

This transition is short and not a pinned scene.

## Act 2 — Bosses

Bosses use a dominant stage occupying roughly 60–70% of the viewport width on desktop, with a vertical navigation list:

- 01 IMPERADOR
- 02 KAIEN
- 03 YUME
- 04 TSUKINO

Hover/focus previews and click selects. The active boss changes image, minimal metadata, ambient accent and background response. Transitions are slow fades, subtle scale and light blooms, not ecommerce slides.

### B07 — O Imperador Sem Rosto

Realm: Kurogane
Aspect: Ordem
Accent: black / metal / amber
Quote: `Perfeição não precisa ser lembrada.`

### B08 — Kaien Aramasa

Realm: Hinokagura
Aspect: Dor
Accent: burnt red
Quote: `Se eu esquecer a ferida, o que restará de mim?`

### B09 — Yume

Realm: Yumegakure
Aspect: Desejo
Accent: deep violet
Quote: `Por que voltar para um mundo que já te feriu?`

### B10 — Lady Tsukino

Label: `RECORD CLASSIFIED`
Accent: lunar white / absolute black / restrained crimson
Only silhouette/detail framing. Never expose a full render or unlock interaction beyond the teaser.
Copy: `Alguns registros foram apagados antes mesmo do Eclipse começar.`
CTA-like denied label: `ACCESS DENIED`

## Final transition

After Tsukino:

Headline: `O Eclipse não cria monstros.`

Complement: `Ele revela aquilo que já estava tentando sobreviver.`

The archive progressively empties. A subtle Mother Moon reference remains to bridge into a future Lua-Mãe + Lady Tsukino chapter.

## Motion

### Bestiary
- scan lines
- mask reveal
- grayscale to color
- blur to sharp
- restrained noise/displacement illusion
- subtle chromatic offset
- tiny jitter only in archive corruption moments

### Bosses
- slow image fades
- very small scale drift
- gradual light emergence
- UI recedes when a boss becomes active
- heavier, calmer presence than Bestiary

Avoid bounce, aggressive zoom, screen shake and constant distortion.

## Typography

Use existing `var(--display)` and `var(--sans)` tokens. Use `JpRevealText` only for major act headlines and final transition, not every label.

## Responsive behavior

### Desktop
Full cursor proximity and boss focus behavior.

### Tablet
Reduce pointer proximity intensity. Click/tap becomes primary activation.

### Mobile
Bestiary becomes a vertical list/gallery with image, name, realm and short description. Bosses become full-width image with metadata below. No heavy canvas effect or proximity dependency.

## Accessibility

- specimens and boss indexes are real buttons
- keyboard focus activates the same state as pointer focus
- Enter/Space work natively
- textual content always exists in DOM
- color is not the sole active signal
- visible focus styles integrate with the archive language
- reduced motion disables jitter/proximity animation and uses stable reveals

## Performance

- use Next Image where practical
- lazy-load noncritical images
- do not run full-page effects
- canvas/SVG layers are local to the section
- cap animated particles/noise layers
- no WebGL requirement
- only the active boss should receive the strongest visual treatment

## Validation

Primary visual validation is local/manual. Before handoff, run repository formatting, lint and production build. No dedicated visual regression workflow is required unless implementation reveals a runtime issue.
