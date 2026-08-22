import type { RealmId } from "@/content/realm-world";

type RealmMapPoint = {
  x: number;
  y: number;
  radius: number;
  popoverX: number;
  popoverY: number;
};

export const realmMapCalibration: Record<RealmId, RealmMapPoint> = {
  hanamori: { x: 48, y: 22, radius: 9, popoverX: 52, popoverY: 7 },
  kurogane: { x: 26, y: 24, radius: 9, popoverX: 8, popoverY: 8 },
  mizukyo: { x: 70, y: 29, radius: 9, popoverX: 68, popoverY: 8 },
  amahara: { x: 81, y: 49, radius: 9, popoverX: 57, popoverY: 34 },
  hinokagura: { x: 69, y: 68, radius: 9, popoverX: 70, popoverY: 54 },
  yumegakure: { x: 50, y: 70, radius: 9, popoverX: 52, popoverY: 54 },
  "yoru-no-mori": { x: 29, y: 61, radius: 9, popoverX: 8, popoverY: 54 },
  gekkai: { x: 16, y: 43, radius: 9, popoverX: 8, popoverY: 30 },
  "tsuki-no-miya": { x: 50, y: 43, radius: 10, popoverX: 53, popoverY: 28 },
};
