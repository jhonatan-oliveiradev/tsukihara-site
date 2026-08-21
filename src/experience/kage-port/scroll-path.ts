import * as THREE from "three";

export type CameraShot = {
  at: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fog: number;
  moon: [number, number, number];
  moonScale: number;
  eclipse: number;
};

// Educational port of Kage's continuous camera philosophy: one scene,
// multiple composed shots, interpolated by page progress rather than scene swaps.
export const cameraShots: CameraShot[] = [
  {
    at: 0,
    position: [0, 1.2, 11.8],
    lookAt: [0, 0.8, -6],
    fog: 0.018,
    moon: [4.8, 4.5, -18],
    moonScale: 1,
    eclipse: 0.08,
  },
  {
    at: 0.2,
    position: [-1.8, 1.05, 8.7],
    lookAt: [0, 0.7, -7.5],
    fog: 0.021,
    moon: [3.2, 3.8, -16],
    moonScale: 1.12,
    eclipse: 0.22,
  },
  {
    at: 0.42,
    position: [1.3, 0.8, 7.2],
    lookAt: [0.2, 0.45, -8.6],
    fog: 0.024,
    moon: [-2.8, 3.1, -15],
    moonScale: 1.28,
    eclipse: 0.42,
  },
  {
    at: 0.68,
    position: [-1.1, 1.65, 6.6],
    lookAt: [-0.4, 0.55, -9.3],
    fog: 0.028,
    moon: [2.2, 2.5, -13],
    moonScale: 1.5,
    eclipse: 0.68,
  },
  {
    at: 1,
    position: [0, 1.1, 5.6],
    lookAt: [0, 0.25, -10.5],
    fog: 0.032,
    moon: [0, 1.8, -11.5],
    moonScale: 1.9,
    eclipse: 0.94,
  },
];

export function sampleCameraPath(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let left = cameraShots[0];
  let right = cameraShots[cameraShots.length - 1];

  for (let index = 0; index < cameraShots.length - 1; index += 1) {
    const a = cameraShots[index];
    const b = cameraShots[index + 1];
    if (p >= a.at && p <= b.at) {
      left = a;
      right = b;
      break;
    }
  }

  const range = Math.max(0.0001, right.at - left.at);
  const local = THREE.MathUtils.smootherstep((p - left.at) / range, 0, 1);
  const lerpTuple = (a: [number, number, number], b: [number, number, number]) =>
    new THREE.Vector3(
      THREE.MathUtils.lerp(a[0], b[0], local),
      THREE.MathUtils.lerp(a[1], b[1], local),
      THREE.MathUtils.lerp(a[2], b[2], local),
    );

  return {
    position: lerpTuple(left.position, right.position),
    lookAt: lerpTuple(left.lookAt, right.lookAt),
    fog: THREE.MathUtils.lerp(left.fog, right.fog, local),
    moon: lerpTuple(left.moon, right.moon),
    moonScale: THREE.MathUtils.lerp(left.moonScale, right.moonScale, local),
    eclipse: THREE.MathUtils.lerp(left.eclipse, right.eclipse, local),
  };
}
