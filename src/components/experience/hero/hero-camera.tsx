import type { PropsWithChildren } from "react";

export function HeroCamera({ children }: PropsWithChildren) {
  return (
    <div className="th-hero-camera" data-hero-camera aria-hidden="true">
      {children}
    </div>
  );
}
