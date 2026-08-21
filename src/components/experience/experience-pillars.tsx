import Image from "next/image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type ExperiencePillarsProps = {
  copy: Copy;
  locale: Locale;
};

const pillarAssets = [
  "/secret-pathways-assets/foreground/png/temple-wall.webp",
  "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  "/secret-pathways-assets/foreground/png/garden-bush.webp",
  "/secret-pathways-assets/foreground/png/maple-leaves.webp",
  "/secret-pathways-assets/foreground/png/tall-grass.webp",
] as const;

export function ExperiencePillars({ copy, locale }: ExperiencePillarsProps) {
  return (
    <section id="lore" data-section className="ix-pillars">
      <div className="ix-pillars-head">
        <div className="ix-section-label">
          <span>{copy.lore.label}</span>
          <i />
          <span>遊戯</span>
        </div>
        <h2>
          <JpRevealText jp={copy.lore.titleJp} text={copy.lore.title} locale={locale} />
        </h2>
        <p data-reveal>{copy.lore.intro}</p>
      </div>

      <div className="ix-pillars-list">
        {copy.lore.items.map(([index, title, kanji, body], itemIndex) => (
          <article key={title} className="ix-pillar" data-pillar data-reveal>
            <div className="ix-pillar-index">
              <span>{index}</span>
              <i />
            </div>
            <div className="ix-pillar-title">
              <small lang="ja">{kanji}</small>
              <h3>{title}</h3>
            </div>
            <p>{body}</p>
            <Image
              src={pillarAssets[itemIndex]}
              alt=""
              width={420}
              height={420}
              className="ix-pillar-asset"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
