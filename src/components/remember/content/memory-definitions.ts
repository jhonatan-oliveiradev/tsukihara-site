import { rememberAssets } from "./remember-assets.ts";
import {
  HANAMORI_VIEWBOX,
  hanamoriFragments,
  hanamoriSeams,
  type KintsugiSeamDefinition,
  type MemoryFragmentDefinition,
} from "../restore/restore-geometry.ts";
import type { MemoryId, RememberLocale } from "../state/remember-state.ts";

export type LocalizedCopy = Record<RememberLocale, string>;

export type MemoryPalette = {
  accent: string;
  glow: string;
  shadow: string;
};

export type MemoryDefinition = {
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

const VIEWBOX = { ...HANAMORI_VIEWBOX };

const mizukyoFragments: MemoryFragmentDefinition[] = [
  {
    id: "mizukyo-a",
    path: "M0 0H150L175 90L145 180L165 270L135 360L170 470L145 625H0Z",
    initial: { x: -0.18, y: -0.08 },
    rotation: -5.5,
    snapRadius: 0.088,
    seamId: "mizukyo-seam-a",
  },
  {
    id: "mizukyo-b",
    path: "M150 0H300L280 95L325 190L290 285L315 390L285 500L310 625H145L170 470L135 360L165 270L145 180L175 90Z",
    initial: { x: -0.1, y: 0.14 },
    rotation: 4.4,
    snapRadius: 0.084,
    seamId: "mizukyo-seam-b",
  },
  {
    id: "mizukyo-c",
    path: "M300 0H445L470 105L430 205L465 300L435 405L475 515L455 625H310L285 500L315 390L290 285L325 190L280 95Z",
    initial: { x: -0.04, y: -0.16 },
    rotation: -3.7,
    snapRadius: 0.082,
    seamId: "mizukyo-seam-c",
  },
  {
    id: "mizukyo-d",
    path: "M445 0H585L565 105L605 215L570 315L600 420L560 520L585 625H455L475 515L435 405L465 300L430 205L470 105Z",
    initial: { x: 0.04, y: 0.18 },
    rotation: 5.1,
    snapRadius: 0.08,
    seamId: "mizukyo-seam-d",
  },
  {
    id: "mizukyo-e",
    path: "M585 0H725L750 95L710 185L745 295L715 390L755 495L730 625H585L560 520L600 420L570 315L605 215L565 105Z",
    initial: { x: 0.09, y: -0.15 },
    rotation: -4.8,
    snapRadius: 0.082,
    seamId: "mizukyo-seam-e",
  },
  {
    id: "mizukyo-f",
    path: "M725 0H865L845 100L885 200L850 305L880 405L845 510L870 625H730L755 495L715 390L745 295L710 185L750 95Z",
    initial: { x: 0.13, y: 0.12 },
    rotation: 3.9,
    snapRadius: 0.08,
    seamId: "mizukyo-seam-f",
  },
  {
    id: "mizukyo-g",
    path: "M865 0H1000V625H870L845 510L880 405L850 305L885 200L845 100Z",
    initial: { x: 0.19, y: -0.07 },
    rotation: 5.8,
    snapRadius: 0.086,
    seamId: "mizukyo-seam-g",
  },
];

const mizukyoSeams: KintsugiSeamDefinition[] = [
  {
    id: "mizukyo-seam-a",
    fragmentId: "mizukyo-a",
    path: "M150 0L175 90L145 180L165 270L135 360L170 470L145 625",
  },
  {
    id: "mizukyo-seam-b",
    fragmentId: "mizukyo-b",
    path: "M300 0L280 95L325 190L290 285L315 390L285 500L310 625",
  },
  {
    id: "mizukyo-seam-c",
    fragmentId: "mizukyo-c",
    path: "M445 0L470 105L430 205L465 300L435 405L475 515L455 625",
  },
  {
    id: "mizukyo-seam-d",
    fragmentId: "mizukyo-d",
    path: "M585 0L565 105L605 215L570 315L600 420L560 520L585 625",
  },
  {
    id: "mizukyo-seam-e",
    fragmentId: "mizukyo-e",
    path: "M725 0L750 95L710 185L745 295L715 390L755 495L730 625",
  },
  {
    id: "mizukyo-seam-f",
    fragmentId: "mizukyo-f",
    path: "M865 0L845 100L885 200L850 305L880 405L845 510L870 625",
  },
];

const kuroganeFragments: MemoryFragmentDefinition[] = [
  {
    id: "kurogane-a",
    path: "M0 0H330L350 80L315 140L340 208H0Z",
    initial: { x: -0.2, y: -0.16 },
    rotation: -6.2,
    snapRadius: 0.078,
    seamId: "kurogane-seam-a",
  },
  {
    id: "kurogane-b",
    path: "M330 0H665L640 72L675 135L650 208H340L315 140L350 80Z",
    initial: { x: 0.01, y: -0.2 },
    rotation: 4.6,
    snapRadius: 0.074,
    seamId: "kurogane-seam-b",
  },
  {
    id: "kurogane-c",
    path: "M665 0H1000V208H650L675 135L640 72Z",
    initial: { x: 0.2, y: -0.15 },
    rotation: 6.4,
    snapRadius: 0.076,
    seamId: "kurogane-seam-c",
  },
  {
    id: "kurogane-d",
    path: "M0 208H340L315 275L355 345L325 416H0Z",
    initial: { x: -0.22, y: 0.01 },
    rotation: 5.3,
    snapRadius: 0.072,
    seamId: "kurogane-seam-d",
  },
  {
    id: "kurogane-e",
    path: "M340 208H650L675 275L635 345L665 416H325L355 345L315 275Z",
    initial: { x: 0.01, y: 0.2 },
    rotation: -5.8,
    snapRadius: 0.07,
    seamId: "kurogane-seam-e",
  },
  {
    id: "kurogane-f",
    path: "M650 208H1000V416H665L635 345L675 275Z",
    initial: { x: 0.22, y: 0.03 },
    rotation: -4.9,
    snapRadius: 0.072,
    seamId: "kurogane-seam-f",
  },
  {
    id: "kurogane-g",
    path: "M0 416H325L350 485L315 555L335 625H0Z",
    initial: { x: -0.19, y: 0.18 },
    rotation: -6.8,
    snapRadius: 0.076,
    seamId: "kurogane-seam-g",
  },
  {
    id: "kurogane-h",
    path: "M325 416H665L640 485L675 555L650 625H335L315 555L350 485Z",
    initial: { x: -0.01, y: 0.23 },
    rotation: 5.9,
    snapRadius: 0.07,
    seamId: "kurogane-seam-h",
  },
  {
    id: "kurogane-i",
    path: "M665 416H1000V625H650L675 555L640 485Z",
    initial: { x: 0.2, y: 0.18 },
    rotation: 6.6,
    snapRadius: 0.074,
    seamId: "kurogane-seam-i",
  },
];

const kuroganeSeams: KintsugiSeamDefinition[] = [
  {
    id: "kurogane-seam-a",
    fragmentId: "kurogane-a",
    path: "M330 0L350 80L315 140L340 208",
  },
  {
    id: "kurogane-seam-b",
    fragmentId: "kurogane-b",
    path: "M665 0L640 72L675 135L650 208",
  },
  {
    id: "kurogane-seam-d",
    fragmentId: "kurogane-d",
    path: "M0 208H340L315 275L355 345L325 416",
  },
  {
    id: "kurogane-seam-e",
    fragmentId: "kurogane-e",
    path: "M340 208H650L675 275L635 345L665 416",
  },
  {
    id: "kurogane-seam-f",
    fragmentId: "kurogane-f",
    path: "M650 208H1000",
  },
  {
    id: "kurogane-seam-g",
    fragmentId: "kurogane-g",
    path: "M0 416H325L350 485L315 555L335 625",
  },
  {
    id: "kurogane-seam-h",
    fragmentId: "kurogane-h",
    path: "M325 416H665L640 485L675 555L650 625",
  },
];

export const memoryDefinitions: MemoryDefinition[] = [
  {
    id: "hanamori",
    index: 1,
    title: "HANAMORI",
    titleJp: "花守",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.hanamoriBroken,
    restoredAsset: rememberAssets.hanamoriRestored,
    fragments: hanamoriFragments,
    seams: hanamoriSeams,
    snapRatio: 0.095,
    completionCopy: {
      pt: "Alguém ainda se lembra deste lugar.",
      en: "Someone still remembers this place.",
    },
    palette: {
      accent: "#d9b879",
      glow: "#eadab6",
      shadow: "#541d29",
    },
  },
  {
    id: "mizukyo",
    index: 2,
    title: "MIZUKYO",
    titleJp: "水鏡",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.mizukyoBroken,
    restoredAsset: rememberAssets.mizukyoRestored,
    fragments: mizukyoFragments,
    seams: mizukyoSeams,
    snapRatio: 0.082,
    completionCopy: {
      pt: "A água devolve o que tentou esconder.",
      en: "The water returns what it tried to hide.",
    },
    palette: {
      accent: "#a9c9d4",
      glow: "#dcecf0",
      shadow: "#18384b",
    },
  },
  {
    id: "kurogane",
    index: 3,
    title: "KUROGANE",
    titleJp: "黒鉄",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.kuroganeBroken,
    restoredAsset: rememberAssets.kuroganeRestored,
    fragments: kuroganeFragments,
    seams: kuroganeSeams,
    snapRatio: 0.072,
    completionCopy: {
      pt: "Até o ferro se lembra do que foi perdido.",
      en: "Even iron remembers what was lost.",
    },
    palette: {
      accent: "#b89c68",
      glow: "#e3d3a8",
      shadow: "#3b2520",
    },
  },
];

export const getMemoryDefinition = (memoryId: MemoryId) =>
  memoryDefinitions.find((memory) => memory.id === memoryId);
