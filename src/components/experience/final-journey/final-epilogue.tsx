import Image from "next/image";
import type { FinalJourneyCopy } from "@/content/final-journey";
import { finalJourneyAssets } from "@/content/final-journey";

type FinalEpilogueProps = {
  copy: FinalJourneyCopy;
};

export function FinalEpilogue({ copy }: FinalEpilogueProps) {
  return (
    <div className="ix-final-epilogue" data-final-epilogue>
      <div className="ix-final-epilogue__desktop-scene" aria-hidden="true">
        <div className="ix-final-layer ix-final-layer--horizon" data-final-horizon>
          <Image
            src={finalJourneyAssets.horizon}
            alt=""
            fill
            priority={false}
            sizes="100vw"
            className="ix-final-layer__image"
          />
        </div>
        <div className="ix-final-layer ix-final-layer--moon" data-final-moon>
          <Image
            src={finalJourneyAssets.moon}
            alt=""
            fill
            sizes="42vw"
            className="ix-final-layer__image ix-final-layer__image--contain"
          />
        </div>
        <div className="ix-final-layer ix-final-layer--characters" data-final-characters>
          <Image
            src={finalJourneyAssets.characters}
            alt=""
            fill
            sizes="52vw"
            className="ix-final-layer__image ix-final-layer__image--contain-bottom"
          />
        </div>
        <div className="ix-final-layer ix-final-layer--foreground">
          <Image
            src={finalJourneyAssets.foreground}
            alt=""
            fill
            sizes="100vw"
            className="ix-final-layer__image ix-final-layer__image--contain-bottom"
          />
        </div>
        <div className="ix-final-layer ix-final-layer--atmosphere" data-final-atmosphere>
          <Image
            src={finalJourneyAssets.atmosphere}
            alt=""
            fill
            sizes="100vw"
            className="ix-final-layer__image"
          />
        </div>
        <div className="ix-final-epilogue__veil" />
      </div>

      <div className="ix-final-epilogue__mobile-scene" aria-hidden="true">
        <Image
          src={finalJourneyAssets.hero}
          alt=""
          fill
          sizes="100vw"
          className="ix-final-epilogue__mobile-image"
        />
        <div className="ix-final-epilogue__mobile-veil" />
      </div>

      <div className="ix-final-epilogue__copy">
        <p className="ix-final-epilogue__eyebrow" data-final-copy>
          {copy.eyebrow}
        </p>
        <h2 data-final-copy>
          <span>{copy.headline[0]}</span>
          <span>{copy.headline[1]}</span>
        </h2>
        <div className="ix-final-epilogue__body" data-final-copy>
          {copy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {copy.ctaHref && (
          <a className="ix-final-epilogue__cta" href={copy.ctaHref} data-final-copy>
            <span>{copy.ctaLabel}</span>
            <i aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="ix-final-epilogue__horizon-copy" data-final-horizon-copy>
        <p>{copy.horizonLine}</p>
        <span>{copy.horizonMeta}</span>
      </div>
    </div>
  );
}
