"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useRememberAudio } from "@/components/remember/audio/use-remember-audio";
import { memoryDefinitions } from "@/components/remember/content/memory-definitions";
import { getRememberCopy } from "@/components/remember/content/remember-locales";
import { RememberShell } from "@/components/remember/remember-shell";
import { BootScene } from "@/components/remember/scenes/boot-scene";
import { GamePreloader } from "@/components/remember/scenes/game-preloader";
import { RememberMenuBackdrop } from "@/components/remember/scenes/menu-backdrop";
import { MenuScene } from "@/components/remember/scenes/menu-scene";
import { RestoreScene } from "@/components/remember/scenes/restore-scene";
import {
  SceneTransitionDirector,
  type SceneTransitionDirectorHandle,
} from "@/components/remember/scenes/scene-transition-director";
import { rememberReducer } from "@/components/remember/state/remember-reducer";
import {
  initialRememberState,
  type RememberLocale,
  type RestorationPhase,
} from "@/components/remember/state/remember-state";
import { trackRememberEvent } from "@/components/remember/system/remember-analytics";
import {
  createPreloadProgress,
  getInitialAssetManifest,
  getStageAssetManifest,
  preloadRememberAssets,
  preloadRememberAssetsInBackground,
} from "@/components/remember/system/remember-asset-manifest";
import type { TransitionState } from "@/components/remember/system/scene-transition-policy";
import { useRememberReducedMotion } from "@/components/remember/system/use-remember-reduced-motion";
import { useRememberScrollLock } from "@/components/remember/system/use-remember-scroll-lock";

const localeStorageKey = "tsukihara:remember:locale";
const initialAssetManifest = getInitialAssetManifest();

export function RememberExperience() {
  const router = useRouter();
  const [state, dispatch] = useReducer(rememberReducer, initialRememberState);
  const [transitionState, setTransitionState] = useState<TransitionState>("idle");
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloadError, setPreloadError] = useState(false);
  const [preloadAttempt, setPreloadAttempt] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(() =>
    createPreloadProgress(0, initialAssetManifest.critical.length),
  );
  const transitionDirectorRef = useRef<SceneTransitionDirectorHandle>(null);
  const reducedMotion = useRememberReducedMotion();
  const audio = useRememberAudio();
  const copy = getRememberCopy(state.locale);
  const activeMemory = memoryDefinitions[state.activeMemoryIndex] ?? memoryDefinitions[0];

  useRememberScrollLock();

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (storedLocale === "pt" || storedLocale === "en") {
      dispatch({ type: "SET_LOCALE", locale: storedLocale });
    }
  }, []);

  useEffect(() => {
    audio.setMuted(state.muted);
  }, [audio, state.muted]);

  useEffect(() => {
    let cancelled = false;
    setPreloadError(false);
    setPreloadProgress(createPreloadProgress(0, initialAssetManifest.critical.length));

    void preloadRememberAssets(initialAssetManifest.critical, (progress) => {
      if (!cancelled) setPreloadProgress(progress);
    })
      .then(() => {
        if (!cancelled && initialAssetManifest.next.length > 0) {
          void preloadRememberAssetsInBackground(initialAssetManifest.next);
        }
      })
      .catch(() => {
        if (!cancelled) setPreloadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [preloadAttempt]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "r") return;
      audio.stopAll();
      dispatch({ type: "RESTART" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [audio]);

  const requestTransition = useCallback(
    async (commitDestination: () => void, prepareDestination?: () => Promise<void>) => {
      const director = transitionDirectorRef.current;
      if (!director) return false;
      return director.requestTransition(commitDestination, prepareDestination);
    },
    [],
  );

  const handleExit = useCallback(() => {
    audio.stopAll();
    router.push("/");
  }, [audio, router]);

  const handleToggleMute = useCallback(() => {
    const muted = !state.muted;
    dispatch({ type: "SET_MUTED", muted });
    audio.setMuted(muted);
  }, [audio, state.muted]);

  const handleLocaleChange = useCallback((locale: RememberLocale) => {
    window.localStorage.setItem(localeStorageKey, locale);
    dispatch({ type: "SET_LOCALE", locale });
  }, []);

  const handleUnlockMenu = useCallback(async () => {
    await audio.unlockMenu().catch(() => undefined);
    await requestTransition(() => dispatch({ type: "UNLOCK_MENU" }));
  }, [audio, requestTransition]);

  const handleBegin = useCallback(async () => {
    const manifest = getStageAssetManifest("hanamori");
    trackRememberEvent("remember_started");

    const transitioned = await requestTransition(
      () => {
        dispatch({ type: "BEGIN_GAME" });
        void audio.startMemory();
      },
      async () => {
        await preloadRememberAssets(manifest.critical);
      },
    ).catch(() => false);

    if (transitioned) void preloadRememberAssetsInBackground(manifest.next);
  }, [audio, requestTransition]);

  const handleRestore = useCallback(
    (fragmentId: string) => {
      if (
        state.scene !== "memory" ||
        state.restorationPhase !== "idle" ||
        state.restoredFragmentIds.includes(fragmentId)
      ) {
        return;
      }

      const completesMemory = state.restoredFragmentIds.length + 1 >= activeMemory.fragments.length;
      if (completesMemory) void audio.duckMemoryForRestoration();

      audio.playPieceComplete();
      dispatch({
        type: "RESTORE_FRAGMENT",
        fragmentId,
        totalFragments: activeMemory.fragments.length,
      });
    },
    [
      activeMemory.fragments.length,
      audio,
      state.restorationPhase,
      state.restoredFragmentIds,
      state.scene,
    ],
  );

  const handleRestorationPhaseChange = useCallback((phase: RestorationPhase) => {
    dispatch({ type: "SET_RESTORATION_PHASE", phase });
  }, []);

  const handleRestorationComplete = useCallback(() => {
    trackRememberEvent("remember_restore_completed", { realm: activeMemory.id });
    dispatch({ type: "MARK_MEMORY_RESTORED", memoryId: activeMemory.id });
  }, [activeMemory.id]);

  const handleKintsugi = useCallback(() => audio.playKintsugi(), [audio]);
  const handleRestored = useCallback(() => audio.playRestored(), [audio]);
  const handleContinue = useCallback(() => {
    if (state.activeMemoryIndex < memoryDefinitions.length - 1) {
      void audio.restoreMemoryLevel();
    }
    dispatch({ type: "CONTINUE" });
  }, [audio, state.activeMemoryIndex]);

  const menuVisible = state.scene === "boot" || state.scene === "menu";
  const gameplayInteractive =
    state.restorationPhase === "idle" && transitionState === "idle" && !preloaderVisible;

  return (
    <>
      <RememberShell
        scene={state.scene}
        locale={state.locale}
        muted={state.muted}
        onExit={handleExit}
        onToggleMute={handleToggleMute}
        onLocaleChange={handleLocaleChange}
      >
        {menuVisible && <RememberMenuBackdrop reducedMotion={reducedMotion} />}

        {state.scene === "boot" && <BootScene copy={copy.boot} onUnlock={handleUnlockMenu} />}
        {state.scene === "menu" && (
          <MenuScene copy={copy.menu} locale={state.locale} onBegin={handleBegin} />
        )}

        {state.scene === "memory" && (
          <RestoreScene
            key={activeMemory.id}
            memory={activeMemory}
            copy={copy.memory}
            completionLine={activeMemory.completionCopy[state.locale]}
            restoredFragmentIds={state.restoredFragmentIds}
            restorationPhase={state.restorationPhase}
            reducedMotion={reducedMotion}
            interactive={gameplayInteractive}
            onRestore={handleRestore}
            onRestorationPhaseChange={handleRestorationPhaseChange}
            onRestorationComplete={handleRestorationComplete}
            onKintsugi={handleKintsugi}
            onRestored={handleRestored}
            onContinue={handleContinue}
          />
        )}
      </RememberShell>

      <SceneTransitionDirector
        ref={transitionDirectorRef}
        reducedMotion={reducedMotion}
        label={copy.loading.transition}
        onStateChange={setTransitionState}
      />

      {preloaderVisible && (
        <GamePreloader
          progress={preloadProgress}
          label={copy.loading.label}
          fragmentsLabel={copy.loading.fragments}
          retryLabel={copy.loading.retry}
          error={preloadError}
          reducedMotion={reducedMotion}
          onRetry={() => setPreloadAttempt((attempt) => attempt + 1)}
          onFinished={() => setPreloaderVisible(false)}
        />
      )}
    </>
  );
}
