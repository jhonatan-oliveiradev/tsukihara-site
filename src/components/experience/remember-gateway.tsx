import Image from "next/image";
import Link from "next/link";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { Locale } from "@/content/immersive-copy";

const rememberGatewayCopy = {
  pt: {
    eyebrow: "UMA EXPERIÊNCIA DE TSUKIHARA",
    title: "Há memórias que o Eclipse não conseguiu apagar.",
    titleJp: "蝕が消せなかった記憶がある。",
    body: "Antes que Akari atravesse os Nove Reinos, alguns fragmentos ainda esperam ser restaurados. REMEMBER é um prólogo interativo curto ambientado no universo de Eclipse of the Nine Realms.",
    cta: "Restaurar a primeira memória",
    meta: "Prólogo interativo · direto no navegador",
  },
  en: {
    eyebrow: "A TSUKIHARA EXPERIENCE",
    title: "Some memories survived the Eclipse.",
    titleJp: "蝕が消せなかった記憶がある。",
    body: "Before Akari crosses the Nine Realms, a handful of fragments are still waiting to be restored. REMEMBER is a short interactive prologue set inside the world of Eclipse of the Nine Realms.",
    cta: "Restore the first memory",
    meta: "Interactive prologue · play in your browser",
  },
} as const;

type RememberGatewayProps = {
  locale: Locale;
};

export function RememberGateway({ locale }: RememberGatewayProps) {
  const copy = rememberGatewayCopy[locale];

  return (
    <section id="remember" className="ix-remember-gateway" data-section>
      <div className="ix-remember-gateway__media" aria-hidden="true">
        <Image
          src={rememberAssets.menuBackground}
          alt=""
          fill
          sizes="100vw"
          className="ix-remember-gateway__background"
        />
        <Image
          src={rememberAssets.kintsugiCrackOverlay}
          alt=""
          fill
          sizes="100vw"
          className="ix-remember-gateway__cracks"
        />
        <div className="ix-remember-gateway__veil" />
      </div>

      <div className="ix-remember-gateway__frame" aria-hidden="true" />

      <div className="ix-remember-gateway__content">
        <div className="ix-remember-gateway__eyebrow" data-reveal>
          <span className="ix-remember-gateway__sigil" aria-hidden="true" />
          <span>{copy.eyebrow}</span>
          <i aria-hidden="true" />
        </div>

        <div className="ix-remember-gateway__title" data-reveal>
          <span className="ix-remember-gateway__word" aria-hidden="true">
            REMEMBER
          </span>
          <h2>{copy.title}</h2>
          <p lang="ja">{copy.titleJp}</p>
        </div>

        <div className="ix-remember-gateway__footer" data-reveal>
          <p>{copy.body}</p>
          <div className="ix-remember-gateway__actions">
            <Link href="/remember" className="ix-remember-gateway__cta">
              <span>{copy.cta}</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <small>{copy.meta}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
