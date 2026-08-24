import type { CSSProperties } from "react";
import type { ArchiveRecord } from "@/components/experience/lost-memories/lost-memories-types";

type ArchiveCropContext = "surface" | "viewer" | "relic-thumbnail";

const individualArchiveAssets: Record<string, string> = {
  "photo-family": "/09-lore-archives/photographs/l04a-spirit-photo-family-shrine.png",
  "photo-child": "/09-lore-archives/photographs/l04b-spirit-photo-child-talisman.png",
  "photo-priests": "/09-lore-archives/photographs/l04c-spirit-photo-moon-ritual.png",
  "photo-village": "/09-lore-archives/photographs/l04d-spirit-photo-eclipse-village.png",
  "photo-absence": "/09-lore-archives/photographs/l04e-spirit-photo-erased-presence.png",
  "relic-bell": "/09-lore-archives/relics/l05a-ritual-memory-bell.png",
  "relic-comb": "/09-lore-archives/relics/l05b-lunar-comb.png",
  "relic-mask": "/09-lore-archives/relics/l05c-broken-lunar-mask.png",
  "relic-amulet": "/09-lore-archives/relics/l05d-wayfarer-amulet.png",
  "relic-key": "/09-lore-archives/relics/l05e-eclipse-key.png",
};

export const unindexedSpiritPhotograph =
  "/09-lore-archives/photographs/l04f-spirit-photo-lunar-priest.png";

export function getArchiveImageSource(record: ArchiveRecord) {
  return individualArchiveAssets[record.id] ?? record.asset;
}

export function getArchiveImageStyle(
  record: ArchiveRecord,
  _context: ArchiveCropContext,
): CSSProperties {
  if (record.kind === "photograph") {
    return {
      objectFit: "cover",
      objectPosition: "center",
      transform: "none",
      transformOrigin: "center",
    };
  }

  if (record.kind === "relic") {
    return {
      objectFit: "contain",
      objectPosition: "center",
      transform: "none",
      transformOrigin: "center",
    };
  }

  return record.crop
    ? {
        objectPosition: record.crop.objectPosition,
        clipPath: record.crop.clipPath,
      }
    : {};
}
