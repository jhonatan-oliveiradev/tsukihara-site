"use client";

import Image from "next/image";
import {
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

const MAX_RIPPLES = 8;
const RIPPLE_LIFETIME = 1.55;

type RippleDistortionImageProps = {
  src: string;
  alt: string;
  active?: boolean;
  sizes?: string;
  priority?: boolean;
  tint?: string;
  className?: string;
};

type RippleInjector = (x: number, y: number, strength: number) => void;

type PointerSample = {
  x: number;
  y: number;
  time: number;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uAspect;
  uniform float uImageAspect;
  uniform vec2 uRipplePos[${MAX_RIPPLES}];
  uniform float uRippleAge[${MAX_RIPPLES}];
  uniform float uRippleStrength[${MAX_RIPPLES}];
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    vec2 scale = vec2(1.0);
    if (uAspect > uImageAspect) {
      scale.y = uImageAspect / uAspect;
    } else {
      scale.x = uAspect / uImageAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 displaced = vUv;

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      float age = clamp(uRippleAge[i], 0.0, 1.0);
      float life = 1.0 - age;
      if (life <= 0.001 || uRippleStrength[i] <= 0.001) continue;

      vec2 delta = vUv - uRipplePos[i];
      delta.x *= uAspect;
      float dist = length(delta);
      float radius = mix(0.0, 0.34, age);

      float ring = exp(-pow((dist - radius) * 35.0, 2.0));
      float wave = sin((dist - radius) * 82.0 - age * 6.28318) * ring;
      float wake = sin(dist * 44.0 - age * 10.0) * exp(-dist * 6.0) * life * 0.22;
      float displacement = (wave + wake) * uRippleStrength[i] * life;

      vec2 direction = normalize(delta + vec2(0.00001));
      direction.x /= max(uAspect, 0.0001);
      displaced += direction * displacement * 0.021;
    }

    displaced = clamp(displaced, vec2(0.001), vec2(0.999));
    gl_FragColor = texture2D(uMap, coverUv(displaced));
  }
`;

export function RippleDistortionImage({
  src,
  alt,
  active = false,
  sizes = "100vw",
  priority = false,
  tint = "#a40c26",
  className = "",
}: RippleDistortionImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const injectRippleRef = useRef<RippleInjector | null>(null);
  const lastPointerRef = useRef<PointerSample | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const sync = () => setMotionEnabled(!reduced.matches && finePointer.matches);

    sync();
    reduced.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const host = waterRef.current;
    if (!host || !active || !motionEnabled) {
      injectRippleRef.current = null;
      return;
    }

    let disposed = false;
    let frame = 0;
    let lastFrame = performance.now();
    let nextRipple = 0;
    let renderer: WebGLRenderer;

    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      injectRippleRef.current = null;
      host.replaceChildren();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.className = "ix-ripple-distortion__canvas";
    host.replaceChildren(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new PlaneGeometry(2, 2);
    const ripplePositions = Array.from({ length: MAX_RIPPLES }, () => new Vector2(-10, -10));
    const rippleAges = new Float32Array(MAX_RIPPLES).fill(1);
    const rippleStrengths = new Float32Array(MAX_RIPPLES);

    const material = new ShaderMaterial({
      uniforms: {
        uMap: { value: null },
        uAspect: { value: 1 },
        uImageAspect: { value: 1 },
        uRipplePos: { value: ripplePositions },
        uRippleAge: { value: rippleAges },
        uRippleStrength: { value: rippleStrengths },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const renderOnce = () => {
      if (!disposed) renderer.render(scene, camera);
    };

    const disableWater = () => {
      injectRippleRef.current = null;
      renderer.domElement.style.display = "none";
    };

    const texture = new TextureLoader().load(
      src,
      (loaded) => {
        if (disposed) return;
        loaded.colorSpace = SRGBColorSpace;
        loaded.minFilter = LinearFilter;
        loaded.magFilter = LinearFilter;
        material.uniforms.uMap.value = loaded;
        const image = loaded.image as {
          naturalWidth?: number;
          naturalHeight?: number;
          width?: number;
          height?: number;
        };
        const width = image.naturalWidth ?? image.width ?? 1;
        const height = image.naturalHeight ?? image.height ?? 1;
        material.uniforms.uImageAspect.value = width / Math.max(1, height);
        renderer.domElement.style.display = "block";
        renderOnce();
      },
      undefined,
      disableWater,
    );
    renderer.domElement.style.display = "none";

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      material.uniforms.uAspect.value = rect.width / rect.height;
      renderOnce();
    };

    const animate = (now: number) => {
      if (disposed) return;
      const delta = Math.min(0.04, Math.max(0, (now - lastFrame) / 1000));
      lastFrame = now;

      let alive = false;
      for (let index = 0; index < MAX_RIPPLES; index += 1) {
        if (rippleAges[index] >= 1) continue;
        rippleAges[index] = Math.min(1, rippleAges[index] + delta / RIPPLE_LIFETIME);
        alive = alive || rippleAges[index] < 1;
      }

      renderOnce();
      frame = alive ? window.requestAnimationFrame(animate) : 0;
    };

    injectRippleRef.current = (x, y, strength) => {
      if (!material.uniforms.uMap.value) return;
      const index = nextRipple;
      nextRipple = (nextRipple + 1) % MAX_RIPPLES;
      ripplePositions[index].set(x, 1 - y);
      rippleAges[index] = 0;
      rippleStrengths[index] = strength;
      lastFrame = performance.now();
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    return () => {
      disposed = true;
      injectRippleRef.current = null;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [active, motionEnabled, src]);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const node = rootRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--ripple-x", `${normalizedX * 100}%`);
    node.style.setProperty("--ripple-y", `${normalizedY * 100}%`);

    if (!active || !motionEnabled || !injectRippleRef.current) return;

    const now = performance.now();
    const previous = lastPointerRef.current;
    const dx = previous ? event.clientX - previous.x : 16;
    const dy = previous ? event.clientY - previous.y : 0;
    const distance = Math.hypot(dx, dy);
    const elapsed = previous ? now - previous.time : 100;

    if (previous && (elapsed < 42 || distance < 11)) return;

    const velocity = distance / Math.max(16, elapsed);
    const strength = Math.min(1, Math.max(0.45, 0.52 + velocity * 0.7));
    injectRippleRef.current(normalizedX, normalizedY, strength);
    lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
  };

  const clearPointer = () => {
    const node = rootRef.current;
    if (node) {
      node.style.setProperty("--ripple-x", "50%");
      node.style.setProperty("--ripple-y", "50%");
    }
    lastPointerRef.current = null;
  };

  return (
    <div
      ref={rootRef}
      className={`ix-ripple-distortion ${active ? "is-active" : ""} ${className}`.trim()}
      style={{ "--ripple-tint": tint } as CSSProperties}
      onPointerMove={updatePointer}
      onPointerLeave={clearPointer}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="ix-ripple-distortion__base"
      />
      <div ref={waterRef} className="ix-ripple-distortion__water" aria-hidden="true" />
      <div className="ix-ripple-distortion__tint" aria-hidden="true" />
    </div>
  );
}
