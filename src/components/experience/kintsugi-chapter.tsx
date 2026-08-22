"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

const Warp = dynamic(() => import("@paper-design/shaders-react").then((module) => module.Warp), {
  ssr: false,
});

type Copy = (typeof immersiveCopy)[Locale];

type KintsugiChapterProps = {
  copy: Copy;
  locale: Locale;
};

export function KintsugiChapter({ copy, locale }: KintsugiChapterProps) {
  return (
    <section id="gate" data-section className="ix-kintsugi">
      <div className="ix-kintsugi-stage" data-kintsugi-stage>
        <div className="ix-kintsugi-scene" aria-hidden="true">
          <Image
            src="/assets_hq/templo-hanamori_2.png"
            alt=""
            fill
            sizes="100vw"
            className="ix-kintsugi-forgotten"
          />
          <div className="ix-kintsugi-restored" data-kintsugi-restored>
            <Image
              src="/assets_hq/templo-hanamori.png"
              alt=""
              fill
              sizes="100vw"
              className="ix-kintsugi-restored-image"
            />
          </div>
          <div className="ix-kintsugi-seam" data-kintsugi-seam>
            <div className="ix-kintsugi-warp">
              <Warp
                width="100%"
                height="100%"
                colors={["#2a0509", "#a72e38", "#f2c7a4", "#65131d"]}
                proportion={0.42}
                softness={0.8}
                distortion={0.42}
                swirl={0.32}
                swirlIterations={5}
                shape="edge"
                shapeScale={0.18}
                speed={0.18}
                maxPixelCount={650000}
                minPixelRatio={1}
              />
            </div>
          </div>
          <Image
            src="/secret-pathways-assets/foreground/png/stone-lantern.webp"
            alt=""
            width={420}
            height={620}
            className="ix-kintsugi-lantern"
          />
          <Image
            src="/secret-pathways-assets/foreground/png/tall-grass.webp"
            alt=""
            width={940}
            height={540}
            className="ix-kintsugi-grass"
          />
        </div>

        <div className="ix-kintsugi-entry-veil" data-kintsugi-entry-veil aria-hidden="true">
          <Image src="/ruptura-separador.png" alt="" fill sizes="112vw" />
        </div>

        <div className="ix-kintsugi-copy">
          <div className="ix-section-label">
            <span>{copy.threshold.label}</span>
            <i />
            <span>月継</span>
          </div>
          <h2>
            <JpRevealText jp={copy.threshold.titleJp} text={copy.threshold.title} locale={locale} />
          </h2>
          <p data-reveal>{copy.threshold.body}</p>
          <div className="ix-kintsugi-choice" data-reveal>
            <span>RESTORE</span>
            <i />
            <span>REMEMBER</span>
          </div>
        </div>

        <div className="ix-kintsugi-progress" aria-hidden="true">
          <span>忘</span>
          <i data-kintsugi-line />
          <span>憶</span>
        </div>
      </div>
    </section>
  );
}
