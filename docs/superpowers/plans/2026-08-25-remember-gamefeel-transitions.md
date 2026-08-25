# REMEMBER Gamefeel and Scene Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn REMEMBER into a cohesive game flow with authored scene transitions, real asset loading, stronger puzzle challenge, diegetic guidance, shared Tsukihara UI primitives, and a complete Akari → epilogue → credits ending.

**Architecture:** Keep `rememberReducer` as the narrative source of truth and add presentation-only orchestration around it: a transition director, asset readiness manifest, seeded puzzle scatter, and small guidance policies. React components own rendering and GSAP timelines; pure TypeScript modules own deterministic decisions so RED→GREEN coverage remains fast with Node's built-in test runner.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, GSAP 3.13, CSS, Node 22 built-in test runner, Prettier 3.7.4.

**Spec:** `docs/superpowers/specs/2026-08-25-remember-gamefeel-transitions-design.md`

## Global Constraints

- Start execution from `design/remember-gamefeel-transitions`, which is based on `main` commit `195766f989376da588d0e40184529ec72a63931c`; create `feat/remember-gamefeel-transitions` before touching production code.
- Do not replace `rememberReducer`, GSAP, or the existing restoration timeline.
- Do not add a fourth memory.
- Do not fake preload progress with timers; progress changes only when tracked assets resolve or fail.
- Kintsugi remains absent during normal puzzle gameplay and begins only at the existing Kintsugi restoration phase.
- Duplicate transition requests are rejected while the director is busy; they are not queued.
- Reduced motion preserves semantic order and progression but removes nonessential transforms, blur, looping float, and decorative drift.
- Landing-page sound control must remain visually equivalent after extraction.
- `npm run test:hero`, `npm run test:remember`, `npm run format:check`, `npm run lint`, and `npm run build` must all pass before the PR is presented for localhost validation.
- Do not merge the implementation PR automatically.

## File Structure

New focused units:

- `src/components/shared/jp-reveal-text.tsx` — neutral home for the existing Japanese → localized glyph reveal.
- `src/components/shared/sound-toggle.tsx` — shared three-bar sound control presentation.
- `src/components/remember/system/scene-transition-state.ts` — pure transition state machine.
- `src/components/remember/system/use-scene-transition-director.ts` — GSAP-backed orchestration hook.
- `src/components/remember/system/scene-transition-layer.tsx` — visual veil/sigil used by transitions.
- `src/components/remember/system/remember-preload-manifest.ts` — grouped blocking asset readiness.
- `src/components/remember/system/use-remember-preloader.ts` — browser image decode and group readiness.
- `src/components/remember/scenes/remember-game-preloader.tsx` — gamified loader UI.
- `src/components/remember/system/remember-input-policy.ts` — Boot keyboard activation policy.
- `src/components/remember/restore/puzzle-scatter.ts` — deterministic seeded loose-fragment transforms.
- `src/components/remember/restore/ghost-seams.tsx` — puzzle guidance seams, separate from Kintsugi.
- `src/components/remember/restore/hanamori-guidance.ts` — pure onboarding/hint policy.
- `src/components/remember/scenes/akari-reveal-scene.tsx` — post-Kurogane narrative screen.
- `src/components/remember/scenes/epilogue-scene.tsx` — eclipse epilogue with video fallback.
- `src/components/remember/scenes/credits-scene.tsx` — final credits loop/fallback and return CTA.
- `src/app/remember/remember-gamefeel.css` — transition, loader, menu, guidance, ghost-seam, and narrative-scene styling.

Existing orchestration files stay small by delegating to those units:

- `src/components/remember/remember-experience.tsx`
- `src/components/remember/remember-shell.tsx`
- `src/components/remember/scenes/boot-scene.tsx`
- `src/components/remember/scenes/menu-scene.tsx`
- `src/components/remember/scenes/restore-scene.tsx`
- `src/components/remember/restore/memory-puzzle.tsx`
- `src/components/remember/restore/memory-fragment.tsx`
- `src/components/remember/content/remember-locales.ts`
- `src/components/experience/immersive-experience.tsx`
- `src/components/experience/jp-reveal-text.tsx`
- `src/app/remember/page.tsx`
- `src/app/immersive-overhaul.css`
- `package.json`

---

### Task 1: Shared Tsukihara text reveal and sound control

**Files:**
- Create: `src/components/shared/jp-reveal-text.tsx`
- Create: `src/components/shared/sound-toggle.tsx`
- Create: `src/components/shared/shared-ui.test.mjs`
- Modify: `src/components/experience/jp-reveal-text.tsx`
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/components/remember/remember-shell.tsx`
- Modify: `src/app/immersive-overhaul.css`
- Modify: `package.json`

**Interfaces:**
- Produces: `JpRevealText({ jp, text, locale, className?, duration?, delay?, deferred? })` where `locale` is `"pt" | "en"`.
- Produces: `SoundToggle({ muted, label, onToggle, className?, showLabel? })`.
- Keeps `src/components/experience/jp-reveal-text.tsx` as a compatibility re-export so existing experience components do not require a broad import rewrite.

- [ ] **Step 1: Write the failing structural regression test**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("shared sound control preserves the landing-page three-bar contract", () => {
  const shared = read("../shared/sound-toggle.tsx");
  assert.match(shared, /aria-pressed={!muted}/);
  assert.match(shared, /shared-sound-bars/);
  assert.equal((shared.match(/<i\s*\/?>/g) ?? []).length, 3);
});

test("experience jp reveal becomes a compatibility re-export", () => {
  const legacy = read("../experience/jp-reveal-text.tsx");
  assert.match(legacy, /components\/shared\/jp-reveal-text/);
});
```

- [ ] **Step 2: Run the isolated test and verify RED**

Run:

```bash
node --experimental-strip-types --test src/components/shared/shared-ui.test.mjs
```

Expected: FAIL because the shared files do not exist.

- [ ] **Step 3: Move the existing reveal implementation without changing behavior**

Create the shared component by moving the current implementation and decoupling it from `immersive-copy`:

```tsx
export type SharedLocale = "pt" | "en";

type JpRevealTextProps = {
  jp: string;
  text: string;
  locale: SharedLocale;
  className?: string;
  duration?: number;
  delay?: number;
  deferred?: boolean;
};
```

Replace the legacy file with:

```tsx
export { JpRevealText } from "@/components/shared/jp-reveal-text";
```

- [ ] **Step 4: Extract the three-bar sound markup**

```tsx
type SoundToggleProps = {
  muted: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
};

export function SoundToggle({
  muted,
  label,
  onToggle,
  className,
  showLabel = true,
}: SoundToggleProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={label}
      title={label}
    >
      <span className="shared-sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
```

Use it in `ImmersiveExperience` with `className="ix-sound"` and in `RememberShell` with `className="remember-sound-toggle"`. Alias the existing LP bar rules from `.ix-sound-bars` to `.shared-sound-bars` without changing dimensions, spacing, animation, or state selectors.

- [ ] **Step 5: Run regressions**

```bash
node --experimental-strip-types --test src/components/shared/shared-ui.test.mjs
npm run test:hero
npm run build
```

Expected: all PASS; landing page compiles with the same audio state semantics.

- [ ] **Step 6: Commit**

```bash
git add src/components/shared src/components/experience/jp-reveal-text.tsx src/components/experience/immersive-experience.tsx src/components/remember/remember-shell.tsx src/app/immersive-overhaul.css package.json
git commit -m "refactor: share Tsukihara text and sound controls"
```

---

### Task 2: Deterministic SceneTransitionDirector

**Files:**
- Create: `src/components/remember/system/scene-transition-state.ts`
- Create: `src/components/remember/system/scene-transition-state.test.mjs`
- Create: `src/components/remember/system/use-scene-transition-director.ts`
- Create: `src/components/remember/system/scene-transition-layer.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces `TransitionVariant = "ritual-open" | "memory-enter" | "memory-leave" | "narrative" | "exit"`.
- Produces `TransitionPhase = "idle" | "exiting" | "covered" | "entering"`.
- Produces `createTransitionState()`, `requestTransition(state, variant)`, `coverTransition(state)`, `finishTransition(state)`.
- Hook produces `{ phase, variant, interactionLocked, requestTransition }` where `requestTransition({ variant, waitFor?, commit, afterCommit? }) => Promise<boolean>` resolves `false` for duplicate requests.

- [ ] **Step 1: Write transition-state RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  coverTransition,
  createTransitionState,
  finishTransition,
  requestTransition,
} from "./scene-transition-state.ts";

test("a transition locks interaction and duplicate requests are rejected", () => {
  const idle = createTransitionState();
  const first = requestTransition(idle, "memory-enter");
  assert.equal(first.accepted, true);
  assert.equal(first.state.phase, "exiting");
  assert.equal(first.state.interactionLocked, true);

  const duplicate = requestTransition(first.state, "narrative");
  assert.equal(duplicate.accepted, false);
  assert.deepEqual(duplicate.state, first.state);
});

test("covered and entering phases preserve the same transition variant", () => {
  const requested = requestTransition(createTransitionState(), "narrative").state;
  const covered = coverTransition(requested);
  assert.equal(covered.phase, "covered");
  assert.equal(covered.variant, "narrative");
  const done = finishTransition(covered);
  assert.equal(done.phase, "idle");
  assert.equal(done.interactionLocked, false);
});
```

- [ ] **Step 2: Verify RED**

```bash
node --experimental-strip-types --test src/components/remember/system/scene-transition-state.test.mjs
```

Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the pure transition state**

```ts
export type TransitionPhase = "idle" | "exiting" | "covered" | "entering";
export type TransitionVariant =
  | "ritual-open"
  | "memory-enter"
  | "memory-leave"
  | "narrative"
  | "exit";

export type TransitionState = {
  phase: TransitionPhase;
  variant: TransitionVariant | null;
  interactionLocked: boolean;
};
```

`requestTransition` must refuse any non-idle state. `coverTransition` accepts only `exiting`; `finishTransition` returns the canonical idle state.

- [ ] **Step 4: Implement the GSAP hook and layer**

`requestTransition` order must be exactly:

```ts
setPhase("exiting");
await animateCover(variant);
setPhase("covered");
if (waitFor) await waitFor();
commit();
await nextPaint();
afterCommit?.();
setPhase("entering");
await animateReveal(variant);
setPhase("idle");
```

Cleanup kills the active GSAP timeline and restores `phase="idle"`/interaction on unmount. The layer exposes `data-transition-phase` and `data-transition-variant` for CSS and QA.

- [ ] **Step 5: Verify GREEN**

```bash
node --experimental-strip-types --test src/components/remember/system/scene-transition-state.test.mjs
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/remember/system package.json
git commit -m "feat: add REMEMBER scene transition director"
```

---

### Task 3: Real gamified asset preloader and destination readiness

**Files:**
- Create: `src/components/remember/system/remember-preload-manifest.ts`
- Create: `src/components/remember/system/remember-preload-manifest.test.mjs`
- Create: `src/components/remember/system/use-remember-preloader.ts`
- Create: `src/components/remember/scenes/remember-game-preloader.tsx`
- Modify: `src/components/remember/content/remember-locales.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `RememberAssetGroup = "entry" | "mizukyo" | "kurogane" | "akari" | "ending"`.
- Produces `rememberPreloadManifest: Record<RememberAssetGroup, readonly string[]>`.
- Hook produces `{ loaded, total, readyGroups, failed, waitForGroup(group) }`.

- [ ] **Step 1: Write manifest RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { rememberPreloadManifest } from "./remember-preload-manifest.ts";

test("entry preload contains every blocking Hanamori visual", () => {
  const entry = rememberPreloadManifest.entry;
  assert.ok(entry.includes("/assets_hq/templo-hanamori_2.png"));
  assert.ok(entry.includes("/assets_hq/templo-hanamori.png"));
  assert.ok(entry.some((src) => src.includes("remember-menu-background")));
  assert.ok(entry.some((src) => src.includes("mr01-kintsugi")));
});

test("later memory and ending assets are grouped independently", () => {
  assert.ok(rememberPreloadManifest.mizukyo.every((src) => src.includes("mizukyo")));
  assert.ok(rememberPreloadManifest.kurogane.every((src) => src.includes("kurogane")));
  assert.ok(rememberPreloadManifest.akari.some((src) => src.includes("akari")));
});
```

- [ ] **Step 2: Verify RED**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-preload-manifest.test.mjs
```

- [ ] **Step 3: Implement the explicit image manifest**

Use `rememberAssets` and keep video/audio out of blocking readiness:

```ts
export const rememberPreloadManifest = {
  entry: [
    rememberAssets.menuBackground,
    rememberAssets.hanamoriBroken,
    rememberAssets.hanamoriRestored,
    rememberAssets.kintsugiCrackOverlay,
    rememberAssets.memoryParticles,
    rememberAssets.memoryPulseRing,
    rememberAssets.completionBurst,
    rememberAssets.restoredScarOverlay,
    rememberAssets.sakuraBranch,
    rememberAssets.shrineRuins,
    rememberAssets.stoneLantern,
    rememberAssets.tallGrass,
  ],
  mizukyo: [rememberAssets.mizukyoBroken, rememberAssets.mizukyoRestored],
  kurogane: [rememberAssets.kuroganeBroken, rememberAssets.kuroganeRestored],
  akari: [rememberAssets.akariReveal],
  ending: [],
} as const;
```

- [ ] **Step 4: Implement image decoding and graceful failure**

For each image create `new Image()`, assign `src`, await `decode()` when available, and resolve the item on either success or error. `waitForGroup()` resolves when every member is resolved, including failed items; it never rejects and never deadlocks transition flow.

- [ ] **Step 5: Build the gamified loader**

Render real count, not a timer-derived percentage:

```tsx
<strong>{String(loaded).padStart(2, "0")}</strong>
<span>/</span>
<em>{String(total).padStart(2, "0")}</em>
```

Use a central `月`, concentric ritual lines, memory fissure marks keyed to resolved count, and localized `RECUPERANDO MEMÓRIAS` / `RECOVERING MEMORIES`. Completion emits one controlled pulse and calls the transition director into Boot.

- [ ] **Step 6: Verify**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-preload-manifest.test.mjs
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/remember/system src/components/remember/scenes/remember-game-preloader.tsx src/components/remember/content/remember-locales.ts package.json
git commit -m "feat: add gamified REMEMBER asset preloader"
```

---

### Task 4: Boot and centered cinematic menu gamefeel

**Files:**
- Create: `src/components/remember/system/remember-input-policy.ts`
- Create: `src/components/remember/system/remember-input-policy.test.mjs`
- Modify: `src/components/remember/scenes/boot-scene.tsx`
- Modify: `src/components/remember/scenes/menu-scene.tsx`
- Modify: `src/components/remember/content/remember-locales.ts`
- Modify: `src/app/remember/remember-game.css`
- Modify: `src/app/remember/remember-gamefeel.css`
- Modify: `src/app/remember/page.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces `isRememberActivationKey(eventLike): boolean`.
- `BootScene` receives `reducedMotion`, `transitionLocked`, `onUnlock`.
- `MenuScene` receives `locale`, `reducedMotion`, `transitionLocked`, `onBegin`.

- [ ] **Step 1: Write activation policy RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { isRememberActivationKey } from "./remember-input-policy.ts";

const key = (key, extra = {}) => ({ key, altKey: false, ctrlKey: false, metaKey: false, ...extra });

test("Boot accepts game-like activation keys", () => {
  for (const value of ["Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "a", "7"]) {
    assert.equal(isRememberActivationKey(key(value)), true);
  }
});

test("Boot rejects navigation and modifier-only keys", () => {
  for (const value of ["Tab", "Escape", "Shift", "Control", "Alt", "Meta", "F1"]) {
    assert.equal(isRememberActivationKey(key(value)), false);
  }
  assert.equal(isRememberActivationKey(key("a", { ctrlKey: true })), false);
});
```

- [ ] **Step 2: Verify RED, then implement policy**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-input-policy.test.mjs
```

Implementation accepts Enter, Space, arrows and single alphanumeric keys, rejects function keys/modifier combinations.

- [ ] **Step 3: Add whole-screen keyboard activation to Boot**

Register one `window.keydown` listener while Boot is interactive. Ignore events when `event.target` is `input`, `textarea`, `select`, `button`, `a`, or `[contenteditable=true]`. Call the same guarded `handleUnlock()` as pointer activation.

- [ ] **Step 4: Center and rewrite Menu composition**

Use the shared reveal directly:

```tsx
<JpRevealText jp="記憶" text={copy.title} locale={locale} className="remember-menu__title" />
<JpRevealText
  jp="記憶を取り戻せ。傷跡を残せ。"
  text={copy.thesis}
  locale={locale}
  className="remember-menu__thesis"
  delay={420}
/>
```

Add `menu.thesis` to both locales. Center eyebrow, title, ritual line, CTA and thesis. Only `.remember-menu__begin` gets the 2–4 px Y float loop.

- [ ] **Step 5: Add reduced-motion CSS**

Under `@media (prefers-reduced-motion: reduce)`, disable prompt blink, CTA float, sigil orbit and backdrop drift while keeping static opacity and focus states.

- [ ] **Step 6: Verify**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-input-policy.test.mjs
npm run format:check
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/remember/scenes src/components/remember/system/remember-input-policy* src/components/remember/content/remember-locales.ts src/app/remember package.json
git commit -m "feat: redesign REMEMBER boot and menu gamefeel"
```

---

### Task 5: Seeded puzzle scatter with monotonic difficulty

**Files:**
- Create: `src/components/remember/restore/puzzle-scatter.ts`
- Create: `src/components/remember/restore/puzzle-scatter.test.mjs`
- Modify: `src/components/remember/restore/memory-puzzle.tsx`
- Modify: `src/components/remember/restore/memory-fragment.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces `ScatterTransform = { x: number; y: number; rotation: number; scale: number }` in normalized stage offsets.
- Produces `generatePuzzleScatter({ memoryId, fragmentIds, seed, compact }): Record<string, ScatterTransform>`.
- `MemoryFragment` receives `spawn: ScatterTransform` and `onActiveChange?: (fragmentId, active) => void`.

- [ ] **Step 1: Write deterministic difficulty RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { generatePuzzleScatter } from "./puzzle-scatter.ts";

const ids = (count) => Array.from({ length: count }, (_, index) => `p-${index}`);
const radius = ({ x, y }) => Math.hypot(x, y);

test("same seed reproduces the same scatter", () => {
  const a = generatePuzzleScatter({ memoryId: "hanamori", fragmentIds: ids(5), seed: 42, compact: false });
  const b = generatePuzzleScatter({ memoryId: "hanamori", fragmentIds: ids(5), seed: 42, compact: false });
  assert.deepEqual(a, b);
});

test("difficulty increases by memory", () => {
  const hanamori = Object.values(generatePuzzleScatter({ memoryId: "hanamori", fragmentIds: ids(5), seed: 9, compact: false }));
  const mizukyo = Object.values(generatePuzzleScatter({ memoryId: "mizukyo", fragmentIds: ids(7), seed: 9, compact: false }));
  const kurogane = Object.values(generatePuzzleScatter({ memoryId: "kurogane", fragmentIds: ids(9), seed: 9, compact: false }));
  const avg = (items) => items.reduce((sum, item) => sum + radius(item), 0) / items.length;
  assert.ok(avg(hanamori) < avg(mizukyo));
  assert.ok(avg(mizukyo) < avg(kurogane));
});

test("rotation ranges are bounded", () => {
  const layout = Object.values(generatePuzzleScatter({ memoryId: "kurogane", fragmentIds: ids(9), seed: 91, compact: false }));
  assert.ok(layout.every((item) => Math.abs(item.rotation) >= 16 && Math.abs(item.rotation) <= 28));
  assert.ok(layout.every((item) => item.scale >= 0.82 && item.scale <= 0.96));
});
```

- [ ] **Step 2: Verify RED**

```bash
node --experimental-strip-types --test src/components/remember/restore/puzzle-scatter.test.mjs
```

- [ ] **Step 3: Implement seeded peripheral lanes**

Use a tiny deterministic PRNG (Mulberry32) and unique lane templates around the central assembly. Normal-mode radial floors start at 0.28 Hanamori, 0.34 Mizukyo, 0.40 Kurogane; compact mode scales them down by `0.72` only to preserve visibility. Choose sign/axis lanes so no two consecutive fragments share an identical vector.

- [ ] **Step 4: Integrate one seed per REMEMBER run**

Create a seed once in `RememberExperience` when gameplay begins and pass it to `RestoreScene`/`MemoryPuzzle`. Derive a memory-specific seed with `sessionSeed + memory.index * 1009`, so resizing does not reshuffle the active puzzle.

Replace `definition.initial`/`definition.rotation` as the loose spawn transform in `MemoryFragment`; keep `definition.initial` only for restoration effect origin compatibility until the final-shard origin is migrated to the current fragment spawn/DOM position.

- [ ] **Step 5: Preserve drag bounds and snap semantics**

Clamp the initial pixel transform to the current stage rectangle using a 24 px safe inset on desktop and 12 px on compact layouts. Do not change `getSnapRadius`, `magneticProgress`, or the target `{x:0,y:0}`.

- [ ] **Step 6: Verify**

```bash
node --experimental-strip-types --test src/components/remember/restore/puzzle-scatter.test.mjs src/components/remember/restore/restore-math.test.mjs
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/remember/restore src/components/remember/remember-experience.tsx src/components/remember/scenes/restore-scene.tsx package.json
git commit -m "feat: scatter REMEMBER fragments by difficulty"
```

---

### Task 6: Ghost seams and Hanamori diegetic onboarding

**Files:**
- Create: `src/components/remember/restore/ghost-seams.tsx`
- Create: `src/components/remember/restore/hanamori-guidance.ts`
- Create: `src/components/remember/restore/hanamori-guidance.test.mjs`
- Modify: `src/components/remember/restore/memory-puzzle.tsx`
- Modify: `src/components/remember/restore/memory-fragment.tsx`
- Modify: `src/components/remember/scenes/restore-scene.tsx`
- Modify: `src/components/remember/content/remember-locales.ts`
- Modify: `src/components/remember/system/remember-render-policy.ts`
- Modify: `src/components/remember/system/remember-render-policy.test.mjs`
- Modify: `src/app/remember/remember-puzzle.css`
- Modify: `src/app/remember/remember-gamefeel.css`
- Modify: `package.json`

**Interfaces:**
- Produces `GuidanceState = { learned: boolean; activeFragmentId: string | null; hintCount: number; lastActivityAt: number }`.
- Produces `shouldFireHanamoriHint({ memoryId, restoredCount, learned, activeFragmentId, hintCount, idleMs }): boolean`.
- `GhostSeams` accepts `memoryId`, `seams`, `viewBox`, `activeFragmentId`, `hintFragmentId`, `restorationPhase`.

- [ ] **Step 1: Write guidance RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { shouldFireHanamoriHint } from "./hanamori-guidance.ts";

test("Hanamori hints once idle for five seconds", () => {
  assert.equal(
    shouldFireHanamoriHint({
      memoryId: "hanamori",
      restoredCount: 0,
      learned: false,
      activeFragmentId: null,
      hintCount: 0,
      idleMs: 5000,
    }),
    true,
  );
});

test("guidance stops after learning or two hints", () => {
  const base = { memoryId: "hanamori", restoredCount: 0, activeFragmentId: null, idleMs: 12000 };
  assert.equal(shouldFireHanamoriHint({ ...base, learned: true, hintCount: 0 }), false);
  assert.equal(shouldFireHanamoriHint({ ...base, learned: false, hintCount: 2 }), false);
  assert.equal(shouldFireHanamoriHint({ ...base, memoryId: "mizukyo", learned: false, hintCount: 0 }), false);
});
```

- [ ] **Step 2: Extend render-policy RED coverage**

Add:

```js
assert.equal(shouldMountGhostSeams("idle"), true);
assert.equal(shouldMountGhostSeams("last-piece"), false);
assert.equal(shouldMountGhostSeams("kintsugi"), false);
```

- [ ] **Step 3: Verify RED, then implement policies**

```bash
node --experimental-strip-types --test src/components/remember/restore/hanamori-guidance.test.mjs src/components/remember/system/remember-render-policy.test.mjs
```

- [ ] **Step 4: Render a separate GhostSeams SVG**

Reuse `memory.seams` path geometry, but render only one neutral path per seam with classes:

```tsx
<path
  d={seam.path}
  className={seam.fragmentId === activeFragmentId ? "remember-ghost-seam is-active" : "remember-ghost-seam"}
/>
```

CSS baseline opacity: Hanamori `0.13`, Mizukyo `0.08`, Kurogane `0.05`. Active/hint seam may rise to `0.28` without gold bloom or particles. Fade the entire ghost layer to zero on `last-piece` before real Kintsugi mounts.

- [ ] **Step 5: Add onboarding copy and first-snap feedback**

Extend `memory` locale copy with:

```ts
onboardingTitle: "RECONSTRUA A MEMÓRIA";
onboardingBody: "Arraste os fragmentos e devolva-os ao lugar ao qual pertencem.";
onboardingDrag: "Encontre a cicatriz à qual este fragmento pertence.";
fragmentRestored: "FRAGMENTO RESTAURADO";
```

English equivalents: `RECONSTRUCT THE MEMORY`, `Drag the fragments back to where they belong.`, `Find the scar this fragment belongs to.`, `FRAGMENT RESTORED`.

After the first successful Hanamori snap, show `FRAGMENTO RESTAURADO · 01 / 05`, set `learned=true`, cancel all hint timers, and dissolve guidance.

- [ ] **Step 6: Add inactivity cue without solving the puzzle**

At 5 s idle, then no more than every 8 s, call a `nudge()` method exposed from the highlighted `MemoryFragment`: GSAP the current loose position 2–4 px toward `{0,0}` and return. Never alter translation state permanently and never enter snap radius.

- [ ] **Step 7: Verify**

```bash
node --experimental-strip-types --test src/components/remember/restore/hanamori-guidance.test.mjs src/components/remember/system/remember-render-policy.test.mjs
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add src/components/remember/restore src/components/remember/scenes/restore-scene.tsx src/components/remember/content/remember-locales.ts src/components/remember/system/remember-render-policy* src/app/remember package.json
git commit -m "feat: teach Hanamori with ghost-seam guidance"
```

---

### Task 7: Complete Akari, epilogue, and credits renderers

**Files:**
- Create: `src/components/remember/scenes/akari-reveal-scene.tsx`
- Create: `src/components/remember/scenes/epilogue-scene.tsx`
- Create: `src/components/remember/scenes/credits-scene.tsx`
- Create: `src/components/remember/scenes/narrative-scenes.test.mjs`
- Modify: `src/components/remember/content/remember-assets.ts`
- Modify: `src/components/remember/content/remember-locales.ts`
- Modify: `src/app/remember/remember-gamefeel.css`
- Modify: `package.json`

**Interfaces:**
- `AkariRevealScene({ copy, reducedMotion, onContinue })`.
- `EpilogueScene({ copy, reducedMotion, videoSrc, fallbackSrc, onContinue })`.
- `CreditsScene({ copy, reducedMotion, videoSrc, fallbackSrc, onExit })`.

- [ ] **Step 1: Write structural RED test ensuring all reducer scenes get renderers**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (name) => fs.readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("final REMEMBER scenes expose continuation controls", () => {
  assert.match(read("akari-reveal-scene.tsx"), /onContinue/);
  assert.match(read("epilogue-scene.tsx"), /onContinue/);
  assert.match(read("credits-scene.tsx"), /onExit/);
});
```

- [ ] **Step 2: Verify RED**

```bash
node --experimental-strip-types --test src/components/remember/scenes/narrative-scenes.test.mjs
```

- [ ] **Step 3: Implement Akari reveal**

Use `rememberAssets.akariReveal`, localized `copy.akari`, a subtle image drift only when motion is allowed, and a primary Continue button. Do not reuse the old hardcoded Hanamori `MemoryRevealScene` copy.

- [ ] **Step 4: Implement video scenes with deterministic static fallbacks**

Add image fallbacks to `rememberAssets` using existing Tsukihara stills:

```ts
akariFallback: "/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png",
epilogueFallback: "/parallax/tsukihara-blood-moon-eclipse.png",
creditsFallback: "/assets_hq/logotipo.png",
```

For epilogue/credits, start video muted/playsInline; on `error` or when reduced motion is active, hide the video and render the static fallback. Video failure must never remove the Continue/Exit control.

- [ ] **Step 5: Verify**

```bash
node --experimental-strip-types --test src/components/remember/scenes/narrative-scenes.test.mjs
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/remember/scenes src/components/remember/content src/app/remember/remember-gamefeel.css package.json
git commit -m "feat: complete REMEMBER narrative ending scenes"
```

---

### Task 8: Wire full scene orchestration through the transition director

**Files:**
- Create: `src/components/remember/system/remember-scene-identity.ts`
- Create: `src/components/remember/system/remember-scene-identity.test.mjs`
- Modify: `src/components/remember/remember-experience.tsx`
- Modify: `src/components/remember/remember-shell.tsx`
- Modify: `src/components/remember/scenes/boot-scene.tsx`
- Modify: `src/components/remember/scenes/menu-scene.tsx`
- Modify: `src/components/remember/scenes/restore-scene.tsx`
- Modify: `src/components/remember/audio/use-remember-audio.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `getRememberSceneIdentity(state): string`, returning `memory:hanamori`, `memory:mizukyo`, `memory:kurogane` rather than just `memory`.
- `RememberExperience` owns one `SceneTransitionDirector` and one preloader instance.

- [ ] **Step 1: Write scene-identity RED test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getRememberSceneIdentity } from "./remember-scene-identity.ts";

const state = { activeMemoryIndex: 0 };

test("memory identity changes when only activeMemoryIndex changes", () => {
  assert.equal(getRememberSceneIdentity({ ...state, scene: "memory", activeMemoryIndex: 0 }), "memory:hanamori");
  assert.equal(getRememberSceneIdentity({ ...state, scene: "memory", activeMemoryIndex: 1 }), "memory:mizukyo");
  assert.equal(getRememberSceneIdentity({ ...state, scene: "memory", activeMemoryIndex: 2 }), "memory:kurogane");
  assert.equal(getRememberSceneIdentity({ ...state, scene: "akari-reveal" }), "akari-reveal");
});
```

- [ ] **Step 2: Verify RED and implement identity helper**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-scene-identity.test.mjs
```

- [ ] **Step 3: Replace direct scene-changing dispatches with transition requests**

Use these variants/readiness groups:

```ts
Boot -> Menu: ritual-open, no extra group
Menu -> Hanamori: memory-enter, waitForGroup("entry")
Hanamori -> Mizukyo: memory-enter, waitForGroup("mizukyo")
Mizukyo -> Kurogane: memory-enter, waitForGroup("kurogane")
Kurogane -> Akari: memory-leave, waitForGroup("akari")
Akari -> Epilogue: narrative, no blocking video wait
Epilogue -> Credits: narrative, no blocking video wait
Credits -> "/": exit, router.push only while fully covered
```

Reducer action remains inside `commit()`; no transition helper duplicates the reducer rules.

- [ ] **Step 4: Render every reducer scene**

`RememberExperience` must include explicit branches for `akari-reveal`, `epilogue`, and `credits` in addition to Boot/Menu/Memory. Mount `SceneTransitionLayer` above scene content and below persistent controls. Pass `interactionLocked` down so CTAs and puzzle input cannot fire during a transition.

- [ ] **Step 5: Synchronize audio at narrative boundaries**

At Kurogane → Akari call `audio.enterAkariReveal()` only after the reducer commit. At epilogue → credits call `audio.enterCredits()` only after credits mounts. Do not remove the existing final-shard duck or per-memory restore-level behavior.

- [ ] **Step 6: Verify reducer + orchestration contracts**

```bash
node --experimental-strip-types --test src/components/remember/state/remember-reducer.test.mjs src/components/remember/system/scene-transition-state.test.mjs src/components/remember/system/remember-scene-identity.test.mjs
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/components/remember src/app/remember package.json
git commit -m "feat: orchestrate full REMEMBER scene flow"
```

---

### Task 9: Consolidate gamefeel CSS, responsive behavior, and reduced motion

**Files:**
- Modify: `src/app/remember/remember-gamefeel.css`
- Modify: `src/app/remember/remember-game.css`
- Modify: `src/app/remember/remember-puzzle.css`
- Modify: `src/app/remember/remember-cinematic.css`
- Modify: `src/app/remember/page.tsx`
- Create: `src/components/remember/system/remember-gamefeel-source.test.mjs`
- Modify: `package.json`

**Interfaces:**
- CSS-only contract exposed through `data-transition-*`, `data-memory-id`, `data-guidance-state`, and existing scene classes.

- [ ] **Step 1: Write source-level RED checks for required motion/fallback hooks**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../../../app/remember/remember-gamefeel.css", import.meta.url), "utf8");

test("gamefeel stylesheet covers transitions, loader, guidance and reduced motion", () => {
  assert.match(css, /remember-transition-layer/);
  assert.match(css, /remember-game-preloader/);
  assert.match(css, /remember-ghost-seam/);
  assert.match(css, /remember-guidance/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Verify RED, then consolidate visual rules**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-gamefeel-source.test.mjs
```

Move newly introduced rules into `remember-gamefeel.css`; do not duplicate existing restoration/Kintsugi rules. Keep existing memory-intro styling in `remember-cinematic.css` unless a selector must coordinate with transition cover.

- [ ] **Step 3: Apply restrained loop hierarchy**

Normal motion:

```css
.remember-boot__prompt { animation: remember-prompt-breathe 2.4s ease-in-out infinite; }
.remember-menu__begin { animation: remember-cta-float 2.8s ease-in-out infinite; }
```

CTA Y amplitude must stay between `-3px` and `3px`; no secondary control gets a perpetual float. Transition veil uses 0.6–1.1 s authored durations by variant. Narrative scenes may use a slow 1–2% image scale drift, not continuous large parallax.

- [ ] **Step 4: Responsive and reduced motion pass**

At `max-width: 900px`, keep all loose fragments discoverable and prevent centered menu title from colliding with controls. Under reduced motion, disable all keyframe loops and render transition phases as opacity-only with durations ≤300 ms.

- [ ] **Step 5: Verify**

```bash
node --experimental-strip-types --test src/components/remember/system/remember-gamefeel-source.test.mjs
npm run format:check
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/app/remember src/components/remember/system/remember-gamefeel-source.test.mjs package.json
git commit -m "style: unify REMEMBER gamefeel and reduced motion"
```

---

### Task 10: Full regression gate, PR, and localhost validation handoff

**Files:**
- Modify: `package.json` only if any new test file is not yet listed in `test:remember`.
- No production behavior changes are allowed in this task except fixes directly required by failing gates.

**Interfaces:**
- `npm run test:remember` must include every new pure/structural regression created in Tasks 1–9.

- [ ] **Step 1: Ensure the REMEMBER test command includes all new tests**

The command must include at least:

```text
src/components/shared/shared-ui.test.mjs
src/components/remember/system/scene-transition-state.test.mjs
src/components/remember/system/remember-preload-manifest.test.mjs
src/components/remember/system/remember-input-policy.test.mjs
src/components/remember/restore/puzzle-scatter.test.mjs
src/components/remember/restore/hanamori-guidance.test.mjs
src/components/remember/scenes/narrative-scenes.test.mjs
src/components/remember/system/remember-scene-identity.test.mjs
src/components/remember/system/remember-gamefeel-source.test.mjs
```

plus all pre-existing REMEMBER tests.

- [ ] **Step 2: Run the full local gate from a clean working tree**

```bash
npm install
npm run test:hero
npm run test:remember
npm run format:check
npm run lint
npm run build
```

Expected: all commands exit `0`. Existing lint warnings may remain only if they predate this branch; introduce zero new warnings.

- [ ] **Step 3: Run source sanity checks**

```bash
git grep -n "remember-sound-toggle.*<i" -- src/components/remember || true
git grep -n "src/components/experience/jp-reveal-text" -- src/components/remember || true
git grep -n "scene === \"akari-reveal\"\|scene === \"epilogue\"\|scene === \"credits\"" -- src/components/remember/remember-experience.tsx
```

Expected: no legacy one-line REMEMBER sound icon markup; no REMEMBER import of feature-specific JP reveal; all three final scene branches are present.

- [ ] **Step 4: Commit gate-only changes if package/test wiring changed**

```bash
git add package.json
git commit -m "test: gate REMEMBER gamefeel experience"
```

Skip this commit when `git diff --quiet` is true.

- [ ] **Step 5: Open a draft PR to `main`**

Title:

```text
feat: complete REMEMBER gamefeel and scene flow
```

Body must summarize: transition director, real preloader, centered Japanese→REMEMBER menu, shared LP sound control, Hanamori onboarding, seeded scatter difficulty, ghost seams, complete Akari/epilogue/credits ending, reduced-motion behavior, RED→GREEN evidence, and the localhost checklist below. Explicitly state **Do not merge automatically**.

- [ ] **Step 6: Wait for GitHub Quality and report exact status**

Required Quality steps: hero regression, REMEMBER regression, formatting, lint, build. Investigate unrelated repo-wide visual-QA failures separately; do not hide them and do not expand scope unless they are caused by this branch.

- [ ] **Step 7: Hand off localhost validation**

Validate these exact scenarios before marking the PR ready:

1. First visit shows the gamified loader with real asset count and then transitions into Boot without a hard cut.
2. Boot responds to click/tap and valid game-like keyboard keys; prompt breathes subtly.
3. Boot → Menu is covered by a transition; Menu is centered and `記憶` resolves into `REMEMBER`.
4. Menu CTA floats only a few pixels and shared three-bar sound control matches the LP.
5. Menu → Hanamori transitions through cover + existing chapter card; no abrupt screen swap.
6. Hanamori explains the mechanic, shows pale ghost seams, fires only restrained inactivity hints, and stops teaching after the first successful snap.
7. Hanamori pieces spawn visibly farther from targets and are not all aligned with their home regions.
8. Mizukyo is harder than Hanamori; Kurogane is harder than Mizukyo; a fresh run changes the scatter.
9. Ghost seams disappear before the true golden Kintsugi ritual begins.
10. Final shard still ducks the phase soundtrack and restoration completes normally.
11. Hanamori → Mizukyo → Kurogane transitions have no hard cuts or partially loaded frames.
12. Kurogane completion transitions to Akari instead of the empty moon shell.
13. Akari → epilogue → credits all progress; video failure/reduced motion still leaves usable static scenes.
14. Credits exit covers the screen before routing back to `/`.
15. Reduced-motion mode preserves all progression while removing loops, large transforms, blur, and decorative drift.
16. Mobile/touch keeps every loose fragment discoverable and does not overlap core controls.

- [ ] **Step 8: Stop for user validation**

Do not merge. Report branch, PR URL, CI state, tests, any pre-existing warnings, and which localhost behaviors need visual approval.
