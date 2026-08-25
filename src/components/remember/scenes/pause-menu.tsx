"use client";

import { useEffect, useRef } from "react";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";

type PauseMenuProps = {
  copy: RememberLocaleCopy["pause"];
  onResume: () => void;
  onRestartMemory: () => void;
  onOpenArchive: () => void;
  onReturnTitle: () => void;
};

export function PauseMenu({
  copy,
  onResume,
  onRestartMemory,
  onOpenArchive,
  onReturnTitle,
}: PauseMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    resumeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const root = rootRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="remember-pause"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remember-pause-title"
    >
      <div className="remember-pause__veil" aria-hidden="true" />
      <div className="remember-pause__panel">
        <span>{copy.eyebrow}</span>
        <div className="remember-pause__sigil" aria-hidden="true">
          月
        </div>
        <h2 id="remember-pause-title">{copy.title}</h2>
        <nav aria-label={copy.title}>
          <button ref={resumeRef} type="button" onClick={onResume}>
            {copy.resume}
          </button>
          <button type="button" onClick={onRestartMemory}>
            {copy.restart}
          </button>
          <button type="button" onClick={onOpenArchive}>
            {copy.archive}
          </button>
          <button type="button" onClick={onReturnTitle}>
            {copy.returnTitle}
          </button>
        </nav>
      </div>
    </div>
  );
}
