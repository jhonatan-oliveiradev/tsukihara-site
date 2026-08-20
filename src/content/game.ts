export const chapterNav = [
  { href: "#akari", label: "Akari" },
  { href: "#realms", label: "World" },
  { href: "#bonds", label: "Bonds" },
  { href: "#eclipse", label: "Eclipse" },
] as const;

export const realms = [
  {
    id: "hanamori",
    title: "Hanamori",
    kanji: "花守",
    label: "Temple of blossoms",
    image: "/images/hanamori.webp",
    copy: "A sanctuary of red timber, suspended bridges and drifting sakura high above the valley.",
  },
  {
    id: "mizukyo",
    title: "Mizukyo",
    kanji: "水鏡",
    label: "Mirror of water",
    image: "/images/mizukyo.webp",
    copy: "Waterfalls cut through the mountainside and turn every passage into mist, reflection and vertical motion.",
  },
  {
    id: "kurogane",
    title: "Kurogane",
    kanji: "黒鉄",
    label: "Ruins of iron",
    image: "/images/kurogane.webp",
    copy: "Broken stone, scorched metal and forgotten structures mark the most severe edge of Tsukihara's world.",
  },
] as const;

export const characters = [
  { name: "Haku", kanji: "白", role: "Guardian spirit", image: "/images/haku.webp" },
  { name: "Yume", kanji: "夢", role: "Dream-bearer", image: "/images/yume.webp" },
  { name: "Mochi", kanji: "餅", role: "Companion", image: "/images/mochi.webp" },
  { name: "Kaien Aramasa", kanji: "荒正", role: "Wanderer", image: "/images/kaien-aramasa.webp" },
] as const;
