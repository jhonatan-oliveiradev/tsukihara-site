"use client";

import { useRef } from "react";
import { CinematicFooter } from "@/components/experience/final-journey/cinematic-footer";
import { FinalEpilogue } from "@/components/experience/final-journey/final-epilogue";
import { useFinalJourneyMotion } from "@/components/experience/final-journey/use-final-journey-motion";
import { finalJourneyCopy } from "@/content/final-journey";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type CinematicEpilogueProps = {
  copy: Copy;
  locale: Locale;
};

export function CinematicEpilogue({ locale }: CinematicEpilogueProps) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = finalJourneyCopy[locale];

  useFinalJourneyMotion(rootRef);

  return (
    <section id="eclipse" ref={rootRef} data-section className="ix-final-journey">
      <FinalEpilogue copy={copy} />
      <CinematicFooter copy={copy} />
    </section>
  );
}
