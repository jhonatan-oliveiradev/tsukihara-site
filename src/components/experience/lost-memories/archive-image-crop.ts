import type { CSSProperties } from "react";
import type { ArchiveRecord } from "@/components/experience/lost-memories/lost-memories-types";

type ArchiveCropContext = "surface" | "viewer" | "relic-thumbnail";

const photoScaleById: Record<string, number> = {
  "photo-family": 2.72,
  "photo-child": 2.72,
  "photo-priests": 2.72,
  "photo-village": 2.38,
  "photo-absence": 2.38,
};

function getRelicFocus(record: ArchiveRecord) {
  const hotspot = record.hotspot;
  if (!hotspot) return null;

  const x = hotspot.x + hotspot.width / 2;
  const y = hotspot.y + hotspot.height / 2;
  const scale = Math.min(5, Math.max(3.8, 78 / hotspot.width));

  return {
    position: `${x}% ${y}%`,
    scale,
  };
}

export function getArchiveImageStyle(
  record: ArchiveRecord,
  context: ArchiveCropContext,
): CSSProperties {
  if (record.kind === "photograph") {
    const position = record.crop?.objectPosition ?? "50% 50%";
    const baseScale = photoScaleById[record.id] ?? 2.6;
    const scale = context === "viewer" ? baseScale * 0.94 : baseScale;

    return {
      objectFit: "cover",
      objectPosition: position,
      transform: `scale(${scale})`,
      transformOrigin: position,
    };
  }

  if (record.kind === "relic") {
    const focus = getRelicFocus(record);
    if (!focus) return {};

    const scale =
      context === "viewer"
        ? focus.scale
        : context === "relic-thumbnail"
          ? focus.scale * 0.92
          : focus.scale;

    return {
      objectFit: "cover",
      objectPosition: focus.position,
      transform: `scale(${scale})`,
      transformOrigin: focus.position,
    };
  }

  return record.crop
    ? {
        objectPosition: record.crop.objectPosition,
        clipPath: record.crop.clipPath,
      }
    : {};
}
