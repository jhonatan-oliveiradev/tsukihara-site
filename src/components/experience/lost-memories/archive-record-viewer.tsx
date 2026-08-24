"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getArchiveImageStyle } from "@/components/experience/lost-memories/archive-image-crop";
import { MemoryDecayText } from "@/components/experience/lost-memories/memory-decay-text";
import type { ArchiveRecord } from "@/components/experience/lost-memories/lost-memories-types";

type ArchiveRecordViewerProps = {
  record: ArchiveRecord | null;
  onClose: () => void;
  closeLabel: string;
};

type BlackPhase = "silent" | "revealed";

export function ArchiveRecordViewer({ record, onClose, closeLabel }: ArchiveRecordViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const decayTimerRef = useRef<number | null>(null);
  const blackTimerRef = useRef<number | null>(null);
  const [decayActive, setDecayActive] = useState(false);
  const [blackPhase, setBlackPhase] = useState<BlackPhase>("revealed");

  useEffect(() => {
    if (!record) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDecayActive(false);
    setBlackPhase(record.kind === "black" && !reduced ? "silent" : "revealed");

    requestAnimationFrame(() => closeRef.current?.focus());

    if (record.decay && !reduced) {
      decayTimerRef.current = window.setTimeout(() => setDecayActive(true), 3500);
    }

    if (record.kind === "black" && !reduced) {
      blackTimerRef.current = window.setTimeout(() => setBlackPhase("revealed"), 1200);
    }

    return () => {
      if (decayTimerRef.current !== null) window.clearTimeout(decayTimerRef.current);
      if (blackTimerRef.current !== null) window.clearTimeout(blackTimerRef.current);
      decayTimerRef.current = null;
      blackTimerRef.current = null;
    };
  }, [record]);

  useEffect(() => {
    if (!record) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, record]);

  if (!record) return null;

  const restoreDecay = () => setDecayActive(false);
  const isBlack = record.kind === "black";

  return (
    <div
      className={isBlack ? "ix-archive-viewer is-black" : "ix-archive-viewer"}
      data-archive-viewer
      data-archive-kind={record.kind}
      data-black-phase={isBlack ? blackPhase : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`archive-viewer-title-${record.id}`}
    >
      <div className="ix-archive-viewer__veil" aria-hidden="true" />
      <div className="ix-archive-viewer__stage">
        <button ref={closeRef} type="button" className="ix-archive-viewer__close" onClick={onClose}>
          <span aria-hidden="true">×</span>
          <span>{closeLabel}</span>
        </button>

        <div className="ix-archive-viewer__asset" aria-hidden="true">
          <Image
            src={record.asset}
            alt=""
            fill
            sizes="(max-width: 900px) 92vw, 52vw"
            style={getArchiveImageStyle(record, "viewer")}
            className="ix-archive-viewer__image"
          />
        </div>

        <article className="ix-archive-viewer__document">
          <header>
            <span>{record.code}</span>
            <span data-status={record.status}>{record.status}</span>
            <h3 id={`archive-viewer-title-${record.id}`}>{record.title}</h3>
          </header>

          {isBlack && blackPhase === "silent" ? (
            <div className="ix-archive-viewer__silence" aria-live="polite">
              <i />
              <span>•••</span>
            </div>
          ) : (
            <div
              className="ix-archive-viewer__story"
              onPointerMove={restoreDecay}
              onPointerEnter={restoreDecay}
              onFocus={restoreDecay}
            >
              {record.story.map((paragraph, index) => (
                <p key={`${record.id}-${index}`}>
                  {record.decay ? (
                    <MemoryDecayText text={paragraph} active={decayActive} />
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
              {record.annotation && <small>{record.annotation}</small>}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
