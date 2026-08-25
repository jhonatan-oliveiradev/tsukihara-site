"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type Interlude02SceneProps = {
  copy: RememberLocaleCopy["interlude02"];
  interactive: boolean;
  reducedMotion: boolean;
  onDiscovered: () => void;
  onContinue: () => void;
};

export function Interlude02Scene({
  copy,
  interactive,
  reducedMotion,
  onDiscovered,
  onContinue,
}: Interlude02SceneProps) {
  const [recordVisible, setRecordVisible] = useState(false);
  const discoveredRef = useRef(false);

  useEffect(() => {
    if (!interactive || recordVisible) return;

    const timer = window.setTimeout(
      () => {
        setRecordVisible(true);
        if (!discoveredRef.current) {
          discoveredRef.current = true;
          onDiscovered();
        }
      },
      reducedMotion ? 220 : 2200,
    );

    return () => window.clearTimeout(timer);
  }, [interactive, onDiscovered, recordVisible, reducedMotion]);

  return (
    <section
      className="remember-interlude remember-interlude--memory-network"
      aria-labelledby="remember-interlude-02-title"
      data-interlude="memory-network"
      style={{
        position: "relative",
        display: "grid",
        minHeight: "100%",
        placeItems: "center",
        overflow: "hidden",
        padding: "clamp(5rem, 9vh, 7rem) clamp(1.25rem, 5vw, 5rem)",
        background:
          "radial-gradient(circle at 50% 46%, rgb(77 24 36 / 0.16), transparent 34%), #020204",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: "5% 7%", opacity: 0.72 }}>
        <Image
          src={rememberAssets.interludeMemoryNetwork}
          alt=""
          fill
          priority
          sizes="90vw"
          style={{ objectFit: "contain", filter: "brightness(0.72) contrast(1.08)" }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, transparent 14%, rgb(2 2 5 / 0.22) 55%, rgb(2 2 5 / 0.94) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          width: "min(74rem, 100%)",
          minHeight: "min(72vh, 50rem)",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <header style={{ maxWidth: "44rem", textShadow: "0 1rem 3rem rgb(0 0 0 / 0.92)" }}>
          <span
            style={{
              color: "rgb(211 185 151 / 0.52)",
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            {copy.eyebrow}
          </span>
          <h1
            id="remember-interlude-02-title"
            style={{
              margin: "0.8rem 0 0",
              color: "rgb(237 228 215 / 0.84)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(2rem, 4.5vw, 5rem)",
              fontWeight: 400,
              lineHeight: 0.94,
            }}
          >
            {copy.title}
          </h1>
        </header>

        <div
          aria-live="polite"
          style={{
            alignSelf: "center",
            justifySelf: "center",
            display: "grid",
            gap: "0.55rem",
            width: "min(34rem, 90vw)",
            textAlign: "center",
            textShadow: "0 0.7rem 2.2rem rgb(0 0 0 / 0.94)",
          }}
        >
          {copy.lines.map((line, index) => (
            <p
              key={line}
              style={{
                margin: 0,
                color:
                  index === copy.lines.length - 1
                    ? "rgb(217 184 137 / 0.88)"
                    : "rgb(232 224 212 / 0.54)",
                fontFamily: "var(--display, Georgia, serif)",
                fontSize: "clamp(0.95rem, 1.65vw, 1.35rem)",
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          style={{
            justifySelf: "center",
            display: "grid",
            justifyItems: "center",
            gap: "0.85rem",
            minHeight: "9rem",
          }}
        >
          <div
            aria-hidden={!recordVisible}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "3.5rem auto",
              gap: "1rem",
              alignItems: "center",
              minWidth: "min(29rem, 86vw)",
              padding: "0.9rem 1.15rem",
              border: "1px solid rgb(210 176 126 / 0.2)",
              background: "rgb(7 6 9 / 0.68)",
              opacity: recordVisible ? 1 : 0,
              transform: recordVisible ? "translateY(0)" : "translateY(12px)",
              transition: reducedMotion
                ? "opacity 140ms ease"
                : "opacity 700ms ease, transform 700ms cubic-bezier(0.22, 0.8, 0.25, 1)",
            }}
          >
            <div style={{ position: "relative", width: "3.5rem", aspectRatio: "1" }}>
              <Image src={rememberAssets.akr001Signature} alt="" fill sizes="56px" />
            </div>
            <div>
              <small
                style={{
                  display: "block",
                  color: "rgb(210 190 161 / 0.42)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.24em",
                }}
              >
                {copy.record}
              </small>
              <strong
                style={{
                  display: "block",
                  marginTop: "0.25rem",
                  color: "rgb(235 222 200 / 0.92)",
                  fontFamily: "var(--display, Georgia, serif)",
                  fontSize: "1.4rem",
                  fontWeight: 400,
                  letterSpacing: "0.14em",
                }}
              >
                AKR-001
              </strong>
              <span
                style={{
                  display: "block",
                  marginTop: "0.25rem",
                  color: "rgb(177 57 77 / 0.84)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {copy.status}: {copy.restored}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!recordVisible || !interactive}
            onClick={onContinue}
            style={{
              border: 0,
              borderBottom: "1px solid rgb(211 179 130 / 0.34)",
              padding: "0.75rem 0.25rem",
              background: "transparent",
              color: "rgb(232 218 195 / 0.82)",
              font: "inherit",
              fontSize: "0.6rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: recordVisible && interactive ? 1 : 0,
              cursor: recordVisible && interactive ? "pointer" : "default",
              transition: "opacity 300ms ease, color 220ms ease",
            }}
          >
            {copy.continue}
          </button>
        </div>
      </div>
    </section>
  );
}
