"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CompanionsAtmosphere,
  type CompanionAtmosphereMode,
} from "@/components/experience/companions-atmosphere";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import {
  companionAssets,
  companionsCopy,
  type CompanionContent,
  type CompanionId,
} from "@/content/companions";
import type { Locale } from "@/content/immersive-copy";

type CompanionState = "base" | CompanionId;

function CompanionPanel({ companion, locale }: { companion: CompanionContent; locale: Locale }) {
  return (
    <div className="ix-companions-panel__inner">
      <div className="ix-companions-panel__meta">
        <span>{companion.role}</span>
        <i aria-hidden="true" />
        <small lang="ja">{companion.jp}</small>
      </div>
      <h3>
        <JpRevealText jp={companion.jp} text={companion.title} locale={locale} duration={920} />
      </h3>
      <div className="ix-companions-panel__body">
        {companion.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="ix-companions-panel__tags" aria-label={`${companion.label} traits`}>
        {companion.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <strong>{companion.microcopy}</strong>
    </div>
  );
}

export function CompanionsChapter({ locale }: { locale: Locale }) {
  const copy = companionsCopy[locale];
  const [selected, setSelected] = useState<CompanionState>("base");
  const [preview, setPreview] = useState<CompanionId | null>(null);
  const [mobileSelected, setMobileSelected] = useState<CompanionId>("haku");
  const active = preview ?? selected;
  const activeCompanion = active === "base" ? null : copy.companions[active];
  const mobileCompanion = copy.companions[mobileSelected];
  const atmosphereMode: CompanionAtmosphereMode = active;

  const sectionClassName = useMemo(() => `ix-companions is-${active}`, [active]);

  const selectCompanion = (id: CompanionId) => {
    setSelected(id);
    setPreview(null);
  };

  return (
    <section id="companions" data-section className={sectionClassName}>
      <CompanionsAtmosphere mode={atmosphereMode} />
      <div className="ix-companions__orbital-field" aria-hidden="true">
        <i className="ix-companions__orbit ix-companions__orbit--outer" />
        <i className="ix-companions__orbit ix-companions__orbit--inner" />
        <i className="ix-companions__moon-mark" />
      </div>

      <div className="ix-companions__intro" data-reveal>
        <span className="ix-companions__eyebrow">{copy.eyebrow}</span>
        <h2>
          <JpRevealText jp={copy.introJp} text={copy.introTitle} locale={locale} duration={1100} />
        </h2>
        <div className="ix-companions__intro-copy">
          {copy.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="ix-companions__desktop" aria-label={copy.prompt}>
        <div className="ix-companions__visual-hub">
          <div className="ix-companions__halo ix-companions__halo--haku" aria-hidden="true" />
          <div className="ix-companions__halo ix-companions__halo--mochi" aria-hidden="true" />

          <div className="ix-companions__group" aria-hidden={active !== "base"}>
            <Image
              src={companionAssets.group}
              alt="Akari with Haku and Mochi"
              fill
              sizes="(max-width: 900px) 92vw, 54vw"
              className="ix-companions__group-image"
            />
          </div>

          {(["haku", "mochi"] as const).map((id) => {
            const companion = copy.companions[id];
            return (
              <div
                key={id}
                className={`ix-companions__focus-figure ix-companions__focus-figure--${id}`}
              >
                <Image
                  src={companion.character}
                  alt={companion.label}
                  fill
                  sizes="(max-width: 900px) 75vw, 34vw"
                  className="ix-companions__character-image"
                />
              </div>
            );
          })}

          <button
            type="button"
            className="ix-companions-target ix-companions-target--haku"
            aria-pressed={selected === "haku"}
            aria-label={`${copy.prompt}: Haku`}
            onMouseEnter={() => setPreview("haku")}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview("haku")}
            onBlur={() => setPreview(null)}
            onClick={() => selectCompanion("haku")}
          >
            <span>HAKU</span>
            <small>{copy.companions.haku.role}</small>
          </button>

          <button
            type="button"
            className="ix-companions-target ix-companions-target--mochi"
            aria-pressed={selected === "mochi"}
            aria-label={`${copy.prompt}: Mochi`}
            onMouseEnter={() => setPreview("mochi")}
            onMouseLeave={() => setPreview(null)}
            onFocus={() => setPreview("mochi")}
            onBlur={() => setPreview(null)}
            onClick={() => selectCompanion("mochi")}
          >
            <span>MOCHI</span>
            <small>{copy.companions.mochi.role}</small>
          </button>

          <div className="ix-companions__visual-label" aria-hidden="true">
            <span>{copy.prompt}</span>
            <i />
          </div>
        </div>

        <div className="ix-companions__scene-stage" aria-live="polite">
          {(["haku", "mochi"] as const).map((id) => {
            const companion = copy.companions[id];
            return (
              <div key={id} className={`ix-companions__scene ix-companions__scene--${id}`}>
                <Image
                  src={companion.keyVisual}
                  alt=""
                  fill
                  sizes="46vw"
                  className="ix-companions__scene-image"
                />
                <div className="ix-companions__scene-veil" />
              </div>
            );
          })}
          <div className="ix-companions-panel">
            {activeCompanion ? (
              <CompanionPanel companion={activeCompanion} locale={locale} />
            ) : (
              <div className="ix-companions-panel__base">
                <span>{copy.prompt}</span>
                <p>{copy.introBody[1]}</p>
                <div>
                  <small>01 — HAKU</small>
                  <small>02 — MOCHI</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ix-companions__mobile">
        <div className="ix-companions-mobile__group" data-reveal>
          <Image
            src={companionAssets.group}
            alt="Akari with Haku and Mochi"
            fill
            sizes="92vw"
            className="ix-companions__group-image"
          />
        </div>

        <div className="ix-companions-mobile__tabs" role="tablist" aria-label={copy.prompt}>
          {(["haku", "mochi"] as const).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mobileSelected === id}
              className={mobileSelected === id ? "is-active" : ""}
              onClick={() => setMobileSelected(id)}
            >
              <span>{copy.companions[id].label}</span>
              <small>{copy.companions[id].role}</small>
            </button>
          ))}
        </div>

        <div className="ix-companions-mobile__content" role="tabpanel">
          <div className="ix-companions-mobile__visual">
            <Image
              src={mobileCompanion.keyVisual}
              alt=""
              fill
              sizes="92vw"
              className="ix-companions__scene-image"
            />
            <Image
              src={mobileCompanion.character}
              alt={mobileCompanion.label}
              fill
              sizes="70vw"
              className={`ix-companions-mobile__character is-${mobileSelected}`}
            />
          </div>
          <CompanionPanel companion={mobileCompanion} locale={locale} />
        </div>
      </div>

      <div className="ix-companions__closing">
        <div className="ix-companions__closing-visual" aria-hidden="true">
          <Image
            src={companionAssets.closing}
            alt=""
            fill
            sizes="100vw"
            className="ix-companions__closing-image"
          />
          <div />
        </div>
        <div className="ix-companions__closing-copy" data-reveal>
          <span>{copy.eyebrow}</span>
          <h3>
            <JpRevealText
              jp={copy.closingJp}
              text={copy.closingTitle}
              locale={locale}
              duration={1100}
            />
          </h3>
          {copy.closingBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <strong>{copy.closingEmphasis}</strong>
        </div>
      </div>
    </section>
  );
}
