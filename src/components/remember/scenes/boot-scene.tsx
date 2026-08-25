"use client";

import { useState } from "react";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type BootSceneProps = {
  copy: RememberLocaleCopy["boot"];
  onUnlock: () => Promise<void>;
};

export function BootScene({ copy, onUnlock }: BootSceneProps) {
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (unlocking) return;
    setUnlocking(true);
    try {
      await onUnlock();
    } finally {
      setUnlocking(false);
    }
  };

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
        <span className="remember-boot__prompt">{unlocking ? "…" : copy.prompt}</span>
        <small>{copy.headphones}</small>
      </button>
    </section>
  );
}
