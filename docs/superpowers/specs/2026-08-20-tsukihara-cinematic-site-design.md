# Tsukihara Cinematic Site Design

## Goal
Create the official cinematic website for Tsukihara as an original Next.js experience inspired by the narrative rhythm of Kage without reusing Kage code or artwork.

## Experience
The site is a single continuous scroll experience. A fixed WebGL atmosphere sits behind editorial HTML sections, while canonical Tsukihara key art provides the visual identity. Motion is slow, deliberate and narrative rather than decorative.

## Information architecture
1. Hero — Tsukihara / Beneath the Moon
2. Akari — protagonist reveal
3. Realms — Hanamori, Mizukyo, Kurogane
4. Bonds — Haku
5. Eclipse — narrative climax
6. Footer — development status and future Steam/trailer destinations

## Art direction
- Palette: ink black, moon ivory, Akari vermilion, sakura pink, aged gold.
- Typography: cinematic serif display paired with restrained sans-serif utility copy.
- Layout: oversized titles, Japanese labels, technical chapter numbering, negative space, full-bleed media.
- Atmosphere: moon, petals, sparkles, fog, grain and subtle depth.
- Avoid SaaS landing-page patterns, generic glassmorphism, bento grids and decorative motion without narrative purpose.

## Motion
- Lenis provides one smooth-scroll engine on devices that allow motion.
- GSAP + ScrollTrigger controls reveal and parallax choreography.
- React Three Fiber renders ambient moon/petal/sparkle depth.
- Reduced-motion users retain the complete reading experience without scroll-driven animation.

## Stack
Next.js App Router, React, TypeScript strict, Tailwind CSS v4, React Three Fiber / Three.js, GSAP + ScrollTrigger, Lenis, Prettier with prettier-plugin-tailwindcss, ESLint.

## Accessibility and performance
Semantic landmarks, working anchors, visible focus, mobile navigation, meaningful image alt text, reduced-motion support, responsive layouts and optimized local WebP assets are mandatory.
