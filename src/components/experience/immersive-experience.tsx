"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CharacterSpotlight } from "@/components/experience/character-spotlight";
import { CinematicEpilogue } from "@/components/experience/cinematic-epilogue";
import { CinematicHero } from "@/components/experience/cinematic-hero";
import { CinematicPreloader } from "@/components/experience/cinematic-preloader";
import { ExperiencePillars } from "@/components/experience/experience-pillars";
import { FallingSakura } from "@/components/experience/falling-sakura";
import { KintsugiChapter } from "@/components/experience/kintsugi-chapter";
import { NavLabelSwap } from "@/components/experience/nav-label-swap";
import { RealmAtlas } from "@/components/experience/realm-atlas";
import { TrailerChapter } from "@/components/experience/trailer-chapter";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

const ImmersiveWorld = dynamic(
  () => import("@/components/experience/immersive-world").then((module) => module.ImmersiveWorld),
  { ssr: false },
);

const AUDIO_VOLUME = 0.12;

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
    const lenis = reduced ? null : new Lenis({ lerp: 0.055, smoothWheel: true });

    const raf = (time: number) => lenis?.raf(time * 1000);
    const updateScrollTrigger = () => ScrollTrigger.update();
    const resizeLenis = () => lenis?.resize();

    if (lenis) {
      lenis.on("scroll", updateScrollTrigger);
      ScrollTrigger.addEventListener("refresh", resizeLenis);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element,
          { y: 28, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 91%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: ({ isActive }) => isActive && setActive(section.id),
        });
      });

      if (reduced) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".ix-kintsugi",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1,
          },
        })
        .fromTo(
          "[data-kintsugi-restored]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", ease: "none" },
          0.05,
        )
        .fromTo(
          "[data-kintsugi-seam]",
          { left: "2%", opacity: 0 },
          { left: "99%", opacity: 1, ease: "none" },
          0.05,
        )
        .fromTo("[data-kintsugi-line]", { scaleY: 0.04 }, { scaleY: 1, ease: "none" }, 0.12);

      gsap.fromTo(
        "[data-trailer-video]",
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-trailer-stage]",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.15,
          },
        },
      );
      gsap.fromTo(
        "[data-trailer-veil]",
        { clipPath: "inset(0 0 0 0)" },
        {
          clipPath: "inset(0 0 0 100%)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: "[data-trailer-stage]",
            start: "top 78%",
            end: "top 34%",
            scrub: 0.8,
          },
        },
      );

      gsap.fromTo(
        "[data-character-stage]",
        { yPercent: 8 },
        {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: ".ix-character-spotlight",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((pillar) => {
        const line = pillar.querySelector<HTMLElement>(".ix-pillar-index i");
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: pillar, start: "top 82%", end: "top 56%", scrub: 0.7 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scroll-kanji]").forEach((kanji, index) => {
        gsap.fromTo(
          kanji,
          { yPercent: index % 2 ? -7 : 7 },
          {
            yPercent: index % 2 ? 8 : -8,
            ease: "none",
            scrollTrigger: {
              trigger: kanji.closest("section") ?? kanji,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.25,
            },
          },
        );
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      if (lenis) {
        lenis.off("scroll", updateScrollTrigger);
        ScrollTrigger.removeEventListener("refresh", resizeLenis);
        gsap.ticker.remove(raf);
        lenis.destroy();
      }
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
    <div ref={root} className="ix-shell ix-overhaul-shell">
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
            onClick={() => setMenuOpen((value) => !value)}
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

      <main className="ix-story ix-story-overhaul">
        <CinematicHero copy={copy} locale={locale} />
        <KintsugiChapter copy={copy} locale={locale} />
        <RealmAtlas copy={copy} locale={locale} />
        <TrailerChapter copy={copy} locale={locale} />
        <CharacterSpotlight copy={copy} locale={locale} />
        <ExperiencePillars copy={copy} locale={locale} />
        <CinematicEpilogue copy={copy} locale={locale} />
      </main>
    </div>
  );
}
