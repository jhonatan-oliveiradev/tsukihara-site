"use client";

import { useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import Image from "next/image";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import {
  INTERLUDE_01_TRACE_IDS,
  isInterlude01Complete,
  recordInterlude01Trace,
  type Interlude01TraceId,
} from "./interlude-01-policy";

type Interlude01SceneProps = {
  copy: RememberLocaleCopy["interlude01"];
  interactive: boolean;
  reducedMotion: boolean;
  onContinue: () => void;
};

const tracePositions: Record<Interlude01TraceId, CSSProperties> = {
  "lunar-residue": { left: "22%", top: "31%" },
  "broken-path": { left: "66%", top: "29%" },
  "memory-pulse": { left: "56%", top: "64%" },
  "distant-echo": { left: "30%", top: "70%" },
};

export function Interlude01Scene({
  copy,
  interactive,
  reducedMotion,
  onContinue,
}: Interlude01SceneProps) {
  const [discovered, setDiscovered] = useState<Interlude01TraceId[]>([]);
  const complete = isInterlude01Complete(discovered);

  const discover = (traceId: Interlude01TraceId) => {
    if (!interactive) return;
    setDiscovered((current) => recordInterlude01Trace(current, traceId));
  };

  const handlePointerEnter =
    (traceId: Interlude01TraceId) => (_event: PointerEvent<HTMLButtonElement>) => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) discover(traceId);
    };

  const handleFocus = (traceId: Interlude01TraceId) => (_event: FocusEvent<HTMLButtonElement>) => {
    discover(traceId);
  };

  return (
    <section
      className="remember-interlude remember-interlude--unknown-signature"
      aria-labelledby="remember-interlude-01-title"
      data-interlude="unknown-signature"
      style={{
        position: "relative",
        display: "grid",
        minHeight: "100%",
        placeItems: "center",
        overflow: "hidden",
        padding: "clamp(5.5rem, 11vh, 8rem) clamp(1.25rem, 5vw, 5rem) 5rem",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: "8% 7% 9%", opacity: 0.55 }}>
        <Image
          src={rememberAssets.interludeUnknownMemory}
          alt=""
          fill
          priority
          sizes="90vw"
          style={{
            objectFit: "cover",
            filter: "brightness(0.62) saturate(0.72) contrast(1.08)",
            opacity: reducedMotion ? 0.52 : 0.66,
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 48%, transparent 20%, rgb(2 4 8 / 0.35) 62%, rgb(2 4 8 / 0.92) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          width: "min(78rem, 100%)",
          minHeight: "min(68vh, 48rem)",
          alignItems: "end",
        }}
      >
        <header
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            maxWidth: "min(38rem, 82vw)",
            textShadow: "0 0.8rem 2.5rem rgb(0 0 0 / 0.88)",
          }}
        >
          <span
            style={{
              display: "block",
              color: "rgb(205 184 153 / 0.55)",
              fontSize: "0.6rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            {copy.eyebrow}
          </span>
          <h1
            id="remember-interlude-01-title"
            style={{
              margin: "0.7rem 0 0",
              color: "rgb(226 218 205 / 0.82)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(1.7rem, 3.8vw, 4.2rem)",
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: "0.035em",
            }}
          >
            {copy.title}
          </h1>
        </header>

        <div aria-label={`${copy.trace} ${discovered.length} / 4`}>
          {INTERLUDE_01_TRACE_IDS.map((traceId, index) => {
            const found = discovered.includes(traceId);
            return (
              <button
                key={traceId}
                type="button"
                disabled={!interactive}
                aria-pressed={found}
                aria-label={`${copy.trace} ${String(index + 1).padStart(2, "0")}: ${copy.traceLabels[index]}`}
                onPointerEnter={handlePointerEnter(traceId)}
                onFocus={handleFocus(traceId)}
                onClick={() => discover(traceId)}
                style={{
                  ...tracePositions[traceId],
                  position: "absolute",
                  width: found ? "1rem" : "0.72rem",
                  height: found ? "1rem" : "0.72rem",
                  padding: 0,
                  transform: "translate(-50%, -50%)",
                  border: "1px solid rgb(199 181 151 / 0.52)",
                  borderRadius: "50%",
                  background: found ? "rgb(218 197 158 / 0.7)" : "rgb(8 12 18 / 0.58)",
                  boxShadow: found
                    ? "0 0 1.8rem rgb(220 193 145 / 0.7)"
                    : "0 0 1.4rem rgb(153 190 220 / 0.24)",
                  cursor: interactive ? "pointer" : "default",
                  opacity: interactive ? 1 : 0.45,
                  transition: reducedMotion
                    ? "opacity 120ms ease"
                    : "transform 320ms ease, box-shadow 320ms ease, background 320ms ease",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            justifySelf: "center",
            width: "min(42rem, 100%)",
            textAlign: "center",
            textShadow: "0 0.6rem 2rem rgb(0 0 0 / 0.9)",
          }}
          aria-live="polite"
        >
          <p
            style={{
              margin: 0,
              color: "rgb(232 226 216 / 0.72)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
            }}
          >
            {copy.lineOne}
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: complete ? "rgb(224 198 157 / 0.92)" : "rgb(232 226 216 / 0.38)",
              fontFamily: "var(--display, Georgia, serif)",
              fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
              transition: "color 400ms ease",
            }}
          >
            {copy.lineTwo}
          </p>
          <small
            style={{
              display: "block",
              marginTop: "1.25rem",
              color: "rgb(209 196 177 / 0.42)",
              fontSize: "0.58rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            {complete
              ? copy.complete
              : `${copy.trace} ${String(discovered.length).padStart(2, "0")} / 04`}
          </small>

          <button
            type="button"
            disabled={!complete || !interactive}
            onClick={onContinue}
            style={{
              marginTop: "1.35rem",
              padding: "0.9rem 1.35rem",
              border: "1px solid rgb(203 180 142 / 0.32)",
              background: "rgb(8 10 14 / 0.56)",
              color: "rgb(225 210 185 / 0.82)",
              font: "inherit",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: complete && interactive ? 1 : 0.25,
              cursor: complete && interactive ? "pointer" : "default",
              pointerEvents: complete && interactive ? "auto" : "none",
            }}
          >
            {copy.continue}
          </button>
        </div>
      </div>
    </section>
  );
}
