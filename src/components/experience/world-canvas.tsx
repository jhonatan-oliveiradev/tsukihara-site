"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const INK = new THREE.Color("#050609");
const MOON = new THREE.Color("#bb3438");
const EMBER = new THREE.Color("#d49a61");

function pageProgress() {
  if (typeof window === "undefined") return 0;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
}

function Mountain({
  z,
  y,
  scale,
  opacity,
}: {
  z: number;
  y: number;
  scale: number;
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-9, -2.2);
    [
      [-8.2, -0.9],
      [-7.1, 0.25],
      [-6.2, -0.45],
      [-5.1, 0.75],
      [-4.1, -0.15],
      [-2.9, 1.25],
      [-1.8, 0.05],
      [-0.5, 1.55],
      [0.8, 0.15],
      [2.0, 1.05],
      [3.3, -0.05],
      [4.8, 1.35],
      [6.1, 0.12],
      [7.2, 0.72],
      [9, -0.7],
    ].forEach(([x, peakY]) => shape.lineTo(x, peakY));
    shape.lineTo(9, -2.2);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, y, z]} scale={scale}>
      <meshBasicMaterial color="#0b0f15" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function Torii({
  position,
  scale = 1,
  opacity = 0.82,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#5d1619",
        roughness: 0.88,
        metalness: 0.05,
        transparent: true,
        opacity,
      }),
    [opacity],
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[-1.02, 0, 0]} material={material}>
        <boxGeometry args={[0.18, 3.1, 0.2]} />
      </mesh>
      <mesh position={[1.02, 0, 0]} material={material}>
        <boxGeometry args={[0.18, 3.1, 0.2]} />
      </mesh>
      <mesh position={[0, 1.5, 0]} material={material}>
        <boxGeometry args={[2.95, 0.2, 0.24]} />
      </mesh>
      <mesh position={[0, 1.18, 0]} material={material}>
        <boxGeometry args={[2.35, 0.13, 0.18]} />
      </mesh>
      <mesh position={[0, 1.72, 0]} rotation={[0, 0, -0.02]} material={material}>
        <boxGeometry args={[3.25, 0.1, 0.2]} />
      </mesh>
    </group>
  );
}

function Shrine() {
  const windowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#d39a60", transparent: true, opacity: 0.48 }),
    [],
  );
  const wood = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#311316", roughness: 0.92 }),
    [],
  );
  const roof = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0d1116", roughness: 0.94 }),
    [],
  );

  return (
    <group position={[0, -0.65, -7.7]} scale={1.05}>
      <mesh position={[0, -0.9, 0]} material={wood}>
        <boxGeometry args={[5.7, 1.85, 1.65]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={wood}>
        <boxGeometry args={[4.6, 1.05, 1.35]} />
      </mesh>
      <mesh position={[0, 0.84, 0]} rotation={[0, 0, 0.02]} material={roof}>
        <boxGeometry args={[6.8, 0.22, 2.15]} />
      </mesh>
      <mesh position={[0, 1.02, -0.03]} rotation={[0, 0, -0.025]} material={roof}>
        <boxGeometry args={[5.6, 0.13, 1.82]} />
      </mesh>
      <mesh position={[0, 0.74, 0.72]} material={wood}>
        <boxGeometry args={[5.5, 0.1, 0.16]} />
      </mesh>
      {[-1.65, -0.82, 0, 0.82, 1.65].map((x) => (
        <mesh key={x} position={[x, -0.48, 0.86]} material={windowMaterial}>
          <boxGeometry args={[0.55, 0.75, 0.04]} />
        </mesh>
      ))}
      {[-1.72, -0.86, 0, 0.86, 1.72].map((x) => (
        <mesh key={`upper-${x}`} position={[x, 0.18, 0.71]} material={windowMaterial}>
          <boxGeometry args={[0.5, 0.48, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

function Lantern({ x, z, phase }: { x: number; z: number; phase: number }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!light.current) return;
    light.current.intensity = 0.72 + Math.sin(clock.elapsedTime * 1.65 + phase) * 0.1;
  });

  return (
    <group position={[x, -2.32, z]}>
      <mesh>
        <boxGeometry args={[0.13, 0.8, 0.13]} />
        <meshBasicMaterial color="#17161a" />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.43, 0.5, 0.43]} />
        <meshBasicMaterial color="#c78752" transparent opacity={0.74} />
      </mesh>
      <pointLight ref={light} position={[0, 0.45, 0.18]} color={EMBER} distance={4.2} decay={2.1} />
    </group>
  );
}

function EclipseMoon() {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const p = pageProgress();
    if (group.current) {
      const swing = Math.sin(p * Math.PI * 1.7) * 0.55;
      group.current.position.x = THREE.MathUtils.lerp(4.65, 0.25, p) + swing;
      group.current.position.y = THREE.MathUtils.lerp(2.35, 0.65, p) + Math.sin(p * Math.PI) * 0.42;
      group.current.position.z = THREE.MathUtils.lerp(-14.2, -9.4, p);
      const scale = THREE.MathUtils.lerp(1, 1.7, p);
      group.current.scale.setScalar(scale);
    }
    if (shadow.current) {
      const eclipse = THREE.MathUtils.smoothstep(p, 0.14, 0.98);
      shadow.current.position.x = THREE.MathUtils.lerp(3.6, 0.34, eclipse);
      shadow.current.position.y = THREE.MathUtils.lerp(0.12, 0.02, eclipse);
    }
    if (halo.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 0.24) * 0.025;
      halo.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} position={[4.65, 2.35, -14.2]}>
      <mesh ref={halo} scale={1.35}>
        <circleGeometry args={[2.75, 128]} />
        <meshBasicMaterial color={MOON} transparent opacity={0.11} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.95, 128]} />
        <meshBasicMaterial color="#aa3035" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <mesh position={[-0.38, 0.24, 0.02]}>
        <circleGeometry args={[0.4, 72]} />
        <meshBasicMaterial color="#641b20" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[0.48, -0.34, 0.02]}>
        <circleGeometry args={[0.28, 72]} />
        <meshBasicMaterial color="#60181d" transparent opacity={0.24} depthWrite={false} />
      </mesh>
      <mesh ref={shadow} position={[3.6, 0.12, 0.05]}>
        <circleGeometry args={[2.02, 128]} />
        <meshBasicMaterial color="#06070a" transparent opacity={0.98} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PetalLayer({
  count,
  z,
  span,
  speed,
  opacity,
  scale,
}: {
  count: number;
  z: number;
  span: number;
  speed: number;
  opacity: number;
  scale: number;
}) {
  const group = useRef<THREE.Group>(null);
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 2.47) % span) - span / 2,
        y: ((i * 1.83) % 8.5) - 3.5,
        zz: z - ((i * 0.71) % 1.8),
        rotation: i * 0.57,
        size: scale * (0.7 + (i % 5) * 0.11),
      })),
    [count, scale, span, z],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * speed;
    group.current.position.x = Math.sin(t * 0.42) * 0.5;
    group.current.position.y = Math.cos(t * 0.31) * 0.12;
    group.current.rotation.z = Math.sin(t * 0.18) * 0.02;
  });

  return (
    <group ref={group}>
      {petals.map((petal, i) => (
        <mesh
          key={i}
          position={[petal.x, petal.y, petal.zz]}
          rotation={[0.35, petal.rotation, petal.rotation * 0.35]}
        >
          <planeGeometry args={[petal.size * 2.2, petal.size]} />
          <meshBasicMaterial
            color="#db7f8e"
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

function ForegroundReeds() {
  const group = useRef<THREE.Group>(null);
  const blades = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        x: ((i * 1.71) % 13.5) - 6.75,
        h: 0.55 + (i % 9) * 0.08,
        lean: ((i % 7) - 3) * 0.035,
        z: 1.2 + (i % 5) * 0.12,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.32) * 0.012;
  });

  return (
    <group ref={group} position={[0, -3.05, 0]}>
      {blades.map((blade, i) => (
        <mesh key={i} position={[blade.x, blade.h / 2, blade.z]} rotation={[0, 0, blade.lean]}>
          <planeGeometry args={[0.045, blade.h]} />
          <meshBasicMaterial
            color={i % 5 === 0 ? "#391416" : "#101419"}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SanctuaryWorld() {
  const rig = useRef<THREE.Group>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const target = useRef(new THREE.Vector3(0, -0.1, -7));

  useFrame(({ camera, clock, scene }) => {
    const p = pageProgress();
    const ease = THREE.MathUtils.smoothstep(p, 0, 1);
    const x = Math.sin(p * Math.PI * 1.55) * 1.1 - p * 0.35;
    const y = 0.18 + Math.sin(p * Math.PI) * 0.58;
    const z = THREE.MathUtils.lerp(7.7, 6.05, ease);

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.035);
    target.current.set(
      THREE.MathUtils.lerp(0, -0.45, p),
      THREE.MathUtils.lerp(-0.12, 0.25, p),
      THREE.MathUtils.lerp(-7.2, -6.4, p),
    );
    camera.lookAt(target.current);

    if (rig.current) {
      rig.current.position.x = Math.sin(p * Math.PI * 2.1) * 0.42;
      rig.current.position.y = THREE.MathUtils.lerp(0, 0.9, p);
      rig.current.rotation.y =
        Math.sin(p * Math.PI) * 0.055 + Math.sin(clock.elapsedTime * 0.045) * 0.008;
    }

    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.34, 0.17, p);
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = THREE.MathUtils.lerp(6.2, 5.1, p);
      scene.fog.far = THREE.MathUtils.lerp(24, 18, p);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.34} color="#8290a6" />
      <pointLight position={[0, 1.2, -5]} color="#7b2528" intensity={1.2} distance={12} decay={2} />
      <group ref={rig}>
        <EclipseMoon />
        <Mountain z={-16} y={-0.5} scale={1.35} opacity={0.76} />
        <Mountain z={-11.4} y={-1.1} scale={1.08} opacity={0.72} />
        <Shrine />
        <Torii position={[0, -1.05, -4.6]} scale={1.1} opacity={0.92} />
        <Torii position={[-4.15, -1.4, -7.2]} scale={0.66} opacity={0.32} />
        <Torii position={[4.0, -1.5, -8.3]} scale={0.55} opacity={0.24} />
        <Lantern x={-3.7} z={-3.6} phase={0.2} />
        <Lantern x={3.7} z={-3.8} phase={1.5} />
        <Lantern x={-1.9} z={-5.1} phase={2.2} />
        <Lantern x={1.9} z={-5.1} phase={3.0} />
        <PetalLayer count={34} z={-10.5} span={15} speed={0.18} opacity={0.16} scale={0.055} />
        <PetalLayer count={42} z={-5.8} span={14} speed={0.32} opacity={0.28} scale={0.068} />
        <PetalLayer count={34} z={-1.4} span={13} speed={0.54} opacity={0.45} scale={0.085} />
        <ForegroundReeds />
      </group>
    </>
  );
}

export function WorldCanvas() {
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.18, 7.7], fov: 39, near: 0.1, far: 60 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[INK]} />
        <fog attach="fog" args={["#05070b", 6.2, 24]} />
        <SanctuaryWorld />
      </Canvas>
    </div>
  );
}
