# Companions Interactive Hub — Design

## Goal

Create a new premium section immediately after Gameplay focused on Haku and Mochi. The section must change the interaction rhythm of the site: no long pinned scroll sequence, no scene-by-scene slideshow, and no repeated cinematic grammar. The user should understand that Haku and Mochi extend Akari's traversal, perception and emotional journey.

## Core experience

The desktop section behaves as a living interactive hub. Akari, Haku and Mochi remain the visual center of gravity while Haku and Mochi act as focusable interactive states. Hover, keyboard focus and explicit click selection all produce the same state change.

Base state:

- group composition centered using `/06-companions/group/c03-akari-haku-mochi-group.png`
- restrained lunar orbital lines, halos and atmospheric particles
- no companion panel dominates
- supporting intro copy establishes the trio

Haku state:

- right/lateral emphasis
- isolated Haku asset `/06-companions/characters/c01-haku-character.png`
- traversal key visual `/06-companions/scenes/c04-haku-traversal-key-visual.png`
- palette shifts slightly lighter/lunar and more aerial
- atmospheric motion behaves like spiritual wind
- labels/tags: Traversal, flight, mobility, reach, altitude

Mochi state:

- left/intimate emphasis
- isolated Mochi asset `/06-companions/characters/c02-mochi-character.png`
- memory key visual `/06-companions/scenes/c05-mochi-memory-key-visual.png`
- palette shifts toward warm crimson, muted sakura and memory fragments
- cursor response becomes slightly more visible but remains restrained
- labels/tags describe perception, hidden paths, memory and discovery

Closing state:

- emotional full-width composition using `/06-companions/scenes/c06-akari-haku-hero-flight.png`
- headline: `Travessia, memória e coragem compartilham o mesmo caminho.`
- supporting copy closes on the three forces: moving forward, seeing deeper and remembering what matters

## Interaction model

Desktop:

- no master pin timeline
- section remains normal document flow
- hub occupies a large but finite viewport-oriented composition
- Haku/Mochi targets respond to hover, focus-visible and click
- active state changes copy, key visual, lighting, halo, background particles and cursor palette
- transitions use opacity, short drift, bloom and mask/dissolve only
- active state remains selected after click until another state is selected
- hover may preview a state; pointer leave returns to the selected state rather than forcing the base state
- keyboard focus must expose the same information as hover

Mobile/touch:

- no cursor effect
- no hover dependency
- intro group composition first
- compact segmented controls/tabs switch between Haku and Mochi
- each state presents the isolated character, key visual, copy and microcopy in vertical flow
- closing hero follows afterward
- no long sticky behavior

## Cursor atmosphere

Do not import a heavy global Splash Cursor implementation. Reproduce only the desired local interaction language with a lightweight section-scoped effect.

Preferred implementation:

- local `<canvas>` layer using 2D drawing
- pointer velocity drives a small number of dissipating soft particles/rings
- canvas is clipped to the companions section
- no effect over text layers
- Haku state uses pale lunar pink / cool ivory influence
- Mochi state uses deep wine / warm crimson influence
- base state stays between both palettes

Performance rules:

- cap active particles aggressively
- use requestAnimationFrame only while the section is intersecting and motion is allowed
- disable on coarse pointers/touch
- disable entirely for `prefers-reduced-motion`
- no WebGL requirement
- no external runtime dependency solely for this effect

## Motion language

Use:

- fade + 8–20px drift
- slow halo breathing
- very subtle orbital rotation
- dissolve between Haku/Mochi key visuals
- modest energy bloom on state transition
- gentle character breathing/parallax limited to a few pixels

Avoid:

- bounce or elastic easing
- aggressive zoom
- large distortion
- camera shake
- high particle density
- persistent cursor trails across text

## Typography and copy treatment

Use the same project-wide editorial display token already established elsewhere (`var(--display)`) and the same sans token for metadata/body UI. Do not introduce a new serif stack.

Use the existing `JpRevealText` treatment for the main intro headline, Haku title, Mochi title and closing headline so this chapter remains consistent with the site's kanji-to-alphanumeric language while differing in interaction model.

## Components

Recommended boundaries:

- `CompanionsChapter` — semantic section and state ownership
- `CompanionHub` — desktop interactive composition and focus targets
- `CompanionPanel` — shared Haku/Mochi copy/key-visual presentation
- `CompanionsAtmosphere` — isolated canvas cursor effect
- `CompanionsMobile` — mobile/touch state controls and vertical composition
- content module containing PT/EN copy, tags and asset paths

Keep the state model small: `base | haku | mochi`. Do not create a global store; local React state is sufficient.

## Placement

Insert the new section immediately after `GameplayChapter` in the immersive experience sequence. Existing sections before and after must remain structurally unchanged.

## Accessibility

- interactive companion targets are real buttons, not divs
- visible focus treatment integrated into halos/orbital marks
- click/tap is always available, even on desktop
- labels remain readable without motion
- reduced-motion version shows stable crossfades/no cursor particles
- semantic headings remain in document order
- color is not the only indication of active state

## Assets

Canonical paths:

- `/06-companions/characters/c01-haku-character.png`
- `/06-companions/characters/c02-mochi-character.png`
- `/06-companions/group/c03-akari-haku-mochi-group.png`
- `/06-companions/scenes/c04-haku-traversal-key-visual.png`
- `/06-companions/scenes/c05-mochi-memory-key-visual.png`
- `/06-companions/scenes/c06-akari-haku-hero-flight.png`

Ignore the duplicate root-level `c03-akari-haku-mochi-group.png`; do not delete it as part of this feature.

## Validation approach

The user will perform primary visual validation locally. TDD is explicitly out of scope for this task.

Before marking implementation ready, still run the repository's lightweight non-TDD safety gates available through CI/build tooling where practical:

- formatting
- lint
- TypeScript / production build

Do not spend time creating a new dedicated visual regression workflow for this section unless a runtime problem requires one.

## Success criteria

The section succeeds when:

- it feels materially different from previous scroll-led chapters
- Haku and Mochi each communicate a gameplay-relevant role without becoming cards
- cursor response feels atmospheric, not playful or noisy
- hover, focus and click all produce coherent companion states
- mobile remains clear without cursor/hover
- typography and kanji reveal remain consistent with the rest of the site
- the ending reinforces that Akari's journey is sustained by a bond, not solo heroism
