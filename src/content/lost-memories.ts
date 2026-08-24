import type { Locale } from "@/content/immersive-copy";
import type {
  ArchiveRecord,
  LostMemoriesCopy,
  RealmArchiveRecord,
} from "@/components/experience/lost-memories/lost-memories-types";

const assets = {
  hanamori: "/09-lore-archives/letters/l01-hanamori-letter.png",
  hinokagura: "/09-lore-archives/letters/l02-hinokagura-letter.png",
  amahara: "/09-lore-archives/letters/l03-amahara-letter.png",
  photographs: "/09-lore-archives/photographs/l04-spirit-photographs.png",
  relics: "/09-lore-archives/relics/l05-memory-relics.png",
  realms: "/09-lore-archives/records/l06-nine-realms-archive-map.png",
  lunar: "/09-lore-archives/records/l07-lunar-observation-diagram.png",
  black: "/09-lore-archives/records/l08-black-archive-document.png",
  fragments: "/09-lore-archives/fx/l09-memory-fragments-overlay.png",
  akari: "/09-lore-archives/records/l10-akari-memory-record.png",
  table: "/09-lore-archives/backgrounds/l11-archive-table-background.png",
  transition: "/09-lore-archives/fx/l12-forget-remember-transition.png",
} as const;

const photoCrops = [
  { id: "photo-family", position: "18% 24%", clip: "inset(0 0 0 0)" },
  { id: "photo-child", position: "50% 22%", clip: "inset(0 0 0 0)" },
  { id: "photo-priests", position: "82% 25%", clip: "inset(0 0 0 0)" },
  { id: "photo-village", position: "27% 78%", clip: "inset(0 0 0 0)" },
  { id: "photo-absence", position: "73% 76%", clip: "inset(0 0 0 0)" },
] as const;

const relicHotspots = [
  { id: "relic-bell", x: 4, y: 14, width: 18, height: 68 },
  { id: "relic-comb", x: 23, y: 12, width: 18, height: 70 },
  { id: "relic-mask", x: 41, y: 8, width: 20, height: 76 },
  { id: "relic-amulet", x: 61, y: 11, width: 18, height: 71 },
  { id: "relic-key", x: 80, y: 13, width: 16, height: 69 },
] as const;

function createPtRecords(): ArchiveRecord[] {
  return [
    {
      id: "letter-hanamori",
      group: "letters",
      kind: "letter",
      code: "MEMORY / HNM-014",
      title: "Carta de Hanamori",
      status: "FRAGMENTED",
      asset: assets.hanamori,
      story: [
        "A árvore floresceu novamente esta manhã.",
        "Sua mãe disse que isso significa que você encontrará o caminho de volta.",
        "Eu não tive coragem de dizer a ela que já não consigo lembrar do seu rosto.",
      ],
      annotation: "Assinatura parcialmente apagada.",
      decay: true,
    },
    {
      id: "letter-hinokagura",
      group: "letters",
      kind: "letter",
      code: "MEMORY / HNK-032",
      title: "Carta de Hinokagura",
      status: "UNSTABLE",
      asset: assets.hinokagura,
      story: [
        "Hoje queimamos o templo pela terceira vez.",
        "Amanhã ele estará de pé novamente.",
        "Não sei mais se isso é um milagre ou uma punição.",
      ],
    },
    {
      id: "letter-amahara",
      group: "letters",
      kind: "letter",
      code: "MEMORY / AMH-008",
      title: "Carta de Amahara",
      status: "PRESERVED",
      asset: assets.amahara,
      story: [
        "Os sinos tocaram esta noite.",
        "Nenhum de nós lembra quem deveria ouvi-los.",
      ],
    },
    ...photoCrops.map<ArchiveRecord>((crop, index) => {
      const labels = [
        "Família diante do templo",
        "Criança com amuleto",
        "Sacerdotes diante da Lua",
        "Vila antes do Eclipse",
        "A pessoa ausente",
      ];
      const stories = [
        "A placa ainda retém quatro presenças, embora um dos nomes tenha desaparecido do verso.",
        "O amuleto é nítido. O rosto de quem o segura se dissolve a cada nova leitura.",
        "A prata lunar registrou os sacerdotes; o arquivo perdeu o nome do rito.",
        "As casas permanecem na imagem. Nenhum mapa atual reconhece o caminho até elas.",
        "A emulsão preservou o contorno de alguém que nenhuma testemunha consegue nomear.",
      ];
      return {
        id: crop.id,
        group: "photographs",
        kind: "photograph",
        code: `SPIRIT PLATE / 0${index + 1}`,
        title: labels[index],
        status: index === 4 ? "CORRUPTED" : index === 1 ? "UNSTABLE" : "FRAGMENTED",
        asset: assets.photographs,
        story: [stories[index]],
        crop: { objectPosition: crop.position, clipPath: crop.clip },
      };
    }),
    {
      id: "relic-bell",
      group: "relics",
      kind: "relic",
      code: "RELIC / BELL-017",
      title: "Sino ritualístico",
      status: "PRESERVED",
      asset: assets.relics,
      story: ["Seu som reproduz uma lembrança específica. Ninguém sabe de quem ela era."],
      annotation: "ECO",
      hotspot: { ...relicHotspots[0], label: "Inspecionar sino ritualístico" },
    },
    {
      id: "relic-comb",
      group: "relics",
      kind: "relic",
      code: "RELIC / COMB-004",
      title: "Pente sem nome",
      status: "FRAGMENTED",
      asset: assets.relics,
      story: ["Pertenceu a alguém cujo nome foi apagado antes que o objeto deixasse de lembrá-lo."],
      annotation: "NOME",
      hotspot: { ...relicHotspots[1], label: "Inspecionar pente sem nome" },
    },
    {
      id: "relic-mask",
      group: "relics",
      kind: "relic",
      code: "RELIC / MSK-029",
      title: "Máscara quebrada",
      status: "UNSTABLE",
      asset: assets.relics,
      story: ["A fratura ainda reage à energia lunar como se aguardasse um rosto que não existe mais."],
      annotation: "PULSO",
      hotspot: { ...relicHotspots[2], label: "Inspecionar máscara quebrada" },
    },
    {
      id: "relic-amulet",
      group: "relics",
      kind: "relic",
      code: "RELIC / AMT-011",
      title: "Amuleto cartográfico",
      status: "FRAGMENTED",
      asset: assets.relics,
      story: ["Contém coordenadas precisas para um lugar que deixou de existir."],
      annotation: "NORTE",
      hotspot: { ...relicHotspots[3], label: "Inspecionar amuleto cartográfico" },
    },
    {
      id: "relic-key",
      group: "relics",
      kind: "relic",
      code: "RELIC / KEY-000",
      title: "Chave sem fechadura",
      status: "SEALED",
      asset: assets.relics,
      story: ["Nenhuma porta conhecida aceita sua forma. Ainda assim, o metal aquece diante da Lua-Mãe."],
      annotation: "PORTA",
      hotspot: { ...relicHotspots[4], label: "Inspecionar chave sem fechadura" },
    },
    {
      id: "lunar-441",
      group: "lunar",
      kind: "lunar",
      code: "LUNAR OBSERVATION 441",
      title: "Retenção da Lua-Mãe",
      status: "UNSTABLE",
      asset: assets.lunar,
      story: [
        "A Lua-Mãe não apresenta sinais de deterioração física.",
        "O problema parece estar relacionado à retenção.",
        "████████████████████",
        "Se a memória central falhar, os reinos...",
      ],
      decay: true,
    },
    {
      id: "black-00",
      group: "lunar",
      kind: "black",
      code: "ARCHIVE / BLACK-00",
      title: "Registro proibido",
      status: "CORRUPTED",
      asset: assets.black,
      story: ["O esquecimento não começou com o Eclipse.", "Remaining data corrupted."],
    },
  ];
}

function createEnRecords(): ArchiveRecord[] {
  const pt = createPtRecords();
  const copy: Record<string, { title: string; story: string[]; annotation?: string }> = {
    "letter-hanamori": {
      title: "Letter from Hanamori",
      story: [
        "The tree bloomed again this morning.",
        "Your mother said it means you will find your way back.",
        "I did not have the courage to tell her I can no longer remember your face.",
      ],
      annotation: "Signature partially erased.",
    },
    "letter-hinokagura": {
      title: "Letter from Hinokagura",
      story: [
        "Today we burned the temple for the third time.",
        "Tomorrow it will be standing again.",
        "I no longer know whether this is a miracle or a punishment.",
      ],
    },
    "letter-amahara": {
      title: "Letter from Amahara",
      story: ["The bells rang tonight.", "None of us remember who was supposed to hear them."],
    },
    "photo-family": {
      title: "Family before the temple",
      story: ["The plate still retains four presences, although one name has vanished from its reverse."],
    },
    "photo-child": {
      title: "Child with an amulet",
      story: ["The amulet remains sharp. The face holding it dissolves with every new reading."],
    },
    "photo-priests": {
      title: "Priests before the Moon",
      story: ["Lunar silver recorded the priests; the archive lost the name of the rite."],
    },
    "photo-village": {
      title: "Village before the Eclipse",
      story: ["The houses remain in the image. No current map recognizes the road that leads to them."],
    },
    "photo-absence": {
      title: "The absent person",
      story: ["The emulsion preserved the outline of someone no witness can name."],
    },
    "relic-bell": {
      title: "Ritual bell",
      story: ["Its sound reproduces one specific memory. No one knows whose it was."],
      annotation: "ECHO",
    },
    "relic-comb": {
      title: "Nameless comb",
      story: ["It belonged to someone whose name was erased before the object stopped remembering it."],
      annotation: "NAME",
    },
    "relic-mask": {
      title: "Broken mask",
      story: ["The fracture still reacts to lunar energy as if waiting for a face that no longer exists."],
      annotation: "PULSE",
    },
    "relic-amulet": {
      title: "Cartographic amulet",
      story: ["It contains precise coordinates for a place that no longer exists."],
      annotation: "NORTH",
    },
    "relic-key": {
      title: "Key without a lock",
      story: ["No known door accepts its shape. The metal still warms before the Mother Moon."],
      annotation: "DOOR",
    },
    "lunar-441": {
      title: "Mother Moon retention",
      story: [
        "The Mother Moon shows no sign of physical deterioration.",
        "The problem appears to be related to retention.",
        "████████████████████",
        "If the central memory fails, the realms...",
      ],
    },
    "black-00": {
      title: "Forbidden record",
      story: ["Forgetting did not begin with the Eclipse.", "Remaining data corrupted."],
    },
  };

  return pt.map((record) => ({
    ...record,
    title: copy[record.id]?.title ?? record.title,
    story: copy[record.id]?.story ?? record.story,
    annotation: copy[record.id]?.annotation ?? record.annotation,
    hotspot: record.hotspot
      ? {
          ...record.hotspot,
          label: `Inspect ${copy[record.id]?.title ?? record.title}`,
        }
      : undefined,
  }));
}

function createPtRealmRecords(): RealmArchiveRecord[] {
  const entries = [
    ["hanamori", "REALM RECORD 01", "HANAMORI", "FRAGMENTED", "Origin", "Uma casa desapareceu. A família ainda coloca quatro pratos na mesa."],
    ["kurogane", "REALM RECORD 02", "KUROGANE", "UNSTABLE", "Labor", "As máquinas continuam registrando funcionários que já não existem."],
    ["mizukyo", "REALM RECORD 03", "MIZUKYO", "UNSTABLE", "Reflection", "Um reflexo apareceu três dias antes da pessoa que deveria produzi-lo."],
    ["amahara", "REALM RECORD 04", "AMAHARA", "FRAGMENTED", "Faith", "Um monge esqueceu o nome do deus para quem rezava há sessenta anos."],
    ["hinokagura", "REALM RECORD 05", "HINOKAGURA", "CORRUPTED", "Cycle", "As cinzas começaram a falar com vozes que ninguém reconhece."],
    ["yumegakure", "REALM RECORD 06", "YUMEGAKURE", "UNSTABLE", "Dream", "Alguns habitantes recusam-se a acordar."],
    ["yoru-no-mori", "REALM RECORD 07", "YORU NO MORI", "FRAGMENTED", "Fear", "A floresta começou a lembrar medos que seus visitantes já esqueceram."],
    ["gekkai", "REALM RECORD 08", "GEKKAI", "CORRUPTED", "Space", "Dois lugares tentaram existir no mesmo espaço."],
    ["tsuki-no-miya", "REALM RECORD 09", "TSUKI NO MIYA", "SEALED", "Unknown", "RECORD SEALED"],
  ] as const;

  return entries.map(([id, code, realm, status, memoryType, fragment], index) => ({
    id: `realm-${id}`,
    group: "realms",
    kind: "realm",
    code,
    title: realm,
    realm,
    status,
    memoryType,
    lastVerified: "Unknown",
    asset: assets.realms,
    story: [fragment],
    annotation: index === 8 ? "RECORD SEALED" : undefined,
    sealed: index === 8,
  }));
}

function createEnRealmRecords(): RealmArchiveRecord[] {
  const pt = createPtRealmRecords();
  const fragments: Record<string, string> = {
    "realm-hanamori": "A house disappeared. The family still sets four plates at the table.",
    "realm-kurogane": "The machines keep registering employees who no longer exist.",
    "realm-mizukyo": "A reflection appeared three days before the person meant to cast it.",
    "realm-amahara": "A monk forgot the name of the god he had prayed to for sixty years.",
    "realm-hinokagura": "The ashes began speaking with voices no one recognizes.",
    "realm-yumegakure": "Some inhabitants refuse to wake.",
    "realm-yoru-no-mori": "The forest began remembering fears its visitors had already forgotten.",
    "realm-gekkai": "Two places tried to exist in the same space.",
    "realm-tsuki-no-miya": "RECORD SEALED",
  };
  return pt.map((record) => ({ ...record, story: [fragments[record.id] ?? record.story[0]] }));
}

const sharedAssets = {
  table: assets.table,
  fragments: assets.fragments,
  realms: assets.realms,
  relics: assets.relics,
  akari: assets.akari,
  transition: assets.transition,
};

export const lostMemoriesCopy = {
  pt: {
    eyebrow: "LOST MEMORIES / ARCHIVE 09",
    headline: "Algumas histórias só existem porque alguém se recusou a esquecê-las.",
    support: [
      "Nem toda memória chega inteira até o presente.",
      "Algumas sobrevivem em papel. Outras em objetos. Outras apenas em lugares que já não existem.",
      "Os Arquivos de Tsukihara preservam aquilo que o Eclipse ainda não conseguiu apagar.",
    ],
    index: [
      { id: "letters", number: "01", label: "LETTERS" },
      { id: "photographs", number: "02", label: "PHOTOGRAPHS" },
      { id: "relics", number: "03", label: "RELICS" },
      { id: "realms", number: "04", label: "REALMS" },
      { id: "lunar", number: "05", label: "LUNAR RECORDS" },
    ],
    groupHeadlines: {
      letters: "Palavras permanecem mais tempo que algumas pessoas.",
      photographs: "Algumas imagens continuam lembrando mesmo quando ninguém mais consegue.",
      relics: "Nem toda memória precisa de uma mente.",
      realms: "Fragmentos dos Nove Reinos.",
      lunar: "Antes do Eclipse, alguém já sabia que isso poderia acontecer.",
    },
    records: createPtRecords(),
    realmRecords: createPtRealmRecords(),
    assets: sharedAssets,
    transition: {
      first: "Um mundo não desaparece quando suas cidades caem.",
      second: "Desaparece quando ninguém consegue mais contar que elas existiram.",
    },
    akariRecord: {
      code: "MEMORY RECORD / AKR-001",
      ownerLabel: "OWNER",
      owner: "AKARI",
      statusLabel: "STATUS",
      status: "UNKNOWN",
    },
    signature: "REMEMBER WHAT REMAINS.",
    polarity: { forget: "ESQUECER", remember: "LEMBRAR" },
    closeLabel: "Devolver ao arquivo",
    inspectLabel: "Inspecionar registro",
  },
  en: {
    eyebrow: "LOST MEMORIES / ARCHIVE 09",
    headline: "Some stories exist only because someone refused to forget them.",
    support: [
      "Not every memory reaches the present intact.",
      "Some survive on paper. Others in objects. Others only in places that no longer exist.",
      "The Archives of Tsukihara preserve what the Eclipse has not yet managed to erase.",
    ],
    index: [
      { id: "letters", number: "01", label: "LETTERS" },
      { id: "photographs", number: "02", label: "PHOTOGRAPHS" },
      { id: "relics", number: "03", label: "RELICS" },
      { id: "realms", number: "04", label: "REALMS" },
      { id: "lunar", number: "05", label: "LUNAR RECORDS" },
    ],
    groupHeadlines: {
      letters: "Words remain longer than some people do.",
      photographs: "Some images keep remembering even when no one else can.",
      relics: "Not every memory needs a mind.",
      realms: "Fragments of the Nine Realms.",
      lunar: "Before the Eclipse, someone already knew this could happen.",
    },
    records: createEnRecords(),
    realmRecords: createEnRealmRecords(),
    assets: sharedAssets,
    transition: {
      first: "A world does not disappear when its cities fall.",
      second: "It disappears when no one can tell that they ever existed.",
    },
    akariRecord: {
      code: "MEMORY RECORD / AKR-001",
      ownerLabel: "OWNER",
      owner: "AKARI",
      statusLabel: "STATUS",
      status: "UNKNOWN",
    },
    signature: "REMEMBER WHAT REMAINS.",
    polarity: { forget: "FORGET", remember: "REMEMBER" },
    closeLabel: "Return to archive",
    inspectLabel: "Inspect record",
  },
} satisfies Record<Locale, LostMemoriesCopy>;
