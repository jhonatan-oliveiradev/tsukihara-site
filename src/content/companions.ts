import type { Locale } from "@/content/immersive-copy";

export type CompanionId = "haku" | "mochi";

export type CompanionContent = {
  id: CompanionId;
  label: string;
  jp: string;
  role: string;
  title: string;
  body: string[];
  microcopy: string;
  tags: string[];
  character: string;
  keyVisual: string;
};

export type CompanionsCopy = {
  eyebrow: string;
  introJp: string;
  introTitle: string;
  introBody: string[];
  prompt: string;
  companions: Record<CompanionId, CompanionContent>;
  closingJp: string;
  closingTitle: string;
  closingBody: string[];
  closingEmphasis: string;
};

const assets = {
  group: "/06-companions/group/c03-akari-haku-mochi-group.png",
  haku: "/06-companions/characters/c01-haku-character.png",
  mochi: "/06-companions/characters/c02-mochi-character.png",
  hakuScene: "/06-companions/scenes/c04-haku-traversal-key-visual.png",
  mochiScene: "/06-companions/scenes/c05-mochi-memory-key-visual.png",
  closing: "/06-companions/scenes/c06-akari-haku-hero-flight.png",
} as const;

export const companionAssets = assets;

export const companionsCopy: Record<Locale, CompanionsCopy> = {
  pt: {
    eyebrow: "COMPANIONS",
    introJp: "九つの世界を一人で渡ることはない",
    introTitle: "Você não atravessa nove reinos sozinho.",
    introBody: [
      "Entre memórias quebradas, caminhos impossíveis e reinos à beira do esquecimento, Akari segue acompanhada por duas presenças que redefinem sua jornada.",
      "Haku carrega o impulso dos céus. Mochi enxerga aquilo que o mundo já esqueceu.",
      "Juntos, eles não apenas acompanham Akari. Eles expandem a forma como Tsukihara é explorado, sentido e lembrado.",
    ],
    prompt: "Escolha um vínculo",
    companions: {
      haku: {
        id: "haku",
        label: "HAKU",
        jp: "道の守護者",
        role: "TRAVERSAL",
        title: "Haku — O guardião dos caminhos",
        body: [
          "Haku transforma distância em possibilidade.",
          "Mais do que uma montaria, ele amplia a escala da jornada de Akari — permitindo alcançar regiões suspensas, atravessar abismos e tocar partes de Tsukihara que seriam inalcançáveis a pé.",
          "Quando Haku entra em cena, a travessia deixa de ser apenas deslocamento. Ela se torna liberdade.",
        ],
        microcopy: "TRAVERSE FARTHER. ASCEND HIGHER.",
        tags: ["flight", "mobility", "reach", "altitude"],
        character: assets.haku,
        keyVisual: assets.hakuScene,
      },
      mochi: {
        id: "mochi",
        label: "MOCHI",
        jp: "忘却を見る眼",
        role: "PERCEPTION",
        title: "Mochi — O olhar para o que foi esquecido",
        body: [
          "Mochi é pequeno apenas no tamanho.",
          "Ele percebe fissuras, segredos e ecos de memória que passam despercebidos para quase todos — revelando passagens ocultas, rastros de histórias apagadas e sinais de que nem tudo aquilo que desapareceu deixou realmente de existir.",
          "Mochi traz leveza à jornada, mas também um tipo raro de percepção: a capacidade de enxergar o que ainda insiste em permanecer.",
        ],
        microcopy: "SEE WHAT MEMORY LEFT BEHIND.",
        tags: ["memory", "secrets", "perception", "discovery"],
        character: assets.mochi,
        keyVisual: assets.mochiScene,
      },
    },
    closingJp: "旅路と記憶と勇気は同じ道を進む",
    closingTitle: "Travessia, memória e coragem compartilham o mesmo caminho.",
    closingBody: [
      "Haku leva Akari além dos limites do mundo físico. Mochi aproxima aquilo que o mundo tentou apagar. Akari transforma ambos em direção.",
      "Juntos, eles representam três forças que sustentam a jornada por Tsukihara:",
    ],
    closingEmphasis: "seguir em frente, enxergar mais fundo e lembrar o que importa.",
  },
  en: {
    eyebrow: "COMPANIONS",
    introJp: "九つの世界を一人で渡ることはない",
    introTitle: "You do not cross nine realms alone.",
    introBody: [
      "Among fractured memories, impossible paths and realms on the edge of oblivion, Akari travels beside two presences that reshape her journey.",
      "Haku carries the impulse of the skies. Mochi sees what the world has already forgotten.",
      "Together, they do more than follow Akari. They expand how Tsukihara is explored, felt and remembered.",
    ],
    prompt: "Choose a bond",
    companions: {
      haku: {
        id: "haku",
        label: "HAKU",
        jp: "道の守護者",
        role: "TRAVERSAL",
        title: "Haku — Guardian of the paths",
        body: [
          "Haku turns distance into possibility.",
          "More than a mount, he expands the scale of Akari's journey — reaching suspended regions, crossing chasms and touching parts of Tsukihara that would be impossible to reach on foot.",
          "When Haku enters the journey, traversal stops being simple movement. It becomes freedom.",
        ],
        microcopy: "TRAVERSE FARTHER. ASCEND HIGHER.",
        tags: ["flight", "mobility", "reach", "altitude"],
        character: assets.haku,
        keyVisual: assets.hakuScene,
      },
      mochi: {
        id: "mochi",
        label: "MOCHI",
        jp: "忘却を見る眼",
        role: "PERCEPTION",
        title: "Mochi — An eye for what was forgotten",
        body: [
          "Mochi is small only in size.",
          "He senses fractures, secrets and memory echoes most would miss — revealing hidden passages, traces of erased stories and signs that not everything that vanished is truly gone.",
          "Mochi brings lightness to the journey, but also a rare form of perception: the ability to see what still insists on remaining.",
        ],
        microcopy: "SEE WHAT MEMORY LEFT BEHIND.",
        tags: ["memory", "secrets", "perception", "discovery"],
        character: assets.mochi,
        keyVisual: assets.mochiScene,
      },
    },
    closingJp: "旅路と記憶と勇気は同じ道を進む",
    closingTitle: "Traversal, memory and courage share the same path.",
    closingBody: [
      "Haku carries Akari beyond the limits of the physical world. Mochi draws near what the world tried to erase. Akari turns both into direction.",
      "Together, they embody three forces that sustain the journey through Tsukihara:",
    ],
    closingEmphasis: "move forward, see deeper and remember what matters.",
  },
};
