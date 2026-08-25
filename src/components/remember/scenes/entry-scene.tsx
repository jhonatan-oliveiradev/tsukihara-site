"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { rememberCopy } from "@/components/remember/content/remember-copy";

type EntrySceneProps = {
  reducedMotion: boolean;
  onEnter: () => Promise<void>;
};

export function EntryScene({ reducedMotion, onEnter }: EntrySceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [entering, setEntering] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const primary = root.querySelector("[data-entry-primary]");
      const secondary = root.querySelector("[data-entry-secondary]");
      const action = root.querySelector("[data-entry-action]");
      const moon = root.querySelector("[data-entry-moon]");

      if (reducedMotion) {
        gsap.fromTo(
          [primary, secondary, action],
          { opacity: 0 },
          { opacity: 1, duration: 0.35, stagger: 0.12 },
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          primary,
          { opacity: 0, y: 16, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
        )
        .fromTo(secondary, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.95 }, "+=0.55")
        .fromTo(action, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, "+=0.35");

      gsap.to(moon, {
        opacity: 0.72,
        scale: 1.035,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleEnter = async () => {
    if (entering) return;
    setEntering(true);
    try {
      await onEnter();
    } finally {
      setEntering(false);
    }
  };

  return (
    <section ref={rootRef} className="remember-entry" aria-labelledby="remember-entry-title">
      <span className="remember-entry__orbit" data-entry-moon aria-hidden="true">
        <i />
      </span>
      <div className="remember-entry__copy">
        <p id="remember-entry-title" data-entry-primary>
          {rememberCopy.entry.primary}
        </p>
        <p data-entry-secondary>{rememberCopy.entry.secondary}</p>
      </div>
      <div className="remember-entry__action" data-entry-action>
        <button type="button" disabled={entering} onClick={handleEnter}>
          <span>{entering ? "ENTERING…" : rememberCopy.entry.enter}</span>
          <i aria-hidden="true" />
        </button>
        <small>{rememberCopy.entry.headphones}</small>
      </div>
    </section>
  );
}
