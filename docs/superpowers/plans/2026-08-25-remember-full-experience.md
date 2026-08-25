# TSUKIHARA — REMEMBER Full Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the existing `/remember` vertical slice into the complete bilingual minigame: premium boot/menu, three increasingly difficult memories, reusable Memory Restored VFX, Akari reveal, Eclipse epilogue, and credits/CTA.

**Architecture:** Keep `/remember` isolated from the landing page. Replace the Hanamori-specific progression with a reducer-driven game flow and a data-driven `MemoryDefinition` model. A generic `MemoryPuzzle` owns fragment interaction, while `MemoryRestorationEffect` owns the cancelable GSAP completion ritual. Audio, localization, media loading, and scene progression remain route-local.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, GSAP 3.13, `@paper-design/shaders-react`, CSS, native `HTMLAudioElement`, native `node:test` runner.

**Spec:** `docs/superpowers/specs/2026-08-25-remember-full-experience-design.md` plus `docs/superpowers/specs/2026-08-25-remember-full-experience-asset-amendment.md`.

## Global Constraints

- Preserve the currently validated Hanamori drag/snap feel.
- Official player flow: `Menu → Hanamori → Mizukyo → Kurogane → Akari Reveal → Eclipse Epilogue → Credits / CTA`; technical `boot` precedes menu only for audio unlock.
- Memory difficulty: Hanamori 5 fragments, Mizukyo 7, Kurogane 9; no timers, punitive resets, scoring, inventory, leaderboards, or failure state.
- Completion flow: `last shard → Kintsugi → particles → pulse → completion burst → restored image → mr06 residual scar → completion copy`.
- `mr06-restored-scar-overlay.png` is the canonical residual-scar layer.
- Default locale is PT; PT/EN changes must not reset progress.
- Mobile keeps all fragment counts but compresses starting offsets and uses ≥42px effective snap radius.
- Reduced motion removes shake/refraction/long propagation but preserves all information and progression.
- Do not eagerly preload epilogue or credits video on route entry; credits video is ~56MB and must have a static fallback.
- Existing quality gate remains: `npm run test:hero`, `npm run test:remember`, `npm run format:check`, `npm run lint`, `npm run build`.

---

## File Structure

### State/content
- Modify `src/components/remember/state/remember-state.ts` — canonical game/scene/restoration state and actions.
- Modify `src/components/remember/state/remember-reducer.ts` — deterministic progression.
- Modify `src/components/remember/state/remember-reducer.test.mjs` — progression regression coverage.
- Create `src/components/remember/content/remember-locales.ts` — PT/EN UI and narrative copy.
- Modify `src/components/remember/content/remember-assets.ts` — complete image/video asset map.
- Create `src/components/remember/content/memory-definitions.ts` — Hanamori/Mizukyo/Kurogane definitions and geometry.
- Create `src/components/remember/content/memory-definitions.test.mjs` — counts/order/snap invariants.

### Puzzle/restoration
- Modify `src/components/remember/restore/restore-geometry.ts` — keep reusable geometry types and Hanamori exports during migration.
- Modify `src/components/remember/restore/memory-fragment.tsx` — use memory viewBox instead of `HANAMORI_VIEWBOX`.
- Replace Hanamori-specific composition with `src/components/remember/restore/memory-puzzle.tsx`.
- Modify `src/components/remember/restore/kintsugi-seams.tsx` — accept seam definitions/viewBox and restored IDs.
- Create `src/components/remember/restore/restoration-timeline.ts` — pure phase/timing contract.
- Create `src/components/remember/restore/restoration-timeline.test.mjs` — phase ordering/timing tests.
- Create `src/components/remember/restore/memory-restoration-effect.tsx` — GSAP microclimax/VFX owner.

### Scenes/shell
- Replace `EntryScene` usage with `BootScene` and `MenuScene`.
- Refactor `RestoreScene` into a generic `MemoryScene`.
- Create `src/components/remember/scenes/akari-reveal-scene.tsx`.
- Create `src/components/remember/scenes/epilogue-scene.tsx`.
- Create `src/components/remember/scenes/credits-scene.tsx`.
- Modify `src/components/remember/remember-shell.tsx` — locale/sound/exit HUD and three-memory progress.
- Modify `src/components/remember/remember-experience.tsx` — scene orchestration, preloading and audio transitions.

### Audio/system/style
- Modify `src/components/remember/audio/use-remember-audio.ts` — `unlockMenu`, `startMemory`, `playPieceComplete`, `playKintsugi`, `playRestored`, `enterAkariReveal`, `enterCredits`.
- Modify `src/components/remember/system/remember-analytics.ts` — expanded provider-agnostic event union.
- Create `src/components/remember/system/remember-media.ts` — save-data/mobile/reduced-motion media policy helpers.
- Create `src/components/remember/system/remember-debug.tsx` — dev-only `?memoryDebug=true` controls.
- Modify `src/app/remember/remember.css` and `remember-refinement.css` — boot/menu/HUD/puzzles/VFX/Akari/video/credits responsive styling.

---

### Task 1: Game state, localization, and memory definitions

**Files:**
- Modify: `src/components/remember/state/remember-state.ts`
- Modify: `src/components/remember/state/remember-reducer.ts`
- Modify: `src/components/remember/state/remember-reducer.test.mjs`
- Create: `src/components/remember/content/remember-locales.ts`
- Modify: `src/components/remember/content/remember-assets.ts`
- Create: `src/components/remember/content/memory-definitions.ts`
- Create: `src/components/remember/content/memory-definitions.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `RememberScene = "boot" | "menu" | "memory" | "akari-reveal" | "epilogue" | "credits"`.
- Produces `RestorationPhase = "idle" | "last-piece" | "kintsugi" | "pulse" | "restoring" | "revealing" | "restored"`.
- Produces `MemoryId = "hanamori" | "mizukyo" | "kurogane"` and `memoryDefinitions` ordered `[hanamori, mizukyo, kurogane]`.
- `MemoryDefinition` includes `id`, `index`, `title`, `titleJp`, `viewBox`, `brokenAsset`, `restoredAsset`, `fragments`, `seams`, `completionCopy`, and `palette`.

- [ ] **Step 1: Rewrite reducer tests first**

Cover these behaviors with real reducer calls:

```js
test("boot unlock enters menu without starting gameplay", () => {
  const state = rememberReducer(initialRememberState, { type: "UNLOCK_MENU" });
  assert.equal(state.scene, "menu");
  assert.equal(state.activeMemoryIndex, 0);
});

test("three memories advance only after stable restoration", () => {
  let state = rememberReducer({ ...initialRememberState, scene: "menu" }, { type: "BEGIN_GAME" });
  assert.equal(state.scene, "memory");
  assert.equal(state.activeMemoryIndex, 0);

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "hanamori" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.activeMemoryIndex, 1);
  assert.deepEqual(state.restoredFragmentIds, []);

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "mizukyo" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.activeMemoryIndex, 2);

  state = rememberReducer(state, { type: "MARK_MEMORY_RESTORED", memoryId: "kurogane" });
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "akari-reveal");
});

test("locale and mute survive progression", () => {
  let state = rememberReducer(initialRememberState, { type: "SET_LOCALE", locale: "en" });
  state = rememberReducer(state, { type: "SET_MUTED", muted: true });
  state = rememberReducer(state, { type: "UNLOCK_MENU" });
  state = rememberReducer(state, { type: "BEGIN_GAME" });
  assert.equal(state.locale, "en");
  assert.equal(state.muted, true);
});

test("final narrative progresses Akari to epilogue to credits", () => {
  let state = { ...initialRememberState, scene: "akari-reveal" };
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "epilogue");
  state = rememberReducer(state, { type: "CONTINUE" });
  assert.equal(state.scene, "credits");
});
```

- [ ] **Step 2: Run RED**

Run: `npm run test:remember`
Expected: reducer tests fail because new scene/action model and memory definitions do not exist.

- [ ] **Step 3: Implement minimal state model and reducer**

Use actions:

```ts
type RememberAction =
  | { type: "UNLOCK_MENU" }
  | { type: "BEGIN_GAME" }
  | { type: "RESTORE_FRAGMENT"; fragmentId: string; totalFragments: number }
  | { type: "SET_RESTORATION_PHASE"; phase: RestorationPhase }
  | { type: "MARK_MEMORY_RESTORED"; memoryId: MemoryId }
  | { type: "CONTINUE" }
  | { type: "SET_LOCALE"; locale: RememberLocale }
  | { type: "SET_MUTED"; muted: boolean }
  | { type: "RESTART" };
```

`RESTART` resets narrative/progress but preserves locale and muted preference.

- [ ] **Step 4: Add memory-definition tests and run RED**

```js
test("memory definitions are ordered and increase difficulty", () => {
  assert.deepEqual(memoryDefinitions.map((memory) => memory.id), ["hanamori", "mizukyo", "kurogane"]);
  assert.deepEqual(memoryDefinitions.map((memory) => memory.fragments.length), [5, 7, 9]);
  assert.ok(memoryDefinitions[0].snapRatio > memoryDefinitions[1].snapRatio);
  assert.ok(memoryDefinitions[1].snapRatio > memoryDefinitions[2].snapRatio);
  for (const memory of memoryDefinitions) assert.ok(memory.seams.length > 0);
});
```

- [ ] **Step 5: Implement definitions and localized copy**

Use 1000×625 viewBoxes for all three memories so current SVG/image composition remains reusable. Keep Hanamori's five current paths unchanged. Define Mizukyo as seven organic vertical/radial pieces with `snapRatio: 0.082`, and Kurogane as nine more geometric pieces with `snapRatio: 0.072`. Fragment-specific `snapRadius` may vary ±0.006 around the memory ratio.

Localized core copy:

```ts
pt: {
  boot: "CLIQUE PARA LEMBRAR",
  begin: "INICIAR",
  continue: "CONTINUAR",
  restored: "RESTAURADA",
  restoreInstruction: "Restaure o que permanece.",
  epilogue: "As memórias voltaram. Tsukihara ainda está esquecendo.",
  creditsTitle: "LEMBRE-SE DO QUE RESTA.",
  creditsCta: "CONTINUAR PARA TSUKIHARA",
}
en: {
  boot: "PRESS ANYWHERE TO REMEMBER",
  begin: "BEGIN",
  continue: "CONTINUE",
  restored: "RESTORED",
  restoreInstruction: "Restore what remains.",
  epilogue: "The memories returned. Tsukihara is still forgetting.",
  creditsTitle: "REMEMBER WHAT REMAINS.",
  creditsCta: "CONTINUE TO TSUKIHARA",
}
```

Memory completion lines:
- Hanamori PT: `Alguém ainda se lembra deste lugar.` / EN existing line.
- Mizukyo PT: `A água devolve o que tentou esconder.` / EN: `The water returns what it tried to hide.`
- Kurogane PT: `Até o ferro se lembra do que foi perdido.` / EN: `Even iron remembers what was lost.`

- [ ] **Step 6: GREEN and commit**

Run: `npm run test:remember`
Expected: all reducer, math, and memory-definition tests pass.

Commit: `feat: model REMEMBER full game progression`

---

### Task 2: Boot/menu, locale persistence, and menu audio fix

**Files:**
- Create: `src/components/remember/scenes/boot-scene.tsx`
- Create: `src/components/remember/scenes/menu-scene.tsx`
- Create: `src/components/remember/scenes/menu-backdrop.tsx`
- Modify: `src/components/remember/audio/use-remember-audio.ts`
- Modify: `src/components/remember/remember-shell.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- Audio controller exposes `unlockMenu`, `startMemory`, `playPieceComplete`, `playKintsugi`, `playRestored`, `enterAkariReveal`, `enterCredits`, `setMuted`, `stopAll`.
- `BootScene.onUnlock(): Promise<void>`; first pointer/Enter/Space gesture is the only autoplay unlock action.
- Locale persistence key: `tsukihara:remember:locale`.

- [ ] **Step 1: Add/verify state RED for `boot → menu → memory`**

Run only reducer suite after Task 1; this behavior must already be protected before UI code is introduced.

- [ ] **Step 2: Implement audio transition API**

`unlockMenu()` starts menu track and does not fade it. `startMemory()` crossfades menu → phase. `enterCredits()` crossfades phase/other base track back to menu motif. `playRestored()` plays harp; `playPieceComplete()` aliases/caps the Kintsugi transient rather than adding generic click audio.

- [ ] **Step 3: Implement Boot and Menu**

Boot uses `remember-menu-background.png` and a quiet `LensDistortion` preset via dynamic `@paper-design/shaders-react` import. Keep content layer outside shader. Reduced-motion/touch uses static image plus a very slow CSS scale drift only when motion is allowed.

Menu renders `TSUKIHARA`, `REMEMBER`, BEGIN, PT/EN, sound, and exit. No fake save/continue/settings system.

- [ ] **Step 4: Persist locale without resetting game state**

On mount, read `localStorage.getItem("tsukihara:remember:locale")`; dispatch only valid `pt|en`. On change, persist. Do not access localStorage during server render.

- [ ] **Step 5: Reuse landing sound-toggle visual language**

REMEMBER sound control uses label + one animated line indicator equivalent to `.sound-toggle`, not the current bespoke three-bar stack. Keep accessible `aria-pressed` and localized text.

- [ ] **Step 6: Run targeted gates and commit**

Run: `npm run test:remember && npm run lint`
Commit: `feat: add REMEMBER boot menu and audio unlock`

---

### Task 3: Generic memory puzzle and 5→7→9 difficulty curve

**Files:**
- Create: `src/components/remember/restore/memory-puzzle.tsx`
- Modify: `src/components/remember/restore/memory-fragment.tsx`
- Modify: `src/components/remember/restore/kintsugi-seams.tsx`
- Modify: `src/components/remember/scenes/restore-scene.tsx` (rename/export as `MemoryScene` or replace file with generic implementation)
- Remove usage of `hanamori-memory.tsx` from orchestration; file may remain temporarily until GREEN, then delete if unused.

**Interfaces:**
- `MemoryPuzzle({ memory, restoredFragmentIds, reducedMotion, interactive, onRestore, restorationPhase })`.
- `MemoryFragment` receives `viewBox`, uses `definition.snapRadius`, and preserves ≥42px mobile / ≥36px desktop minimum.
- `KintsugiSeams` receives `viewBox`, `seams`, `restoredFragmentIds`, and completion/phase data.

- [ ] **Step 1: Use memory-definition RED as contract**

Run: `npm run test:remember`
Expected: definitions remain green; UI migration must not change counts/order/snap invariants.

- [ ] **Step 2: Generalize `MemoryFragment`**

Replace all `HANAMORI_VIEWBOX` references with passed `viewBox`. Prefix clip IDs with memory ID to prevent duplicate SVG IDs across transitions.

- [ ] **Step 3: Implement generic `MemoryPuzzle`**

Render broken ghost, fragment layers using the broken asset, generic seams, restored image, and route-local atmosphere. Hanamori may retain sakura/ruin foregrounds; Mizukyo/Kurogane use restrained color/gradient atmosphere rather than inventing new assets.

- [ ] **Step 4: Implement generic `MemoryScene` HUD**

Top-left: `MEMORY 0N / REALM`, Japanese title. Progress shows `FRAGMENTS 0X / 0Y`. During `last-piece` through `revealing`, HUD and instructions recede. At `restored`, localized CONTINUE appears.

- [ ] **Step 5: Verify behavior and commit**

Run: `npm run test:remember && npm run lint`
Manually validate in localhost that Hanamori feels unchanged before proceeding.
Commit: `feat: generalize REMEMBER memory puzzles`

---

### Task 4: Reusable Memory Restored microclimax

**Files:**
- Create: `src/components/remember/restore/restoration-timeline.ts`
- Create: `src/components/remember/restore/restoration-timeline.test.mjs`
- Create: `src/components/remember/restore/memory-restoration-effect.tsx`
- Modify: `package.json` to include timeline test in `test:remember`
- Modify: `src/components/remember/restore/memory-puzzle.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- `RESTORATION_PHASES = ["last-piece","kintsugi","pulse","restoring","revealing","restored"]`.
- `getRestorationSchedule(reducedMotion)` returns ordered `{ phase, at }[]` using desktop targets `0, .15, .9, 1.0, 1.5, 2.8` seconds and reduced-motion targets `0, .08, .18, .3, .55, 1.4`.
- `MemoryRestorationEffect` receives `active`, `memory`, `originPoint`, `reducedMotion`, `onPhaseChange`, `onComplete`.

- [ ] **Step 1: Write timeline RED**

```js
test("restoration phases stay ordered and end restored", () => {
  const schedule = getRestorationSchedule(false);
  assert.deepEqual(schedule.map((beat) => beat.phase), ["last-piece","kintsugi","pulse","restoring","revealing","restored"]);
  assert.ok(schedule.every((beat, index) => index === 0 || beat.at > schedule[index - 1].at));
  assert.equal(schedule.at(-1).at, 2.8);
});

test("reduced motion finishes faster without changing phase semantics", () => {
  assert.ok(getRestorationSchedule(true).at(-1).at < getRestorationSchedule(false).at(-1).at);
});
```

- [ ] **Step 2: Run RED, implement helper, run GREEN**

Run: `npm run test:remember` before and after helper implementation.

- [ ] **Step 3: Implement one cancelable GSAP timeline**

Timeline sequence:
1. settle/shake memory stage max 1–3px;
2. fade/scale `mr02-memory-particles.png` toward center;
3. propagate SVG seam paths from last-shard origin; overlay `mr01-kintsugi-crack-overlay.png` as organic glow texture;
4. expand `mr03-memory-pulse-ring.png`; apply subtle stage scale/filter/refraction cue ≤400ms;
5. restore saturation/brightness/blur and consolidate continuous restored image;
6. bloom `remember-completion-burst.png` briefly;
7. reveal `mr06-restored-scar-overlay.png` at restrained opacity, hold 700–1200ms, then reduce to subtle residue;
8. reveal `MEMORY / 0N`, localized RESTORED, realm title, completion line, then CONTINUE.

Use GSAP context/timeline cleanup on unmount/restart. No scattered scene timers.

- [ ] **Step 4: Connect audio and reducer phase updates**

Kintsugi start calls `playKintsugi`; restoration/reveal calls `playRestored` once. `onComplete` dispatches `MARK_MEMORY_RESTORED` exactly once.

- [ ] **Step 5: Commit**

Run: `npm run test:remember && npm run lint`
Commit: `feat: add REMEMBER restoration climax`

---

### Task 5: Orchestrate all three memories and progressive preloading

**Files:**
- Modify: `src/components/remember/remember-experience.tsx`
- Create: `src/components/remember/system/remember-media.ts`
- Modify: `src/components/remember/system/remember-analytics.ts`
- Modify: `src/components/remember/state/remember-reducer.test.mjs`

**Interfaces:**
- `shouldUseHeavyVideo({ reducedMotion, saveData, viewportWidth }): boolean` returns false for reduced motion, save-data, or narrow/mobile fallback.
- Experience derives active memory strictly from `memoryDefinitions[state.activeMemoryIndex]`.

- [ ] **Step 1: Add RED for duplicate completion and settings persistence**

Assert `MARK_MEMORY_RESTORED` is idempotent and `CONTINUE` cannot advance before `restorationPhase === "restored"`.

- [ ] **Step 2: Implement orchestrator**

On BEGIN preload current broken/restored + completion overlays. Once player restores first fragment, preload the next memory pair. After Mizukyo completion preload Akari. Once Kurogane begins, set epilogue video `preload="metadata"` only; do not create credits video element yet.

- [ ] **Step 3: Expand analytics union**

Use events from spec: `remember_boot_started`, `remember_menu_started`, `remember_game_started`, `remember_memory_started`, `remember_fragment_restored`, `remember_memory_restored`, `remember_akari_revealed`, `remember_epilogue_started`, `remember_completed`, `remember_exit`. Keep implementation no-op.

- [ ] **Step 4: GREEN and commit**

Run: `npm run test:remember && npm run lint`
Commit: `feat: orchestrate REMEMBER memory progression`

---

### Task 6: Akari reveal, Eclipse epilogue, and credits/CTA

**Files:**
- Create: `src/components/remember/scenes/akari-reveal-scene.tsx`
- Create: `src/components/remember/scenes/epilogue-scene.tsx`
- Create: `src/components/remember/scenes/credits-scene.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/components/remember/audio/use-remember-audio.ts`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- Each scene receives localized copy and an explicit `onContinue`/CTA callback.
- Epilogue video never owns game audio; it is muted unless a future dedicated soundtrack is intentionally added.
- Credits CTA routes to `/` after stopping REMEMBER audio.

- [ ] **Step 1: Confirm reducer narrative progression tests are RED/GREEN contract**

`akari-reveal → epilogue → credits` is already reducer-protected before scene implementation.

- [ ] **Step 2: Implement Akari reveal**

Use `remember-akari-reveal.png` in a lunar void; fade HUD; animate controlled scale/opacity, Kintsugi trace accents, and localized payoff. Reuse the Akari site thesis in PT/EN rather than generic victory copy. Continue appears only after initial presentation settles.

- [ ] **Step 3: Implement Eclipse epilogue**

Use `remember-epilogue-eclipse.mp4`, `playsInline`, no loop, `preload="metadata"`. Overlay localized line. Reduced motion uses poster-like static menu background treatment instead of forcing video. Allow continue after a readable minimum interval; video `ended` also enables/proceeds to credits.

- [ ] **Step 4: Implement credits**

Use `remember-credits-loop.mp4` only when `shouldUseHeavyVideo` is true; otherwise use menu background. Loop video is muted visual media. Crossfade audio back to menu theme. Render `REMEMBER WHAT REMAINS.` / `LEMBRE-SE DO QUE RESTA.` and CTA to `/`.

- [ ] **Step 5: Commit**

Run: `npm run test:remember && npm run lint`
Commit: `feat: complete REMEMBER narrative ending`

---

### Task 7: Game shell polish, mobile transition, and reduced-motion pass

**Files:**
- Modify: `src/components/remember/remember-shell.tsx`
- Create: `src/components/remember/scenes/memory-transition.tsx`
- Modify: `src/app/remember/remember.css`
- Modify: `src/app/remember/remember-refinement.css`

**Interfaces:**
- Shell receives scene, locale, active memory index, restored count/total, restoration phase, and callbacks.
- `MemoryTransition` may use `remember-mobile-sakura-transition.mp4` only on mobile when heavy motion is allowed; desktop uses DOM/SVG lunar fade.

- [ ] **Step 1: Implement premium HUD visual hierarchy**

Keep ritual layer dominant. Add thin three-memory progression line/dots; hide/recede controls during microclimax and Akari opening beat. No fantasy frames, XP bars, glass cards, health UI, or loot language.

- [ ] **Step 2: Mobile pass**

Safe-area top controls, large touch targets, compressed fragment offsets, no expensive backdrop blur/refraction, fewer VFX layers. Preserve all 5/7/9 fragments.

- [ ] **Step 3: Reduced-motion pass**

Ensure no camera shake, no shader/menu distortion, short broken→restored fade, short scar opacity cue, static epilogue/credits fallback where needed.

- [ ] **Step 4: Commit**

Run: `npm run test:remember && npm run lint`
Commit: `style: polish REMEMBER game shell and responsive flow`

---

### Task 8: Dev debugging and final quality gate

**Files:**
- Create: `src/components/remember/system/remember-debug.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `.prettierignore` only if the new plan/spec docs themselves cause repository-wide formatting noise; never ignore runtime files.

**Interfaces:**
- Dev-only `?memoryDebug=true` panel exposes jump to Hanamori/Mizukyo/Kurogane, restore active memory, replay completion, jump Akari/Epilogue/Credits.
- The panel is impossible to render when `process.env.NODE_ENV === "production"`.

- [ ] **Step 1: Add debug controls behind dev guard**

Use reducer debug actions only if required; otherwise invoke controlled existing actions. Preserve `Shift+R` as reset.

- [ ] **Step 2: Run complete local/CI-equivalent gate**

Run in order:

```bash
npm run test:hero
npm run test:remember
npm run format:check
npm run lint
npm run build
```

Expected: all green, no new warnings/errors attributable to REMEMBER.

- [ ] **Step 3: Open draft PR against `main`**

Title: `feat: expand REMEMBER into full minigame`

PR body must explicitly list:
- boot/menu + menu-audio fix;
- PT/EN;
- Hanamori/Mizukyo/Kurogane 5→7→9;
- Memory Restored VFX asset stack including `mr06`;
- Akari reveal;
- Eclipse epilogue;
- credits/CTA;
- mobile/reduced-motion/media-loading behavior;
- Quality gate status.

Keep PR draft until desktop + mobile localhost visual validation is approved. Do not merge.
