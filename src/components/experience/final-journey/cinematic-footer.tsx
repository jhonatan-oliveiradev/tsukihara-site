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
  pine: "/secret-pathways-assets/foreground/png/pine-tree.webp",
} as const;

export function CinematicFooter({ copy }: CinematicFooterProps) {
  return (
    <footer className="ix-final-footer" data-final-footer>
      <div className="ix-final-footer__fade" aria-hidden="true" />

      <div className="ix-final-footer__world" aria-hidden="true">
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--ruins"
          data-final-footer-layer
          data-footer-depth="0.2"
        >
          <Image src={footerWorldAssets.ruins} alt="" fill sizes="42vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--pine"
          data-final-footer-layer
          data-footer-depth="0.28"
        >
          <Image src={footerWorldAssets.pine} alt="" fill sizes="28vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--branch"
          data-final-footer-layer
          data-footer-depth="0.38"
        >
          <Image src={footerWorldAssets.branch} alt="" fill sizes="40vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--lantern"
          data-final-footer-layer
          data-footer-depth="0.56"
        >
          <Image src={footerWorldAssets.lantern} alt="" fill sizes="19vw" />
          <i className="ix-final-footer__lantern-glow" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--bush"
          data-final-footer-layer
          data-footer-depth="0.66"
        >
          <Image src={footerWorldAssets.bush} alt="" fill sizes="34vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--stones"
          data-final-footer-layer
          data-footer-depth="0.76"
        >
          <Image src={footerWorldAssets.stones} alt="" fill sizes="36vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--grass"
          data-final-footer-layer
          data-footer-depth="0.86"
        >
          <Image src={footerWorldAssets.grass} alt="" fill sizes="48vw" />
        </div>
        <div
          className="ix-final-footer__world-layer ix-final-footer__world-layer--leaves"
          data-final-footer-layer
          data-footer-depth="0.96"
        >
          <Image src={footerWorldAssets.leaves} alt="" fill sizes="34vw" />
        </div>
      </div>

      <div className="ix-final-footer__hud ix-final-footer__hud--left" aria-hidden="true">
        <span>ARCHIVE TERMINAL / 09</span>
        <i />
        <span>MEMORY LINK: ACTIVE</span>
      </div>

      <div className="ix-final-footer__hud ix-final-footer__hud--right" aria-hidden="true">
        <span>{copy.horizonMeta}</span>
        <i />
        <span>月原 / END OF RECORD</span>
      </div>

      <div className="ix-final-footer__inner">
        <div className="ix-final-footer__brand" data-final-footer-content>
          <span className="ix-final-footer__brand-mark" aria-hidden="true">
            月原
          </span>
          <div>
            <strong>{copy.brand}</strong>
            <span>{copy.subtitle}</span>
          </div>
        </div>

        <div className="ix-final-footer__navigation" data-final-footer-content>
          <span className="ix-final-footer__navigation-label">CHAPTER INDEX</span>
          <nav aria-label={copy.navigationLabel}>
            {copy.navigation.map((item, index) => (
              <Link key={item.href} href={item.href} className="ix-final-footer__link">
                <span className="ix-final-footer__link-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="ix-final-footer__link-label">{item.label}</span>
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
          <small>FINAL MEMORY</small>
          <span>{copy.signature}</span>
          <i aria-hidden="true" />
        </div>

        <div className="ix-final-footer__legal" data-final-footer-content>
          <div>
            <span>{copy.copyright}</span>
            <span>{copy.rights}</span>
          </div>
          <span className="ix-final-footer__legal-status">RECORD CLOSED / JOURNEY CONTINUES</span>
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
