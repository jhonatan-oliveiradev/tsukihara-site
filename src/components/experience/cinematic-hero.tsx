import Image from "next/image";
import { HeroParallaxScene } from "@/components/experience/hero-parallax-scene";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type CinematicHeroProps = {
  copy: Copy;
  locale: Locale;
};

export function CinematicHero({ copy, locale }: CinematicHeroProps) {
  return (
    <section id="top" data-section className="ix-hero ix-hero-overhaul">
      <div className="ix-hero-stage">
        <HeroParallaxScene />
        <div className="ix-hero-light" aria-hidden="true" />
        <div className="ix-hero-ink" aria-hidden="true" />
        <div className="ix-kanji-ghost ix-kanji-hero" data-scroll-kanji aria-hidden="true">
          月蝕
        </div>

        <div className="ix-hero-copy ix-hero-copy-overhaul" data-hero-copy>
          <p className="ix-eyebrow" data-reveal>
            <b>月母</b> {copy.hero.eyebrow}
          </p>
          <h1>
            <JpRevealText jp={copy.hero.titleJp} text={copy.hero.title} locale={locale} />
          </h1>
          <p className="ix-hero-body" data-reveal>
            {copy.hero.body}
          </p>
          <div className="ix-hero-signature" data-reveal>
            <span>AKARI NO REI</span>
            <i />
            <span>九つの国</span>
          </div>
        </div>

        <div className="ix-hero-logo ix-hero-logo-overhaul" data-hero-logo>
          <Image
            src="/assets_hq/logotipo.png"
            alt="Tsukihara"
            width={520}
            height={293}
            priority
          />
        </div>

        <div className="ix-hero-word ix-hero-word-overhaul" data-hero-word aria-hidden="true">
          TSUKIHARA
        </div>
        <div className="ix-hero-jp" aria-hidden="true">
          {copy.hero.vertical}
        </div>
        <a href="#gate" className="ix-scroll-cue ix-scroll-cue-overhaul" data-reveal>
          <span>{copy.hero.cue}</span>
          <i />
        </a>
      </div>
    </section>
  );
}
