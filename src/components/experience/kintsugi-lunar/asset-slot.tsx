import Image from "next/image";
import { kintsugiAssets, type KintsugiAssetCode } from "@/content/kintsugi-lunar";

const KINTSUGI_ASSET_PATHS: Record<KintsugiAssetCode, string> = {
  K01: "/assets/kintsugi-lunar/characters/k01-akari-standard.png",
  K02: "/assets/kintsugi-lunar/characters/k02-akari-kintsugi-lunar.png",
  K03: "/assets/kintsugi-lunar/k03-kitsune-mask.png",
  K04: "/assets/kintsugi-lunar/k04-lunar-katana.png",
  K05: "/assets/kintsugi-lunar/effects/k05-kintsugi-cracks-overlay.png",
  K06: "/assets/kintsugi-lunar/effects/k06-kintsugi-energy-overlay.png",
  K07: "/assets/kintsugi-lunar/scenes/k07-broken-shrine-scene.png",
  K08: "/assets/kintsugi-lunar/scenes/k08-restored-shrine-scene.png",
  K09: "/assets/kintsugi-lunar/gameplay/k09-gameplay-restore.png",
  K10: "/assets/kintsugi-lunar/gameplay/k10-gameplay-reveal.png",
  K11: "/assets/kintsugi-lunar/gameplay/k11-gameplay-traverse.png",
  K12: "/assets/kintsugi-lunar/gameplay/k12-gameplay-combat.png",
  K13: "/assets/kintsugi-lunar/characters/k13-akari-kintsugi-hero.png",
  K14: "/assets/kintsugi-lunar/k14-crimson-moon.png",
  K15: "/assets/kintsugi-lunar/gameplay/k15-kintsugi-environment-fragments.png",
};

type KintsugiAssetSlotProps = {
  code: KintsugiAssetCode;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function KintsugiAssetSlot({
  code,
  className = "",
  imageClassName = "",
  sizes = "100vw",
  priority = false,
  decorative = true,
}: KintsugiAssetSlotProps) {
  const asset = kintsugiAssets[code];

  return (
    <figure
      className={`ix-kl-asset ${className}`.trim()}
      data-kintsugi-asset={code}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={KINTSUGI_ASSET_PATHS[code]}
        alt={decorative ? "" : asset.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={imageClassName}
        style={{ objectPosition: asset.objectPosition }}
      />
      <figcaption className="sr-only">{code}</figcaption>
    </figure>
  );
}
