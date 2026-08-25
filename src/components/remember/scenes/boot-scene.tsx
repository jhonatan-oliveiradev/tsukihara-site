"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type BootSceneProps = {
  copy: RememberLocaleCopy["boot"];
  onUnlock: () => Promise<void>;
};

export function BootScene({ copy, onUnlock }: BootSceneProps) {
  const [unlocking, setUnlocking] = useState(false);
  const unlockingRef = useRef(false);

  const handleUnlock = useCallback(async () => {
    if (unlockingRef.current) return;
    unlockingRef.current = true;
    setUnlocking(true);
    try {
      await onUnlock();
    } finally {
      unlockingRef.current = false;
      setUnlocking(false);
    }
  }, [onUnlock]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;

      const validKey =
        event.key === "Enter" || event.key === " " || event.key.length === 1;
      if (!validKey) return;

      event.preventDefault();
      void handleUnlock();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUnlock]);

  return (
    <section className="remember-boot" aria-labelledby="remember-boot-title">
      <button
        type="button"
        className="remember-boot__hit"
        onClick={handleUnlock}
        disabled={unlocking}
        aria-label={copy.prompt}
      >
        <span className="remember-boot__sigil" aria-hidden="true">
          <i />月
        </span>
        <span id="remember-boot-title" className="remember-boot__title">
          REMEMBER
        </span>
        <span className="remember-boot__prompt">
          {unlocking ? "…" : copy.prompt}
        </span>
        <small>{copy.headphones}</small>
      </button>
    </section>
  );
}
