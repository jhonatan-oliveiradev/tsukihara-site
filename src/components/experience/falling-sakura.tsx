import type { CSSProperties } from "react";

const petals = Array.from({ length: 18 }, (_, index) => ({
  x: 6 + ((index * 17) % 92),
  delay: -((index * 1.37) % 11),
  duration: 11 + ((index * 7) % 8),
  drift: -70 - ((index * 29) % 120),
  size: 5 + ((index * 3) % 8),
  rotate: 120 + ((index * 47) % 260),
  opacity: 0.28 + ((index * 9) % 38) / 100,
}));

type PetalStyle = CSSProperties & {
  "--petal-x": string;
  "--petal-delay": string;
  "--petal-duration": string;
  "--petal-drift": string;
  "--petal-size": string;
  "--petal-rotate": string;
  "--petal-opacity": number;
};

export function FallingSakura() {
  return (
    <div className="ix-sakura-fall" aria-hidden="true">
      {petals.map((petal, index) => {
        const style: PetalStyle = {
          "--petal-x": `${petal.x}vw`,
          "--petal-delay": `${petal.delay}s`,
          "--petal-duration": `${petal.duration}s`,
          "--petal-drift": `${petal.drift}px`,
          "--petal-size": `${petal.size}px`,
          "--petal-rotate": `${petal.rotate}deg`,
          "--petal-opacity": petal.opacity,
        };

        return <i key={index} style={style} />;
      })}
    </div>
  );
}
