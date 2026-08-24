import Image from "next/image";
import { motherMoonAssets, type MotherMoonAssetCode } from "@/content/mother-moon";

type MotherMoonAssetProps = {
  code: MotherMoonAssetCode;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function MotherMoonAsset({
  code,
  className,
  sizes = "100vw",
  priority = false,
}: MotherMoonAssetProps) {
  return (
    <Image
      src={motherMoonAssets[code]}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      aria-hidden="true"
      data-mm-asset={code}
    />
  );
}
