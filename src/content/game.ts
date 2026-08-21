export const chapterNav = [
  { href: "#gate", label: "Threshold" },
  { href: "#realms", label: "World" },
  { href: "#akari", label: "Akari" },
  { href: "#lore", label: "Lore" },
  { href: "#eclipse", label: "Afterlight" },
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
