export const HERO_BREAKPOINTS = {
  mobile: 680,
  tablet: 980,
} as const;

export const HERO_SCROLL_DISTANCE = {
  desktop: 3.05,
  tablet: 2.55,
  mobile: 2.08,
  reduced: 1.35,
} as const;

export const HERO_PHASES = {
  serenityEnd: 0.12,
  omenEnd: 0.28,
  eclipseEnd: 0.48,
  awakeningEnd: 0.68,
  crimsonEnd: 0.86,
  resolveEnd: 1,
} as const;

export const HERO_ASSETS = {
  moonBefore: "/hero-elements/moon-before.png",
  moonAfter: "/hero-elements/moon-after.png",
  templeBefore: "/hero-elements/temple-before.png",
  templeAfter: "/hero-elements/temple-after.png",
  mistBefore: "/hero-elements/mist-before.png",
  mistAfter: "/hero-elements/mist-after.png",
  mistCrimson: "/hero-elements/mist-2-after.png",
  groundBefore: "/hero-elements/ground-before.png",
  groundAfter: "/hero-elements/ground-after.png",
  charactersBefore: "/hero-elements/characters-before.png",
  charactersAfter: "/hero-elements/characters-after.png",
  leftSakuraAfter: "/hero-elements/left-sakura-tree-after.png",
  rightSakuraBefore: "/hero-elements/right-sakura-tree-before.png",
  rightSakuraAfter: "/hero-elements/right-sakura-tree-after.png",
  leftPetalsBefore: "/hero-elements/left-petals-before.png",
  leftPetalsAfter: "/hero-elements/left-petals-after.png",
  rightPetalsAfter: "/hero-elements/right-petals-after.png",
  lantern: "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  stones: "/secret-pathways-assets/foreground/png/basalt-stones.webp",
  grass: "/secret-pathways-assets/foreground/png/tall-grass.webp",
} as const;

export type HeroDepthId =
  | "moon"
  | "atmosphere"
  | "temple"
  | "mistMid"
  | "ground"
  | "characters"
  | "sakuraLeft"
  | "sakuraRight"
  | "foreground";

export const HERO_DEPTH: Record<HeroDepthId, number> = {
  moon: 0.03,
  atmosphere: 0.06,
  temple: 0.12,
  mistMid: 0.2,
  ground: 0.22,
  characters: 0.24,
  sakuraLeft: 0.28,
  sakuraRight: 0.3,
  foreground: 0.36,
};

export type HeroPetal = {
  id: string;
  side: "left" | "right";
  band: "back" | "mid" | "front";
  x: number;
  y: number;
  size: number;
  drift: number;
  lift: number;
  rotate: number;
  delay: number;
};

const bands = ["back", "mid", "front"] as const;

export const HERO_PETALS: readonly HeroPetal[] = Array.from({ length: 24 }, (_, index) => {
  const side = index % 2 === 0 ? "left" : "right";
  const band = bands[index % bands.length];
  const sideIndex = Math.floor(index / 2);
  return {
    id: `petal-${index}`,
    side,
    band,
    x: side === "left" ? -5 - ((sideIndex * 9) % 18) : 105 + ((sideIndex * 7) % 18),
    y: 16 + ((index * 17) % 68),
    size: band === "back" ? 5 + (index % 4) : band === "mid" ? 9 + (index % 6) : 16 + (index % 10),
    drift: 32 + ((index * 13) % 52),
    lift: -24 + ((index * 11) % 48),
    rotate: 80 + ((index * 43) % 300),
    delay: -((index * 0.73) % 8),
  };
});
