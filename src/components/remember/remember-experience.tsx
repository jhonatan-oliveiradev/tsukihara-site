"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useRememberAudio } from "@/components/remember/audio/use-remember-audio";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import { RememberShell } from "@/components/remember/remember-shell";
import { EntryScene } from "@/components/remember/scenes/entry-scene";
import { MemoryRevealScene } from "@/components/remember/scenes/memory-reveal-scene";
import { RestoreScene } from "@/components/remember/scenes/restore-scene";
import { rememberReducer } from "@/components/remember/state/remember-reducer";
import { initialRememberState } from "@/components/remember/state/remember-state";
import { trackRememberEvent } from "@/components/remember/system/remember-analytics";
import { useRememberReducedMotion } from "@/components/remember/system/use-remember-reduced-motion";
import { useRememberScrollLock } from "@/components/remember/system/use-remember-scroll-lock";

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

  useRememberScrollLock();

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

  const handleEnter = useCallback(async () => {
    await audio.unlock().catch(() => undefined);

    preloadImage(rememberAssets.hanamoriBroken);
    preloadImage(rememberAssets.hanamoriRestored);
    trackRememberEvent("remember_started");
    dispatch({ type: "ENTER" });
    void audio.enterRestore();
  }, [audio]);

  const handleRestore = useCallback(
    (fragmentId: string) => {
      if (state.scene !== "restore" || state.restoredFragmentIds.includes(fragmentId)) return;
      audio.playKintsugi();
      dispatch({ type: "RESTORE_FRAGMENT", fragmentId, totalFragments: 5 });
    },
    [audio, state.restoredFragmentIds, state.scene],
  );

  return (
    <RememberShell muted={state.muted} onExit={handleExit} onToggleMute={handleToggleMute}>
      {state.scene === "entry" && (
        <EntryScene reducedMotion={reducedMotion} onEnter={handleEnter} />
      )}

      {state.scene !== "entry" && (
        <RestoreScene
          restoredFragmentIds={state.restoredFragmentIds}
          reducedMotion={reducedMotion}
          interactive={state.scene === "restore"}
          onRestore={handleRestore}
        />
      )}

      {state.scene === "memory-reveal" && (
        <MemoryRevealScene reducedMotion={reducedMotion} onReveal={audio.playReveal} />
      )}
    </RememberShell>
  );
}
