export type MemoryFragmentDefinition = {
  id: string;
  path: string;
  initial: { x: number; y: number };
  rotation: number;
  snapRadius: number;
  seamId: string;
};

export const HANAMORI_VIEWBOX = { width: 1000, height: 625 } as const;

export const hanamoriFragments: MemoryFragmentDefinition[] = [
  {
    id: "fragment-a",
    path: "M0 0H470L510 85L455 205L510 305L420 355L0 330Z",
    initial: { x: -0.13, y: -0.1 },
    rotation: -4.5,
    snapRadius: 0.095,
    seamId: "seam-a",
  },
  {
    id: "fragment-b",
    path: "M470 0H1000V265L890 300L805 250L700 315L600 260L510 305L455 205L510 85Z",
    initial: { x: 0.12, y: -0.12 },
    rotation: 3.8,
    snapRadius: 0.09,
    seamId: "seam-b",
  },
  {
    id: "fragment-c",
    path: "M0 300L420 330L510 305L550 405L480 625H0Z",
    initial: { x: -0.15, y: 0.12 },
    rotation: 4.2,
    snapRadius: 0.1,
    seamId: "seam-c",
  },
  {
    id: "fragment-d",
    path: "M510 305L600 260L700 315L755 410L690 625H480L550 405Z",
    initial: { x: 0.015, y: 0.16 },
    rotation: -3.2,
    snapRadius: 0.09,
    seamId: "seam-d",
  },
  {
    id: "fragment-e",
    path: "M700 315L805 250L890 300L1000 265V625H690L755 410Z",
    initial: { x: 0.15, y: 0.1 },
    rotation: 5.2,
    snapRadius: 0.1,
    seamId: "seam-e",
  },
];

export type KintsugiSeamDefinition = {
  id: string;
  fragmentId: string;
  path: string;
};

export const hanamoriSeams: KintsugiSeamDefinition[] = [
  {
    id: "seam-a",
    fragmentId: "fragment-a",
    path: "M469 0C470 45 503 58 510 85C516 116 471 164 455 205C443 236 501 273 510 305C518 330 444 336 420 355",
  },
  {
    id: "seam-b",
    fragmentId: "fragment-b",
    path: "M1000 265C955 268 930 294 890 300C856 304 834 261 805 250C770 238 733 304 700 315C664 326 630 271 600 260C566 248 541 292 510 305",
  },
  {
    id: "seam-c",
    fragmentId: "fragment-c",
    path: "M0 300C120 317 280 314 420 330C457 334 486 298 510 305C526 311 534 373 550 405C535 470 507 557 480 625",
  },
  {
    id: "seam-d",
    fragmentId: "fragment-d",
    path: "M510 305C543 298 565 270 600 260C632 252 669 305 700 315C727 324 742 374 755 410C745 477 717 555 690 625",
  },
  {
    id: "seam-e",
    fragmentId: "fragment-e",
    path: "M700 315C735 307 767 261 805 250C839 240 861 293 890 300C925 308 964 273 1000 265",
  },
];
