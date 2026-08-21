export type HeroParallaxLayerId =
  | "moon"
  | "temple"
  | "mist"
  | "sakura"
  | "ground"
  | "characters"
  | "petals";

export type HeroParallaxLayer = {
  id: HeroParallaxLayerId;
  src: string;
  depth: number;
  maxX: number;
  maxY: number;
  priority?: boolean;
  ambientX?: number;
  ambientY?: number;
};

export const heroParallaxLayers: readonly HeroParallaxLayer[] = [
  {
    id: "moon",
    src: "/parallax/tsukihara-blood-moon-eclipse.png",
    depth: 0.02,
    maxX: 7,
    maxY: 4,
    priority: true,
  },
  {
    id: "temple",
    src: "/parallax/tsukihara-distant-temple.png",
    depth: 0.04,
    maxX: 9,
    maxY: 5,
  },
  {
    id: "mist",
    src: "/parallax/tsukihara-lunar-mist.png",
    depth: 0.06,
    maxX: 13,
    maxY: 7,
    ambientX: 9,
  },
  {
    id: "sakura",
    src: "/parallax/tsukihara-sakura-tree.png",
    depth: 0.08,
    maxX: 11,
    maxY: 6,
    ambientX: 2.5,
    ambientY: 1.5,
  },
  {
    id: "ground",
    src: "/parallax/tsukihara-ground.png",
    depth: 0.1,
    maxX: 18,
    maxY: 8,
  },
  {
    id: "characters",
    src: "/parallax/tsukihara-characters.png",
    depth: 0.12,
    maxX: 17,
    maxY: 9,
    priority: true,
  },
  {
    id: "petals",
    src: "/parallax/tsukihara-petals.png",
    depth: 0.24,
    maxX: 36,
    maxY: 14,
    ambientX: 24,
    ambientY: 5,
  },
] as const;
