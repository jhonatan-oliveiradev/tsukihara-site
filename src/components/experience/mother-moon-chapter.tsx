"use client";

import { useRef } from "react";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { MotherMoonAsset } from "@/components/experience/mother-moon/mother-moon-asset";
import { MotherMoonMemoryField } from "@/components/experience/mother-moon/mother-moon-memory-field";
import { useMotherMoonFragmentDrag } from "@/components/experience/mother-moon/use-mother-moon-fragment-drag";
import { useMotherMoonMotion } from "@/components/experience/mother-moon/use-mother-moon-motion";
import { motherMoonCopy } from "@/content/mother-moon";
import type { Locale } from "@/content/immersive-copy";

function MotionWords({ text }: { text: string }) {
  return (
    <span className="ix-mm-motion-words" aria-label={text}>
      {text.split(/\s+/).map((word, index) => (
        <span key={`${word}-${index}`} className="ix-mm-motion-word-wrap" aria-hidden="true">
          <span className="ix-mm-motion-word" data-mm-word>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

export function MotherMoonChapter({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = motherMoonCopy[locale];
  useMotherMoonMotion(rootRef);
  useMotherMoonFragmentDrag(rootRef);

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
        <div className="ix-mm-opening__copy">
          <span className="ix-mm-eyebrow" data-mm-eyebrow>
            {copy.opening.eyebrow}
          </span>
          <h2 id="mother-moon-title" data-mm-title-block>
            <JpRevealText
              jp={copy.opening.jp}
              text={copy.opening.title}
              locale={locale}
              duration={1300}
            />
          </h2>
          <div className="ix-mm-body" data-mm-body>
            {copy.opening.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="ix-mm-opening__fragments" aria-label="Memory fragments">
            {copy.opening.fragments.map((fragment) => (
              <span key={fragment} data-mm-token>
                {fragment}
              </span>
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

        <div className="ix-mm-opening__axioms">
          {copy.opening.memories
            .filter((memory) => memory.weight === "phrase")
            .map((memory) => (
              <p key={memory.id} data-mm-axiom>
                {memory.text}
              </p>
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

        <div className="ix-mm-forgetting__copy">
          <span className="ix-mm-eyebrow" data-mm-eyebrow>
            {copy.forgetting.eyebrow}
          </span>
          <h2 data-mm-title>
            <MotionWords text={copy.forgetting.title} />
          </h2>
          <strong data-mm-subtitle>{copy.forgetting.titleSecond}</strong>
          <div className="ix-mm-body" data-mm-body>
            {copy.forgetting.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <MotherMoonMemoryField memories={copy.forgetting.memories} unstable />
      </section>

      <section className="ix-mm-presence" data-mm-act="03">
        <div className="ix-mm-presence__intro">
          <span className="ix-mm-eyebrow" data-mm-eyebrow>
            {copy.presence.eyebrow}
          </span>
          <h2 data-mm-title>
            <MotionWords text={copy.presence.title} />
          </h2>
          <div className="ix-mm-body" data-mm-body>
            {copy.presence.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="ix-mm-presence__gallery" data-mm-presence-gallery aria-hidden="true">
          <figure className="ix-mm-presence__silhouette" data-mm-presence-detail>
            <div className="ix-mm-presence__drag-layer" data-mm-fragment-drag>
              <MotherMoonAsset code="M04" className="ix-mm-image ix-mm-image--presence" />
            </div>
          </figure>
          <figure className="ix-mm-presence__hand" data-mm-presence-detail>
            <div className="ix-mm-presence__drag-layer" data-mm-fragment-drag>
              <MotherMoonAsset code="M06" className="ix-mm-image ix-mm-image--presence" />
            </div>
          </figure>
          <figure className="ix-mm-presence__eye" data-mm-presence-detail>
            <div className="ix-mm-presence__drag-layer" data-mm-fragment-drag>
              <MotherMoonAsset code="M05" className="ix-mm-image ix-mm-image--presence" />
            </div>
          </figure>
          <figure className="ix-mm-presence__profile" data-mm-presence-detail>
            <div className="ix-mm-presence__drag-layer" data-mm-fragment-drag>
              <MotherMoonAsset code="M07" className="ix-mm-image ix-mm-image--presence" />
            </div>
          </figure>
        </div>

        <div className="ix-mm-presence__identity" data-mm-identity>
          <span>{copy.presence.name}</span>
          <small>{copy.presence.signature}</small>
        </div>

        <div className="ix-mm-quote ix-mm-quote--tsukino" data-mm-quote="tsukino">
          <div className="ix-mm-quote__branch" data-mm-tsukino-branch aria-hidden="true" />
          <blockquote>
            <MotionWords text={`“${copy.presence.quote}”`} />
          </blockquote>
          <span aria-hidden="true">月蝕</span>
        </div>

        <div className="ix-mm-quote ix-mm-quote--akari" data-mm-quote="akari">
          <div className="ix-mm-quote__tsukino-echo" data-mm-tsukino-echo aria-hidden="true">
            <MotherMoonAsset
              code="M07"
              className="ix-mm-image ix-mm-image--tsukino-echo"
              sizes="(min-width: 901px) 56vw, 0px"
            />
          </div>

          <blockquote>
            <MotionWords text={`“${copy.presence.counterpoint}”`} />
          </blockquote>
        </div>
      </section>

      <section className="ix-mm-philosophy" data-mm-act="04" data-mm-philosophy>
        <header className="ix-mm-philosophy__intro">
          <span className="ix-mm-eyebrow" data-mm-eyebrow>
            {copy.philosophy.eyebrow}
          </span>
          <h2 data-mm-title>
            <MotionWords text={copy.philosophy.title} />
          </h2>
        </header>

        <div className="ix-mm-philosophy__balance">
          <div
            className="ix-mm-philosophy__side ix-mm-philosophy__side--forget"
            data-mm-side="forget"
          >
            <h3 data-mm-side-title>
              <MotionWords text={copy.philosophy.forget} />
            </h3>
            <ul>
              {copy.philosophy.forgetTerms.map((term) => (
                <li key={term} data-mm-term>
                  {term}
                </li>
              ))}
            </ul>
          </div>

          <div className="ix-mm-philosophy__divider" data-mm-divider aria-hidden="true">
            <MotherMoonAsset code="M09" className="ix-mm-image ix-mm-image--divider" />
            <i />
          </div>

          <div
            className="ix-mm-philosophy__side ix-mm-philosophy__side--remember"
            data-mm-side="remember"
          >
            <h3 data-mm-side-title>
              <MotionWords text={copy.philosophy.remember} />
            </h3>
            <ul>
              {copy.philosophy.rememberTerms.map((term) => (
                <li key={term} data-mm-term>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ix-mm-philosophy__body ix-mm-body" data-mm-body>
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

        <div className="ix-mm-closing__copy">
          {copy.closing.lines.map((line) => (
            <p key={line} data-mm-closing-line>
              {line}
            </p>
          ))}
          <h2 data-mm-closing-signature>
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
