"use client";

import Image from "next/image";
import { useRef } from "react";
import { HeroCamera } from "@/components/experience/hero/hero-camera";
import { HeroScene } from "@/components/experience/hero/hero-scene";
import { useHeroTimeline } from "@/components/experience/hero/hooks/use-hero-timeline";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type TsukiharaHeroProps = {
  copy: Copy;
  locale: Locale;
};

export function TsukiharaHero({ copy, locale }: TsukiharaHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  useHeroTimeline(rootRef);

  return (
    <section ref={rootRef} id="top" data-section className="th-hero">
      <div className="th-hero-stage">
        <HeroCamera>
          <HeroScene />
        </HeroCamera>

        <div className="th-hero-content" data-hero-content>
          <div className="th-hero-copy">
            <p className="ix-eyebrow" data-reveal>
              <b>月母</b> {copy.hero.eyebrow}
            </p>
            <h1>
              <JpRevealText jp={copy.hero.titleJp} text={copy.hero.title} locale={locale} />
            </h1>
            <p className="th-hero-body" data-reveal>
              {copy.hero.body}
            </p>
            <div className="th-hero-signature" data-reveal>
              <span>AKARI NO REI</span>
              <i />
              <span>九つの国</span>
            </div>
          </div>

          <div className="th-hero-logo" data-hero-logo>
            <Image src="/assets_hq/logotipo.png" alt="Tsukihara" width={520} height={293} priority />
          </div>

          <div className="th-hero-word" aria-hidden="true">
            TSUKIHARA
          </div>
          <div className="th-hero-jp" aria-hidden="true">
            {copy.hero.vertical}
          </div>
          <a href="#gate" className="th-hero-scroll-cue">
            <span>{copy.hero.cue}</span>
            <i />
          </a>
        </div>
      </div>
    </section>
  );
}
