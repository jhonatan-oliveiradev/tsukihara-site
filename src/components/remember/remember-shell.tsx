"use client";

import type { ReactNode } from "react";
import { getRememberCopy } from "@/components/remember/content/remember-locales";
import type { RememberLocale, RememberScene } from "@/components/remember/state/remember-state";
import { SoundToggle } from "@/components/shared/sound-toggle";

type RememberShellProps = {
  children: ReactNode;
  scene: RememberScene;
  locale: RememberLocale;
  muted: boolean;
  onExit: () => void;
  onToggleMute: () => void;
  onLocaleChange: (locale: RememberLocale) => void;
};

export function RememberShell({
  children,
  scene,
  locale,
  muted,
  onExit,
  onToggleMute,
  onLocaleChange,
}: RememberShellProps) {
  const copy = getRememberCopy(locale);
  const showControls = scene !== "boot";

  return (
    <main className="remember-root" data-remember-root data-remember-scene={scene}>
      <div className="remember-root__grain" aria-hidden="true" />
      <div className="remember-root__vignette" aria-hidden="true" />
      <span className="remember-root__moon" aria-hidden="true">
        月
      </span>

      {showControls && (
        <div className="remember-game-controls" aria-label="REMEMBER controls">
          <div className="remember-language" aria-label={copy.menu.language}>
            {(["pt", "en"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={locale === option ? "is-active" : undefined}
                aria-pressed={locale === option}
                onClick={() => onLocaleChange(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <SoundToggle
            muted={muted}
            label={muted ? copy.controls.soundOff : copy.controls.soundOn}
            onToggle={onToggleMute}
            className="remember-sound-toggle"
          />

          <button type="button" className="remember-exit-toggle" onClick={onExit}>
            <span aria-hidden="true">×</span>
            <span>{copy.controls.exit}</span>
          </button>
        </div>
      )}

      <div className="remember-stage">{children}</div>
    </main>
  );
}
