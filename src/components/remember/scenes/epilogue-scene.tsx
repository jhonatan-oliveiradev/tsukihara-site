"use client";

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
  return (
    <section
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
            opacity: interactive ? 1 : 0.38,
            cursor: interactive ? "pointer" : "default",
          }}
        >
          {copy.continue}
        </button>
      </div>
    </section>
  );
}
