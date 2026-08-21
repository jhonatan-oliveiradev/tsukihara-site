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
    image: "/assets_hq/templo-hanamori.png",
    copy: "A sanctuary of red timber, suspended bridges and drifting sakura high above the valley.",
  },
  {
    id: "mizukyo",
    title: "Mizukyo",
    kanji: "水鏡",
    label: "Mirror of water",
    image: "/assets_hq/mizukyo-cachoeiras.png",
    copy: "Waterfalls cut through the mountainside and turn every passage into mist, reflection and vertical motion.",
  },
  {
    id: "kurogane",
    title: "Kurogane",
    kanji: "黒鉄",
    label: "Ruins of iron",
    image: "/assets_hq/kurogane-ruinas.png",
    copy: "Broken stone, scorched metal and forgotten structures mark the most severe edge of Tsukihara's world.",
  },
] as const;