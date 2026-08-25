export type Point = { x: number; y: number };

export const distanceBetween = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const isWithinSnapRadius = (point: Point, home: Point, radius: number) =>
  distanceBetween(point, home) <= radius;

export const magneticProgress = (distance: number, radius: number) => {
  if (radius <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - distance / radius));
};
