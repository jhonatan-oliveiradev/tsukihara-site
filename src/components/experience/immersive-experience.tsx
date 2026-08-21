"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { realms } from "@/content/game";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

const ImmersiveWorld = dynamic(
  () => import("@/components/experience/immersive-world").then((module) => module.ImmersiveWorld),
  { ssr: false },
);

function RevealWords({ text }: { text: string }) {
  return (
    <span data-words aria-label={text}>
      {text.split(/\s+/).map((word, index, words) => (
        <span className="word-mask" aria-hidden="true" key={`${word}-${index}`}>
          <span className="word-unit">{word}{index < words.length - 1 ? "\u00a0" : ""}</span>
        </span>
      ))}
    </span>
  );
}

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
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const copy = immersiveCopy[locale];

  useEffect(() => {
    const saved = window.localStorage.getItem("tsukihara-locale");
    if (saved === "pt" || saved === "en") setLocale(saved);
    else if (!navigator.language.toLowerCase().startsWith("pt")) setLocale("en");
  }, []);

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
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element.querySelectorAll(".word-unit"),
          { yPercent: 112, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.045,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
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
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-akari]", {
          yPercent: -8,
          xPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((media) => {
          const image = media.querySelector("img");
          if (!image) return;
          gsap.fromTo(image, { scale: 1.08 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
          });
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
    window.localStorage.setItem("tsukihara-locale", next);
    document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
  };

  const enter = async (withSound: boolean) => {
    setEntered(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
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
      audio.volume = 0.4;
      try { await audio.play(); } catch { return; }
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const nav = [
    ["gate", copy.nav.threshold],
    ["realms", copy.nav.realms],
    ["akari", copy.nav.akari],
    ["lore", copy.nav.lore],
    ["eclipse", copy.nav.eclipse],
  ] as const;

  return (
    <div ref={root} className="ix-shell">
      <audio ref={audioRef} src="/audio/tsukihara-theme.mp3" loop preload="metadata" />
      <ImmersiveWorld />
      <div className="ix-vignette" aria-hidden="true" />
      <div className="ix-grain" aria-hidden="true" />

      {!entered && (
        <div className="ix-entry">
          <div className="ix-entry-inner">
            <span>{copy.enter.overline}</span>
            <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={560} height={315} priority />
            <p>{copy.enter.line}</p>
            <div className="ix-entry-actions">
              <button type="button" onClick={() => enter(true)}>{copy.enter.withSound}</button>
              <button type="button" onClick={() => enter(false)}>{copy.enter.silent}</button>
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
          {nav.map(([id, label]) => <Link key={id} href={`#${id}`} className={active === id ? "is-active" : ""}>{label}</Link>)}
        </nav>
        <div className="ix-header-actions">
          <div className="ix-language" aria-label={copy.languageLabel}>
            <button type="button" className={locale === "pt" ? "is-active" : ""} onClick={() => changeLocale("pt")}>PT</button>
            <span>/</span>
            <button type="button" className={locale === "en" ? "is-active" : ""} onClick={() => changeLocale("en")}>EN</button>
          </div>
          <button type="button" className="ix-sound" onClick={toggleMute} aria-pressed={!muted}>
            <span className="ix-sound-bars" aria-hidden="true"><i /><i /><i /></span>
            <span>{muted ? copy.nav.soundOff : copy.nav.soundOn}</span>
          </button>
          <button type="button" className="ix-menu" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
            {menuOpen ? copy.nav.close : copy.nav.menu}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="ix-mobile-menu">
          {nav.map(([id, label], index) => (
            <Link key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</Link>
          ))}
        </div>
      )}

      <main className="ix-story">
        <section id="top" data-section className="ix-hero">
          <div className="ix-hero-copy">
            <p className="ix-eyebrow" data-reveal><b>朱莉</b> {copy.hero.eyebrow}</p>
            <h1><RevealWords text={copy.hero.title} /></h1>
            <p data-reveal>{copy.hero.body}</p>
          </div>
          <div className="ix-hero-akari" data-hero-akari>
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill priority className="object-contain object-bottom" sizes="(max-width:760px) 80vw, 38vw" />
          </div>
          <div className="ix-hero-logo" data-reveal><Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={520} height={293} priority /></div>
          <div className="ix-hero-word" data-hero-word aria-hidden="true">TSUKIHARA</div>
          <div className="ix-hero-jp" aria-hidden="true">{copy.hero.vertical}</div>
          <a href="#gate" className="ix-scroll-cue" data-reveal>{copy.hero.cue}<i /></a>
        </section>

        <section id="gate" data-section className="ix-section ix-threshold">
          <div className="ix-section-label"><span>{copy.threshold.label}</span><i /><span>門</span></div>
          <div className="ix-manifesto">
            <h2><RevealWords text={copy.threshold.title} /></h2>
            <div data-reveal><p>{copy.threshold.body}</p><a href="#realms">{copy.threshold.cta}<Arrow /></a></div>
          </div>
          <div className="ix-stats" data-reveal>{copy.threshold.stats.map(([n, label]) => <div key={label}><b>{n}</b><span>{label}</span></div>)}</div>
        </section>

        <section id="realms" data-section className="ix-section ix-realms">
          <div className="ix-section-label"><span>{copy.realmsIntro.label}</span><i /><span>世界</span></div>
          <div className="ix-realms-intro"><h2><RevealWords text={copy.realmsIntro.title} /></h2><p data-reveal>{copy.realmsIntro.body}</p></div>
          <div className="ix-realm-grid">
            {realms.map((realm, index) => {
              const local = copy.realms[realm.id as keyof typeof copy.realms];
              return (
                <article key={realm.id} className={`ix-realm ix-realm-${index + 1}`} data-shot>
                  <div className="ix-realm-media"><Image src={realm.image} alt={realm.title} fill className="object-cover" sizes={index === 0 ? "64vw" : "34vw"} /></div>
                  <div className="ix-realm-caption"><span>0{index + 1}</span><div><small>{realm.kanji} · {local.label}</small><h3>{realm.title}</h3><p>{local.copy}</p></div></div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="akari" data-section className="ix-section ix-akari">
          <div className="ix-akari-art"><span aria-hidden="true">朱莉</span><Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill className="object-contain object-bottom" sizes="(max-width:760px) 88vw, 44vw" /></div>
          <div className="ix-akari-copy">
            <p className="ix-eyebrow" data-reveal>{copy.akari.eyebrow}</p>
            <h2><RevealWords text={copy.akari.title} /></h2>
            <p data-reveal>{copy.akari.body}</p>
            <div className="ix-specs" data-reveal>{copy.akari.specs.map((spec) => <span key={spec}>{spec}</span>)}</div>
          </div>
        </section>

        <section id="lore" data-section className="ix-section ix-lore">
          <div className="ix-section-label"><span>{copy.lore.label}</span><i /><span>記憶</span></div>
          <div className="ix-lore-intro"><h2><RevealWords text={copy.lore.title} /></h2><p data-reveal>{copy.lore.intro}</p></div>
          <div className="ix-lore-grid">{copy.lore.items.map(([index, title, kanji, body]) => <article key={title} data-reveal><span>{index}</span><h3>{title}<small>{kanji}</small></h3><p>{body}</p></article>)}</div>
        </section>

        <section id="eclipse" data-section className="ix-afterlight">
          <div className="ix-after-copy">
            <p className="ix-eyebrow" data-reveal>{copy.eclipse.label}</p>
            <h2><RevealWords text={copy.eclipse.title} /></h2>
            <p data-reveal>{copy.eclipse.body}</p>
            <div className="ix-after-actions" data-reveal><span>{copy.eclipse.development}</span><a href="#top">{copy.eclipse.return}<Arrow /></a></div>
          </div>
          <div className="ix-after-akari"><Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill className="object-contain object-bottom" sizes="(max-width:760px) 78vw, 38vw" /></div>
        </section>
      </main>
    </div>
  );
}
