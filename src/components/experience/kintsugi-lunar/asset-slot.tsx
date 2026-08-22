import Image from "next/image";
import {
  kintsugiAssets,
  type KintsugiAssetCode,
} from "@/content/kintsugi-lunar";

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
        src={asset.src}
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
