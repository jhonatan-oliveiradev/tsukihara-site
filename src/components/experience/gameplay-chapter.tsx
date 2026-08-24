"use client";

import Image from "next/image";
import { useRef } from "react";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { useGameplayChapterTimeline } from "@/components/experience/gameplay/use-gameplay-chapter-timeline";
import {
  gameplayAssets,
  gameplayChapterCopy,
  type GameplayLocale,
} from "@/content/gameplay-chapter";

type GameplayChapterProps = {
  locale: GameplayLocale;
};

const sceneAssets = {
  explore: gameplayAssets.explore,
  traverse: gameplayAssets.traverse,
  combat: gameplayAssets.combat,
  boss: gameplayAssets.boss,
} as const;

export function GameplayChapter({ locale }: GameplayChapterProps) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = gameplayChapterCopy[locale];

  useGameplayChapterTimeline(rootRef);

  return (
    <section id="gameplay" ref={rootRef} data-section className="ix-gameplay">
      <div className="ix-gameplay__intro" data-reveal>
        <div className="ix-section-label">
          <span>{copy.eyebrow}</span>
          <i />
          <span>遊戯</span>
        </div>
        <div className="ix-gameplay__intro-grid">
          <h2>
            <JpRevealText
              jp={copy.titleJp}
              text={copy.title}
              locale={locale}
              duration={1180}
              delay={90}
            />
          </h2>
          <p>{copy.intro}</p>
        </div>
      </div>

      <div className="ix-gameplay__desktop-stage">
        <div className="ix-gameplay__sticky">
          <div className="ix-gameplay__visuals" aria-hidden="true">
            <article className="ix-gameplay__scene is-explore" data-gameplay-scene="explore">
              <Image
                src={sceneAssets.explore}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image"
                priority={false}
              />
            </article>

            <article className="ix-gameplay__scene is-reveal" data-gameplay-scene="reveal">
              <Image
                src={gameplayAssets.revealBefore}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image"
              />
              <div className="ix-gameplay__layer" data-gameplay-reveal-after>
                <Image
                  src={gameplayAssets.revealAfter}
                  alt=""
                  fill
                  sizes="100vw"
                  className="ix-gameplay__image"
                />
              </div>
              <i className="ix-gameplay__seam" data-gameplay-reveal-seam />
            </article>

            <article className="ix-gameplay__scene is-restore" data-gameplay-scene="restore">
              <Image
                src={gameplayAssets.restoreBefore}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image"
              />
              <div className="ix-gameplay__layer" data-gameplay-restore-after>
                <Image
                  src={gameplayAssets.restoreAfter}
                  alt=""
                  fill
                  sizes="100vw"
                  className="ix-gameplay__image"
                />
              </div>
              <i className="ix-gameplay__crack-light" data-gameplay-crack-light />
            </article>

            <article className="ix-gameplay__scene is-traverse" data-gameplay-scene="traverse">
              <Image
                src={sceneAssets.traverse}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image"
              />
            </article>

            <article className="ix-gameplay__scene is-combat" data-gameplay-scene="combat">
              <Image
                src={sceneAssets.combat}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image"
              />
              <div className="ix-gameplay__combat-shift" data-gameplay-combat-shift>
                <Image
                  src={gameplayAssets.combatShift}
                  alt=""
                  fill
                  sizes="100vw"
                  className="ix-gameplay__image"
                />
              </div>
              <Image
                src={gameplayAssets.combatFx}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__combat-fx"
                data-gameplay-combat-fx
              />
            </article>

            <article className="ix-gameplay__scene is-boss" data-gameplay-scene="boss">
              <Image
                src={sceneAssets.boss}
                alt=""
                fill
                sizes="100vw"
                className="ix-gameplay__image ix-gameplay__boss-image"
                data-gameplay-boss-image
              />
            </article>

            <Image
              src={gameplayAssets.environmentFx}
              alt=""
              fill
              sizes="100vw"
              className="ix-gameplay__environment-fx"
              data-gameplay-environment-fx
            />
            <div className="ix-gameplay__veil" />
          </div>

          <div className="ix-gameplay__copy-stack">
            {copy.beats.map((beat, index) => (
              <article
                key={beat.id}
                className={`ix-gameplay__copy ix-gameplay__copy--${beat.id}`}
                data-gameplay-copy={beat.id}
              >
                <span className="ix-gameplay__index">{beat.index} / 06</span>
                <h3>
                  <JpRevealText
                    jp={beat.titleJp}
                    text={beat.title}
                    locale={locale}
                    duration={920}
                    delay={40}
                    deferred
                  />
                </h3>
                <p>{beat.copy}</p>
                <small>{beat.microcopy}</small>
                {index === 4 && (
                  <div className="ix-gameplay__combat-meta" aria-hidden="true">
                    <span>KATANA</span>
                    <span>KINTSUGI</span>
                    <span>MOBILITY</span>
                    <span>LUNAR ARTS</span>
                  </div>
                )}
              </article>
            ))}
          </div>

          <nav className="ix-gameplay__progress" aria-label={copy.eyebrow}>
            {copy.beats.map((beat) => (
              <span key={beat.id} data-gameplay-progress={beat.id}>
                <b>{beat.index}</b>
                <i />
                <small>{beat.id.toUpperCase()}</small>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="ix-gameplay__mobile-flow">
        {copy.beats.map((beat) => {
          const source =
            beat.id === "explore"
              ? gameplayAssets.explore
              : beat.id === "reveal"
                ? gameplayAssets.revealAfterAlt
                : beat.id === "restore"
                  ? gameplayAssets.restoreAfter
                  : beat.id === "traverse"
                    ? gameplayAssets.traverse
                    : beat.id === "combat"
                      ? gameplayAssets.combat
                      : gameplayAssets.bossAlt;

          return (
            <article key={beat.id} className="ix-gameplay-mobile" data-reveal>
              <div className="ix-gameplay-mobile__visual">
                <Image src={source} alt="" fill sizes="100vw" className="ix-gameplay__image" />
              </div>
              <span>{beat.index} / 06</span>
              <h3>
                <JpRevealText
                  jp={beat.titleJp}
                  text={beat.title}
                  locale={locale}
                  duration={820}
                  delay={40}
                />
              </h3>
              <p>{beat.copy}</p>
              <small>{beat.microcopy}</small>
            </article>
          );
        })}
      </div>

      <section
        className="ix-gameplay-reel"
        aria-label={locale === "pt" ? "Registro de combate" : "Combat reel"}
        data-reveal
      >
        <div className="ix-gameplay-reel__meta">
          <span>COMBAT REEL / FIELD FOOTAGE</span>
          <small>2.5D · ACTION · EXPLORATION</small>
        </div>
        <div className="ix-gameplay-reel__frame">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src="/assets_hq/video_battle.mp4" type="video/mp4" />
          </video>
          <span className="ix-gameplay-reel__veil" aria-hidden="true" />
          <span className="ix-gameplay-reel__code" aria-hidden="true">
            KINTSUGI COMBAT / 04
          </span>
        </div>
      </section>

      <div className="ix-gameplay__closing" data-reveal>
        <div className="ix-gameplay__closing-visual" aria-hidden="true">
          <Image
            src={gameplayAssets.closing}
            alt=""
            fill
            sizes="100vw"
            className="ix-gameplay__image"
          />
          <div />
        </div>
        <div className="ix-gameplay__closing-copy">
          <h3>
            <JpRevealText
              jp={copy.closing.titleJp}
              text={copy.closing.title}
              locale={locale}
              duration={1040}
              delay={70}
            />
          </h3>
          <p>{copy.closing.body}</p>
          <strong>{copy.closing.signature}</strong>
        </div>
      </div>
    </section>
  );
}
