# TSUKIHARA — REMEMBER Full Prologue Experience Design

## Status

Authoritative v2 design for the REMEMBER expansion.

Baseline: `main@fda8cd44f48182abc71ff12c6008fdb30ea9358d`.

This document supersedes the previous three-memory-only design and its old implementation assumptions. REMEMBER is now a complete interactive prologue with persistence, archive, pause, five memories, two interludes, AKR-001 discovery, Akari reveal, epilogue and credits.

This remains an expansion of the existing `/remember` codebase, not a rewrite. Hanamori, Mizukyo, Kurogane, drag/snap, restoration VFX, audio behavior, keyboard parity and reduced-motion behavior are existing assets to preserve.

---

## 1. Product Goal

REMEMBER should feel like a small standalone game embedded inside the Tsukihara site rather than a promotional web interaction.

Target playtime: roughly 10–20 minutes.

Narrative progression should create three questions in order:

1. Why am I restoring these memories?
2. Who am I following?
3. Akari.

The final feeling is intentionally incomplete: one thread of memory returned, but Tsukihara is still disappearing.

Core closing idea:

> Uma memória voltou. Tsukihara ainda precisa ser lembrada.

### Non-negotiable principles

- Expand, do not rewrite.
- Preserve the original three memories and restoration ritual.
- No abrupt scene swaps.
- No generic SaaS modals or card dashboards.
- Difficulty comes from observation and memory mechanics, not punishment.
- Progress is local, resilient and versioned.
- No fake loading percentages or fake audio assets.
- Do not keep all scenes mounted simultaneously.
- Touch, keyboard and reduced-motion paths are first-class.

---

## 2. Official Experience Flow

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

`Memory Archive` is accessible from title/pause according to progression rules.

`Pause` is orthogonal UI state and never becomes a narrative stage.

After `gameCompleted === true`, the Archive becomes a replay selector for the five memories.

---

## 3. Architecture

Keep the existing `audio`, `content`, `restore`, `scenes`, `state` and `system` foundations.

Target responsibility boundaries:

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

`RememberExperience` remains the composition root but must not become the implementation site for every mechanic.

The existing `MemoryPuzzle` and `MemoryRestorationEffect` remain the shared reconstruction engine. Yumegakure and Gekkai extend that engine through mechanic-specific state/render policies instead of creating unrelated pointer systems.

### State domains

Keep four concerns explicit:

- **progression** — current narrative stage and completed stages;
- **session** — locale, muted, pause/archive visibility and transition lock;
- **puzzle runtime** — restored fragments, restoration phase and mechanic runtime;
- **persistent save** — durable stage/memory progress and results.

Never persist pointer coordinates, GSAP progress, DOM geometry or animation refs.

---

## 4. Explicit Progression Model

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

Title/menu and Boot are not stages. Pause is not a stage.

Before game completion, progression follows this ordered graph only. No direct stage skip is exposed to the player.

Narrative advancement is reducer/event driven. `setTimeout` may schedule visual beats but cannot be the source of truth for stage progression.

---

## 5. Persistence

Save key:

```text
tsukihara:remember:save:v1
```

The project does not currently use Zod, so v1 uses a small explicit runtime parser instead of adding a validation dependency only for this feature.

### Save model

```ts
type MemoryProgress = {
  completed: boolean;
  completedAt?: string;
  restoredFragmentIds: string[];
  completionTime?: number;
  mistakes: number;
  falseFragments: number;
  integrity?: number;
  resonance?: "S" | "A" | "B" | "C";
};

type RememberSaveV1 = {
  version: 1;
  startedAt: string;
  updatedAt: string;
  currentStage: RememberStageId;
  completedStages: RememberStageId[];
  memories: Partial<Record<MemoryId, MemoryProgress>>;
  discoveredAkariRecord: boolean;
  gameCompleted: boolean;
};
```

`archiveProgress` is **not persisted**. It is derived from completed memory records: each of the five memories contributes exactly 20%.

`MemoryId` becomes:

```ts
type MemoryId =
  | "hanamori"
  | "mizukyo"
  | "kurogane"
  | "yumegakure"
  | "gekkai";
```

### Safe load pipeline

```text
localStorage string
→ guarded JSON.parse
→ inspect version
→ migrate supported version
→ validate normalized object
→ hydrate or return null
```

Validation checks recognized ids, enum values, arrays, finite/non-negative numeric values and known memory keys.

Invalid/corrupted saves never throw into React and are ignored safely.

### Migration boundary

Expose `migrateRememberSave(raw)` even though only version 1 exists. Future versions must not require callers to understand migration details.

### Autosave events

Write only after meaningful events:

- new game creation;
- stage entry;
- successful fragment restoration when deterministic resume is supported;
- puzzle completion;
- interlude completion;
- result/resonance calculation;
- AKR-001 discovery;
- epilogue entry;
- game completion;
- restart-memory reset;
- return to title.

Never write on pointer move, animation frame, hover or every timer tick.

### Resume

`CONTINUE` resumes `currentStage`.

For standard memories, known `restoredFragmentIds` are restored to snapped state and unresolved pieces are scattered again. Free-floating pixel positions are never serialized.

Yumegakure/Gekkai may initially restart their current puzzle if partial mechanic serialization cannot be made deterministic without complicating the engine. Prior completed stages/results remain preserved.

---

## 6. Title Menu States

### No save

Primary CTA:

- PT: `NOVA MEMÓRIA`
- EN: `NEW MEMORY`

### Incomplete save

Primary CTA:

- PT: `CONTINUAR`
- EN: `CONTINUE`

Below it, show actual macro progress such as:

```text
MEMORY 03 / 05
KUROGANE
60% RESTORED
```

The percentage is derived from completed memories plus deterministic fragment completion in the current memory; never hard-code it.

`NEW GAME` is secondary.

Selecting New Game while a save exists opens an in-world confirmation:

```text
BEGIN AGAIN?
Your restored memories will be forgotten.
```

Only explicit confirmation replaces the save.

### Completed game

Primary route becomes `REVISIT MEMORIES` / localized equivalent and opens Archive in replay mode.

`NEW GAME` remains available with destructive confirmation.

Do not show Continue once the narrative is complete.

---

## 7. Gameified Preloader + Boot

The route starts with a real asset preloader.

Visual language:

- lunar black field;
- central `月` / sigil;
- restrained Kintsugi fissures;
- `RECOVERING MEMORIES` / localized equivalent;
- truthful loaded/required state expressed through sigil/fragments rather than an invented percentage.

Initial preload includes only menu/Boot, Hanamori and shared restoration assets required to start play.

Later stages load incrementally.

Preloader resolves into Boot without a hard cut.

Boot exists for the first intentional audio-unlock gesture. The prompt uses a subtle `PRESS ANY BUTTON`-style opacity breathe.

Accepted Boot input: pointer/touch, Enter, Space and non-modifier printable keys.

---

## 8. SceneTransitionDirector

Every major screen/stage change uses one director.

```text
current scene exit
→ transition veil fully covers stage
→ destination is committed
→ destination assets confirmed
→ destination enters
→ interaction unlocks
```

Duplicate transition requests while locked are rejected, not queued.

If destination assets are not ready, the fully covered veil becomes a small ritual loading state. Never expose a blank shell.

Full-motion target:

- exit: 350–500ms;
- covered handoff: 100–300ms when ready;
- enter: 600–800ms.

Reduced motion uses short opacity-only handoffs with identical interaction locking.

Memory intro format:

```text
MEMÓRIA 01
HANAMORI
花守
```

Intro text resolves, holds, exits, and only then unlocks the puzzle.

---

## 9. Main Menu Gamefeel

The main information block is centered.

Primary title treatment:

```text
記憶
↓
REMEMBER
```

Reuse shared `JpRevealText` for the Japanese → final-language effect.

Motion hierarchy:

- idle prompts breathe in opacity;
- primary CTA floats only 2–4px on Y over a slow loop;
- sigils/glow breathe more slowly;
- hover/focus feedback is immediate;
- event motion is stronger than idle motion.

Do not animate every label.

The sound control uses the shared three-bar component already aligned with the landing page.

---

## 10. Pause

`ESC` opens Pause during puzzle memories and both interactive interludes. Touch/pointer has a discrete Pause control.

```ts
paused: boolean
```

Opening Pause never changes `currentStage`.

While paused:

- drag/snap is disabled;
- memory completion timer stops accumulating;
- Gekkai active/cooldown timers stop;
- gameplay-critical timelines pause safely;
- audio is heavily ducked/paused through the controller;
- decorative background motion may freeze or continue only at a negligible rate.

Menu:

```text
PAUSED

CONTINUE
MEMORY ARCHIVE
SETTINGS
RESTART MEMORY
RETURN TO TITLE
```

`SETTINGS` v1 contains only language and sound. Reduced-motion continues to respect the platform preference rather than introducing a second conflicting motion preference.

`RESTART MEMORY` resets only the active memory after confirmation.

`RETURN TO TITLE` autosaves first.

Akari Reveal, Epilogue and Credits use their own continue/skip affordances instead of gameplay Pause.

---

## 11. Memory Archive

Archive is a ritual record interface, not a generic card grid.

Assets:

- `archive/remember-memory-archive-background.png`
- `archive/remember-memory-archive-sigil.png`
- `archive/remember-akr001-signature.png`

Records:

```text
01 HANAMORI
02 MIZUKYO
03 KUROGANE
04 YUMEGAKURE
05 GEKKAI
```

Status derivation:

- `RESTORED` — memory completed;
- `UNSTABLE` — current memory has started but is incomplete;
- `UNKNOWN` — next memory is narratively unlocked but has not started;
- `LOCKED` — not yet reachable in progression.

The dominant progress element is the archive sigil. Each restored memory illuminates exactly one fifth.

Before Gekkai completion, Archive may imply a latent signature but cannot show `AKR-001`.

Only Interlude II sets `discoveredAkariRecord = true`. After that, AKR-001 remains visible in Archive.

Before game completion, Archive is read-only for progression. After completion, every restored memory becomes a replay entry.

---

## 12. Shared Memory Definition

Extend the existing data-driven memory model.

```ts
type MemoryMechanic = "standard" | "false-memory" | "overlapping";
```

All five memory definitions include id, index, mechanic, title/titleJp, viewbox, assets, fragments, seams, snap ratio, `parSeconds`, localized completion copy and palette.

Initial par values for non-punitive resonance calculation:

- Hanamori: 150s;
- Mizukyo: 210s;
- Kurogane: 270s;
- Yumegakure: 360s;
- Gekkai: 420s.

These values affect result grade only and never block progression.

---

## 13. Scatter Difficulty

Replace near-destination initial placements with seeded scatter.

Rules:

- no piece starts close enough to look pre-solved;
- pieces use peripheral zones;
- all pieces remain reachable and visible;
- initial overlap is limited;
- HUD/control safe zones are excluded;
- desktop uses all four edges where practical;
- mobile uses dedicated safe scatter zones.

Difficulty:

- Hanamori: moderate scatter, 8–15° visual rotation;
- Mizukyo: wider scatter, 12–20°;
- Kurogane: high scatter, 16–28°;
- Yumegakure/Gekkai rely primarily on their mechanics rather than arbitrary extra displacement.

The seed stays stable during one active puzzle session. Rerenders never teleport pieces.

Restart Memory creates a new valid scatter seed.

---

## 14. Ghost Seams vs Kintsugi

Puzzle guidance and restoration payoff are distinct systems.

### Ghost seams

Low-opacity structural scars during play:

- Hanamori: roughly 10–15% opacity;
- Mizukyo: weaker;
- Kurogane: mostly revealed by drag/idle guidance.

Dragging a piece may make only its related ghost seam breathe subtly.

Ghost seams are not bright gold and never look restored.

### Kintsugi

The existing bright Kintsugi network remains exclusive to the valid final restoration ritual.

---

## 15. Hanamori — Tutorial / Standard

Preserve five-piece identity and current drag/snap behavior.

After the cinematic chapter intro:

```text
RECONSTRUA A MEMÓRIA
Arraste os fragmentos e devolva-os ao lugar ao qual pertencem.
```

Teaching behavior:

- one piece gets a restrained microglow;
- one matching ghost seam breathes once;
- while dragging, guidance becomes `Encontre a cicatriz à qual este fragmento pertence.`;
- first snap receives audio + micro-pulse + `FRAGMENTO RESTAURADO 01 / 05`;
- onboarding disappears after that first snap and does not return in the run.

Idle hint:

- first after 5s without meaningful input;
- maximum two repetitions;
- at least 8s between repeats;
- hint is a reversible 2–4px piece drift, never an arrow/hand.

Keyboard parity remains deterministic.

---

## 16. Mizukyo — Reflection / Standard

Preserve the existing seven-piece memory.

Identity: `REFLECTION`.

Use wider scatter and water/reflection ambiguity. A mirrored visual cue may be rendered as presentation only; it does not create another solver or another input model.

---

## 17. Interlude I — Unknown Signature

Asset:

`interludes/remember-interlude-01-unknown-memory.png`

Use exactly four focusable memory traces/hotspots.

Pointer hover/tap and keyboard focus reveal the same content.

Target duration: 30–60 seconds.

Final copy:

```text
UNKNOWN MEMORY SIGNATURE

Você não está restaurando lugares.

Está seguindo alguém.
```

Do not name Akari.

Completing the fourth trace unlocks the final copy, then Continue advances to Kurogane and autosaves.

---

## 18. Kurogane — Structure / Standard

Preserve the existing nine-piece memory.

Identity: `STRUCTURE`.

Use the hardest standard-memory scatter profile. Snap remains forgiving enough to avoid pixel hunting.

Do not add a bespoke rotation control in v1. Existing visual rotation plus shared snap behavior is sufficient.

---

## 19. Yumegakure — False Memory

Assets:

- `yumegakure/remember-yumegakure-broken.png`
- `yumegakure/remember-yumegakure-restored.png`
- `yumegakure/remember-yumegakure-false-fragment-01.png`
- `yumegakure/remember-yumegakure-false-fragment-02.png`
- `yumegakure/remember-yumegakure-distortion-overlay.png`

Identity: `FALSE MEMORY`.

The puzzle has exactly **nine visible fragments: seven true + two false**.

False-memory fragments extend the shared fragment definition with truth/source metadata.

Both false fragments are plausible and have designated compatible target regions. They can snap and initially appear accepted.

A composition with any stabilized false fragment cannot start Kintsugi. Instead it enters `UNSTABLE` feedback:

- distortion overlay rises;
- lighting/presence becomes subtly wrong;
- no failure modal or reset;
- the player is taught that an accepted fragment may be false.

Yumegakure allows snapped pieces to be removed. Reversibility is implemented through the shared fragment-state API and is enabled only for this mechanic.

`falseFragments` increments only the first time each false fragment is stabilized during the run, so the maximum false-fragment penalty is 2.

Completion requires all seven true fragments in valid targets and zero false fragments occupying targets.

Then the normal Kintsugi ritual runs.

---

## 20. Gekkai — Overlapping Realities

Assets:

- `gekkai/remember-gekkai-state-a.png`
- `gekkai/remember-gekkai-state-b.png`
- `gekkai/remember-gekkai-restored.png`
- `gekkai/remember-gekkai-lunar-focus-overlay.png`

Identity: `OVERLAPPING REALITIES`.

Use eight fragments. Each definition declares an authentic state: `a` or `b`.

Outside Lunar Focus, each piece crossfades between State A and B on a staggered slow cycle. Geometry never moves because of the reality oscillation.

A piece can finalize a snap only while its authentic reality is the visible state. Wrong-reality snap attempts softly reject to the previous draggable position and increment `mistakes` once.

### Lunar Focus

- desktop shortcut: Space;
- touch: explicit button;
- active: 3s;
- cooldown: 6s after active window ends.

During Focus:

- each fragment resolves to its authentic state;
- oscillation freezes;
- lunar-focus overlay appears;
- particles slow/freeze;
- chroma reduces slightly;
- audio becomes muffled/spacious;
- drag remains enabled.

Pause freezes active duration and cooldown.

Reduced motion replaces continuous crossfade with slow discrete opacity state changes. Focus still resolves authenticity immediately.

No combat timer, meter grind or action-game subsystem is introduced.

---

## 21. Restoration Result and Resonance

Every puzzle memory keeps the existing completion ritual:

```text
last valid shard
→ micro-impact
→ Kintsugi
→ particles
→ pulse
→ broken-to-restored reveal
→ burst
→ residual scar
→ result
```

The phase soundtrack ducks heavily when final restoration begins.

Result UI:

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

Fields that do not apply are omitted.

Integrity policy:

```text
integrity = 100
  - (mistakes × 3)
  - (falseFragments × 8)
  - (2 × each completed 30s interval beyond parSeconds)
```

Clamp 0–100.

```text
S = 95–100  PERFECT RESONANCE
A = 85–94   STABLE MEMORY
B = 70–84   FRAGMENTED RECOVERY
C = 0–69    UNSTABLE RECOVERY
```

Any grade advances the story.

---

## 22. Interlude II — Signature Found

Assets:

- `interludes/remember-interlude-02-memory-network.png`
- `archive/remember-memory-archive-sigil.png`
- `archive/remember-akr001-signature.png`
- `fx/remember-signature-found-burst.png`

All five records appear connected by Kintsugi through the archive sigil.

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

This scene alone sets `discoveredAkariRecord = true`.

AKR-001 becomes a persistent Archive identity only after this event.

Continue advances to Akari Reveal after the cinematic settles.

---

## 23. Akari Reveal

Asset:

`remember-akari-reveal.png`

Sequence:

1. dark covered stage;
2. prior-memory particles converge;
3. Kintsugi fissure forms;
4. silhouette/presence emerges;
5. Akari resolves;
6. record metadata appears;
7. name/final line resolves.

Copy:

```text
MEMORY RECORD
AKR-001

STATUS
RESTORED

AKARI

Então você se lembrou.
```

EN: `So you remembered.`

No input is required during the first reveal beat. Continue appears only after readability is established.

---

## 24. Epilogue and Credits

Epilogue video:

`/remember-experience/assets/videos/remember-epilogue-eclipse.mp4`

Copy:

```text
Uma memória voltou.

Os Nove Reinos ainda estão desaparecendo.
```

The epilogue is not eagerly loaded at Boot. Reduced-motion/Save-Data may use a stable still instead of video playback.

The player can continue after a minimum readable interval and is not forced through a long unskippable cinematic.

Credits video:

`/remember-experience/assets/videos/remember-credits-loop.mp4`

Final composition:

```text
REMEMBER WHAT REMAINS.

TSUKIHARA
ECLIPSE OF THE NINE REALMS

CONTINUE THE JOURNEY
```

Primary CTA returns to the main Tsukihara experience.

A Steam Wishlist CTA exists only when a real functional destination exists.

Entering Credits persists `gameCompleted: true`.

---

## 25. Audio

Keep `useRememberAudio` as the single controller.

Semantic hooks:

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

Missing dedicated sound assets result in no-op or reuse of an explicitly suitable existing layer. Do not add generic stock UI sounds.

Pause and Lunar Focus operate through audio gain/bus behavior, not direct `<audio>` manipulation in scene components.

The shared landing-page three-bar component remains the mute control.

---

## 26. Keyboard, Focus, Mobile

Keyboard:

```text
ESC       Pause during playable stages
SPACE     Lunar Focus in Gekkai
ENTER     Confirm primary actions
TAB       Navigate controls/hotspots
ARROWS    Menu/archive navigation where implemented
```

Fragments retain keyboard parity. Interlude traces are focusable. Pause traps focus and restores prior focus when closed.

Touch/mobile requires:

- pointer-compatible shards;
- explicit Pause;
- explicit Lunar Focus;
- safe-area-aware UI;
- mobile scatter zones;
- reduced particles/distortion;
- large enough hit targets;
- static heavy-video fallbacks under Save-Data/reduced-motion.

`remember-mobile-sakura-transition.mp4` may enrich transitions when motion/data preferences allow; it is never required for correctness.

---

## 27. Asset Loading and Performance

Use stage-oriented asset manifests.

Initial load:

- menu/Boot;
- Hanamori;
- shared restoration VFX;
- essential audio load path.

During a stage, preload only the next likely stage and transition dependencies.

Videos:

- epilogue loads near Akari;
- credits loads near Epilogue;
- mobile transition is conditional;
- never preload all videos on route entry.

Unmount/release listeners, timers and heavy references from prior stages. Never keep all five puzzles mounted.

Prefer transform/opacity. Bound blur/distortion and reduce them on lower-power/mobile paths.

---

## 28. Real Asset Inventory

Base image path:

`/remember-experience/assets/images/`

Confirmed expansion groups in current `main`:

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

Existing shared assets continue through `remember-assets.ts`, including menu background, Mizukyo/Kurogane broken/restored, completion VFX and Akari reveal.

The current registry references `mr06-restored-scar-overlay.png`; the first asset-registry implementation slice must verify the physical file. If it is absent, residual scar falls back to the SVG/seam network rather than referencing a fake asset.

Videos:

- `/remember-experience/assets/videos/remember-epilogue-eclipse.mp4`
- `/remember-experience/assets/videos/remember-credits-loop.mp4`
- `/remember-experience/assets/videos/remember-mobile-sakura-transition.mp4`

---

## 29. Testing

Every implementation slice follows RED → GREEN.

Existing Hanamori/Mizukyo/Kurogane regressions remain mandatory.

Add focused Node tests for:

- stage progression graph;
- save parser/corrupted JSON fallback;
- migration boundary;
- Continue/New Game/completed-game policy;
- autosave policy;
- archive 20% derivation/status/replay lock;
- deterministic scatter constraints;
- ghost-seam guidance;
- pause timer semantics;
- Yumegakure false-fragment/unstable/completion policy;
- false-fragment counting max of two;
- Gekkai authentic-state/focus/cooldown policy;
- integrity/resonance calculation;
- transition locking/handoff;
- asset manifest paths.

Required slice gate:

```text
npm run test:hero
npm run test:remember
npm run format:check
npm run lint
npm run build
```

Manual localhost validation must cover the full route, including no hard cuts, preload continuity, menu gamefeel, save/resume, Pause, Archive, harder scatter, Hanamori guidance, ghost seams, Yumegakure, Gekkai, both interludes, AKR-001 timing, Akari/Epilogue/Credits, replay, mobile and reduced motion.

---

## 30. Delivery Slices

Implementation order:

1. state graph + save v1 + asset registry + progression tests;
2. Transition Director + real preloader + centered menu gamefeel;
3. Continue/New Game + Pause + Archive;
4. seeded scatter + ghost seams + Hanamori onboarding + 01–03 regression;
5. Interlude I;
6. Yumegakure False Memory;
7. Gekkai Overlapping Realities + Lunar Focus;
8. resonance results + Interlude II + AKR-001;
9. Akari Reveal + Epilogue + Credits + game complete + replay;
10. responsive/reduced-motion/performance/full regression hardening.

Each slice must leave the branch coherent and testable.

---

## 31. Definition of Done

REMEMBER is done when it plays as a coherent Tsukihara prologue rather than three promotional puzzle screens.

Required outcome:

- truthful gameified loading;
- cinematic transitions between all major screens;
- balanced game-like idle/interaction feedback;
- centered cinematic REMEMBER identity;
- clear Hanamori onboarding;
- five distinct memory experiences;
- resilient Continue/New Game persistence;
- native-feeling Pause and Archive;
- non-punitive resonance results;
- AKR-001 only after the five-memory network is restored;
- Akari as narrative payoff;
- functional Epilogue/Credits ending;
- replay after completion;
- no regression in Hanamori, Mizukyo or Kurogane;
- viable touch, keyboard and reduced-motion paths;
- green regression, format, lint and build gates.
