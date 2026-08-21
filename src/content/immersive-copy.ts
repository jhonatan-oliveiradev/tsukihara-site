export type Locale = "pt" | "en";

type RealmKey = "hanamori" | "mizukyo" | "kurogane";

export const immersiveCopy = {
  pt: {
    languageLabel: "Idioma",
    enter: {
      overline: "月の原 · ENTRE SOB A LUA",
      line: "O caminho até o eclipse começa antes do primeiro golpe.",
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
    navJp: {
      threshold: "境界",
      realms: "九国",
      akari: "朱莉",
      lore: "残響",
      eclipse: "月蝕",
    },
    hero: {
      eyebrow: "CAPÍTULO 00 — SOB O ECLIPSE",
      title: "Quando a lua se lembra, a lâmina desperta.",
      titleJp: "月が記憶すると、刃が目覚める。",
      body: "Em Tsukihara, Akari atravessa santuários, vales e ruínas em busca da origem de um eclipse que altera o mundo ao seu redor. Ao lado de Haku e Mochi, cada reino a aproxima de inimigos, memórias e escolhas que transformarão sua jornada.",
      cue: "Desça para atravessar",
      vertical: "月蝕ノ道",
    },
    threshold: {
      label: "01 — O LIMIAR",
      title: "O primeiro portão não leva apenas a outro lugar.",
      titleJp: "最初の門は、場所だけを変えるのではない。",
      body: "A jornada começa onde o familiar deixa de ser seguro. Lanternas ainda queimam, pétalas continuam caindo e o templo permanece de pé — mas o eclipse já começou a mudar as regras. A partir daqui, explorar significa ler o cenário, enfrentar o que desperta nele e descobrir por que a lua parece responder à presença de Akari.",
      cta: "Atravesse o portão",
      stats: [
        ["03", "reinos revelados"],
        ["01", "eclipse em avanço"],
        ["02", "companheiros ao seu lado"],
        ["∞", "segredos além do caminho"],
      ],
    },
    realmsIntro: {
      label: "02 — OS REINOS",
      title: "Cada reino transforma a travessia — e a forma de sobreviver a ela.",
      titleJp: "国が変われば、旅も戦い方も変わる。",
      body: "Tsukihara é feita de contrastes: santuários serenos, quedas d’água verticais e ruínas marcadas por ferro e fogo. Explorar cada região significa aprender sua atmosfera, seus perigos e as marcas deixadas pela mesma lua de sangue.",
    },
    realms: {
      hanamori: {
        label: "Santuário das flores",
        copy: "Hanamori recebe Akari com madeira vermelha, pontes suspensas e sakuras levadas pelo vento. A beleza do santuário esconde caminhos, presenças e sinais de que o eclipse chegou antes dela.",
      },
      mizukyo: {
        label: "Espelho das águas",
        copy: "Mizukyo transforma deslocamento em descoberta. Cachoeiras, névoa e grandes desníveis escondem rotas e ameaças, enquanto reflexos fazem o caminho parecer diferente a cada novo ponto de vista.",
      },
      kurogane: {
        label: "Ruínas de ferro",
        copy: "Kurogane é o lado mais ferido de Tsukihara. Pedra queimada, metal partido e estruturas abandonadas contam uma história de conflito — e colocam Akari diante das consequências de tentar controlar o poder do eclipse.",
      },
    } satisfies Record<RealmKey, { label: string; copy: string }>,
    akari: {
      eyebrow: "03 — AKARI NO REI · 朱莉",
      title: "Akari luta para atravessar o eclipse sem se perder dentro dele.",
      titleJp: "朱莉は月蝕を越えるために戦う。自分を失わずに。",
      body: "Akari carrega uma lâmina, mas sua jornada não é apenas sobre vencer combates. Entre confrontos, exploração e encontros com aquilo que o eclipse desperta, ela precisa compreender a própria transformação. Haku e Mochi seguem ao seu lado enquanto a fronteira entre força, memória e maldição se torna cada vez menor.",
      specs: ["Arma — Lâmina", "Companheiros — Haku / Mochi", "Estado — Akari no Rei"],
    },
    lore: {
      label: "04 — ECOS",
      title: "O mundo não entrega respostas. Ele deixa rastros para quem decide procurá-las.",
      titleJp: "世界は答えを与えない。探す者に痕跡を残す。",
      intro:
        "Os ecos de Tsukihara aparecem em lugares, símbolos, espíritos e ruínas. Juntos, eles revelam por que o eclipse retornou — e por que Akari está ligada a ele.",
      items: [
        [
          "01",
          "Promessas lunares",
          "月誓",
          "Votos feitos sob a lua atravessaram gerações. Alguns protegem. Outros mantêm antigas dívidas vivas.",
        ],
        [
          "02",
          "Santuários sagrados",
          "神殿",
          "Templos e portões marcam mais do que rotas. Eles preservam histórias, rituais e passagens que o mundo quase esqueceu.",
        ],
        [
          "03",
          "Espíritos guardiões",
          "守護",
          "Haku é a prova de que nem toda presença sobrenatural é inimiga. Algumas escolhem caminhar ao seu lado.",
        ],
        [
          "04",
          "Ferro esquecido",
          "黒鉄",
          "Nas ruínas de Kurogane, o metal registra uma tentativa antiga de transformar o poder lunar em arma.",
        ],
        [
          "05",
          "O eclipse",
          "月蝕",
          "A lua de sangue não é apenas um presságio no céu. Ela altera lugares, desperta memórias e empurra Akari em direção à própria transformação.",
        ],
      ],
    },
    eclipse: {
      label: "05 — AFTERLIGHT · 月蝕",
      title: "A lua de sangue já começou a mudar Tsukihara. Agora Akari precisa descobrir por quê.",
      titleJp: "血の月はすでに月の原を変え始めた。",
      body: "Tsukihara é uma jornada de ação, exploração e descoberta construída ao redor de Akari, Haku, Mochi e dos mistérios que ligam os nove reinos ao eclipse. Este é apenas o primeiro vislumbre do caminho.",
      return: "Voltar ao primeiro luar",
      development: "Em desenvolvimento",
    },
  },
  en: {
    languageLabel: "Language",
    enter: {
      overline: "月の原 · ENTER BENEATH THE MOON",
      line: "The path to the eclipse begins before the first strike.",
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
    navJp: {
      threshold: "境界",
      realms: "九国",
      akari: "朱莉",
      lore: "残響",
      eclipse: "月蝕",
    },
    hero: {
      eyebrow: "CHAPTER 00 — BENEATH THE ECLIPSE",
      title: "When the moon remembers, the blade awakens.",
      titleJp: "月が記憶すると、刃が目覚める。",
      body: "In Tsukihara, Akari crosses sanctuaries, valleys and ruins in search of the origin of an eclipse reshaping the world around her. With Haku and Mochi beside her, every realm brings her closer to enemies, memories and choices that will transform the journey ahead.",
      cue: "Descend to cross over",
      vertical: "月蝕ノ道",
    },
    threshold: {
      label: "01 — THE THRESHOLD",
      title: "The first gate does more than take you somewhere else.",
      titleJp: "最初の門は、場所だけを変えるのではない。",
      body: "The journey begins where the familiar stops feeling safe. Lanterns still burn, petals still fall and the temple still stands — but the eclipse has already begun to change the rules. From here on, exploration means reading the world, facing what awakens within it and discovering why the moon seems to answer Akari's presence.",
      cta: "Cross the gate",
      stats: [
        ["03", "realms revealed"],
        ["01", "advancing eclipse"],
        ["02", "companions beside you"],
        ["∞", "secrets beyond the path"],
      ],
    },
    realmsIntro: {
      label: "02 — THE REALMS",
      title: "Every realm changes the journey — and how you survive it.",
      titleJp: "国が変われば、旅も戦い方も変わる。",
      body: "Tsukihara is built on contrasts: tranquil sanctuaries, towering waterfalls and ruins scarred by iron and fire. Exploring each region means learning its atmosphere, its dangers and the marks left by the same blood moon.",
    },
    realms: {
      hanamori: {
        label: "Temple of blossoms",
        copy: "Hanamori greets Akari with vermilion timber, suspended bridges and sakura carried by the wind. The sanctuary's beauty hides paths, presences and signs that the eclipse arrived before she did.",
      },
      mizukyo: {
        label: "Mirror of water",
        copy: "Mizukyo turns traversal into discovery. Waterfalls, mist and steep vertical spaces conceal routes and threats, while reflections make the path feel different from every new vantage point.",
      },
      kurogane: {
        label: "Ruins of iron",
        copy: "Kurogane is Tsukihara at its most wounded. Burned stone, fractured metal and abandoned structures tell a story of conflict — and confront Akari with the cost of trying to control the eclipse's power.",
      },
    } satisfies Record<RealmKey, { label: string; copy: string }>,
    akari: {
      eyebrow: "03 — AKARI NO REI · 朱莉",
      title: "Akari fights to cross the eclipse without losing herself inside it.",
      titleJp: "朱莉は月蝕を越えるために戦う。自分を失わずに。",
      body: "Akari carries a blade, but her journey is not only about winning fights. Between combat, exploration and encounters with what the eclipse awakens, she must understand her own transformation. Haku and Mochi remain at her side as the boundary between strength, memory and curse grows thinner.",
      specs: ["Weapon — Blade", "Companions — Haku / Mochi", "State — Akari no Rei"],
    },
    lore: {
      label: "04 — ECHOES",
      title: "The world does not hand you answers. It leaves traces for those willing to search.",
      titleJp: "世界は答えを与えない。探す者に痕跡を残す。",
      intro:
        "Tsukihara's echoes surface through places, symbols, spirits and ruins. Together they reveal why the eclipse returned — and why Akari is bound to it.",
      items: [
        [
          "01",
          "Moonbound vows",
          "月誓",
          "Vows spoken beneath the moon have survived generations. Some protect. Others keep old debts alive.",
        ],
        [
          "02",
          "Sacred temples",
          "神殿",
          "Temples and gates mark more than routes. They preserve histories, rituals and passages the world nearly forgot.",
        ],
        [
          "03",
          "Guardian spirits",
          "守護",
          "Haku is proof that not every supernatural presence is an enemy. Some choose to walk beside you.",
        ],
        [
          "04",
          "Forgotten iron",
          "黒鉄",
          "Within Kurogane's ruins, metal records an old attempt to turn lunar power into a weapon.",
        ],
        [
          "05",
          "The eclipse",
          "月蝕",
          "The blood moon is more than an omen in the sky. It changes places, awakens memories and pushes Akari toward her own transformation.",
        ],
      ],
    },
    eclipse: {
      label: "05 — AFTERLIGHT · 月蝕",
      title: "The blood moon has already begun to change Tsukihara. Now Akari must discover why.",
      titleJp: "血の月はすでに月の原を変え始めた。",
      body: "Tsukihara is a journey of action, exploration and discovery built around Akari, Haku, Mochi and the mysteries connecting the nine realms to the eclipse. This is only the first glimpse of the path ahead.",
      return: "Return to the first moonlight",
      development: "In development",
    },
  },
} as const;
