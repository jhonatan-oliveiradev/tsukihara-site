"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Moon() {
  const moon = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!moon.current) return;
    moon.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
    moon.current.rotation.z = state.clock.elapsedTime * 0.015;
  });

  return (
    <Float speed={0.45} rotationIntensity={0.08} floatIntensity={0.12}>
      <mesh ref={moon} position={[3.7, 1.5, -7]}>
        <circleGeometry args={[2.35, 96]} />
        <meshBasicMaterial color="#b73934" transparent opacity={0.74} />
      </mesh>
    </Float>
  );
}

function PetalField() {
  const points = useMemo(() => {
    return Array.from({ length: 44 }, (_, index) => ({
      id: index,
      position: [
        (Math.sin(index * 12.91) * 0.5 + 0.5) * 18 - 9,
        (Math.cos(index * 5.72) * 0.5 + 0.5) * 11 - 4.5,
        -2 - ((index * 1.37) % 10),
      ] as [number, number, number],
      scale: 0.018 + (index % 5) * 0.006,
    }));
  }, []);

  return (
    <group>
      {points.map((petal) => (
        <Float key={petal.id} speed={0.7 + (petal.id % 3) * 0.12} floatIntensity={1.4}>
          <mesh position={petal.position} rotation={[0, 0, petal.id * 0.3]}>
            <planeGeometry args={[petal.scale * 8, petal.scale * 4]} />
            <meshBasicMaterial
              color="#f1c5cb"
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      <color attach="background" args={["#08070b"]} />
      <fog attach="fog" args={["#08070b", 5, 22]} />
      <Moon />
      <PetalField />
      <Sparkles
        count={55}
        scale={[18, 10, 9]}
        size={1.2}
        speed={0.16}
        opacity={0.28}
        color="#e7d9c7"
      />
    </>
  );
}

export function WorldCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 44 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Atmosphere />
      </Canvas>
    </div>
  );
}
