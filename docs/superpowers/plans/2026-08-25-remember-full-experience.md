# TSUKIHARA — REMEMBER Full Prologue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the existing `/remember` minigame into a 10–20 minute Tsukihara prologue with resilient local progress, premium game transitions, five memories, two interludes, AKR-001 discovery, Akari reveal, epilogue, credits, and post-game replay without regressing Hanamori, Mizukyo, or Kurogane.

**Architecture:** Keep the current `audio`, `content`, `restore`, `scenes`, `state`, and `system` foundations. `RememberExperience` remains the composition root, while progression/save, scene transitions, archive/pause, puzzle mechanics, and final narrative scenes are moved behind focused interfaces. Existing `MemoryPuzzle` and `MemoryRestorationEffect` remain the shared reconstruction engine; Yumegakure and Gekkai extend it through mechanic-specific policies rather than separate pointer systems.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, GSAP 3.13, CSS, `@paper-design/shaders-react`, native `localStorage`, native `HTMLAudioElement`, native `node:test` with `--experimental-strip-types`.

**Spec:** `docs/superpowers/specs/2026-08-25-remember-full-experience-design.md`

## Global Constraints

- Baseline implementation branch must be created from `main@fda8cd44f48182abc71ff12c6008fdb30ea9358d` or a newer `main` only after revalidating that newer `main` contains this baseline.
- Expansion only: preserve the original three memories, drag/snap behavior, restoration ritual, audio behavior, keyboard parity, and reduced-motion path.
- Progress key is exactly `tsukihara:remember:save:v1`; invalid/corrupted saves must never throw into React render.
- Do not add Zod solely for this feature; use an explicit runtime parser and a versioned migration boundary.
- `archiveProgress` is derived: 20% for each completed memory; it is not stored independently.
- Do not persist pointer coordinates, GSAP progress, DOM measurements, or animation refs.
- Major stage changes use one `SceneTransitionDirector`; no hard scene swaps and no `setTimeout` as narrative state truth.
- Pause is orthogonal UI state and never changes `currentStage`.
- Yumegakure uses 7 true fragments + 2 false fragments.
- Gekkai uses 8 fragments; Lunar Focus is active for 3 seconds, then has a 6-second cooldown.
- Interlude I exposes exactly 4 traces.
- `AKR-001` is not revealed before Interlude II.
- Sound mute control uses the shared landing-page three-bar visual component already merged into `main`.
- Initial route load preloads only menu/Boot, Hanamori, shared VFX, and essential audio; later stages preload incrementally.
- No fake sound assets, fake loading percentages, generic SaaS modals, score-arcade presentation, or all-scenes-mounted architecture.
- Required gate for every completed task: `npm run test:hero`, `npm run test:remember`, `npm run format:check`, `npm run lint`, `npm run build`.
- Keep implementation PR draft until localhost visual validation; never merge automatically.

---

## File Structure Locked by This Plan

### State and persistence
- Modify `src/components/remember/state/remember-state.ts` — canonical runtime types/actions.
- Modify `src/components/remember/state/remember-reducer.ts` — narrative progression and orthogonal UI state.
- Modify `src/components/remember/state/remember-reducer.test.mjs` — reducer regression coverage.
- Create `src/components/remember/state/remember-progression.ts` — ordered stage graph and replay policy.
- Create `src/components/remember/state/remember-progression.test.mjs`.
- Create `src/components/remember/state/remember-save.ts` — v1 parser, migration boundary, serialization helpers.
- Create `src/components/remember/state/remember-save.test.mjs`.

### Assets / loading / transitions
- Modify `src/components/remember/content/remember-assets.ts` — register all real expansion asset paths.
- Modify `src/components/remember/content/memory-definitions.ts` — five memory definitions and mechanic discriminants.
- Modify `src/components/remember/content/memory-definitions.test.mjs`.
- Create `src/components/remember/system/remember-asset-manifest.ts` — stage-oriented preload manifests.
- Create `src/components/remember/system/remember-asset-manifest.test.mjs`.
- Create `src/components/remember/system/scene-transition-policy.ts` — pure transition lock/handoff policy.
- Create `src/components/remember/system/scene-transition-policy.test.mjs`.
- Create `src/components/remember/scenes/scene-transition-director.tsx` — GSAP veil and covered handoff.
- Create `src/components/remember/scenes/game-preloader.tsx` — truthful gameified initial loader.

### Menu / pause / archive
- Modify `src/components/remember/scenes/boot-scene.tsx`.
- Modify `src/components/remember/scenes/menu-scene.tsx`.
- Modify `src/components/remember/remember-shell.tsx`.
- Create `src/components/remember/scenes/pause-menu.tsx`.
- Create `src/components/remember/archive/archive-policy.ts`.
- Create `src/components/remember/archive/archive-policy.test.mjs`.
- Create `src/components/remember/archive/memory-archive.tsx`.

### Puzzle guidance and mechanics
- Create `src/components/remember/restore/scatter-layout.ts`.
- Create `src/components/remember/restore/scatter-layout.test.mjs`.
- Create `src/components/remember/restore/ghost-seams.tsx`.
- Create `src/components/remember/restore/hanamori-guidance.ts`.
- Create `src/components/remember/restore/hanamori-guidance.test.mjs`.
- Modify `src/components/remember/restore/memory-puzzle.tsx`.
- Modify `src/components/remember/restore/memory-fragment.tsx`.
- Modify `src/components/remember/scenes/restore-scene.tsx`.
- Create `src/components/remember/mechanics/false-memory-policy.ts`.
- Create `src/components/remember/mechanics/false-memory-policy.test.mjs`.
- Create `src/components/remember/mechanics/false-memory-stage.tsx`.
- Create `src/components/remember/mechanics/lunar-focus-policy.ts`.
- Create `src/components/remember/mechanics/lunar-focus-policy.test.mjs`.
- Create `src/components/remember/mechanics/overlapping-memory-stage.tsx`.

### Interludes / result / finale
- Create `src/components/remember/interludes/interlude-01-scene.tsx`.
- Create `src/components/remember/interludes/interlude-02-scene.tsx`.
- Create `src/components/remember/results/memory-result.ts`.
- Create `src/components/remember/results/memory-result.test.mjs`.
- Create `src/components/remember/results/memory-result-screen.tsx`.
- Modify `src/components/remember/scenes/memory-reveal-scene.tsx` — make this the authoritative Akari reveal.
- Create `src/components/remember/scenes/epilogue-scene.tsx`.
- Create `src/components/remember/scenes/credits-scene.tsx`.
- Create `src/components/remember/scenes/stage-router.tsx`.
- Modify `src/components/remember/audio/use-remember-audio.ts`.
- Modify `src/components/remember/remember-experience.tsx`.
- Modify `src/app/remember/remember.css` and existing REMEMBER refinement CSS files rather than introducing a parallel visual system.
- Modify `package.json` whenever a new Node regression file is added to `test:remember`.

---

### Task 1: Progression graph, Save v1, five-memory model, and real assets

**Files:** state/save/progression files, `remember-assets.ts`, `memory-definitions.ts`, their tests, `package.json`.

**Interfaces:**

```ts
export type RememberStageId =
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

export type MemoryId = "hanamori" | "mizukyo" | "kurogane" | "yumegakure" | "gekkai";
export type MemoryMechanic = "standard" | "false-memory" | "overlapping";

export type MemoryProgress = {
  restoredFragmentIds: string[];
  startedAt?: string;
  elapsedMs: number;
  mistakes: number;
  falseFragments: number;
};

export type MemoryResult = {
  completed: true;
  completedAt: string;
  completionTime: number;
  mistakes: number;
  falseFragments: number;
  integrity: number;
  resonance: "S" | "A" | "B" | "C";
};

export type RememberSaveV1 = {
  version: 1;
  startedAt: string;
  updatedAt: string;
  currentStage: RememberStageId;
  completedStages: RememberStageId[];
  memoryProgress: Partial<Record<MemoryId, MemoryProgress>>;
  memories: Partial<Record<MemoryId, MemoryResult>>;
  discoveredAkariRecord: boolean;
  gameCompleted: boolean;
};
```

- [ ] **Step 1: Write RED progression tests**

```js
assert.equal(getNextStage("hanamori"), "mizukyo");
assert.equal(getNextStage("mizukyo"), "interlude-01");
assert.equal(getNextStage("interlude-01"), "kurogane");
assert.equal(getNextStage("kurogane"), "yumegakure");
assert.equal(getNextStage("yumegakure"), "gekkai");
assert.equal(getNextStage("gekkai"), "interlude-02");
assert.equal(getNextStage("interlude-02"), "akari-reveal");
assert.equal(getNextStage("akari-reveal"), "epilogue");
assert.equal(getNextStage("epilogue"), "credits");
assert.equal(canReplayMemory(false, "hanamori"), false);
assert.equal(canReplayMemory(true, "gekkai"), true);
```

Run: `npm run test:remember`.
Expected: FAIL because the ordered graph/replay policy does not exist.

- [ ] **Step 2: Implement `remember-progression.ts` minimally**

```ts
export const REMEMBER_STAGE_ORDER: RememberStageId[] = [
  "hanamori", "mizukyo", "interlude-01", "kurogane", "yumegakure",
  "gekkai", "interlude-02", "akari-reveal", "epilogue", "credits",
];

export const getNextStage = (stage: RememberStageId) => {
  const index = REMEMBER_STAGE_ORDER.indexOf(stage);
  return index >= 0 ? REMEMBER_STAGE_ORDER[index + 1] ?? null : null;
};

export const canReplayMemory = (gameCompleted: boolean, memoryId: MemoryId) =>
  gameCompleted && ["hanamori", "mizukyo", "kurogane", "yumegakure", "gekkai"].includes(memoryId);
```

- [ ] **Step 3: Write RED Save v1 tests**

Test valid save hydration, corrupted JSON returning `null`, unsupported `version` returning `null`, unknown stage rejection, negative metric rejection, unknown memory ids rejection, and round-trip serialization.

```js
assert.equal(loadRememberSave("{broken"), null);
assert.equal(loadRememberSave(JSON.stringify({ version: 2 })), null);
const save = createNewRememberSave("2026-08-25T16:00:00.000Z");
assert.equal(save.version, 1);
assert.equal(save.currentStage, "hanamori");
assert.deepEqual(loadRememberSave(serializeRememberSave(save)), save);
```

Run: `npm run test:remember`.
Expected: FAIL because save helpers do not exist.

- [ ] **Step 4: Implement safe parser + migration boundary**

`loadRememberSave(raw: string | null): RememberSaveV1 | null` must wrap `JSON.parse`, inspect `version`, route through `migrateRememberSave(rawObject)`, then validate every recognized field. `migrateRememberSave` accepts only version 1 initially and returns `null` for unsupported versions.

- [ ] **Step 5: Expand reducer/state without serializing animation state**

Reducer must expose `currentStage`, `paused`, `archiveOpen`, active puzzle runtime, and existing `restorationPhase`. Add actions for `HYDRATE_SAVE`, `START_NEW_GAME`, `ENTER_STAGE`, `OPEN_PAUSE`, `CLOSE_PAUSE`, `OPEN_ARCHIVE`, `CLOSE_ARCHIVE`, `RESTART_MEMORY`, `COMPLETE_STAGE`, and keep locale/mute actions.

- [ ] **Step 6: Register all real assets and five memory definitions**

Use exact paths from the approved spec. `MemoryDefinition` becomes a discriminated union by `mechanic`. Yumegakure registers two false-fragment assets; Gekkai registers State A/B and focus overlay. Do not invent replacement filenames.

- [ ] **Step 7: GREEN + full gate + review + commit**

Run the complete required gate. Commit only after all commands pass.
Commit: `feat: model REMEMBER prologue progression and saves`

---

### Task 2: SceneTransitionDirector, truthful preloader, Boot/Menu gamefeel

**Files:** transition policy/tests, asset manifest/tests, preloader, transition director, Boot/Menu, shell, audio controller, `RememberExperience`, CSS.

**Interfaces:**

```ts
export type TransitionState = "idle" | "exiting" | "covered" | "entering";
export const canRequestTransition = (state: TransitionState) => state === "idle";

export type StageAssetManifest = {
  critical: string[];
  next: string[];
};

export type PreloadProgress = { loaded: number; total: number; ready: boolean };
```

- [ ] **Step 1: RED transition policy tests**

Verify duplicate requests are rejected while `exiting|covered|entering`, destination commit occurs only under full coverage, and reduced-motion preserves locking even when timings are shorter.

- [ ] **Step 2: RED asset-manifest tests**

Initial manifest must include menu/Boot, Hanamori and shared restoration VFX, but exclude Yumegakure, Gekkai, epilogue video and credits video. Hanamori's `next` manifest must preload Mizukyo only; epilogue loads only near Akari.

- [ ] **Step 3: Implement pure policies and stage manifests**

Keep loading truth as `loaded / total` from actual image decode/load completion. Failed optional media can resolve through fallback policy; failed critical Hanamori/menu assets keep the preloader covered and show a retry action.

- [ ] **Step 4: Implement `GamePreloader`**

Render lunar sigil / `月`, Kintsugi fissure progression, and localized `RECOVERING MEMORIES`. Do not show a synthetic percent. A label such as `MEMORY FRAGMENTS 6 / 9` must map directly to `loaded` and `total`.

- [ ] **Step 5: Implement `SceneTransitionDirector`**

GSAP lifecycle: exit 350–500ms → full veil → destination state commit → await destination critical assets → enter 600–800ms → unlock. Reduced motion uses short opacity transitions but the same covered commit semantics.

- [ ] **Step 6: Finish Boot/Menu gamefeel**

Center the menu composition. Reuse shared `JpRevealText` for `記憶 → REMEMBER`; thesis also resolves from Japanese into PT/EN. Boot accepts pointer/touch, Enter, Space, and printable non-modifier keys. Idle prompt breathes; primary CTA floats only 2–4px on Y. Use shared three-bar `SoundToggle`.

- [ ] **Step 7: Route all Boot/Menu/first-memory changes through director**

`RememberExperience` must request transitions instead of directly swapping scene state. Interaction remains disabled until `entering` completes.

- [ ] **Step 8: GREEN + full gate + localhost checkpoint + commit**

Local validation: route load has no hard cut; preloader progress is truthful; Boot resolves into Menu; Menu → Hanamori is covered and cinematic.
Commit: `feat: add REMEMBER transition and preload director`

---

### Task 3: Continue/New Game, Pause, and Memory Archive

**Files:** save store integration, menu scene, pause menu, archive policy/tests, archive UI, shell, reducer, audio, `RememberExperience`, CSS.

**Interfaces:**

```ts
export const deriveArchiveProgress = (completed: MemoryId[]) =>
  Math.min(100, new Set(completed).size * 20);

export type ArchiveRecordState = "RESTORED" | "UNSTABLE" | "UNKNOWN" | "LOCKED";
```

- [ ] **Step 1: RED archive/menu policy tests**

Test: no save → New Memory only; incomplete save → Continue primary + actual current memory/progress; complete save → Revisit Memories + New Game; archive progress is 0/20/40/60/80/100 from completed memories; AKR-001 hidden until `discoveredAkariRecord`.

- [ ] **Step 2: Implement local save store integration**

Autosave only on new game, stage entry, deterministic fragment restore, puzzle completion/result, interlude completion, AKR-001 unlock, epilogue entry, game completion, Return to Title, and established Restart Memory state. No pointer-move writes.

- [ ] **Step 3: Implement New Game confirmation and Continue hydration**

Existing save is not deleted until explicit `BEGIN AGAIN?` confirmation. Continue hydrates current logical stage; standard-memory snapped fragment ids may resume while free-floating fragments re-scatter.

- [ ] **Step 4: Implement Pause**

ESC and a touch/pointer control toggle Pause only in puzzles and interactive interludes. Pause disables drag, freezes gameplay timers/cooldowns and gameplay-critical GSAP timelines, and ducks/pauses phase audio. Focus is trapped in Pause and restored when closed.

- [ ] **Step 5: Implement Memory Archive**

Use real archive background, sigil and AKR-001 assets. Render five record rows/marks as ritual records rather than generic cards. Before completion records cannot navigate directly to stages; after `gameCompleted`, restored records invoke replay mode.

- [ ] **Step 6: GREEN + full gate + localhost checkpoint + commit**

Validate browser refresh, corrupted save fallback, Continue, destructive New Game confirmation, Pause freeze, Return to Title save, Archive lock state.
Commit: `feat: add REMEMBER saves pause and archive`

---

### Task 4: Standard-memory scatter, ghost seams, Hanamori onboarding, and timers

**Files:** scatter layout/tests, ghost seams, Hanamori guidance policy/tests, `memory-puzzle.tsx`, `memory-fragment.tsx`, `restore-scene.tsx`, reducer/runtime timing, CSS.

**Interfaces:**

```ts
export type ScatterPoint = { x: number; y: number; rotation: number };
export const createScatterLayout = (
  memoryId: MemoryId,
  fragmentIds: string[],
  seed: number,
  viewport: { width: number; height: number; mobile: boolean },
): Record<string, ScatterPoint>;
```

- [ ] **Step 1: RED deterministic scatter tests**

Same seed must return identical layout; different seed must change at least one piece; no standard-memory piece may start within its snap threshold; all coordinates stay inside safe zones; mobile layout does not reuse compressed desktop coordinates. Rotation ranges: Hanamori 8–15°, Mizukyo 12–20°, Kurogane 16–28°.

- [ ] **Step 2: Implement seeded scatter**

Use a tiny deterministic PRNG local to the module. Scatter into peripheral zones and reject candidates that overlap their own destination or reserved HUD bounds. Seed is created at New Game/restart and remains stable for the active puzzle session.

- [ ] **Step 3: RED Hanamori guidance tests**

First idle hint at 5s, max two repeats, ≥8s between repeats, onboarding ends permanently after first successful snap in that run.

- [ ] **Step 4: Implement ghost seams and guidance**

Ghost seams are low-opacity neutral/lunar fracture lines, not bright gold. Hanamori 10–15% base opacity; Mizukyo lower; Kurogane mostly interaction/hint-driven. Dragging a fragment can breathe only its related seam. Final gold `KintsugiSeams` remains restoration-only.

- [ ] **Step 5: Add runtime memory timer policy**

Elapsed gameplay time increments only while stage is active, unpaused and not inside blocking transition/restoration-result states. Persist elapsed time only on autosave events.

- [ ] **Step 6: Preserve original mechanics while switching initial positions**

Do not alter snap math, pointer capture, keyboard restore parity or restoration timeline. This task changes starting placement/guidance, not solver correctness.

- [ ] **Step 7: GREEN + full gate + localhost checkpoint + commit**

Validate all three original memories manually and confirm pieces are visibly scattered far from their destinations.
Commit: `feat: deepen REMEMBER standard puzzle guidance`

---

### Task 5: Interlude I — Unknown Signature

**Files:** `interlude-01-scene.tsx`, localized copy, reducer/stage router, asset manifest, audio hook, CSS.

**Interfaces:**

```ts
export const INTERLUDE_01_TRACE_IDS = ["trace-a", "trace-b", "trace-c", "trace-d"] as const;
```

- [ ] **Step 1: Add reducer/progression RED for Interlude I**

Mizukyo completion must advance to `interlude-01`; exactly four unique trace discoveries unlock the final copy/Continue; completing interlude autosaves and advances to Kurogane.

- [ ] **Step 2: Implement four accessible traces**

Pointer hover/focus/tap and keyboard focus reveal the same trace. Track unique discoveries by id, never by hover count.

- [ ] **Step 3: Implement narrative ending**

Sequence: `UNKNOWN MEMORY SIGNATURE` → localized `Você não está restaurando lugares.` → `Está seguindo alguém.`. Do not expose Akari or AKR-001.

- [ ] **Step 4: Route transitions and pause semantics**

Interlude is interactive, so ESC Pause applies. Timed copy progression pauses safely. Stage transition uses `SceneTransitionDirector`.

- [ ] **Step 5: GREEN + full gate + localhost checkpoint + commit**

Commit: `feat: add REMEMBER unknown-signature interlude`

---

### Task 6: Yumegakure — False Memory

**Files:** false-memory policy/test/stage, memory definitions, shared fragment state API, result runtime counters, audio hook, CSS.

**Interfaces:**

```ts
export type TruthState = "true" | "false";
export type FalseMemoryState = {
  placedTrueIds: string[];
  placedFalseIds: string[];
  countedFalseIds: string[];
  unstable: boolean;
};

export const canCompleteFalseMemory = (state: FalseMemoryState, requiredTrueIds: string[]) =>
  requiredTrueIds.every((id) => state.placedTrueIds.includes(id)) && state.placedFalseIds.length === 0;
```

- [ ] **Step 1: RED false-memory policy tests**

Verify 7 true + 2 false definition, false fragment can occupy its compatible target, any placed false prevents completion, unstable becomes true, removing false restores solvability, and each false fragment increments `falseFragments` only once per run.

- [ ] **Step 2: Implement pure policy**

Keep truth metadata outside generic pointer math. `countedFalseIds` prevents repeated penalties when the same false fragment is removed/reinserted.

- [ ] **Step 3: Extend shared fragment stage reversibly**

Yumegakure may un-snap an already placed fragment and return it to draggable state. Do this through explicit shared fragment-state callbacks; do not fork Pointer Events implementation.

- [ ] **Step 4: Implement unstable visual feedback**

When a plausible false composition is stabilized, raise the real distortion overlay, shift presence/lighting subtly and play semantic `false-memory` audio hook if an appropriate layer exists. No failure modal or reset.

- [ ] **Step 5: Gate normal Kintsugi on truthful solution**

Only 7 true fragments correctly placed and zero false placements may dispatch final restoration. Then reuse the existing `MemoryRestorationEffect` unchanged for the climax.

- [ ] **Step 6: GREEN + full gate + localhost checkpoint + commit**

Commit: `feat: add Yumegakure false-memory mechanic`

---

### Task 7: Gekkai — Overlapping Realities and Lunar Focus

**Files:** lunar-focus policy/test/stage, memory definitions, pause integration, audio controller, CSS.

**Interfaces:**

```ts
export type LunarFocusState =
  | { status: "ready" }
  | { status: "active"; remainingMs: number }
  | { status: "cooldown"; remainingMs: number };

export const LUNAR_FOCUS_ACTIVE_MS = 3000;
export const LUNAR_FOCUS_COOLDOWN_MS = 6000;
```

- [ ] **Step 1: RED Lunar Focus tests**

Ready → activate → exactly 3000ms active → exactly 6000ms cooldown → ready. Pause tick with `paused=true` must not reduce either timer. Activation during active/cooldown is rejected.

- [ ] **Step 2: RED reality-snap policy tests**

Gekkai has 8 fragments. Valid snap finalizes only when the fragment's authentic reality is current/legible; incorrect-reality attempt returns to previous position and increments mistakes once.

- [ ] **Step 3: Implement timer/reality policy as pure functions**

Use elapsed delta updates owned by stage runtime, not chained `setTimeout`s. Pause passes zero effective delta.

- [ ] **Step 4: Implement overlapping stage visuals**

Crossfade fragment imagery between real State A/B assets on staggered slow cycles without moving geometry. Lunar Focus freezes oscillation, resolves each fragment to authentic state, shows focus overlay, reduces chroma, slows particles and modifies audio bus.

- [ ] **Step 5: Add input parity**

Space activates Focus on desktop unless another control consumes it; touch/mobile gets an explicit button. Both call the same action. Reduced motion uses slower discrete opacity swaps, not continuous oscillation.

- [ ] **Step 6: GREEN + full gate + localhost checkpoint + commit**

Commit: `feat: add Gekkai overlapping-reality mechanic`

---

### Task 8: Memory results, resonance, Interlude II, and AKR-001 discovery

**Files:** result policy/test/screen, archive policy, Interlude II, reducer/save, audio, stage router, CSS.

**Interfaces:**

```ts
export const calculateIntegrity = ({
  mistakes,
  falseFragments,
  completionTime,
  parSeconds,
}: {
  mistakes: number;
  falseFragments: number;
  completionTime: number;
  parSeconds: number;
}) => Math.max(0, Math.min(100,
  100 - mistakes * 3 - falseFragments * 8 - Math.floor(Math.max(0, completionTime - parSeconds) / 30) * 2,
));

export const resonanceForIntegrity = (integrity: number) =>
  integrity >= 95 ? "S" : integrity >= 85 ? "A" : integrity >= 70 ? "B" : "C";
```

- [ ] **Step 1: RED result-policy tests**

Cover boundaries 95/94/85/84/70/69, clamp at 0/100, false-fragment penalty, 30-second-over-par interval penalty, and no time penalty before par.

- [ ] **Step 2: Implement result calculation and presentation**

Show applicable fields only. Hanamori/Mizukyo/Kurogane omit false fragments. Any grade continues narrative. Save completed `MemoryResult` before Continue unlocks.

- [ ] **Step 3: RED AKR-001 policy test**

Five completed memories derive 100% archive progress, but `remember-akr001-signature.png` remains hidden until Interlude II dispatches discovery. Only then `discoveredAkariRecord=true` persists.

- [ ] **Step 4: Implement Interlude II**

Use real memory-network, archive sigil, AKR signature and signature-found burst assets. Sequence: `SIGNATURE RECOVERY 100%` → `MEMORY SIGNATURE FOUND` → `AKR-001` → `ACCESSING RECORD...`. Continue transitions to Akari Reveal.

- [ ] **Step 5: GREEN + full gate + localhost checkpoint + commit**

Commit: `feat: add REMEMBER resonance and AKR-001 reveal`

---

### Task 9: Akari Reveal, Epilogue, Credits, game completion, and replay

**Files:** memory reveal scene, epilogue, credits, stage router, save/reducer, asset manifest, audio, archive replay wiring, CSS.

**Interfaces:**

```ts
export type ReplayRequest = { memoryId: MemoryId; returnTo: "archive" };
```

Replay is available only when `gameCompleted === true`; replay results may replace that memory's result only after successful completion, but must not reset narrative completion flags.

- [ ] **Step 1: RED final-flow tests**

Interlude II → Akari Reveal → Epilogue → Credits. `gameCompleted` remains false before Credits entry and becomes true on Credits entry. Completed game menu policy exposes Revisit Memories and New Game, not Continue.

- [ ] **Step 2: Implement Akari Reveal**

Reuse `memory-reveal-scene.tsx` as authoritative scene. Covered stage → converging memory particles → Kintsugi fissure → Akari image → `MEMORY RECORD / AKR-001 / STATUS RESTORED / AKARI / Então você se lembrou.` (localized). No early interaction.

- [ ] **Step 3: Implement Epilogue**

Lazy-load `remember-epilogue-eclipse.mp4` near Akari. Overlay localized two-line copy. Allow Continue only after minimum readability interval; reduced-motion/Save-Data uses stable static treatment.

- [ ] **Step 4: Implement Credits**

Lazy-load credits loop near Epilogue, never at route boot. Show final title/logo/CTA. Persist `gameCompleted: true` on entry before interaction. CTA returns to `/`; wishlist appears only if a real destination exists.

- [ ] **Step 5: Implement post-game replay**

Archive record click creates `ReplayRequest`, starts selected memory through normal transition/preloader path, and returns to Archive after result. Replay cannot mutate `currentStage` narrative completion back to an earlier stage.

- [ ] **Step 6: GREEN + full gate + localhost checkpoint + commit**

Commit: `feat: complete REMEMBER prologue finale and replay`

---

### Task 10: Responsive, reduced-motion, performance, full regression hardening

**Files:** media/performance helpers as needed under `system`, existing REMEMBER CSS, asset manifests, all relevant tests, `package.json`.

**Interfaces:**

```ts
export type RememberMediaPolicy = {
  reducedMotion: boolean;
  saveData: boolean;
  mobile: boolean;
  allowHeavyVideo: boolean;
  allowDistortion: boolean;
};
```

- [ ] **Step 1: Add pure media-policy tests**

Reduced motion disables long shake/refraction/continuous reality oscillation. Save-Data disables heavy video and optional mobile transition. Mobile reduces particles/distortion but never removes required interaction or information.

- [ ] **Step 2: Audit stage teardown**

Every stage cleanup removes listeners, RAF/timers, GSAP contexts and audio transient references. Leaving a memory must not leave its puzzle mounted behind the next scene.

- [ ] **Step 3: Audit touch and keyboard end-to-end**

Verify Pause button, Lunar Focus button, fragment dragging, focusable interlude traces, Enter confirmations, Tab navigation, Archive replay and focus restoration. Hit targets remain usable under safe-area constraints.

- [ ] **Step 4: Audit asset loading**

Confirm initial network path excludes Yumegakure, Gekkai and final videos. Confirm next-stage preload is one stage ahead and transition veil handles delayed decode without blank content.

- [ ] **Step 5: Run full original-regression matrix**

Manually validate Hanamori, Mizukyo, Kurogane: drag/drop, snap, keyboard restore, last shard, Kintsugi, restored image, residual scar, result, Continue, pause/resume, locale/mute persistence and responsive behavior.

- [ ] **Step 6: Run the complete gate from a fresh head**

```bash
npm run test:hero
npm run test:remember
npm run format:check
npm run lint
npm run build
```

Expected: all commands exit 0. Existing unrelated warnings may remain only if they were already present on baseline and are documented in the PR.

- [ ] **Step 7: Final PR review and localhost validation note**

Update the draft PR body with implemented slices, RED→GREEN evidence, CI run ids, known pre-existing warnings, exact localhost validation checklist, and explicit instruction not to merge until visual approval.

Commit: `chore: harden REMEMBER prologue experience`

---

## Implementation / Review Discipline

Each Task is a review boundary. For every task:

1. write the named RED regression first;
2. run `test:remember` and confirm the failure is the new contract rather than an unrelated regression;
3. implement only the slice required to turn that contract GREEN;
4. run the full gate before declaring the task complete;
5. review the diff against this spec before beginning the next task;
6. keep the PR draft until the user validates localhost visually.

If `main` moves while implementation is in progress, do not silently rebase assumptions. Inspect the new `main`; if the active PR has been manually merged, stop using that branch and create the next implementation branch from the new `main`.

## Final Acceptance Checklist

The implementation is ready for visual approval only when all of the following are demonstrably true:

- preloader reports real readiness and transitions into Boot without a hard cut;
- every major screen/stage change is covered by the Transition Director;
- menu is centered and `記憶 → REMEMBER` resolves cinematically;
- Continue/New Game/Revisit behavior matches save state;
- Pause freezes puzzle/timers/cooldowns and Return to Title saves safely;
- Archive reaches 20/40/60/80/100 from completed memories and hides AKR-001 until Interlude II;
- Hanamori teaches the mechanic once, with ghost seams distinct from final Kintsugi;
- Hanamori/Mizukyo/Kurogane pieces begin substantially scattered rather than near solved positions;
- Interlude I exposes four accessible traces and never names Akari;
- Yumegakure uses two plausible false fragments and allows correction without punitive reset;
- Gekkai uses eight overlapping-reality fragments and a 3s/6s Lunar Focus cycle with pause-safe timing;
- result/resonance logic is deterministic and non-blocking;
- Interlude II is the sole initial AKR-001 discovery event;
- Akari Reveal, Epilogue and Credits render instead of falling through to an empty shell;
- Credits entry persists game completion before post-game navigation;
- post-game Archive replay cannot break narrative completion;
- heavy final videos are not eagerly loaded;
- keyboard, touch, reduced-motion and Save-Data paths remain functional;
- original three-memory interaction/restoration regressions remain GREEN;
- `test:hero`, `test:remember`, `format:check`, `lint`, and `build` are GREEN.
