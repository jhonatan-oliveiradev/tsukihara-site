# Tsukihara — Global Rhythm Refinement

## Status
Approved in chat on 2026-08-24. This document captures the final global refinement pass before implementation planning.

## Goal
Reduce the perceived length and visual friction of the site without flattening its cinematic identity. The pass must synchronize major motions, compress oversized transitions, remove layout overflows, improve section handoffs, and make interactive systems feel intentional rather than independently assembled.

## Source branch
`refactor/final-global-refinement` is based on `feat/final-epilogue-footer` so all validated Lost Memories, epilogue and footer work remains intact.

## Wave 01 — Global rhythm and hero eclipse synchronization

### Hero eclipse beats
Replace independent text timings with shared semantic beats used by both visual and copy layers:

1. `contact` — the black moon first touches the yellow moon. Intro copy exits and the second sentence begins.
2. `transit` — the black moon is crossing the yellow moon. The second sentence remains active for the full transit.
3. `crimson` — the occulting body exits and the Crimson Moon is established. The third sentence enters here.

The existing eclipse visual choreography is preserved; only timing ownership is corrected so text responds to visual phase boundaries.

The existing timeline math is the source of truth for phase calculations. Add/adjust only the small regression tests needed to protect these three boundaries.

### Kintsugi separator
The decorative transition asset below the hero must no longer stretch across the viewport. It renders centered at natural aspect ratio with `object-fit: contain`, bounded width, and no horizontal deformation.

### Global section density
Reduce oversized section-intro headlines and vertical spacing by roughly 15–25% on desktop. Do not globally shrink every headline. Keep genuinely climactic scenes monumental.

After this first density pass, visual validation decides whether additional negative-space compression is necessary.

### Scrollbar
Add a global thematic scrollbar using the existing charcoal / ivory / aged-gold / wine palette. It must remain narrow, legible and unobtrusive. Nested scroll regions use a smaller compatible variant.

## Wave 02 — Nine Realms refinement

### Water ripple
The current `RippleDistortionImage` based on Paper LensDistortion does not visually read as water. Replace it with a dedicated water-ripple interaction inspired by the ReactBits Ripple Distortion behavior:

- pointer movement injects local circular displacement;
- ripples expand and decay;
- overlapping ripples blend into a water-surface response;
- no heavy chromatic/glitch treatment;
- reduced motion falls back to the static image;
- mobile/touch must remain performant and usable.

Using `ogl` is acceptable if needed and should be isolated inside the ripple component.

### Realm atlas density
Keep the active realm stage dominant but shorten the total section height. On desktop, the nine-realm index becomes a bounded vertical scroll region rather than forcing all nine entries to consume full-page height.

The active item must automatically remain visible in the internal list.

### Realm inspector overflow
Remove unnecessary horizontal scrolling from realm informational cards/inspectors. Containers must use `min-width: 0`, bounded widths and wrapping. No horizontal scrollbar should appear in normal desktop or mobile viewport widths.

## Wave 03 — Akari and Bestiary continuity

### Akari intro → details handoff
The transition from normal document flow into the pinned/sticky Akari detail stage must be softened. Add an explicit entry handoff using opacity, translate and/or masks so the detail stage is visually introduced before sticky behavior takes over.

### Akari details → full figure → next section
The end of the mosaic/details sequence must have a real release phase. The completed Akari visual remains briefly established, then the pinned state visually dissolves into the next section instead of abruptly returning to normal flow.

Reduce the desktop mosaic scroll distance from the current ~620svh to the shortest value that still gives all detail beats enough reading time.

### Akari manifesto copy
The static manifesto/closing copy uses the same Japanese → localized-language reveal behavior already established elsewhere in the site. Do not invent a second text-transition system.

### Bestiary card stacking
Hover, focus and active specimen cards must rise above siblings with explicit stacking order. The first specimen must be able to visually overlap later cards when highlighted.

### Bestiary transition phrase relocation
`Alguns seres não cabem em um registro.` / localized equivalent stops being a standalone oversized vertical act. Move it into the currently empty editorial space before/alongside the restricted bosses section so it becomes a transition caption rather than a large section break.

## Wave 04 — Structural compression

### Trailer
Remove `TrailerChapter` as a standalone chapter.

Keep `/assets_hq/video_battle.mp4`, but integrate it into Gameplay as a compact `COMBAT REEL / FIELD FOOTAGE` visual:

- bounded cinematic frame, approximately 16:9 or 21:9;
- desktop height around 45–55svh maximum;
- muted loop or controlled preview consistent with current behavior;
- no separate large headline/body section;
- optional expansion only if it remains lightweight and accessible.

This preserves the useful asset while recovering substantial page length.

### Lost Memories horizontal archive
On desktop, Lost Memories becomes a pinned horizontal archive sequence using GSAP ScrollTrigger.

`l11-archive-table-background` becomes the continuous horizontal table/environment rather than a repeated vertical background.

Recommended sequence:

1. intro / archive index
2. surviving letters
3. spiritual photographs
4. memory relics
5. Nine Realms records
6. lunar observation + BLACK-00
7. AKR-001 / Remember What Remains

Panels should have varied widths and overlap where appropriate; this must feel like moving across one physical archive table, not a carousel of seven 100vw slides.

Vertical scrolling resumes immediately after the archive sequence.

Mobile remains editorial and vertical: no pinned horizontal scroll.

Existing viewer behavior, BLACK-00 silence, Memory Decay and accessibility semantics must remain intact.

## Motion and accessibility rules

- Respect `prefers-reduced-motion` everywhere.
- Do not add another long site-wide pin sequence beyond the bounded Lost Memories horizontal archive.
- Internal scroll regions must be keyboard and wheel accessible.
- Pinned/sticky sections must never trap keyboard navigation.
- Text content must remain present in the DOM even when animated.
- No new decorative interaction should compete with the narrative hierarchy.

## Scope control

This pass is not a visual redesign. Existing art direction, content, navigation anchors, Lost Memories viewer, Mother Moon, final epilogue/footer and core realm/bestiary data remain intact unless explicitly listed above.

Do not add new narrative sections.

## Verification

Automated coverage remains intentionally minimal:

- focused hero timeline boundary tests for `contact`, `transit`, `crimson`;
- existing TypeScript/build integrity;
- Prettier and ESLint;
- production build.

Everything else is validated primarily through the ongoing visual review at desktop/tablet/mobile widths, including section length, transition quality, water-ripple feel, internal scroll ergonomics and horizontal archive pacing.

## Success criteria

The refinement is successful when:

- hero copy changes exactly at visible eclipse beats;
- the Kintsugi separator is centered and undistorted;
- major intro headlines and dead space no longer unnecessarily extend the page;
- realm ripple reads as water rather than generic lens distortion;
- Realm Atlas is shorter and has no unwanted horizontal scroll;
- Akari enters and exits its sticky detail stage without visual cuts;
- bestiary active cards stack correctly and the transition phrase no longer consumes a large empty act;
- the trailer remains visible without owning a standalone section;
- Lost Memories reads as one navigable horizontal ritual archive on desktop;
- themed scrollbars support, rather than dominate, the interface;
- the site feels materially shorter while retaining its cinematic pacing.