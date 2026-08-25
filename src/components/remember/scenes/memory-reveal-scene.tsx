"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type MemoryRevealSceneProps = {
  copy: RememberLocaleCopy["akari"];
  interactive: boolean;
  reducedMotion: boolean;
  onContinue: () => void;
};

export function MemoryRevealScene({
  copy,
  interactive,
  reducedMotion,
  onContinue,
}: MemoryRevealSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const image = root.querySelector("[data-akari-image]");
      const record = root.querySelector("[data-akari-record]");
      const title = root.querySelector("[data-akari-title]");
      const line = root.querySelector("[data-akari-line]");
      const action = root.querySelector("[data-akari-action]");

      if (reducedMotion) {
        gsap.fromTo(
          [image, record, title, line, action],
          { opacity: 0 },
          { opacity: 1, duration: 0.2, stagger: 0.05 },
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" }, delay: 0.18 })
        .fromTo(image, { opacity: 0, scale: 1.035 }, { opacity: 0.72, scale: 1, duration: 1.5 })
        .fromTo(record, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.5)
        .fromTo(
          title,
          { opacity: 0, y: 18, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          0.82,
        )
        .fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.65 }, 1.28)
        .fromTo(action, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45 }, 1.72);
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="remember-akari-reveal"
      aria-labelledby="remember-akari-reveal-title"
      style={{
        position: "relative",
        display: "grid",
        minHeight: "100%",
        placeItems: "center",
        overflow: "hidden",
        background: "#020204",
      }}
    >
      <div data-akari-image aria-hidden="true" style={{ position: "absolute", inset: "4% 8%" }}>
        <Image
          src={rememberAssets.akariReveal}
          alt=""
          fill
          priority
          sizes="90vw"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            filter: "brightness(0.72) saturate(0.9) contrast(1.05)",
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgb(2 2 4 / 0.96) 0%, rgb(2 2 4 / 0.44) 33%, rgb(2 2 4 / 0.24) 58%, rgb(2 2 4 / 0.86) 100%), linear-gradient(180deg, rgb(2 2 4 / 0.42), transparent 40%, rgb(2 2 4 / 0.9) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          width: "min(76rem, 90vw)",
          minHeight: "min(70vh, 50rem)",
          alignContent: "end",
          paddingBottom: "clamp(1rem, 4vh, 3rem)",
        }}
      >
        <div style={{ maxWidth: "35rem", textShadow: "0 1rem 3rem rgb(0 0 0 / 0.95)" }}>
          <span
            data-akari-record
            style={{
              color: "rgb(210 180 137 / 0.6)",
              fontSize: "0.58rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            AKR-001 · {copy.eyebrow}
          </span>
          <h1
            id="remember-akari-reveal-title"
            data-akari-title
            style={{
              margin: "0.75rem 0 0",
              color: "rgb(243 233 220 / 0.94)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(3.3rem, 8vw, 9rem)",
              fontWeight: 400,
              lineHeight: 0.82,
              letterSpacing: "-0.04em",
            }}
          >
            {copy.title}
          </h1>
          <p
            data-akari-line
            style={{
              margin: "1.3rem 0 0",
              color: "rgb(232 221 205 / 0.68)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(1rem, 1.65vw, 1.35rem)",
              lineHeight: 1.5,
            }}
          >
            {copy.line}
          </p>
          <button
            data-akari-action
            type="button"
            disabled={!interactive}
            onClick={onContinue}
            style={{
              marginTop: "2rem",
              border: 0,
              borderBottom: "1px solid rgb(211 179 130 / 0.4)",
              padding: "0.78rem 0.3rem",
              background: "transparent",
              color: "rgb(232 218 195 / 0.84)",
              font: "inherit",
              fontSize: "0.62rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: interactive ? 1 : 0.38,
              cursor: interactive ? "pointer" : "default",
            }}
          >
            {copy.continue}
          </button>
        </div>
      </div>
    </section>
  );
}
