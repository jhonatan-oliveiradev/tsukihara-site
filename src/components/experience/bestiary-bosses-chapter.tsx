"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import {
  bestiaryAssets,
  bestiaryCopy,
  type BossRecord,
  type SpecimenRecord,
} from "@/content/bestiary";
import type { Locale } from "@/content/immersive-copy";

function SpecimenButton({
  specimen,
  index,
  active,
  onActivate,
}: {
  specimen: SpecimenRecord;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      className={`ix-archive-specimen ix-archive-specimen--${index + 1} ${active ? "is-active" : ""}`}
      data-specimen
      data-specimen-id={specimen.id}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-pressed={active}
      aria-label={`${specimen.name}, ${specimen.realm}, ${specimen.type}`}
      style={{ "--entity-accent": specimen.accent } as React.CSSProperties}
    >
      <span className="ix-archive-specimen__image" aria-hidden="true">
        <Image
          src={bestiaryAssets[specimen.asset]}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 34vw"
        />
        <span className="ix-archive-specimen__veil" />
        <span className="ix-archive-specimen__scan" />
      </span>
      <span className="ix-archive-specimen__index">ENTRY {String(index + 1).padStart(2, "0")}</span>
      <span className="ix-archive-specimen__name">{specimen.name}</span>
      <span className="ix-archive-specimen__realm">{specimen.realm}</span>
    </button>
  );
}

function BossStage({ boss, index, locale }: { boss: BossRecord; index: number; locale: Locale }) {
  return (
    <div
      className={`ix-boss-stage ${boss.classified ? "is-classified" : ""}`}
      style={{ "--entity-accent": boss.accent } as React.CSSProperties}
      data-boss-stage
      data-boss-id={boss.id}
    >
      <div className="ix-boss-stage__visual" aria-hidden="true">
        <Image
          key={boss.id}
          src={bestiaryAssets[boss.asset]}
          alt=""
          fill
          sizes="(max-width: 900px) 100vw, 72vw"
          className="ix-boss-stage__image"
        />
        <span className="ix-boss-stage__shade" />
        <span className="ix-boss-stage__light" />
        {boss.classified && (
          <>
            <span className="ix-boss-stage__classified-bars" />
            <span className="ix-boss-stage__classified-stamp">ACCESS DENIED</span>
          </>
        )}
      </div>

      <div className="ix-boss-stage__copy">
        <span className="ix-boss-stage__entry">
          {boss.classified ? "RECORD CLASSIFIED" : `ENTITY ${String(index + 1).padStart(2, "0")}`}
        </span>
        <h3>{boss.name}</h3>
        <div className="ix-boss-stage__meta">
          <span>{boss.realm}</span>
          <i />
          <span>
            {locale === "pt" ? "ASPECTO" : "ASPECT"}: {boss.aspect}
          </span>
        </div>
        <div className="ix-boss-stage__body">
          {boss.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {boss.quote && <blockquote>“{boss.quote}”</blockquote>}
      </div>
    </div>
  );
}

export function BestiaryBossesChapter({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = bestiaryCopy[locale];
  const [activeSpecimenId, setActiveSpecimenId] = useState(copy.specimens[0].id);
  const [activeBossId, setActiveBossId] = useState(copy.bosses[0].id);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    const specimens = Array.from(root.querySelectorAll<HTMLElement>("[data-specimen]"));

    const onPointerMove = (event: PointerEvent) => {
      specimens.forEach((specimen) => {
        const rect = specimen.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        const radius = Math.max(rect.width, rect.height) * 1.12;
        const strength = Math.max(0, Math.min(1, 1 - distance / radius));
        specimen.style.setProperty("--proximity", strength.toFixed(3));
        specimen.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
        specimen.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      });
    };

    const clear = () => {
      specimens.forEach((specimen) => specimen.style.setProperty("--proximity", "0"));
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", clear);
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", clear);
      clear();
    };
  }, []);

  const activeSpecimen = useMemo(
    () => copy.specimens.find((item) => item.id === activeSpecimenId) ?? copy.specimens[0],
    [activeSpecimenId, copy.specimens],
  );
  const activeBossIndex = copy.bosses.findIndex((boss) => boss.id === activeBossId);
  const activeBoss = copy.bosses[activeBossIndex] ?? copy.bosses[0];

  return (
    <section
      id="bestiary"
      ref={rootRef}
      className="ix-forbidden-records"
      data-section
      aria-labelledby="bestiary-title"
    >
      <div className="ix-forbidden-records__noise" aria-hidden="true" />
      <div className="ix-forbidden-records__silhouettes" aria-hidden="true">
        <Image src={bestiaryAssets.B11} alt="" fill sizes="100vw" />
      </div>
      <div className="ix-forbidden-records__fx" aria-hidden="true">
        <Image src={bestiaryAssets.B12} alt="" fill sizes="100vw" />
      </div>

      <header className="ix-forbidden-intro">
        <span className="ix-forbidden-kicker">{copy.eyebrow}</span>
        <h2 id="bestiary-title">
          <JpRevealText jp={copy.introJp} text={copy.introTitle} locale={locale} />
        </h2>
        <div className="ix-forbidden-intro__body">
          {copy.introBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>

      <div className="ix-bestiary-act" aria-label={copy.bestiaryLabel}>
        <div className="ix-bestiary-act__label">
          <span>01</span>
          <strong>{copy.bestiaryLabel}</strong>
          <small>ARCHIVE INTEGRITY 43%</small>
        </div>

        <div className="ix-bestiary-grid">
          {copy.specimens.map((specimen, index) => (
            <SpecimenButton
              key={specimen.id}
              specimen={specimen}
              index={index}
              active={activeSpecimen.id === specimen.id}
              onActivate={() => setActiveSpecimenId(specimen.id)}
            />
          ))}
        </div>

        <aside
          className="ix-bestiary-entry"
          style={{ "--entity-accent": activeSpecimen.accent } as React.CSSProperties}
          aria-live="polite"
        >
          <div className="ix-bestiary-entry__head">
            <span>
              ENTRY{" "}
              {String(
                copy.specimens.findIndex((item) => item.id === activeSpecimen.id) + 1,
              ).padStart(2, "0")}{" "}
              / 06
            </span>
            <strong>UNSTABLE</strong>
          </div>
          <h3>{activeSpecimen.name}</h3>
          <dl>
            <div>
              <dt>REALM</dt>
              <dd>{activeSpecimen.realm}</dd>
            </div>
            <div>
              <dt>TYPE</dt>
              <dd>{activeSpecimen.type}</dd>
            </div>
            <div>
              <dt>THREAT</dt>
              <dd>{activeSpecimen.threat}</dd>
            </div>
          </dl>
          <p>{activeSpecimen.description}</p>
          <div className="ix-bestiary-entry__signal">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </aside>
      </div>

      <div className="ix-archive-break" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="ix-bosses-act">
        <div className="ix-bosses-act__label">
          <span>02</span>
          <strong>{copy.bossesLabel}</strong>
        </div>

        <div className="ix-bosses-layout">
          <div className="ix-boss-index-column">
            <div className="ix-boss-index-editorial">
              <span>ARCHIVE LIMIT EXCEEDED</span>
              <h2>
                <JpRevealText jp={copy.transitionJp} text={copy.transitionTitle} locale={locale} />
              </h2>
            </div>

            <nav className="ix-boss-index" aria-label={copy.bossesLabel}>
              {copy.bosses.map((boss, index) => (
                <button
                  type="button"
                  key={boss.id}
                  className={boss.id === activeBoss.id ? "is-active" : ""}
                  aria-pressed={boss.id === activeBoss.id}
                  onMouseEnter={() => setActiveBossId(boss.id)}
                  onFocus={() => setActiveBossId(boss.id)}
                  onClick={() => setActiveBossId(boss.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{boss.nav}</strong>
                  {boss.classified && <small>LOCKED</small>}
                </button>
              ))}
            </nav>
          </div>

          <BossStage boss={activeBoss} index={activeBossIndex} locale={locale} />
        </div>
      </div>

      <footer className="ix-forbidden-outro">
        <span className="ix-forbidden-outro__moon" aria-hidden="true" />
        <h2>
          <JpRevealText jp={copy.finalJp} text={copy.finalTitle} locale={locale} />
        </h2>
        <p>{copy.finalBody}</p>
        <span className="ix-forbidden-outro__reference">MOTHER MOON / RECORD TRACE DETECTED</span>
      </footer>
    </section>
  );
}
