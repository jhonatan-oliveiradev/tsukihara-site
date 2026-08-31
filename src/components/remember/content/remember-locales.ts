import type { RememberLocale } from "@/components/remember/state/remember-state";

export type RememberLocaleCopy = {
  boot: {
    prompt: string;
    headphones: string;
  };
  menu: {
    eyebrow: string;
    title: string;
    begin: string;
    continue: string;
    revisit: string;
    newGame: string;
    archive: string;
    beginAgain: string;
    beginAgainBody: string;
    confirm: string;
    cancel: string;
    progress: string;
    language: string;
    thesis: string;
  };
  loading: {
    label: string;
    fragments: string;
    retry: string;
    transition: string;
  };
  controls: {
    exit: string;
    mute: string;
    unmute: string;
    soundOn: string;
    soundOff: string;
    pause: string;
    resume: string;
    fullscreen: string;
    exitFullscreen: string;
  };
  pause: {
    eyebrow: string;
    title: string;
    resume: string;
    restart: string;
    archive: string;
    returnTitle: string;
  };
  archive: {
    eyebrow: string;
    title: string;
    recovered: string;
    restored: string;
    unstable: string;
    unknown: string;
    locked: string;
    close: string;
    akariUnknown: string;
    replay: string;
  };
  memory: {
    label: string;
    fragments: string;
    instruction: string;
    keyboardAction: string;
    restored: string;
    continue: string;
    guidanceTitle: string;
    guidanceBody: string;
    lunarFocus: string;
    lunarFocusReady: string;
    lunarFocusActive: string;
    lunarFocusCooldown: string;
    result: string;
    integrity: string;
    resonance: string;
    time: string;
    retryMemory: string;
    newBest: string;
    bestMaintained: string;
    bestRecord: string;
  };
  interlude01: {
    eyebrow: string;
    title: string;
    lineOne: string;
    lineTwo: string;
    trace: string;
    complete: string;
    continue: string;
    traceLabels: readonly [string, string, string, string];
  };
  interlude02: {
    eyebrow: string;
    title: string;
    lines: readonly [string, string, string, string];
    record: string;
    status: string;
    restored: string;
    continue: string;
  };
  akari: {
    eyebrow: string;
    title: string;
    line: string;
    continue: string;
  };
  epilogue: {
    eyebrow: string;
    line: string;
    continue: string;
  };
  credits: {
    eyebrow: string;
    title: string;
    cta: string;
    replay: string;
    creditsLabel: string;
    creditRoles: readonly string[];
  };
};

export const rememberLocales: Record<RememberLocale, RememberLocaleCopy> = {
  pt: {
    boot: {
      prompt: "APERTE QUALQUER BOTÃO PARA LEMBRAR",
      headphones: "Fones de ouvido recomendados",
    },
    menu: {
      eyebrow: "UMA EXPERIÊNCIA DE TSUKIHARA",
      title: "REMEMBER",
      begin: "INICIAR",
      continue: "CONTINUAR MEMÓRIA",
      revisit: "REVISITAR MEMÓRIAS",
      newGame: "NOVA MEMÓRIA",
      archive: "ARQUIVO DE MEMÓRIAS",
      beginAgain: "LEMBRAR NOVAMENTE?",
      beginAgainBody:
        "A memória atual será substituída. As cicatrizes registradas não poderão ser recuperadas.",
      confirm: "COMEÇAR NOVAMENTE",
      cancel: "CANCELAR",
      progress: "MEMÓRIA ATUAL",
      language: "Idioma",
      thesis: "RESTAURE A MEMÓRIA. CARREGUE A CICATRIZ.",
    },
    loading: {
      label: "RECUPERANDO MEMÓRIAS",
      fragments: "FRAGMENTOS DE MEMÓRIA",
      retry: "TENTAR NOVAMENTE",
      transition: "ATRAVESSANDO A MEMÓRIA",
    },
    controls: {
      exit: "Sair da memória",
      mute: "Silenciar",
      unmute: "Ativar som",
      soundOn: "Som ligado",
      soundOff: "Som desligado",
      pause: "Pausar memória",
      resume: "Retomar memória",
      fullscreen: "Tela cheia",
      exitFullscreen: "Sair da tela cheia",
    },
    pause: {
      eyebrow: "MEMÓRIA SUSPENSA",
      title: "PAUSA",
      resume: "RETOMAR",
      restart: "REINICIAR MEMÓRIA",
      archive: "ARQUIVO DE MEMÓRIAS",
      returnTitle: "VOLTAR AO TÍTULO",
    },
    archive: {
      eyebrow: "REGISTRO LUNAR",
      title: "ARQUIVO DE MEMÓRIAS",
      recovered: "RECUPERADO",
      restored: "RESTAURADA",
      unstable: "INSTÁVEL",
      unknown: "DESCONHECIDA",
      locked: "BLOQUEADO",
      close: "FECHAR ARQUIVO",
      akariUnknown: "REGISTRO DESCONHECIDO",
      replay: "REVISITAR",
    },
    memory: {
      label: "MEMÓRIA",
      fragments: "FRAGMENTOS",
      instruction: "Restaure o que permanece.",
      keyboardAction: "Restaurar fragmento",
      restored: "RESTAURADA",
      continue: "CONTINUAR",
      guidanceTitle: "RECONSTRUA A MEMÓRIA",
      guidanceBody: "Arraste os fragmentos e devolva-os ao lugar ao qual pertencem.",
      lunarFocus: "FOCO LUNAR",
      lunarFocusReady: "PRONTO",
      lunarFocusActive: "REALIDADE ESTABILIZADA",
      lunarFocusCooldown: "RECARGA",
      result: "RESULTADO DA MEMÓRIA",
      integrity: "Integridade",
      resonance: "Ressonância",
      time: "Tempo",
      retryMemory: "REPETIR MEMÓRIA",
      newBest: "NOVO MELHOR RESULTADO",
      bestMaintained: "MELHOR REGISTRO MANTIDO",
      bestRecord: "MELHOR",
    },
    interlude01: {
      eyebrow: "ASSINATURA DE MEMÓRIA DESCONHECIDA",
      title: "ALGO PERMANECE ENTRE AS MEMÓRIAS",
      lineOne: "Você não está restaurando lugares.",
      lineTwo: "Está seguindo alguém.",
      trace: "RASTRO",
      complete: "ASSINATURA PARCIAL RECONSTRUÍDA",
      continue: "SEGUIR O RASTRO",
      traceLabels: ["Resíduo lunar", "Caminho quebrado", "Pulso de memória", "Eco distante"],
    },
    interlude02: {
      eyebrow: "CONVERGÊNCIA DE MEMÓRIAS",
      title: "EXISTE UMA SEXTA PRESENÇA",
      lines: [
        "Cinco memórias restauradas.",
        "Cinco Reinos.",
        "Cinco versões de mim mesmo.",
        "Mas existe uma sexta presença.",
      ],
      record: "REGISTRO DE MEMÓRIA",
      status: "STATUS",
      restored: "RESTAURADO",
      continue: "ABRIR O REGISTRO",
    },
    akari: {
      eyebrow: "A GUARDIÃ QUE O MUNDO ESQUECEU",
      title: "AKARI",
      line: "Então você se lembrou.",
      continue: "SEGUIR",
    },
    epilogue: {
      eyebrow: "O ECLIPSE CONTINUA",
      line: "As memórias voltaram. Tsukihara ainda está esquecendo.",
      continue: "CONTINUAR",
    },
    credits: {
      eyebrow: "TSUKIHARA — ECLIPSE OF THE NINE REALMS",
      title: "LEMBRE-SE DO QUE RESTA.",
      cta: "CONTINUAR PARA TSUKIHARA",
      replay: "REPETIR A EXPERIÊNCIA",
      creditsLabel: "CRÉDITOS",
      creditRoles: [
        "Direção Criativa",
        "Direção de Arte",
        "Game Design",
        "Narrativa",
        "UX / UI",
        "Desenvolvimento",
        "Motion & VFX",
        "QA",
        "Restaurador Oficial de Memórias",
      ],
    },
  },
  en: {
    boot: {
      prompt: "PRESS ANY BUTTON TO REMEMBER",
      headphones: "Headphones recommended",
    },
    menu: {
      eyebrow: "A TSUKIHARA EXPERIENCE",
      title: "REMEMBER",
      begin: "BEGIN",
      continue: "CONTINUE MEMORY",
      revisit: "REVISIT MEMORIES",
      newGame: "NEW MEMORY",
      archive: "MEMORY ARCHIVE",
      beginAgain: "BEGIN AGAIN?",
      beginAgainBody: "The current memory will be replaced. Recorded scars cannot be recovered.",
      confirm: "BEGIN AGAIN",
      cancel: "CANCEL",
      progress: "CURRENT MEMORY",
      language: "Language",
      thesis: "RESTORE THE MEMORY. KEEP THE SCAR.",
    },
    loading: {
      label: "RECOVERING MEMORIES",
      fragments: "MEMORY FRAGMENTS",
      retry: "TRY AGAIN",
      transition: "CROSSING THE MEMORY",
    },
    controls: {
      exit: "Exit memory",
      mute: "Mute",
      unmute: "Unmute",
      soundOn: "Sound on",
      soundOff: "Sound off",
      pause: "Pause memory",
      resume: "Resume memory",
      fullscreen: "Fullscreen",
      exitFullscreen: "Exit fullscreen",
    },
    pause: {
      eyebrow: "MEMORY SUSPENDED",
      title: "PAUSE",
      resume: "RESUME",
      restart: "RESTART MEMORY",
      archive: "MEMORY ARCHIVE",
      returnTitle: "RETURN TO TITLE",
    },
    archive: {
      eyebrow: "LUNAR RECORD",
      title: "MEMORY ARCHIVE",
      recovered: "RECOVERED",
      restored: "RESTORED",
      unstable: "UNSTABLE",
      unknown: "UNKNOWN",
      locked: "LOCKED",
      close: "CLOSE ARCHIVE",
      akariUnknown: "UNKNOWN RECORD",
      replay: "REVISIT",
    },
    memory: {
      label: "MEMORY",
      fragments: "FRAGMENTS",
      instruction: "Restore what remains.",
      keyboardAction: "Restore fragment",
      restored: "RESTORED",
      continue: "CONTINUE",
      guidanceTitle: "RECONSTRUCT THE MEMORY",
      guidanceBody: "Drag the fragments and return them to the place where they belong.",
      lunarFocus: "LUNAR FOCUS",
      lunarFocusReady: "READY",
      lunarFocusActive: "REALITY STABILIZED",
      lunarFocusCooldown: "COOLDOWN",
      result: "MEMORY RESULT",
      integrity: "Integrity",
      resonance: "Resonance",
      time: "Time",
      retryMemory: "RETRY MEMORY",
      newBest: "NEW BEST RESULT",
      bestMaintained: "BEST RECORD KEPT",
      bestRecord: "BEST",
    },
    interlude01: {
      eyebrow: "UNKNOWN MEMORY SIGNATURE",
      title: "SOMETHING REMAINS BETWEEN THE MEMORIES",
      lineOne: "You are not restoring places.",
      lineTwo: "You are following someone.",
      trace: "TRACE",
      complete: "PARTIAL SIGNATURE RECONSTRUCTED",
      continue: "FOLLOW THE TRACE",
      traceLabels: ["Lunar residue", "Broken path", "Memory pulse", "Distant echo"],
    },
    interlude02: {
      eyebrow: "MEMORY CONVERGENCE",
      title: "THERE IS A SIXTH PRESENCE",
      lines: [
        "Five memories restored.",
        "Five Realms.",
        "Five versions of myself.",
        "But there is a sixth presence.",
      ],
      record: "MEMORY RECORD",
      status: "STATUS",
      restored: "RESTORED",
      continue: "OPEN THE RECORD",
    },
    akari: {
      eyebrow: "THE GUARDIAN THE WORLD FORGOT",
      title: "AKARI",
      line: "So you remembered.",
      continue: "CONTINUE",
    },
    epilogue: {
      eyebrow: "THE ECLIPSE ENDURES",
      line: "The memories returned. Tsukihara is still forgetting.",
      continue: "CONTINUE",
    },
    credits: {
      eyebrow: "TSUKIHARA — ECLIPSE OF THE NINE REALMS",
      title: "REMEMBER WHAT REMAINS.",
      cta: "CONTINUE TO TSUKIHARA",
      replay: "EXPERIENCE AGAIN",
      creditsLabel: "CREDITS",
      creditRoles: [
        "Creative Direction",
        "Art Direction",
        "Game Design",
        "Narrative",
        "UX / UI",
        "Development",
        "Motion & VFX",
        "QA",
        "Official Memory Restorer",
      ],
    },
  },
};

export const getRememberCopy = (locale: RememberLocale) => rememberLocales[locale];
