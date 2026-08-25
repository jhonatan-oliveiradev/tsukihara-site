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

export type MemoryMechanic = "standard" | "false-memory" | "overlapping";
export type RealityState = "a" | "b";

export type FalseMemoryFragment = MemoryFragmentDefinition & {
  truth: "true" | "false";
  sourceAsset?: string;
};

export type OverlappingFragment = MemoryFragmentDefinition & {
  stableReality: RealityState;
};

type BaseMemoryDefinition<TFragment extends MemoryFragmentDefinition> = {
  id: MemoryId;
  index: 1 | 2 | 3 | 4 | 5;
  mechanic: MemoryMechanic;
  title: string;
  titleJp: string;
  viewBox: { width: number; height: number };
  brokenAsset: string;
  restoredAsset: string;
  fragments: TFragment[];
  seams: KintsugiSeamDefinition[];
  snapRatio: number;
  parSeconds: number;
  completionCopy: LocalizedCopy;
  palette: MemoryPalette;
};

export type StandardMemoryDefinition = BaseMemoryDefinition<MemoryFragmentDefinition> & {
  mechanic: "standard";
};

export type FalseMemoryDefinition = BaseMemoryDefinition<FalseMemoryFragment> & {
  mechanic: "false-memory";
  distortionAsset: string;
};

export type OverlappingMemoryDefinition = BaseMemoryDefinition<OverlappingFragment> & {
  mechanic: "overlapping";
  stateAAsset: string;
  stateBAsset: string;
  focusOverlayAsset: string;
};

export type MemoryDefinition =
  StandardMemoryDefinition | FalseMemoryDefinition | OverlappingMemoryDefinition;

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
  { id: "kurogane-seam-a", fragmentId: "kurogane-a", path: "M330 0L350 80L315 140L340 208" },
  { id: "kurogane-seam-b", fragmentId: "kurogane-b", path: "M665 0L640 72L675 135L650 208" },
  { id: "kurogane-seam-d", fragmentId: "kurogane-d", path: "M0 208H340L315 275L355 345L325 416" },
  { id: "kurogane-seam-e", fragmentId: "kurogane-e", path: "M340 208H650L675 275L635 345L665 416" },
  { id: "kurogane-seam-f", fragmentId: "kurogane-f", path: "M650 208H1000" },
  { id: "kurogane-seam-g", fragmentId: "kurogane-g", path: "M0 416H325L350 485L315 555L335 625" },
  { id: "kurogane-seam-h", fragmentId: "kurogane-h", path: "M325 416H665L640 485L675 555L650 625" },
];

const yumegakureTrueFragments: FalseMemoryFragment[] = [
  {
    id: "yumegakure-a",
    truth: "true",
    path: "M0 0H150L176 100L142 205L168 315L138 430L158 625H0Z",
    initial: { x: -0.2, y: -0.12 },
    rotation: -8,
    snapRadius: 0.078,
    seamId: "yumegakure-seam-a",
  },
  {
    id: "yumegakure-b",
    truth: "true",
    path: "M150 0H300L278 92L322 190L288 300L316 414L286 520L305 625H158L138 430L168 315L142 205L176 100Z",
    initial: { x: -0.12, y: 0.18 },
    rotation: 7,
    snapRadius: 0.076,
    seamId: "yumegakure-seam-b",
  },
  {
    id: "yumegakure-c",
    truth: "true",
    path: "M300 0H445L470 104L432 210L466 318L436 420L474 520L452 625H305L286 520L316 414L288 300L322 190L278 92Z",
    initial: { x: -0.05, y: -0.2 },
    rotation: -6,
    snapRadius: 0.074,
    seamId: "yumegakure-seam-c",
  },
  {
    id: "yumegakure-d",
    truth: "true",
    path: "M445 0H585L566 108L606 216L570 326L602 430L562 530L586 625H452L474 520L436 420L466 318L432 210L470 104Z",
    initial: { x: 0.04, y: 0.22 },
    rotation: 8,
    snapRadius: 0.072,
    seamId: "yumegakure-seam-d",
  },
  {
    id: "yumegakure-e",
    truth: "true",
    path: "M585 0H725L750 96L712 196L746 306L716 410L754 512L730 625H586L562 530L602 430L570 326L606 216L566 108Z",
    initial: { x: 0.1, y: -0.19 },
    rotation: -7,
    snapRadius: 0.074,
    seamId: "yumegakure-seam-e",
  },
  {
    id: "yumegakure-f",
    truth: "true",
    path: "M725 0H865L846 102L884 204L852 312L882 416L846 520L870 625H730L754 512L716 410L746 306L712 196L750 96Z",
    initial: { x: 0.16, y: 0.16 },
    rotation: 6,
    snapRadius: 0.072,
    seamId: "yumegakure-seam-f",
  },
  {
    id: "yumegakure-g",
    truth: "true",
    path: "M865 0H1000V625H870L846 520L882 416L852 312L884 204L846 102Z",
    initial: { x: 0.22, y: -0.1 },
    rotation: 9,
    snapRadius: 0.076,
    seamId: "yumegakure-seam-g",
  },
];

const yumegakureFalseFragments: FalseMemoryFragment[] = [
  {
    id: "yumegakure-false-01",
    truth: "false",
    sourceAsset: rememberAssets.yumegakureFalseFragment01,
    path: yumegakureTrueFragments[1].path,
    initial: { x: -0.24, y: 0.24 },
    rotation: -11,
    snapRadius: 0.076,
    seamId: "yumegakure-seam-b",
  },
  {
    id: "yumegakure-false-02",
    truth: "false",
    sourceAsset: rememberAssets.yumegakureFalseFragment02,
    path: yumegakureTrueFragments[5].path,
    initial: { x: 0.24, y: -0.24 },
    rotation: 12,
    snapRadius: 0.072,
    seamId: "yumegakure-seam-f",
  },
];

const yumegakureSeams: KintsugiSeamDefinition[] = [
  {
    id: "yumegakure-seam-a",
    fragmentId: "yumegakure-a",
    path: "M150 0L176 100L142 205L168 315L138 430L158 625",
  },
  {
    id: "yumegakure-seam-b",
    fragmentId: "yumegakure-b",
    path: "M300 0L278 92L322 190L288 300L316 414L286 520L305 625",
  },
  {
    id: "yumegakure-seam-c",
    fragmentId: "yumegakure-c",
    path: "M445 0L470 104L432 210L466 318L436 420L474 520L452 625",
  },
  {
    id: "yumegakure-seam-d",
    fragmentId: "yumegakure-d",
    path: "M585 0L566 108L606 216L570 326L602 430L562 530L586 625",
  },
  {
    id: "yumegakure-seam-e",
    fragmentId: "yumegakure-e",
    path: "M725 0L750 96L712 196L746 306L716 410L754 512L730 625",
  },
  {
    id: "yumegakure-seam-f",
    fragmentId: "yumegakure-f",
    path: "M865 0L846 102L884 204L852 312L882 416L846 520L870 625",
  },
];

const gekkaiFragments: OverlappingFragment[] = [
  {
    id: "gekkai-a",
    stableReality: "a",
    path: "M0 0H250L272 80L240 160L260 240L235 315H0Z",
    initial: { x: -0.2, y: -0.18 },
    rotation: -7,
    snapRadius: 0.072,
    seamId: "gekkai-seam-a",
  },
  {
    id: "gekkai-b",
    stableReality: "b",
    path: "M250 0H500L480 80L515 165L490 245L510 315H235L260 240L240 160L272 80Z",
    initial: { x: -0.06, y: -0.22 },
    rotation: 8,
    snapRadius: 0.07,
    seamId: "gekkai-seam-b",
  },
  {
    id: "gekkai-c",
    stableReality: "a",
    path: "M500 0H750L770 90L735 170L765 250L742 315H510L490 245L515 165L480 80Z",
    initial: { x: 0.08, y: -0.2 },
    rotation: -8,
    snapRadius: 0.07,
    seamId: "gekkai-seam-c",
  },
  {
    id: "gekkai-d",
    stableReality: "b",
    path: "M750 0H1000V315H742L765 250L735 170L770 90Z",
    initial: { x: 0.22, y: -0.16 },
    rotation: 9,
    snapRadius: 0.072,
    seamId: "gekkai-seam-d",
  },
  {
    id: "gekkai-e",
    stableReality: "b",
    path: "M0 315H235L260 380L238 455L270 535L248 625H0Z",
    initial: { x: -0.22, y: 0.16 },
    rotation: 8,
    snapRadius: 0.072,
    seamId: "gekkai-seam-e",
  },
  {
    id: "gekkai-f",
    stableReality: "a",
    path: "M235 315H510L490 385L520 465L488 545L505 625H248L270 535L238 455L260 380Z",
    initial: { x: -0.07, y: 0.22 },
    rotation: -9,
    snapRadius: 0.07,
    seamId: "gekkai-seam-f",
  },
  {
    id: "gekkai-g",
    stableReality: "b",
    path: "M510 315H742L765 385L735 465L770 545L748 625H505L488 545L520 465L490 385Z",
    initial: { x: 0.08, y: 0.2 },
    rotation: 7,
    snapRadius: 0.07,
    seamId: "gekkai-seam-g",
  },
  {
    id: "gekkai-h",
    stableReality: "a",
    path: "M742 315H1000V625H748L770 545L735 465L765 385Z",
    initial: { x: 0.22, y: 0.18 },
    rotation: -8,
    snapRadius: 0.072,
    seamId: "gekkai-seam-h",
  },
];

const gekkaiSeams: KintsugiSeamDefinition[] = [
  { id: "gekkai-seam-a", fragmentId: "gekkai-a", path: "M250 0L272 80L240 160L260 240L235 315" },
  { id: "gekkai-seam-b", fragmentId: "gekkai-b", path: "M500 0L480 80L515 165L490 245L510 315" },
  { id: "gekkai-seam-c", fragmentId: "gekkai-c", path: "M750 0L770 90L735 170L765 250L742 315" },
  {
    id: "gekkai-seam-e",
    fragmentId: "gekkai-e",
    path: "M0 315H235L260 380L238 455L270 535L248 625",
  },
  {
    id: "gekkai-seam-f",
    fragmentId: "gekkai-f",
    path: "M235 315H510L490 385L520 465L488 545L505 625",
  },
  {
    id: "gekkai-seam-g",
    fragmentId: "gekkai-g",
    path: "M510 315H742L765 385L735 465L770 545L748 625",
  },
];

export const memoryDefinitions: MemoryDefinition[] = [
  {
    id: "hanamori",
    index: 1,
    mechanic: "standard",
    title: "HANAMORI",
    titleJp: "花守",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.hanamoriBroken,
    restoredAsset: rememberAssets.hanamoriRestored,
    fragments: hanamoriFragments,
    seams: hanamoriSeams,
    snapRatio: 0.095,
    parSeconds: 120,
    completionCopy: {
      pt: "Alguém ainda se lembra deste lugar.",
      en: "Someone still remembers this place.",
    },
    palette: { accent: "#d9b879", glow: "#eadab6", shadow: "#541d29" },
  },
  {
    id: "mizukyo",
    index: 2,
    mechanic: "standard",
    title: "MIZUKYO",
    titleJp: "水鏡",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.mizukyoBroken,
    restoredAsset: rememberAssets.mizukyoRestored,
    fragments: mizukyoFragments,
    seams: mizukyoSeams,
    snapRatio: 0.082,
    parSeconds: 165,
    completionCopy: {
      pt: "A água devolve o que tentou esconder.",
      en: "The water returns what it tried to hide.",
    },
    palette: { accent: "#a9c9d4", glow: "#dcecf0", shadow: "#18384b" },
  },
  {
    id: "kurogane",
    index: 3,
    mechanic: "standard",
    title: "KUROGANE",
    titleJp: "黒鉄",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.kuroganeBroken,
    restoredAsset: rememberAssets.kuroganeRestored,
    fragments: kuroganeFragments,
    seams: kuroganeSeams,
    snapRatio: 0.072,
    parSeconds: 210,
    completionCopy: {
      pt: "Até o ferro se lembra do que foi perdido.",
      en: "Even iron remembers what was lost.",
    },
    palette: { accent: "#b89c68", glow: "#e3d3a8", shadow: "#3b2520" },
  },
  {
    id: "yumegakure",
    index: 4,
    mechanic: "false-memory",
    title: "YUMEGAKURE",
    titleJp: "夢隠",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.yumegakureBroken,
    restoredAsset: rememberAssets.yumegakureRestored,
    fragments: [...yumegakureTrueFragments, ...yumegakureFalseFragments],
    seams: yumegakureSeams,
    snapRatio: 0.074,
    parSeconds: 240,
    distortionAsset: rememberAssets.yumegakureDistortionOverlay,
    completionCopy: {
      pt: "A verdade resiste mesmo quando a lembrança mente.",
      en: "Truth endures even when memory lies.",
    },
    palette: { accent: "#c8a2c8", glow: "#ead7f0", shadow: "#35243f" },
  },
  {
    id: "gekkai",
    index: 5,
    mechanic: "overlapping",
    title: "GEKKAI",
    titleJp: "月界",
    viewBox: VIEWBOX,
    brokenAsset: rememberAssets.gekkaiStateA,
    restoredAsset: rememberAssets.gekkaiRestored,
    fragments: gekkaiFragments,
    seams: gekkaiSeams,
    snapRatio: 0.07,
    parSeconds: 270,
    stateAAsset: rememberAssets.gekkaiStateA,
    stateBAsset: rememberAssets.gekkaiStateB,
    focusOverlayAsset: rememberAssets.gekkaiLunarFocusOverlay,
    completionCopy: {
      pt: "Duas realidades se alinham sob a mesma Lua.",
      en: "Two realities align beneath the same Moon.",
    },
    palette: { accent: "#d7d0a8", glow: "#f0ebcf", shadow: "#1f2538" },
  },
];

export const getMemoryDefinition = (memoryId: MemoryId) =>
  memoryDefinitions.find((memory) => memory.id === memoryId);
