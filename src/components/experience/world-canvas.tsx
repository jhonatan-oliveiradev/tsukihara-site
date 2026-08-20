"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const INK = "#07070a";
const VERMILION = new THREE.Color("#b52f30");
const AMBER = new THREE.Color("#d8a067");

function Eclipse() {
  const group = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    const eased = THREE.MathUtils.smoothstep(p, 0, 1);

    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(5.8, 0.25, eased);
      group.current.position.y = THREE.MathUtils.lerp(2.8, 0.35, eased);
      group.current.position.z = THREE.MathUtils.lerp(-15, -11.5, eased);
      const scale = THREE.MathUtils.lerp(1.15, 1.7, eased);
      group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05);
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.035) * 0.01;
    }

    if (shadow.current) {
      const phase = THREE.MathUtils.smoothstep(p, 0.08, 0.92);
      shadow.current.position.x = THREE.MathUtils.lerp(-3.6, 0.15, phase);
      shadow.current.position.y = THREE.MathUtils.lerp(0.35, 0.02, phase);
    }

    if (halo.current) {
      const breath = 1 + Math.sin(clock.elapsedTime * 0.22) * 0.025;
      halo.current.scale.setScalar(breath);
    }
  });

  return (
    <group ref={group} position={[5.8, 2.8, -15]}>
      <mesh ref={halo} scale={1.18}>
        <circleGeometry args={[3.3, 160]} />
        <meshBasicMaterial color={VERMILION} transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.45, 160]} />
        <meshBasicMaterial color="#9c292b" transparent opacity={0.92} depthWrite={false} />
      </mesh>
      <mesh position={[-0.72, 0.58, 0.012]}>
        <circleGeometry args={[0.48, 72]} />
        <meshBasicMaterial color="#6c1b1f" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[0.62, -0.52, 0.013]}>
        <circleGeometry args={[0.34, 72]} />
        <meshBasicMaterial color="#64191d" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh ref={shadow} position={[-3.6, 0.35, 0.03]}>
        <circleGeometry args={[2.48, 160]} />
        <meshBasicMaterial color="#06070a" transparent opacity={0.98} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MountainRange({ z, y, opacity, scale }: { z: number; y: number; opacity: number; scale: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-9, -3);
    const peaks = [
      [-8.5, -1.1],
      [-7.2, 0.4],
      [-5.9, -0.45],
      [-4.6, 1.1],
      [-3.2, 0.1],
      [-1.8, 1.85],
      [-0.3, 0.3],
      [1.15, 1.2],
      [2.5, 0.05],
      [4.1, 1.65],
      [5.6, 0.15],
      [7.1, 0.85],
      [9, -0.95],
    ];
    peaks.forEach(([x, py]) => shape.lineTo(x, py));
    shape.lineTo(9, -3);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <mesh geometry={geometry} position={[0, y, z]} scale={scale}>
      <meshBasicMaterial color="#0d1118" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function Torii({ position, scale, opacity }: { position: [number, number, number]; scale: number; opacity: number }) {
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#5c171b", transparent: true, opacity, depthWrite: false }),
    [opacity],
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[-0.92, 0, 0]} material={material}>
        <boxGeometry args={[0.14, 2.8, 0.16]} />
      </mesh>
      <mesh position={[0.92, 0, 0]} material={material}>
        <boxGeometry args={[0.14, 2.8, 0.16]} />
      </mesh>
      <mesh position={[0, 1.45, 0]} material={material}>
        <boxGeometry args={[2.55, 0.17, 0.2]} />
      </mesh>
      <mesh position={[0, 1.14, 0]} material={material}>
        <boxGeometry args={[2.05, 0.1, 0.15]} />
      </mesh>
    </group>
  );
}

function Lantern({ x, z, phase }: { x: number; z: number; phase: number }) {
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!light.current) return;
    light.current.intensity = 0.55 + Math.sin(clock.elapsedTime * 1.8 + phase) * 0.1;
  });

  return (
    <group position={[x, -2.2, z]}>
      <mesh>
        <boxGeometry args={[0.1, 0.68, 0.1]} />
        <meshBasicMaterial color="#15151a" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.38, 0.44, 0.38]} />
        <meshBasicMaterial color="#c98552" transparent opacity={0.58} />
      </mesh>
      <pointLight ref={light} position={[0, 0.4, 0.2]} color={AMBER} distance={3.4} decay={2.2} />
    </group>
  );
}

function DepthParticles({ depth, count, speed, opacity }: { depth: number; count: number; speed: number; opacity: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = ((i * 7.31) % 18) - 9;
      values[i * 3 + 1] = ((i * 4.73) % 11) - 5;
      values[i * 3 + 2] = depth - ((i * 1.21) % 2.4);
    }
    return values;
  }, [count, depth]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
    points.current.position.y = p * speed;
    points.current.position.x = Math.sin(clock.elapsedTime * 0.08 + depth) * 0.16 * speed;
    points.current.rotation.z = Math.sin(clock.elapsedTime * 0.025 + depth) * 0.015;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e6c5cb" size={0.035 + Math.abs(depth) * 0.0015} transparent opacity={opacity} depthWrite={false} />
    </points>
  );
}

function WorldRig() {
  const rig = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());

  useFrame(({ camera, clock }) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);

    const wave = Math.sin(p * Math.PI * 2.2);
    target.current.set(wave * 0.6, 0.12 + Math.sin(p * Math.PI) * 0.42, THREE.MathUtils.lerp(7.7, 6.15, p));
    camera.position.lerp(target.current, 0.032);
    camera.lookAt(0, -0.2, -7.5);

    if (rig.current) {
      rig.current.position.x = Math.sin(p * Math.PI * 1.5) * 0.35;
      rig.current.position.y = THREE.MathUtils.lerp(-0.2, 1.1, p);
      rig.current.rotation.y = wave * 0.045 + Math.sin(clock.elapsedTime * 0.025) * 0.008;
    }
  });

  return (
    <group ref={rig}>
      <Eclipse />
      <MountainRange z={-17} y={-0.65} scale={1.35} opacity={0.76} />
      <MountainRange z={-11} y={-1.55} scale={1.06} opacity={0.62} />
      <Torii position={[-4.15, -0.9, -8.3]} scale={0.88} opacity={0.34} />
      <Torii position={[3.65, -1.25, -5.2]} scale={0.56} opacity={0.26} />
      <Lantern x={-4.2} z={-3.7} phase={0.4} />
      <Lantern x={3.9} z={-4.2} phase={1.8} />
      <DepthParticles depth={-2.2} count={34} speed={2.7} opacity={0.34} />
      <DepthParticles depth={-5.2} count={52} speed={1.65} opacity={0.22} />
      <DepthParticles depth={-9.2} count={68} speed={0.7} opacity={0.12} />
    </group>
  );
}

export function WorldCanvas() {
  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 7.7], fov: 39, near: 0.1, far: 60 }}
        gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[INK]} />
        <fog attach="fog" args={["#080a0e", 7.5, 26]} />
        <ambientLight intensity={0.2} color="#78879a" />
        <WorldRig />
      </Canvas>
    </div>
  );
}
