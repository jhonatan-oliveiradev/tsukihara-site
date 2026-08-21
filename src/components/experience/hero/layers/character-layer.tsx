import Image from "next/image";
import { HERO_ASSETS, HERO_DEPTH } from "@/components/experience/hero/constants/hero-scene";

export function CharacterLayer() {
  return (
    <div
      className="th-hero-plane th-hero-characters"
      data-hero-plane
      data-depth={HERO_DEPTH.characters}
    >
      <div className="th-hero-pointer-plane" data-hero-pointer-plane>
        <div className="th-hero-character-rim" data-character-rim />
        <Image
          src={HERO_ASSETS.charactersBefore}
          alt=""
          fill
          priority
          sizes="(max-width: 680px) 96vw, (max-width: 980px) 76vw, 58vw"
          className="th-hero-image"
          data-characters-before
        />
        <Image
          src={HERO_ASSETS.charactersAfter}
          alt=""
          fill
          priority
          sizes="(max-width: 680px) 96vw, (max-width: 980px) 76vw, 58vw"
          className="th-hero-image th-hero-state-after"
          data-characters-after
        />
      </div>
    </div>
  );
}
