# Mother Moon / A Herdeira do Eclipse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a five-act Mother Moon / Eclipse Heir chapter immediately after Bestiary & Bosses, using the real M01–M10 assets and a subtle memory-proximity interaction.

**Architecture:** Keep all localized copy and asset slots in `src/content/mother-moon.ts`. Build one semantic chapter component composed from small asset/memory primitives and a scoped motion hook. Use natural document scroll, local sticky compositions and CSS/GSAP transforms only; no long pinned timeline or new rendering dependency.

**Tech Stack:** Next.js 16.3.1, React 19, TypeScript, Next Image, CSS, GSAP/ScrollTrigger, existing `JpRevealText`.

**Spec:** `docs/superpowers/specs/2026-08-23-mother-moon-eclipse-heir-design.md`

## Global Constraints

- Use real M01–M10 assets from `public/08-mother-moon`.
- No final-boss reveal, final form, moveset, arena or direct Akari/Tsukino confrontation.
- No glitch, Bestiary scan language, Splash Cursor, continuous zoom, heavy WebGL or new shader dependency.
- Memory interaction is progressive enhancement for fine pointers; mobile/coarse pointer receives automatic passive memories.
- `prefers-reduced-motion` must expose stable readable states for all acts.
- All narrative text remains in the DOM and no lore depends exclusively on hover.
- Use `.ix-mm-*` namespace for all new styles.
- Do not redesign Bestiary/Bosses or any earlier chapter.
- Before completion: `npm run format:check`, `npm run lint`, and `npm run build` must pass in the Quality workflow.

---

### Task 1: Mother Moon content and asset contract

**Files:**
- Create: `src/content/mother-moon.ts`

**Interfaces:**
- Produces: `MotherMoonAssetCode`, `motherMoonAssets`, `MotherMoonMemory`, `motherMoonCopy`.
- Consumes: `Locale` from `@/content/immersive-copy`.

- [ ] Define stable M01–M10 asset codes and exact `/08-mother-moon/...` paths.
- [ ] Define complete PT/EN copy for all five acts, quotes, labels and philosophy terms.
- [ ] Define memory-field records with stable ids, text, normalized x/y positions and intensity classes.
- [ ] Keep Tsukino presentation language limited to `LADY TSUKINO` plus `HERDEIRA DO ECLIPSE` / `HEIR TO THE ECLIPSE`.
- [ ] Commit the manifest independently.

### Task 2: Asset primitive and memory field

**Files:**
- Create: `src/components/experience/mother-moon/mother-moon-asset.tsx`
- Create: `src/components/experience/mother-moon/mother-moon-memory-field.tsx`

**Interfaces:**
- `MotherMoonAsset({ code, className, sizes, priority })` renders a stable M01–M10 `next/image` slot.
- `MotherMoonMemoryField({ memories, unstable? })` renders fine-pointer proximity memories and automatic coarse-pointer fallback.

- [ ] Implement `MotherMoonAsset` with `fill`, decorative alt semantics and stable data attributes.
- [ ] Implement pointer-distance proximity using one scoped pointer listener and CSS custom properties.
- [ ] Ensure timers decay memories after roughly 1–2 seconds rather than leaving them permanently active.
- [ ] Disable proximity behavior for coarse pointer and reduced motion; render passive readable fallback states instead.
- [ ] Commit primitives independently.

### Task 3: Five-act chapter and scoped motion

**Files:**
- Create: `src/components/experience/mother-moon/use-mother-moon-motion.ts`
- Create: `src/components/experience/mother-moon-chapter.tsx`

**Interfaces:**
- `useMotherMoonMotion(rootRef)` scopes local ScrollTrigger/IntersectionObserver behavior to the chapter.
- `MotherMoonChapter({ locale })` is the only integration surface consumed by `immersive-experience.tsx`.

- [ ] Build Act 01 with M01 protagonist, M03 fragments, M08 reflection and memory field.
- [ ] Build Act 02 with M01→M02 forgetting layers and unstable memories.
- [ ] Build Act 03 reveal order M04 → M06 → M05 → M07, followed by Tsukino quote and Akari counterpoint.
- [ ] Build Act 04 symmetric forget/remember composition around M09.
- [ ] Build Act 05 with M10, closing copy and documentary transition seeds.
- [ ] Add only local, low-amplitude motion: breathing, dissolves, shadow wipes and reveal opacity; no chapter-wide pin.
- [ ] Commit chapter independently.

### Task 4: Visual system, responsive behavior and reduced motion

**Files:**
- Create: `src/app/mother-moon-chapter.css`

**Interfaces:**
- Styles only `.ix-mm-*` selectors and `[data-mm-*]` hooks from Task 3.

- [ ] Establish monumental near-black/ivory/crimson art direction with large negative space.
- [ ] Keep M01 visually dominant through Acts 01–02 and prevent decorative layers from overpowering copy.
- [ ] Give the main Tsukino quote a near-empty viewport moment.
- [ ] Make Act 04 visually balanced, with no side framed as the obviously correct answer.
- [ ] Implement tablet scale reduction and mobile vertical sequence: Moon → forgetting → Tsukino → quote → philosophy → closing.
- [ ] Implement full `prefers-reduced-motion` fallback and prevent horizontal overflow.
- [ ] Commit styles independently.

### Task 5: Integration and verification

**Files:**
- Modify: `src/components/experience/immersive-experience.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Import `MotherMoonChapter` and render immediately after `BestiaryBossesChapter`.
- Import `./mother-moon-chapter.css` after Bestiary CSS and before later world styles.

- [ ] Integrate chapter at the approved narrative position.
- [ ] Open a draft PR to `main`.
- [ ] Run the existing Quality workflow (`format:check`, ESLint, production build).
- [ ] If Quality fails, inspect exact job logs and fix only feature-related failures.
- [ ] Leave the PR unmerged for local visual validation and focal/crop tuning.
