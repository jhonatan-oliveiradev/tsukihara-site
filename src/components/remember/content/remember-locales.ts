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
    },
    akari: {
      eyebrow: "A GUARDIÃ QUE O MUNDO ESQUECEU",
      title: "AKARI",
      line: "Se até a Lua pode esquecer, alguém precisa lembrar por ela.",
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
    },
    akari: {
      eyebrow: "THE GUARDIAN THE WORLD FORGOT",
      title: "AKARI",
      line: "If even the Moon can forget, someone has to remember for her.",
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
    },
  },
};

export const getRememberCopy = (locale: RememberLocale) => rememberLocales[locale];
