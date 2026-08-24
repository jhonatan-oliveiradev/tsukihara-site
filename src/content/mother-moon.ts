import type { Locale } from "@/content/immersive-copy";

export type MotherMoonAssetCode =
  | "M01"
  | "M02"
  | "M03"
  | "M04"
  | "M05"
  | "M06"
  | "M07"
  | "M08"
  | "M09"
  | "M10";

export type MotherMoonMemory = {
  id: string;
  text: string;
  x: number;
  y: number;
  weight: "whisper" | "phrase";
};

export const motherMoonAssets: Record<MotherMoonAssetCode, string> = {
  M01: "/08-mother-moon/m01-mother-moon-hero.png",
  M02: "/08-mother-moon/m02-mother-moon-forgetting.png",
  M03: "/08-mother-moon/m03-memory-fragments-overlay.png",
  M04: "/08-mother-moon/m04-tsukino-silhouette.png",
  M05: "/08-mother-moon/m05-tsukino-eye-detail.png",
  M06: "/08-mother-moon/m06-tsukino-hand-detail.png",
  M07: "/08-mother-moon/m07-tsukino-eclipse-profile.png",
  M08: "/08-mother-moon/m08-mother-moon-reflection.png",
  M09: "/08-mother-moon/m09-forget-remember-divider.png",
  M10: "/08-mother-moon/m10-section-closing-eclipse.png",
};

const ptMemories: MotherMoonMemory[] = [
  { id: "hanamori", text: "HANAMORI", x: 23, y: 28, weight: "whisper" },
  { id: "promise", text: "PROMESSA", x: 67, y: 24, weight: "whisper" },
  { id: "home", text: "LAR", x: 72, y: 61, weight: "whisper" },
  { id: "akari", text: "AKARI", x: 31, y: 72, weight: "whisper" },
  { id: "remember", text: "LEMBRAR", x: 50, y: 45, weight: "whisper" },
  {
    id: "place",
    text: "Um lugar existe porque alguém se lembra dele.",
    x: 16,
    y: 52,
    weight: "phrase",
  },
  {
    id: "name",
    text: "Um nome sobrevive porque alguém ainda o pronuncia.",
    x: 63,
    y: 78,
    weight: "phrase",
  },
  {
    id: "world",
    text: "Um mundo sobrevive porque alguém se recusa a esquecer.",
    x: 48,
    y: 14,
    weight: "phrase",
  },
];

const enMemories: MotherMoonMemory[] = [
  { id: "hanamori", text: "HANAMORI", x: 23, y: 28, weight: "whisper" },
  { id: "promise", text: "PROMISE", x: 67, y: 24, weight: "whisper" },
  { id: "home", text: "HOME", x: 72, y: 61, weight: "whisper" },
  { id: "akari", text: "AKARI", x: 31, y: 72, weight: "whisper" },
  { id: "remember", text: "REMEMBER", x: 50, y: 45, weight: "whisper" },
  {
    id: "place",
    text: "A place exists because someone remembers it.",
    x: 16,
    y: 52,
    weight: "phrase",
  },
  {
    id: "name",
    text: "A name survives because someone still speaks it.",
    x: 63,
    y: 78,
    weight: "phrase",
  },
  {
    id: "world",
    text: "A world survives because someone refuses to forget.",
    x: 48,
    y: 14,
    weight: "phrase",
  },
];

export const motherMoonCopy: Record<
  Locale,
  {
    opening: {
      eyebrow: string;
      title: string;
      jp: string;
      body: string[];
      fragments: string[];
      memories: MotherMoonMemory[];
    };
    forgetting: {
      eyebrow: string;
      title: string;
      titleSecond: string;
      body: string[];
      memories: MotherMoonMemory[];
    };
    presence: {
      eyebrow: string;
      title: string;
      body: string[];
      name: string;
      signature: string;
      quote: string;
      counterpoint: string;
    };
    philosophy: {
      eyebrow: string;
      title: string;
      body: string[];
      forget: string;
      forgetTerms: string[];
      remember: string;
      rememberTerms: string[];
    };
    closing: {
      jp: string;
      lines: string[];
      signature: string;
      archiveSeed: string[];
    };
  }
> = {
  pt: {
    opening: {
      eyebrow: "THE MOTHER MOON",
      title: "Enquanto a Lua se lembra, o mundo existe.",
      jp: "月が覚えている限り、世界は存在する。",
      body: [
        "Antes dos Nove Reinos existirem como fronteiras, havia memória.",
        "A Lua-Mãe preserva aquilo que permite que Tsukihara continue reconhecendo a si mesmo.",
        "Cada reino mantém uma ligação diferente com essa memória ancestral. Quando a Lua começou a esquecer, essas ligações começaram a se romper.",
      ],
      fragments: ["Nomes", "Caminhos", "Promessas", "Lugares", "Pessoas"],
      memories: ptMemories,
    },
    forgetting: {
      eyebrow: "THE FIRST ABSENCE",
      title: "O Eclipse não começa quando a Lua fica vermelha.",
      titleSecond: "Começa quando ela deixa de lembrar.",
      body: [
        "O que desaparece da memória da Lua desaparece também do mundo.",
        "No começo, são detalhes. Um caminho. Uma casa. Um nome.",
        "Depois, lugares inteiros.",
      ],
      memories: ptMemories.map((memory, index) => ({
        ...memory,
        text: index % 3 === 0 ? memory.text.slice(0, Math.max(3, Math.ceil(memory.text.length * 0.62))) : memory.text,
      })),
    },
    presence: {
      eyebrow: "RECORD UNKNOWN",
      title: "Alguém acredita que esquecer pode ser uma forma de salvação.",
      body: [
        "Ela viu o que as memórias fizeram com Tsukihara.",
        "Guerras que ninguém conseguiu abandonar. Perdas carregadas por gerações. Reinos presos ao passado.",
        "Para ela, o problema talvez nunca tenha sido o Eclipse. Talvez o problema seja aquilo que o mundo insiste em carregar.",
      ],
      name: "LADY TSUKINO",
      signature: "HERDEIRA DO ECLIPSE",
      quote: "Se ninguém lembrar da dor, ninguém precisará carregá-la.",
      counterpoint: "Então também esqueceríamos por que ainda vale a pena lutar.",
    },
    philosophy: {
      eyebrow: "TWO ANSWERS TO THE SAME WOUND",
      title: "Apagar a dor não é o mesmo que curá-la.",
      body: [
        "Para Lady Tsukino, um mundo sem memória dolorosa seria finalmente livre.",
        "Para Akari, um mundo incapaz de lembrar suas cicatrizes deixaria de reconhecer aquilo que sobreviveu.",
        "Uma quer apagar a ruptura. A outra escolhe restaurá-la. O destino de Tsukihara existe entre essas duas respostas.",
      ],
      forget: "ESQUECER",
      forgetTerms: ["silêncio", "paz", "ausência", "libertação"],
      remember: "LEMBRAR",
      rememberTerms: ["cicatriz", "identidade", "história", "reconstrução"],
    },
    closing: {
      jp: "蝕は覚えている。",
      lines: [
        "Alguns querem restaurar o mundo.",
        "Outros acreditam que ele nunca deveria se lembrar.",
      ],
      signature: "THE ECLIPSE REMEMBERS.",
      archiveSeed: ["ARCHIVE / 00", "MEMORY TRACE", "DATE UNKNOWN", "RECORD RECOVERED"],
    },
  },
  en: {
    opening: {
      eyebrow: "THE MOTHER MOON",
      title: "While the Moon remembers, the world exists.",
      jp: "月が覚えている限り、世界は存在する。",
      body: [
        "Before the Nine Realms existed as borders, there was memory.",
        "The Mother Moon preserves what allows Tsukihara to keep recognizing itself.",
        "Every realm holds a different bond with that ancestral memory. When the Moon began to forget, those bonds began to break.",
      ],
      fragments: ["Names", "Paths", "Promises", "Places", "People"],
      memories: enMemories,
    },
    forgetting: {
      eyebrow: "THE FIRST ABSENCE",
      title: "The Eclipse does not begin when the Moon turns red.",
      titleSecond: "It begins when she stops remembering.",
      body: [
        "What disappears from the Moon's memory disappears from the world as well.",
        "At first, they are details. A path. A home. A name.",
        "Then entire places.",
      ],
      memories: enMemories.map((memory, index) => ({
        ...memory,
        text: index % 3 === 0 ? memory.text.slice(0, Math.max(3, Math.ceil(memory.text.length * 0.62))) : memory.text,
      })),
    },
    presence: {
      eyebrow: "RECORD UNKNOWN",
      title: "Someone believes forgetting can be a form of salvation.",
      body: [
        "She saw what memory did to Tsukihara.",
        "Wars nobody could leave behind. Losses carried across generations. Realms imprisoned by the past.",
        "To her, perhaps the Eclipse was never the problem. Perhaps the problem is what the world insists on carrying.",
      ],
      name: "LADY TSUKINO",
      signature: "HEIR TO THE ECLIPSE",
      quote: "If no one remembers the pain, no one will have to carry it.",
      counterpoint: "Then we would also forget why it is still worth fighting.",
    },
    philosophy: {
      eyebrow: "TWO ANSWERS TO THE SAME WOUND",
      title: "Erasing pain is not the same as healing it.",
      body: [
        "For Lady Tsukino, a world without painful memory would finally be free.",
        "For Akari, a world unable to remember its scars would stop recognizing what survived them.",
        "One wants to erase the rupture. The other chooses to restore it. Tsukihara's fate exists between those two answers.",
      ],
      forget: "FORGET",
      forgetTerms: ["silence", "peace", "absence", "release"],
      remember: "REMEMBER",
      rememberTerms: ["scar", "identity", "history", "reconstruction"],
    },
    closing: {
      jp: "蝕は覚えている。",
      lines: [
        "Some want to restore the world.",
        "Others believe it should never remember.",
      ],
      signature: "THE ECLIPSE REMEMBERS.",
      archiveSeed: ["ARCHIVE / 00", "MEMORY TRACE", "DATE UNKNOWN", "RECORD RECOVERED"],
    },
  },
};
