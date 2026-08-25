"use client";

import type { ReactNode } from "react";
import { rememberCopy } from "@/components/remember/content/remember-copy";

type RememberShellProps = {
  children: ReactNode;
  muted: boolean;
  onExit: () => void;
  onToggleMute: () => void;
};

export function RememberShell({ children, muted, onExit, onToggleMute }: RememberShellProps) {
  return (
    <main className="remember-root" data-remember-root>
      <div className="remember-root__grain" aria-hidden="true" />
      <div className="remember-root__vignette" aria-hidden="true" />
      <span className="remember-root__moon" aria-hidden="true">
        月
      </span>

      <div className="remember-controls" aria-label="Memory controls">
        <button type="button" className="remember-control remember-control--exit" onClick={onExit}>
          <span aria-hidden="true">×</span>
          <span>{rememberCopy.controls.exit}</span>
        </button>
        <button
          type="button"
          className="remember-control remember-control--sound"
          aria-pressed={!muted}
          onClick={onToggleMute}
        >
          <span className="remember-control__signal" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{muted ? rememberCopy.controls.unmute : rememberCopy.controls.mute}</span>
        </button>
      </div>

      <div className="remember-stage">{children}</div>
    </main>
  );
}
