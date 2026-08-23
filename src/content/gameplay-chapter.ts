export type GameplayLocale = "pt" | "en";

export type GameplayBeatId =
  | "explore"
  | "reveal"
  | "restore"
  | "traverse"
  | "combat"
  | "boss";

type GameplayBeat = {
  id: GameplayBeatId;
  index: string;
  title: string;
  titleJp: string;
  copy: string;
  microcopy: string;
};

type GameplayChapterCopy = {
  eyebrow: string;
  title: string;
  titleJp: string;
  intro: string;
  beats: GameplayBeat[];
  closing: {
    title: string;
    titleJp: string;
    body: string;
    signature: string;
  };
};

export const gameplayAssets = {
  explore: "/assets/exploration/g01-exploration-hanamori-overview-alt.png",
  revealBefore: "/assets/exploration/g02-hidden-path-default.png",
  revealAfter: "/assets/level-design/g03-hidden-path-revealed.png",
  revealAfterAlt: "/assets/exploration/g03-hidden-path-revealed-alt.png",
  restoreBefore: "/assets/level-design/g04-restore-before.png",
  restoreAfter: "/assets/level-design/g05-restore-after.png",
  traverse: "/assets/level-design/g06-spirit-bridge-traverse.png",
  combat: "/assets/level-design/g07-combat-common-enemy.png",
  combatShift: "/assets/exploration/g08-enemy-phase-shift.png",
  boss: "/assets/level-design/g09-boss-encounter.png",
  bossAlt: "/assets/exploration/g09-boss-encounter-alt.png",
  combatFx: "/assets/exploration/g10-combat-fx.png",
  environmentFx: "/assets/exploration/g11-environment-fx.png",
  closing: "/assets/exploration/g12-gameplay-closing-key-visual.png",
  kintsugiBefore: "/assets/level-design/g01-before-kitsugi-lunar.png",
  kintsugiAfter: "/assets/level-design/g01-after-kitsugi-lunar.png",
} as const;

export const gameplayChapterCopy: Record<GameplayLocale, GameplayChapterCopy> = {
  pt: {
    eyebrow: "GAMEPLAY",
    title: "Um mundo quebrado não se atravessa do mesmo jeito duas vezes.",
    titleJp: "砕けた世界に同じ道はない",
    intro:
      "Explore os Nove Reinos, encontre caminhos que deixaram de existir e use o Kintsugi Lunar para reconstruir aquilo que o Eclipse tentou apagar. Cada região muda a forma como você se move, luta e percebe o mundo.",
    beats: [
      {
        id: "explore",
        index: "01",
        title: "Explore aquilo que ainda permanece.",
        titleJp: "残された世界を歩け",
        copy: "Os Nove Reinos formam um mundo conectado por atalhos, ruínas, caminhos espirituais e regiões que mudam conforme o Eclipse avança. Nem todo lugar estará acessível quando você o encontrar pela primeira vez. Voltar faz parte da jornada.",
        microcopy: "OBSERVE. MEMORIZE. RETORNE.",
      },
      {
        id: "reveal",
        index: "02",
        title: "Veja o que o mundo já esqueceu.",
        titleJp: "世界が忘れたものを見よ",
        copy: "Algumas estruturas continuam existindo entre memória e matéria. Ao ativar a Máscara do Limiar, Akari consegue enxergar aquilo que já desapareceu para todos os outros.",
        microcopy: "NEM TUDO QUE DESAPARECEU DEIXOU DE EXISTIR.",
      },
      {
        id: "restore",
        index: "03",
        title: "Reconstrua sem apagar a cicatriz.",
        titleJp: "傷を隠さず繋ぎ直せ",
        copy: "Pontes, mecanismos, templos e fragmentos do mundo voltam a se conectar pelo Kintsugi Lunar — mas nunca exatamente como eram antes. As marcas da ruptura permanecem visíveis.",
        microcopy: "RESTORE THE PATH. KEEP THE SCAR.",
      },
      {
        id: "traverse",
        index: "04",
        title: "Faça do impossível um caminho.",
        titleJp: "不可能を道に変えろ",
        copy: "Reconstrua plataformas temporárias, alcance regiões suspensas, atravesse ruínas fragmentadas e descubra novos caminhos entre os reinos.",
        microcopy: "O CAMINHO EXISTE ENQUANTO VOCÊ CONSEGUE MANTÊ-LO INTEIRO.",
      },
      {
        id: "combat",
        index: "05",
        title: "Lute entre matéria e memória.",
        titleJp: "物質と記憶の狭間で戦え",
        copy: "As criaturas do Eclipse não existem inteiramente no mesmo plano. Algumas só podem ser atingidas depois que sua verdadeira forma é revelada. Combate, percepção e transformação fazem parte do mesmo sistema.",
        microcopy: "ENCONTRE A RUPTURA. ATAQUE O QUE EXISTE POR TRÁS DELA.",
      },
      {
        id: "boss",
        index: "06",
        title: "Algumas memórias não querem ser restauradas.",
        titleJp: "戻ることを拒む記憶もある",
        copy: "Cada reino abriga entidades transformadas pelo Eclipse. Enfrentar esses seres significa compreender primeiro aquilo que os mantém presos.",
        microcopy: "ENTENDA A MEMÓRIA. ENFRENTE O QUE ELA SE TORNOU.",
      },
    ],
    closing: {
      title: "Cada reino muda as regras.",
      titleJp: "九つの国 九つの理",
      body: "Explorar Tsukihara significa aprender a observar aquilo que falta. Novos poderes não servem apenas para vencer inimigos. Eles mudam a forma como você entende o próprio mundo.",
      signature: "EXPLORE. REVEAL. RESTORE. FIGHT. REMEMBER.",
    },
  },
  en: {
    eyebrow: "GAMEPLAY",
    title: "A broken world is never crossed the same way twice.",
    titleJp: "砕けた世界に同じ道はない",
    intro:
      "Explore the Nine Realms, find paths that ceased to exist and use Lunar Kintsugi to rebuild what the Eclipse tried to erase. Every region changes how you move, fight and perceive the world.",
    beats: [
      {
        id: "explore",
        index: "01",
        title: "Explore what still remains.",
        titleJp: "残された世界を歩け",
        copy: "The Nine Realms form a connected world of shortcuts, ruins, spiritual paths and regions that change as the Eclipse advances. Not every place will be accessible when you first find it. Returning is part of the journey.",
        microcopy: "OBSERVE. MEMORIZE. RETURN.",
      },
      {
        id: "reveal",
        index: "02",
        title: "See what the world already forgot.",
        titleJp: "世界が忘れたものを見よ",
        copy: "Some structures continue to exist between memory and matter. By activating the Mask of the Threshold, Akari can see what has already vanished for everyone else.",
        microcopy: "NOT EVERYTHING THAT VANISHED CEASED TO EXIST.",
      },
      {
        id: "restore",
        index: "03",
        title: "Rebuild without hiding the scar.",
        titleJp: "傷を隠さず繋ぎ直せ",
        copy: "Bridges, mechanisms, temples and fragments reconnect through Lunar Kintsugi — but never exactly as they were. The marks of the rupture remain visible.",
        microcopy: "RESTORE THE PATH. KEEP THE SCAR.",
      },
      {
        id: "traverse",
        index: "04",
        title: "Turn the impossible into a path.",
        titleJp: "不可能を道に変えろ",
        copy: "Rebuild temporary platforms, reach suspended regions, cross fragmented ruins and discover new paths between the realms.",
        microcopy: "THE PATH EXISTS WHILE YOU CAN KEEP IT WHOLE.",
      },
      {
        id: "combat",
        index: "05",
        title: "Fight between matter and memory.",
        titleJp: "物質と記憶の狭間で戦え",
        copy: "Creatures of the Eclipse do not fully exist on the same plane. Some can only be struck after their true form is revealed. Combat, perception and transformation belong to the same system.",
        microcopy: "FIND THE RUPTURE. STRIKE WHAT EXISTS BEHIND IT.",
      },
      {
        id: "boss",
        index: "06",
        title: "Some memories do not want to be restored.",
        titleJp: "戻ることを拒む記憶もある",
        copy: "Every realm shelters entities transformed by the Eclipse. Facing them means first understanding what keeps them bound.",
        microcopy: "UNDERSTAND THE MEMORY. FACE WHAT IT BECAME.",
      },
    ],
    closing: {
      title: "Every realm changes the rules.",
      titleJp: "九つの国 九つの理",
      body: "Exploring Tsukihara means learning to notice what is missing. New powers are not only tools to defeat enemies. They change how you understand the world itself.",
      signature: "EXPLORE. REVEAL. RESTORE. FIGHT. REMEMBER.",
    },
  },
};
