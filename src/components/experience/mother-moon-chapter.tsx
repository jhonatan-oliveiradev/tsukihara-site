"use client";

import { useRef } from "react";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { MotherMoonAsset } from "@/components/experience/mother-moon/mother-moon-asset";
import { MotherMoonMemoryField } from "@/components/experience/mother-moon/mother-moon-memory-field";
import { useMotherMoonMotion } from "@/components/experience/mother-moon/use-mother-moon-motion";
import { motherMoonCopy } from "@/content/mother-moon";
import type { Locale } from "@/content/immersive-copy";

export function MotherMoonChapter({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = motherMoonCopy[locale];
  useMotherMoonMotion(rootRef);

  return (
    <section
      id="mother-moon"
      ref={rootRef}
      className="ix-mm"
      data-section
      aria-labelledby="mother-moon-title"
    >
      <div className="ix-mm__atmosphere" aria-hidden="true" />

      <section className="ix-mm-opening" data-mm-act="01">
        <div className="ix-mm-opening__copy" data-mm-reveal>
          <span className="ix-mm-eyebrow">{copy.opening.eyebrow}</span>
          <h2 id="mother-moon-title">
            <JpRevealText
              jp={copy.opening.jp}
              text={copy.opening.title}
              locale={locale}
              duration={1300}
            />
          </h2>
          <div className="ix-mm-body">
            {copy.opening.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="ix-mm-opening__fragments" aria-label="Memory fragments">
            {copy.opening.fragments.map((fragment) => (
              <span key={fragment}>{fragment}</span>
            ))}
          </div>
        </div>

        <div className="ix-mm-opening__cosmos" aria-hidden="true">
          <div className="ix-mm-opening__halo" />
          <div className="ix-mm-opening__moon" data-mm-moon>
            <MotherMoonAsset code="M01" className="ix-mm-image ix-mm-image--moon" priority />
          </div>
          <div className="ix-mm-opening__fragments-overlay">
            <MotherMoonAsset code="M03" className="ix-mm-image ix-mm-image--fragments" />
          </div>
          <div className="ix-mm-opening__reflection">
            <MotherMoonAsset code="M08" className="ix-mm-image ix-mm-image--reflection" />
          </div>
        </div>

        <MotherMoonMemoryField memories={copy.opening.memories} />

        <div className="ix-mm-opening__axioms" data-mm-reveal>
          {copy.opening.memories
            .filter((memory) => memory.weight === "phrase")
            .map((memory) => (
              <p key={memory.id}>{memory.text}</p>
            ))}
        </div>
      </section>

      <section className="ix-mm-forgetting" data-mm-act="02" data-mm-forgetting>
        <div className="ix-mm-forgetting__stage" aria-hidden="true">
          <div className="ix-mm-forgetting__moon ix-mm-forgetting__moon--remembered">
            <MotherMoonAsset code="M01" className="ix-mm-image ix-mm-image--moon" />
          </div>
          <div
            className="ix-mm-forgetting__moon ix-mm-forgetting__moon--lost"
            data-mm-forgetting-layer
          >
            <MotherMoonAsset code="M02" className="ix-mm-image ix-mm-image--moon" />
          </div>
          <div className="ix-mm-forgetting__fragments">
            <MotherMoonAsset code="M03" className="ix-mm-image ix-mm-image--fragments" />
          </div>
          <div className="ix-mm-forgetting__shadow" />
        </div>

        <div className="ix-mm-forgetting__copy" data-mm-reveal>
          <span className="ix-mm-eyebrow">{copy.forgetting.eyebrow}</span>
          <h2>{copy.forgetting.title}</h2>
          <strong>{copy.forgetting.titleSecond}</strong>
          <div className="ix-mm-body">
            {copy.forgetting.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <MotherMoonMemoryField memories={copy.forgetting.memories} unstable />
      </section>

      <section className="ix-mm-presence" data-mm-act="03">
        <div className="ix-mm-presence__intro" data-mm-reveal>
          <span className="ix-mm-eyebrow">{copy.presence.eyebrow}</span>
          <h2>{copy.presence.title}</h2>
          <div className="ix-mm-body">
            {copy.presence.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="ix-mm-presence__gallery" aria-hidden="true">
          <figure className="ix-mm-presence__silhouette" data-mm-presence-detail>
            <MotherMoonAsset code="M04" className="ix-mm-image ix-mm-image--presence" />
          </figure>
          <figure className="ix-mm-presence__hand" data-mm-presence-detail>
            <MotherMoonAsset code="M06" className="ix-mm-image ix-mm-image--presence" />
          </figure>
          <figure className="ix-mm-presence__eye" data-mm-presence-detail>
            <MotherMoonAsset code="M05" className="ix-mm-image ix-mm-image--presence" />
          </figure>
          <figure className="ix-mm-presence__profile" data-mm-presence-detail>
            <MotherMoonAsset code="M07" className="ix-mm-image ix-mm-image--presence" />
          </figure>
        </div>

        <div className="ix-mm-presence__identity" data-mm-reveal>
          <span>{copy.presence.name}</span>
          <small>{copy.presence.signature}</small>
        </div>

        <div className="ix-mm-quote ix-mm-quote--tsukino" data-mm-reveal>
          <blockquote>“{copy.presence.quote}”</blockquote>
          <span aria-hidden="true">月蝕</span>
        </div>

        <div className="ix-mm-quote ix-mm-quote--akari" data-mm-reveal>
          <blockquote>“{copy.presence.counterpoint}”</blockquote>
        </div>
      </section>

      <section className="ix-mm-philosophy" data-mm-act="04" data-mm-philosophy>
        <header className="ix-mm-philosophy__intro" data-mm-reveal>
          <span className="ix-mm-eyebrow">{copy.philosophy.eyebrow}</span>
          <h2>{copy.philosophy.title}</h2>
        </header>

        <div className="ix-mm-philosophy__balance">
          <div className="ix-mm-philosophy__side ix-mm-philosophy__side--forget" data-mm-reveal>
            <h3>{copy.philosophy.forget}</h3>
            <ul>
              {copy.philosophy.forgetTerms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>

          <div className="ix-mm-philosophy__divider" data-mm-divider aria-hidden="true">
            <MotherMoonAsset code="M09" className="ix-mm-image ix-mm-image--divider" />
            <i />
          </div>

          <div className="ix-mm-philosophy__side ix-mm-philosophy__side--remember" data-mm-reveal>
            <h3>{copy.philosophy.remember}</h3>
            <ul>
              {copy.philosophy.rememberTerms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ix-mm-philosophy__body ix-mm-body" data-mm-reveal>
          {copy.philosophy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="ix-mm-closing" data-mm-act="05" data-mm-closing>
        <div className="ix-mm-closing__visual" data-mm-closing-visual aria-hidden="true">
          <MotherMoonAsset code="M10" className="ix-mm-image ix-mm-image--closing" />
          <div className="ix-mm-closing__veil" />
        </div>

        <div className="ix-mm-closing__copy" data-mm-reveal>
          {copy.closing.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <h2>
            <JpRevealText
              jp={copy.closing.jp}
              text={copy.closing.signature}
              locale={locale}
              duration={1200}
            />
          </h2>
        </div>

        <div className="ix-mm-closing__archive-seed" aria-hidden="true">
          {copy.closing.archiveSeed.map((item, index) => (
            <span key={item} style={{ "--seed-index": index } as React.CSSProperties}>
              {item}
            </span>
          ))}
        </div>
      </section>
    </section>
  );
}
