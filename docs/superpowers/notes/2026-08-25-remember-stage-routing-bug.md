# REMEMBER stage routing regression

Observed during localhost validation on 2026-08-25.

- After Mizukyo, reducer advances to `interlude-01`, but `RememberExperience` renders no interlude scene, leaving only the shell/central moon kanji visible.
- Memory continuation preloads `memoryDefinitions[state.activeMemoryIndex + 1]` instead of the canonical `getNextStage(state.currentStage)`, so the transition can prepare Kurogane while the reducer actually enters Interlude I.
- `interlude-02`, `akari-reveal`, `epilogue`, and `credits` also have no render branches in the composition root, guaranteeing later empty-shell fallthroughs.
- The approved progression remains Mizukyo → Interlude I → Kurogane → Yumegakure → Gekkai → Interlude II → Akari Reveal → Epilogue → Credits. Interlude I must not name Akari; Interlude II is the sole initial AKR-001 discovery event.
