"use client";

import { useRef } from "react";
import { KintsugiAssetSlot } from "@/components/experience/kintsugi-lunar/asset-slot";
import { useKintsugiLunarTimeline } from "@/components/experience/kintsugi-lunar/use-kintsugi-lunar-timeline";
import { kintsugiLunarCopy, type KintsugiLocale } from "@/content/kintsugi-lunar";

type KintsugiLunarChapterProps = {
  locale: KintsugiLocale;
};

const FRACTURES = [
  "M4 78 C17 70 18 50 31 48 C42 45 43 24 55 22 C66 20 70 33 82 27 C91 22 95 11 100 5",
  "M1 30 C18 33 22 45 35 42 C47 39 53 52 61 64 C68 74 81 76 99 69",
  "M18 4 C22 17 35 22 34 34 C33 47 44 52 55 55 C69 59 72 74 79 97",
  "M64 1 C60 17 62 27 70 36 C80 46 82 58 78 69 C73 82 84 88 96 95",
] as const;

export function KintsugiLunarChapter({ locale }: KintsugiLunarChapterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = kintsugiLunarCopy[locale];
  useKintsugiLunarTimeline(rootRef);

  return (
    <section ref={rootRef} id="kintsugi-lunar" data-section className="ix-kl-chapter">
      <div className="ix-kl-desktop" data-kl-stage>
        <div className="ix-kl-stage">
          <div className="ix-kl-environment" aria-hidden="true">
            <KintsugiAssetSlot code="K07" className="ix-kl-environment__broken" sizes="100vw" />
            <KintsugiAssetSlot code="K08" className="ix-kl-environment__restored" sizes="100vw" />
            <div className="ix-kl-environment__veil" />
          </div>

          <KintsugiAssetSlot code="K14" className="ix-kl-moon" sizes="42vw" />
          <KintsugiAssetSlot code="K06" className="ix-kl-energy" sizes="100vw" />
          <KintsugiAssetSlot code="K15" className="ix-kl-fragment ix-kl-fragment--left" sizes="28vw" />
          <KintsugiAssetSlot code="K15" className="ix-kl-fragment ix-kl-fragment--right" sizes="24vw" />

          <svg
            className="ix-kl-fracture"
            data-kl-fracture
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {FRACTURES.map((path) => (
              <path key={path} d={path} pathLength="1" />
            ))}
          </svg>

          <div className="ix-kl-character" aria-hidden="true">
            <KintsugiAssetSlot code="K01" className="ix-kl-character__state ix-kl-character__state--standard" sizes="48vw" />
            <KintsugiAssetSlot code="K02" className="ix-kl-character__state ix-kl-character__state--kintsugi" sizes="48vw" />
            <KintsugiAssetSlot code="K13" className="ix-kl-character__state ix-kl-character__state--climax" sizes="52vw" />
          </div>

          <div className="ix-kl-relic-art" aria-hidden="true">
            {copy.relics.map((relic) => (
              <KintsugiAssetSlot
                key={relic.label}
                code={relic.asset}
                className="ix-kl-relic-art__item"
                sizes="34vw"
              />
            )).map((node, index) => (
              <div key={index} data-kl-relic-art className="ix-kl-relic-art__frame">
                {node}
              </div>
            ))}
          </div>

          <div className="ix-kl-gameplay-art" aria-hidden="true">
            {copy.gameplay.pillars.map((pillar, index) => (
              <div key={pillar.title} data-kl-gameplay-art className="ix-kl-gameplay-art__frame">
                <KintsugiAssetSlot code={pillar.asset} className="ix-kl-gameplay-art__image" sizes="64vw" />
                <span>0{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="ix-kl-copy-plane">
            <article data-kl-copy="opening" className="ix-kl-copy ix-kl-copy--opening">
              <p className="ix-kl-eyebrow">{copy.eyebrow}</p>
              <h2>{copy.opening.title}</h2>
              <div className="ix-kl-copy__body">
                {copy.opening.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <article data-kl-copy="awakening" className="ix-kl-copy ix-kl-copy--awakening">
              <p className="ix-kl-eyebrow">02 — AWAKENING</p>
              <h3>
                {copy.awakening.lead.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>{copy.awakening.body}</p>
            </article>

            <article data-kl-copy="transformation" className="ix-kl-copy ix-kl-copy--transformation">
              <p className="ix-kl-eyebrow">03 — TRANSFORMATION</p>
              <h3>{copy.transformation.first}</h3>
              <p>{copy.transformation.second}</p>
            </article>

            <article data-kl-copy="complete" className="ix-kl-copy ix-kl-copy--complete">
              <p className="ix-kl-eyebrow">{copy.transformation.completeLabel}</p>
              <h3>{copy.transformation.completeTitle}</h3>
              <div>
                {copy.transformation.completeBody.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </article>

            <div className="ix-kl-relic-copy-group">
              {copy.relics.map((relic, index) => (
                <article key={relic.label} data-kl-relic className="ix-kl-copy ix-kl-copy--relic">
                  <p className="ix-kl-eyebrow">{copy.relicsEyebrow}</p>
                  <small>{relic.label}</small>
                  <h3>{relic.title}</h3>
                  <p>{relic.copy}</p>
                  <strong>{relic.microcopy}</strong>
                  <em>0{index + 1} / 03</em>
                </article>
              ))}
            </div>

            <div className="ix-kl-gameplay-copy-group">
              {copy.gameplay.pillars.map((pillar, index) => (
                <article key={pillar.title} data-kl-gameplay className="ix-kl-copy ix-kl-copy--gameplay">
                  <p className="ix-kl-eyebrow">{copy.gameplay.eyebrow}</p>
                  <small>0{index + 1} / 04</small>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                  <div className="ix-kl-gameplay-context" aria-hidden="true">
                    {copy.gameplay.pillars.map((item, contextIndex) => (
                      <span key={item.title} className={contextIndex === index ? "is-active" : ""}>
                        {item.title}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <article data-kl-copy="risk" className="ix-kl-copy ix-kl-copy--risk">
              <p className="ix-kl-eyebrow">{copy.risk.eyebrow}</p>
              <h3>{copy.risk.title}</h3>
              <p>{copy.risk.body}</p>
              <div className="ix-kl-cost-meter" aria-hidden="true">
                <i />
                <span>MEMORY / SELF</span>
              </div>
            </article>

            <article data-kl-copy="climax" className="ix-kl-copy ix-kl-copy--climax">
              <p className="ix-kl-eyebrow">KINTSUGI LUNAR — FULL STATE</p>
              <h3>
                {copy.climax.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>{copy.climax.body}</p>
            </article>

            <article data-kl-copy="closing" className="ix-kl-copy ix-kl-copy--closing">
              <h3>{copy.closing.title}</h3>
              <p>{copy.closing.body}</p>
              <div>
                <strong>{copy.closing.signature}</strong>
                <em>{copy.closing.tagline}</em>
              </div>
            </article>
          </div>

          <div className="ix-kl-progress" aria-hidden="true">
            <span>01</span>
            <i><b data-kl-progress /></i>
            <span>06</span>
          </div>

          <div data-kl-exit-seam className="ix-kl-exit-seam" aria-hidden="true" />
        </div>
      </div>

      <div className="ix-kl-mobile">
        <header className="ix-kl-mobile__opening">
          <p className="ix-kl-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.opening.title}</h2>
          {copy.opening.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="ix-kl-mobile__scene ix-kl-mobile__scene--rupture">
            <KintsugiAssetSlot code="K07" sizes="100vw" />
            <KintsugiAssetSlot code="K05" sizes="100vw" />
          </div>
        </header>

        <section className="ix-kl-mobile__beat">
          <p className="ix-kl-eyebrow">02 — AWAKENING</p>
          <h3>{copy.awakening.lead[0]}<br />{copy.awakening.lead[1]}</h3>
          <p>{copy.awakening.body}</p>
          <div className="ix-kl-mobile__restore">
            <KintsugiAssetSlot code="K07" sizes="100vw" />
            <KintsugiAssetSlot code="K08" sizes="100vw" />
          </div>
        </section>

        <section className="ix-kl-mobile__beat ix-kl-mobile__transformation">
          <p className="ix-kl-eyebrow">03 — TRANSFORMATION</p>
          <h3>{copy.transformation.first}</h3>
          <p>{copy.transformation.second}</p>
          <div className="ix-kl-mobile__akari-stack">
            <KintsugiAssetSlot code="K01" sizes="94vw" />
            <KintsugiAssetSlot code="K02" sizes="94vw" />
          </div>
          <h4>{copy.transformation.completeTitle}</h4>
        </section>

        <section className="ix-kl-mobile__beat">
          <p className="ix-kl-eyebrow">{copy.relicsEyebrow}</p>
          <div className="ix-kl-mobile__relics">
            {copy.relics.map((relic) => (
              <article key={relic.label}>
                <KintsugiAssetSlot code={relic.asset} sizes="86vw" />
                <small>{relic.label}</small>
                <h3>{relic.title}</h3>
                <p>{relic.copy}</p>
                <strong>{relic.microcopy}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="ix-kl-mobile__beat">
          <p className="ix-kl-eyebrow">{copy.gameplay.eyebrow}</p>
          <h3>{copy.gameplay.title}</h3>
          <div className="ix-kl-mobile__gameplay">
            {copy.gameplay.pillars.map((pillar, index) => (
              <article key={pillar.title}>
                <KintsugiAssetSlot code={pillar.asset} sizes="100vw" />
                <small>0{index + 1}</small>
                <h4>{pillar.title}</h4>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ix-kl-mobile__beat ix-kl-mobile__risk">
          <p className="ix-kl-eyebrow">{copy.risk.eyebrow}</p>
          <h3>{copy.risk.title}</h3>
          <p>{copy.risk.body}</p>
        </section>

        <section className="ix-kl-mobile__climax">
          <KintsugiAssetSlot code="K14" sizes="90vw" />
          <KintsugiAssetSlot code="K13" sizes="94vw" />
          <div>
            <h3>{copy.climax.lines[0]}<br />{copy.climax.lines[1]}</h3>
            <p>{copy.climax.body}</p>
          </div>
        </section>

        <footer className="ix-kl-mobile__closing">
          <h3>{copy.closing.title}</h3>
          <p>{copy.closing.body}</p>
          <span />
          <strong>{copy.closing.signature}</strong>
          <em>{copy.closing.tagline}</em>
        </footer>
      </div>
    </section>
  );
}
