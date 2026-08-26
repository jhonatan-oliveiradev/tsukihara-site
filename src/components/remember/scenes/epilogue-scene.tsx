"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type EpilogueSceneProps = {
  copy: RememberLocaleCopy["epilogue"];
  interactive: boolean;
  reducedMotion: boolean;
  onContinue: () => void;
};

export function EpilogueScene({
  copy,
  interactive,
  reducedMotion,
  onContinue,
}: EpilogueSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const eyebrow = ".remember-epilogue__eyebrow";
      const line = ".remember-epilogue__line";
      const cta = ".remember-epilogue__cta";

      if (reducedMotion) {
        gsap.set([eyebrow, line, cta], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          clearProps: "letterSpacing,textShadow",
        });
        return;
      }

      gsap.set(eyebrow, { opacity: 0, y: 8, letterSpacing: "0.48em" });
      gsap.set(line, { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.set(cta, { opacity: 0, y: 12 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          letterSpacing: "0.3em",
          duration: 1.05,
        })
        .to(
          line,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            textShadow: "0 1rem 3rem rgb(0 0 0 / 0.92), 0 0 2.8rem rgb(214 177 116 / 0.16)",
            duration: 1.65,
          },
          "-=0.28",
        )
        .to(cta, { opacity: 1, y: 0, duration: 0.8 }, "-=0.42");
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="remember-epilogue"
      aria-labelledby="remember-epilogue-title"
      style={{
        position: "relative",
        display: "grid",
        minHeight: "100%",
        placeItems: "center",
        overflow: "hidden",
        background: "#020204",
      }}
    >
      {!reducedMotion ? (
        <video
          src={rememberAssets.epilogueEclipse}
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
            opacity: 0.62,
            filter: "brightness(0.56) saturate(0.82) contrast(1.08)",
          }}
        />
      ) : null}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, transparent 8%, rgb(2 2 5 / 0.2) 44%, rgb(2 2 5 / 0.94) 100%), linear-gradient(180deg, transparent 45%, rgb(2 2 5 / 0.86) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          justifyItems: "center",
          width: "min(48rem, 88vw)",
          textAlign: "center",
          textShadow: "0 1rem 3rem rgb(0 0 0 / 0.92)",
        }}
      >
        <span
          className="remember-epilogue__eyebrow"
          style={{
            color: "rgb(211 184 146 / 0.52)",
            fontSize: "0.58rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          {copy.eyebrow}
        </span>
        <h1
          id="remember-epilogue-title"
          className="remember-epilogue__line"
          style={{
            margin: "1.2rem 0 0",
            color: "rgb(238 229 216 / 0.88)",
            fontFamily: "var(--display, Georgia, serif)",
            fontSize: "clamp(2rem, 5vw, 5.4rem)",
            fontWeight: 400,
            lineHeight: 0.98,
          }}
        >
          {copy.line}
        </h1>
        <button
          type="button"
          className="remember-epilogue__cta"
          disabled={!interactive}
          onClick={onContinue}
          style={{
            marginTop: "2.5rem",
            border: 0,
            borderBottom: "1px solid rgb(211 179 130 / 0.38)",
            padding: "0.8rem 0.3rem",
            background: "transparent",
            color: "rgb(232 218 195 / 0.82)",
            font: "inherit",
            fontSize: "0.62rem",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            cursor: interactive ? "pointer" : "default",
          }}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  );
}
