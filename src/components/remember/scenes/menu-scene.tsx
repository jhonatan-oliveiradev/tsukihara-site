"use client";

import { useState } from "react";
import type { TitleMenuPolicy } from "@/components/remember/archive/archive-policy";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import type { RememberLocale } from "@/components/remember/state/remember-state";
import { JpRevealText } from "@/components/shared/jp-reveal-text";

type MenuSceneProps = {
  copy: RememberLocaleCopy["menu"];
  locale: RememberLocale;
  revealReady: boolean;
  policy: TitleMenuPolicy;
  progressLabel?: string | null;
  onPrimary: () => Promise<void>;
  onNewGame: () => Promise<void>;
  onOpenArchive: () => void;
};

export function MenuScene({
  copy,
  locale,
  revealReady,
  policy,
  progressLabel,
  onPrimary,
  onNewGame,
  onOpenArchive,
}: MenuSceneProps) {
  const [starting, setStarting] = useState(false);
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);

  const run = async (action: () => Promise<void>) => {
    if (starting) return;
    setStarting(true);
    try {
      await action();
    } finally {
      setStarting(false);
    }
  };

  const primaryLabel =
    policy.primary === "continue"
      ? copy.continue
      : policy.primary === "revisit"
        ? copy.revisit
        : copy.newGame;

  const handlePrimary = () =>
    void run(policy.primary === "new-game" ? onNewGame : onPrimary);

  const handleConfirmedNewGame = () => {
    setConfirmingNewGame(false);
    void run(onNewGame);
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

      {policy.primary === "continue" && progressLabel ? (
        <p className="remember-menu__progress">
          <span>{copy.progress}</span>
          <strong>{progressLabel}</strong>
        </p>
      ) : null}

      <div className="remember-menu__actions">
        <button
          type="button"
          className="remember-menu__begin"
          onClick={handlePrimary}
          disabled={starting}
        >
          <span>{starting ? "…" : primaryLabel}</span>
          <i aria-hidden="true" />
        </button>

        {policy.showNewGame ? (
          <button
            type="button"
            className="remember-menu__secondary"
            onClick={() => setConfirmingNewGame(true)}
            disabled={starting}
          >
            {copy.newGame}
          </button>
        ) : null}

        {policy.primary !== "new-game" ? (
          <button type="button" className="remember-menu__secondary" onClick={onOpenArchive}>
            {copy.archive}
          </button>
        ) : null}
      </div>

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

      {confirmingNewGame ? (
        <div className="remember-menu-confirm" role="alertdialog" aria-modal="true">
          <div className="remember-menu-confirm__sigil" aria-hidden="true">
            月
          </div>
          <p>{copy.beginAgain}</p>
          <span>{copy.beginAgainBody}</span>
          <div>
            <button type="button" onClick={handleConfirmedNewGame} disabled={starting}>
              {copy.confirm}
            </button>
            <button type="button" onClick={() => setConfirmingNewGame(false)} disabled={starting}>
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
