"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { realmMapCalibration } from "@/content/realm-map-calibration";
import {
  realmWorld,
  realmWorldCopy,
  type RealmId,
  type RealmWorldEntry,
} from "@/content/realm-world";

type NineRealmsMapProps = {
  locale: "pt" | "en";
  onExploreRealm: (id: RealmId) => void;
};

const realmHitAreas: Record<RealmId, string> = {
  gekkai: "6,30 16,18 29,18 37,27 34,41 23,51 8,48",
  kurogane: "20,12 39,9 50,19 45,33 34,40 24,34",
  hanamori: "39,8 57,6 65,17 61,31 50,36 42,29",
  mizukyo: "58,12 78,13 87,25 82,39 69,41 60,31",
  amahara: "73,31 92,27 98,43 93,60 78,61 68,49",
  hinokagura: "58,54 77,48 88,58 86,78 69,88 56,76",
  yumegakure: "38,57 58,54 65,70 58,91 39,91 31,74",
  "yoru-no-mori": "12,47 34,41 43,55 36,75 19,82 7,69",
  "tsuki-no-miya": "39,31 59,29 68,42 61,58 42,59 33,45",
};

function getRealm(id: RealmId | null) {
  return id ? (realmWorld.find((realm) => realm.id === id) ?? null) : null;
}

export function NineRealmsMap({ locale, onExploreRealm }: NineRealmsMapProps) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const previewClearTimerRef = useRef<number | null>(null);
  const [previewId, setPreviewId] = useState<RealmId | null>(null);
  const [selectedId, setSelectedId] = useState<RealmId | null>(null);
  const [inView, setInView] = useState(false);
  const copy = realmWorldCopy[locale];
  const activeId = selectedId ?? previewId;
  const activeRealm = getRealm(activeId);
  const activeCopy = activeRealm ? copy.realms[activeRealm.id] : null;
  const activeMapPoint = activeRealm ? realmMapCalibration[activeRealm.id] : null;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { rootMargin: "0px 0px -14%", threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (previewClearTimerRef.current !== null) {
        window.clearTimeout(previewClearTimerRef.current);
      }
    },
    [],
  );

  const activeIndex = useMemo(
    () => (activeId ? realmWorld.findIndex((realm) => realm.id === activeId) : -1),
    [activeId],
  );

  const cancelPreviewClear = () => {
    if (previewClearTimerRef.current !== null) {
      window.clearTimeout(previewClearTimerRef.current);
      previewClearTimerRef.current = null;
    }
  };

  const previewRealm = (id: RealmId) => {
    cancelPreviewClear();
    setPreviewId(id);
  };

  const schedulePreviewClear = () => {
    if (selectedId) return;
    cancelPreviewClear();
    previewClearTimerRef.current = window.setTimeout(() => {
      setPreviewId(null);
      previewClearTimerRef.current = null;
    }, 140);
  };

  const setTilt = (event: PointerEvent<HTMLDivElement>) => {
    const node = sceneRef.current;
    if (!node || event.pointerType === "touch") return;
    const rect = node.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    node.style.setProperty("--map-rx", `${(-ny * 1.1).toFixed(2)}deg`);
    node.style.setProperty("--map-ry", `${(nx * 1.4).toFixed(2)}deg`);
    node.style.setProperty("--map-tx", `${(nx * 3.5).toFixed(2)}px`);
    node.style.setProperty("--map-ty", `${(ny * 2.5).toFixed(2)}px`);
  };

  const resetTilt = () => {
    const node = sceneRef.current;
    if (!node) return;
    node.style.setProperty("--map-rx", "0deg");
    node.style.setProperty("--map-ry", "0deg");
    node.style.setProperty("--map-tx", "0px");
    node.style.setProperty("--map-ty", "0px");
    schedulePreviewClear();
  };

  const selectRealm = (realm: RealmWorldEntry) => {
    cancelPreviewClear();
    setSelectedId((current) => (current === realm.id ? null : realm.id));
    setPreviewId(realm.id);
  };

  const stepRealm = (direction: -1 | 1) => {
    const current = activeIndex >= 0 ? activeIndex : 0;
    const next = (current + direction + realmWorld.length) % realmWorld.length;
    const realm = realmWorld[next];
    cancelPreviewClear();
    setSelectedId(realm.id);
    setPreviewId(realm.id);
  };

  const closeSelection = () => {
    cancelPreviewClear();
    setSelectedId(null);
    setPreviewId(null);
  };

  const focusMaskStyle =
    activeRealm && activeMapPoint
      ? ({
          "--focus-x": `${activeMapPoint.x}%`,
          "--focus-y": `${activeMapPoint.y}%`,
          "--focus-glow": activeRealm.glow,
        } as CSSProperties)
      : undefined;

  return (
    <section
      id="world-map"
      ref={rootRef}
      data-section
      className={`ix-world-map ${inView ? "is-in-view" : ""} ${activeRealm ? "has-active" : ""}`}
    >
      <div className="ix-world-map__intro">
        <div className="ix-section-label">
          <span>{copy.intro.eyebrow}</span>
          <i />
          <span>九国図</span>
        </div>
        <div className="ix-world-map__intro-grid">
          <h2>{copy.intro.title}</h2>
          <p>{copy.intro.body}</p>
        </div>
      </div>

      <div className="ix-world-map__experience">
        <div
          ref={sceneRef}
          className="ix-world-map__scene"
          onPointerMove={setTilt}
          onPointerLeave={resetTilt}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeSelection();
          }}
        >
          <div className="ix-world-map__shadow" aria-hidden="true" />
          <div className="ix-world-map__object" style={focusMaskStyle}>
            <Image
              src="/9_reinos_mapa_isometrico.png"
              alt="Mapa isométrico dos Nove Reinos de Tsukihara"
              width={1536}
              height={1024}
              sizes="(max-width: 760px) 96vw, 88vw"
              className="ix-world-map__image ix-world-map__image--base"
            />
            {activeRealm && (
              <Image
                src="/9_reinos_mapa_isometrico.png"
                alt=""
                aria-hidden="true"
                width={1536}
                height={1024}
                sizes="(max-width: 760px) 96vw, 88vw"
                className="ix-world-map__image ix-world-map__image--focus"
              />
            )}

            <svg
              className="ix-world-map__paths"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {realmWorld.map((realm) => {
                const point = realmMapCalibration[realm.id];
                return (
                  <line
                    key={realm.id}
                    x1="50"
                    y1="43"
                    x2={point.x}
                    y2={point.y}
                    className={realm.id === activeId ? "is-active" : ""}
                  />
                );
              })}
            </svg>

            <svg
              className="ix-world-map__region-hits"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              onPointerLeave={schedulePreviewClear}
            >
              {realmWorld.map((realm) => (
                <polygon
                  key={realm.id}
                  points={realmHitAreas[realm.id]}
                  className={realm.id === activeId ? "is-active" : ""}
                  onPointerEnter={() => previewRealm(realm.id)}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectRealm(realm);
                  }}
                />
              ))}
            </svg>

            <div className="ix-world-map__mother-moon" aria-hidden="true">
              <i />
              <i />
              <span>月母</span>
            </div>

            <div className="ix-world-map__hotspots" role="group" aria-label={copy.intro.eyebrow}>
              {realmWorld.map((realm, index) => {
                const active = realm.id === activeId;
                const local = copy.realms[realm.id];
                const point = realmMapCalibration[realm.id];
                return (
                  <button
                    key={realm.id}
                    type="button"
                    className={`ix-world-map__hotspot ${active ? "is-active" : ""}`}
                    style={
                      {
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        "--realm-radius": `${point.radius}%`,
                        "--realm-glow": realm.glow,
                      } as CSSProperties
                    }
                    aria-label={`${locale === "pt" ? "Explorar" : "Explore"} ${realm.title}, ${local.label}`}
                    aria-pressed={selectedId === realm.id}
                    onPointerEnter={() => previewRealm(realm.id)}
                    onFocus={() => previewRealm(realm.id)}
                    onBlur={schedulePreviewClear}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectRealm(realm);
                    }}
                  >
                    <span className="ix-world-map__hotspot-ring" aria-hidden="true" />
                    <span className="ix-world-map__hotspot-node" aria-hidden="true">
                      <Image src={realm.emblem} alt="" width={72} height={72} />
                    </span>
                    <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
                  </button>
                );
              })}
            </div>

            {activeRealm && activeMapPoint && (
              <div
                className={`ix-world-map__particles is-${activeRealm.particle}`}
                style={{ "--realm-glow": activeRealm.glow } as CSSProperties}
                aria-hidden="true"
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <i
                    key={`${activeRealm.id}-${index}`}
                    style={
                      {
                        "--particle-x": `${(activeMapPoint.x + ((index * 17) % 19) - 9 + 100) % 100}%`,
                        "--particle-y": `${(activeMapPoint.y + ((index * 13) % 17) - 8 + 100) % 100}%`,
                        "--particle-delay": `${index * -0.17}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {activeRealm && activeCopy && activeMapPoint && (
            <aside
              className="ix-world-map__popover"
              style={
                {
                  left: `${activeMapPoint.popoverX}%`,
                  top: `${activeMapPoint.popoverY}%`,
                  "--realm-glow": activeRealm.glow,
                } as CSSProperties
              }
              onPointerEnter={cancelPreviewClear}
              onPointerLeave={schedulePreviewClear}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className="ix-world-map__popover-topline">
                <span>{String(activeIndex + 1).padStart(2, "0")} / 09</span>
                <Image src={activeRealm.emblem} alt="" width={46} height={46} />
              </div>
              <small>{activeCopy.label}</small>
              <h3>{activeRealm.title}</h3>
              <b>{activeRealm.aspect}</b>
              <p>{activeCopy.copy}</p>
              <dl>
                <div>
                  <dt>{copy.labels.state}</dt>
                  <dd>{activeCopy.state}</dd>
                </div>
                <div>
                  <dt>{copy.labels.threat}</dt>
                  <dd>{activeCopy.threat}</dd>
                </div>
              </dl>
              <button type="button" onClick={() => onExploreRealm(activeRealm.id)}>
                {copy.labels.explore} <span aria-hidden="true">→</span>
              </button>
            </aside>
          )}
        </div>

        <div className="ix-world-map__footer">
          <p>{copy.intro.hint}</p>
          <span>01 — 09</span>
        </div>
      </div>

      {activeRealm && activeCopy && (
        <aside
          className="ix-world-map__sheet"
          style={{ "--realm-glow": activeRealm.glow } as CSSProperties}
        >
          <div className="ix-world-map__sheet-head">
            <div>
              <span>{String(activeIndex + 1).padStart(2, "0")} / 09</span>
              <small>{activeCopy.label}</small>
            </div>
            <button type="button" onClick={closeSelection} aria-label={copy.labels.close}>
              ×
            </button>
          </div>
          <div className="ix-world-map__sheet-title">
            <Image src={activeRealm.emblem} alt="" width={54} height={54} />
            <div>
              <h3>{activeRealm.title}</h3>
              <b>{activeRealm.aspect}</b>
            </div>
          </div>
          <p>{activeCopy.copy}</p>
          <div className="ix-world-map__sheet-actions">
            <button type="button" onClick={() => stepRealm(-1)} aria-label={copy.labels.previous}>
              ←
            </button>
            <button type="button" onClick={() => onExploreRealm(activeRealm.id)}>
              {copy.labels.explore} →
            </button>
            <button type="button" onClick={() => stepRealm(1)} aria-label={copy.labels.next}>
              →
            </button>
          </div>
        </aside>
      )}
    </section>
  );
}
