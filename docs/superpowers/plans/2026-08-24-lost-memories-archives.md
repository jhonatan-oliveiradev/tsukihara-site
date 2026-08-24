# Lost Memories / Arquivos de Tsukihara Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current post-Mother-Moon `ExperiencePillars` section with an interactive, diegetic Lost Memories archive that makes the Eclipse feel personal through letters, spiritual photographs, relics, realm records, lunar observations, BLACK-00 and AKR-001.

**Architecture:** Introduce a localized data model plus a focused `LostMemoriesChapter` family of components. Desktop uses a bounded freeform archive-table composition over the final L11 background; mobile switches to a linear editorial sequence. One chapter-level `openRecordId` controls a diegetic foreground viewer, while a local GSAP hook handles only intimate archive motion and never introduces long scroll pinning.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, Next/Image, GSAP 3.13 + ScrollTrigger, existing Lenis integration, CSS, no new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-08-24-lost-memories-archives-design.md`

## Global Constraints

- Preserve `id="lore"` and `data-section` so the existing main navigation keeps working.
- Replace `ExperiencePillars` only in the immersive sequence; do not redesign `MotherMoonChapter` or `CinematicEpilogue` in this scope.
- Use only final assets already present under `public/09-lore-archives`; do not generate substitutes or placeholders.
- Desktop archive should read as an imperfect physical archive, not a uniform card grid, carousel, or SaaS dashboard.
- At `<= 900px`, abandon freeform overlap and render a vertical editorial sequence with tap interactions and no hover dependency.
- Open state must be diegetic rather than a generic modal while still providing semantic focus management, Escape-to-close, and a clear close control.
- Memory Decay is visual-only, limited to Hanamori and Lunar Observation 441, preserves accessible source text, and is disabled by `prefers-reduced-motion`.
- BLACK-00 uses a short ~1–1.5s theatrical silence for normal motion; reduced-motion users receive the content without waiting.
- Motion uses small lifts, restrained rotations, paper/glass/ink reactions and no long pinning, heavy parallax, heavy glitch, or global cursor effect.
- Do not add a new animation or testing library. Repository quality gates remain `npm run format:check`, `npm run lint`, and `npm run build`.

---

## File Structure

### Create

- `src/content/lost-memories.ts` — localized PT/EN archive data, item metadata, realm fragments, status vocabulary and asset references.
- `src/components/experience/lost-memories/lost-memories-types.ts` — shared archive item, status, group and crop/hotspot interfaces.
- `src/components/experience/lost-memories/memory-decay-text.tsx` — accessible visual word-decay treatment.
- `src/components/experience/lost-memories/archive-record-viewer.tsx` — diegetic Open state with focus management and BLACK-00 timing.
- `src/components/experience/lost-memories/archive-realm-records.tsx` — documentary nine-realm annotations anchored to L06.
- `src/components/experience/lost-memories/archive-table.tsx` — desktop freeform archive surface plus mobile linear archive content.
- `src/components/experience/lost-memories/use-lost-memories-motion.ts` — local intro/table/closing GSAP behaviors.
- `src/components/experience/lost-memories-chapter.tsx` — chapter shell, intro, archive index, open-record state, closing AKR-001 and L12 transition.
- `src/app/lost-memories-chapter.css` — complete visual system, desktop/tablet/mobile states, viewer, focus, reduced-motion behavior.

### Modify

- `src/components/experience/immersive-experience.tsx` — replace `ExperiencePillars` import/render with `LostMemoriesChapter` while preserving `#lore` navigation semantics.
- `src/app/layout.tsx` — import `lost-memories-chapter.css` after Mother Moon styles and before downstream site sections.

### Intentionally leave unchanged

- `src/components/experience/experience-pillars.tsx` — can remain unused for now; deleting unrelated legacy CSS/component code is not required for this feature.
- `src/components/experience/cinematic-epilogue.tsx` — later philosophical climax work is out of scope.
- `src/components/experience/mother-moon-chapter.tsx` — no additional changes in this feature.

---

### Task 1: Define the archive data model and localized content

**Files:**
- Create: `src/components/experience/lost-memories/lost-memories-types.ts`
- Create: `src/content/lost-memories.ts`

**Interfaces:**
- Produces `ArchiveStatus`, `ArchiveGroupId`, `ArchiveItemKind`, `ArchiveAssetCrop`, `ArchiveHotspot`, `ArchiveRecord`, `RealmArchiveRecord`, and `LostMemoriesCopy`.
- Produces `lostMemoriesCopy: Record<Locale, LostMemoriesCopy>` consumed by every later task.
- Asset paths are canonical strings rooted at `/09-lore-archives/...`.

- [ ] **Step 1: Create shared archive types**

Define exact public shapes:

```ts
export type ArchiveStatus = "PRESERVED" | "FRAGMENTED" | "UNSTABLE" | "CORRUPTED" | "SEALED";

export type ArchiveGroupId = "letters" | "photographs" | "relics" | "realms" | "lunar";

export type ArchiveItemKind = "letter" | "photograph" | "relic" | "realm" | "lunar" | "black";

export type ArchiveAssetCrop = {
  objectPosition?: string;
  clipPath?: string;
};

export type ArchiveHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ArchiveRecord = {
  id: string;
  group: ArchiveGroupId;
  kind: ArchiveItemKind;
  code: string;
  title: string;
  status: ArchiveStatus;
  asset: string;
  story: string[];
  annotation?: string;
  crop?: ArchiveAssetCrop;
  decay?: boolean;
  hotspot?: ArchiveHotspot;
};

export type RealmArchiveRecord = {
  id: string;
  code: string;
  realm: string;
  status: ArchiveStatus;
  memoryType: string;
  lastVerified: string;
  fragment: string;
  sealed?: boolean;
};
```

- [ ] **Step 2: Encode all PT and EN chapter copy in `lost-memories.ts`**

Include:

- intro eyebrow/headline/support paragraphs;
- index labels;
- five group headlines;
- L01–L03 letters with exact Portuguese source copy and faithful English localization;
- spiritual photograph record labels/crops sourced from L04;
- five relic records/hotspots sourced from L05;
- nine realm records and fragments;
- Lunar Observation 441;
- BLACK-00 reveal text;
- transition copy;
- AKR-001 metadata and final signature.

Use the final asset mapping:

```ts
const assets = {
  hanamori: "/09-lore-archives/letters/l01-hanamori-letter.png",
  hinokagura: "/09-lore-archives/letters/l02-hinokagura-letter.png",
  amahara: "/09-lore-archives/letters/l03-amahara-letter.png",
  photographs: "/09-lore-archives/photographs/l04-spirit-photographs.png",
  relics: "/09-lore-archives/relics/l05-memory-relics.png",
  realms: "/09-lore-archives/records/l06-nine-realms-archive-map.png",
  lunar: "/09-lore-archives/records/l07-lunar-observation-diagram.png",
  black: "/09-lore-archives/records/l08-black-archive-document.png",
  fragments: "/09-lore-archives/fx/l09-memory-fragments-overlay.png",
  akari: "/09-lore-archives/records/l10-akari-memory-record.png",
  table: "/09-lore-archives/backgrounds/l11-archive-table-background.png",
  transition: "/09-lore-archives/fx/l12-forget-remember-transition.png",
} as const;
```

- [ ] **Step 3: Ensure content is type-checked by TypeScript**

Run:

```bash
npm run build
```

Expected: Next production compilation succeeds and all `LostMemoriesCopy` objects satisfy the shared interfaces.

- [ ] **Step 4: Commit the data contract**

```bash
git add src/content/lost-memories.ts src/components/experience/lost-memories/lost-memories-types.ts
git commit -m "feat: define Lost Memories archive data"
```

---

### Task 2: Build accessible Memory Decay and the diegetic record viewer

**Files:**
- Create: `src/components/experience/lost-memories/memory-decay-text.tsx`
- Create: `src/components/experience/lost-memories/archive-record-viewer.tsx`

**Interfaces:**
- Consumes `ArchiveRecord` from Task 1.
- Produces `MemoryDecayText({ text, active }: { text: string; active: boolean })`.
- Produces `ArchiveRecordViewer({ record, onClose, restoreFocusRef, locale }: ArchiveRecordViewerProps)`.

- [ ] **Step 1: Implement `MemoryDecayText` with accessible duplicate semantics**

Render complete source text once for assistive technology and a separate visual word layer marked `aria-hidden="true"`.

Behavior:

```tsx
<span className="ix-archive-decay" data-memory-decay={active ? "active" : undefined}>
  <span className="sr-only">{text}</span>
  <span aria-hidden="true" className="ix-archive-decay__visual">
    {text.split(/(\s+)/).map((token, index) => (
      <span key={`${token}-${index}`} data-decay-word={index % 5 === 2 ? "true" : undefined}>
        {token}
      </span>
    ))}
  </span>
</span>
```

The component itself does not remove text. CSS transitions selected `[data-decay-word]` spans only while the parent viewer has its decay-active state.

- [ ] **Step 2: Implement viewer focus lifecycle**

The viewer must:

- render only when `record !== null`;
- use an internal foreground panel inside the chapter, not a portal/generic dialog component;
- expose `role="dialog"`, `aria-modal="true"`, `aria-labelledby`;
- focus the close button on open;
- close on Escape;
- call `restoreFocusRef.current?.focus()` after close;
- lock interaction with the archive surface through chapter-level `data-archive-open` styling rather than global body scroll locking.

- [ ] **Step 3: Implement normal records and decay activation**

For `record.decay === true`, begin decay after ~3.5 seconds using a timer. Restore visual words on viewer pointer movement, hover/focus within the story region, and cancel timers on record change/unmount.

Use reduced-motion media query in JS to skip decay timing entirely.

- [ ] **Step 4: Implement BLACK-00 timing**

For `record.kind === "black"`:

- set local phase `"silent" | "revealed"`;
- normal motion: start in `silent`, reveal after 1200ms;
- reduced motion: render `revealed` immediately;
- show exactly the localized forbidden statement plus `Remaining data corrupted.` after reveal.

- [ ] **Step 5: Verify viewer static quality**

Run:

```bash
npm run lint
npm run build
```

Expected: no hook dependency warnings, no invalid ARIA errors reported by lint/build, and TypeScript accepts all record branches.

- [ ] **Step 6: Commit viewer primitives**

```bash
git add src/components/experience/lost-memories/memory-decay-text.tsx src/components/experience/lost-memories/archive-record-viewer.tsx
git commit -m "feat: add diegetic Lost Memories viewer"
```

---

### Task 3: Build Letters, Spiritual Photographs and Relic interactions inside the archive table

**Files:**
- Create: `src/components/experience/lost-memories/archive-table.tsx`

**Interfaces:**
- Consumes localized `LostMemoriesCopy` and `ArchiveRecord` data from Task 1.
- Receives `onOpen(record: ArchiveRecord, trigger: HTMLButtonElement): void` from the chapter.
- Produces group anchors `archive-letters`, `archive-photographs`, and `archive-relics` used by the index.

- [ ] **Step 1: Build the reusable inspectable record control**

Inside `archive-table.tsx`, create a small private `ArchiveItem` helper that renders a real `<button type="button">` with:

- `data-archive-item`;
- `data-archive-kind`;
- archive code/status metadata revealed by CSS on hover/focus-visible;
- Next/Image as decorative image (`alt=""`), because the story/metadata is repeated in text;
- `onClick={(event) => onOpen(record, event.currentTarget)}`.

Do not introduce a generic Card component.

- [ ] **Step 2: Compose the Letters group with L01–L03**

Desktop:

- three independently positioned paper controls;
- deliberate overlap, but each remains independently focusable;
- distinct 1–2° rotations set through CSS custom properties, not dynamic React state;
- Hanamori is visually strongest but does not become a full-screen hero.

Mobile:

- cards become normal-flow archive records with asset followed by code/status/short excerpt.

- [ ] **Step 3: Compose L04 as multiple spiritual plate crops**

Create five records using the same L04 asset with different `object-position`/clip wrappers from the data model.

Each plate should expose:

- a subtle glass reflection layer;
- a removable/dissolving internal mask on hover/focus;
- readable labels outside the image rather than relying on the crop itself.

No image remounting or source swapping on hover.

- [ ] **Step 4: Compose L05 as one relic sheet with semantic hotspots**

Render the L05 sheet once.

Overlay five transparent-but-visible-on-focus buttons using the normalized hotspot percentages from `lost-memories.ts`. Each hotspot opens its corresponding relic record and has a real `aria-label`.

Desktop Inspect response uses localized ring/glow pseudo-elements. Mobile replaces absolute hotspots with explicit stacked relic buttons/descriptions below the asset.

- [ ] **Step 5: Verify keyboard reachability in code structure**

Inspect the rendered component code to ensure every letter, photograph plate and relic hotspot is a `<button>` and no interaction depends solely on `onMouseEnter`.

Run:

```bash
npm run lint
npm run build
```

- [ ] **Step 6: Commit the archive table core**

```bash
git add src/components/experience/lost-memories/archive-table.tsx
git commit -m "feat: build Lost Memories archive table"
```

---

### Task 4: Add Nine-Realm records and Lunar/BLACK-00 archive zones

**Files:**
- Create: `src/components/experience/lost-memories/archive-realm-records.tsx`
- Modify: `src/components/experience/lost-memories/archive-table.tsx`

**Interfaces:**
- `ArchiveRealmRecords({ records, mapAsset, onOpen }: ArchiveRealmRecordsProps)` consumes `RealmArchiveRecord[]` and maps each realm into an inspectable annotation.
- `archive-table.tsx` adds anchors `archive-realms` and `archive-lunar`.

- [ ] **Step 1: Implement the realm documentary surface around L06**

Desktop:

- render L06 as the visual anchor;
- distribute nine record annotations around/over the map with intentionally varied placement classes;
- connect annotations to map positions with simple CSS leader lines/pseudo-elements;
- make each record keyboard-focusable and openable;
- Tsuki no Miya remains `SEALED` and never invents hidden story text.

Mobile:

- show L06 once;
- render the nine records below it in a readable linear archive list.

- [ ] **Step 2: Add L07 Lunar Observation 441**

Render the lunar diagram as a large technical plate with nearby metadata and an open control. Mark its record with `decay: true` so the viewer applies Memory Decay only after opening.

- [ ] **Step 3: Add L08 BLACK-00**

Place BLACK-00 at the edge of the lunar zone so it appears visually withheld rather than centered.

Use status `CORRUPTED`, code `ARCHIVE / BLACK-00`, and `kind: "black"` so Task 2's viewer applies the silence/reveal path.

- [ ] **Step 4: Verify all five index anchors exist exactly once**

Expected ids:

```text
archive-letters
archive-photographs
archive-relics
archive-realms
archive-lunar
```

Run:

```bash
npm run build
```

- [ ] **Step 5: Commit realm and lunar zones**

```bash
git add src/components/experience/lost-memories/archive-realm-records.tsx src/components/experience/lost-memories/archive-table.tsx
git commit -m "feat: add realm and lunar archive records"
```

---

### Task 5: Compose the chapter shell, archive index, opening/closing flow and AKR-001

**Files:**
- Create: `src/components/experience/lost-memories-chapter.tsx`

**Interfaces:**
- Exports `LostMemoriesChapter({ locale }: { locale: Locale })`.
- Owns `openRecordId: string | null` and the last trigger ref used for focus restoration.
- Consumes `ArchiveTable`, `ArchiveRecordViewer`, `lostMemoriesCopy`, and `useLostMemoriesMotion`.

- [ ] **Step 1: Build the intro and preserve navigation semantics**

Root:

```tsx
<section id="lore" data-section className="ix-archive" ref={rootRef}>
```

Render:

- `LOST MEMORIES / ARCHIVE 09`;
- localized main headline;
- support paragraphs;
- restrained vertical index whose links use `href="#archive-letters"` etc.

Do not create tabs or selected-index React state.

- [ ] **Step 2: Implement chapter-level open record state**

On item open:

```ts
const openRecord = (record: ArchiveRecord, trigger: HTMLButtonElement) => {
  lastTriggerRef.current = trigger;
  setOpenRecordId(record.id);
};
```

Resolve the selected record from a flattened localized record collection. Pass it to `ArchiveRecordViewer` and close through one handler that sets state to `null` and restores focus.

- [ ] **Step 3: Mount L11 and L09 as ambience without blocking interactions**

Use L11 as the archive background surface and L09 as a pointer-events-none fragment/dust overlay. Both are decorative and `aria-hidden`.

- [ ] **Step 4: Add transition thesis copy**

Render in two beats after the table:

- `Um mundo não desaparece quando suas cidades caem.`
- `Desaparece quando ninguém consegue mais contar que elas existiram.`

Give each a dedicated data attribute for local motion.

- [ ] **Step 5: Add isolated AKR-001 ending with L10**

Render only:

```text
MEMORY RECORD / AKR-001
OWNER: AKARI
STATUS: UNKNOWN
```

Do not make L10 openable and do not reveal additional body copy.

Render `REMEMBER WHAT REMAINS.` below it.

- [ ] **Step 6: Add L12 transition field**

Render L12 as the final archive visual handoff, with non-interactive labels `ESQUECER` and `LEMBRAR` placed on opposing sides. This prepares the next act but does not alter `CinematicEpilogue`.

- [ ] **Step 7: Verify chapter compiles**

Run:

```bash
npm run lint
npm run build
```

- [ ] **Step 8: Commit chapter composition**

```bash
git add src/components/experience/lost-memories-chapter.tsx
git commit -m "feat: compose Lost Memories chapter"
```

---

### Task 6: Implement archive visual language, responsive composition and local motion

**Files:**
- Create: `src/app/lost-memories-chapter.css`
- Create: `src/components/experience/lost-memories/use-lost-memories-motion.ts`

**Interfaces:**
- `useLostMemoriesMotion(rootRef: RefObject<HTMLElement | null>)` initializes/reverts a GSAP context scoped to the chapter.
- CSS consumes data attributes/classes created in Tasks 2–5.

- [ ] **Step 1: Define chapter palette and document material styles**

Use chapter-scoped custom properties such as:

```css
.ix-archive {
  --archive-ink: #171316;
  --archive-paper: #d8cbb2;
  --archive-paper-bright: #ede4d4;
  --archive-wine: #6f252f;
  --archive-gold: #a99062;
  --archive-lunar: #e5e2db;
  --archive-black: #050507;
}
```

Keep red restrained. The surface should feel historical/charcoal/ivory rather than crimson-cinematic.

- [ ] **Step 2: Build desktop freeform composition**

At `min-width: 901px`:

- constrain content to `min(94vw, 1800px)`;
- use bounded relative group canvases rather than one uncontrolled whole-page absolute layer;
- place letters/photos/relics/realm/lunar groups asymmetrically;
- ensure every readable metadata block remains within the group bounds;
- keep item rotations within ±2°;
- keep Inspect lifts within 4–10px;
- use `:focus-visible` parity with `:hover`.

- [ ] **Step 3: Style diegetic viewer**

Open state should:

- dim/desaturate the table behind the selected record;
- lift foreground record with a shallow scale/translate only;
- make the selected asset and story legible without a white rectangular modal shell;
- show archive code/status around the physical object/document;
- style the close control as archival notation while retaining a generous hit area.

For BLACK-00, use a chapter-level `data-black-phase="silent"` state to remove most decorative contrast during the 1200ms pause.

- [ ] **Step 4: Implement Memory Decay CSS**

Only selected visual words fade/blur when `[data-memory-decay="active"]` is present. Restore them on `.ix-archive-viewer__story:hover` and `:focus-within`.

Never hide the `sr-only` source text.

- [ ] **Step 5: Implement mobile editorial mode at `max-width: 900px`**

- remove absolute/freeform positioning;
- stack groups and records vertically;
- keep images large and unclipped;
- turn relic interaction into explicit rows/buttons;
- render realm records as a normal list;
- viewer becomes a full-width in-flow/overlay inspection surface optimized for tap;
- no hover-only metadata;
- no drag behavior.

- [ ] **Step 6: Implement reduced-motion CSS**

At `prefers-reduced-motion: reduce`:

- remove transition/animation transforms;
- show all essential text immediately;
- disable Memory Decay visual fading;
- keep viewer and close interactions functional.

- [ ] **Step 7: Implement local GSAP motion hook**

Inside a scoped `gsap.context`:

- intro eyebrow/title/support reveal without pinning;
- archive table/group entrance with 8–16px physical settling;
- spirit-photo mask/reflection subtle reveal;
- transition thesis two-beat reveal;
- archive-emptying effect by fading decorative L09 and nonessential table layers near the close;
- AKR-001 reveal;
- L12 fissure/transition reveal.

Do not animate any global selectors outside the chapter root.

- [ ] **Step 8: Verify style and hook quality**

Run:

```bash
npm run format:check
npm run lint
npm run build
```

Expected: all three succeed.

- [ ] **Step 9: Commit visual system**

```bash
git add src/app/lost-memories-chapter.css src/components/experience/lost-memories/use-lost-memories-motion.ts
git commit -m "style: add Lost Memories archive visual system"
```

---

### Task 7: Integrate Lost Memories into the immersive sequence

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Replace the rendered `ExperiencePillars` instance with `LostMemoriesChapter`.
- Preserve existing `nav` entry that points to `#lore`; no nav data model change required.

- [ ] **Step 1: Replace component import/render**

Change:

```tsx
import { ExperiencePillars } from "@/components/experience/experience-pillars";
```

to:

```tsx
import { LostMemoriesChapter } from "@/components/experience/lost-memories-chapter";
```

And replace:

```tsx
<ExperiencePillars copy={copy} locale={locale} />
```

with:

```tsx
<LostMemoriesChapter locale={locale} />
```

Do not modify the ordering around `MotherMoonChapter` and `CinematicEpilogue`.

- [ ] **Step 2: Import the chapter stylesheet**

In `src/app/layout.tsx`, add:

```ts
import "./lost-memories-chapter.css";
```

after Mother Moon styles so the archive can establish its own visual language before later global section styles.

- [ ] **Step 3: Run repository quality gates**

```bash
npm run format:check
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit integration**

```bash
git add src/components/experience/immersive-experience.tsx src/app/layout.tsx
git commit -m "feat: replace gameplay pillars with Lost Memories archive"
```

---

### Task 8: Manual interaction, responsive and accessibility verification

**Files:**
- Modify only files already in scope if validation exposes defects.

**Interfaces:**
- No new public interface.

- [ ] **Step 1: Validate desktop at 1536×864**

Verify:

- Mother Moon flows directly into Lost Memories;
- archive does not resemble a uniform card grid;
- L11 reads as the underlying table;
- L01–L10 assets appear sharp and correctly framed;
- letters/photos/relics overlap intentionally without hiding interactive targets;
- index links scroll to all five groups;
- hover lifts remain subtle;
- no horizontal page overflow.

- [ ] **Step 2: Validate Open state and keyboard flow**

Using keyboard only:

1. Tab to a letter.
2. Confirm Inspect metadata appears on focus-visible.
3. Press Enter.
4. Confirm foreground viewer opens and close control receives focus.
5. Press Escape.
6. Confirm focus returns to the same archive item.
7. Repeat on a relic hotspot and realm record.

- [ ] **Step 3: Validate Memory Decay**

Open Hanamori and leave it untouched for at least 3.5 seconds. Confirm only selected visual words begin fading, full readable story remains present, and pointer/focus interaction restores the words.

Repeat on Lunar Observation 441.

Confirm no other archive record decays.

- [ ] **Step 4: Validate BLACK-00**

Open BLACK-00:

- background becomes visually quiet;
- after roughly 1.2s, the forbidden statement appears;
- `Remaining data corrupted.` follows;
- close/Escape remain responsive throughout.

- [ ] **Step 5: Validate responsive widths**

Check at minimum:

```text
1440×900
1366×768
1024×768
900×900
768×1024
390×844
```

At `<= 900px`, confirm:

- no freeform table positioning survives;
- no hover requirement;
- no clipped records;
- relic descriptions are explicit tap targets;
- realm records are readable vertically;
- viewer fits the viewport and can close without trapping page scroll incorrectly.

- [ ] **Step 6: Validate reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm:

- content is immediately readable;
- no Memory Decay;
- BLACK-00 content does not force a theatrical wait;
- viewer opens/closes without animated dependency;
- section remains visually coherent.

- [ ] **Step 7: Validate transition boundaries**

Confirm:

- Mother Moon visuals/motion are unchanged before the chapter;
- `CinematicEpilogue` is unchanged after the L12 handoff;
- `#lore` nav highlights/scroll tracking still activates for Lost Memories;
- no old `ExperiencePillars` content remains in the rendered immersive sequence.

- [ ] **Step 8: Run final repository gates after any visual fixes**

```bash
npm run format:check
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 9: Review final diff**

Expected feature diff should contain only:

```text
docs/superpowers/specs/2026-08-24-lost-memories-archives-design.md
docs/superpowers/plans/2026-08-24-lost-memories-archives.md
src/app/layout.tsx
src/app/lost-memories-chapter.css
src/components/experience/immersive-experience.tsx
src/components/experience/lost-memories-chapter.tsx
src/components/experience/lost-memories/archive-realm-records.tsx
src/components/experience/lost-memories/archive-record-viewer.tsx
src/components/experience/lost-memories/archive-table.tsx
src/components/experience/lost-memories/lost-memories-types.ts
src/components/experience/lost-memories/memory-decay-text.tsx
src/components/experience/lost-memories/use-lost-memories-motion.ts
src/content/lost-memories.ts
```

Do not include generated screenshots, temporary QA workflows, lockfile changes, or asset rewrites.

- [ ] **Step 10: Open PR to `main` without merging**

Title:

```text
feat: replace lore pillars with Lost Memories archive
```

PR body must summarize narrative scope, interaction model, assets L01–L12, mobile behavior, accessibility, Memory Decay/BLACK-00, and final quality-gate results. Do not merge without explicit user authorization.
