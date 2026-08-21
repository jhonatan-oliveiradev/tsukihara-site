"use client";

import Image from "next/image";

export type ForegroundAsset = {
  src: string;
  alt?: string;
  className: string;
  sizes?: string;
};

export function ForegroundStage({
  id,
  assets,
}: {
  id: string;
  assets: ForegroundAsset[];
}) {
  return (
    <div className="fg-stage" data-fg={id} aria-hidden="true">
      {assets.map((asset) => (
        <div key={`${id}-${asset.src}-${asset.className}`} className={`fg-piece ${asset.className}`}>
          <Image
            src={asset.src}
            alt={asset.alt ?? ""}
            fill
            className="object-contain"
            sizes={asset.sizes ?? "35vw"}
          />
        </div>
      ))}
    </div>
  );
}
