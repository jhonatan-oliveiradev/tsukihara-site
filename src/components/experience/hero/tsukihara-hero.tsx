"use client";

import Image from "next/image";
import { useRef } from "react";
import { HeroCamera } from "@/components/experience/hero/hero-camera";
import { HeroScene } from "@/components/experience/hero/hero-scene";
import { useHeroTimeline } from "@/components/experience/hero/hooks/use-hero-timeline";
import { useMemoryBridge } from "@/components/experience/hero/hooks/use-memory-bridge";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type TsukiharaHeroProps = {
  copy: Copy;
  locale: Locale;
};

const narrative = {
  pt: {
    omenEyebrow: "A MEMÓRIA ESTÁ SE PARTINDO",
    omenTitle: "Primeiro, o mundo esquece os nomes.",
    omenBody:
      "Depois, pontes deixam de existir, templos desaparecem dos mapas e os Vazios Lunares atravessam aquilo que restou da realidade.",
    eclipseEyebrow: "KINTSUGI LUNAR",
    eclipseTitle: "A lua esqueceu. Mas você lembra.",
    eclipseBody:
      "Com a máscara kitsune, Akari enxerga fragmentos apagados e os restaura por instantes — escolhendo quais partes do mundo devem voltar a existir.",
    bridgeEyebrow: "ENTRE O ESQUECIMENTO E A MEMÓRIA",
    bridgeTitle: "Nem tudo o que desaparece deixa de existir.",
    bridgeJp: "消えたものは、まだそこにある。",
    phaseSerene: "Lua-Mãe",
    phaseOmen: "Presságio",
    phaseEclipse: "Eclipse Carmesim",
  },
  en: {
    omenEyebrow: "MEMORY IS BREAKING APART",
    omenTitle: "First, the world forgets its names.",
    omenBody:
      "Then bridges cease to exist, temples vanish from maps, and Lunar Voids cross what remains of reality.",
    eclipseEyebrow: "LUNAR KINTSUGI",
    eclipseTitle: "The moon forgot. But you remember.",
    eclipseBody:
      "Through her kitsune mask, Akari sees erased fragments and restores them for a moment — choosing which pieces of the world may exist again.",
    bridgeEyebrow: "BETWEEN OBLIVION AND MEMORY",
    bridgeTitle: "Not everything that disappears ceases to exist.",
    bridgeJp: "消えたものは、まだそこにある。",
    phaseSerene: "Moon-Mother",
    phaseOmen: "Omen",
    phaseEclipse: "Crimson Eclipse",
  },
} as const;

export function TsukiharaHero({ copy, locale }: TsukiharaHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const beat = narrative[locale];
  useHeroTimeline(rootRef);
  useMemoryBridge(rootRef);

  return (
    <section ref={rootRef} id="top" data-section className="th-hero">
      <div className="th-hero-stage">
        <div className="th-hero-background-layer" data-hero-background-layer>
          <HeroCamera>
            <HeroScene />
          </HeroCamera>
        </div>

        <div className="th-hero-content" data-hero-content>
          <div className="th-hero-copy-layer" data-hero-copy-layer>
            <div className="th-hero-copy th-hero-copy-intro" data-copy-intro>
              <p className="ix-eyebrow">
                <b>月母</b> {copy.hero.eyebrow}
              </p>
              <h1>
                <JpRevealText jp={copy.hero.titleJp} text={copy.hero.title} locale={locale} />
              </h1>
              <p className="th-hero-body">{copy.hero.body}</p>
              <div className="th-hero-signature">
                <span>AKARI NO REI</span>
                <i />
                <span>九つの国</span>
              </div>
            </div>

            <div className="th-hero-copy th-hero-copy-beat th-hero-copy-omen" data-copy-omen>
              <p className="ix-eyebrow">
                <b>忘却</b> {beat.omenEyebrow}
              </p>
              <h2>{beat.omenTitle}</h2>
              <p className="th-hero-body">{beat.omenBody}</p>
            </div>

            <div className="th-hero-copy th-hero-copy-beat th-hero-copy-eclipse" data-copy-eclipse>
              <p className="ix-eyebrow">
                <b>金継ぎ</b> {beat.eclipseEyebrow}
              </p>
              <h2>{beat.eclipseTitle}</h2>
              <p className="th-hero-body">{beat.eclipseBody}</p>
            </div>
          </div>

          <div className="th-hero-logo" data-hero-logo>
            <Image
              src="/assets_hq/logotipo.png"
              alt="Tsukihara"
              width={520}
              height={293}
              priority
            />
          </div>

          <div className="th-hero-word" data-hero-word aria-hidden="true">
            TSUKIHARA
          </div>
          <div className="th-hero-jp" aria-hidden="true">
            {copy.hero.vertical}
          </div>

          <div className="th-hero-phase" aria-hidden="true">
            <span data-phase-serene>{beat.phaseSerene}</span>
            <span data-phase-omen>{beat.phaseOmen}</span>
            <span data-phase-eclipse>{beat.phaseEclipse}</span>
          </div>

          <div className="th-hero-kanji" aria-hidden="true">
            <span data-kanji-memory>記憶</span>
            <span data-kanji-eclipse>蝕</span>
          </div>

          <a href="#gate" className="th-hero-scroll-cue">
            <span>{copy.hero.cue}</span>
            <i />
          </a>
        </div>

        <div className="th-hero-blackout" data-hero-blackout aria-hidden="true" />
        <div className="th-hero-eclipse-curtain" data-hero-eclipse-curtain aria-hidden="true" />

        <div className="th-memory-bridge" data-memory-bridge aria-hidden="true">
          <div className="th-memory-temple" data-memory-temple>
            <Image src="/assets_hq/templo-hanamori_2.png" alt="" fill sizes="100vw" />
          </div>
          <div className="th-memory-haze" data-memory-haze />
          <div className="th-memory-copy" data-memory-copy>
            <span className="th-memory-eyebrow" data-memory-eyebrow>
              {beat.bridgeEyebrow}
            </span>
            <strong className="th-memory-title" aria-label={beat.bridgeTitle}>
              {beat.bridgeTitle.split(" ").map((word, wordIndex) => (
                <span className="th-memory-word" key={`${word}-${wordIndex}`}>
                  {Array.from(word).map((character, characterIndex) => (
                    <span
                      key={`${character}-${wordIndex}-${characterIndex}`}
                      data-memory-glyph
                      aria-hidden="true"
                    >
                      {character}
                    </span>
                  ))}
                </span>
              ))}
            </strong>
            <span className="th-memory-jp" lang="ja" data-memory-jp>
              {beat.bridgeJp}
            </span>
          </div>
          <div className="th-memory-ashes" data-memory-ashes>
            {Array.from({ length: 30 }, (_, index) => (
              <i key={index} data-memory-ash />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
