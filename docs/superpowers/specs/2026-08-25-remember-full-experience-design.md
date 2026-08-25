# TSUKIHARA — REMEMBER Full Prologue Experience Design

## Status

Authoritative v2 design for the REMEMBER expansion.

Baseline: `main@fda8cd44f48182abc71ff12c6008fdb30ea9358d`.

This document supersedes the previous three-memory-only assumptions in this file. REMEMBER is now a complete interactive prologue with persistence, archive, pause, five memories, two interludes, AKR-001 discovery, Akari reveal, epilogue and credits.

The implementation remains an expansion of the existing `/remember` codebase, not a rewrite. Existing Hanamori, Mizukyo and Kurogane interaction, restoration VFX, audio behavior and accessibility must remain functional while the architecture is generalized around them.

---

## 1. Product Goal

REMEMBER should feel like a small standalone game embedded inside the Tsukihara site rather than a promotional web interaction.

Target experience length: roughly 10–20 minutes depending on player observation and puzzle speed.

The narrative progression should create three questions in sequence:

1. Why am I restoring these memories?
2. Who am I following?
3. Akari.

The final emotional beat is intentionally incomplete: the player restored one thread of memory, but Tsukihara is still disappearing.

Core closing idea:

> Uma memória voltou. Tsukihara ainda precisa ser lembrada.

### Non-negotiable principles

- Expand, do not rewrite.
- Preserve the existing three memories and restoration ritual.
- No abrupt scene swaps.
- No generic SaaS modals or card dashboards.
- Difficulty comes from observation, spatial reading and memory mechanics, not punishment.
- Local persistence must be resilient and versioned.
- No server is required for progress.
- No fake sound assets or fake loading percentages.
- No all-scenes-mounted architecture.
- Reduced motion, touch and keyboard paths remain first-class.

---

## 2. Official Experience Flow

A technical boot/preloader precedes the narrative flow.

```text
Preloader
↓
Boot / first intentional gesture
↓
Main Menu
↓
Hanamori
↓
Mizukyo
↓
Interlude I
↓
Kurogane
↓
Yumegakure
↓
Gekkai
↓
Interlude II
↓
AKR-001 discovery
↓
Akari Reveal
↓
Eclipse Epilogue
↓
Credits / CTA
```

`Memory Archive` is accessible from title/pause according to progression rules. `Pause` is orthogonal to the narrative state and never becomes a progression stage.

After the game is complete, the Archive can be used to replay any of the five memories directly.

---

## 3. Architecture Overview

The existing folders `audio`, `content`, `restore`, `scenes`, `state` and `system` remain the foundation.

The root experience should become thinner rather than accumulating every feature inside `RememberExperience`.

Target responsibilities:

```text
RememberExperience
├── RememberState / reducer
├── RememberSaveStore
├── RememberAssetPreloader
├── SceneTransitionDirector
├── RememberShell
├── RememberMenu
├── PauseMenu
├── MemoryArchive
├── StageRouter
│   ├── StandardMemoryStage
│   ├── FalseMemoryStage
│   ├── OverlappingMemoryStage
│   ├── InterludeStage
│   ├── AkariReveal
│   ├── Epilogue
│   └── Credits
└── RememberAudio
```

The existing `MemoryPuzzle` and `MemoryRestorationEffect` are reused. New mechanics wrap or extend that engine instead of creating unrelated drag systems.

### State domains

Keep four concerns explicit:

- **progression state** — current narrative stage and completed stages;
- **session state** — locale, muted, pause/archive visibility, transition lock;
- **puzzle runtime** — restored fragments, restoration phase, current mechanic runtime;
- **persistent save** — durable progression/results only.

Do not serialize transient pointer positions, GSAP progress, DOM measurements or animation refs.

---

## 4. Explicit Progression Model

Use a single ordered stage identifier.

```ts
type RememberStageId =
  | "hanamori"
  | "mizukyo"
  | "interlude-01"
  | "kurogane"
  | "yumegakure"
  | "gekkai"
  | "interlude-02"
  | "akari-reveal"
  | "epilogue"
  | "credits";
```

The title/menu is not a stage. Boot is not a stage. Pause is not a stage.

Progression must be event-driven through the reducer/state machine. Avoid chains of unrelated booleans and avoid `setTimeout` as the source of narrative progression.

The ordered stage graph is deterministic before game completion. Direct stage selection is unavailable until `gameCompleted === true`.

---

## 5. Persistence and Save Model

Primary save key:

```text
tsukihara:remember:save:v1
```

Locale may remain in its existing preference key. Mute preference may remain session-level unless there is an established persistent preference later.

### Save shape

```ts
type MemoryResult = {
  completed: boolean;
  completedAt?: string;
  completionTime?: number;
  mistakes?: number;
  falseFragments?: number;
  integrity?: number;
  resonance?: "S" | "A" | "B" | "C";
  restoredFragmentIds?: string[];
};

type RememberSaveV1 = {
  version: 1;
  startedAt: string;
  updatedAt: string;
  currentStage: RememberStageId;
  completedStages: RememberStageId[];
  memories: Partial<Record<MemoryId, MemoryResult>>;
  archiveProgress: number;
  discoveredAkariRecord: boolean;
  gameCompleted: boolean;
};
```

`MemoryId` expands to:

```ts
type MemoryId =
  | "hanamori"
  | "mizukyo"
  | "kurogane"
  | "yumegakure"
  | "gekkai";
```

### Runtime validation

The project currently does not use Zod. Do not add Zod only for this feature.

Implement a small explicit runtime parser that validates:

- top-level object shape;
- exact supported `version`;
- recognized stage ids;
- arrays containing recognized values only;
- numeric fields being finite and non-negative where relevant;
- valid resonance enum;
- memory results matching known memory ids.

Invalid/corrupted saves are ignored safely. `JSON.parse` is always wrapped in failure handling.

The loader returns either a normalized valid save or `null`; it never throws into React render.

### Migration boundary

Expose migration by version even though only v1 exists initially.

```text
raw storage
→ parse JSON safely
→ inspect version
→ migrate if supported
→ validate normalized save
→ hydrate
```

Future versions must not require changing callers.

### Autosave events

Write only on meaningful events:

- new game creation;
- stage entry;
- fragment successfully restored when the stage supports deterministic fragment resume;
- puzzle completion;
- interlude completion;
- result/resonance calculation;
- archive/signature unlock;
- epilogue entry;
- game completion;
- return to title;
- restart memory after reset state is established.

Never write on pointer move, animation frame or hover.

### Resume semantics

`CONTINUE` restores the current logical stage.

For standard memories, persisted `restoredFragmentIds` may be replayed into their snapped state when reliable. Free-floating positions are not persisted. Any unresolved fragments are re-scattered on resume.

For a mechanic where partial serialization would be unsafe, restart that current puzzle while preserving all prior completed stages/results.

---

## 6. New Game, Continue and Revisit

### No save

Primary CTA:

```text
NEW MEMORY
```

or localized equivalent approved by final copy.

### Existing incomplete save

Primary CTA:

```text
CONTINUE
MEMORY 03 / 05
KUROGANE
60% RESTORED
```

Use actual progress, never hard-coded percentages.

`NEW GAME` remains secondary.

If New Game is selected while a save exists, show an in-world confirmation layer:

```text
BEGIN AGAIN?
Your restored memories will be forgotten.
```

Only explicit confirmation deletes/replaces the save.

### Completed game

The menu changes to:

- `REVISIT MEMORIES` as the archive/replay route;
- `NEW GAME` as destructive restart with confirmation.

Do not show a misleading Continue after the narrative is already complete.

---

## 7. Gameified Preloader and Boot

The `/remember` experience begins with a preloader driven by real required-asset readiness.

Visual direction:

- black/lunar void;
- central `月` or lunar sigil;
- restrained Kintsugi fissures progressively appearing;
- copy such as `RECOVERING MEMORIES` / localized equivalent;
- truthful loaded/required progress, preferably expressed as fragments or sigil completion rather than a fake percentage.

Initial preload includes only what is required to reach and play Hanamori plus shared VFX/menu assets. Later stages preload incrementally.

When ready, the preloader resolves into Boot without a hard cut.

Boot exists to obtain the first intentional audio gesture. The prompt uses a subtle breathing/blinking loop comparable to `PRESS ANY BUTTON` game language, but never flashes aggressively.

Accepted keyboard inputs on Boot: Enter, Space and non-modifier printable keys. Pointer/touch also unlocks.

---

## 8. SceneTransitionDirector

Every major screen/stage change uses one transition system.

Canonical lifecycle:

```text
current scene exit
→ veil reaches full coverage
→ reducer commits destination
→ destination assets confirmed
→ next scene enters
→ interaction unlocks
```

No destination scene should become interactive before its entrance settles.

Duplicate transition requests while a transition is active are rejected, not queued.

If the next stage is still loading, the veil remains covered and transitions into a small ritual loading state rather than exposing a blank screen.

Typical timing target for full motion:

- exit: 350–500ms;
- covered handoff: 100–300ms when assets are ready;
- enter: 600–800ms.

Reduced-motion uses short opacity-only handoffs while preserving the same state locking semantics.

Memory chapter intros remain cinematic:

```text
MEMÓRIA 01
HANAMORI
花守
```

The text enters, holds, dissolves, then the puzzle becomes interactive.

---

## 9. Main Menu Gamefeel

The menu composition is centered.

Title treatment:

```text
記憶
↓ glyph resolve ↓
REMEMBER
```

Reuse the shared `JpRevealText` introduced in the merged gamefeel work.

The supporting thesis can also resolve from Japanese into the selected language.

Gamefeel hierarchy:

- idle prompts breathe subtly in opacity;
- primary CTA may float by roughly 2–4px on Y over a slow loop;
- sigils/glow breathe more slowly than buttons;
- hover/focus has immediate response;
- major motion is reserved for stage events.

Avoid making every label move.

The sound control uses the same shared three-bar component/language as the landing page.

---

## 10. Pause Menu

`ESC` opens Pause during puzzle memories and interactive interludes. A discrete UI pause control is also available for touch/pointer users.

Pause is orthogonal state:

```ts
paused: boolean
```

Opening Pause does not change `currentStage` and is not autosaved as progression.

While paused:

- drag/snap stops responding;
- memory timers stop accumulating;
- mechanic timers/cooldowns freeze;
- gameplay-critical GSAP timelines pause safely;
- background ambience may freeze or remain at an extremely slow decorative rate;
- phase audio is heavily reduced or paused according to the audio controller.

Pause menu:

```text
PAUSED

CONTINUE
MEMORY ARCHIVE
SETTINGS
RESTART MEMORY
RETURN TO TITLE
```

`SETTINGS` in v1 is intentionally small: language, audio and accessibility-facing options already supported by the game. Do not create a broad settings subsystem.

`RESTART MEMORY` requires short confirmation and resets only the active puzzle.

`RETURN TO TITLE` saves first and then transitions to menu.

Akari Reveal, Epilogue and Credits use their own continue/skip behavior instead of the gameplay Pause menu.

---

## 11. Memory Archive

Archive is a ritual record interface, not a five-card grid.

Real assets:

- `/remember-experience/assets/images/archive/remember-memory-archive-background.png`
- `/remember-experience/assets/images/archive/remember-memory-archive-sigil.png`
- `/remember-experience/assets/images/archive/remember-akr001-signature.png`

Records:

```text
01 HANAMORI
02 MIZUKYO
03 KUROGANE
04 YUMEGAKURE
05 GEKKAI
```

Allowed record states:

- `RESTORED`
- `UNSTABLE`
- `UNKNOWN`
- `LOCKED`

The dominant progress element is the lunar/archive sigil. Each restored memory illuminates one portion. `archiveProgress` is derived from completed memory records rather than independently incremented by UI code.

Before Gekkai is complete, the archive may imply a latent signature but must not reveal `AKR-001`.

At 100%, Interlude II owns the actual signature discovery. After that event, `discoveredAkariRecord` permits the AKR-001 mark to remain visible in Archive.

Before game completion, Archive cannot be used to skip narrative progression. After completion, each restored record becomes replayable.

---

## 12. Shared Memory Engine and Difficulty

Extend `MemoryDefinition` rather than replacing the current engine.

```ts
type MemoryMechanic = "standard" | "false-memory" | "overlapping";

type MemoryDefinition = {
  id: MemoryId;
  index: 1 | 2 | 3 | 4 | 5;
  mechanic: MemoryMechanic;
  title: string;
  titleJp: string;
  brokenAsset: string;
  restoredAsset: string;
  fragments: MemoryFragmentDefinition[];
  seams: KintsugiSeamDefinition[];
  snapRatio: number;
  parSeconds: number;
  completionCopy: LocalizedCopy;
  palette: MemoryPalette;
};
```

Mechanic-specific fields may be discriminated extensions rather than making every field optional.

### Scatter system

Replace near-destination initial placements with a deterministic seeded scatter per new game/session.

Rules:

- no fragment starts close enough to look almost solved;
- fragments use peripheral zones around the composition;
- fragments remain fully reachable and visible;
- avoid excessive initial overlaps;
- avoid HUD/pause control regions;
- distribution uses left, right, upper and lower areas where viewport permits;
- mobile uses a constrained safe scatter layout rather than desktop coordinates compressed into a phone.

Difficulty progression:

- Hanamori: moderate scatter, ~8–15° rotation range;
- Mizukyo: wider scatter, ~12–20°;
- Kurogane: high scatter, ~16–28°;
- Yumegakure/Gekkai: mechanic difficulty takes priority over adding arbitrary extra displacement.

The seed may change on New Game/restart, but should remain stable for a single active puzzle session so rerenders do not teleport pieces.

---

## 13. Ghost Seams vs Kintsugi

Separate puzzle guidance from restoration payoff.

### Ghost seams

During puzzle play, low-opacity structural seams communicate that the composition is fractured.

They are not gold Kintsugi and must never look fully restored.

Guidance curve:

- Hanamori: visible at roughly 10–15% opacity;
- Mizukyo: weaker;
- Kurogane: mostly interaction/idle-hint driven;
- later mechanics choose their own guidance behavior.

While a fragment is actively dragged, its related ghost seam may breathe subtly.

### Kintsugi

The bright gold crack network remains reserved for the final restoration ritual after the valid solution is reached.

This preserves the narrative meaning of Kintsugi while retaining the spatial affordance the earlier accidental seams provided.

---

## 14. Hanamori — Tutorial / Standard Memory

Preserve the approved visual identity and existing five-piece engine.

Hanamori teaches through diegetic guidance rather than a `Tutorial` modal.

After the chapter intro:

```text
RECONSTRUA A MEMÓRIA
Arraste os fragmentos e devolva-os ao lugar ao qual pertencem.
```

Behavior:

- one fragment receives a restrained initial microglow;
- one corresponding ghost seam breathes once;
- while dragging, copy can shift to `Encontre a cicatriz à qual este fragmento pertence.`;
- first successful snap receives clear audio + pulse + `FRAGMENTO RESTAURADO 01 / 05`;
- onboarding dissolves after the first successful snap and does not repeat during that run.

Idle hint:

- first hint after 5 seconds without meaningful input;
- may repeat at most two times;
- repeats separated by at least 8 seconds;
- hint is a tiny reversible fragment drift, not a hand icon or arrow.

Keyboard restoration remains deterministic for focused fragments.

---

## 15. Mizukyo — Reflection

Preserve the current seven-fragment puzzle and visual assets.

Identity: `REFLECTION`.

Difficulty comes from water/reflection ambiguity, wider scatter and more demanding visual matching.

If reflection assistance can be implemented using rendering/composition already available, a restrained mirrored cue may help interpret orientation. Do not create a second solver or force a new interaction mode solely for this phase.

Mizukyo remains a standard memory mechanically.

---

## 16. Interlude I — Unknown Signature

Real asset:

`/remember-experience/assets/images/interludes/remember-interlude-01-unknown-memory.png`

Duration target: 30–60 seconds.

This is not a traditional puzzle.

The player explores a small set of memory traces via pointer hover/focus/tap. Keyboard focus must reveal the same traces.

The sequence ends with:

```text
UNKNOWN MEMORY SIGNATURE
```

Then:

```text
Você não está restaurando lugares.

Está seguindo alguém.
```

Localized equivalent in EN.

Do not name Akari here.

Interlude completion is autosaved and transitions into Kurogane.

---

## 17. Kurogane — Structure

Preserve the current nine-fragment puzzle.

Identity: `STRUCTURE`.

Use the hardest scatter/rotation profile among the standard memories. Keep snap forgiving enough to avoid pixel hunting.

If rotation interaction is not already supported by the shared engine, do not add a bespoke rotation control just for Kurogane in the first implementation. Visual rotation at scatter plus existing snap is sufficient unless the shared engine is extended cleanly.

---

## 18. Yumegakure — False Memory

Real assets:

- `/remember-experience/assets/images/yumegakure/remember-yumegakure-broken.png`
- `/remember-experience/assets/images/yumegakure/remember-yumegakure-restored.png`
- `/remember-experience/assets/images/yumegakure/remember-yumegakure-false-fragment-01.png`
- `/remember-experience/assets/images/yumegakure/remember-yumegakure-false-fragment-02.png`
- `/remember-experience/assets/images/yumegakure/remember-yumegakure-distortion-overlay.png`

Identity: `FALSE MEMORY`.

Yumegakure extends the shard engine with truth metadata.

```ts
type FalseMemoryFragment = MemoryFragmentDefinition & {
  truth: "true" | "false";
  sourceAsset?: string;
};
```

Target composition: 7–9 visible fragments total, including exactly two false fragments unless final asset geometry proves one false fragment produces a better puzzle.

False fragments must be plausible and may snap into designated compatible positions. A composition containing a false fragment can appear momentarily accepted, but cannot enter the Kintsugi completion sequence.

Instead it enters `UNSTABLE` feedback:

- distortion overlay rises;
- lighting/presence becomes subtly wrong;
- low-frequency visual instability appears;
- no harsh failure screen;
- player is taught that one accepted memory is false.

Yumegakure allows already-snapped fragments to be removed. This reversibility is scoped to this mechanic and exposed through the shared fragment state API rather than a parallel drag implementation.

A false fragment counts toward `falseFragments` only the first time it is stabilized in a run, not every time it is moved.

Completion requires all true fragments in valid targets and no false fragment occupying a target.

Then normal Kintsugi restoration can begin.

Narrative lesson: a convincing memory is not necessarily true.

---

## 19. Gekkai — Overlapping Realities

Real assets:

- `/remember-experience/assets/images/gekkai/remember-gekkai-state-a.png`
- `/remember-experience/assets/images/gekkai/remember-gekkai-state-b.png`
- `/remember-experience/assets/images/gekkai/remember-gekkai-restored.png`
- `/remember-experience/assets/images/gekkai/remember-gekkai-lunar-focus-overlay.png`

Identity: `OVERLAPPING REALITIES`.

Each fragment has an authentic state.

```ts
type RealityState = "a" | "b";

type OverlappingFragment = MemoryFragmentDefinition & {
  stableReality: RealityState;
};
```

Outside Lunar Focus, fragment imagery crossfades between State A and State B on staggered slow cycles. The geometry does not teleport.

A fragment can only finalize a valid snap while its authentic reality is legible/current. An incorrect-reality snap attempt rejects softly and returns to its prior draggable position; it increments `mistakes` once for that attempt.

### Lunar Focus

Desktop: `SPACE`.

Touch/mobile: explicit UI button.

Initial timing:

- active window: 3 seconds;
- cooldown: 6 seconds after the active window ends.

During Focus:

- oscillation freezes;
- each fragment resolves to its authentic visual state;
- lunar-focus overlay appears;
- particles slow/freeze;
- chroma reduces slightly;
- audio becomes muffled/spacious;
- puzzle remains draggable.

Pause freezes both active duration and cooldown timers.

Reduced motion removes continuous crossfade oscillation and instead uses a slower discrete opacity swap; Focus still resolves authenticity clearly.

No separate action-game system, meter grinding or time pressure is introduced.

---

## 20. Memory Completion and Resonance

Every puzzle memory ends with the existing restoration ritual:

```text
last valid shard
→ micro-impact
→ Kintsugi propagation
→ particles
→ pulse
→ broken-to-restored reveal
→ completion burst
→ residual scar
→ result
```

The phase soundtrack ducks heavily when the final valid solution begins, allowing Kintsugi/harp accents to dominate.

Result presentation is not an arcade scoreboard.

```text
MEMORY INTEGRITY
96%

RESTORATION TIME
02:41

FALSE FRAGMENTS
1

LUNAR RESONANCE
A
```

Fields that do not apply to a memory are omitted rather than displayed as zero-noise.

### Integrity calculation

Initial deterministic policy:

```text
integrity = 100
  - (mistakes × 3)
  - (falseFragments × 8)
  - (2 × each completed 30s interval beyond memory.parSeconds)
```

Clamp to 0–100.

Resonance:

```text
S = 95–100  PERFECT RESONANCE
A = 85–94   STABLE MEMORY
B = 70–84   FRAGMENTED RECOVERY
C = 0–69    UNSTABLE RECOVERY
```

Time never blocks completion. Any resonance advances narrative progression.

Replay exists for mastery/satisfaction only.

---

## 21. Interlude II — Signature Found

Real assets:

- `/remember-experience/assets/images/interludes/remember-interlude-02-memory-network.png`
- `/remember-experience/assets/images/archive/remember-memory-archive-sigil.png`
- `/remember-experience/assets/images/archive/remember-akr001-signature.png`
- `/remember-experience/assets/images/fx/remember-signature-found-burst.png`

All five restored memories appear as connected records. Kintsugi paths converge through the archive sigil.

Sequence:

```text
SIGNATURE RECOVERY 100%
↓
MEMORY SIGNATURE FOUND
↓
AKR-001
↓
ACCESSING RECORD...
```

Only this scene sets `discoveredAkariRecord = true`.

The signature reveal must feel discovered, not like a menu item becoming unlocked.

Transition proceeds to Akari Reveal after the presentation settles and the player confirms/continues.

---

## 22. Akari Reveal

Asset:

`/remember-experience/assets/images/remember-akari-reveal.png`

This is the narrative payoff and must not appear before AKR-001.

Sequence:

1. covered/dark stage;
2. fragments/particles from prior memories converge;
3. Kintsugi fissure forms;
4. silhouette/presence emerges;
5. Akari resolves;
6. record metadata appears;
7. name and final line appear.

Localized copy:

```text
MEMORY RECORD
AKR-001

STATUS
RESTORED

AKARI

Então você se lembrou.
```

English uses the equivalent `So you remembered.`.

No gameplay interaction during the first reveal beat. Continue appears only after readability is established.

---

## 23. Epilogue

Video:

`/remember-experience/assets/videos/remember-epilogue-eclipse.mp4`

Transition into the epilogue is slow and cinematic.

Copy:

```text
Uma memória voltou.

Os Nove Reinos ainda estão desaparecendo.
```

English is localized by meaning, not literal machine translation.

The video is visual media, not the audio master. It is not eagerly loaded at `/remember` boot.

Reduced-motion/Save-Data may use a stable still treatment instead of forcing playback.

The player can continue after a minimum readable interval; they are not forced to watch a long unskippable cinematic.

---

## 24. Credits and Game Complete

Video:

`/remember-experience/assets/videos/remember-credits-loop.mp4`

Do not preload this ~large loop at boot. Begin loading near Akari/Epilogue only.

Final composition:

```text
REMEMBER WHAT REMAINS.

TSUKIHARA
ECLIPSE OF THE NINE REALMS

CONTINUE THE JOURNEY
```

Primary CTA returns to the main Tsukihara experience.

A Steam Wishlist CTA only exists when there is a real functional destination.

Credits are discreet and skippable/scrollable.

On credits entry, persist:

```ts
gameCompleted: true
```

After completion, title/archive unlock replay behavior.

---

## 25. Audio Architecture

Keep `useRememberAudio` as the controller and extend it with semantic hooks rather than triggering audio files from arbitrary components.

Required event vocabulary:

```text
menu-theme
memory-start
piece-snap
memory-kintsugi
memory-restored
archive-update
lunar-focus
false-memory
signature-found
akari-reveal
epilogue
```

If a dedicated audio asset does not exist for an event, the event may be a no-op or reuse an explicitly appropriate existing layer. Do not add generic stock clicks just to fill hooks.

Pause and Lunar Focus modify existing buses/gains through the controller.

The shared landing-page-style three-bar control remains the visual mute control.

---

## 26. Keyboard and Focus Model

Required controls:

```text
ESC       Pause during playable stages
SPACE     Lunar Focus in Gekkai
ENTER     Confirm primary actions
TAB       Navigate interactive controls
ARROWS    Menu/archive navigation when appropriate
```

Fragments retain keyboard parity. Interlude hotspots are focusable. Pause traps focus while open and restores focus to the previous gameplay control when closed.

No keyboard shortcut should fire while a text-like control or modal confirmation consumes that input.

---

## 27. Mobile and Touch

Touch requirements:

- pointer/touch-compatible shards;
- explicit Pause control;
- explicit Lunar Focus button;
- safe-area-aware top UI;
- reduced particle density;
- restrained distortion;
- mobile-specific scatter zones;
- large-enough hit targets;
- static fallback for heavy videos where Save-Data/reduced-motion applies.

`remember-mobile-sakura-transition.mp4` may enrich memory transitions on mobile only when motion/data preferences permit. It is not required for correctness.

---

## 28. Asset Loading and Performance

Use stage-oriented manifests.

Initial load:

- menu/boot;
- Hanamori;
- shared restoration VFX;
- essential audio metadata/load path.

During a stage, preload only the next likely stage and shared assets needed for its transition.

After leaving a heavy stage, release references/listeners/timers that are no longer required. Do not keep all five puzzles mounted.

Videos:

- epilogue loads near Akari;
- credits loop loads near epilogue;
- mobile transition is conditional;
- never preload all videos on route entry.

Prefer `transform`/`opacity` animations. Distortion/blur effects must be bounded and reduced on lower-power/mobile paths.

The new PNG assets are large; browser decoding should be scheduled/preloaded intentionally rather than requested simultaneously.

---

## 29. Real Asset Inventory for the Expansion

Base path:

`/remember-experience/assets/images/`

### Existing/shared

- `remember-menu-background.png`
- `remember-mizukyo-broken.png`
- `remember-mizukyo-restored.png`
- `remember-kurogane-broken.png`
- `remember-kurogane-restored.png`
- `remember-completion-burst.png`
- `mr01-kintsugi-crack-overlay.png`
- `mr02-memory-particles.png`
- `mr03-memory-pulse-ring.png`
- `mr06-restored-scar-overlay.png`
- `remember-akari-reveal.png`

### Archive

- `archive/remember-memory-archive-background.png`
- `archive/remember-memory-archive-sigil.png`
- `archive/remember-akr001-signature.png`

### Interludes

- `interludes/remember-interlude-01-unknown-memory.png`
- `interludes/remember-interlude-02-memory-network.png`

### Yumegakure

- `yumegakure/remember-yumegakure-broken.png`
- `yumegakure/remember-yumegakure-restored.png`
- `yumegakure/remember-yumegakure-false-fragment-01.png`
- `yumegakure/remember-yumegakure-false-fragment-02.png`
- `yumegakure/remember-yumegakure-distortion-overlay.png`

### Gekkai

- `gekkai/remember-gekkai-state-a.png`
- `gekkai/remember-gekkai-state-b.png`
- `gekkai/remember-gekkai-restored.png`
- `gekkai/remember-gekkai-lunar-focus-overlay.png`

### FX

- `fx/remember-signature-found-burst.png`
- `fx/remember-stage-lock-overlay.png`

### Videos

Base path: `/remember-experience/assets/videos/`

- `remember-epilogue-eclipse.mp4`
- `remember-credits-loop.mp4`
- `remember-mobile-sakura-transition.mp4`

The implementation must register these exact real paths in `remember-assets.ts`. Do not create placeholder filenames for assets already present.

---

## 30. Testing Strategy

All implementation slices follow RED → GREEN.

Existing regressions for Hanamori/Mizukyo/Kurogane remain mandatory.

Add pure Node tests for at least:

- stage progression graph;
- save parser and corrupted JSON fallback;
- save v1 normalization/migration boundary;
- New Game/Continue/completed-game policies;
- autosave event policy;
- archive progress derivation;
- replay lock/unlock policy;
- deterministic scatter constraints;
- ghost-seam guidance policy;
- pause timer/cooldown semantics;
- Yumegakure truth/unstable/completion policy;
- false-fragment counting semantics;
- Gekkai reality/focus/cooldown policy;
- integrity/resonance calculation;
- transition lock/destination handoff policy;
- asset manifest/known asset paths.

Required gate before a slice is considered complete:

```text
npm run test:hero
npm run test:remember
npm run format:check
npm run lint
npm run build
```

Visual/manual localhost validation must cover:

- no abrupt screen changes;
- preloader → boot → menu continuity;
- centered cinematic title;
- shared sound control;
- Continue/New Game behavior;
- Pause freeze/resume;
- Archive progression;
- Hanamori onboarding;
- harder scatter on the first three memories;
- ghost seams vs final Kintsugi distinction;
- Yumegakure false-memory recovery;
- Gekkai Lunar Focus desktop + touch path;
- Interlude I/II progression;
- AKR-001 reveal timing;
- Akari → epilogue → credits;
- completed-game replay;
- reduced motion;
- responsive/touch behavior.

---

## 31. Delivery Strategy

Implement as reviewable vertical slices rather than one large rewrite.

Recommended order:

1. foundation: state graph, save v1, asset registry and progression tests;
2. transition/preloader/menu gamefeel foundation;
3. Continue/New Game/Pause/Archive;
4. standard-memory scatter, ghost seams and Hanamori onboarding while preserving 01–03;
5. Interlude I;
6. Yumegakure False Memory;
7. Gekkai Overlapping Realities + Lunar Focus;
8. results/resonance + Interlude II/AKR-001;
9. Akari Reveal/Epilogue/Credits/game-complete/replay;
10. responsive, reduced-motion, performance and full regression hardening.

Each slice must leave the branch coherent and testable. New mechanics are not allowed to regress the three original memories.

---

## 32. Definition of Done

REMEMBER is complete when it no longer feels like three promotional puzzle screens and instead plays as a coherent Tsukihara prologue.

A successful implementation has:

- truthful gameified loading;
- cinematic transitions between every major screen;
- game-like idle/interaction feedback without visual noise;
- centered title/menu identity;
- clear first-memory onboarding;
- five materially distinct memory experiences;
- persistent Continue/New Game behavior;
- pause and archive systems that feel native to the world;
- meaningful but non-punitive resonance results;
- AKR-001 revealed only after the full memory network is restored;
- Akari as the narrative payoff;
- a functional epilogue/credits ending;
- replay after completion;
- no regression in Hanamori, Mizukyo or Kurogane;
- mobile, keyboard and reduced-motion viability;
- green regression, formatting, lint and build gates.

The final sensation should be that the player recovered only one small thread of something much larger.
