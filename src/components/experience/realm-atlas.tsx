"use client";

import { useState } from "react";
import { ShaderImage } from "@/components/experience/shader-image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { realms } from "@/content/game";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];
type RealmId = (typeof realms)[number]["id"];

type RealmAtlasProps = {
  copy: Copy;
  locale: Locale;
};

export function RealmAtlas({ copy, locale }: RealmAtlasProps) {
  const [activeRealm, setActiveRealm] = useState<RealmId>(realms[0].id);
  const activeIndex = realms.findIndex((realm) => realm.id === activeRealm);
  const active = realms[activeIndex] ?? realms[0];
  const activeCopy = copy.realms[active.id];

  return (
    <section id="realms" data-section className="ix-realm-atlas">
      <div className="ix-realm-atlas-head">
        <div className="ix-section-label">
          <span>{copy.realmsIntro.label}</span>
          <i />
          <span>九国</span>
        </div>
        <h2>
          <JpRevealText
            jp={copy.realmsIntro.titleJp}
            text={copy.realmsIntro.title}
            locale={locale}
          />
        </h2>
        <p data-reveal>{copy.realmsIntro.body}</p>
      </div>

      <div className="ix-realm-atlas-grid">
        <div className="ix-realm-stage" data-realm-stage>
          {realms.map((realm) => (
            <div
              key={realm.id}
              className={`ix-realm-stage-layer ${realm.id === active.id ? "is-active" : ""}`}
              aria-hidden={realm.id !== active.id}
            >
              <ShaderImage
                src={realm.image}
                alt={realm.title}
                variant="lens"
                active={realm.id === active.id}
                sizes="(max-width: 760px) 100vw, 72vw"
              />
            </div>
          ))}
          <div className="ix-realm-stage-vignette" aria-hidden="true" />
          <div className="ix-realm-stage-meta">
            <span>0{activeIndex + 1}</span>
            <strong>{active.kanji}</strong>
          </div>
          <div className="ix-realm-stage-copy">
            <small>{activeCopy.label}</small>
            <h3>{active.title}</h3>
            <p>{activeCopy.copy}</p>
          </div>
        </div>

        <div className="ix-realm-index" role="tablist" aria-label={copy.nav.realms}>
          {realms.map((realm, index) => {
            const local = copy.realms[realm.id];
            const selected = realm.id === active.id;
            return (
              <button
                key={realm.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={selected ? "is-active" : ""}
                onClick={() => setActiveRealm(realm.id)}
                onMouseEnter={() => setActiveRealm(realm.id)}
                onFocus={() => setActiveRealm(realm.id)}
              >
                <span>0{index + 1}</span>
                <div>
                  <b>{realm.title}</b>
                  <small>{local.label}</small>
                </div>
                <em lang="ja">{realm.kanji}</em>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
