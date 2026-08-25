# REMEMBER — Gamefeel, Scene Transitions and Puzzle Guidance

**Status:** Design approved in conversation; written spec pending user review before implementation planning.

**Baseline:** `main` at `195766f989376da588d0e40184529ec72a63931c` (PR #61 merged).

## 1. Context

REMEMBER now has a functional three-memory puzzle loop and a cinematic intro for each memory, but the experience still behaves like a set of React screens rather than a cohesive game flow.

The validated issues are:

- scene changes are abrupt because `RememberExperience` mounts/unmounts scenes directly from reducer state;
- the experience has no game-specific preloader tied to actual asset readiness;
- idle and interactive UI feedback is inconsistent across Boot, Menu and puzzle screens;
- the Menu composition is left-weighted and `REMEMBER` does not yet use Tsukihara's Japanese-to-localized-text reveal language;
- Hanamori does not teach the player what to do before expecting puzzle interaction;
- fragments spawn too close to their final locations, making all three puzzles too easy;
- the old premature Kintsugi seams were removed correctly, but that also removed a useful spatial affordance;
- REMEMBER has a separate sound control instead of the same three-bar audio control used by the live landing page;
- after Kurogane, the reducer advances to `akari-reveal`, but `RememberExperience` renders no `akari-reveal`, `epilogue` or `credits` scene, leaving only the dark shell and background moon visible.

This redesign must fix these issues as one coherent gamefeel system rather than as independent CSS patches.

## 2. Goals

1. Make every visual scene change feel authored and continuous.
2. Start REMEMBER with a real, gamified loading ritual rather than an abrupt first frame.
3. Establish a restrained game-UI motion vocabulary for idle, interaction and event feedback.
4. Recompose the Menu around a centered, cinematic `記憶 → REMEMBER` title reveal.
5. Teach Hanamori organically without presenting a conventional tutorial modal.
6. Make puzzle solving require observation by scattering fragments far from their target regions.
7. Restore spatial guidance through subtle ghost seams without exposing Kintsugi before the climax.
8. Share the landing page's current three-bar sound-control presentation with REMEMBER while keeping each experience's audio state independent.
9. Complete the narrative renderer so Kurogane flows into Akari, epilogue and credits instead of an empty shell.
10. Preserve accessibility, keyboard operation and `prefers-reduced-motion` behavior.

## 3. Non-goals

- Do not add a fourth memory or expand the core story.
- Do not replace the existing reducer with XState or another state-machine dependency.
- Do not replace GSAP.
- Do not redesign the core Kintsugi restoration timeline that already works after PR #61.
- Do not introduce arbitrary loading percentages or timers pretending to represent network progress.
- Do not turn every UI element into a looping animation; gamefeel must remain restrained and hierarchical.
- Do not alter the landing page's sound-control appearance as a side effect of sharing it.

## 4. Architectural direction

### 4.1 `SceneTransitionDirector`

Add a presentation-layer transition director between reducer state changes and rendered scenes.

The reducer remains the source of truth for **where the experience is**. The director owns only **how the player sees the change happen**.

Conceptual responsibilities:

- keep the outgoing scene mounted during its exit beat;
- cover the stage with a transition veil/interstitial;
- commit the reducer action at the covered point;
- mount the new scene behind the cover;
- run the incoming reveal;
- unlock interaction only after the incoming beat reaches its safe point;
- ignore or queue duplicate transition requests while one transition is active.

The director must also treat a memory-index change as a visual scene change even though the reducer remains in `scene: "memory"`. A transition identity therefore includes both `scene` and the active memory id/index.

Scene-changing actions should be invoked through a single transition request boundary, conceptually:

`requestTransition({ variant, commit: () => dispatch(action) })`

Actions that do not replace a visual scene — restoring a fragment, changing locale, toggling mute, restoration phase updates — continue to dispatch directly.

The transition director must not duplicate narrative progression rules from the reducer.

### 4.2 Transition variants

The director supports a small number of authored variants instead of a unique animation per component:

- **ritual-open:** preloader → Boot and Boot → Menu; dark veil opens into the next layer;
- **memory-enter:** Menu → Hanamori and memory-to-memory; cover, chapter card, scene emerge;
- **memory-leave:** restored memory → next narrative beat; residual scar/Kintsugi energy dissolves into darkness;
- **narrative:** Kurogane → Akari → epilogue → credits; slower, image-led cinematic dissolve;
- **exit:** REMEMBER → landing page; full dark cover before routing away.

Normal-motion targets should generally keep the transition-only portion in the 0.6–1.1 s range. The existing ~2.85 s memory chapter card remains the deliberate longer beat after the transition cover.

Reduced motion keeps the same semantic order but uses short opacity-only transitions, approximately 0.12–0.3 s per cover/reveal beat, with no blur, parallax or floating transforms.

## 5. Gamified preloader

### 5.1 Real readiness, not fake percentage

Create a `RememberGamePreloader` driven by an explicit REMEMBER asset manifest.

Critical visual assets for entering Boot/Menu/Hanamori must be decoded before the experience unlocks. At minimum this includes:

- menu background;
- global restoration overlays used by Hanamori;
- Hanamori broken/restored images;
- persistent decorative assets required by the first playable screen.

Mizukyo, Kurogane, Akari and ending media may continue preloading after Boot becomes available, provided their required assets are guaranteed before their corresponding transition commits.

Progress changes only when a tracked asset actually reaches ready/error resolution. A short completed-state hold is allowed for visual polish, but the percentage/count itself must never advance from a fake timer.

Audio/video readiness must not be allowed to deadlock the experience. Image decoding is the deterministic blocking readiness signal; audio and later video assets preload opportunistically and must have graceful fallbacks.

### 5.2 Preloader visual language

The preloader is part of the fiction:

- central lunar sigil / `月`;
- subtle circular ritual lines;
- fissures or memory marks accumulating as tracked assets resolve;
- restrained particles at meaningful progress events;
- copy such as `RECUPERANDO MEMÓRIAS` / localized equivalent;
- real count display such as `07 / 12` mapped to the manifest, presented as recovered memory fragments rather than a browser loader.

On completion, the sigil closes with one controlled pulse and transforms/dissolves into Boot through `ritual-open`. There must be no hard unmount between preloader and Boot.

## 6. Game-UI motion vocabulary

Motion is divided into three intensities.

### 6.1 Idle feedback

Used to tell the player that a static screen is alive and waiting.

Allowed examples:

- prompt opacity breathing;
- sigil glow breathing;
- one primary CTA floating only 2–4 px on Y over roughly 2.4–3.2 s;
- very slow decorative drift already present in the menu backdrop.

Idle motion must never compete with narrative copy.

### 6.2 Interactive feedback

Used only on controls and draggable puzzle pieces.

Examples:

- slight Y/X response on focus/hover;
- line growth;
- brighter edge/glow;
- subtle fragment lift on grab;
- target seam breathing only while its related fragment is active or while the contextual hint is firing.

### 6.3 Event feedback

Reserved for successful or important actions:

- fragment snap micro-pulse;
- `FRAGMENTO RESTAURADO` feedback;
- final-shard impact;
- Kintsugi propagation;
- restoration burst;
- scene-transition cover/reveal.

This tier is where stronger glow, particles and audio cues are allowed.

## 7. Boot screen

Boot should behave like a game title gate, not a static web CTA.

Requirements:

- whole-screen pointer activation remains available;
- keyboard activation accepts any meaningful non-modifier key when focus is not inside an unrelated interactive control;
- the main prompt uses a subtle blink/breathe loop comparable to traditional `PRESS ANY BUTTON` feedback;
- the lunar sigil receives a very slow glow/rotation-orbit accent, not a continuously spinning loader;
- successful activation transitions through the director instead of instantly replacing Boot with Menu;
- all loops are suppressed or converted to static states under reduced motion.

The prompt may be localized as an equivalent of `APERTE QUALQUER BOTÃO PARA LEMBRAR` / `PRESS ANY BUTTON TO REMEMBER`, while pointer/touch users can still activate by clicking/tapping the full gate.

## 8. Menu redesign

The Menu composition becomes centered both horizontally and visually.

Primary hierarchy:

1. small eyebrow: `UMA EXPERIÊNCIA DE TSUKIHARA` / localized equivalent;
2. Japanese seed word `記憶`;
3. Japanese glyph scrambling resolves into the localized title `REMEMBER`;
4. restrained ritual line/sigil accent;
5. primary `INICIAR` / `BEGIN` CTA;
6. thesis line beneath, optionally using the same Japanese-to-localized reveal language.

The existing Japanese reveal behavior should be shared rather than duplicated. `JpRevealText` should move to a neutral/shared component boundary so the landing page and REMEMBER consume the same implementation without importing feature-specific `experience` internals.

Only the primary CTA receives a continuous Y float. Language, sound and exit controls remain stable and respond only to hover/focus/state.

## 9. Shared sound control

The live landing page currently uses the `ix-sound` control with a three-bar icon and label. REMEMBER should use the same presentation.

Extract a shared presentational audio-control component that accepts:

- `muted` / active state;
- localized accessible label;
- click handler;
- optional visible label behavior appropriate to the consuming shell.

The landing page keeps its existing audio element/state. REMEMBER keeps `useRememberAudio`, including soundtrack ducking during restoration. Only the control presentation and interaction affordance are shared.

Visual parity with the current landing-page three-bar icon is a regression requirement.

## 10. Hanamori onboarding

The first memory teaches the mechanic without a modal or a screen titled `Tutorial`.

### 10.1 Guidance sequence

After the Hanamori chapter card and scene reveal:

1. show `RECONSTRUA A MEMÓRIA`;
2. show localized supporting copy equivalent to `Arraste os fragmentos e devolva-os ao lugar ao qual pertencem.`;
3. apply a one-time subtle glow to an appropriate loose fragment;
4. breathe the corresponding ghost seam once;
5. when that fragment begins dragging, update supporting copy to the equivalent of `Encontre a cicatriz à qual este fragmento pertence.`;
6. when the first fragment snaps, display `FRAGMENTO RESTAURADO · 01 / 05` with a small event pulse and existing audio feedback;
7. dissolve the onboarding copy and mark the mechanic as learned for the current REMEMBER run.

Mizukyo and Kurogane never replay this onboarding once the first successful Hanamori snap has occurred.

### 10.2 Inactivity hint

If Hanamori has zero restored fragments and no active drag for approximately 5 seconds after onboarding becomes interactive, fire one restrained contextual hint:

- move the highlighted loose fragment only 2–4 px toward its target and return;
- briefly raise the matching ghost seam opacity.

No hand pointer, arrow, flashing target marker or automatic movement into the solution.

The hint may repeat only at a low cadence if the player remains inactive; it must stop permanently after the first successful snap.

## 11. Puzzle scatter and difficulty

### 11.1 Problem with the current layout

Current fragment definitions use small normalized offsets and low rotations, causing most pieces to start near the region they belong to. This makes recognition unnecessary.

### 11.2 New scatter model

Separate the **assembly target space** from the **loose-fragment spawn space**.

A seeded session scatter generator produces spawn transforms from a controlled set of peripheral regions around the central reconstruction area. The seed changes on a new run so the puzzle is not memorized, but deterministic seeded generation allows stable tests and reproducible debugging.

The generator must enforce:

- minimum distance from each fragment's correct region;
- viewport/stage safe zones so fragments do not spawn under header controls or outside draggable bounds;
- bounded overlap between loose fragments;
- no fragment completely occludes another;
- all fragments remain discoverable on desktop and touch layouts;
- target accuracy and snap semantics remain unchanged;
- the scatter result is independent from narrative state.

Loose pieces may use a modest temporary scale below 1 when necessary to fit peripheral spawn regions, but they must interpolate back to exact scale 1 as they magnetize/snap into the assembly.

### 11.3 Difficulty calibration

Target calibration:

| Memory | Pieces | Spawn distance | Rotation range | Guidance |
| --- | ---: | --- | --- | --- |
| Hanamori | 5 | moderate/high | roughly ±8–15° | strongest |
| Mizukyo | 7 | high | roughly ±12–20° | medium |
| Kurogane | 9 | highest | roughly ±16–28° | weakest |

Exact numeric bounds can be tuned during localhost validation, but difficulty must be monotonic: Kurogane cannot produce an easier aggregate layout than Hanamori under the same viewport class.

## 12. Ghost seams versus Kintsugi

Two separate visual systems must exist.

### 12.1 Ghost seams during gameplay

Ghost seams communicate the broken topology of the memory without claiming it has already been repaired.

Visual rules:

- neutral/pale lunar tone, not saturated gold;
- low base opacity;
- no restoration particles;
- no Kintsugi bloom;
- related seam may brighten slightly while its fragment is actively dragged;
- Hanamori may show the strongest baseline guidance, Mizukyo less, Kurogane minimal.

Suggested starting opacity ranges are approximately 10–15% for Hanamori, 6–10% for Mizukyo and 3–7% for Kurogane, subject to visual calibration.

### 12.2 Kintsugi after completion

The actual existing golden `KintsugiSeams` remain absent from normal puzzle play and begin only when the restoration ritual reaches the Kintsugi phase after the final shard.

The ghost seam layer must fade/transform out before or as the true Kintsugi propagation begins so the player perceives a clear transformation rather than two overlapping line systems.

## 13. Completing the narrative ending

The reducer already defines:

`memory (Kurogane) → akari-reveal → epilogue → credits`

The renderer must support the same state graph.

Add explicit scene renderers for:

- **Akari reveal:** use the existing `rememberAssets.akariReveal` and localized Akari copy;
- **Epilogue:** use `rememberAssets.epilogueEclipse` when available, with a static visual fallback if video fails or reduced-data/motion policy requires it;
- **Credits:** use `rememberAssets.creditsLoop` when appropriate, with a static fallback and the existing final CTA back to Tsukihara.

Existing older reveal-scene code may provide motion primitives, but hardcoded Hanamori-specific semantics must not be reused unchanged for the Akari state.

Every final-scene continuation must go through `SceneTransitionDirector`.

## 14. Failure and fallback behavior

- Asset preload failure: resolve the manifest item as failed, log in development, use the best available CSS/static fallback, and never leave the player permanently on the loader.
- Transition interruption/unmount: kill GSAP timelines and leave the director in a recoverable state; never retain `pointer-events: none` after cleanup.
- Duplicate user activation during transition: ignore duplicate requests until the current transition reaches idle.
- Video failure in epilogue/credits: render static visual + copy and preserve progression controls.
- Audio autoplay failure: keep REMEMBER muted and leave the shared control usable.
- Reduced motion: preserve progression and interaction timing semantics while removing nonessential movement.

## 15. Accessibility

- All primary controls remain keyboard accessible.
- Boot's any-key handler must not hijack modifier-only events or inputs that should keep native interaction.
- Transition covers must not move focus into hidden outgoing content.
- Focus should move to the primary semantic target of the incoming scene only after the scene becomes interactive.
- Decorative prompts, particles and seams remain `aria-hidden`.
- `JpRevealText` exposes the resolved localized string to assistive technology throughout the visual scramble.
- Sound state uses `aria-pressed` and localized `aria-label` values.

## 16. Testing strategy

Implementation follows RED → GREEN.

Required automated coverage:

1. **Transition director contracts**
   - reducer commit occurs at covered phase, not before exit;
   - duplicate requests are rejected/queued deterministically;
   - memory index changes create transitions even when `scene` remains `memory`;
   - cleanup cannot leave interaction locked.

2. **Preloader manifest**
   - progress derives from actual resolved manifest items;
   - completion requires critical items;
   - failures cannot deadlock completion;
   - later memory assets can remain secondary.

3. **Puzzle scatter invariants**
   - deterministic for a fixed seed;
   - different seed changes layout;
   - minimum target distance respected;
   - bounds/safe-zone rules respected;
   - overlap constraint respected;
   - difficulty config increases Hanamori → Mizukyo → Kurogane.

4. **Guidance policy**
   - onboarding appears only for Hanamori before mechanic learned;
   - first successful snap permanently dismisses it for the run;
   - inactivity hint cannot fire during drag or after first snap.

5. **Seam policy**
   - ghost seams are available during gameplay according to memory difficulty;
   - true Kintsugi remains unmounted until the Kintsugi restoration phase.

6. **Narrative render coverage**
   - every reducer scene has a renderer;
   - final memory can progress through Akari → epilogue → credits without an empty stage.

7. **Shared sound control**
   - landing page and REMEMBER consume the shared presentational control;
   - REMEMBER mute state remains independent of LP state;
   - existing restoration duck behavior remains covered.

8. **Reduced motion**
   - semantic scene order preserved;
   - no perpetual transform loops required for interaction.

Existing `test:hero`, `test:remember`, `format:check`, `lint` and `build` remain mandatory gates.

## 17. Localhost visual acceptance

The implementation is not considered complete until manual validation confirms:

- no scene swaps abruptly from one full composition to another;
- loader progress visibly corresponds to real asset resolution and always exits;
- Boot feels alive while idle without becoming noisy;
- Boot → Menu is visibly transitioned;
- Menu is centered and `記憶` visibly resolves into `REMEMBER`;
- only the main Menu CTA floats continuously;
- REMEMBER's sound control visually matches the landing page's three-bar control;
- Hanamori teaches the first drag/snap without a traditional tutorial modal;
- Hanamori pieces spawn clearly away from their own target regions;
- Mizukyo is harder than Hanamori and Kurogane is harder than Mizukyo;
- ghost seams help spatial reading without looking like finished golden Kintsugi;
- golden Kintsugi begins only after the final fragment;
- completing Kurogane never produces the empty dark `月` shell;
- Akari, epilogue and credits all render and transition cleanly;
- all interactions remain functional with reduced motion enabled.

## 18. Implementation boundary

This spec intentionally defines the architecture and acceptance criteria, not the exact commit sequence. After the written spec is approved, create a dedicated implementation plan that decomposes the work into independently testable TDD slices. Production code must not be changed on this design branch before that plan is approved/executed in the normal project workflow.
