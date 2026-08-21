import Image from "next/image";
import { HERO_ASSETS, HERO_DEPTH } from "@/components/experience/hero/constants/hero-scene";

export function EnvironmentLayer() {
  return (
    <>
      <div
        className="th-hero-plane th-hero-atmosphere"
        data-hero-plane
        data-depth={HERO_DEPTH.atmosphere}
      >
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.mistBefore}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image"
            data-mist-before
          />
          <Image
            src={HERO_ASSETS.mistAfter}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image th-hero-state-after"
            data-mist-after
          />
        </div>
      </div>

      <div className="th-hero-plane th-hero-temple" data-hero-plane data-depth={HERO_DEPTH.temple}>
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.templeBefore}
            alt=""
            fill
            priority
            sizes="100vw"
            className="th-hero-image"
            data-temple-before
          />
          <Image
            src={HERO_ASSETS.templeAfter}
            alt=""
            fill
            priority
            sizes="100vw"
            className="th-hero-image th-hero-state-after"
            data-temple-after
          />
          <div className="th-hero-temple-light" data-temple-light />
        </div>
      </div>

      <div
        className="th-hero-plane th-hero-mist-mid"
        data-hero-plane
        data-depth={HERO_DEPTH.mistMid}
      >
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.mistCrimson}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image"
            data-mist-crimson
          />
        </div>
      </div>
    </>
  );
}
