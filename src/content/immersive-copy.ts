export type Locale = "pt" | "en";

type RealmKey = "hanamori" | "mizukyo" | "kurogane";

export const immersiveCopy = {
  pt: {
    languageLabel: "Idioma",
    enter: {
      overline: "月の原 · ENTRE SOB A LUA",
      line: "Toda jornada começa antes do primeiro golpe.",
      withSound: "Entrar com som",
      silent: "Entrar em silêncio",
    },
    nav: {
      threshold: "Limiar",
      realms: "Reinos",
      akari: "Akari",
      lore: "Ecos",
      eclipse: "Eclipse",
      menu: "Menu",
      close: "Fechar",
      soundOn: "Som ligado",
      soundOff: "Som mutado",
    },
    hero: {
      eyebrow: "CAPÍTULO 00 — SOB O ECLIPSE",
      title: "Quando a lua se lembra, a lâmina desperta.",
      body: "Atravesse santuários suspensos, vales cobertos por névoa e ruínas de ferro enquanto Akari segue o rastro de um eclipse que parece conhecer seu nome.",
      cue: "Desça para atravessar",
      vertical: "月蝕ノ道",
    },
    threshold: {
      label: "01 — O LIMIAR",
      title: "Há lugares que o mundo esqueceu. A lua não.",
      body: "O caminho começa diante de um santuário ainda aceso. As lanternas ardem, as pétalas continuam caindo — mas alguma coisa mudou no silêncio. Cada passo adiante aproxima Akari de uma memória que não deveria ter sobrevivido.",
      cta: "Atravesse o portão",
      stats: [
        ["03", "reinos conhecidos"],
        ["01", "lua em transformação"],
        ["05", "ecos da antiga história"],
        ["∞", "promessas ainda lembradas"],
      ],
    },
    realmsIntro: {
      label: "02 — OS REINOS",
      title: "A mesma lua toca cada reino de uma forma diferente.",
      body: "Em Tsukihara, a paisagem também conta a história. Água, flores, metal e ruína carregam marcas do que aconteceu antes da chegada de Akari.",
    },
    realms: {
      hanamori: {
        label: "Santuário das flores",
        copy: "Hanamori paira acima do vale entre pontes, madeira vermelha e sakuras levadas pelo vento. É belo o suficiente para parecer seguro — até que o silêncio responde.",
      },
      mizukyo: {
        label: "Espelho das águas",
        copy: "Em Mizukyo, cachoeiras cortam a montanha e a névoa apaga a distância. O caminho sobe, desaparece e retorna refletido onde não deveria existir passagem alguma.",
      },
      kurogane: {
        label: "Ruínas de ferro",
        copy: "Kurogane conserva cicatrizes que nem a chuva apagou. Pedra queimada, metal partido e estruturas esquecidas contam o preço de tentar dominar aquilo que veio da lua.",
      },
    } satisfies Record<RealmKey, { label: string; copy: string }>,
    akari: {
      eyebrow: "03 — AKARI NO REI · 朱莉",
      title: "Ela entra carregando uma espada. O eclipse exige mais do que aço.",
      body: "Akari atravessa Tsukihara entre dever, memória e transformação. Cada encontro aproxima sua lâmina de algo que não pode ser vencido apenas com força — e aproxima Akari de uma forma de si mesma que ainda não compreende.",
      specs: ["Arma — Lâmina", "Marca — Vermelhão / Sakura", "Estado — Akari no Rei"],
    },
    lore: {
      label: "04 — ECOS",
      title: "Cinco ecos. Uma história que a lua se recusa a esquecer.",
      intro: "Não são capítulos explicados. São rastros deixados para quem continuar caminhando.",
      items: [
        [
          "01",
          "Promessas lunares",
          "月誓",
          "Promessas feitas sob a lua não desaparecem quando são quebradas. Algumas esperam.",
        ],
        [
          "02",
          "Santuários sagrados",
          "神殿",
          "Pedra, madeira e fogo guardam mais do que devoção. Certos lugares aprendem a lembrar.",
        ],
        [
          "03",
          "Espíritos guardiões",
          "守護",
          "Alguns espíritos escolhem quem seguir muito antes de serem compreendidos.",
        ],
        [
          "04",
          "Ferro esquecido",
          "黒鉄",
          "Onde o metal queimou, alguém tentou transformar o eclipse em poder.",
        ],
        [
          "05",
          "O eclipse",
          "月蝕",
          "Quando a lua é engolida pela sombra, o passado deixa de se comportar como passado.",
        ],
      ],
    },
    eclipse: {
      label: "05 — AFTERLIGHT · 月蝕",
      title: "O eclipse não encerra a noite. Ele revela o que sempre esteve nela.",
      body: "A jornada de Akari ainda está sendo forjada. Novos lugares, personagens, combates e fragmentos deste mundo serão revelados conforme Tsukihara desperta.",
      return: "Voltar ao primeiro luar",
      development: "Em desenvolvimento",
    },
  },
  en: {
    languageLabel: "Language",
    enter: {
      overline: "月の原 · ENTER BENEATH THE MOON",
      line: "Every journey begins before the first strike.",
      withSound: "Enter with sound",
      silent: "Enter in silence",
    },
    nav: {
      threshold: "Threshold",
      realms: "Realms",
      akari: "Akari",
      lore: "Echoes",
      eclipse: "Eclipse",
      menu: "Menu",
      close: "Close",
      soundOn: "Sound on",
      soundOff: "Muted",
    },
    hero: {
      eyebrow: "CHAPTER 00 — BENEATH THE ECLIPSE",
      title: "When the moon remembers, the blade awakens.",
      body: "Cross suspended sanctuaries, mist-covered valleys and iron ruins as Akari follows the trace of an eclipse that seems to know her name.",
      cue: "Descend to cross over",
      vertical: "月蝕ノ道",
    },
    threshold: {
      label: "01 — THE THRESHOLD",
      title: "There are places the world forgot. The moon did not.",
      body: "The path begins before a sanctuary that is still lit. Lanterns burn, petals keep falling — yet something has changed in the silence. Every step draws Akari closer to a memory that should not have survived.",
      cta: "Cross the gate",
      stats: [
        ["03", "known realms"],
        ["01", "moon in transformation"],
        ["05", "echoes of an older story"],
        ["∞", "vows still remembered"],
      ],
    },
    realmsIntro: {
      label: "02 — THE REALMS",
      title: "The same moon touches every realm differently.",
      body: "In Tsukihara, the landscape tells part of the story. Water, blossoms, iron and ruin all carry marks of what came before Akari.",
    },
    realms: {
      hanamori: {
        label: "Temple of blossoms",
        copy: "Hanamori hangs above the valley between bridges, vermilion timber and sakura carried by the wind. Beautiful enough to feel safe — until the silence answers.",
      },
      mizukyo: {
        label: "Mirror of water",
        copy: "In Mizukyo, waterfalls cut through the mountain and mist erases distance. The path climbs, disappears, and returns reflected where no passage should exist.",
      },
      kurogane: {
        label: "Ruins of iron",
        copy: "Kurogane keeps scars even rain could not erase. Burned stone, fractured metal and abandoned structures tell the price of trying to master what came from the moon.",
      },
    } satisfies Record<RealmKey, { label: string; copy: string }>,
    akari: {
      eyebrow: "03 — AKARI NO REI · 朱莉",
      title: "She enters carrying a sword. The eclipse demands more than steel.",
      body: "Akari crosses Tsukihara between duty, memory and transformation. Every encounter brings her blade closer to something strength alone cannot defeat — and brings Akari closer to a form of herself she does not yet understand.",
      specs: ["Weapon — Blade", "Motif — Vermilion / Sakura", "State — Akari no Rei"],
    },
    lore: {
      label: "04 — ECHOES",
      title: "Five echoes. One story the moon refuses to forget.",
      intro: "These are not chapters explained. They are traces left for those who keep walking.",
      items: [
        [
          "01",
          "Moonbound vows",
          "月誓",
          "Vows spoken beneath the moon do not disappear when broken. Some of them wait.",
        ],
        [
          "02",
          "Sacred temples",
          "神殿",
          "Stone, timber and flame preserve more than devotion. Certain places learn to remember.",
        ],
        [
          "03",
          "Guardian spirits",
          "守護",
          "Some spirits choose who they will follow long before they are understood.",
        ],
        [
          "04",
          "Forgotten iron",
          "黒鉄",
          "Where metal burned, someone tried to turn the eclipse into power.",
        ],
        [
          "05",
          "The eclipse",
          "月蝕",
          "When the moon is swallowed by shadow, the past stops behaving like the past.",
        ],
      ],
    },
    eclipse: {
      label: "05 — AFTERLIGHT · 月蝕",
      title: "The eclipse does not end the night. It reveals what was always inside it.",
      body: "Akari's journey is still being forged. New places, characters, battles and fragments of this world will be revealed as Tsukihara awakens.",
      return: "Return to the first moonlight",
      development: "In development",
    },
  },
} as const;
