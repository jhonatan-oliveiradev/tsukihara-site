import type { Locale } from "@/content/immersive-copy";

export const finalJourneyAssets = {
  hero: "/11-final/scenes/f01-akari-haku-mochi-horizon.png",
  characters: "/11-final/characters/f02-akari-haku-mochi-back-transparent.png",
  horizon: "/11-final/scenes/f03-tsukihara-final-horizon.png",
  moon: "/11-final/environment/f04-final-moon.png",
  foreground: "/11-final/environment/f05-final-foreground.png",
  atmosphere: "/11-final/fx/f06-final-atmosphere-overlay.png",
  ornament: "/11-final/fx/f07-footer-lunar-ornament.png",
} as const;

export type FinalJourneyLink = {
  label: string;
  href: string;
};

export type FinalJourneySocialLink = FinalJourneyLink & {
  external: true;
};

export type FinalJourneyCopy = {
  eyebrow: string;
  headline: [string, string];
  body: string[];
  horizonLine: string;
  horizonMeta: string;
  ctaLabel: string;
  ctaHref: string | null;
  brand: string;
  subtitle: string;
  signature: string;
  navigationLabel: string;
  navigation: FinalJourneyLink[];
  socialLabel: string;
  socials: FinalJourneySocialLink[];
  copyright: string;
  rights: string;
  legal: FinalJourneyLink[];
  easterEggLabel: string;
  easterEggMessage: string;
};

const navigation = {
  pt: [
    { label: "MUNDO", href: "#top" },
    { label: "AKARI", href: "#akari" },
    { label: "REINOS", href: "#realms" },
    { label: "GAMEPLAY", href: "#gameplay" },
    { label: "ARQUIVOS", href: "#lore" },
  ],
  en: [
    { label: "WORLD", href: "#top" },
    { label: "AKARI", href: "#akari" },
    { label: "REALMS", href: "#realms" },
    { label: "GAMEPLAY", href: "#gameplay" },
    { label: "ARCHIVES", href: "#lore" },
  ],
} satisfies Record<Locale, FinalJourneyLink[]>;

export const finalJourneyCopy: Record<Locale, FinalJourneyCopy> = {
  pt: {
    eyebrow: "THE JOURNEY CONTINUES",
    headline: ["O mundo pode esquecer.", "Você não precisa."],
    body: [
      "Akari ainda não sabe quanto de Tsukihara poderá ser restaurado.",
      "Alguns lugares já desapareceram. Algumas memórias nunca voltarão.",
      "Mas enquanto houver algo que possa ser lembrado, sua jornada continua.",
    ],
    horizonLine: "Há lugares que ainda precisam ser lembrados.",
    horizonMeta: "THE NINE REALMS AWAIT",
    ctaLabel: "FOLLOW THE JOURNEY",
    ctaHref: null,
    brand: "TSUKIHARA",
    subtitle: "ECLIPSE OF THE NINE REALMS",
    signature: "REMEMBER WHAT REMAINS.",
    navigationLabel: "Navegação final",
    navigation: navigation.pt,
    socialLabel: "Comunidade",
    socials: [],
    copyright: "© 2026 TSUKIHARA",
    rights: "ALL RIGHTS RESERVED",
    legal: [],
    easterEggLabel: "Ativar eclipse lunar",
    easterEggMessage: "Ainda há algo que você esqueceu.",
  },
  en: {
    eyebrow: "THE JOURNEY CONTINUES",
    headline: ["The world may forget.", "You do not have to."],
    body: [
      "Akari still does not know how much of Tsukihara can be restored.",
      "Some places are already gone. Some memories will never return.",
      "But while something can still be remembered, her journey continues.",
    ],
    horizonLine: "There are places that still need to be remembered.",
    horizonMeta: "THE NINE REALMS AWAIT",
    ctaLabel: "FOLLOW THE JOURNEY",
    ctaHref: null,
    brand: "TSUKIHARA",
    subtitle: "ECLIPSE OF THE NINE REALMS",
    signature: "REMEMBER WHAT REMAINS.",
    navigationLabel: "Final navigation",
    navigation: navigation.en,
    socialLabel: "Community",
    socials: [],
    copyright: "© 2026 TSUKIHARA",
    rights: "ALL RIGHTS RESERVED",
    legal: [],
    easterEggLabel: "Trigger lunar eclipse",
    easterEggMessage: "There is still something you forgot.",
  },
};
