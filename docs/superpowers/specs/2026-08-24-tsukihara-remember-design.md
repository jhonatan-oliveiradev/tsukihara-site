# Tsukihara — REMEMBER Design

## Purpose

`/remember` is a fullscreen narrative ritual inside the existing Tsukihara website. It must feel authored specifically for Tsukihara — Eclipse of the Nine Realms, not like a generic minigame, quiz, microsite, or game-engine experiment.

The full experience will eventually run for roughly 4–6 minutes and communicate, primarily through interaction and audiovisual staging, that:

- Akari is the protagonist;
- the Eclipse erases memories and places;
- Hanamori belongs to the world;
- Lunar Kintsugi restores what can still be remembered;
- memory, loss, and restoration are core themes;
- Mochi is Akari's companion;
- other realms exist beyond Hanamori;
- a larger threat remains behind the ritual.

This design deliberately limits the first implementation PR to Foundation plus one premium vertical slice:

`Entry → Restore Hanamori → drag → snap → Lunar Kintsugi → memory reveal`.

No Mochi, Choice, Corruption, Eclipse, Resist, Void, Awaken, Akari final reveal, flashes, sharing, or result UI is implemented until Restore + Kintsugi has been visually validated.

---

## Existing Project Constraints

The implementation must extend the current application rather than create a parallel frontend architecture.

Current stack relevant to REMEMBER:

- Next.js 16.3.1;
- React 19.2;
- TypeScript 5.9;
- Tailwind CSS 4;
- GSAP 3.13;
- Lenis 1.3.11 in the main landing experience;
- `@paper-design/shaders-react` already available;
- Three / R3F / Drei are installed but are explicitly not required for the first REMEMBER slice;
- global visual tokens are defined in `src/app/globals.css`;
- the site already uses `prefers-reduced-motion`, explicit timeline cleanup, pointer interactions, and fullscreen scroll locking patterns.

REMEMBER must not mount the normal `ImmersiveExperience`, header, chapter rail, Lenis instance, or landing-level ScrollTriggers. `/remember` is a route-local fullscreen experience.

No new large runtime dependency is approved for Foundation + Restore. In particular:

- no XState;
- no Phaser;
- no PixiJS;
- no new Three/R3F scene;
- no Howler unless later audio complexity demonstrably requires it.

---

## Route and Fullscreen Shell

Create `/remember` as a first-class Next.js route.

The route renders a client-side `RememberExperience` inside a route-local fullscreen shell:

- `position: fixed`;
- `inset: 0`;
- `100dvh` viewport behavior;
- page/document scrolling locked while mounted;
- normal site header/navigation absent;
- safe-area-aware controls using `env(safe-area-inset-*)`;
- explicit Exit and Mute/Unmute controls;
- no modal semantics for the experience itself.

The shell must restore any modified `html/body` overflow values when unmounted.

Exit returns to `/` without leaving document scroll locked or audio running.

Restart support exists in the state architecture from day one, even though the first slice only exposes it through a development-safe reset path until the final result scene is built.

---

## State Architecture

Narrative progress is controlled by typed state, not GSAP timelines.

Use a small reducer, not XState.

```ts
type RememberScene =
  | "entry"
  | "restore"
  | "memory-reveal"
  | "mochi"
  | "choice"
  | "corruption"
  | "eclipse"
  | "resist"
  | "void"
  | "awaken"
  | "akari-reveal"
  | "final"
  | "result";
```

The initial PR only makes these transitions reachable:

```text
entry
  → restore
  → memory-reveal
```

State also owns:

- restored fragment ids;
- audio muted state;
- later narrative choice slot;
- session/replay reset semantics.

GSAP controls how a scene enters or leaves, never whether a scene has logically completed.

---

## Component Boundaries

The first implementation should follow these responsibilities:

```text
src/app/remember/
  page.tsx
  remember.css

src/components/remember/
  remember-experience.tsx
  remember-shell.tsx

  state/
    remember-state.ts
    remember-reducer.ts

  scenes/
    entry-scene.tsx
    restore-scene.tsx
    memory-reveal-scene.tsx

  restore/
    hanamori-memory.tsx
    memory-fragment.tsx
    kintsugi-seams.tsx
    restore-geometry.ts
    restore-math.ts

  audio/
    remember-audio.ts
    use-remember-audio.ts

  system/
    use-remember-scroll-lock.ts
    use-remember-reduced-motion.ts
    remember-analytics.ts

  content/
    remember-copy.ts
    remember-assets.ts
```

Files may be collapsed if implementation proves a boundary unnecessary, but no single monolithic scene/state component is acceptable.

---

## Visual Language

REMEMBER inherits Tsukihara's existing design language:

- ink/near-black base;
- bone/off-white typography;
- restrained vermilion;
- lunar-gold Kintsugi;
- Bodoni/Didot/Iowan/Yu Mincho display stack already used by the site;
- quiet editorial micro-labels;
- spiritual lunar imagery;
- restrained film grain and atmospheric depth.

Avoid:

- generic cards;
- glassmorphism;
- rounded SaaS containers;
- neon gold;
- cyberpunk glitch;
- permanent particle spam;
- always-on shaders;
- obvious game HUD chrome.

Motion hierarchy is intentionally staged as Quiet → Anticipation → Impact → Silence → Release across the future experience. Foundation + Restore should remain mostly Quiet, with the Kintsugi snap as the first controlled moment of Impact.

---

## Entry Scene

Initial state: almost-black fullscreen scene with a small lunar symbol and extremely restrained motion.

Sequence:

1. `SOME MEMORIES REFUSE TO DIE.`
2. short pause;
3. `THIS ONE IS DISAPPEARING.`
4. `ENTER THE MEMORY`;
5. discreet `Headphones recommended`.

`ENTER THE MEMORY` is the first intentional user gesture and therefore the audio-unlock gesture.

No audio is autoplayed before this action.

After entry, the experience transitions to Restore and begins progressive preloading for the immediate next assets only.

---

## Audio Architecture

Dedicated audio assets already exist in the repository:

- `/remember-experience/sound-effects/trilha-sonora-menu-do-jogo.mp3`
- `/remember-experience/sound-effects/trilha-sonora-phase.mp3`
- `/remember-experience/sound-effects/kintsugi-sound-effect.mp3`
- `/remember-experience/sound-effects/harp-sound-effect.mp3`

Observed source characteristics from the supplied files:

- menu soundtrack: ~181.1 s, relatively present overall level;
- phase soundtrack: ~126.6 s, quieter at the beginning and materially stronger later;
- Kintsugi SFX: ~1.0 s, short accent;
- harp SFX: ~6.05 s, deliberately much quieter and more delicate than the music beds.

Use native `HTMLAudioElement` / browser audio primitives in this phase. Do not add Howler.

### Initial routing

- Entry/menu: `trilha-sonora-menu-do-jogo.mp3` after the user gesture;
- Restore atmosphere: crossfade toward `trilha-sonora-phase.mp3`;
- successful fragment snap: `kintsugi-sound-effect.mp3`, with a conservative per-instance gain;
- final restored-memory reveal: `harp-sound-effect.mp3` as a restrained transition accent.

The implementation must normalize perceived playback levels with explicit per-track volume constants instead of using all sources at `1.0`.

Music transitions use fades/crossfades rather than abrupt stop/start behavior.

Mute state controls the whole REMEMBER sound system and must not cause tracks to restart unexpectedly.

On unmount/exit/restart, timers, fades, and audio playback are cleaned up.

The experience remains fully understandable and functional while muted.

---

## Restore Hanamori — Core Interaction

### Source imagery

Prefer a single high-quality Hanamori master image and reuse existing restoration assets rather than creating five exported puzzle pieces.

Approved existing candidates:

- `/reinos/01_hanamori.png` for the realm's broader visual identity;
- `/assets_hq/templo-hanamori_2.png` as the fragmented/corrupted Hanamori temple state;
- `/assets_hq/templo-hanamori.png` as the restored Hanamori temple state.

The implementation should visually inspect these in context and choose the best master framing for the interaction. If the corrupted/restored pair aligns sufficiently, use it for the final crossfade payoff; the draggable fragments still derive from one source composition.

### Fragment construction

Render approximately five irregular fragments from one source image using SVG `clipPath` / masks.

Each fragment definition is data-driven:

```ts
type MemoryFragmentDefinition = {
  id: string;
  path: string;
  home: { x: number; y: number };
  initial: { x: number; y: number };
  rotation: number;
  snapRadius: number;
};
```

No physics engine.

No rectangular placeholder pieces.

Fragment geometry must look like an intentional memory fracture, not a conventional jigsaw puzzle.

### Pointer interaction

Use Pointer Events for mouse, touch, and pen.

On pointer down:

- call `setPointerCapture`;
- elevate the active piece;
- apply subtle scale/shadow response;
- suppress touch browser gestures on the interaction surface.

During drag:

- update transform without React state updates on every pointer move;
- use GSAP quick setters / refs or an equivalent low-overhead transform path;
- calculate distance to the fragment's home position.

Near home:

- introduce visible-but-subtle magnetic attraction;
- do not require pixel-perfect placement.

On pointer up:

- inside threshold: animate to home, mark restored once, trigger seam + sound;
- outside threshold: leave the fragment where it was placed rather than punishing the user with a reset.

Pointer capture must always be released on completion/cancel/unmount.

### Accessibility fallback

Every fragment remains keyboard-operable.

When focused, a non-visual/low-chrome action allows the user to restore the focused fragment without drag precision. The visual result is identical to pointer snap.

The interaction cannot depend exclusively on color or pointer hover.

---

## Lunar Kintsugi

Kintsugi is rendered as SVG paths layered over the restored fragment boundaries.

Per restored piece:

1. fragment snaps home;
2. associated seam becomes active;
3. `stroke-dashoffset` animates from hidden to visible;
4. a restrained lunar-gold glow blooms and settles;
5. only a few particles detach near the seam.

Target palette:

- core: approximately `#eadab6`;
- secondary: approximately `#b89c68`;
- halo: low-alpha warm lunar gold.

It must not read as neon/cyberpunk.

The short Kintsugi SFX is synchronized to seam activation.

When all fragments are restored:

- run one collective seam pulse;
- stabilize the full composition;
- crossfade to the restored Hanamori artwork if the aligned asset pair supports it;
- transition to `memory-reveal` state exactly once.

---

## Memory Reveal

The first PR stops here.

Reveal order:

1. `HANAMORI`
2. `GUARDIAN`
3. `AKARI`
4. `Someone still remembers this place.`

Typography and staging are integrated into the composition rather than placed in a separate card.

The harp SFX is used as a restrained reveal accent.

No Mochi scene or next CTA is implemented until this slice has been visually approved.

---

## Responsive Composition

Desktop, notebook, tablet, mobile portrait, and mobile landscape receive explicit composition rules.

Desktop:

- fragments may begin farther from home;
- the Hanamori memory can occupy a wide cinematic stage;
- quiet foreground assets may frame edges.

Mobile portrait:

- the source composition occupies more vertical area;
- starting offsets are reduced;
- targets remain well inside safe areas;
- fragment scale/touch targets remain comfortable;
- `touch-action: none` is limited to the active interaction surface;
- no desktop-only decorative layer may obscure a draggable piece.

Mobile landscape:

- prioritize usable drag area over large typography;
- controls remain clear of notches/home indicators.

---

## Reduced Motion

`prefers-reduced-motion: reduce` keeps the full narrative and interaction.

Replace or reduce:

- camera drift;
- large fragment arrival movement;
- parallax;
- aggressive blur/displacement.

Retain:

- short fades;
- short translate/snap feedback;
- Kintsugi stroke reveal;
- lighting changes;
- functional scene transitions.

Progression rules are identical in both modes.

---

## Performance and Loading

The Entry first paint must not eagerly load all future REMEMBER content.

Before `ENTER THE MEMORY`:

- render route shell;
- lunar symbol;
- entry copy;
- minimal controls;
- metadata-preload only where appropriate for the menu audio.

After entry:

1. preload the selected Hanamori interaction source;
2. preload restored Hanamori asset;
3. preload phase soundtrack and immediate SFX;
4. do not preload Mochi/Akari/nine-realm climax assets yet.

No fullscreen shader is used in Foundation + Restore.

No permanent RAF loop is allowed for this slice.

No orphan pointer listeners, GSAP timelines, timers, or audio fades after scene/unmount.

---

## Analytics Boundary

No new analytics provider is installed.

Expose a small route-local event boundary such as:

```ts
type RememberAnalyticsEvent =
  | "remember_started"
  | "remember_restore_completed";

function trackRememberEvent(event: RememberAnalyticsEvent, payload?: Record<string, unknown>): void;
```

Initially this may intentionally no-op if no existing analytics integration is available. The call sites should already exist so a future provider can be attached without rewriting scene logic.

---

## Testing Strategy

Test behavior, not GSAP pixels.

Use the existing Node test runner pattern where practical rather than adding a new test framework solely for REMEMBER.

Foundation + Restore tests cover:

- reducer starts at `entry`;
- `ENTER` advances to `restore`;
- fragment restoration is idempotent;
- invalid/far drop does not restore a fragment;
- valid snap threshold restores exactly one fragment;
- restoring all fragment ids advances to `memory-reveal` exactly once;
- restart returns scene and fragments to initial state;
- mute state survives scene transitions;
- distance/snap math is deterministic;
- reduced-motion preference changes motion policy, not progression;
- keyboard restore path reaches the same restored state;
- exit/unmount cleanup contracts are exercised where unit-testable.

Do not create brittle tests for exact GSAP frame values or pixel positions.

Technical gate before the slice is presented for visual approval:

- focused REMEMBER tests;
- existing `test:hero` regression suite;
- `npm run format:check`;
- `npm run lint`;
- production `npm run build`;
- console check on `/remember`;
- real browser visual check in desktop and mobile viewport sizes.

---

## Asset Gaps

No new image is required for Foundation + Restore unless visual inspection proves the existing Hanamori sources cannot support a convincing fracture/restoration composition.

Later phases may require one new hero-grade asset:

`remember-akari-kintsugi-reveal`

Existing `/akari-details/akari_exaltada.png` is a candidate, not an automatic approval. The final Akari payoff must be visually reviewed before reuse.

The three future choice sigils and Kintsugi master fracture should be procedural SVG wherever possible rather than new raster production.

If a new image is needed at any later milestone, implementation stops at that visual dependency and reports the exact required asset name, composition, perspective, background treatment, and aspect ratio instead of silently substituting a weak image.

---

## Acceptance Criteria for the First PR

The first PR is complete only when:

- `/remember` works as an isolated fullscreen route;
- the normal site header/navigation is absent;
- document scroll remains locked during the ritual and restores on exit;
- entry audio begins only after explicit user gesture;
- mute/unmute works without restarting the soundscape incorrectly;
- Hanamori is represented by approximately five irregular masked fragments from one source composition;
- drag works with mouse, touch, and pen through Pointer Events;
- keyboard has an equivalent restoration path;
- near-home placement uses generous magnetic snap;
- successful snap produces a controlled Kintsugi seam animation and SFX;
- all pieces restored transition once to the memory reveal;
- reduced motion remains fully functional;
- no shader/WebGL dependency is required;
- no new large dependency was introduced;
- route remains usable on mobile portrait/landscape;
- relevant tests, format, lint, existing hero tests, and production build pass;
- console is clean;
- no regression is introduced on `/`;
- the interaction visually reads as a Tsukihara restoration ritual rather than a generic browser puzzle.
