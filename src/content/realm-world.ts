export type RealmId =
  | "hanamori"
  | "kurogane"
  | "mizukyo"
  | "amahara"
  | "hinokagura"
  | "yumegakure"
  | "yoru-no-mori"
  | "gekkai"
  | "tsuki-no-miya";

export type RealmParticle =
  | "petals"
  | "sparks"
  | "water"
  | "snow"
  | "ash"
  | "dream"
  | "spores"
  | "fragments"
  | "moon-dust";

export type RealmWorldEntry = {
  id: RealmId;
  title: string;
  kanji: string;
  image: string;
  emblem: string;
  aspect: string;
  glow: string;
  particle: RealmParticle;
  map: {
    x: number;
    y: number;
    radius: number;
    popoverX: number;
    popoverY: number;
  };
};

export const realmWorld: readonly RealmWorldEntry[] = [
  {
    id: "hanamori",
    title: "Hanamori",
    kanji: "花守",
    image: "/reinos/01_hanamori.png",
    emblem: "/emblema-reinos/01.png",
    aspect: "Origem",
    glow: "#d95772",
    particle: "petals",
    map: { x: 24, y: 56, radius: 9, popoverX: 31, popoverY: 34 },
  },
  {
    id: "kurogane",
    title: "Kurogane",
    kanji: "黒鉄",
    image: "/reinos/02_kurogane.png",
    emblem: "/emblema-reinos/02.png",
    aspect: "Ordem",
    glow: "#c37b55",
    particle: "sparks",
    map: { x: 22, y: 34, radius: 9, popoverX: 29, popoverY: 14 },
  },
  {
    id: "mizukyo",
    title: "Mizukyo",
    kanji: "水鏡",
    image: "/reinos/03_mizukyo.png",
    emblem: "/emblema-reinos/03.png",
    aspect: "Verdade",
    glow: "#5d9fbd",
    particle: "water",
    map: { x: 39, y: 24, radius: 9, popoverX: 46, popoverY: 8 },
  },
  {
    id: "amahara",
    title: "Amahara",
    kanji: "天原",
    image: "/reinos/04_amahara.png",
    emblem: "/emblema-reinos/04.png",
    aspect: "Fé",
    glow: "#d6d7d4",
    particle: "snow",
    map: { x: 59, y: 21, radius: 9, popoverX: 63, popoverY: 8 },
  },
  {
    id: "hinokagura",
    title: "Hinokagura",
    kanji: "火神楽",
    image: "/reinos/05_hinokagura.png",
    emblem: "/emblema-reinos/05.png",
    aspect: "Dor",
    glow: "#d75136",
    particle: "ash",
    map: { x: 78, y: 36, radius: 9, popoverX: 67, popoverY: 16 },
  },
  {
    id: "yumegakure",
    title: "Yumegakure",
    kanji: "夢隠",
    image: "/reinos/06_yumegakure.png",
    emblem: "/emblema-reinos/06.png",
    aspect: "Desejo",
    glow: "#9b6ac0",
    particle: "dream",
    map: { x: 80, y: 58, radius: 9, popoverX: 66, popoverY: 42 },
  },
  {
    id: "yoru-no-mori",
    title: "Yoru no Mori",
    kanji: "夜森",
    image: "/reinos/07_yoru_no_mori.png",
    emblem: "/emblema-reinos/07.png",
    aspect: "Medo",
    glow: "#5aab93",
    particle: "spores",
    map: { x: 66, y: 76, radius: 9, popoverX: 54, popoverY: 52 },
  },
  {
    id: "gekkai",
    title: "Gekkai",
    kanji: "月界",
    image: "/reinos/08_gekkai.png",
    emblem: "/emblema-reinos/08.png",
    aspect: "Ruptura",
    glow: "#b34c75",
    particle: "fragments",
    map: { x: 45, y: 78, radius: 9, popoverX: 29, popoverY: 52 },
  },
  {
    id: "tsuki-no-miya",
    title: "Tsuki no Miya",
    kanji: "月宮",
    image: "/reinos/09_tsuki_no_miya.png",
    emblem: "/emblema-reinos/09.png",
    aspect: "Transcendência",
    glow: "#d8c6af",
    particle: "moon-dust",
    map: { x: 50, y: 49, radius: 10, popoverX: 53, popoverY: 27 },
  },
] as const;

type LocalizedRealm = {
  label: string;
  copy: string;
  state: string;
  threat: string;
};

type RealmWorldLocale = {
  intro: {
    eyebrow: string;
    title: string;
    body: string;
    hint: string;
  };
  labels: {
    state: string;
    threat: string;
    explore: string;
    close: string;
    previous: string;
    next: string;
  };
  realms: Record<RealmId, LocalizedRealm>;
};

export const realmWorldCopy: Record<"pt" | "en", RealmWorldLocale> = {
  pt: {
    intro: {
      eyebrow: "THE NINE REALMS",
      title: "Nove reinos. Nove partes de um mundo tentando lembrar quem é.",
      body: "Os reinos de Tsukihara existem ligados à Lua-Mãe por uma mesma rede de memórias. Cada região preserva uma parte diferente daquilo que mantém o mundo inteiro. Explore o mapa para descobrir o que ainda permanece — e o que o Eclipse já começou a apagar.",
      hint: "Passe pelos reinos ou selecione um selo para explorar.",
    },
    labels: {
      state: "Estado",
      threat: "Ameaça",
      explore: "Explore o reino",
      close: "Fechar",
      previous: "Reino anterior",
      next: "Próximo reino",
    },
    realms: {
      hanamori: {
        label: "Reino das Cerejeiras",
        copy: "Um reino de cerejeiras, templos e memórias antigas. Foi aqui que os primeiros sinais do Eclipse Carmesim começaram a aparecer.",
        state: "Instável",
        threat: "Eclipse emergente",
      },
      kurogane: {
        label: "Reino do Ferro Negro",
        copy: "Forjas sagradas, muralhas e máquinas ancestrais sustentam uma ordem que continua funcionando mesmo depois de esquecer para quem foi criada.",
        state: "Militarizado",
        threat: "Autômatos despertos",
      },
      mizukyo: {
        label: "Reino dos Espelhos d’Água",
        copy: "Lagos, cachoeiras e templos submersos preservam verdades que só existem enquanto alguém consegue distinguir memória de reflexo.",
        state: "Fragmentado",
        threat: "Reflexos falsos",
      },
      amahara: {
        label: "Reino dos Céus Sagrados",
        copy: "Mosteiros suspensos acima das nuvens guardam votos, sinos e peregrinações que sobrevivem apenas pela fé daqueles que ainda se lembram deles.",
        state: "Isolado",
        threat: "Silêncio celestial",
      },
      hinokagura: {
        label: "Reino das Chamas Rituais",
        copy: "Templos vulcânicos e procissões de fogo transformaram a dor em rito. Agora as cinzas carregam lembranças que ninguém deveria respirar.",
        state: "Em combustão",
        threat: "Cinzas lunares",
      },
      yumegakure: {
        label: "Reino dos Sonhos Velados",
        copy: "Névoa, lanternas e jardins impossíveis respondem aos desejos de quem entra. Quanto mais alguém quer permanecer, menos consegue lembrar por que veio.",
        state: "Onírico",
        threat: "Desejos materializados",
      },
      "yoru-no-mori": {
        label: "Reino da Floresta Noturna",
        copy: "Uma floresta bioluminescente onde o medo altera trilhas, silhuetas e sons. O que persegue Akari nem sempre existia antes de ser imaginado.",
        state: "Hostil",
        threat: "Predadores do vazio",
      },
      gekkai: {
        label: "Reino da Fratura Lunar",
        copy: "A matéria perdeu continuidade. Pontes terminam no vazio, ruínas flutuam e caminhos atravessam fissuras que parecem cortar o próprio espaço.",
        state: "Rompido",
        threat: "Colapso espacial",
      },
      "tsuki-no-miya": {
        label: "Reino do Palácio da Lua",
        copy: "O domínio mais próximo da Lua-Mãe existe entre matéria e lembrança. Chegar até aqui significa atravessar o limite entre restaurar o mundo e transcender sua forma.",
        state: "Inacessível",
        threat: "Transcendência lunar",
      },
    },
  },
  en: {
    intro: {
      eyebrow: "THE NINE REALMS",
      title: "Nine realms. Nine pieces of a world trying to remember what it is.",
      body: "The realms of Tsukihara are bound to the Mother Moon by a single network of memories. Each region preserves a different part of what keeps the world whole. Explore the map to discover what remains — and what the Eclipse has already begun to erase.",
      hint: "Hover the realms or select a seal to explore.",
    },
    labels: {
      state: "State",
      threat: "Threat",
      explore: "Explore realm",
      close: "Close",
      previous: "Previous realm",
      next: "Next realm",
    },
    realms: {
      hanamori: {
        label: "Realm of Cherry Blossoms",
        copy: "A realm of cherry blossoms, temples and ancient memories. The first signs of the Crimson Eclipse began to surface here.",
        state: "Unstable",
        threat: "Emerging eclipse",
      },
      kurogane: {
        label: "Realm of Black Iron",
        copy: "Sacred forges, walls and ancestral machines uphold an order that keeps working even after forgetting who it was built to serve.",
        state: "Militarized",
        threat: "Awakened automata",
      },
      mizukyo: {
        label: "Realm of Water Mirrors",
        copy: "Lakes, waterfalls and submerged temples preserve truths that exist only while someone can tell memory from reflection.",
        state: "Fractured",
        threat: "False reflections",
      },
      amahara: {
        label: "Realm of Sacred Skies",
        copy: "Monasteries suspended above the clouds guard vows, bells and pilgrimages that survive only through the faith of those who still remember them.",
        state: "Isolated",
        threat: "Celestial silence",
      },
      hinokagura: {
        label: "Realm of Ritual Flame",
        copy: "Volcanic shrines and fire processions turned pain into ritual. Now the ash carries memories nobody should have to breathe.",
        state: "Burning",
        threat: "Lunar ash",
      },
      yumegakure: {
        label: "Realm of Veiled Dreams",
        copy: "Mist, lanterns and impossible gardens answer the desires of those who enter. The more someone wants to stay, the less they remember why they came.",
        state: "Oneiric",
        threat: "Manifest desire",
      },
      "yoru-no-mori": {
        label: "Realm of the Night Forest",
        copy: "A bioluminescent forest where fear reshapes trails, silhouettes and sound. What hunts Akari did not always exist before it was imagined.",
        state: "Hostile",
        threat: "Void predators",
      },
      gekkai: {
        label: "Realm of Lunar Fracture",
        copy: "Matter has lost continuity. Bridges end in the void, ruins float and paths cross fissures that seem to cut through space itself.",
        state: "Ruptured",
        threat: "Spatial collapse",
      },
      "tsuki-no-miya": {
        label: "Realm of the Moon Palace",
        copy: "The domain closest to the Mother Moon exists between matter and memory. Reaching it means crossing the boundary between restoring the world and transcending its form.",
        state: "Inaccessible",
        threat: "Lunar transcendence",
      },
    },
  },
};
