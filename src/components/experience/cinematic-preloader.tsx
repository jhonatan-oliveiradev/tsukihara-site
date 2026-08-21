"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

type CinematicPreloaderProps = {
  onComplete: () => void;
};

export function CinematicPreloader({ onComplete }: CinematicPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
        if (cancelled) return;
        setProgress(100);
        window.setTimeout(() => setLeaving(true), 260);
        window.setTimeout(onComplete, 900);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  return (
    <div className={`ix-preloader${leaving ? "is-leaving" : ""}`} aria-live="polite">
      <div className="ix-preloader-moon" aria-hidden="true" />
      <div className="ix-preloader-inner">
        <span className="ix-preloader-jp">月の原</span>
        <Image src="/assets_hq/logotipo.png" alt="Tsukihara" width={540} height={300} priority />
        <div className="ix-preloader-progress">
          <b>{String(progress).padStart(3, "0")}</b>
          <span>%</span>
        </div>
        <div className="ix-preloader-line" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <small>記憶を復元しています · RESTAURANDO MEMÓRIAS</small>
      </div>
    </div>
  );
}
