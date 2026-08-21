import Image from "next/image";
import Link from "next/link";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type CinematicEpilogueProps = {
  copy: Copy;
  locale: Locale;
};

export function CinematicEpilogue({ copy, locale }: CinematicEpilogueProps) {
  return (
    <section id="eclipse" data-section className="ix-epilogue">
      <div className="ix-epilogue-moon" aria-hidden="true">
        <Image
          src="/assets_hq/Blood_Moon.png"
          alt=""
          fill
          sizes="48vw"
          className="object-contain"
        />
      </div>
      <Image
        src="/secret-pathways-assets/foreground/png/sakura-branch.webp"
        alt=""
        width={920}
        height={920}
        className="ix-epilogue-branch"
        aria-hidden="true"
      />
      <div className="ix-epilogue-kanji" data-scroll-kanji aria-hidden="true">
        記憶
      </div>

      <div className="ix-epilogue-copy">
        <p className="ix-eyebrow" data-reveal>
          {copy.eclipse.label}
        </p>
        <h2>
          <JpRevealText jp={copy.eclipse.titleJp} text={copy.eclipse.title} locale={locale} />
        </h2>
        <p data-reveal>{copy.eclipse.body}</p>
        <div className="ix-epilogue-signature" data-reveal>
          <span>TSUKIHARA</span>
          <i />
          <span>ECLIPSE OF THE NINE REALMS</span>
        </div>
      </div>

      <div className="ix-epilogue-akari" aria-hidden="true">
        <Image
          src="/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png"
          alt=""
          fill
          sizes="(max-width: 760px) 84vw, 38vw"
          className="object-contain object-bottom"
        />
      </div>

      <footer className="ix-epilogue-footer">
        <div>
          <span>{copy.eclipse.development}</span>
          <small>© 2026 TSUKIHARA</small>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="#gate">KINTSUGI</Link>
          <Link href="#realms">REALMS</Link>
          <Link href="#akari">AKARI</Link>
          <Link href="#top">↑ TOP</Link>
        </nav>
      </footer>
    </section>
  );
}
