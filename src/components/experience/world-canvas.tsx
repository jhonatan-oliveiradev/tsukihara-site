"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleCameraPath } from "@/experience/kage-port/scroll-path";

const INK = new THREE.Color("#040609");
const VERMILION = new THREE.Color("#b42027");
const AMBER = new THREE.Color("#d9985c");

function pageProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
}

function Ridge({
  z,
  y,
  opacity,
  scale = 1,
}: {
  z: number;
  y: number;
  opacity: number;
  scale?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-12, -2.5);
    const peaks = [
      [-10.5, -0.7],
      [-8.7, 0.55],
      [-7, -0.35],
      [-5.4, 1.15],
      [-3.5, 0.1],
      [-1.7, 1.5],
      [0, 0.35],
      [1.8, 1.05],
      [3.5, 0.05],
      [5.1, 1.45],
      [7.2, 0.18],
      [9.1, 0.75],
      [11, -0.55],
    ];
    peaks.forEach(([x, py]) => shape.lineTo(x, py));
    shape.lineTo(12, -2.5);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, y, z]} scale={scale}>
      <meshBasicMaterial color="#080d12" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function Torii({
  position,
  scale = 1,
  opacity = 1,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5c0e13",
        roughness: 0.62,
        metalness: 0.08,
        transparent: opacity < 1,
        opacity,
      }),
    [opacity],
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[-1.1, 0, 0]} material={material}>
        <boxGeometry args={[0.19, 3.2, 0.2]} />
      </mesh>
      <mesh position={[1.1, 0, 0]} material={material}>
        <boxGeometry args={[0.19, 3.2, 0.2]} />
      </mesh>
      <mesh position={[0, 1.62, 0]} material={material}>
        <boxGeometry args={[3.1, 0.2, 0.24]} />
      </mesh>
      <mesh position={[0, 1.25, 0]} material={material}>
        <boxGeometry args={[2.5, 0.12, 0.17]} />
      </mesh>
    </group>
  );
}

function Shrine() {
  return (
    <group position={[0, -1.75, -10.3]}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[6.2, 2.7, 2.5]} />
        <meshStandardMaterial color="#12090a" roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.65, 0.05]} rotation={[0, 0, Math.PI / 4]} scale={[4.7, 0.24, 1.65]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a0c0f" roughness={0.86} />
      </mesh>
      <mesh position={[0, 1.35, 1.28]}>
        <boxGeometry args={[4.25, 1.55, 0.08]} />
        <meshStandardMaterial color="#5a1617" emissive="#2a0708" emissiveIntensity={0.7} />
      </mesh>
      {[-1.55, -0.52, 0.52, 1.55].map((x) => (
        <mesh key={x} position={[x, 1.35, 1.34]}>
          <boxGeometry args={[0.07, 1.45, 0.06]} />
          <meshBasicMaterial color="#c27147" />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 2.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 11]} />
        <meshStandardMaterial color="#141216" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Lantern({ x, z, phase }: { x: number; z: number; phase: number }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current) {
      light.current.intensity =
        1.1 +
        Math.sin(clock.elapsedTime * 2.1 + phase) * 0.18 +
        Math.sin(clock.elapsedTime * 5.4 + phase) * 0.05;
    }
  });

  return (
    <group position={[x, -1.15, z]}>
      <mesh>
        <boxGeometry args={[0.12, 1.1, 0.12]} />
        <meshBasicMaterial color="#151317" />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.42]} />
        <meshBasicMaterial color="#d88a55" transparent opacity={0.78} />
      </mesh>
      <pointLight ref={light} position={[0, 0.62, 0.2]} color={AMBER} distance={5} decay={2.1} />
    </group>
  );
}

function EclipseMoon({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const shot = sampleCameraPath(progress.current);
    if (group.current) {
      group.current.position.lerp(shot.moon, 0.055);
      const breath = 1 + Math.sin(clock.elapsedTime * 0.22) * 0.018;
      const scale = shot.moonScale * breath;
      group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.06);
    }
    if (shadow.current) shadow.current.position.x = THREE.MathUtils.lerp(-4.2, 0.5, shot.eclipse);
    if (halo.current) halo.current.rotation.z = clock.elapsedTime * 0.008;
  });

  return (
    <group ref={group} position={[4.8, 4.5, -18]}>
      <mesh ref={halo} scale={1.3}>
        <circleGeometry args={[2.55, 128]} />
        <meshBasicMaterial color={VERMILION} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.9, 128]} />
        <meshBasicMaterial color="#c03337" toneMapped={false} />
      </mesh>
      <mesh ref={shadow} position={[-4.2, 0.08, 0.025]}>
        <circleGeometry args={[1.93, 128]} />
        <meshBasicMaterial color="#05070a" />
      </mesh>
    </group>
  );
}

function PetalField({
  count,
  z,
  speed,
  opacity,
  tint,
}: {
  count: number;
  z: number;
  speed: number;
  opacity: number;
  tint: string;
}) {
  const group = useRef<THREE.Group>(null);
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 2.31) % 17) - 8.5,
        y: ((i * 1.73) % 10) - 4.5,
        s: 0.035 + (i % 5) * 0.012,
        r: i * 0.67,
        phase: i * 0.39,
      })),
    [count],
  );

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.position.y = -((clock.elapsedTime * speed) % 2.2);
    group.current.position.x = Math.sin(clock.elapsedTime * 0.16) * 0.3 + pointer.x * 0.2 * speed;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.03;
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      {petals.map((petal, i) => (
        <mesh
          key={i}
          position={[petal.x, petal.y, (i % 7) * -0.09]}
          rotation={[0.6, petal.r, petal.phase]}
        >
          <planeGeometry args={[petal.s * 2.6, petal.s]} />
          <meshBasicMaterial
            color={tint}
            transparent
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function PointerEmbers() {
  const attribute = useRef<THREE.BufferAttribute>(null);

  useFrame(({ pointer, clock }) => {
    if (!attribute.current) return;
    const positions = attribute.current.array as Float32Array;
    for (let i = 0; i < 36; i += 1) {
      const idx = i * 3;
      positions[idx] = pointer.x * 4.6 + Math.sin(clock.elapsedTime * 1.3 + i) * (i / 36) * 1.6;
      positions[idx + 1] =
        pointer.y * 2.8 + Math.cos(clock.elapsedTime * 1.1 + i * 0.7) * (i / 36) * 1.1;
      positions[idx + 2] = -2.3 - i * 0.08;
    }
    attribute.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={attribute}
          attach="attributes-position"
          args={[new Float32Array(36 * 3), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#bb2730"
        size={0.045}
        transparent
        opacity={0.34}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Director({ fogRef }: { fogRef: React.RefObject<THREE.FogExp2 | null> }) {
  const progress = useRef(0);
  const world = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0.5, -8));

  useFrame(({ clock }) => {
    const p = pageProgress();
    progress.current = THREE.MathUtils.lerp(progress.current, p, 0.055);
    const shot = sampleCameraPath(progress.current);
    camera.position.lerp(shot.position, 0.055);
    lookAt.current.lerp(shot.lookAt, 0.055);
    camera.lookAt(lookAt.current);
    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.lerp(fogRef.current.density, shot.fog, 0.04);
    }
    if (world.current) {
      world.current.rotation.y =
        Math.sin(progress.current * Math.PI * 1.6) * 0.035 +
        Math.sin(clock.elapsedTime * 0.04) * 0.006;
    }
  });

  return (
    <group ref={world}>
      <EclipseMoon progress={progress} />
      <Ridge z={-20} y={-2.5} opacity={0.9} scale={1.3} />
      <Ridge z={-14} y={-2.3} opacity={0.76} scale={1.08} />
      <Shrine />
      <Torii position={[0, -0.95, -5.6]} scale={1.15} />
      <Torii position={[-4.3, -1.15, -8.4]} scale={0.58} opacity={0.48} />
      <Torii position={[4.1, -1.25, -11.6]} scale={0.42} opacity={0.3} />
      <Lantern x={-2.8} z={-4.7} phase={0.2} />
      <Lantern x={2.8} z={-4.7} phase={1.7} />
      <PetalField count={44} z={-12} speed={0.08} opacity={0.18} tint="#d9a8b4" />
      <PetalField count={34} z={-6} speed={0.15} opacity={0.28} tint="#d8abb7" />
      <PetalField count={24} z={-2.3} speed={0.27} opacity={0.42} tint="#b92e36" />
      <PointerEmbers />
    </group>
  );
}

function SceneContents() {
  const fogRef = useRef<THREE.FogExp2>(null);

  return (
    <>
      <color attach="background" args={[INK]} />
      <fogExp2 ref={fogRef} attach="fog" args={["#05090d", 0.018]} />
      <ambientLight intensity={0.24} color="#6e7b8e" />
      <directionalLight position={[-4, 8, 3]} intensity={0.8} color="#8296b4" />
      <pointLight position={[0, 2.6, -8.2]} intensity={2.1} distance={18} color="#8e141a" />
      <Director fogRef={fogRef} />
    </>
  );
}

export function WorldCanvas() {
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.2, 11.8], fov: 36, near: 0.2, far: 120 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}
