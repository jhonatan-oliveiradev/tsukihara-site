# Akari Editorial Chapter

## Goal

Transform the existing Akari spotlight into a cinematic editorial chapter centered on memory, scars and Lunar Kintsugi, using the assets already available in `public/akari-details`.

## Experience structure

1. Editorial opening with Akari as the visual anchor and the headline about remembering for the Moon.
2. Identity panel with role, short lore copy and featured quote.
3. Long sticky detail showcase with five narrative close-ups: gaze, kitsune mask, katana, garments and Lunar Kintsugi.
4. Closing manifesto contrasting a perfect world with a broken one worth saving.

## Motion

- restrained GSAP/ScrollTrigger parallax in the opening;
- one active close-up and one active editorial detail at a time during the sticky sequence;
- progress rail tied to scroll progress;
- reveal motion based on transform, opacity and small blur values;
- reduced-motion mode converts the sticky sequence into a readable static presentation.

## Visual language

Preserve the site palette and material language: ink black, moon ivory, crimson, sakura accents and aged gold. The chapter should feel intimate and editorial rather than as spectacular as the hero.

## Performance

Use the existing image assets with `next/image`, keep the detail sequence to five active visual states, avoid new shaders and avoid particle systems in this chapter.

## Validation

Quality gate must cover Prettier, ESLint and production build. Chromium visual QA captures mobile, tablet, desktop, wide and ultrawide states and checks for horizontal overflow plus invalid detail-state overlap.
