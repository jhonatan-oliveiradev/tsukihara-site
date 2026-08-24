import Link from "next/link";
import { FinalMoonEasterEgg } from "@/components/experience/final-journey/final-moon-easter-egg";
import type { FinalJourneyCopy } from "@/content/final-journey";

type CinematicFooterProps = {
  copy: FinalJourneyCopy;
};

export function CinematicFooter({ copy }: CinematicFooterProps) {
  return (
    <footer className="ix-final-footer" data-final-footer>
      <div className="ix-final-footer__fade" aria-hidden="true" />

      <div className="ix-final-footer__inner">
        <div className="ix-final-footer__brand" data-final-footer-content>
          <span className="ix-final-footer__brand-mark" aria-hidden="true">
            月
          </span>
          <div>
            <strong>{copy.brand}</strong>
            <span>{copy.subtitle}</span>
          </div>
        </div>

        <div className="ix-final-footer__navigation" data-final-footer-content>
          <nav aria-label={copy.navigationLabel}>
            {copy.navigation.map((item) => (
              <Link key={item.href} href={item.href} className="ix-final-footer__link">
                <span>{item.label}</span>
                <i aria-hidden="true" />
              </Link>
            ))}
          </nav>

          {copy.ctaHref && (
            <a className="ix-final-footer__cta" href={copy.ctaHref}>
              {copy.ctaLabel}
            </a>
          )}
        </div>

        {copy.socials.length > 0 && (
          <nav
            className="ix-final-footer__socials"
            aria-label={copy.socialLabel}
            data-final-footer-content
          >
            {copy.socials.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="ix-final-footer__easter" data-final-footer-content>
          <FinalMoonEasterEgg label={copy.easterEggLabel} message={copy.easterEggMessage} />
        </div>

        <div className="ix-final-footer__signature" data-final-footer-content>
          <span>{copy.signature}</span>
          <i aria-hidden="true" />
        </div>

        <div className="ix-final-footer__legal" data-final-footer-content>
          <div>
            <span>{copy.copyright}</span>
            <span>{copy.rights}</span>
          </div>
          {copy.legal.length > 0 && (
            <nav aria-label="Legal">
              {copy.legal.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
