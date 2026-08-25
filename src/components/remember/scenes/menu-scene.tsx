"use client";

import { useState } from "react";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type MenuSceneProps = {
  copy: RememberLocaleCopy["menu"];
  onBegin: () => Promise<void>;
};

export function MenuScene({ copy, onBegin }: MenuSceneProps) {
  const [starting, setStarting] = useState(false);

  const handleBegin = async () => {
    if (starting) return;
    setStarting(true);
    try {
      await onBegin();
    } finally {
      setStarting(false);
    }
  };

  return (
    <section className="remember-menu" aria-labelledby="remember-menu-title">
      <div className="remember-menu__brand">
        <span>{copy.eyebrow}</span>
        <small>月原</small>
      </div>

      <div className="remember-menu__title-wrap">
        <p>TSUKIHARA</p>
        <h1 id="remember-menu-title">{copy.title}</h1>
        <i aria-hidden="true" />
      </div>

      <button
        type="button"
        className="remember-menu__begin"
        onClick={handleBegin}
        disabled={starting}
      >
        <span>{starting ? "…" : copy.begin}</span>
        <i aria-hidden="true" />
      </button>

      <p className="remember-menu__thesis">RESTORE THE MEMORY. KEEP THE SCAR.</p>
    </section>
  );
}
