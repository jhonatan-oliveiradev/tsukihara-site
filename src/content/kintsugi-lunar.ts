export type KintsugiAssetCode =
  | "K01"
  | "K02"
  | "K03"
  | "K04"
  | "K05"
  | "K06"
  | "K07"
  | "K08"
  | "K09"
  | "K10"
  | "K11"
  | "K12"
  | "K13"
  | "K14"
  | "K15";

export type KintsugiAssetDefinition = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export const kintsugiAssets: Record<KintsugiAssetCode, KintsugiAssetDefinition> = {
  K01: {
    src: "/akari-details/akari_full_body.png",
    alt: "Akari em seu estado padrão",
    objectPosition: "50% 50%",
  },
  K02: {
    src: "/akari-details/akari_exaltada.png",
    alt: "Akari em seu estado Kintsugi Lunar",
    objectPosition: "50% 50%",
  },
  K03: {
    src: "/akari-details/detail_02.png",
    alt: "Máscara Kitsune de Akari",
  },
  K04: {
    src: "/akari-details/detail_03.png",
    alt: "Katana de Akari",
  },
  K05: {
    src: "/ruptura-separador.png",
    alt: "Fissuras do Kintsugi Lunar",
  },
  K06: {
    src: "/hero-elements/mist-2-after.png",
    alt: "Energia do Kintsugi Lunar",
  },
  K07: {
    src: "/assets_hq/templo-hanamori_2.png",
    alt: "Templo de Hanamori fragmentado pelo Eclipse",
  },
  K08: {
    src: "/assets_hq/templo-hanamori.png",
    alt: "Templo de Hanamori restaurado",
  },
  K09: {
    src: "/assets_hq/templo-hanamori.png",
    alt: "Akari restaurando uma passagem fragmentada",
  },
  K10: {
    src: "/assets_hq/mizukyo-cachoeiras.png",
    alt: "Uma passagem oculta sendo revelada",
  },
  K11: {
    src: "/assets_hq/kurogane-ruinas.png",
    alt: "Estruturas restauradas permitindo travessia",
  },
  K12: {
    src: "/hero-elements/characters-after.png",
    alt: "Akari em combate sob o Eclipse Carmesim",
  },
  K13: {
    src: "/akari-details/akari_exaltada.png",
    alt: "Akari completamente transformada em Kintsugi Lunar",
    objectPosition: "50% 50%",
  },
  K14: {
    src: "/assets_hq/Blood_Moon.png",
    alt: "Lua Carmesim",
  },
  K15: {
    src: "/secret-pathways-assets/foreground/png/shrine-ruins.webp",
    alt: "Fragmentos de ruínas flutuando ao redor de Akari",
  },
};

export type KintsugiLocale = "pt" | "en";

type Relic = {
  label: string;
  title: string;
  copy: string;
  microcopy: string;
  asset: KintsugiAssetCode;
};

type GameplayPillar = {
  title: string;
  copy: string;
  asset: KintsugiAssetCode;
};

type KintsugiCopy = {
  eyebrow: string;
  opening: {
    title: string;
    paragraphs: string[];
  };
  awakening: {
    lead: string[];
    body: string;
  };
  transformation: {
    first: string;
    second: string;
    completeLabel: string;
    completeTitle: string;
    completeBody: string[];
  };
  relicsEyebrow: string;
  relics: Relic[];
  gameplay: {
    eyebrow: string;
    title: string;
    pillars: GameplayPillar[];
  };
  risk: {
    eyebrow: string;
    title: string;
    body: string;
  };
  climax: {
    lines: string[];
    body: string;
  };
  closing: {
    title: string;
    body: string;
    signature: string;
    tagline: string;
  };
};

export const kintsugiLunarCopy: Record<KintsugiLocale, KintsugiCopy> = {
  pt: {
    eyebrow: "KINTSUGI LUNAR",
    opening: {
      title: "Nem tudo que foi quebrado precisa desaparecer.",
      paragraphs: [
        "O Eclipse Carmesim deixa cicatrizes onde antes existiam memórias.",
        "Templos se partem. Caminhos desaparecem. Histórias deixam de existir.",
        "Mas algumas rupturas ainda podem ser alcançadas. E Akari consegue ouvi-las.",
      ],
    },
    awakening: {
      lead: ["O Kintsugi Lunar não desfaz o dano.", "Ele dá significado ao que permaneceu."],
      body: "Quando Akari entra em contato com uma memória fragmentada, a energia lunar percorre suas fissuras e restabelece aquilo que ainda pode ser salvo. A forma original nunca retorna por completo. O que nasce depois carrega as marcas daquilo que aconteceu.",
    },
    transformation: {
      first: "Uma cicatriz é uma memória que se recusou a desaparecer.",
      second: "O Kintsugi Lunar desperta quando Akari aceita a ruptura em vez de tentar negá-la.",
      completeLabel: "KINTSUGI LUNAR",
      completeTitle: "Aquilo que foi quebrado retorna diferente.",
      completeBody: ["Não mais inteiro.", "Não mais inocente.", "Mas ainda vivo."],
    },
    relicsEyebrow: "ANATOMIA DA RUPTURA",
    relics: [
      {
        label: "RELIC 01",
        title: "Máscara do Limiar",
        copy: "A máscara marca o momento em que Akari atravessa parcialmente a fronteira entre matéria e memória. Ao vesti-la, aquilo que desapareceu do mundo físico se torna visível novamente. Mas permanecer tempo demais entre os dois estados tem consequências.",
        microcopy: "VER O QUE JÁ NÃO EXISTE.",
        asset: "K03",
      },
      {
        label: "RELIC 02",
        title: "Lâmina Lunar",
        copy: "Forjada para conduzir energia espiritual, a katana de Akari reage às fissuras causadas pelo Eclipse. Quando envolvida pelo Kintsugi Lunar, a lâmina pode atingir criaturas, barreiras e fragmentos que existem parcialmente fora da realidade.",
        microcopy: "CORTAR O QUE NÃO DEVERIA EXISTIR.",
        asset: "K04",
      },
      {
        label: "STATE 03",
        title: "Marcas do Kintsugi",
        copy: "As linhas dourado-lunares que atravessam Akari não são sinais de corrupção. Elas revelam pontos onde memória, corpo e energia lunar foram reconstruídos. Quanto maior o poder utilizado, mais visível se torna a ruptura.",
        microcopy: "PODER TAMBÉM DEIXA CICATRIZES.",
        asset: "K05",
      },
    ],
    gameplay: {
      eyebrow: "DO CONCEITO AO GAMEPLAY",
      title: "Restaure. Revele. Atravesse. Lute.",
      pillars: [
        {
          title: "RESTAURE",
          copy: "Reconstrua partes fragmentadas de Tsukihara e recupere caminhos que foram apagados pelo Eclipse.",
          asset: "K09",
        },
        {
          title: "REVELE",
          copy: "Encontre memórias, criaturas e passagens que já não existem completamente no mundo físico.",
          asset: "K10",
        },
        {
          title: "ATRAVESSE",
          copy: "Use estruturas restauradas temporariamente para alcançar regiões impossíveis.",
          asset: "K11",
        },
        {
          title: "LUTE",
          copy: "Ataque inimigos corrompidos pelo Eclipse em múltiplos estados de existência.",
          asset: "K12",
        },
      ],
    },
    risk: {
      eyebrow: "O PREÇO DA MEMÓRIA",
      title: "Toda restauração exige alguma coisa em troca.",
      body: "Quanto mais Akari força o mundo a se lembrar, mais próxima ela fica das próprias rupturas que tenta restaurar. O Kintsugi Lunar concede acesso a lugares, memórias e poderes impossíveis. Mas permanecer nesse estado por tempo demais pode fazer com que Akari comece a perder a própria ligação com o presente.",
    },
    climax: {
      lines: ["O Eclipse apaga.", "Akari restaura."],
      body: "Mas cada memória recuperada deixa uma nova marca.",
    },
    closing: {
      title: "Não existe retorno ao que era antes.",
      body: "Existe apenas aquilo que escolhemos reconstruir.",
      signature: "KINTSUGI LUNAR",
      tagline: "Carry the fracture.",
    },
  },
  en: {
    eyebrow: "LUNAR KINTSUGI",
    opening: {
      title: "Not everything broken needs to disappear.",
      paragraphs: [
        "The Crimson Eclipse leaves scars where memories once existed.",
        "Temples fracture. Paths vanish. Stories cease to exist.",
        "But some ruptures can still be reached. And Akari can hear them.",
      ],
    },
    awakening: {
      lead: ["Lunar Kintsugi does not undo the damage.", "It gives meaning to what remained."],
      body: "When Akari touches a fragmented memory, lunar energy travels through its fractures and restores what can still be saved. The original form never returns completely. What is born afterward carries the marks of what happened.",
    },
    transformation: {
      first: "A scar is a memory that refused to disappear.",
      second: "Lunar Kintsugi awakens when Akari accepts the rupture instead of trying to deny it.",
      completeLabel: "LUNAR KINTSUGI",
      completeTitle: "What was broken returns changed.",
      completeBody: ["No longer whole.", "No longer innocent.", "Still alive."],
    },
    relicsEyebrow: "ANATOMY OF THE RUPTURE",
    relics: [
      {
        label: "RELIC 01",
        title: "Mask of the Threshold",
        copy: "The mask marks the moment Akari partially crosses the boundary between matter and memory. Once worn, what vanished from the physical world becomes visible again. Remaining between both states for too long has consequences.",
        microcopy: "SEE WHAT NO LONGER EXISTS.",
        asset: "K03",
      },
      {
        label: "RELIC 02",
        title: "Lunar Blade",
        copy: "Forged to conduct spiritual energy, Akari's katana reacts to the fractures caused by the Eclipse. Wrapped in Lunar Kintsugi, the blade can strike creatures, barriers and fragments that exist partially outside reality.",
        microcopy: "CUT WHAT SHOULD NOT EXIST.",
        asset: "K04",
      },
      {
        label: "STATE 03",
        title: "Kintsugi Marks",
        copy: "The pale lunar-gold lines crossing Akari are not signs of corruption. They reveal places where memory, body and lunar energy were rebuilt. The more power she uses, the more visible the rupture becomes.",
        microcopy: "POWER LEAVES SCARS TOO.",
        asset: "K05",
      },
    ],
    gameplay: {
      eyebrow: "FROM CONCEPT TO GAMEPLAY",
      title: "Restore. Reveal. Traverse. Fight.",
      pillars: [
        {
          title: "RESTORE",
          copy: "Rebuild fragmented pieces of Tsukihara and recover paths erased by the Eclipse.",
          asset: "K09",
        },
        {
          title: "REVEAL",
          copy: "Find memories, creatures and passages that no longer fully exist in the physical world.",
          asset: "K10",
        },
        {
          title: "TRAVERSE",
          copy: "Use temporarily restored structures to reach otherwise impossible places.",
          asset: "K11",
        },
        {
          title: "FIGHT",
          copy: "Strike enemies corrupted by the Eclipse across multiple states of existence.",
          asset: "K12",
        },
      ],
    },
    risk: {
      eyebrow: "THE PRICE OF MEMORY",
      title: "Every restoration demands something in return.",
      body: "The more Akari forces the world to remember, the closer she moves toward the very ruptures she is trying to restore. Lunar Kintsugi grants access to impossible places, memories and powers. Remaining in that state for too long may begin to sever Akari's own connection to the present.",
    },
    climax: {
      lines: ["The Eclipse erases.", "Akari restores."],
      body: "But every recovered memory leaves a new mark.",
    },
    closing: {
      title: "There is no return to what came before.",
      body: "There is only what we choose to rebuild.",
      signature: "LUNAR KINTSUGI",
      tagline: "Carry the fracture.",
    },
  },
};
