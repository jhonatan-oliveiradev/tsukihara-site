# Tsukihara Cinematic Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the first cinematic, responsive Tsukihara website experience.

**Architecture:** A Next.js App Router page composes semantic HTML chapters above a fixed React Three Fiber atmosphere. GSAP/ScrollTrigger handles chapter motion while Lenis owns smooth scrolling, and canonical image assets remain local and optimized.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, Three.js/R3F, GSAP, Lenis, ESLint, Prettier.

**Spec:** `docs/superpowers/specs/2026-08-20-tsukihara-cinematic-site-design.md`

## Global Constraints

- Do not reuse or redistribute Kage source code or artwork.
- Use canonical Tsukihara assets only for the initial visual identity.
- Keep motion narrative and support `prefers-reduced-motion`.
- Use semantic HTML, keyboard focus and responsive behavior.
- Configure Prettier with `prettier-plugin-tailwindcss`.

---

### Task 1: Bootstrap and design-system baseline

**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `prettier.config.mjs`, `eslint.config.mjs`, `src/app/globals.css`

- [x] Configure Next.js App Router, strict TypeScript, Tailwind v4 and linting.
- [x] Configure Prettier with Tailwind class sorting.
- [x] Establish semantic Tsukihara color, typography and motion tokens.

### Task 2: Canonical asset pipeline

**Files:** `public/images/*.webp`

- [x] Optimize logo, Akari, Hanamori, Mizukyo, Kurogane and Haku into local WebP assets.
- [x] Preserve transparency for logo and Akari.

### Task 3: Cinematic WebGL atmosphere

**Files:** `src/components/experience/world-canvas.tsx`

- [x] Add a fixed R3F canvas.
- [x] Render the vermilion moon, petals, particles and fog as ambient depth.
- [x] Keep the canvas non-interactive and performance-conscious.

### Task 4: Narrative page and scroll choreography

**Files:** `src/components/experience/experience-shell.tsx`, `src/content/game.ts`, `src/app/page.tsx`

- [x] Build hero, Akari, three realms, Bonds, Eclipse and footer sections.
- [x] Add responsive header/mobile navigation and anchor behavior.
- [x] Add GSAP reveal/parallax and Lenis smooth scroll.
- [x] Disable motion appropriately for reduced-motion users.

### Task 5: Quality gates and repository delivery

**Files:** all project files

- [ ] Run `npm run format:check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Verify desktop and mobile rendering in a browser if runtime dependency installation is available.
- [ ] Commit to `feat/initial-cinematic-experience` and open a PR to `main`.
