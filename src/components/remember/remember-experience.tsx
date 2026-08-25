"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useRememberAudio } from "@/components/remember/audio/use-remember-audio";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import { memoryDefinitions } from "@/components/remember/content/memory-definitions";
import { getRememberCopy } from "@/components/remember/content/remember-locales";
import { RememberShell } from "@/components/remember/remember-shell";
import { BootScene } from "@/components/remember/scenes/boot-scene";
import { RememberMenuBackdrop } from "@/components/remember/scenes/menu-backdrop";
import { MenuScene } from "@/components/remember/scenes/menu-scene";
import { RestoreScene } from "@/components/remember/scenes/restore-scene";
import { rememberReducer } from "@/components/remember/state/remember-reducer";
import {
  initialRememberState,
  type RememberLocale,
  type RestorationPhase,
} from "@/components/remember/state/remember-state";
import { trackRememberEvent } from "@/components/remember/system/remember-analytics";
import { useRememberReducedMotion } from "@/components/remember/system/use-remember-reduced-motion";
import { useRememberScrollLock } from "@/components/remember/system/use-remember-scroll-lock";

const localeStorageKey = "tsukihara:remember:locale";

const preloadImage = (src: string) => {
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
};

export function RememberExperience() {
  const router = useRouter();
  const [state, dispatch] = useReducer(rememberReducer, initialRememberState);
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
    if (process.env.NODE_ENV === "production") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "r") return;
      audio.stopAll();
      dispatch({ type: "RESTART" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [audio]);

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
    dispatch({ type: "UNLOCK_MENU" });
  }, [audio]);

  const handleBegin = useCallback(async () => {
    preloadImage(activeMemory.brokenAsset);
    preloadImage(activeMemory.restoredAsset);
    preloadImage(rememberAssets.kintsugiCrackOverlay);
    preloadImage(rememberAssets.memoryParticles);
    preloadImage(rememberAssets.memoryPulseRing);
    preloadImage(rememberAssets.completionBurst);
    preloadImage(rememberAssets.restoredScarOverlay);

    trackRememberEvent("remember_started");
    dispatch({ type: "BEGIN_GAME" });
    void audio.startMemory();
  }, [activeMemory, audio]);

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

  return (
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
      {state.scene === "menu" && <MenuScene copy={copy.menu} onBegin={handleBegin} />}

      {state.scene === "memory" && (
        <RestoreScene
          key={activeMemory.id}
          memory={activeMemory}
          copy={copy.memory}
          completionLine={activeMemory.completionCopy[state.locale]}
          restoredFragmentIds={state.restoredFragmentIds}
          restorationPhase={state.restorationPhase}
          reducedMotion={reducedMotion}
          interactive={state.restorationPhase === "idle"}
          onRestore={handleRestore}
          onRestorationPhaseChange={handleRestorationPhaseChange}
          onRestorationComplete={handleRestorationComplete}
          onKintsugi={handleKintsugi}
          onRestored={handleRestored}
          onContinue={handleContinue}
        />
      )}
    </RememberShell>
  );
}
