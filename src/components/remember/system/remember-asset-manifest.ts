import { rememberAudioTracks } from "../audio/remember-audio.ts";
import { rememberAssets } from "../content/remember-assets.ts";
import type { RememberStageId } from "../state/remember-state.ts";

export type StageAssetManifest = {
  critical: string[];
  next: string[];
};

export type PreloadProgress = {
  loaded: number;
  total: number;
  ready: boolean;
};

const sharedRestorationAssets = [
  rememberAssets.kintsugiCrackOverlay,
  rememberAssets.memoryParticles,
  rememberAssets.memoryPulseRing,
  rememberAssets.completionBurst,
  rememberAssets.restoredScarOverlay,
] as const;

const unique = (sources: readonly string[]) => [...new Set(sources)];

const hanamoriAssets = unique([
  rememberAssets.hanamoriBroken,
  rememberAssets.hanamoriRestored,
  rememberAssets.sakuraBranch,
  rememberAssets.shrineRuins,
  rememberAssets.stoneLantern,
  rememberAssets.tallGrass,
  ...sharedRestorationAssets,
]);

const mizukyoAssets = unique([
  rememberAssets.mizukyoBroken,
  rememberAssets.mizukyoRestored,
  ...sharedRestorationAssets,
]);

const kuroganeAssets = unique([
  rememberAssets.kuroganeBroken,
  rememberAssets.kuroganeRestored,
  ...sharedRestorationAssets,
]);

const yumegakureAssets = unique([
  rememberAssets.yumegakureBroken,
  rememberAssets.yumegakureRestored,
  rememberAssets.yumegakureFalseFragment01,
  rememberAssets.yumegakureFalseFragment02,
  rememberAssets.yumegakureDistortionOverlay,
  ...sharedRestorationAssets,
]);

const gekkaiAssets = unique([
  rememberAssets.gekkaiStateA,
  rememberAssets.gekkaiStateB,
  rememberAssets.gekkaiRestored,
  rememberAssets.gekkaiLunarFocusOverlay,
  ...sharedRestorationAssets,
]);

export const createPreloadProgress = (loaded: number, total: number): PreloadProgress => {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeLoaded = Math.min(safeTotal, Math.max(0, Math.floor(loaded)));
  return {
    loaded: safeLoaded,
    total: safeTotal,
    ready: safeTotal === 0 || safeLoaded >= safeTotal,
  };
};

export const getInitialAssetManifest = (): StageAssetManifest => ({
  critical: unique([
    rememberAssets.menuBackground,
    rememberAudioTracks.menu.src,
    rememberAudioTracks.phase.src,
    ...hanamoriAssets,
  ]),
  next: [rememberAudioTracks.kintsugi.src, rememberAudioTracks.harp.src],
});

export const getStageAssetManifest = (stage: RememberStageId): StageAssetManifest => {
  switch (stage) {
    case "hanamori":
      return {
        critical: hanamoriAssets,
        next: [rememberAssets.mizukyoBroken, rememberAssets.mizukyoRestored],
      };
    case "mizukyo":
      return { critical: mizukyoAssets, next: [rememberAssets.interludeUnknownMemory] };
    case "interlude-01":
      return { critical: [rememberAssets.interludeUnknownMemory], next: kuroganeAssets };
    case "kurogane":
      return { critical: kuroganeAssets, next: yumegakureAssets };
    case "yumegakure":
      return { critical: yumegakureAssets, next: gekkaiAssets };
    case "gekkai":
      return {
        critical: gekkaiAssets,
        next: [
          rememberAssets.interludeMemoryNetwork,
          rememberAssets.memoryArchiveBackground,
          rememberAssets.memoryArchiveSigil,
          rememberAssets.akr001Signature,
          rememberAssets.signatureFoundBurst,
          rememberAssets.stageLockOverlay,
        ],
      };
    case "interlude-02":
      return {
        critical: [
          rememberAssets.interludeMemoryNetwork,
          rememberAssets.memoryArchiveBackground,
          rememberAssets.memoryArchiveSigil,
          rememberAssets.akr001Signature,
          rememberAssets.signatureFoundBurst,
          rememberAssets.stageLockOverlay,
        ],
        next: [rememberAssets.akariReveal],
      };
    case "akari-reveal":
      return { critical: [rememberAssets.akariReveal], next: [rememberAssets.epilogueEclipse] };
    case "epilogue":
      return { critical: [rememberAssets.epilogueEclipse], next: [rememberAssets.creditsLoop] };
    case "credits":
      return { critical: [rememberAssets.creditsLoop], next: [] };
  }
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      void image.decode().catch(() => undefined).finally(resolve);
    };
    image.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    image.src = src;
  });

const preloadAudio = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const audio = document.createElement("audio");
    const cleanup = () => {
      audio.removeEventListener("loadeddata", handleLoaded);
      audio.removeEventListener("error", handleError);
      audio.removeAttribute("src");
      audio.load();
    };
    const handleLoaded = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to preload audio: ${src}`));
    };
    audio.preload = "auto";
    audio.addEventListener("loadeddata", handleLoaded, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.src = src;
    audio.load();
  });

const preloadVideo = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const video = document.createElement("video");
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("error", handleError);
      video.removeAttribute("src");
      video.load();
    };
    const handleLoaded = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to preload video: ${src}`));
    };
    video.preload = "metadata";
    video.addEventListener("loadedmetadata", handleLoaded, { once: true });
    video.addEventListener("error", handleError, { once: true });
    video.src = src;
    video.load();
  });

const preloadAsset = (src: string) => {
  if (src.endsWith(".mp4")) return preloadVideo(src);
  if (src.endsWith(".mp3")) return preloadAudio(src);
  return preloadImage(src);
};

export async function preloadRememberAssets(
  sources: readonly string[],
  onProgress?: (progress: PreloadProgress) => void,
) {
  const uniqueSources = unique(sources);
  let loaded = 0;
  const total = uniqueSources.length;
  onProgress?.(createPreloadProgress(loaded, total));

  const results = await Promise.allSettled(
    uniqueSources.map(async (src) => {
      await preloadAsset(src);
      loaded += 1;
      onProgress?.(createPreloadProgress(loaded, total));
    }),
  );

  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );
  if (failure) throw failure.reason;
  return createPreloadProgress(loaded, total);
}

export const preloadRememberAssetsInBackground = (sources: readonly string[]) =>
  Promise.allSettled(unique(sources).map(preloadAsset));
