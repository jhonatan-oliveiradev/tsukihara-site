"use client";

import { useEffect, useRef, useState } from "react";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { NineRealmsMap } from "@/components/experience/nine-realms-map";
import { RippleDistortionImage } from "@/components/experience/ripple-distortion-image";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";
import { realmWorld, realmWorldCopy, type RealmId } from "@/content/realm-world";

type Copy = (typeof immersiveCopy)[Locale];

type RealmAtlasProps = {
  copy: Copy;
  locale: Locale;
};

export function RealmAtlas({ copy, locale }: RealmAtlasProps) {
  const [activeRealm, setActiveRealm] = useState<RealmId>(realmWorld[0].id);
  const indexRef = useRef<HTMLDivElement | null>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const localWorldCopy = realmWorldCopy[locale];
  const activeIndex = realmWorld.findIndex((realm) => realm.id === activeRealm);
  const active = realmWorld[activeIndex] ?? realmWorld[0];
  const activeCopy = localWorldCopy.realms[active.id];

  useEffect(() => {
    const index = indexRef.current;
    const button = activeButtonRef.current;
    if (!index || !button) return;

    const top = button.offsetTop;
    const bottom = top + button.offsetHeight;
    if (top < index.scrollTop) {
      index.scrollTop = top;
    } else if (bottom > index.scrollTop + index.clientHeight) {
      index.scrollTop = bottom - index.clientHeight;
    }
  }, [activeRealm]);

  const exploreRealm = (id: RealmId) => {
    setActiveRealm(id);
    document.getElementById("realms")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
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
            <div
              key={active.id}
              className="ix-realm-stage-layer is-active ix-realm-stage-layer--mounted"
            >
              <RippleDistortionImage
                src={active.image}
                alt={active.title}
                active
                tint="#a40c26"
                sizes="(max-width: 760px) 100vw, 72vw"
              />
            </div>
            <div className="ix-realm-stage-vignette" aria-hidden="true" />
            <div className="ix-realm-stage-meta">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <strong>{active.kanji}</strong>
            </div>
            <div className="ix-realm-stage-copy">
              <small>{activeCopy.label}</small>
              <h3>{active.title}</h3>
              <p>{activeCopy.copy}</p>
            </div>
          </div>

          <div ref={indexRef} className="ix-realm-index" role="tablist" aria-label={copy.nav.realms}>
            {realmWorld.map((realm, index) => {
              const local = localWorldCopy.realms[realm.id];
              const selected = realm.id === active.id;
              return (
                <button
                  key={realm.id}
                  ref={selected ? activeButtonRef : undefined}
                  type="button"
                  role="tab"
                  data-realm-id={realm.id}
                  aria-selected={selected}
                  className={selected ? "is-active" : ""}
                  onClick={() => setActiveRealm(realm.id)}
                  onMouseEnter={() => setActiveRealm(realm.id)}
                  onFocus={() => setActiveRealm(realm.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
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

      <NineRealmsMap locale={locale} onExploreRealm={exploreRealm} />
    </>
  );
}
