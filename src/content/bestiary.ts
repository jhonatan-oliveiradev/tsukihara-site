import type { Locale } from "@/content/immersive-copy";

export type BestiaryAssetCode =
  "B01" | "B02" | "B03" | "B04" | "B05" | "B06" | "B07" | "B08" | "B09" | "B10" | "B11" | "B12";

export type Threat = "MODERATE" | "HIGH" | "CRITICAL";

export type SpecimenRecord = {
  id: string;
  asset: BestiaryAssetCode;
  name: string;
  realm: string;
  type: string;
  description: string;
  threat: Threat;
  accent: string;
};

export type BossRecord = {
  id: string;
  asset: BestiaryAssetCode;
  nav: string;
  name: string;
  realm: string;
  aspect: string;
  body: string[];
  quote?: string;
  classified?: boolean;
  accent: string;
};

export const bestiaryAssets: Record<BestiaryAssetCode, string> = {
  B01: "/07-bestiary/mobs/b01-yokai-fractured.png",
  B02: "/07-bestiary/mobs/b02-lunar-guardian-corrupted.png",
  B03: "/07-bestiary/mobs/b03-kurogane-liturgical-machine.png",
  B04: "/07-bestiary/mobs/b04-mizukyo-echo.png",
  B05: "/07-bestiary/mobs/b05-yoru-predator.png",
  B06: "/07-bestiary/mobs/b06-gekkai-aberration.png",
  B07: "/07-bestiary/bosses/b07-emperor-faceless.png",
  B08: "/07-bestiary/bosses/b08-kaien-aramasa.png",
  B09: "/07-bestiary/bosses/b09-yume.png",
  B10: "/07-bestiary/bosses/b10-lady-tsukino-teaser.png",
  B11: "/07-bestiary/vfx/b11-bestiary-silhouettes.png",
  B12: "/07-bestiary/vfx/b12-bestiary-fx-overlay.png",
};

export const bestiaryCopy: Record<
  Locale,
  {
    eyebrow: string;
    introJp: string;
    introTitle: string;
    introBody: string[];
    bestiaryLabel: string;
    transitionJp: string;
    transitionTitle: string;
    bossesLabel: string;
    finalJp: string;
    finalTitle: string;
    finalBody: string;
    specimens: SpecimenRecord[];
    bosses: BossRecord[];
  }
> = {
  pt: {
    eyebrow: "BESTIARY / FORBIDDEN RECORDS",
    introJp: "蝕が消さぬものは形を変える",
    introTitle: "Aquilo que o Eclipse não apaga, ele transforma.",
    introBody: [
      "Nem toda memória desaparece.",
      "Algumas permanecem tempo demais. Outras se recusam a morrer.",
      "E algumas aprendem a lutar para não serem esquecidas.",
    ],
    bestiaryLabel: "BESTIÁRIO",
    transitionJp: "記録に収まらぬ存在がいる",
    transitionTitle: "Alguns seres não cabem em um registro.",
    bossesLabel: "BOSSES / RESTRICTED ENTITIES",
    finalJp: "蝕は怪物を生まない",
    finalTitle: "O Eclipse não cria monstros.",
    finalBody: "Ele revela aquilo que já estava tentando sobreviver.",
    specimens: [
      {
        id: "B01",
        asset: "B01",
        name: "Yokai Fraturado",
        realm: "Hanamori",
        type: "Memória Corrompida",
        description: "Espíritos presos entre o que eram e aquilo que o Eclipse tentou apagar.",
        threat: "MODERATE",
        accent: "#b88593",
      },
      {
        id: "B02",
        asset: "B02",
        name: "Guardião Lunar Corrompido",
        realm: "Amahara",
        type: "Sentinela Espiritual",
        description: "Antigos protetores incapazes de distinguir proteção de perseguição.",
        threat: "HIGH",
        accent: "#bfcbd6",
      },
      {
        id: "B03",
        asset: "B03",
        name: "Máquina Litúrgica",
        realm: "Kurogane",
        type: "Constructo Ritualístico",
        description:
          "Máquinas que continuam executando orações depois que seus mestres desapareceram.",
        threat: "HIGH",
        accent: "#a86e46",
      },
      {
        id: "B04",
        asset: "B04",
        name: "Eco de Mizukyo",
        realm: "Mizukyo",
        type: "Reflexo Instável",
        description: "Lembranças que se tornaram mais reais do que aqueles que as criaram.",
        threat: "MODERATE",
        accent: "#77bcc9",
      },
      {
        id: "B05",
        asset: "B05",
        name: "Predador da Noite",
        realm: "Yoru no Mori",
        type: "Manifestação Psicológica",
        description: "Assume a forma daquilo que suas presas mais temem encontrar no escuro.",
        threat: "HIGH",
        accent: "#6f708f",
      },
      {
        id: "B06",
        asset: "B06",
        name: "Aberração de Gekkai",
        realm: "Gekkai",
        type: "Ruptura Inter-reinos",
        description:
          "Fragmentos incompatíveis de múltiplas regiões de Tsukihara fundidos em um único ser.",
        threat: "CRITICAL",
        accent: "#9d557d",
      },
    ],
    bosses: [
      {
        id: "B07",
        asset: "B07",
        nav: "IMPERADOR",
        name: "O Imperador Sem Rosto",
        realm: "Kurogane",
        aspect: "Ordem",
        body: [
          "Ele não acredita mais nos deuses. Nem nas pessoas.",
          "Para ele, liberdade é apenas outro nome para erro. Se Tsukihara deve sobreviver, tudo precisa ocupar exatamente o lugar que lhe foi destinado.",
        ],
        quote: "Perfeição não precisa ser lembrada.",
        accent: "#a8753c",
      },
      {
        id: "B08",
        asset: "B08",
        nav: "KAIEN",
        name: "Kaien Aramasa",
        realm: "Hinokagura",
        aspect: "Dor",
        body: [
          "Kaien sobreviveu a tudo aquilo que deveria tê-lo destruído.",
          "Com o tempo, suas cicatrizes deixaram de contar sua história. Passaram a defini-la.",
        ],
        quote: "Se eu esquecer a ferida, o que restará de mim?",
        accent: "#8c4436",
      },
      {
        id: "B09",
        asset: "B09",
        nav: "YUME",
        name: "Yume",
        realm: "Yumegakure",
        aspect: "Desejo",
        body: [
          "Yume não ameaça com violência. Ela oferece exatamente aquilo que alguém deseja.",
          "Uma vida sem perdas. Um passado intacto. Um futuro perfeito. Tudo o que pede em troca é que você nunca acorde.",
        ],
        quote: "Por que voltar para um mundo que já te feriu?",
        accent: "#594b80",
      },
      {
        id: "B10",
        asset: "B10",
        nav: "TSUKINO",
        name: "LADY TSUKINO",
        realm: "CLASSIFIED",
        aspect: "UNKNOWN",
        body: ["Alguns registros foram apagados antes mesmo do Eclipse começar."],
        classified: true,
        accent: "#d7d0c9",
      },
    ],
  },
  en: {
    eyebrow: "BESTIARY / FORBIDDEN RECORDS",
    introJp: "蝕が消さぬものは形を変える",
    introTitle: "What the Eclipse does not erase, it transforms.",
    introBody: [
      "Not every memory disappears.",
      "Some remain for too long. Others refuse to die.",
      "And some learn to fight so they will not be forgotten.",
    ],
    bestiaryLabel: "BESTIARY",
    transitionJp: "記録に収まらぬ存在がいる",
    transitionTitle: "Some beings do not fit inside a record.",
    bossesLabel: "BOSSES / RESTRICTED ENTITIES",
    finalJp: "蝕は怪物を生まない",
    finalTitle: "The Eclipse does not create monsters.",
    finalBody: "It reveals what was already trying to survive.",
    specimens: [
      {
        id: "B01",
        asset: "B01",
        name: "Fractured Yokai",
        realm: "Hanamori",
        type: "Corrupted Memory",
        description: "Spirits trapped between what they were and what the Eclipse tried to erase.",
        threat: "MODERATE",
        accent: "#b88593",
      },
      {
        id: "B02",
        asset: "B02",
        name: "Corrupted Lunar Guardian",
        realm: "Amahara",
        type: "Spiritual Sentinel",
        description: "Ancient protectors no longer able to distinguish protection from pursuit.",
        threat: "HIGH",
        accent: "#bfcbd6",
      },
      {
        id: "B03",
        asset: "B03",
        name: "Liturgical Machine",
        realm: "Kurogane",
        type: "Ritual Construct",
        description: "Machines still performing prayers after their masters disappeared.",
        threat: "HIGH",
        accent: "#a86e46",
      },
      {
        id: "B04",
        asset: "B04",
        name: "Echo of Mizukyo",
        realm: "Mizukyo",
        type: "Unstable Reflection",
        description: "Memories that became more real than those who created them.",
        threat: "MODERATE",
        accent: "#77bcc9",
      },
      {
        id: "B05",
        asset: "B05",
        name: "Night Predator",
        realm: "Yoru no Mori",
        type: "Psychological Manifestation",
        description: "Takes the form of what its prey most fears finding in the dark.",
        threat: "HIGH",
        accent: "#6f708f",
      },
      {
        id: "B06",
        asset: "B06",
        name: "Gekkai Aberration",
        realm: "Gekkai",
        type: "Inter-realm Rupture",
        description: "Incompatible fragments of multiple regions fused into one being.",
        threat: "CRITICAL",
        accent: "#9d557d",
      },
    ],
    bosses: [
      {
        id: "B07",
        asset: "B07",
        nav: "EMPEROR",
        name: "The Faceless Emperor",
        realm: "Kurogane",
        aspect: "Order",
        body: [
          "He no longer believes in gods. Or people.",
          "To him, freedom is another name for error. If Tsukihara is to survive, everything must occupy its assigned place.",
        ],
        quote: "Perfection does not need to be remembered.",
        accent: "#a8753c",
      },
      {
        id: "B08",
        asset: "B08",
        nav: "KAIEN",
        name: "Kaien Aramasa",
        realm: "Hinokagura",
        aspect: "Pain",
        body: [
          "Kaien survived everything that should have destroyed him.",
          "Over time, his scars stopped telling his story. They began to define it.",
        ],
        quote: "If I forget the wound, what will remain of me?",
        accent: "#8c4436",
      },
      {
        id: "B09",
        asset: "B09",
        nav: "YUME",
        name: "Yume",
        realm: "Yumegakure",
        aspect: "Desire",
        body: [
          "Yume does not threaten with violence. She offers exactly what someone wants.",
          "A life without loss. An intact past. A perfect future. All she asks is that you never wake up.",
        ],
        quote: "Why return to a world that already hurt you?",
        accent: "#594b80",
      },
      {
        id: "B10",
        asset: "B10",
        nav: "TSUKINO",
        name: "LADY TSUKINO",
        realm: "CLASSIFIED",
        aspect: "UNKNOWN",
        body: ["Some records were erased before the Eclipse even began."],
        classified: true,
        accent: "#d7d0c9",
      },
    ],
  },
};
