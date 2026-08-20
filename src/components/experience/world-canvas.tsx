"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const ink = new THREE.Color("#07070a");
const moon = new THREE.Color("#c53632");
const ember = new THREE.Color("#d99a61");

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
    shape.moveTo(-8, -2);
    const peaks = [
      [-7.4, -0.8],
      [-6.1, 0.5],
      [-5.1, -0.3],
      [-3.8, 1.25],
      [-2.7, 0.25],
      [-1.5, 1.7],
      [-0.2, 0.3],
      [1.2, 1.15],
      [2.6, 0.1],
      [4.0, 1.55],
      [5.3, 0.2],
      [6.5, 0.8],
      [8, -0.7],
    ];
    peaks.forEach(([x, py]) => shape.lineTo(x, py));
    shape.lineTo(8, -2);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, y, z]} scale={scale}>
      <meshBasicMaterial color="#0c1014" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function Torii({
  position,
  scale = 1,
  opacity = 0.8,
}: {
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#5a1719",
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    [opacity],
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[-0.95, 0, 0]} material={material}>
        <boxGeometry args={[0.16, 2.75, 0.18]} />
      </mesh>
      <mesh position={[0.95, 0, 0]} material={material}>
        <boxGeometry args={[0.16, 2.75, 0.18]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={material}>
        <boxGeometry args={[2.6, 0.18, 0.2]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} material={material}>
        <boxGeometry args={[2.15, 0.12, 0.16]} />
      </mesh>
    </group>
  );
}

function Lantern({ x, z, phase }: { x: number; z: number; phase: number }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current)
      light.current.intensity = 0.6 + Math.sin(clock.elapsedTime * 1.8 + phase) * 0.12;
  });

  return (
    <group position={[x, -2.35, z]}>
      <mesh>
        <boxGeometry args={[0.13, 0.75, 0.13]} />
        <meshBasicMaterial color="#17161a" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.42, 0.46, 0.42]} />
        <meshBasicMaterial color="#c88551" transparent opacity={0.72} />
      </mesh>
      <pointLight ref={light} position={[0, 0.42, 0.2]} color={ember} distance={3.5} decay={2.2} />
    </group>
  );
}

function Moon() {
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!halo.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 0.22) * 0.035;
    halo.current.scale.setScalar(s);
  });

  return (
    <group position={[4.7, 2.1, -14]}>
      <mesh ref={halo} scale={1.25}>
        <circleGeometry args={[2.55, 128]} />
        <meshBasicMaterial color={moon} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.9, 128]} />
        <meshBasicMaterial color="#a72b2b" transparent opacity={0.84} depthWrite={false} />
      </mesh>
      <mesh position={[-0.28, 0.18, 0.01]}>
        <circleGeometry args={[0.48, 72]} />
        <meshBasicMaterial color="#6a181c" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh position={[0.55, -0.32, 0.01]}>
        <circleGeometry args={[0.32, 72]} />
        <meshBasicMaterial color="#61191d" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Petals() {
  const group = useRef<THREE.Group>(null);
  const petals = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        x: ((i * 2.17) % 15) - 7.5,
        y: ((i * 1.71) % 9) - 3.5,
        z: -2 - ((i * 1.11) % 10),
        s: 0.035 + (i % 6) * 0.009,
        r: i * 0.61,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.025;
    group.current.position.x = Math.sin(clock.elapsedTime * 0.06) * 0.28;
  });

  return (
    <group ref={group}>
      {petals.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0.4, p.r, p.r * 0.4]}>
          <planeGeometry args={[p.s * 2.4, p.s]} />
          <meshBasicMaterial
            color="#e6b8c2"
            transparent
            opacity={0.34}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function StoryWorld() {
  const rig = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame(({ camera, clock }) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, window.scrollY / max);
    const t = THREE.MathUtils.smoothstep(p, 0, 1);

    cameraTarget.current.set(
      THREE.MathUtils.lerp(0, -1.4, t),
      THREE.MathUtils.lerp(0.1, 0.7, Math.sin(t * Math.PI)),
      THREE.MathUtils.lerp(7.4, 5.8, t),
    );
    camera.position.lerp(cameraTarget.current, 0.035);
    camera.lookAt(0, 0, -6);

    if (rig.current) {
      rig.current.position.y = THREE.MathUtils.lerp(0, 1.4, p);
      rig.current.position.x = Math.sin(p * Math.PI * 2) * 0.45;
      rig.current.rotation.y =
        Math.sin(p * Math.PI) * 0.08 + Math.sin(clock.elapsedTime * 0.04) * 0.01;
    }
  });

  return (
    <group ref={rig}>
      <Moon />
      <Mountain z={-15} y={-0.6} scale={1.25} opacity={0.86} />
      <Mountain z={-10} y={-1.4} scale={1.02} opacity={0.76} />
      <Torii position={[-3.4, -0.9, -7]} scale={0.78} opacity={0.48} />
      <Torii position={[2.7, -1.2, -5]} scale={0.55} opacity={0.35} />
      <Lantern x={-3.9} z={-3.6} phase={0.2} />
      <Lantern x={3.5} z={-4.1} phase={1.7} />
      <Petals />
    </group>
  );
}

export function WorldCanvas() {
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 7.4], fov: 38, near: 0.1, far: 50 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[ink]} />
        <fog attach="fog" args={["#07090c", 7, 24]} />
        <ambientLight intensity={0.22} color="#75859b" />
        <StoryWorld />
      </Canvas>
    </div>
  );
}
