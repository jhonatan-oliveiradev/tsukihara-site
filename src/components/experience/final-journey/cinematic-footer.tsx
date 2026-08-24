import Image from "next/image";
import Link from "next/link";
import { FinalMoonEasterEgg } from "@/components/experience/final-journey/final-moon-easter-egg";
import type { FinalJourneyCopy } from "@/content/final-journey";

type CinematicFooterProps = {
  copy: FinalJourneyCopy;
};

const footerWorldAssets = {
  branch: "/secret-pathways-assets/foreground/png/sakura-branch.webp",
  ruins: "/secret-pathways-assets/foreground/png/shrine-ruins.webp",
  lantern: "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  bush: "/secret-pathways-assets/foreground/png/garden-bush.webp",
  stones: "/secret-pathways-assets/foreground/png/basalt-stones.webp",
  grass: "/secret-pathways-assets/foreground/png/tall-grass.webp",
  leaves: "/secret-pathways-assets/foreground/png/maple-leaves.webp",
} as const;

export function CinematicFooter({ copy }: CinematicFooterProps) {
  return (
    <footer className="ix-final-footer" data-final-footer>
      <div className="ix-final-footer__fade" aria-hidden="true" />

      <div className="ix-final-footer__world" aria-hidden="true">
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--ruins"
          data-final-footer-layer
          data-footer-depth="0.24"
        >
          <Image src={footerWorldAssets.ruins} alt="" fill sizes="42vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--branch"
          data-final-footer-layer
          data-footer-depth="0.36"
        >
          <Image src={footerWorldAssets.branch} alt="" fill sizes="38vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--lantern"
          data-final-footer-layer
          data-footer-depth="0.52"
        >
          <Image src={footerWorldAssets.lantern} alt="" fill sizes="19vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--bush"
          data-final-footer-layer
          data-footer-depth="0.64"
        >
          <Image src={footerWorldAssets.bush} alt="" fill sizes="34vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--stones"
          data-final-footer-layer
          data-footer-depth="0.72"
        >
          <Image src={footerWorldAssets.stones} alt="" fill sizes="36vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--grass"
          data-final-footer-layer
          data-footer-depth="0.82"
        >
          <Image src={footerWorldAssets.grass} alt="" fill sizes="48vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--leaves"
          data-final-footer-layer
          data-footer-depth="0.92"
        >
          <Image src={footerWorldAssets.leaves} alt="" fill sizes="34vw" />
        </div>
      </div>

      <div className="ix-final-footer__hud" aria-hidden="true" data-final-footer-content>
        <span>FINAL MEMORY / 09</span>
        <i />
        <span>TSUKIHARA ARCHIVE</span>
      </div>

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
