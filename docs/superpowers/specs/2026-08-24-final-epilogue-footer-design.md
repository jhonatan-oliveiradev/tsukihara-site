# Final Epilogue + Cinematic Footer — Design Spec

## Goal

Replace the existing generic `CinematicEpilogue` closing with a short cinematic epilogue and a footer that emerges from the same final Tsukihara landscape. The closing must feel like the last seconds of a film rather than another showcase chapter.

## Narrative order

The existing immersive sequence ends with:

`Lost Memories -> Final Epilogue -> Cinematic Footer`

The final implementation preserves the existing `#eclipse` anchor and does not add another long pinned chapter.

## Epilogue

Eyebrow: `THE JOURNEY CONTINUES`

Primary headline PT:

- `O mundo pode esquecer.`
- `Você não precisa.`

Primary headline EN:

- `The world may forget.`
- `You do not have to.`

Support copy communicates that Akari cannot restore everything, some memories are gone, but the journey continues while something can still be remembered.

Horizon microcopy:

- PT: `Há lugares que ainda precisam ser lembrados.`
- EN: `There are places that still need to be remembered.`
- Secondary: `THE NINE REALMS AWAIT`

## Final visual asset mapping

- F01 `/11-final/scenes/f01-akari-haku-mochi-horizon.png` — consolidated mobile/fallback key visual.
- F02 `/11-final/characters/f02-akari-haku-mochi-back-transparent.png` — desktop character depth layer.
- F03 `/11-final/scenes/f03-tsukihara-final-horizon.png` — desktop environment layer.
- F04 `/11-final/environment/f04-final-moon.png` — isolated final moon.
- F05 `/11-final/environment/f05-final-foreground.png` — foreground framing.
- F06 `/11-final/fx/f06-final-atmosphere-overlay.png` — mist/petals/particles.
- F07 `/11-final/fx/f07-footer-lunar-ornament.png` — footer ornament and easter-egg lunar control.

Desktop uses F03 + F04 + F02 + F05/F06 as shallow layered depth. F01 is not stacked behind the same characters on desktop; it is used as the mobile/fallback consolidated scene.

## Motion

Motion is intentionally quiet:

- long opacity reveal;
- 8–18px shallow translation only;
- tiny camera drift;
- subtle moon breathing;
- slow atmosphere movement;
- no long pinning;
- no new shader or WebGL system;
- no new runtime dependency.

`prefers-reduced-motion` disables drift, breathing and decorative movement without hiding content.

## Footer

The footer visually continues the epilogue instead of starting as a separate rectangle. Landscape detail decreases toward absolute black.

Content:

- `TSUKIHARA`
- `ECLIPSE OF THE NINE REALMS`
- final signature `REMEMBER WHAT REMAINS.`
- real-anchor navigation only:
  - WORLD -> `#top`
  - AKARI -> `#akari`
  - REALMS -> `#realms`
  - GAMEPLAY -> `#gameplay`
  - ARCHIVES -> `#lore`
- `© 2026 TSUKIHARA`
- `ALL RIGHTS RESERVED`

CTA, social links, Privacy and Terms render only when a real URL/page exists. Initial implementation contains no fake external CTA or social destination.

## Easter egg

F07 provides the small lunar control. Hover on fine pointer or tap activates a brief eclipse state and reveals:

PT: `Ainda há algo que você esqueceu.`

EN: `There is still something you forgot.`

It does not navigate anywhere.

## Responsive

At `<= 900px`:

- use F01 as the dominant consolidated scene;
- avoid deep freeform layering;
- keep the cinematic image bounded rather than excessively tall;
- order: visual, headline/copy, real CTA if available, logo, navigation, social if available, copyright;
- easter egg works by tap.

## Accessibility

- decorative layers use empty alt text and `aria-hidden` wrappers;
- navigation uses real anchors;
- easter egg is a real button with an accessible label;
- no hidden required content depends on hover;
- CTA/social/legal areas do not exist when destinations do not exist.

## Scope

Replace/rebuild the final epilogue/footer only. Do not modify Lost Memories, Mother Moon or earlier chapters except the CSS import needed for the new closing visual system.
