"use client";

import { useCallback, useEffect, useState } from "react";

const canUseFullscreen = () =>
  typeof document !== "undefined" &&
  document.fullscreenEnabled &&
  typeof document.documentElement.requestFullscreen === "function";

export function useRememberFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setFullscreenAvailable(canUseFullscreen());
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const requestFullscreen = useCallback(() => {
    const available = canUseFullscreen();
    setFullscreenAvailable(available);
    if (!available || document.fullscreenElement) return;
    void document.documentElement.requestFullscreen().catch(() => undefined);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (!document.fullscreenElement || typeof document.exitFullscreen !== "function") return;
    void document.exitFullscreen().catch(() => undefined);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setFullscreenAvailable(canUseFullscreen());
    if (document.fullscreenElement) {
      exitFullscreen();
      return;
    }
    requestFullscreen();
  }, [exitFullscreen, requestFullscreen]);

  return {
    isFullscreen,
    fullscreenAvailable,
    requestFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
