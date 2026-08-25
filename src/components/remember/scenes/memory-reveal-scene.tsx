"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { rememberCopy } from "@/components/remember/content/remember-copy";

type MemoryRevealSceneProps = {
  reducedMotion: boolean;
  onReveal: () => void;
};

export function MemoryRevealScene({ reducedMotion, onReveal }: MemoryRevealSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    const timer = window.setTimeout(onReveal, reducedMotion ? 180 : 760);
    return () => window.clearTimeout(timer);
  }, [onReveal, reducedMotion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const realm = root.querySelector("[data-reveal-realm]");
      const guardian = root.querySelector("[data-reveal-guardian]");
      const name = root.querySelector("[data-reveal-name]");
      const line = root.querySelector("[data-reveal-line]");
      const veil = root.querySelector("[data-reveal-veil]");

      if (reducedMotion) {
        gsap.fromTo([veil, realm, guardian, name, line], { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 1.1 })
        .fromTo(realm, { opacity: 0, y: 18, letterSpacing: "0.34em" }, { opacity: 1, y: 0, letterSpacing: "0.24em", duration: 0.9 }, 0.42)
        .fromTo(guardian, { opacity: 0, y: 16 }, { opacity: 0.72, y: 0, duration: 0.75 }, 0.88)
        .fromTo(name, { opacity: 0, y: 20, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.05 }, 1.22)
        .fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.78);
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={rootRef} className="remember-reveal" aria-label="Restored Hanamori memory">
      <div className="remember-reveal__veil" data-reveal-veil aria-hidden="true" />
      <div className="remember-reveal__copy">
        <span data-reveal-realm>{rememberCopy.reveal.realm}</span>
        <small data-reveal-guardian>{rememberCopy.reveal.guardian}</small>
        <h2 data-reveal-name>{rememberCopy.reveal.name}</h2>
        <p data-reveal-line>{rememberCopy.reveal.line}</p>
      </div>
      <span className="remember-reveal__kanji" aria-hidden="true">
        記憶
      </span>
    </section>
  );
}
