import Image from "next/image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type TrailerChapterProps = {
  copy: Copy;
  locale: Locale;
};

export function TrailerChapter({ copy, locale }: TrailerChapterProps) {
  return (
    <section className="ix-trailer-overhaul" aria-labelledby="trailer-title">
      <div className="ix-trailer-overhaul-head">
        <div>
          <p className="ix-eyebrow" data-reveal>
            {copy.trailer.label}
          </p>
          <h2 id="trailer-title">
            <JpRevealText jp={copy.trailer.titleJp} text={copy.trailer.title} locale={locale} />
          </h2>
        </div>
        <p data-reveal>{copy.trailer.body}</p>
      </div>

      <div className="ix-trailer-canvas" data-trailer-stage>
        <div className="ix-trailer-veil" data-trailer-veil aria-hidden="true" />
        <video autoPlay muted loop playsInline preload="metadata" data-trailer-video>
          <source src="/assets_hq/video_battle.mp4" type="video/mp4" />
        </video>
        <div className="ix-trailer-frame-lines" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="ix-trailer-caption" aria-hidden="true">
          <span>2.5D</span>
          <strong>剣舞</strong>
          <span>ACTION · EXPLORATION</span>
        </div>
        <Image
          src="/secret-pathways-assets/foreground/png/shrine-ruins.webp"
          alt=""
          width={760}
          height={500}
          className="ix-trailer-ruins"
          aria-hidden="true"
        />
        <Image
          src="/secret-pathways-assets/foreground/png/basalt-stones.webp"
          alt=""
          width={900}
          height={420}
          className="ix-trailer-stones"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
