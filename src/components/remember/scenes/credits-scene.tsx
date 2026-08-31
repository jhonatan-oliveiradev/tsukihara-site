"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

const CREATOR_NAME = "JHONATAN OLIVEIRA";

type CreditsSceneProps = {
  copy: RememberLocaleCopy["credits"];
  interactive: boolean;
  reducedMotion: boolean;
  onReturn: () => void;
  onReplay: () => void;
};

export function CreditsScene({
  copy,
  interactive,
  reducedMotion,
  onReturn,
  onReplay,
}: CreditsSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const eyebrow = ".remember-credits__eyebrow";
      const title = ".remember-credits__title";
      const moon = ".remember-credits__moon";
      const actions = ".remember-credits__actions";

      if (reducedMotion) {
        gsap.set([eyebrow, title, moon, actions], {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        return;
      }

      gsap.set(eyebrow, { opacity: 0, y: 8, letterSpacing: "0.45em" });
      gsap.set(title, { opacity: 0, y: 26, filter: "blur(12px)" });
      gsap.set(moon, { opacity: 0, scale: 0.94, y: 10 });
      gsap.set(actions, { opacity: 0, y: 14 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          letterSpacing: "0.28em",
          duration: 0.95,
        })
        .to(
          title,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            textShadow:
              "0 1rem 3rem rgb(0 0 0 / 0.95), 0 0 2.5rem rgb(225 187 117 / 0.28), 0 0 5rem rgb(225 187 117 / 0.12)",
            duration: 1.7,
          },
          "-=0.25",
        )
        .to(moon, { opacity: 1, scale: 1, y: 0, duration: 1.05 }, "-=0.55")
        .to(actions, { opacity: 1, y: 0, duration: 0.8 }, "-=0.35");

      gsap.to(moon, {
        opacity: 0.62,
        textShadow: "0 0 2.4rem rgb(215 176 112 / 0.32)",
        duration: 2.6,
        delay: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="remember-credits"
      aria-labelledby="remember-credits-title"
      style={{
        position: "relative",
        display: "grid",
        minHeight: "100%",
        placeItems: "center",
        overflow: "hidden",
        background: "#010103",
      }}
    >
      {!reducedMotion ? (
        <video
          src={rememberAssets.creditsLoop}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.42,
            filter: "brightness(0.46) saturate(0.68)",
          }}
        />
      ) : null}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 46%, transparent 6%, rgb(1 1 3 / 0.28) 42%, rgb(1 1 3 / 0.96) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          justifyItems: "center",
          width: "min(54rem, 90vw)",
          textAlign: "center",
          textShadow: "0 1rem 3rem rgb(0 0 0 / 0.95)",
        }}
      >
        <span
          className="remember-credits__eyebrow"
          style={{
            color: "rgb(211 185 151 / 0.48)",
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {copy.eyebrow}
        </span>
        <h1
          id="remember-credits-title"
          className="remember-credits__title"
          style={{
            margin: "1.15rem 0 0",
            color: "rgb(239 230 218 / 0.9)",
            fontFamily: "var(--display, Georgia, serif)",
            fontSize: "clamp(2.4rem, 6vw, 6.8rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
          }}
        >
          {copy.title}
        </h1>
        <span
          className="remember-credits__moon"
          aria-hidden="true"
          style={{
            marginTop: "1.3rem",
            color: "rgb(202 169 116 / 0.42)",
            fontFamily: "var(--display, Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 4rem)",
          }}
        >
          月原
        </span>
        <div
          className="remember-credits__actions"
          style={{
            display: "grid",
            justifyItems: "center",
            gap: "0.9rem",
            marginTop: "2.4rem",
          }}
        >
          <button
            type="button"
            className="remember-credits__primary"
            disabled={!interactive}
            onClick={onReturn}
            style={{
              border: 0,
              borderBottom: "1px solid rgb(211 179 130 / 0.38)",
              padding: "0.8rem 0.3rem",
              background: "transparent",
              color: "rgb(232 218 195 / 0.82)",
              font: "inherit",
              fontSize: "0.62rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: interactive ? 1 : 0.38,
              cursor: interactive ? "pointer" : "default",
            }}
          >
            {copy.cta}
          </button>
          <button
            type="button"
            className="remember-menu__secondary remember-credits__replay"
            disabled={!interactive}
            onClick={onReplay}
            style={{
              marginTop: 0,
              opacity: interactive ? 1 : 0.28,
              cursor: interactive ? "pointer" : "default",
            }}
          >
            {copy.replay}
          </button>
        </div>
      </div>

      <aside
        className={["remember-credits__roll-viewport", reducedMotion && "is-static"]
          .filter(Boolean)
          .join(" ")}
        aria-label={copy.creditsLabel}
      >
        <div className="remember-credits__roll-track">
          <span className="remember-credits__roll-title">{copy.creditsLabel}</span>
          {copy.creditRoles.map((role) => (
            <div className="remember-credits__credit" key={role}>
              <small>{role}</small>
              <strong>JHONATAN OLIVEIRA</strong>
            </div>
          ))}
          <span className="remember-credits__signature" aria-hidden="true">
            月原 · {CREATOR_NAME}
          </span>
        </div>
      </aside>
    </section>
  );
}
