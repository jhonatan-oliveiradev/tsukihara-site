export const realms = [
  {
    id: "hanamori",
    index: "02",
    title: "Hanamori",
    kanji: "花守",
    subtitle: "Sanctuary of blossoms",
    description:
      "A mountain sanctuary suspended between water, cedar, vermilion gates and petals carried by the wind.",
    image: "/images/hanamori.webp",
  },
  {
    id: "mizukyo",
    index: "03",
    title: "Mizukyo",
    kanji: "水鏡",
    subtitle: "The mirror of water",
    description:
      "A vertical realm carved by waterfalls and mist, where every path seems to reflect another world.",
    image: "/images/mizukyo.webp",
  },
  {
    id: "kurogane",
    index: "04",
    title: "Kurogane",
    kanji: "黒鉄",
    subtitle: "Ruins beneath iron skies",
    description:
      "Ancient stone and blackened steel mark a land where the memory of war never completely disappeared.",
    image: "/images/kurogane.webp",
  },
] as const;

export const chapterNav = [
  { href: "#akari", label: "Akari" },
  { href: "#realms", label: "Realms" },
  { href: "#bonds", label: "Bonds" },
  { href: "#eclipse", label: "Eclipse" },
] as const;
