# TSUKIHARA — REMEMBER Full Experience Design

## Status

Approved direction: hybrid ritualistic presentation + premium game UI.

Implementation branch: `feat/remember-full-experience`, created from `main` commit `e7642d98881fdaf37947686fea59aee6421de150`.

This design expands the already-functional `/remember` vertical slice. It must preserve the current Hanamori drag/snap interaction and build outward from it rather than replace it.

---

## Product Goal

REMEMBER should feel like a small downloadable game embedded inside the Tsukihara site rather than a promotional web interaction.

The experience must retain Tsukihara's ritualistic, editorial and Kintsugi-driven identity while adding enough game-language to communicate state, progression, objectives, completion and chapter transitions.

The official flow is:

`Menu → Hanamori → Mizukyo → Kurogane → Akari Reveal → Eclipse Epilogue → Credits / CTA`

The core restoration loop for each memory is:

`Broken → last shard → Kintsugi → particles → pulse → completion burst → Restored → residual scar`

The restoration should communicate: completing the puzzle did not merely solve a UI; the player brought something back into the world.

---

## Existing Baseline To Preserve

The current implementation already provides:

- isolated fullscreen `/remember` route;
- reducer-controlled experience state;
- Hanamori puzzle with five irregular draggable fragments;
- Pointer Events + pointer capture;
- keyboard restoration parity;
- magnetic snap;
- per-fragment Kintsugi seam feedback;
- dedicated menu/gameplay/Kintsugi/harp audio controller;
- reduced-motion handling;
- scroll locking and route cleanup;
- focused Node regression tests.

This expansion should generalize that implementation into a reusable memory system rather than creating three separate bespoke puzzle components.

---

## Confirmed Asset Inventory

### Images

Base path: `/remember-experience/assets/images/`

- `remember-menu-background.png`
- `remember-mizukyo-broken.png`
- `remember-mizukyo-restored.png`
- `remember-kurogane-broken.png`
- `remember-kurogane-restored.png`
- `remember-completion-burst.png`
- `mr01-kintsugi-crack-overlay.png`
- `mr02-memory-particles.png`
- `mr03-memory-pulse-ring.png`
- `remember-akari-reveal.png`

### Videos

Base path: `/remember-experience/assets/videos/`

- `remember-epilogue-eclipse.mp4`
- `remember-credits-loop.mp4`
- `remember-mobile-sakura-transition.mp4`

### Audio

Existing base path: `/remember-experience/sound-effects/`

- menu / credits theme
- phase gameplay theme
- Kintsugi SFX
- harp SFX

### Known Asset Gap

The requested `mr06-restored-scar-overlay.png` is not present in the current `main` asset tree.

The code must support an optional `scarOverlay` asset. Until that file is added, the final scar state will be derived from the memory's Kintsugi crack paths / `mr01` visual texture at very low opacity. No fake file path should be referenced.

---

# 1. Experience State Model

The existing scene model should be simplified into the official game flow rather than keeping unused experimental states.

```ts
type RememberScene =
  | "boot"
  | "menu"
  | "memory"
  | "memory-complete"
  | "akari-reveal"
  | "epilogue"
  | "credits";
```

The game state becomes progression-centric:

```ts
type RememberState = {
  scene: RememberScene;
  locale: "pt" | "en";
  muted: boolean;
  activeMemoryIndex: number;
  completedMemoryIds: MemoryId[];
  restoredFragmentIds: string[];
  restorationPhase: RestorationPhase;
};
```

`activeMemoryIndex` is the single source of truth for Hanamori → Mizukyo → Kurogane.

No scene progression should depend on scattered `setTimeout` calls.

---

# 2. Boot + Menu

## Why a Boot State Exists

The current menu music does not have a meaningful audible menu phase because browser audio is only unlocked when the current `ENTER THE MEMORY` action is used, immediately before the phase-track crossfade.

A dedicated first-gesture state fixes that browser-autoplay constraint.

## Boot

Visual:

- fullscreen `remember-menu-background.png`;
- very restrained water/ripple distortion derived from the existing Nine Realms ripple implementation;
- no strong cursor wake; this is atmospheric, not a water demo;
- title mark / lunar sigil;
- `PRESS ANYWHERE TO REMEMBER` / `CLIQUE PARA LEMBRAR`.

The first pointer/key gesture:

1. unlocks audio;
2. starts the menu theme at the configured menu gain;
3. transitions to `menu` without starting gameplay.

## Menu

Premium game-like but restrained:

- `TSUKIHARA` small brand line;
- `REMEMBER` primary title;
- one primary action: `BEGIN` / `INICIAR`;
- `PT / EN` control;
- sound control using the same animated bars/icon language as the landing page;
- `EXIT` as secondary action.

No full settings screen, save slots or fake Continue system in this version.

When BEGIN is activated, the menu theme crossfades into the gameplay phase theme and memory 01 begins.

---

# 3. Localization

REMEMBER becomes fully bilingual.

```ts
type RememberLocale = "pt" | "en";
```

All player-visible strings move to locale-aware content:

- boot prompt;
- menu labels;
- controls;
- HUD;
- memory titles / instructions;
- `MEMORY RESTORED` confirmation;
- Akari reveal text;
- epilogue line;
- credits CTA.

Default:

- use persisted REMEMBER locale when available;
- otherwise default to `pt` to match the site's current primary locale.

Changing language must not reset puzzle progress.

---

# 4. Game Shell / HUD

During active memories, the shell should communicate game state without looking like a generic HUD.

Desktop layout:

- top-left: `MEMORY 01 / HANAMORI`;
- top-right: language, sound, exit;
- lower/side micro-HUD: `FRAGMENTS 03 / 05`;
- optional thin lunar progress line for the three memories.

The HUD should fade/recede during the restoration climax and Akari reveal.

On mobile, controls collapse into a compact top strip with safe-area padding.

The mute/unmute icon should reuse the same three-bar visual language as the landing page instead of the current REMEMBER-specific signal treatment.

---

# 5. Data-Driven Memory System

Introduce one memory definition model.

```ts
type MemoryDefinition = {
  id: "hanamori" | "mizukyo" | "kurogane";
  index: 1 | 2 | 3;
  title: string;
  titleJp: string;
  brokenAsset: string;
  restoredAsset: string;
  fragments: MemoryFragmentDefinition[];
  crackPaths: CrackPathDefinition[];
  snapRatio: number;
  completionCopy: LocalizedCopy;
  palette: MemoryPalette;
};
```

A single generic `MemoryPuzzle` consumes the definition.

Hanamori's existing geometry is migrated first and must retain the current validated behavior.

## Difficulty Curve

### Memory 01 — Hanamori

Tutorial memory.

- 5 fragments;
- widest magnetic threshold;
- modest initial displacement;
- current interaction language preserved.

### Memory 02 — Mizukyo

Intermediate.

- 7 fragments;
- slightly smaller snap threshold;
- more organic fragment silhouettes;
- wider starting dispersion;
- water/reflection composition makes visual matching less obvious.

### Memory 03 — Kurogane

Hardest memory in this minigame.

- 9 fragments;
- smallest but still forgiving threshold;
- harder geometric boundaries;
- wider initial offsets;
- stronger visual overlap/ambiguity;
- no timers and no punitive resets.

Difficulty must come from visual reconstruction and spatial reading, not frustration.

Keyboard users retain a deterministic restore action for the currently focused fragment.

---

# 6. Memory Restoration Effect

The completion sequence must be separated from the puzzle itself as a reusable `MemoryRestorationEffect`.

It receives state and memory-specific geometry/assets rather than owning puzzle progress.

Suggested interface:

```ts
type MemoryRestorationEffectProps = {
  active: boolean;
  memory: MemoryDefinition;
  originPoint: { x: number; y: number };
  reducedMotion: boolean;
  onPhaseChange?: (phase: RestorationPhase) => void;
  onComplete: () => void;
};
```

## Restoration State Machine

```text
idle
↓
last-piece
↓
kintsugi
↓
pulse
↓
restoring
↓
revealing
↓
restored
```

A single GSAP timeline owns visual timing and is cancelable on unmount/restart.

Reducer/application state stores the high-level phase. The component owns only animation implementation details.

## Target Timing

Approximate desktop timing, based on the supplied VFX direction:

```text
0.00  last shard snap
0.08  micro-impact / settle
0.15  Kintsugi propagation begins
0.80  cracks fully illuminated
0.90  memory pulse
1.00  image presence begins restoring
1.35  fragments consolidate
1.50  MEMORY / XX
1.65  RESTORED
1.90  memory-specific reveal copy
2.60  residual atmosphere declines
2.80  stable restored state
```

This sequence is intentionally a microclimax, not a fullscreen explosion.

## VFX Asset Roles

### `mr02-memory-particles.png`

- low-opacity dormant dust while a puzzle is incomplete;
- converges visually toward the crack network when the last shard snaps;
- reduced density on mobile.

### Crack network

Per-memory SVG `crackPaths` remain the geometrically authoritative seams.

`mr01-kintsugi-crack-overlay.png` supplies organic crack texture / glow character within or above that network. It should not replace exact per-memory path alignment.

Propagation must begin near the final shard origin and progress through the network rather than enabling every crack simultaneously.

### `mr03-memory-pulse-ring.png`

- one thin expanding pulse around ~0.9s;
- small radial refraction of the memory stage for ~300–400ms;
- no glitch language.

### `remember-completion-burst.png`

- peak reward layer;
- short opacity/scale bloom;
- never a white fullscreen flash.

### Restored image

During pulse/restoration:

```text
saturate(.55) brightness(.75) blur(2px)
→
saturate(1) brightness(1) blur(0)
```

Fragment depth/rotation is resolved and the continuous restored image replaces the broken composition.

### Residual scar

After reconstruction, thin Kintsugi scars remain for roughly 700–1200ms and then recede.

If `mr06-restored-scar-overlay.png` becomes available it is used here. Until then the crack network / mr01 texture provides the residual scar at restrained opacity.

## Completion Copy

Not a modal.

The copy grows from the restored composition itself:

```text
MEMORY / 01
RESTORED
HANAMORI
Someone still remembers this place.
```

For later memories, realm-specific copy is used. `AKARI` is reserved for the final reveal after all three memories, rather than being repeated after every realm.

The next-memory action is disabled only during the first ~1.5s of the climax and becomes available once the restoration is visually understandable.

---

# 7. Memory-to-Memory Flow

After the restoration effect reaches stable state:

- reveal a restrained `CONTINUE` / `CONTINUAR` action;
- transition to the next memory with a short dark/lunar handoff;
- clear only per-memory fragment state;
- preserve locale, muted state and completed memory history.

Desktop transitions are generated with DOM/SVG/GSAP; no new video is needed between each desktop memory.

On mobile, `remember-mobile-sakura-transition.mp4` may replace/enrich this transition, but only when motion is allowed and data-saving is not requested.

After Kurogane completes, CONTINUE advances to `akari-reveal`.

---

# 8. Akari Reveal

Asset:

`/remember-experience/assets/images/remember-akari-reveal.png`

This is the primary narrative payoff of the puzzle arc.

Composition:

- HUD fades away;
- background darkens into a lunar void;
- Akari enters with controlled scale/opacity/depth, not a sudden image swap;
- fine Kintsugi light traces connect the restored memories to her reveal;
- title/identity copy appears in PT/EN;
- menu/phase soundtrack transitions into a more spacious final mix using the available audio layers rather than adding generic SFX.

No interaction is required during the first reveal beat. A continue affordance appears after the presentation settles.

---

# 9. Eclipse Epilogue

Asset:

`/remember-experience/assets/videos/remember-epilogue-eclipse.mp4`

The epilogue follows Akari immediately.

Narrative function:

> One memory returned, but Tsukihara is still forgetting.

The video:

- plays inline;
- is treated as visual media, not as the audio master;
- uses a subtle overlay for localized narrative copy;
- is not eagerly preloaded on initial `/remember` load.

After the video reaches its endpoint (or the user continues after the minimum readable interval), transition to credits.

Reduced-motion may use the first stable frame / static treatment rather than forcing cinematic motion.

---

# 10. Credits / CTA

Asset:

`/remember-experience/assets/videos/remember-credits-loop.mp4`

Because this file is large, do not preload it at boot. Begin loading only near Akari/Epilogue.

Desktop:

- looping video background;
- dark readability veil;
- `REMEMBER WHAT REMAINS.` as the final major phrase;
- primary CTA: `CONTINUE TO TSUKIHARA` / `CONTINUAR PARA TSUKIHARA` → `/`;
- sound and language controls remain available.

Mobile / Save-Data fallback:

- prefer the static menu background or a lightweight still rather than forcing the ~56MB loop.

The menu/credits theme may return here via crossfade so the same motif bookends the experience.

---

# 11. Audio Architecture

The existing `useRememberAudio` remains the base but gains explicit high-level transitions:

```ts
unlockMenu()
startMemory()
playPieceComplete()
playKintsugi()
playRestored()
enterAkariReveal()
enterCredits()
setMuted()
stopAll()
```

## Menu Fix

Audio is unlocked during Boot's first intentional gesture and the menu theme begins there.

BEGIN no longer performs the first-ever audio unlock; it only crossfades menu → phase.

This fixes the current behavior where the menu track starts immediately before being faded away.

## Completion SFX

- existing Kintsugi effect: shard / crack energy accent;
- existing harp: restoration / reveal accent;
- no generic web click sounds.

SFX must be pooled/capped as in the current implementation.

---

# 12. Visual Language

The hybrid game direction is deliberate:

## Ritualistic layer

- black / bone / lunar gold / vermilion;
- Japanese inscriptions;
- Kintsugi seams;
- restrained particles;
- cinematic negative space.

## Game layer

- memory/chapter index;
- fragment progress;
- language/audio/exit controls;
- completion state;
- continue affordance;
- clear chapter progression.

Avoid:

- generic fantasy HUD frames;
- health bars;
- XP language;
- loot/reward UI;
- neon cyberpunk treatment;
- excessive glassmorphism.

---

# 13. Ripple Menu Background

The menu should reuse the water-distortion language already implemented for the Nine Realms, but with a specific quiet preset.

Differences from realm interaction:

- lower displacement amplitude;
- slower wake decay;
- fewer active ripple sources;
- cursor influence is atmospheric rather than obvious;
- disabled on touch / reduced-motion;
- menu content remains perfectly stable and undistorted.

Only the background layer is affected.

---

# 14. Reduced Motion

The full game remains playable and narratively complete.

Reduced-motion behavior:

- no camera shake;
- no long crack propagation;
- no radial refraction;
- pulse becomes a short opacity/scale cue;
- broken → restored uses short crossfade;
- completion text remains;
- Akari reveal uses restrained fades;
- epilogue may render a static poster-like state;
- video loops are not required for understanding.

---

# 15. Mobile

Mobile is not a desktop shrink.

- puzzle stage maximizes touch target size;
- minimum effective snap distance remains generous;
- fragment count remains the same, but starting offsets are compressed;
- expensive blur/refraction is removed;
- particles are reduced;
- restoration sequence targets ~1.5–2.0s;
- `remember-mobile-sakura-transition.mp4` can be used only as a lightweight chapter transition enhancement;
- credits loop receives static fallback when bandwidth/performance is unfavorable.

---

# 16. Performance / Loading

Boot initial load should include only:

- menu background;
- UI code;
- menu audio metadata/source as needed after interaction.

After BEGIN:

1. load current memory broken/restored assets;
2. preload completion overlays;
3. preload next memory after the player begins interacting;
4. preload Akari reveal after Mizukyo completion;
5. preload epilogue after Kurogane begins;
6. load the large credits loop only close to credits.

Do not preload all videos on route entry.

Animations should favor transform, opacity, SVG path animation and compositor-friendly layers.

---

# 17. Debugging

In development only, `?memoryDebug=true` may expose a compact debug panel for:

- jump to memory;
- restore all shards;
- replay restoration effect;
- visualize crack paths / snap targets;
- jump to Akari / Epilogue / Credits.

It must not render in production.

`Shift+R` may continue to reset the active experience during development.

---

# 18. Analytics Contract

Keep analytics implementation provider-agnostic / no-op if no analytics provider is connected.

Events:

- `remember_boot_started`
- `remember_menu_started`
- `remember_game_started`
- `remember_memory_started`
- `remember_fragment_restored`
- `remember_memory_restored`
- `remember_akari_revealed`
- `remember_epilogue_started`
- `remember_completed`
- `remember_exit`

---

# 19. Test Strategy

Add focused deterministic tests only where they protect game behavior.

## State

- boot → menu after audio-unlock action;
- menu → memory 01;
- memory completion does not advance twice;
- CONTINUE advances Hanamori → Mizukyo → Kurogane;
- Kurogane completion advances to Akari reveal only after continue;
- Akari → epilogue → credits progression;
- locale/mute persist across memory transitions;
- restart resets progression without corrupting static definitions.

## Memory definitions

- IDs/order are unique;
- Hanamori has 5 fragments;
- Mizukyo has 7 fragments;
- Kurogane has 9 fragments;
- crack paths exist for each memory;
- snap ratios decrease but remain within allowed accessibility bounds.

## Restoration phase helper

If timing/progression math is extracted into pure helpers, test phase boundaries rather than GSAP internals.

## Gates

Existing project gates remain authoritative:

`test:hero → test:remember → format:check → lint → build`

Visual validation remains required for desktop and mobile before merge.

---

# 20. Out of Scope

This expansion does not introduce:

- authentication;
- cloud saves;
- leaderboards;
- scoring/rank system;
- timers;
- failure states;
- inventory;
- achievements;
- gamepad support;
- additional realms beyond Hanamori, Mizukyo and Kurogane;
- WebGL scene rendering for the puzzle itself.

Those should only be considered after the full narrative minigame is visually validated.

---

# Acceptance Criteria

The feature is ready for visual approval when:

1. `/remember` opens on a premium title/boot screen using the new background.
2. The first deliberate gesture starts the menu theme and reveals the menu instead of immediately starting gameplay.
3. PT/EN and the landing-style sound icon work without resetting progress.
4. Hanamori's existing interaction quality is preserved.
5. Mizukyo and Kurogane are playable with increasing but fair difficulty.
6. Every memory uses the same reusable 2–3s Memory Restored microclimax.
7. The new VFX assets visibly participate in that completion sequence.
8. A thin Kintsugi scar remains after restoration rather than the cracks simply vanishing.
9. Completing Kurogane leads to the Akari Kintsugi reveal.
10. Akari leads into the Eclipse epilogue video and then the credits loop/CTA.
11. Mobile/reduced-motion fallbacks remain complete and usable.
12. No heavy credit/epilogue media is eagerly loaded on initial route entry.
13. Existing automated gates are green before the PR is marked ready.
