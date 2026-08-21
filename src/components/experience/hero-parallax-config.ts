export type HeroParallaxLayerId =
  "moon" | "temple" | "mist" | "sakura" | "ground" | "characters" | "ruins" | "grass" | "petals";

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
    src: "/assets_hq/Blood_Moon.png",
    depth: 0.02,
    maxX: 6,
    maxY: 4,
    priority: true,
  },
  {
    id: "temple",
    src: "/parallax/tsukihara-distant-temple.png",
    depth: 0.04,
    maxX: 8,
    maxY: 5,
  },
  {
    id: "mist",
    src: "/parallax/tsukihara-lunar-mist.png",
    depth: 0.06,
    maxX: 12,
    maxY: 7,
    ambientX: 12,
  },
  {
    id: "sakura",
    src: "/parallax/tsukihara-sakura-tree.png",
    depth: 0.08,
    maxX: 10,
    maxY: 6,
    ambientX: 3,
    ambientY: 2,
  },
  {
    id: "ground",
    src: "/parallax/tsukihara-ground.png",
    depth: 0.1,
    maxX: 16,
    maxY: 8,
  },
  {
    id: "characters",
    src: "/parallax/tsukihara-characters-web.png",
    depth: 0.12,
    maxX: 15,
    maxY: 9,
    priority: true,
  },
  {
    id: "ruins",
    src: "/secret-pathways-assets/foreground/png/shrine-ruins.webp",
    depth: 0.16,
    maxX: 20,
    maxY: 10,
    ambientX: 1,
  },
  {
    id: "grass",
    src: "/secret-pathways-assets/foreground/png/tall-grass.webp",
    depth: 0.19,
    maxX: 26,
    maxY: 12,
    ambientX: 2,
    ambientY: 1,
  },
  {
    id: "petals",
    src: "/parallax/tsukihara-petals.png",
    depth: 0.24,
    maxX: 34,
    maxY: 14,
    ambientX: 28,
    ambientY: 6,
  },
] as const;
