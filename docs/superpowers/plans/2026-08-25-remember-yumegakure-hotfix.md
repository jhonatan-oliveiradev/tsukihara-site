# REMEMBER Yumegakure Flow Hotfix

Scope: bounded bugfix against the approved REMEMBER full-experience spec.

## Reported regressions

1. Organic completion of Kurogane can expose the empty REMEMBER shell instead of entering Yumegakure. Returning to title and using Continue succeeds because that path preloads the saved stage and uses the transition director.
2. Yumegakure cannot complete according to its false-memory design. The generic puzzle currently counts all nine visible fragments as mandatory and does not implement reversible false fragments.

## Fix contract

- Memory-to-memory Continue must preload the next memory's critical assets under the transition veil before committing the reducer transition, then background-preload that stage's `next` manifest.
- Yumegakure keeps nine visible fragments: seven true and two false.
- Dedicated false fragment `sourceAsset` values must actually render.
- A stabilized false fragment makes the composition unstable and blocks Kintsugi.
- Stabilized pieces are reversible in Yumegakure so the player can remove false fragments.
- Completion requires all seven true fragments and zero stabilized false fragments.
- Standard memories keep their existing irreversible snap behavior.

## Validation

RED → GREEN through `test:remember`, then `test:hero`, `format:check`, `lint`, `build`.
Visual localhost validation remains required before merge.
