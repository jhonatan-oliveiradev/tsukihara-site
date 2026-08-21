import { CharacterLayer } from "@/components/experience/hero/layers/character-layer";
import { EnvironmentLayer } from "@/components/experience/hero/layers/environment-layer";
import { FramingLayer } from "@/components/experience/hero/layers/framing-layer";
import { MoonLayer } from "@/components/experience/hero/layers/moon-layer";
import { PetalVortex } from "@/components/experience/hero/layers/petal-vortex";

export function HeroScene() {
  return (
    <div className="th-hero-scene" aria-hidden="true">
      <div className="th-hero-sky th-hero-sky-normal" data-sky-normal />
      <div className="th-hero-sky th-hero-sky-crimson" data-sky-crimson />
      <div className="th-hero-stars" data-hero-stars />
      <MoonLayer />
      <EnvironmentLayer />
      <FramingLayer />
      <CharacterLayer />
      <PetalVortex />
      <div className="th-hero-crimson-wash" data-crimson-wash />
      <div className="th-hero-vignette" />
    </div>
  );
}
