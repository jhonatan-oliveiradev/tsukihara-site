"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { getTitleMenuPolicy } from "@/components/remember/archive/archive-policy";
import { MemoryArchive } from "@/components/remember/archive/memory-archive";
import { useRememberAudio } from "@/components/remember/audio/use-remember-audio";
import { memoryDefinitions } from "@/components/remember/content/memory-definitions";
import { getRememberCopy } from "@/components/remember/content/remember-locales";
import { RememberShell } from "@/components/remember/remember-shell";
import { isMemoryReadyForRestoration } from "@/components/remember/restore/memory-mechanic-policy";
import { BootScene } from "@/components/remember/scenes/boot-scene";
import { GamePreloader } from "@/components/remember/scenes/game-preloader";
import { RememberMenuBackdrop } from "@/components/remember/scenes/menu-backdrop";
import { MenuScene } from "@/components/remember/scenes/menu-scene";
import { PauseMenu } from "@/components/remember/scenes/pause-menu";
import { RestoreScene } from "@/components/remember/scenes/restore-scene";
import {
  SceneTransitionDirector,
  type SceneTransitionDirectorHandle,
} from "@/components/remember/scenes/scene-transition-director";
import { isMemoryStage } from "@/components/remember/state/remember-progression";
import { rememberReducer } from "@/components/remember/state/remember-reducer";
import {
  createNewRememberSave,
  loadRememberSave,
  REMEMBER_SAVE_KEY,
  serializeRememberSave,
  type MemoryProgress,
  type RememberSaveV1,
} from "@/components/remember/state/remember-save";
import {
  initialRememberState,
  type MemoryId,
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

const createMemoryProgress = (
  restoredFragmentIds: string[],
  previous?: MemoryProgress,
): MemoryProgress => ({
  restoredFragmentIds,
  startedAt: previous?.startedAt ?? new Date().toISOString(),
  elapsedMs: previous?.elapsedMs ?? 0,
  mistakes: previous?.mistakes ?? 0,
  falseFragments: previous?.falseFragments ?? 0,
});

export function RememberExperience() {
  const router = useRouter();
  const [state, dispatch] = useReducer(rememberReducer, initialRememberState);
  const [storedSave, setStoredSave] = useState<RememberSaveV1 | null>(null);
  const [transitionState, setTransitionState] = useState<TransitionState>("idle");
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloadError, setPreloadError] = useState(false);
  const [preloadAttempt, setPreloadAttempt] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(() =>
    createPreloadProgress(0, initialAssetManifest.critical.length),
  );
  const saveRef = useRef<RememberSaveV1 | null>(null);
  const transitionDirectorRef = useRef<SceneTransitionDirectorHandle>(null);
  const reducedMotion = useRememberReducedMotion();
  const audio = useRememberAudio();
  const copy = getRememberCopy(state.locale);
  const activeMemory = memoryDefinitions[state.activeMemoryIndex] ?? memoryDefinitions[0];
  const titleMenuPolicy = getTitleMenuPolicy(storedSave);

  useRememberScrollLock();

  const persistSave = useCallback((save: RememberSaveV1) => {
    saveRef.current = save;
    setStoredSave(save);
    window.localStorage.setItem(REMEMBER_SAVE_KEY, serializeRememberSave(save));
  }, []);

  const mutateSave = useCallback(
    (mutate: (save: RememberSaveV1) => RememberSaveV1) => {
      const current = saveRef.current;
      if (!current) return null;
      const next = mutate(current);
      persistSave(next);
      return next;
    },
    [persistSave],
  );

  useEffect(() => {
    let cancelled = false;
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (storedLocale === "pt" || storedLocale === "en") {
      dispatch({ type: "SET_LOCALE", locale: storedLocale });
    }

    const save = loadRememberSave(window.localStorage.getItem(REMEMBER_SAVE_KEY));
    saveRef.current = save;
    if (save) {
      window.localStorage.setItem(REMEMBER_SAVE_KEY, serializeRememberSave(save));
    }
    queueMicrotask(() => {
      if (!cancelled) setStoredSave(save);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    audio.setMuted(state.muted);
  }, [audio, state.muted]);

  useEffect(() => {
    let cancelled = false;

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
    if (state.scene === "boot" || state.scene === "menu") return;
    const save = saveRef.current;
    if (!save || save.gameCompleted || save.currentStage === state.currentStage) return;

    persistSave({
      ...save,
      currentStage: state.currentStage,
      updatedAt: new Date().toISOString(),
    });
  }, [persistSave, state.currentStage, state.scene]);

  const requestTransition = useCallback(
    async (commitDestination: () => void, prepareDestination?: () => Promise<void>) => {
      const director = transitionDirectorRef.current;
      if (!director) return false;
      return director.requestTransition(commitDestination, prepareDestination);
    },
    [],
  );

  const saveBeforeLeaving = useCallback(() => {
    const save = saveRef.current;
    if (!save) return;
    persistSave({ ...save, updatedAt: new Date().toISOString() });
  }, [persistSave]);

  const handleExit = useCallback(() => {
    saveBeforeLeaving();
    gsap.globalTimeline.resume();
    audio.stopAll();
    router.push("/");
  }, [audio, router, saveBeforeLeaving]);

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

  const handleNewGame = useCallback(async () => {
    const manifest = getStageAssetManifest("hanamori");
    const transitioned = await requestTransition(
      () => {
        const save = createNewRememberSave(new Date().toISOString());
        persistSave(save);
        dispatch({ type: "START_NEW_GAME" });
        trackRememberEvent("remember_started");
        void audio.startMemory();
      },
      async () => {
        await preloadRememberAssets(manifest.critical);
      },
    ).catch(() => false);

    if (transitioned) void preloadRememberAssetsInBackground(manifest.next);
  }, [audio, persistSave, requestTransition]);

  const handleContinueSave = useCallback(async () => {
    const save = saveRef.current;
    if (!save) return;
    const manifest = getStageAssetManifest(save.currentStage);

    const transitioned = await requestTransition(
      () => {
        dispatch({ type: "HYDRATE_SAVE", save });
        void audio.startMemory();
      },
      async () => {
        await preloadRememberAssets(manifest.critical);
      },
    ).catch(() => false);

    if (transitioned) void preloadRememberAssetsInBackground(manifest.next);
  }, [audio, requestTransition]);

  const handleMenuPrimary = useCallback(async () => {
    const policy = getTitleMenuPolicy(saveRef.current);
    if (policy.primary === "continue") {
      await handleContinueSave();
      return;
    }
    if (policy.primary === "revisit") {
      dispatch({ type: "OPEN_ARCHIVE" });
      return;
    }
    await handleNewGame();
  }, [handleContinueSave, handleNewGame]);

  const handleRestore = useCallback(
    (fragmentId: string) => {
      if (
        state.scene !== "memory" ||
        state.paused ||
        state.archiveOpen ||
        state.restorationPhase !== "idle" ||
        state.restoredFragmentIds.includes(fragmentId)
      ) {
        return;
      }

      const restoredFragmentIds = [...state.restoredFragmentIds, fragmentId];
      const completesMemory = isMemoryReadyForRestoration(activeMemory, restoredFragmentIds);

      mutateSave((save) => ({
        ...save,
        updatedAt: new Date().toISOString(),
        memoryProgress: {
          ...save.memoryProgress,
          [activeMemory.id]: createMemoryProgress(
            restoredFragmentIds,
            save.memoryProgress[activeMemory.id],
          ),
        },
      }));

      if (completesMemory) void audio.duckMemoryForRestoration();

      audio.playPieceComplete();
      dispatch({
        type: "RESTORE_FRAGMENT",
        fragmentId,
        totalFragments: activeMemory.fragments.length,
        completesMemory,
      });
    },
    [
      activeMemory,
      audio,
      mutateSave,
      state.archiveOpen,
      state.paused,
      state.restorationPhase,
      state.restoredFragmentIds,
      state.scene,
    ],
  );

  const handleUnrestore = useCallback(
    (fragmentId: string) => {
      if (
        activeMemory.mechanic !== "false-memory" ||
        state.scene !== "memory" ||
        state.paused ||
        state.archiveOpen ||
        state.restorationPhase !== "idle" ||
        !state.restoredFragmentIds.includes(fragmentId)
      ) {
        return;
      }

      const restoredFragmentIds = state.restoredFragmentIds.filter(
        (restoredFragmentId) => restoredFragmentId !== fragmentId,
      );
      const completesMemory = isMemoryReadyForRestoration(activeMemory, restoredFragmentIds);

      mutateSave((save) => ({
        ...save,
        updatedAt: new Date().toISOString(),
        memoryProgress: {
          ...save.memoryProgress,
          [activeMemory.id]: createMemoryProgress(
            restoredFragmentIds,
            save.memoryProgress[activeMemory.id],
          ),
        },
      }));

      if (completesMemory) void audio.duckMemoryForRestoration();

      dispatch({
        type: "UNRESTORE_FRAGMENT",
        fragmentId,
        completesMemory,
      });
    },
    [
      activeMemory,
      audio,
      mutateSave,
      state.archiveOpen,
      state.paused,
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
    mutateSave((save) => ({
      ...save,
      updatedAt: new Date().toISOString(),
      completedStages: save.completedStages.includes(activeMemory.id)
        ? save.completedStages
        : [...save.completedStages, activeMemory.id],
    }));
    dispatch({ type: "MARK_MEMORY_RESTORED", memoryId: activeMemory.id });
  }, [activeMemory.id, mutateSave]);

  const handleKintsugi = useCallback(() => audio.playKintsugi(), [audio]);
  const handleRestored = useCallback(() => audio.playRestored(), [audio]);
  const handleContinue = useCallback(async () => {
    const nextMemory = memoryDefinitions[state.activeMemoryIndex + 1];
    if (!nextMemory) {
      dispatch({ type: "CONTINUE" });
      return;
    }

    const manifest = getStageAssetManifest(nextMemory.id);
    const transitioned = await requestTransition(
      () => {
        dispatch({ type: "CONTINUE" });
        void audio.restoreMemoryLevel();
      },
      async () => {
        await preloadRememberAssets(manifest.critical);
      },
    ).catch(() => false);

    if (transitioned) void preloadRememberAssetsInBackground(manifest.next);
  }, [audio, requestTransition, state.activeMemoryIndex]);

  const closePause = useCallback(() => {
    dispatch({ type: "CLOSE_PAUSE" });
    gsap.globalTimeline.resume();
    void audio.resumeGameplay();
  }, [audio]);

  const openPause = useCallback(() => {
    if (
      state.paused ||
      state.archiveOpen ||
      transitionState !== "idle" ||
      (state.scene !== "memory" && state.scene !== "interlude")
    ) {
      return;
    }
    audio.pauseGameplay();
    gsap.globalTimeline.pause();
    dispatch({ type: "OPEN_PAUSE" });
  }, [audio, state.archiveOpen, state.paused, state.scene, transitionState]);

  const handleTogglePause = useCallback(() => {
    if (state.paused) closePause();
    else openPause();
  }, [closePause, openPause, state.paused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || state.archiveOpen) return;
      if (state.scene !== "memory" && state.scene !== "interlude") return;
      event.preventDefault();
      if (state.paused) closePause();
      else openPause();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePause, openPause, state.archiveOpen, state.paused, state.scene]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "r") return;
      gsap.globalTimeline.resume();
      audio.stopAll();
      dispatch({ type: "RESTART" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [audio]);

  const handleRestartMemory = useCallback(() => {
    if (!isMemoryStage(state.currentStage)) return;
    mutateSave((save) => ({
      ...save,
      updatedAt: new Date().toISOString(),
      memoryProgress: {
        ...save.memoryProgress,
        [state.currentStage]: createMemoryProgress([]),
      },
    }));
    dispatch({ type: "RESTART_MEMORY" });
    gsap.globalTimeline.resume();
    void audio.restoreMemoryLevel();
  }, [audio, mutateSave, state.currentStage]);

  const handleOpenArchive = useCallback(() => {
    dispatch({ type: "OPEN_ARCHIVE" });
  }, []);

  const handleCloseArchive = useCallback(() => {
    dispatch({ type: "CLOSE_ARCHIVE" });
  }, []);

  const handleReturnTitle = useCallback(async () => {
    saveBeforeLeaving();
    gsap.globalTimeline.resume();
    dispatch({ type: "CLOSE_PAUSE" });
    dispatch({ type: "CLOSE_ARCHIVE" });
    void audio.enterCredits();
    await requestTransition(() => {
      dispatch({ type: "RESTART" });
      dispatch({ type: "UNLOCK_MENU" });
    });
  }, [audio, requestTransition, saveBeforeLeaving]);

  const handleReplayMemory = useCallback(
    async (memoryId: MemoryId) => {
      const save = saveRef.current;
      if (!save?.gameCompleted) return;
      const manifest = getStageAssetManifest(memoryId);
      dispatch({ type: "CLOSE_ARCHIVE" });
      await requestTransition(
        () => {
          dispatch({ type: "ENTER_STAGE", stage: memoryId });
          void audio.startMemory();
        },
        async () => {
          await preloadRememberAssets(manifest.critical);
        },
      );
      void preloadRememberAssetsInBackground(manifest.next);
    },
    [audio, requestTransition],
  );

  const handleRetryPreload = useCallback(() => {
    setPreloadError(false);
    setPreloadProgress(createPreloadProgress(0, initialAssetManifest.critical.length));
    setPreloadAttempt((attempt) => attempt + 1);
  }, []);

  const menuVisible = state.scene === "boot" || state.scene === "menu";
  const pauseAvailable =
    ((state.scene === "memory" && state.restorationPhase === "idle") ||
      state.scene === "interlude") &&
    transitionState === "idle";
  const gameplayInteractive =
    state.restorationPhase === "idle" &&
    transitionState === "idle" &&
    !preloaderVisible &&
    !state.paused &&
    !state.archiveOpen;
  const progressMemory = storedSave
    ? memoryDefinitions.find((memory) => memory.id === storedSave.currentStage)
    : null;
  const progressFragmentCount =
    progressMemory && storedSave
      ? (storedSave.memoryProgress[progressMemory.id]?.restoredFragmentIds.length ?? 0)
      : 0;
  const progressLabel = progressMemory
    ? `${progressMemory.title} · ${progressFragmentCount} / ${progressMemory.fragments.length}`
    : (storedSave?.currentStage.toUpperCase() ?? null);
  const archiveCurrentStage =
    state.scene === "menu" && storedSave ? storedSave.currentStage : state.currentStage;

  const overlay = (
    <>
      {state.paused && !state.archiveOpen ? (
        <PauseMenu
          copy={copy.pause}
          onResume={closePause}
          onRestartMemory={handleRestartMemory}
          onOpenArchive={handleOpenArchive}
          onReturnTitle={() => void handleReturnTitle()}
        />
      ) : null}

      {state.archiveOpen ? (
        <MemoryArchive
          copy={copy.archive}
          save={storedSave}
          currentStage={archiveCurrentStage}
          onClose={handleCloseArchive}
          onReplayMemory={(memoryId) => void handleReplayMemory(memoryId)}
        />
      ) : null}
    </>
  );

  return (
    <>
      <RememberShell
        scene={state.scene}
        locale={state.locale}
        muted={state.muted}
        paused={state.paused}
        pauseAvailable={pauseAvailable}
        onExit={handleExit}
        onToggleMute={handleToggleMute}
        onTogglePause={handleTogglePause}
        onLocaleChange={handleLocaleChange}
        overlay={overlay}
      >
        {menuVisible && <RememberMenuBackdrop reducedMotion={reducedMotion} />}

        {state.scene === "boot" && <BootScene copy={copy.boot} onUnlock={handleUnlockMenu} />}
        {state.scene === "menu" && (
          <MenuScene
            copy={copy.menu}
            locale={state.locale}
            revealReady={transitionState === "idle"}
            policy={titleMenuPolicy}
            progressLabel={progressLabel}
            onPrimary={handleMenuPrimary}
            onNewGame={handleNewGame}
            onOpenArchive={handleOpenArchive}
          />
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
            onUnrestore={handleUnrestore}
            onRestorationPhaseChange={handleRestorationPhaseChange}
            onRestorationComplete={handleRestorationComplete}
            onKintsugi={handleKintsugi}
            onRestored={handleRestored}
            onContinue={() => void handleContinue()}
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
          onRetry={handleRetryPreload}
          onFinished={() => setPreloaderVisible(false)}
        />
      )}
    </>
  );
}
