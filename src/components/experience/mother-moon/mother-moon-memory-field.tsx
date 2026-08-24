"use client";

import { useEffect, useRef, useState } from "react";
import type { MotherMoonMemory } from "@/content/mother-moon";

type MotherMoonMemoryFieldProps = {
  memories: MotherMoonMemory[];
  unstable?: boolean;
};

export function MotherMoonMemoryField({
  memories,
  unstable = false,
}: MotherMoonMemoryFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<Map<string, number>>(new Map());
  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set());
  const [mode, setMode] = useState<"fine" | "coarse" | "reduced">("reduced");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    };

    const activate = (id: string) => {
      setActiveIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });

      const previous = timersRef.current.get(id);
      if (previous) window.clearTimeout(previous);

      const timer = window.setTimeout(
        () => {
          setActiveIds((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
          });
          timersRef.current.delete(id);
        },
        unstable ? 900 : 1650,
      );

      timersRef.current.set(id, timer);
    };

    let interval = 0;

    const configure = () => {
      window.clearInterval(interval);
      clearTimers();
      setActiveIds(new Set());

      if (reducedMotion.matches) {
        setMode("reduced");
        return;
      }

      if (!finePointer.matches) {
        setMode("coarse");
        let index = 0;
        activate(memories[index]?.id ?? "");
        interval = window.setInterval(() => {
          index = (index + 1) % memories.length;
          const memory = memories[index];
          if (memory) activate(memory.id);
        }, unstable ? 2200 : 2900);
        return;
      }

      setMode("fine");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
      const pointerY = ((event.clientY - rect.top) / rect.height) * 100;

      memories.forEach((memory) => {
        const dx = (pointerX - memory.x) * (rect.width / 100);
        const dy = (pointerY - memory.y) * (rect.height / 100);
        const distance = Math.hypot(dx, dy);
        const radius = Math.min(rect.width, rect.height) * (memory.weight === "phrase" ? 0.22 : 0.17);
        if (distance <= radius) activate(memory.id);
      });
    };

    configure();
    root.addEventListener("pointermove", onPointerMove);
    finePointer.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);

    return () => {
      window.clearInterval(interval);
      clearTimers();
      root.removeEventListener("pointermove", onPointerMove);
      finePointer.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
    };
  }, [memories, unstable]);

  return (
    <div
      ref={rootRef}
      className={`ix-mm-memory-field is-${mode}${unstable ? " is-unstable" : ""}`}
      aria-hidden="true"
      data-mm-memory-field
    >
      {memories.map((memory) => (
        <span
          key={memory.id}
          className={`ix-mm-memory ix-mm-memory--${memory.weight}${activeIds.has(memory.id) ? " is-visible" : ""}`}
          style={{ left: `${memory.x}%`, top: `${memory.y}%` }}
          data-memory-id={memory.id}
        >
          {memory.text}
        </span>
      ))}
    </div>
  );
}
