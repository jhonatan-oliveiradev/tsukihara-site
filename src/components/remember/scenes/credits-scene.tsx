"use client";

import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type CreditsSceneProps = {
  copy: RememberLocaleCopy["credits"];
  interactive: boolean;
  reducedMotion: boolean;
  onReturn: () => void;
};

export function CreditsScene({ copy, interactive, reducedMotion, onReturn }: CreditsSceneProps) {
  return (
    <section
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
          aria-hidden="true"
          style={{
            marginTop: "1.3rem",
            color: "rgb(202 169 116 / 0.32)",
            fontFamily: "var(--display, Georgia, serif)",
            fontSize: "clamp(2rem, 4vw, 4rem)",
          }}
        >
          月原
        </span>
        <button
          type="button"
          disabled={!interactive}
          onClick={onReturn}
          style={{
            marginTop: "2.4rem",
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
      </div>
    </section>
  );
}
