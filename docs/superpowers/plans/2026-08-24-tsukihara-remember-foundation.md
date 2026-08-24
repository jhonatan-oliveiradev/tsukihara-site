# TSUKIHARA — REMEMBER Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first premium vertical slice of `/remember`: fullscreen Entry → Restore Hanamori → drag/snap → Lunar Kintsugi → memory reveal, with dedicated sound design, responsive interaction, keyboard parity, and reduced-motion support.

**Architecture:** `/remember` is an isolated route-local experience that does not mount the landing shell, Lenis, header, or landing ScrollTriggers. A typed reducer owns narrative state and restored fragment ids; DOM/SVG + GSAP own presentation and gesture feedback. Native browser audio manages the supplied music/SFX with route-local fades and cleanup.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, CSS/Tailwind 4 tokens, GSAP 3.13, SVG clip paths, Pointer Events, native HTMLAudioElement, Node 22 test runner.

**Spec:** `docs/superpowers/specs/2026-08-24-tsukihara-remember-design.md`

## Global Constraints

- Implement only `entry → restore → memory-reveal` in this PR.
- Do not mount `ImmersiveExperience`, the landing header, Lenis, or landing ScrollTriggers inside `/remember`.
- Do not add XState, Phaser, PixiJS, Howler, Three/R3F scenes, or another large runtime dependency.
- Audio begins only after an explicit user gesture.
- Use the existing audio files in `/public/remember-experience/sound-effects/`.
- Use Pointer Events and `setPointerCapture` for drag; no physics engine.
- No React state updates on every pointer move.
- Keyboard restoration must reach the same logical state as drag/snap.
- `prefers-reduced-motion` changes presentation only, never narrative progression.
- The route must restore document scroll state and stop audio/timers on exit/unmount.
- No new image is required unless the existing Hanamori assets fail visual validation.
- Tests protect state transitions and snap math, not GSAP frame values or pixel-perfect layout.

---

## File Map

### Route and shell
- Create `src/app/remember/page.tsx` — server route entry.
- Create `src/app/remember/remember.css` — route-local fullscreen, responsive, reduced-motion and accessibility styles.
- Create `src/components/remember/remember-experience.tsx` — reducer composition and scene routing.
- Create `src/components/remember/remember-shell.tsx` — fullscreen frame, exit/mute controls and shared atmospheric decoration.

### State and deterministic logic
- Create `src/components/remember/state/remember-state.ts` — scene/state/action types and initial state.
- Create `src/components/remember/state/remember-reducer.ts` — reducer and reachable transitions.
- Create `src/components/remember/state/remember-reducer.test.mjs` — Node regression suite.
- Create `src/components/remember/restore/restore-math.ts` — pure distance/snap helpers.
- Create `src/components/remember/restore/restore-math.test.mjs` — deterministic snap tests.
- Create `src/components/remember/restore/restore-geometry.ts` — five fragment definitions and seam associations.

### Content and system services
- Create `src/components/remember/content/remember-copy.ts` — approved Foundation copy.
- Create `src/components/remember/content/remember-assets.ts` — asset constants only.
- Create `src/components/remember/system/use-remember-scroll-lock.ts` — document overflow lifecycle.
- Create `src/components/remember/system/use-remember-reduced-motion.ts` — media-query state.
- Create `src/components/remember/system/remember-analytics.ts` — typed no-op event boundary.

### Audio
- Create `src/components/remember/audio/remember-audio.ts` — track paths, volume constants and fade primitive.
- Create `src/components/remember/audio/use-remember-audio.ts` — scene-aware native audio controller.

### Scenes and restore mechanics
- Create `src/components/remember/scenes/entry-scene.tsx` — ritual copy and start gesture.
- Create `src/components/remember/scenes/restore-scene.tsx` — Hanamori stage composition and restore completion handoff.
- Create `src/components/remember/scenes/memory-reveal-scene.tsx` — Hanamori/Guardian/Akari reveal.
- Create `src/components/remember/restore/hanamori-memory.tsx` — source composition, SVG clip-path layer and completed crossfade.
- Create `src/components/remember/restore/memory-fragment.tsx` — pointer/keyboard fragment interaction.
- Create `src/components/remember/restore/kintsugi-seams.tsx` — seam SVG and per-fragment reveal.

### Project gates
- Modify `package.json` — add `test:remember`.
- Modify `.github/workflows/ci.yml` — run `test:remember` before formatting/lint/build.

---

## Task 1: Establish REMEMBER state and snap math with focused tests

**Files:**
- Create: `src/components/remember/state/remember-state.ts`
- Create: `src/components/remember/state/remember-reducer.ts`
- Create: `src/components/remember/state/remember-reducer.test.mjs`
- Create: `src/components/remember/restore/restore-math.ts`
- Create: `src/components/remember/restore/restore-math.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `RememberScene`, `RememberState`, `RememberAction`, `initialRememberState`, `rememberReducer`.
- Produces `distanceBetween`, `isWithinSnapRadius`, `magneticProgress`.
- Later tasks consume `state.scene`, `state.restoredFragmentIds`, `state.muted` and reducer dispatch actions.

- [ ] **Step 1: Write state types and failing reducer test**

`remember-state.ts` must define:

```ts
export type RememberScene =
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

export type RememberState = {
  scene: RememberScene;
  restoredFragmentIds: string[];
  muted: boolean;
  choice: string | null;
};

export type RememberAction =
  | { type: "ENTER" }
  | { type: "RESTORE_FRAGMENT"; fragmentId: string; totalFragments: number }
  | { type: "SET_MUTED"; muted: boolean }
  | { type: "RESTART" };

export const initialRememberState: RememberState = {
  scene: "entry",
  restoredFragmentIds: [],
  muted: false,
  choice: null,
};
```

The test must assert:

```js
assert.equal(initialRememberState.scene, "entry");
assert.equal(rememberReducer(initialRememberState, { type: "ENTER" }).scene, "restore");
```

- [ ] **Step 2: Implement reducer idempotency and completion transition**

Reducer requirements:

```ts
case "RESTORE_FRAGMENT": {
  if (state.scene !== "restore") return state;
  if (state.restoredFragmentIds.includes(action.fragmentId)) return state;

  const restoredFragmentIds = [...state.restoredFragmentIds, action.fragmentId];
  return {
    ...state,
    restoredFragmentIds,
    scene: restoredFragmentIds.length >= action.totalFragments ? "memory-reveal" : state.scene,
  };
}
```

`RESTART` returns a fresh copy of `initialRememberState`. `SET_MUTED` changes only `muted`. Unreachable future scenes are not dispatched in this PR.

- [ ] **Step 3: Add reducer regression cases**

Tests must cover:

```js
// duplicate restore does not increment
// all five unique fragments => memory-reveal
// mute survives ENTER and fragment restores
// RESTART clears fragments and scene
```

- [ ] **Step 4: Write snap-math tests before implementation**

`restore-math.test.mjs` covers:

```js
assert.equal(distanceBetween({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
assert.equal(isWithinSnapRadius({ x: 0, y: 0 }, { x: 5, y: 0 }, 6), true);
assert.equal(isWithinSnapRadius({ x: 0, y: 0 }, { x: 7, y: 0 }, 6), false);
assert.equal(magneticProgress(0, 100), 1);
assert.equal(magneticProgress(100, 100), 0);
```

- [ ] **Step 5: Implement pure restore math**

```ts
export type Point = { x: number; y: number };

export const distanceBetween = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const isWithinSnapRadius = (point: Point, home: Point, radius: number) =>
  distanceBetween(point, home) <= radius;

export const magneticProgress = (distance: number, radius: number) => {
  if (radius <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - distance / radius));
};
```

- [ ] **Step 6: Add executable Node test command**

Modify `package.json`:

```json
"test:remember": "node --experimental-strip-types --test src/components/remember/**/*.test.mjs"
```

- [ ] **Step 7: Run focused tests**

Run:

```bash
npm run test:remember
```

Expected: all reducer and restore-math tests PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json src/components/remember/state src/components/remember/restore/restore-math.ts src/components/remember/restore/restore-math.test.mjs
git commit -m "test: establish REMEMBER state and restore math"
```

---

## Task 2: Build route-local Foundation shell and content boundaries

**Files:**
- Create: `src/app/remember/page.tsx`
- Create: `src/app/remember/remember.css`
- Create: `src/components/remember/remember-experience.tsx`
- Create: `src/components/remember/remember-shell.tsx`
- Create: `src/components/remember/content/remember-copy.ts`
- Create: `src/components/remember/content/remember-assets.ts`
- Create: `src/components/remember/system/use-remember-scroll-lock.ts`
- Create: `src/components/remember/system/use-remember-reduced-motion.ts`
- Create: `src/components/remember/system/remember-analytics.ts`

**Interfaces:**
- Consumes Task 1 reducer.
- Produces `RememberShell`, route CSS classes, `rememberAssets`, `rememberCopy`, reduced-motion boolean and analytics boundary.

- [ ] **Step 1: Define approved copy and asset constants**

`remember-copy.ts`:

```ts
export const rememberCopy = {
  entry: {
    primary: "SOME MEMORIES REFUSE TO DIE.",
    secondary: "THIS ONE IS DISAPPEARING.",
    enter: "ENTER THE MEMORY",
    headphones: "Headphones recommended",
  },
  restore: {
    realm: "HANAMORI",
    instruction: "Restore what remains.",
    keyboardAction: "Restore fragment",
  },
  reveal: {
    realm: "HANAMORI",
    guardian: "GUARDIAN",
    name: "AKARI",
    line: "Someone still remembers this place.",
  },
  controls: {
    exit: "Exit memory",
    mute: "Mute",
    unmute: "Unmute",
  },
} as const;
```

`remember-assets.ts` must point to:

```ts
export const rememberAssets = {
  hanamoriRealm: "/reinos/01_hanamori.png",
  hanamoriBroken: "/assets_hq/templo-hanamori_2.png",
  hanamoriRestored: "/assets_hq/templo-hanamori.png",
  sakuraBranch: "/secret-pathways-assets/foreground/png/sakura-branch.webp",
  shrineRuins: "/secret-pathways-assets/foreground/png/shrine-ruins.webp",
  stoneLantern: "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  tallGrass: "/secret-pathways-assets/foreground/png/tall-grass.webp",
} as const;
```

- [ ] **Step 2: Implement scroll-lock lifecycle**

The hook stores and restores previous `html/body` overflow values. It must not permanently mutate scroll state after route exit.

- [ ] **Step 3: Implement reduced-motion media-query hook**

It returns the current `prefers-reduced-motion: reduce` state and removes its `change` listener on cleanup.

- [ ] **Step 4: Create typed no-op analytics boundary**

```ts
export type RememberAnalyticsEvent = "remember_started" | "remember_restore_completed";
export function trackRememberEvent(
  _event: RememberAnalyticsEvent,
  _payload?: Record<string, unknown>,
): void {}
```

- [ ] **Step 5: Create route and shell**

`page.tsx` imports `remember.css` and renders `<RememberExperience />` only.

`RememberShell` renders:

- full-screen root;
- top-left exit button;
- top-right mute button;
- small lunar mark;
- atmospheric decorative layer slots;
- children scene area.

Exit uses Next `Link`/router navigation to `/` and never reloads the page.

- [ ] **Step 6: Compose reducer in `RememberExperience`**

Use `useReducer(rememberReducer, initialRememberState)` and `useRememberScrollLock()`.

At this task's completion, render an internal scene identifier temporarily through semantic scene containers, not a visible developer HUD.

- [ ] **Step 7: Build route-local CSS foundation**

Requirements:

```css
.remember-root {
  position: fixed;
  inset: 0;
  min-height: 100dvh;
  overflow: hidden;
  background: #030305;
  color: var(--bone);
  isolation: isolate;
}
```

Use safe-area padding for controls, visible `:focus-visible`, no rounded SaaS cards, and mobile landscape rules.

- [ ] **Step 8: Verify route isolation**

Open `/remember` and confirm the normal Tsukihara header/nav is absent and page scroll is locked.

- [ ] **Step 9: Commit**

```bash
git add src/app/remember src/components/remember/content src/components/remember/system src/components/remember/remember-experience.tsx src/components/remember/remember-shell.tsx
git commit -m "feat: scaffold REMEMBER fullscreen foundation"
```

---

## Task 3: Implement dedicated native audio system

**Files:**
- Create: `src/components/remember/audio/remember-audio.ts`
- Create: `src/components/remember/audio/use-remember-audio.ts`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/components/remember/remember-shell.tsx`

**Interfaces:**
- Produces `RememberAudioController` API: `unlock`, `enterRestore`, `playKintsugi`, `playReveal`, `setMuted`, `stopAll`.
- Consumes reducer `muted` and scene changes.

- [ ] **Step 1: Define track registry and conservative levels**

```ts
export const rememberAudio = {
  menu: {
    src: "/remember-experience/sound-effects/trilha-sonora-menu-do-jogo.mp3",
    volume: 0.2,
    loop: true,
  },
  phase: {
    src: "/remember-experience/sound-effects/trilha-sonora-phase.mp3",
    volume: 0.16,
    loop: true,
  },
  kintsugi: {
    src: "/remember-experience/sound-effects/kintsugi-sound-effect.mp3",
    volume: 0.28,
    loop: false,
  },
  harp: {
    src: "/remember-experience/sound-effects/harp-sound-effect.mp3",
    volume: 0.42,
    loop: false,
  },
} as const;
```

Values may be visually/listening-calibrated later but must remain explicit constants.

- [ ] **Step 2: Implement reusable fade primitive**

Use requestAnimationFrame only while an active fade exists. `fadeAudio(audio, from, to, durationMs, signal)` must stop cleanly on abort.

- [ ] **Step 3: Implement hook-owned audio elements**

Create menu, phase, Kintsugi and harp elements lazily in the client. Entry gesture calls `unlock()` and starts menu music. `enterRestore()` crossfades menu down while phase fades in.

- [ ] **Step 4: Implement SFX playback without clipping pile-up**

Kintsugi SFX may clone the base audio for overlapping snaps, but cap active transient instances to a small number and clean each instance on `ended`.

- [ ] **Step 5: Wire mute state**

`setMuted(true)` mutes current/future tracks without resetting `currentTime`. Unmute resumes existing playback state; it must not restart the scene music.

- [ ] **Step 6: Wire route cleanup**

`stopAll()` aborts fades, pauses tracks, clears transient SFX and releases references on unmount.

- [ ] **Step 7: Commit**

```bash
git add src/components/remember/audio src/components/remember/remember-experience.tsx src/components/remember/remember-shell.tsx
git commit -m "feat: add REMEMBER dedicated soundscape"
```

---

## Task 4: Build Entry ritual and transition into Restore

**Files:**
- Create: `src/components/remember/scenes/entry-scene.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- Entry receives `onEnter(): void`, reduced-motion boolean and audio-unlocked callback through the experience coordinator.

- [ ] **Step 1: Create accessible Entry markup**

Render the two lines, lunar symbol, `ENTER THE MEMORY` button and headphones microcopy. Only the button advances state.

- [ ] **Step 2: Add GSAP entry sequencing**

Normal motion:

- primary line enters quietly;
- secondary line follows after a restrained pause;
- CTA appears last;
- lunar symbol breathes subtly.

Reduced motion uses opacity transitions only.

- [ ] **Step 3: Make Enter gesture atomic**

On click:

```ts
await audio.unlock();
trackRememberEvent("remember_started");
dispatch({ type: "ENTER" });
audio.enterRestore();
```

Disable the CTA during this operation to prevent duplicate start actions.

- [ ] **Step 4: Progressive preload immediate Restore assets**

After entering, create `Image` preload requests only for the selected broken/restored Hanamori sources. Do not preload future Mochi/Akari climax assets.

- [ ] **Step 5: Commit**

```bash
git add src/components/remember/scenes/entry-scene.tsx src/components/remember/remember-experience.tsx src/app/remember/remember.css
git commit -m "feat: add REMEMBER entry ritual"
```

---

## Task 5: Define Hanamori fracture geometry and draggable fragment component

**Files:**
- Create: `src/components/remember/restore/restore-geometry.ts`
- Create: `src/components/remember/restore/memory-fragment.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- `MemoryFragmentDefinition` includes `id`, SVG `path`, normalized `home`, normalized `initial`, `rotation`, `snapRadius`, `seamId`.
- `MemoryFragment` emits `onRestore(fragmentId)` exactly once after successful snap.

- [ ] **Step 1: Define five irregular fragment polygons/paths**

Use a normalized `viewBox="0 0 1000 625"` and define five authored irregular paths that cover the full source composition with small intentional overlaps under seam lines. Do not use rectangles or puzzle tabs.

- [ ] **Step 2: Define responsive initial offsets**

Store normalized initial offsets in geometry. Desktop offsets are wider; mobile offsets are multiplied by a route CSS/custom-property scale so every piece remains inside the usable viewport.

- [ ] **Step 3: Render one fragment through SVG clipPath**

`MemoryFragment` renders a positioned wrapper containing an SVG/image masked by the fragment path. Each fragment uses the same source image and `preserveAspectRatio="xMidYMid slice"`.

- [ ] **Step 4: Implement pointer capture lifecycle**

On pointer down:

```ts
event.currentTarget.setPointerCapture(event.pointerId);
```

Track active pointer id and start position in refs.

On pointer move:

- convert client delta to stage-local coordinates;
- calculate magnetic progress to home;
- update x/y through GSAP quick setters or direct transform refs;
- do not call React `setState` for every move.

On pointer up/cancel:

- release capture if held;
- if within threshold, animate to home and call `onRestore` once;
- otherwise leave at current location.

- [ ] **Step 5: Add magnetic attraction**

Within the outer magnetic zone, interpolate partway toward home before release so the user can feel the target without teleporting the piece.

- [ ] **Step 6: Add keyboard parity**

Each fragment is focusable. A button semantics/action restores the focused fragment via Enter/Space and runs the same visual snap callback path.

- [ ] **Step 7: Add active/settled visual states**

Active fragment: elevated z-index, subtle scale and shadow. Settled fragment: pointer disabled, transform home, glow delegated to Kintsugi layer.

- [ ] **Step 8: Commit**

```bash
git add src/components/remember/restore/restore-geometry.ts src/components/remember/restore/memory-fragment.tsx src/app/remember/remember.css
git commit -m "feat: add Hanamori draggable memory fragments"
```

---

## Task 6: Add Lunar Kintsugi seams and complete Restore scene

**Files:**
- Create: `src/components/remember/restore/kintsugi-seams.tsx`
- Create: `src/components/remember/restore/hanamori-memory.tsx`
- Create: `src/components/remember/scenes/restore-scene.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- `HanamoriMemory` receives restored ids and emits `onRestore(fragmentId)`.
- `KintsugiSeams` receives restored ids and renders active seam paths.
- Restore scene receives reducer state, dispatch, audio controller and reduced-motion flag.

- [ ] **Step 1: Author seam SVG paths aligned to fragment geometry**

Use 4–6 interior seam paths in the same `0 0 1000 625` viewBox. Map seams to the fragment id that activates them.

- [ ] **Step 2: Animate seam activation**

Each seam uses `pathLength="1"`, `strokeDasharray="1"` and animates `strokeDashoffset: 1 → 0`. Add low-alpha blur/glow duplicate path rather than a neon filter stack.

- [ ] **Step 3: Build Hanamori memory stage**

Composition contains:

- dark Hanamori underlay;
- five draggable fragments;
- seam SVG overlay;
- restrained foreground sakura/ruin layers;
- restored-image layer at opacity 0 until completion.

- [ ] **Step 4: Dispatch logical restore only once per fragment**

`onRestore`:

```ts
audio.playKintsugi();
dispatch({ type: "RESTORE_FRAGMENT", fragmentId, totalFragments: fragments.length });
```

The reducer's idempotency remains the source of truth.

- [ ] **Step 5: Handle collective completion without double transition**

When restored count reaches all five:

- pulse all active seams once;
- crossfade broken composition → restored artwork;
- call `trackRememberEvent("remember_restore_completed")` exactly once;
- play harp once;
- reducer is already in `memory-reveal` from Task 1.

The visual completion timeline must respond to state, not dispatch the logical transition itself.

- [ ] **Step 6: Implement Restore copy and instruction fade**

Show `HANAMORI` / `Restore what remains.` quietly. Instruction recedes after first successful snap to reduce HUD feeling.

- [ ] **Step 7: Implement mobile/touch tuning**

Use larger fragment hit targets, smaller initial offsets and no decorative layer over the interaction plane. `touch-action: none` applies only to the Hanamori interaction surface.

- [ ] **Step 8: Commit**

```bash
git add src/components/remember/restore/kintsugi-seams.tsx src/components/remember/restore/hanamori-memory.tsx src/components/remember/scenes/restore-scene.tsx src/components/remember/remember-experience.tsx src/app/remember/remember.css
git commit -m "feat: restore Hanamori with Lunar Kintsugi"
```

---

## Task 7: Build memory reveal and close the first vertical slice

**Files:**
- Create: `src/components/remember/scenes/memory-reveal-scene.tsx`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/app/remember/remember.css`

**Interfaces:**
- Consumes `scene === "memory-reveal"` and already-restored Hanamori asset state.
- Does not expose Mochi/Choice navigation.

- [ ] **Step 1: Render reveal sequence integrated over restored Hanamori**

Copy order:

```text
HANAMORI
GUARDIAN
AKARI
Someone still remembers this place.
```

- [ ] **Step 2: Animate reveal with restrained GSAP sequencing**

Normal motion: subtle field depth shift, typography opacity/y and one warm lunar bloom. Reduced motion: opacity only.

- [ ] **Step 3: Keep first PR intentionally terminal here**

No fake next button. Exit and mute controls remain available. A development-only restart can be exposed through a non-prominent keyboard shortcut or conditional internal button only if necessary for repeated testing; production visual UI must not promise unavailable scenes.

- [ ] **Step 4: Verify restart resets audio/state if exposed**

Restart must reset fragments and return to Entry without leaving old fades/SFX alive.

- [ ] **Step 5: Commit**

```bash
git add src/components/remember/scenes/memory-reveal-scene.tsx src/components/remember/remember-experience.tsx src/app/remember/remember.css
git commit -m "feat: complete REMEMBER Hanamori memory reveal"
```

---

## Task 8: Accessibility, lifecycle and responsive hardening

**Files:**
- Modify: `src/app/remember/remember.css`
- Modify: route/components touched by Tasks 2–7 only when verification identifies a concrete issue.

**Interfaces:**
- No new narrative behavior.

- [ ] **Step 1: Keyboard-only pass**

Verify:

- Entry CTA reachable and visible focus;
- exit/mute reachable;
- all five fragments can be restored without pointer precision;
- no focus trap is introduced accidentally;
- focus does not disappear after fragment completion.

- [ ] **Step 2: Pointer lifecycle pass**

Verify mouse, touch/pen semantics in code:

- capture set on down;
- release on up/cancel;
- cleanup on unmount;
- no document-level move listeners remain after drag.

- [ ] **Step 3: Responsive CSS pass**

Explicitly cover:

- `>= 1440px` cinematic desktop;
- typical notebook widths;
- `<= 900px` tablet/mobile;
- portrait short-height viewports;
- landscape mobile with safe areas.

- [ ] **Step 4: Reduced-motion pass**

Ensure no perpetual breathing/parallax animation survives reduced motion while snap and seam reveal remain understandable.

- [ ] **Step 5: Audio-off pass**

Entire slice remains comprehensible and gives equivalent visual confirmation while muted.

- [ ] **Step 6: Commit**

```bash
git add src/app/remember/remember.css src/components/remember
git commit -m "fix: harden REMEMBER interaction and accessibility"
```

---

## Task 9: Integrate CI and run the final gate

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Adds the focused REMEMBER regression before existing quality checks.

- [ ] **Step 1: Add REMEMBER regression to Quality workflow**

Insert after Hero regression:

```yaml
- name: REMEMBER regression
  run: npm run test:remember
```

- [ ] **Step 2: Run local/runner-equivalent focused regressions**

```bash
npm run test:remember
npm run test:hero
```

Expected: PASS.

- [ ] **Step 3: Run formatting gate**

```bash
npm run format:check
```

Expected: PASS; if it fails, run the project's Prettier formatter on the listed files and re-run.

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Run production build**

```bash
npm run build
```

Expected: PASS including Next.js route generation and TypeScript.

- [ ] **Step 6: Browser smoke**

Validate `/remember` at desktop and mobile sizes:

- no landing header;
- no vertical page scroll;
- Entry gesture starts audio;
- mute does not restart tracks;
- drag and keyboard restore work;
- snap is generous;
- each seam and SFX fires once per piece;
- all five restore Hanamori and show the reveal;
- exit restores document behavior;
- no console errors.

- [ ] **Step 7: Open a draft PR to `main`**

PR title:

```text
feat: add REMEMBER Hanamori restoration ritual
```

Keep draft until visual validation is explicitly approved.

---

## Self-Review Checklist

### Spec coverage

- Fullscreen isolated `/remember`: Tasks 2 and 8.
- Typed reducer and restart semantics: Task 1.
- Dedicated supplied audio and cleanup: Task 3.
- Entry ritual and audio unlock: Task 4.
- Five irregular Hanamori fragments: Task 5.
- Pointer Events, magnetic snap and keyboard parity: Task 5.
- SVG Lunar Kintsugi and per-piece SFX: Task 6.
- Completion crossfade and harp reveal: Tasks 6–7.
- Responsive and reduced-motion behavior: Task 8.
- Analytics boundary: Task 2, call sites Tasks 4 and 6.
- No future Mochi/Choice/Eclipse implementation: enforced throughout Tasks 4–7.
- CI gates: Task 9.

### Interface consistency

- `RememberState.restoredFragmentIds` is the single logical source of restoration truth.
- Fragment pointer code emits ids; it does not own narrative progression.
- Reducer advances to `memory-reveal`; GSAP only presents that transition.
- Audio mute state belongs to reducer while audio lifecycle belongs to the hook/controller.
- Geometry and snap math are pure modules shared by pointer logic and tests.

### Scope rulings

- No new image production is required before visual inspection of the actual Hanamori composite.
- Native audio is sufficient for the first slice; no Howler.
- DOM/SVG + GSAP is sufficient; no Three/R3F canvas.
- The slice intentionally ends at `memory-reveal` without a fake continuation CTA.
