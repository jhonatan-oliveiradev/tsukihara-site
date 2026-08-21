"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function getPageProgress() {
  if (typeof window === "undefined") return 0;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
}

function recolorScene(scene: THREE.Object3D, mode: "temple" | "katana") {
  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const next = materials.map((source) => {
      const material = source.clone();
      if (material instanceof THREE.MeshStandardMaterial) {
        if (mode === "temple") {
          material.color.lerp(new THREE.Color("#7f271f"), 0.26);
          material.emissive.lerp(new THREE.Color("#5b130f"), 0.35);
          material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.3);
          material.roughness = Math.min(material.roughness, 0.82);
        } else {
          material.color.lerp(new THREE.Color("#a23a34"), 0.22);
          material.emissive.lerp(new THREE.Color("#7a1716"), 0.48);
          material.emissiveIntensity = Math.max(material.emissiveIntensity, 0.5);
          material.metalness = Math.max(material.metalness, 0.72);
          material.roughness = Math.min(material.roughness, 0.38);
        }
        material.needsUpdate = true;
      }
      return material;
    });
    object.material = Array.isArray(object.material) ? next : next[0];
  });
}

function Temple() {
  const { scene } = useGLTF("/models/japanese_temple/scene.gltf");
  const clone = useMemo(() => {
    const next = scene.clone(true);
    recolorScene(next, "temple");
    return next;
  }, [scene]);

  return (
    <group position={[0, 2.2, -12.5]} rotation={[0, Math.PI, 0]} scale={0.018}>
      <primitive object={clone} />
    </group>
  );
}

function Katana() {
  const { scene } = useGLTF("/models/crimson_katana/scene.gltf");
  const clone = useMemo(() => {
    const next = scene.clone(true);
    recolorScene(next, "katana");
    return next;
  }, [scene]);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const p = getPageProgress();
    const reveal = THREE.MathUtils.smoothstep(p, 0.46, 0.64);
    const leave = THREE.MathUtils.smoothstep(p, 0.67, 0.78);
    const visibility = reveal * (1 - leave);

    group.current.visible = visibility > 0.015;
    group.current.position.x = THREE.MathUtils.lerp(7.5, -3.2, reveal);
    group.current.position.y = THREE.MathUtils.lerp(-1.2, 0.9, reveal);
    group.current.position.z = THREE.MathUtils.lerp(1.6, -1.6, reveal);
    group.current.rotation.z = -0.72 + Math.sin(clock.elapsedTime * 0.35) * 0.018;
    group.current.rotation.y = Math.PI * 0.18 + reveal * 0.45;
    group.current.scale.setScalar(4.4 + visibility * 0.8);
  });

  return (
    <group ref={group} visible={false}>
      <pointLight position={[0, 0.5, 1.4]} color="#ff463e" intensity={3.8} distance={8} decay={2} />
      <pointLight position={[0, -0.4, 0.4]} color="#d5a257" intensity={1.4} distance={5} decay={2} />
      <primitive object={clone} />
    </group>
  );
}

function ToriiFallback() {
  return (
    <group position={[0, -0.9, -8]}>
      <mesh position={[-1.8, 0, 0]}>
        <boxGeometry args={[0.24, 5, 0.24]} />
        <meshStandardMaterial color="#8f211d" roughness={0.7} emissive="#310809" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[1.8, 0, 0]}>
        <boxGeometry args={[0.24, 5, 0.24]} />
        <meshStandardMaterial color="#8f211d" roughness={0.7} emissive="#310809" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[5.1, 0.34, 0.34]} />
        <meshStandardMaterial color="#a62a22" roughness={0.68} emissive="#3a0909" emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[4.1, 0.22, 0.28]} />
        <meshStandardMaterial color="#6f1717" roughness={0.72} />
      </mesh>
    </group>
  );
}

function Moon() {
  const moon = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!moon.current || !shadow.current) return;
    const p = getPageProgress();
    moon.current.position.x = THREE.MathUtils.lerp(5.4, -0.2, THREE.MathUtils.smoothstep(p, 0, 0.9));
    moon.current.position.y = THREE.MathUtils.lerp(3.6, 1.1, p);
    moon.current.position.z = THREE.MathUtils.lerp(-21, -13.8, p);
    const s = THREE.MathUtils.lerp(1, 1.65, THREE.MathUtils.smoothstep(p, 0.55, 1));
    moon.current.scale.setScalar(s * (1 + Math.sin(clock.elapsedTime * 0.14) * 0.008));
    shadow.current.position.x = THREE.MathUtils.lerp(-4.8, 0.22, THREE.MathUtils.smoothstep(p, 0.18, 0.96));
  });

  return (
    <group ref={moon} position={[5.4, 3.6, -21]}>
      <mesh scale={1.2}>
        <circleGeometry args={[3.05, 128]} />
        <meshBasicMaterial color="#8f1620" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[2.5, 128]} />
        <meshBasicMaterial color="#d84d55" transparent opacity={0.95} depthWrite={false} />
      </mesh>
      <mesh ref={shadow} position={[-4.8, 0.08, 0.03]}>
        <circleGeometry args={[2.58, 128]} />
        <meshBasicMaterial color="#050609" depthWrite={false} />
      </mesh>
    </group>
  );
}

function Petals({ count, z, opacity, speed }: { count: number; z: number; opacity: number; speed: number }) {
  const group = useRef<THREE.Group>(null);
  const petals = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ x: ((i * 2.17) % 18) - 9, y: ((i * 1.61) % 11) - 4.5, s: 0.035 + (i % 7) * 0.012, r: i * 0.58 })),
    [count],
  );

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(clock.elapsedTime * speed) * 0.36 + pointer.x * 0.24 * speed;
    group.current.position.y = Math.sin(clock.elapsedTime * speed * 0.7) * 0.18;
    group.current.rotation.z = Math.sin(clock.elapsedTime * speed * 0.45) * 0.018;
  });

  return (
    <group ref={group} position={[0, 0, z]}>
      {petals.map((petal, index) => (
        <mesh key={index} position={[petal.x, petal.y, -(index % 8) * 0.08]} rotation={[0.55, petal.r, petal.r * 0.38]}>
          <planeGeometry args={[petal.s * 2.8, petal.s]} />
          <meshBasicMaterial color={index % 5 === 0 ? "#a92735" : "#e3b7c2"} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FireLight({ x, z, phase }: { x: number; z: number; phase: number }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!light.current) return;
    light.current.intensity = 2.8 + Math.sin(clock.elapsedTime * 3.1 + phase) * 0.38;
  });
  return <pointLight ref={light} position={[x, -1.7, z]} color="#ff5f31" distance={11} decay={2} />;
}

function Director() {
  const { camera } = useThree();
  const fog = useRef<THREE.FogExp2>(null);
  const world = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3(0, 0.5, -11));
  const progress = useRef(0);

  useFrame(({ clock }) => {
    const raw = getPageProgress();
    progress.current = THREE.MathUtils.lerp(progress.current, raw, 0.055);
    const p = progress.current;
    const cameraX = Math.sin(p * Math.PI * 1.45) * 1.55;
    const cameraY = THREE.MathUtils.lerp(1.1, 2.3, THREE.MathUtils.smoothstep(p, 0.08, 0.86));
    const cameraZ = THREE.MathUtils.lerp(12.2, 6.1, THREE.MathUtils.smoothstep(p, 0, 0.94));
    camera.position.lerp(new THREE.Vector3(cameraX, cameraY, cameraZ), 0.05);
    target.current.lerp(new THREE.Vector3(THREE.MathUtils.lerp(0, -0.8, THREE.MathUtils.smoothstep(p, 0.45, 0.82)), THREE.MathUtils.lerp(0.45, 1.1, p), THREE.MathUtils.lerp(-11, -9.5, p)), 0.055);
    camera.lookAt(target.current);

    if (fog.current) fog.current.density = THREE.MathUtils.lerp(0.016, 0.027, THREE.MathUtils.smoothstep(p, 0.45, 1));
    if (world.current) world.current.rotation.y = Math.sin(p * Math.PI * 1.6) * 0.045 + Math.sin(clock.elapsedTime * 0.04) * 0.006;
  });

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={["#070407", 0.016]} />
      <group ref={world}>
        <Moon />
        <Suspense fallback={<ToriiFallback />}>
          <Temple />
          <Katana />
        </Suspense>
        <FireLight x={-3.2} z={-7.4} phase={0.1} />
        <FireLight x={3.1} z={-7.5} phase={1.3} />
        <Petals count={58} z={-13} opacity={0.16} speed={0.08} />
        <Petals count={38} z={-7} opacity={0.26} speed={0.15} />
        <Petals count={24} z={-2.2} opacity={0.43} speed={0.28} />
      </group>
    </>
  );
}

export function ImmersiveWorld() {
  return (
    <div className="immersive-world" aria-hidden="true">
      <Canvas dpr={[1, 1.65]} camera={{ position: [0, 1.1, 12.2], fov: 38, near: 0.15, far: 140 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <color attach="background" args={["#040307"]} />
        <ambientLight intensity={0.4} color="#8d6170" />
        <directionalLight position={[-4, 8, 4]} intensity={1.35} color="#d18a77" />
        <directionalLight position={[6, 4, 2]} intensity={0.72} color="#6f83b5" />
        <pointLight position={[0, 3.8, -15]} intensity={6.2} distance={36} color="#d52f38" />
        <pointLight position={[0, 0.8, -9]} intensity={2.3} distance={20} color="#c8954e" />
        <Director />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/japanese_temple/scene.gltf");
useGLTF.preload("/models/crimson_katana/scene.gltf");