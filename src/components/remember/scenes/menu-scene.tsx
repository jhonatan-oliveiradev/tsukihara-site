"use client";

import { useState } from "react";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import type { RememberLocale } from "@/components/remember/state/remember-state";
import { JpRevealText } from "@/components/shared/jp-reveal-text";

type MenuSceneProps = {
  copy: RememberLocaleCopy["menu"];
  locale: RememberLocale;
  revealReady: boolean;
  onBegin: () => Promise<void>;
};

export function MenuScene({ copy, locale, revealReady, onBegin }: MenuSceneProps) {
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
        <h1 id="remember-menu-title" aria-label={copy.title}>
          {revealReady ? (
            <JpRevealText
              jp="記憶"
              text={copy.title}
              locale={locale}
              duration={1120}
              className="remember-menu__title-reveal"
            />
          ) : (
            <span className="remember-menu__title-reveal" aria-hidden="true">
              記憶
            </span>
          )}
        </h1>
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

      <p className="remember-menu__thesis" aria-label={copy.thesis}>
        {revealReady ? (
          <JpRevealText
            jp="記憶を取り戻せ"
            text={copy.thesis}
            locale={locale}
            duration={980}
            delay={240}
          />
        ) : (
          <span aria-hidden="true">記憶を取り戻せ</span>
        )}
      </p>
    </section>
  );
}
