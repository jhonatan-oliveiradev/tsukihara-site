import Image from "next/image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { ShaderImage } from "@/components/experience/shader-image";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type CharacterSpotlightProps = {
  copy: Copy;
  locale: Locale;
};

export function CharacterSpotlight({ copy, locale }: CharacterSpotlightProps) {
  return (
    <section id="akari" data-section className="ix-character-spotlight">
      <div className="ix-character-kanji" data-scroll-kanji aria-hidden="true">
        朱莉
      </div>

      <div className="ix-character-stage" data-character-stage>
        <div className="ix-character-echo" aria-hidden="true">
          <ShaderImage
            src="/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png"
            alt=""
            variant="heatmap"
            active
            contain
            sizes="48vw"
          />
        </div>
        <div className="ix-character-main">
          <ShaderImage
            src="/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png"
            alt="Akari no Rei"
            variant="lens"
            contain
            sizes="(max-width: 760px) 92vw, 48vw"
          />
        </div>
        <div className="ix-character-keyframes" aria-hidden="true">
          <Image
            src="/assets_hq/AKARI_STD_IDLE_KEYFRAMES_V01.png"
            alt=""
            fill
            sizes="30vw"
            className="object-contain"
          />
        </div>
        <div className="ix-character-mochi" data-reveal>
          <Image
            src="/assets_hq/mochi.png"
            alt="Mochi"
            fill
            sizes="(max-width: 760px) 26vw, 12vw"
            className="object-contain"
          />
          <span>MOCHI · 猫又</span>
        </div>
      </div>

      <div className="ix-character-copy">
        <p className="ix-eyebrow" data-reveal>
          {copy.akari.eyebrow}
        </p>
        <h2>
          <JpRevealText jp={copy.akari.titleJp} text={copy.akari.title} locale={locale} />
        </h2>
        <p data-reveal>{copy.akari.body}</p>
        <div className="ix-character-specs" data-reveal>
          {copy.akari.specs.map((spec, index) => (
            <div key={spec}>
              <span>0{index + 1}</span>
              <b>{spec}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
