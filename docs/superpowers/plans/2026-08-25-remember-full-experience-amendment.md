# REMEMBER Full Experience Plan Amendment

This amendment clarifies the `MemoryDefinition` interface in Task 1 of `2026-08-25-remember-full-experience.md`.

The canonical interface includes:

```ts
type MemoryDefinition = {
  id: MemoryId;
  index: 1 | 2 | 3;
  title: string;
  titleJp: string;
  viewBox: { width: number; height: number };
  brokenAsset: string;
  restoredAsset: string;
  fragments: MemoryFragmentDefinition[];
  seams: KintsugiSeamDefinition[];
  snapRatio: number;
  completionCopy: LocalizedCopy;
  palette: MemoryPalette;
};
```

`snapRatio` is intentionally part of the public definition contract because the deterministic regression suite verifies the approved difficulty progression: Hanamori > Mizukyo > Kurogane.
