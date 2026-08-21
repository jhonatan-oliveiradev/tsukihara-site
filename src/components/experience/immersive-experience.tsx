"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CinematicPreloader } from "@/components/experience/cinematic-preloader";
import { FallingSakura } from "@/components/experience/falling-sakura";
import { HeroParallaxScene } from "@/components/experience/hero-parallax-scene";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { NavLabelSwap } from "@/components/experience/nav-label-swap";
import { realms } from "@/content/game";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

const ImmersiveWorld = dynamic(
  () => import("@/components/experience/immersive-world").then((module) => module.ImmersiveWorld),
  { ssr: false },
);

const AUDIO_VOLUME = 0.18;

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 14 14 4M7 4h7v7" fill="none" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

export function ImmersiveExperience() {
  const root = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [locale, setLocale] = useState<Locale>("pt");
  const [preloaded, setPreloaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const copy = immersiveCopy[locale];
  const finishPreload = useCallback(() => setPreloaded(true), []);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.065, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };
    if (lenis) frame = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element,
          { y: 24, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 52%",
          end: "bottom 52%",
          onToggle: ({ isActive }) => isActive && setActive(section.id),
        });
      });
      if (!reduced) {
        gsap.to("[data-hero-word]", {
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "#top",
            start: "top top",
            end: "bottom+=35% top",
            scrub: 1.2,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((media) => {
          const image = media.querySelector("img");
          if (!image) return;
          gsap.fromTo(
            image,
            { scale: 1.08, yPercent: -3 },
            {
              scale: 1,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: media,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.3,
              },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-scroll-kanji]").forEach((kanji, index) => {
          gsap.fromTo(
            kanji,
            { yPercent: index % 2 ? -8 : 8 },
            {
              yPercent: index % 2 ? 10 : -10,
              ease: "none",
              scrollTrigger: {
                trigger: kanji.closest("section") ?? kanji,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        });
      }
    }, root);

    return () => {
      ctx.revert();
      lenis?.destroy();
      cancelAnimationFrame(frame);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [locale]);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
  };

  const enter = async (withSound: boolean) => {
    setEntered(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = AUDIO_VOLUME;
    audio.muted = !withSound;
    setMuted(!withSound);
    try {
      await audio.play();
    } catch {
      setMuted(true);
    }
  };

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = AUDIO_VOLUME;
      try {
        await audio.play();
      } catch {
        return;
      }
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const nav = [
    ["gate", copy.nav.threshold, copy.navJp.threshold],
    ["realms", copy.nav.realms, copy.navJp.realms],
    ["akari", copy.nav.akari, copy.navJp.akari],
    ["lore", copy.nav.lore, copy.navJp.lore],
    ["eclipse", copy.nav.eclipse, copy.navJp.eclipse],
  ] as const;

  return (
    <div ref={root} className="ix-shell">
      {!preloaded && <CinematicPreloader onComplete={finishPreload} />}
      <audio ref={audioRef} src="/audio/tsukihara-theme.mp3" loop preload="metadata" />
      <ImmersiveWorld />
      <div className="ix-vignette" aria-hidden="true" />
      <div className="ix-grain" aria-hidden="true" />
      <FallingSakura />

      {preloaded && !entered && (
        <div className="ix-entry">
          <div className="ix-entry-inner">
            <span>{copy.enter.overline}</span>
            <Image
              src="/assets_hq/logotipo.png"
              alt="Tsukihara"
              width={560}
              height={315}
              priority
            />
            <p>{copy.enter.line}</p>
            <div className="ix-entry-actions">
              <button type="button" onClick={() => enter(true)}>
                {copy.enter.withSound}
              </button>
              <button type="button" onClick={() => enter(false)}>
                {copy.enter.silent}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="ix-header">
        <Link href="#top" className="ix-brand" aria-label="Tsukihara">
          <span className="ix-brand-moon" />
          <span>TSUKIHARA</span>
          <small>月の原</small>
        </Link>
        <nav className="ix-nav" aria-label="Main navigation">
          {nav.map(([id, label, jp]) => (
            <Link key={id} href={`#${id}`} className={active === id ? "is-active" : ""}>
              <NavLabelSwap primary={label} secondary={jp} />
            </Link>
          ))}
        </nav>
        <div className="ix-header-actions">
          <div className="ix-language" aria-label={copy.languageLabel}>
            <button
              type="button"
              className={locale === "pt" ? "is-active" : ""}
              onClick={() => changeLocale("pt")}
            >
              PT
            </button>
            <span>/</span>
            <button
              type="button"
              className={locale === "en" ? "is-active" : ""}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="ix-sound"
            onClick={toggleMute}
            aria-pressed={!muted}
            aria-label={`${copy.nav.sound}: ${muted ? "off" : "on"}`}
            title={copy.nav.sound}
          >
            <span className="ix-sound-bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{copy.nav.sound}</span>
          </button>
          <button
            type="button"
            className="ix-menu"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? copy.nav.close : copy.nav.menu}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="ix-mobile-menu">
          {nav.map(([id, label, jp], index) => (
            <Link key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>
              <b>{label}</b>
              <small lang="ja">{jp}</small>
            </Link>
          ))}
        </div>
      )}

      <main className="ix-story">
        <section id="top" data-section className="ix-hero">
          <HeroParallaxScene />
          <div className="ix-kanji-ghost ix-kanji-hero" data-scroll-kanji aria-hidden="true">
            月蝕
          </div>
          <div className="ix-hero-copy">
            <p className="ix-eyebrow" data-reveal>
              <b>月母</b> {copy.hero.eyebrow}
            </p>
            <h1>
              <JpRevealText jp={copy.hero.titleJp} text={copy.hero.title} locale={locale} />
            </h1>
            <p data-reveal>{copy.hero.body}</p>
          </div>
          <div className="ix-hero-logo" data-reveal>
            <Image
              src="/assets_hq/logotipo.png"
              alt="Tsukihara"
              width={520}
              height={293}
              priority
            />
          </div>
          <div className="ix-hero-word" data-hero-word aria-hidden="true">
            TSUKIHARA
          </div>
          <div className="ix-hero-jp" aria-hidden="true">
            {copy.hero.vertical}
          </div>
          <a href="#gate" className="ix-scroll-cue" data-reveal>
            {copy.hero.cue}
            <i />
          </a>
        </section>

        <section id="gate" data-section className="ix-section ix-threshold">
          <Image
            src="/secret-pathways-assets/foreground/png/sakura-branch.webp"
            alt=""
            width={900}
            height={900}
            className="ix-secret-asset ix-secret-branch"
            aria-hidden="true"
          />
          <div className="ix-kanji-ghost ix-kanji-gate" data-scroll-kanji aria-hidden="true">
            月継
          </div>
          <div className="ix-section-label">
            <span>{copy.threshold.label}</span>
            <i />
            <span>月継</span>
          </div>
          <div className="ix-manifesto">
            <h2>
              <JpRevealText
                jp={copy.threshold.titleJp}
                text={copy.threshold.title}
                locale={locale}
              />
            </h2>
            <div data-reveal>
              <p>{copy.threshold.body}</p>
              <a href="#realms">
                {copy.threshold.cta}
                <Arrow />
              </a>
            </div>
          </div>
          <div className="ix-stats" data-reveal>
            {copy.threshold.stats.map(([n, label]) => (
              <div key={label}>
                <b>{n}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="realms" data-section className="ix-section ix-realms">
          <div className="ix-kanji-ghost ix-kanji-realms" data-scroll-kanji aria-hidden="true">
            九国
          </div>
          <div className="ix-section-label">
            <span>{copy.realmsIntro.label}</span>
            <i />
            <span>世界</span>
          </div>
          <div className="ix-realms-intro">
            <h2>
              <JpRevealText
                jp={copy.realmsIntro.titleJp}
                text={copy.realmsIntro.title}
                locale={locale}
              />
            </h2>
            <p data-reveal>{copy.realmsIntro.body}</p>
          </div>
          <div className="ix-realm-grid">
            {realms.map((realm, index) => {
              const local = copy.realms[realm.id as keyof typeof copy.realms];
              return (
                <article key={realm.id} className={`ix-realm ix-realm-${index + 1}`} data-shot>
                  <div className="ix-realm-media">
                    <Image
                      src={realm.image}
                      alt={realm.title}
                      fill
                      className="object-cover"
                      sizes={index === 0 ? "64vw" : "34vw"}
                    />
                  </div>
                  <div className="ix-realm-caption">
                    <span>0{index + 1}</span>
                    <div>
                      <small>
                        {realm.kanji} · {local.label}
                      </small>
                      <h3>{realm.title}</h3>
                      <p>{local.copy}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ix-trailer" aria-labelledby="trailer-title">
          <div className="ix-trailer-mark" aria-hidden="true">
            剣舞
          </div>
          <div className="ix-trailer-head">
            <h2 id="trailer-title">
              <JpRevealText jp={copy.trailer.titleJp} text={copy.trailer.title} locale={locale} />
            </h2>
            <div>
              <p className="ix-eyebrow" data-reveal>
                {copy.trailer.label}
              </p>
              <p data-reveal>{copy.trailer.body}</p>
            </div>
          </div>
          <div className="ix-trailer-frame" data-reveal>
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/assets_hq/video_battle.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section id="akari" data-section className="ix-section ix-akari">
          <div className="ix-kanji-ghost ix-kanji-akari" data-scroll-kanji aria-hidden="true">
            朱莉
          </div>
          <div className="ix-akari-art">
            <span aria-hidden="true">朱莉</span>
            <Image
              src="/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png"
              alt="Akari no Rei"
              fill
              className="object-contain object-bottom"
              sizes="(max-width:760px) 88vw, 44vw"
            />
          </div>
          <div className="ix-akari-copy">
            <p className="ix-eyebrow" data-reveal>
              {copy.akari.eyebrow}
            </p>
            <h2>
              <JpRevealText jp={copy.akari.titleJp} text={copy.akari.title} locale={locale} />
            </h2>
            <p data-reveal>{copy.akari.body}</p>
            <div className="ix-specs" data-reveal>
              {copy.akari.specs.map((spec) => (
                <span key={spec}>{spec}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="lore" data-section className="ix-section ix-lore">
          <Image
            src="/secret-pathways-assets/foreground/png/stone-lantern.webp"
            alt=""
            width={520}
            height={740}
            className="ix-secret-asset ix-secret-lantern"
            aria-hidden="true"
          />
          <div className="ix-kanji-ghost ix-kanji-lore" data-scroll-kanji aria-hidden="true">
            記憶
          </div>
          <div className="ix-section-label">
            <span>{copy.lore.label}</span>
            <i />
            <span>記憶</span>
          </div>
          <div className="ix-lore-intro">
            <h2>
              <JpRevealText jp={copy.lore.titleJp} text={copy.lore.title} locale={locale} />
            </h2>
            <p data-reveal>{copy.lore.intro}</p>
          </div>
          <div className="ix-lore-grid">
            {copy.lore.items.map(([index, title, kanji, body]) => (
              <article key={title} data-reveal>
                <span>{index}</span>
                <h3>
                  {title}
                  <small>{kanji}</small>
                </h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="eclipse" data-section className="ix-afterlight">
          <div className="ix-kanji-ghost ix-kanji-eclipse" data-scroll-kanji aria-hidden="true">
            紅蝕
          </div>
          <div className="ix-after-copy">
            <p className="ix-eyebrow" data-reveal>
              {copy.eclipse.label}
            </p>
            <h2>
              <JpRevealText jp={copy.eclipse.titleJp} text={copy.eclipse.title} locale={locale} />
            </h2>
            <p data-reveal>{copy.eclipse.body}</p>
            <div className="ix-after-actions" data-reveal>
              <span>{copy.eclipse.development}</span>
              <a href="#top">
                {copy.eclipse.return}
                <Arrow />
              </a>
            </div>
          </div>
          <div className="ix-after-akari">
            <Image
              src="/assets_hq/AKARI_NO_REI_CANONICAL_MODEL_V02.png"
              alt="Akari no Rei"
              fill
              className="object-contain object-bottom"
              sizes="(max-width:760px) 78vw, 38vw"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
