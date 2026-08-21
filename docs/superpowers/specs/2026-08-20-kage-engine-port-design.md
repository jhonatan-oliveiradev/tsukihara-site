# Kage Engine Port — Design

## Goal

Rebuild Tsukihara's website as an educational Next.js/React port of the structural WebGL and editorial interaction patterns used by Meng To's Kage, while keeping Tsukihara's world, narrative, characters, soundtrack and art direction distinct.

## Experience architecture

- One fixed WebGL world survives the complete document.
- Scroll progress samples a sequence of composed camera shots instead of swapping scenes.
- The crimson moon/eclipsing disc is one persistent object across all chapters.
- Foreground, midground and background layers move at visibly different rates.
- HTML sections act as editorial plates over the live world: hero, threshold, realm archive, character spread, lore grid and afterlight.
- Motion is slow and deliberate; reduced-motion retains the complete reading experience.

## Kage-derived educational concepts

- continuous scroll-driven camera choreography
- persistent fog/lighting/environment
- foreground pinning and section handoff
- particle depth layers and pointer-responsive atmosphere
- editorial chapter pacing with major density changes
- graceful static HTML fallback if WebGL is unavailable

## Tsukihara-specific direction

- Akari is the protagonist and primary character key art.
- The eclipse is the visual spine.
- Vermilion Japanese annotations, Bodoni/Didot/Mincho-inspired display typography and restrained sans-serif utility text define the editorial layer.
- Hanamori, Mizukyo and Kurogane form the first realm archive.
- The supplied Japanese temple GLTF will replace the procedural shrine when its binary files are available in the repository.
- The supplied crimson katana GLTF is reserved for a later cinematic transition/wipe.
- The supplied cinematic Japanese track is the soundtrack after an explicit user interaction; silent entry remains available.

## Asset paths

- `/models/japanese-temple/scene.gltf`
- `/models/crimson-katana/scene.gltf`
- `/audio/tsukihara-theme.mp3`

The current GitHub connector cannot upload the supplied binary assets, so the engine must remain functional with procedural geometry until they are copied into those paths.

## Attribution

Maintain `docs/ATTRIBUTION-KAGE.md` with links to the original Kage repository and website. Source comments should mark adapted structural concepts where useful.

## Quality

GitHub Actions must pass Prettier, ESLint and Next.js production build. Visual approval is a separate gate before merge.
