import Image from "next/image";
import { HERO_ASSETS, HERO_DEPTH } from "@/components/experience/hero/constants/hero-scene";

export function MoonLayer() {
  return (
    <div className="th-hero-plane th-hero-moon" data-hero-plane data-depth={HERO_DEPTH.moon}>
      <div className="th-hero-pointer-plane" data-hero-pointer-plane>
        <div className="th-hero-moon-halo th-hero-moon-halo-normal" data-moon-halo-normal />
        <div className="th-hero-moon-halo th-hero-moon-halo-crimson" data-moon-halo-crimson />
        <Image
          src={HERO_ASSETS.moonBefore}
          alt=""
          fill
          priority
          sizes="(max-width: 680px) 50vw, (max-width: 980px) 38vw, 31vw"
          className="th-hero-image th-hero-moon-before"
          data-moon-before
        />
        <Image
          src={HERO_ASSETS.moonAfter}
          alt=""
          fill
          priority
          sizes="(max-width: 680px) 50vw, (max-width: 980px) 38vw, 31vw"
          className="th-hero-image th-hero-moon-after"
          data-moon-after
        />
        <div className="th-hero-moon-shadow" data-moon-shadow />
      </div>
    </div>
  );
}
