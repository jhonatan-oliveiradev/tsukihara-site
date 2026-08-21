import Image from "next/image";
import { HERO_ASSETS, HERO_DEPTH } from "@/components/experience/hero/constants/hero-scene";

export function FramingLayer() {
  return (
    <>
      <div className="th-hero-plane th-hero-ground" data-hero-plane data-depth={HERO_DEPTH.ground}>
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.groundBefore}
            alt=""
            fill
            priority
            sizes="100vw"
            className="th-hero-image"
            data-ground-before
          />
          <Image
            src={HERO_ASSETS.groundAfter}
            alt=""
            fill
            priority
            sizes="100vw"
            className="th-hero-image th-hero-state-after"
            data-ground-after
          />
          <div className="th-hero-ground-glow" data-ground-glow />
        </div>
      </div>

      <div
        className="th-hero-plane th-hero-sakura-left"
        data-hero-plane
        data-depth={HERO_DEPTH.sakuraLeft}
      >
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.leftSakuraAfter}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image"
            data-sakura-left
          />
        </div>
      </div>

      <div
        className="th-hero-plane th-hero-sakura-right"
        data-hero-plane
        data-depth={HERO_DEPTH.sakuraRight}
      >
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.rightSakuraBefore}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image"
            data-sakura-right-before
          />
          <Image
            src={HERO_ASSETS.rightSakuraAfter}
            alt=""
            fill
            sizes="100vw"
            className="th-hero-image th-hero-state-after"
            data-sakura-right-after
          />
        </div>
      </div>

      <div
        className="th-hero-plane th-hero-left-foreground"
        data-hero-plane
        data-depth={HERO_DEPTH.foreground}
      >
        <div className="th-hero-pointer-plane" data-hero-pointer-plane>
          <Image
            src={HERO_ASSETS.lantern}
            alt=""
            width={520}
            height={680}
            className="th-hero-lantern"
          />
          <Image
            src={HERO_ASSETS.stones}
            alt=""
            width={1200}
            height={520}
            className="th-hero-stones"
          />
          <Image
            src={HERO_ASSETS.grass}
            alt=""
            width={1500}
            height={680}
            className="th-hero-grass"
          />
        </div>
      </div>
    </>
  );
}
