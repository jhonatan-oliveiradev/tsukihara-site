"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getArchiveImageSource,
  getArchiveImageStyle,
} from "@/components/experience/lost-memories/archive-image-crop";
import { MemoryDecayText } from "@/components/experience/lost-memories/memory-decay-text";
import type { ArchiveRecord } from "@/components/experience/lost-memories/lost-memories-types";

type ArchiveRecordViewerProps = {
  record: ArchiveRecord | null;
  onClose: () => void;
  closeLabel: string;
};

type BlackPhase = "silent" | "revealed";

const VIEWER_EXIT_MS = 300;

export function ArchiveRecordViewer({ record, onClose, closeLabel }: ArchiveRecordViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const decayTimerRef = useRef<number | null>(null);
  const blackTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [decayActive, setDecayActive] = useState(false);
  const [blackPhase, setBlackPhase] = useState<BlackPhase>("revealed");
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    if (!record || closing) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onClose();
      return;
    }

    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, VIEWER_EXIT_MS);
  }, [closing, onClose, record]);

  useEffect(() => {
    if (!record) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setClosing(false);
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
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!record) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [record]);

  useEffect(() => {
    if (!record) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [record, requestClose]);

  if (!record) return null;

  const restoreDecay = () => setDecayActive(false);
  const isBlack = record.kind === "black";

  return (
    <div
      className={isBlack ? "ix-archive-viewer is-black" : "ix-archive-viewer"}
      data-archive-viewer
      data-viewer-state={closing ? "closing" : "open"}
      data-archive-kind={record.kind}
      data-black-phase={isBlack ? blackPhase : undefined}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby={`archive-viewer-title-${record.id}`}
    >
      <div className="ix-archive-viewer__veil" aria-hidden="true" />
      <div className="ix-archive-viewer__stage">
        <button
          ref={closeRef}
          type="button"
          className="ix-archive-viewer__close"
          onClick={requestClose}
          disabled={closing}
        >
          <span aria-hidden="true">×</span>
          <span>{closeLabel}</span>
        </button>

        <div className="ix-archive-viewer__asset" aria-hidden="true">
          <Image
            src={getArchiveImageSource(record)}
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
