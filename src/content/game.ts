export const chapterNav = [
  { href: "#manifesto", label: "Story" },
  { href: "#realms", label: "World" },
  { href: "#akari", label: "Akari" },
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

export const loreChapters = [
  {
    index: "01",
    title: "Moonbound Vows",
    kanji: "月誓",
    copy: "Promises made beneath the moon do not disappear. They return as memory, burden and power.",
    time: "Origin",
  },
  {
    index: "02",
    title: "Sacred Temples",
    kanji: "神殿",
    copy: "Shrines preserve more than prayer. Some guard passages, old names and things better left sleeping.",
    time: "Realm",
  },
  {
    index: "03",
    title: "Guardian Spirits",
    kanji: "守霊",
    copy: "Not every spirit is an omen. Some choose a path, a person and a vow to protect.",
    time: "Bond",
  },
  {
    index: "04",
    title: "Forgotten Iron",
    kanji: "黒鉄",
    copy: "Kurogane remembers the age when devotion became industry and sacred ground learned to burn.",
    time: "Ruin",
  },
  {
    index: "05",
    title: "The Eclipse",
    kanji: "月蝕",
    copy: "When the moon closes its eye, hidden states awaken and every vow is tested against what remains.",
    time: "Omen",
  },
] as const;
