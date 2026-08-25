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
    language: string;
  };
  controls: {
    exit: string;
    mute: string;
    unmute: string;
    soundOn: string;
    soundOff: string;
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
      prompt: "CLIQUE PARA LEMBRAR",
      headphones: "Fones de ouvido recomendados",
    },
    menu: {
      eyebrow: "UMA EXPERIÊNCIA DE TSUKIHARA",
      title: "REMEMBER",
      begin: "INICIAR",
      language: "Idioma",
    },
    controls: {
      exit: "Sair da memória",
      mute: "Silenciar",
      unmute: "Ativar som",
      soundOn: "Som ligado",
      soundOff: "Som desligado",
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
      prompt: "PRESS ANYWHERE TO REMEMBER",
      headphones: "Headphones recommended",
    },
    menu: {
      eyebrow: "A TSUKIHARA EXPERIENCE",
      title: "REMEMBER",
      begin: "BEGIN",
      language: "Language",
    },
    controls: {
      exit: "Exit memory",
      mute: "Mute",
      unmute: "Unmute",
      soundOn: "Sound on",
      soundOff: "Sound off",
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
