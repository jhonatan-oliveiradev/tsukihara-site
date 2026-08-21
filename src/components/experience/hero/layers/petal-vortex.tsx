import Image from "next/image";
import type { CSSProperties } from "react";
import { HERO_ASSETS, HERO_PETALS } from "@/components/experience/hero/constants/hero-scene";

type PetalStyle = CSSProperties & {
  "--petal-x": string;
  "--petal-y": string;
  "--petal-size": string;
  "--petal-drift": string;
  "--petal-lift": string;
  "--petal-rotate": string;
  "--petal-delay": string;
};

export function PetalVortex() {
  return (
    <div className="th-hero-petal-vortex" data-petal-vortex aria-hidden="true">
      <div className="th-hero-petal-sheet th-hero-petal-sheet-left" data-petal-sheet-left>
        <Image
          src={HERO_ASSETS.leftPetalsBefore}
          alt=""
          fill
          sizes="100vw"
          className="th-hero-image"
          data-left-petals-before
        />
        <Image
          src={HERO_ASSETS.leftPetalsAfter}
          alt=""
          fill
          sizes="100vw"
          className="th-hero-image th-hero-state-after"
          data-left-petals-after
        />
      </div>
      <div className="th-hero-petal-sheet th-hero-petal-sheet-right" data-petal-sheet-right>
        <Image
          src={HERO_ASSETS.rightPetalsAfter}
          alt=""
          fill
          sizes="100vw"
          className="th-hero-image"
          data-right-petals-after
        />
      </div>

      {HERO_PETALS.map((petal) => {
        const style: PetalStyle = {
          "--petal-x": `${petal.x}vw`,
          "--petal-y": `${petal.y}vh`,
          "--petal-size": `${petal.size}px`,
          "--petal-drift": `${petal.drift}vw`,
          "--petal-lift": `${petal.lift}px`,
          "--petal-rotate": `${petal.rotate}deg`,
          "--petal-delay": `${petal.delay}s`,
        };
        return (
          <i
            key={petal.id}
            className={`th-hero-petal th-hero-petal-${petal.side} th-hero-petal-${petal.band}`}
            data-petal={petal.band}
            data-side={petal.side}
            style={style}
          />
        );
      })}
    </div>
  );
}
