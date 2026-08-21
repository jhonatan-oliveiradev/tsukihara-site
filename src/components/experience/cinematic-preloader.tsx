"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const imageAssets = [
  "/assets_hq/logotipo.png",
  "/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png",
  "/assets_hq/templo-hanamori.png",
  "/assets_hq/mizukyo-cachoeiras.png",
  "/assets_hq/kurogane-ruinas.png",
  "/parallax/tsukihara-blood-moon-eclipse.png",
  "/parallax/tsukihara-distant-temple.png",
  "/parallax/tsukihara-lunar-mist.png",
  "/parallax/tsukihara-sakura-tree.png",
  "/parallax/tsukihara-ground.png",
  "/parallax/tsukihara-characters-web.png",
  "/parallax/tsukihara-petals.png",
];

const fetchAssets = ["/models/japanese_temple/scene.gltf", "/models/crimson_katana/scene.gltf"];

export type EntryGatewayPhase = "loading" | "entry" | "revealing";

type EntryCopy = {
  overline: string;
  line: string;
  withSound: string;
  silent: string;
};

type CinematicPreloaderProps = {
  phase: EntryGatewayPhase;
  copy: EntryCopy;
  onLoaded: () => void;
  onChoose: (withSound: boolean) => Promise<void> | void;
  onRevealComplete: () => void;
};

export function CinematicPreloader({
  phase,
  copy,
  onLoaded,
  onChoose,
  onRevealComplete,
}: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [choicePending, setChoicePending] = useState(false);
  const announcedLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let loadedTimer: number | undefined;
    const total = imageAssets.length + fetchAssets.length + 2;
    let loaded = 0;

    const mark = () => {
      if (cancelled) return;
      loaded += 1;
      setProgress(Math.min(100, Math.round((loaded / total) * 100)));
    };

    const imagePromises = imageAssets.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = () => {
            mark();
            resolve();
          };
          image.onerror = () => {
            mark();
            resolve();
          };
          image.src = src;
        }),
    );

    const fetchPromises = fetchAssets.map((src) =>
      fetch(src, { cache: "force-cache" })
        .catch(() => null)
        .finally(mark),
    );

    const audioPromise = new Promise<void>((resolve) => {
      const audio = document.createElement("audio");
      const done = () => {
        mark();
        resolve();
      };
      audio.preload = "metadata";
      audio.addEventListener("loadedmetadata", done, { once: true });
      audio.addEventListener("error", done, { once: true });
      audio.src = "/audio/tsukihara-theme.mp3";
      audio.load();
    });

    const videoPromise = new Promise<void>((resolve) => {
      const video = document.createElement("video");
      const done = () => {
        mark();
        resolve();
      };
      video.preload = "metadata";
      video.addEventListener("loadedmetadata", done, { once: true });
      video.addEventListener("error", done, { once: true });
      video.src = "/assets_hq/video_battle.mp4";
      video.load();
    });

    Promise.allSettled([...imagePromises, ...fetchPromises, audioPromise, videoPromise]).then(
      () => {
        if (cancelled || announcedLoaded.current) return;
        announcedLoaded.current = true;
        setProgress(100);
        loadedTimer = window.setTimeout(onLoaded, 520);
      },
    );

    return () => {
      cancelled = true;
      if (loadedTimer) window.clearTimeout(loadedTimer);
    };
  }, [onLoaded]);

  useEffect(() => {
    if (phase !== "revealing") return;
    const revealTimer = window.setTimeout(onRevealComplete, 1320);
    return () => window.clearTimeout(revealTimer);
  }, [onRevealComplete, phase]);

  const choose = async (withSound: boolean) => {
    if (phase !== "entry" || choicePending) return;
    setChoicePending(true);
    try {
      await onChoose(withSound);
    } finally {
      setChoicePending(false);
    }
  };

  return (
    <div
      className={`ix-entry-gateway ix-entry-gateway-${phase}`}
      data-phase={phase}
      aria-live="polite"
    >
      <div className="ix-gateway-curtain ix-gateway-curtain-top" aria-hidden="true" />
      <div className="ix-gateway-curtain ix-gateway-curtain-bottom" aria-hidden="true" />

      <div className="ix-gateway-atmosphere" aria-hidden="true">
        <div className="ix-gateway-orbit ix-gateway-orbit-a" />
        <div className="ix-gateway-orbit ix-gateway-orbit-b" />
        <div className="ix-gateway-moon" />
        <span className="ix-gateway-kanji">記憶</span>
        <i className="ix-gateway-axis ix-gateway-axis-x" />
        <i className="ix-gateway-axis ix-gateway-axis-y" />
      </div>

      <div className="ix-gateway-loading" aria-hidden={phase !== "loading"}>
        <div className="ix-gateway-loading-copy">
          <span className="ix-gateway-kicker">月の原 · MEMORY RESTORATION</span>
          <Image src="/assets_hq/logotipo.png" alt="Tsukihara" width={540} height={300} priority />
          <small>記憶を復元しています · RESTAURANDO MEMÓRIAS</small>
        </div>

        <div className="ix-gateway-progress" aria-label={`${progress}%`}>
          <span className="ix-gateway-progress-index">0</span>
          <strong>{String(progress).padStart(3, "0")}</strong>
          <em>%</em>
        </div>

        <div className="ix-gateway-progress-line" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <div className="ix-gateway-entry" aria-hidden={phase === "loading"}>
        <span className="ix-gateway-kicker">{copy.overline}</span>
        <Image src="/assets_hq/logotipo.png" alt="Tsukihara" width={560} height={315} priority />
        <p>{copy.line}</p>
        <div className="ix-gateway-actions">
          <button
            type="button"
            disabled={choicePending || phase !== "entry"}
            onClick={() => choose(true)}
          >
            <span>01</span>
            {copy.withSound}
            <i />
          </button>
          <button
            type="button"
            disabled={choicePending || phase !== "entry"}
            onClick={() => choose(false)}
          >
            <span>02</span>
            {copy.silent}
            <i />
          </button>
        </div>
        <small className="ix-gateway-entry-note">
          音はいつでも変更できます · O som pode ser alterado a qualquer momento
        </small>
      </div>

      <div className="ix-gateway-reveal-line" aria-hidden="true" />
    </div>
  );
}
