"use client";

import { useEffect, useRef } from "react";

export type CompanionAtmosphereMode = "base" | "haku" | "mochi";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
};

const palette: Record<CompanionAtmosphereMode, [number, number, number]> = {
  base: [158, 68, 91],
  haku: [232, 196, 214],
  mochi: [134, 31, 51],
};

export function CompanionsAtmosphere({ mode }: { mode: CompanionAtmosphereMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let active = false;
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    const particles: Particle[] = [];

    const resize = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, velocity: number) => {
      const count = Math.min(3, Math.max(1, Math.round(velocity / 20)));
      for (let i = 0; i < count; i += 1) {
        if (particles.length >= 34) particles.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.min(0.5, velocity / 180) * Math.random();
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.03,
          life: 0,
          maxLife: 54 + Math.random() * 42,
          radius: 10 + Math.random() * 24,
        });
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }

      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const velocity = (Math.hypot(dx, dy) / dt) * 16;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;

      spawn(event.clientX - rect.left, event.clientY - rect.top, velocity);
    };

    const draw = () => {
      frame = 0;
      if (!active) return;

      ctx.clearRect(0, 0, width, height);
      const [r, g, b] = palette[modeRef.current];

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life += 1;
        particle.x += particle.vx * 2.4;
        particle.y += particle.vy * 2.4;
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        const progress = particle.life / particle.maxLife;
        if (progress >= 1) {
          particles.splice(index, 1);
          continue;
        }

        const alpha = Math.sin(progress * Math.PI) * 0.14;
        const radius = particle.radius * (0.7 + progress * 1.5);
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          radius,
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.45})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active && !frame) frame = requestAnimationFrame(draw);
        if (!active && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
          ctx.clearRect(0, 0, width, height);
        }
      },
      { rootMargin: "12% 0px 12% 0px" },
    );

    const resizeObserver = new ResizeObserver(resize);
    resize();
    resizeObserver.observe(host);
    intersection.observe(host);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="ix-companions-atmosphere" aria-hidden="true" />;
}
