# Lost Memories / Arquivos de Tsukihara Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current post-Mother-Moon `ExperiencePillars` section with an interactive, diegetic Lost Memories archive that makes the Eclipse feel personal through letters, spiritual photographs, relics, realm records, lunar observations, BLACK-00 and AKR-001.

**Architecture:** Introduce a localized archive data model plus a focused `LostMemoriesChapter` component family. Desktop uses bounded freeform archive surfaces over L11; mobile switches to a linear editorial sequence. One chapter-level `openRecordId` drives a single diegetic viewer for every record type, including realm annotations and BLACK-00. A local GSAP hook handles only intimate archive motion and never introduces long scroll pinning.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript 5.9, Next/Image, GSAP 3.13 + ScrollTrigger, existing Lenis integration, CSS, no new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-08-24-lost-memories-archives-design.md`

## Global Constraints

- Preserve `id="lore"` and `data-section` so the existing main navigation keeps working.
- Replace `ExperiencePillars` only in the immersive sequence; do not redesign `MotherMoonChapter` or `CinematicEpilogue` in this scope.
- Use only final assets already present under `public/09-lore-archives`; do not generate substitutes or placeholders.
- Desktop archive must read as an imperfect physical archive, not a uniform card grid, carousel, or SaaS dashboard.
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
- `src/components/experience/lost-memories/lost-memories-types.ts` — shared archive item/status/group/crop/hotspot interfaces.
- `src/components/experience/lost-memories/memory-decay-text.tsx` — accessible visual word-decay treatment.
- `src/components/experience/lost-memories/archive-record-viewer.tsx` — diegetic Open state with focus management and BLACK-00 timing.
- `src/components/experience/lost-memories/archive-realm-records.tsx` — documentary nine-realm annotations anchored to L06.
- `src/components/experience/lost-memories/archive-table.tsx` — desktop freeform archive surface plus mobile linear archive content.
- `src/components/experience/lost-memories/use-lost-memories-motion.ts` — local intro/table/closing GSAP behaviors.
- `src/components/experience/lost-memories-chapter.tsx` — chapter shell, intro, archive index, open-record state, closing AKR-001 and L12 transition.
- `src/app/lost-memories-chapter.css` — complete visual system, responsive states, viewer, focus and reduced-motion behavior.

### Modify

- `src/components/experience/immersive-experience.tsx` — replace `ExperiencePillars` import/render with `LostMemoriesChapter` while preserving `#lore` navigation semantics.
- `src/app/layout.tsx` — import `lost-memories-chapter.css` after Mother Moon styles.

### Intentionally leave unchanged

- `src/components/experience/experience-pillars.tsx` — may remain unused; deleting unrelated legacy code is outside this feature.
- `src/components/experience/cinematic-epilogue.tsx` — later philosophical climax work is out of scope.
- `src/components/experience/mother-moon-chapter.tsx` — no additional changes in this feature.

---

### Task 1: Define the archive data contract and localized content

**Files:**
- Create: `src/components/experience/lost-memories/lost-memories-types.ts`
- Create: `src/content/lost-memories.ts`

**Interfaces:**
- Produces `ArchiveStatus`, `ArchiveGroupId`, `ArchiveItemKind`, `ArchiveAssetCrop`, `ArchiveHotspot`, `ArchiveRecord`, `RealmArchiveRecord`, `LostMemoriesCopy`.
- Produces `lostMemoriesCopy: Record<Locale, LostMemoriesCopy>` consumed by every later task.
- All openable records, including realms, are assignable to `ArchiveRecord` so one viewer handles every type.

- [ ] **Step 1: Create exact shared types**

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

export type RealmArchiveRecord = ArchiveRecord & {
  kind: "realm";
  group: "realms";
  realm: string;
  memoryType: string;
  lastVerified: string;
  sealed?: boolean;
};
```

`LostMemoriesCopy` must contain the localized intro/index/group headings, `records: ArchiveRecord[]`, `realmRecords: RealmArchiveRecord[]`, transition copy, AKR-001 metadata and final signature.

- [ ] **Step 2: Encode all PT/EN content and final asset paths**

Use these canonical assets:

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

Include exact Portuguese source copy from the approved design for L01–L03, nine realm fragments, Lunar Observation 441, BLACK-00, transition thesis and AKR-001. Add faithful English localization without changing lore meaning.

- [ ] **Step 3: Type-check the data contract**

Run:

```bash
npm run build
```

Expected: Next production compilation succeeds and all localized records satisfy the shared types.

- [ ] **Step 4: Commit**

```bash
git add src/content/lost-memories.ts src/components/experience/lost-memories/lost-memories-types.ts
git commit -m "feat: define Lost Memories archive data"
```

---

### Task 2: Build Memory Decay and the diegetic record viewer

**Files:**
- Create: `src/components/experience/lost-memories/memory-decay-text.tsx`
- Create: `src/components/experience/lost-memories/archive-record-viewer.tsx`

**Interfaces:**
- `MemoryDecayText({ text, active }: { text: string; active: boolean })`.
- `ArchiveRecordViewer({ record, onClose }: { record: ArchiveRecord | null; onClose: () => void })`.
- Parent chapter owns trigger restoration; viewer owns Escape, focus-on-open, decay timing and BLACK-00 phase.

- [ ] **Step 1: Implement accessible visual decay**

Render full source text for assistive technology and a separate visual word layer marked `aria-hidden="true"`:

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

- [ ] **Step 2: Implement viewer semantics and focus-on-open**

The viewer:

- renders only when `record !== null`;
- lives inside the archive chapter, not a portal/generic modal component;
- exposes `role="dialog"`, `aria-modal="true"`, `aria-labelledby`;
- focuses its close button when the record changes from null to a record;
- closes on Escape through `onClose`;
- renders code/status/title/story and the selected record asset.

- [ ] **Step 3: Implement Memory Decay timing**

For `record.decay === true`, arm decay after ~3500ms. Restore visual words on pointer movement and story-region hover/focus. Cancel timers on record change/unmount. If `prefers-reduced-motion: reduce`, never arm decay.

- [ ] **Step 4: Implement BLACK-00 phase**

For `record.kind === "black"`:

- local phase is `"silent" | "revealed"`;
- normal motion starts `silent` and reveals after 1200ms;
- reduced motion starts `revealed`;
- revealed content is the localized forbidden statement plus `Remaining data corrupted.`.

- [ ] **Step 5: Run static gates**

```bash
npm run lint
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/experience/lost-memories/memory-decay-text.tsx src/components/experience/lost-memories/archive-record-viewer.tsx
git commit -m "feat: add diegetic Lost Memories viewer"
```

---

### Task 3: Build letters, spiritual photographs and relic interactions

**Files:**
- Create: `src/components/experience/lost-memories/archive-table.tsx`

**Interfaces:**
- Receives `copy: LostMemoriesCopy`.
- Receives `onOpen(record: ArchiveRecord, trigger: HTMLButtonElement): void`.
- Produces anchors `archive-letters`, `archive-photographs`, `archive-relics`.

- [ ] **Step 1: Add private `ArchiveItem` button primitive**

Every inspectable record must render as `<button type="button">` with `data-archive-item`, `data-archive-kind`, visible-on-hover/focus code/status metadata, decorative Next/Image (`alt=""`), and `onClick={(event) => onOpen(record, event.currentTarget)}`.

- [ ] **Step 2: Compose L01–L03 letter surface**

Desktop: three independently positioned papers with deliberate overlap, CSS custom-property rotations within ±2°, independently focusable targets, Hanamori visually strongest without becoming a hero.

Mobile: normal-flow archive records with asset, code/status and excerpt.

- [ ] **Step 3: Compose L04 as five spiritual plate crops**

Use one source image with five data-defined crop wrappers. Do not remount/swap sources on hover. Each plate gets subtle glass reflection, dissolving internal mask and readable external label.

- [ ] **Step 4: Compose L05 as one sheet with semantic hotspots**

Render L05 once. Overlay five normalized hotspot buttons from data. Desktop uses restrained local echo/glow; mobile replaces the hotspot geometry with explicit stacked relic buttons/descriptions below the asset.

- [ ] **Step 5: Confirm keyboard parity and compile**

Every letter, photo plate and relic is reachable without mouse and no interaction depends only on `onMouseEnter`.

```bash
npm run lint
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/experience/lost-memories/archive-table.tsx
git commit -m "feat: build Lost Memories archive table"
```

---

### Task 4: Add Nine-Realm and Lunar/BLACK-00 archive zones

**Files:**
- Create: `src/components/experience/lost-memories/archive-realm-records.tsx`
- Modify: `src/components/experience/lost-memories/archive-table.tsx`

**Interfaces:**
- `ArchiveRealmRecords({ records, mapAsset, onOpen })` receives `RealmArchiveRecord[]`, the L06 asset, and the same `onOpen(record: ArchiveRecord, trigger: HTMLButtonElement)` callback used everywhere else.
- Produces anchors `archive-realms`, `archive-lunar`.

- [ ] **Step 1: Build the L06 realm documentary surface**

Desktop: L06 is the anchor, nine varied annotation buttons surround/overlap it with restrained CSS leader lines. Each `RealmArchiveRecord` is directly passed into the common viewer because it extends `ArchiveRecord`. Tsuki no Miya stays `SEALED` and has no invented hidden story.

Mobile: show L06 once and list nine readable records below it.

- [ ] **Step 2: Add L07 Lunar Observation 441**

Render L07 as a technical plate with nearby metadata and an open control. Its `ArchiveRecord` has `decay: true`.

- [ ] **Step 3: Add L08 BLACK-00**

Place it at the edge of the lunar zone, not centered. Use `kind: "black"`, `status: "CORRUPTED"`, `code: "ARCHIVE / BLACK-00"` so the common viewer applies the special phase.

- [ ] **Step 4: Verify exact group anchors and compile**

Expected once each:

```text
archive-letters
archive-photographs
archive-relics
archive-realms
archive-lunar
```

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/lost-memories/archive-realm-records.tsx src/components/experience/lost-memories/archive-table.tsx
git commit -m "feat: add realm and lunar archive records"
```

---

### Task 5: Compose chapter shell, index, Open-state ownership and closing flow

**Files:**
- Create: `src/components/experience/lost-memories-chapter.tsx`

**Interfaces:**
- Exports `LostMemoriesChapter({ locale }: { locale: Locale })`.
- Owns `openRecordId: string | null` and `lastTriggerRef: MutableRefObject<HTMLButtonElement | null>`.
- Consumes `ArchiveTable`, `ArchiveRecordViewer`, `lostMemoriesCopy`, `useLostMemoriesMotion`.

- [ ] **Step 1: Build intro and preserve `#lore`**

Root:

```tsx
<section id="lore" data-section className="ix-archive" ref={rootRef}>
```

Render eyebrow, headline, support copy and a restrained anchor index to the five archive group ids. No tabs and no selected-index state.

- [ ] **Step 2: Own one open-record state and one focus-restoration path**

```ts
const openRecord = (record: ArchiveRecord, trigger: HTMLButtonElement) => {
  lastTriggerRef.current = trigger;
  setOpenRecordId(record.id);
};

const closeRecord = () => {
  setOpenRecordId(null);
  requestAnimationFrame(() => lastTriggerRef.current?.focus());
};
```

Resolve the selected item from the union of `copy.records` and `copy.realmRecords`.

- [ ] **Step 3: Mount L11 and L09 ambience**

L11 is the archive background; L09 is pointer-events-none fragments/dust. Both are decorative and never block focus/hit targets.

- [ ] **Step 4: Render transition thesis**

Two beats after archive exploration:

- `Um mundo não desaparece quando suas cidades caem.`
- `Desaparece quando ninguém consegue mais contar que elas existiram.`

Each receives a local motion data attribute.

- [ ] **Step 5: Render isolated AKR-001 with L10**

Show only:

```text
MEMORY RECORD / AKR-001
OWNER: AKARI
STATUS: UNKNOWN
```

Do not make it openable. Render `REMEMBER WHAT REMAINS.` beneath it.

- [ ] **Step 6: Render L12 handoff**

Use L12 as the final non-interactive transition image and place `ESQUECER` and `LEMBRAR` on opposing sides. Do not alter `CinematicEpilogue`.

- [ ] **Step 7: Compile and commit**

```bash
npm run lint
npm run build
git add src/components/experience/lost-memories-chapter.tsx
git commit -m "feat: compose Lost Memories chapter"
```

---

### Task 6: Implement archive visual language and local motion

**Files:**
- Create: `src/app/lost-memories-chapter.css`
- Create: `src/components/experience/lost-memories/use-lost-memories-motion.ts`

**Interfaces:**
- `useLostMemoriesMotion(rootRef: RefObject<HTMLElement | null>)` scopes all GSAP selectors to the chapter and reverts its context on cleanup.

- [ ] **Step 1: Establish chapter palette/materials**

Use near-black/charcoal, ivory, lunar white, wine red and aged gold. Keep red restrained and use serif document typography plus mono/condensed metadata treatment.

- [ ] **Step 2: Build desktop bounded freeform composition**

At `min-width: 901px`:

- max content width `min(94vw, 1800px)`;
- bounded group canvases rather than one uncontrolled page-wide absolute layer;
- readable metadata remains within group bounds;
- rotations within ±2°;
- Inspect lifts 4–10px;
- `:focus-visible` mirrors `:hover`.

- [ ] **Step 3: Style diegetic viewer**

Dim/desaturate the table behind the selected record; lift foreground content shallowly; avoid a generic white modal rectangle; keep close control visibly archival but with a generous hit area. BLACK-00 silent phase suppresses most decorative contrast.

- [ ] **Step 4: Style Memory Decay**

Fade/blur only `[data-decay-word]` while the decay state is active; restore on viewer story hover/focus. Never hide the accessible source text.

- [ ] **Step 5: Build mobile editorial mode at `max-width: 900px`**

Remove freeform absolute positioning, stack groups/records vertically, keep images large, make relic choices explicit, render realm records as a normal list, and ensure viewer fits touch screens without hover dependency.

- [ ] **Step 6: Add reduced-motion rules**

Disable nonessential transform transitions, visual decay and theatrical movement while preserving all content and controls.

- [ ] **Step 7: Implement scoped GSAP motion**

Use a local `gsap.context` for:

- intro eyebrow/title/support reveal;
- archive group settling (8–16px maximum);
- restrained spirit-photo reveal;
- transition thesis two-beat reveal;
- gradual fading of decorative L09/nonessential archive density near the closing;
- AKR-001 reveal;
- L12 transition reveal.

No pinning and no selectors outside the chapter root.

- [ ] **Step 8: Run gates and commit**

```bash
npm run format:check
npm run lint
npm run build
git add src/app/lost-memories-chapter.css src/components/experience/lost-memories/use-lost-memories-motion.ts
git commit -m "style: add Lost Memories archive visual system"
```

---

### Task 7: Integrate the new chapter into the immersive sequence

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace import/render**

Replace:

```tsx
import { ExperiencePillars } from "@/components/experience/experience-pillars";
```

with:

```tsx
import { LostMemoriesChapter } from "@/components/experience/lost-memories-chapter";
```

Replace:

```tsx
<ExperiencePillars copy={copy} locale={locale} />
```

with:

```tsx
<LostMemoriesChapter locale={locale} />
```

Keep ordering `MotherMoonChapter -> LostMemoriesChapter -> CinematicEpilogue`.

- [ ] **Step 2: Import CSS in `layout.tsx`**

Add:

```ts
import "./lost-memories-chapter.css";
```

after Mother Moon styles.

- [ ] **Step 3: Run repository gates**

```bash
npm run format:check
npm run lint
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/experience/immersive-experience.tsx src/app/layout.tsx
git commit -m "feat: replace lore pillars with Lost Memories archive"
```

---

### Task 8: Manual interaction, responsive and accessibility verification

**Files:**
- Modify only already-in-scope files if validation exposes defects.

- [ ] **Step 1: Validate desktop at 1536×864**

Confirm Mother Moon flows directly into Lost Memories; L11 reads as the underlying table; assets L01–L10 are sharp and correctly framed; archive overlap feels intentional; index links reach all five groups; Inspect motion is restrained; no horizontal overflow exists.

- [ ] **Step 2: Validate keyboard Open/Close flow**

1. Tab to a letter and confirm Inspect metadata appears.
2. Press Enter and confirm viewer opens/close receives focus.
3. Press Escape and confirm focus returns to the same archive item.
4. Repeat for a relic hotspot and a realm record.

- [ ] **Step 3: Validate Memory Decay**

Open Hanamori and Lunar Observation 441 for at least 3.5s. Confirm only selected visual words decay, readable source content remains, pointer/focus restores them, and no other record decays.

- [ ] **Step 4: Validate BLACK-00**

Confirm the visual silence starts immediately, forbidden statement appears after ~1.2s under normal motion, `Remaining data corrupted.` follows, and close/Escape remain responsive.

- [ ] **Step 5: Validate responsive widths**

Check:

```text
1440×900
1366×768
1024×768
900×900
768×1024
390×844
```

At `<= 900px`, confirm no freeform positioning survives, no hover dependency remains, records are not clipped, relic interactions are explicit, realms are readable vertically, and viewer can close without trapping the page incorrectly.

- [ ] **Step 6: Validate reduced motion**

Confirm content is immediately readable, Memory Decay is disabled, BLACK-00 does not force the theatrical wait, viewer remains functional, and the section is visually coherent.

- [ ] **Step 7: Validate section boundaries**

Mother Moon and CinematicEpilogue remain unchanged; `#lore` tracking activates for Lost Memories; no old `ExperiencePillars` content renders in the immersive sequence.

- [ ] **Step 8: Run final gates**

```bash
npm run format:check
npm run lint
npm run build
```

- [ ] **Step 9: Review final diff**

Expected implementation diff:

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

PR body summarizes narrative scope, interaction model, L01–L12 assets, mobile behavior, accessibility, Memory Decay/BLACK-00 behavior and final quality-gate results. Do not merge without explicit user authorization.
