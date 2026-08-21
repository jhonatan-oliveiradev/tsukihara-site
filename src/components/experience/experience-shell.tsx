"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { chapterNav, realms } from "@/content/game";

const WorldCanvas = dynamic(
  () => import("@/components/experience/world-canvas").then((module) => module.WorldCanvas),
  { ssr: false },
);

const lore = [
  ["01", "Moonbound Vows", "月誓", "Promises spoken beneath the moon do not disappear when they are broken."],
  ["02", "Sacred Temples", "神殿", "Every sanctuary remembers the hands that built it and the spirits that remained."],
  ["03", "Guardian Spirits", "守護", "Some companions choose a person long before that person understands why."],
  ["04", "Forgotten Iron", "黒鉄", "Ruined metal and burned stone mark the kingdoms that tried to master the eclipse."],
  ["05", "The Eclipse", "月蝕", "When the moon is swallowed, memory stops behaving like the past."],
] as const;

function RevealWords({ text }: { text: string }) {
  return (
    <span data-words aria-label={text}>
      {text.split(/\s+/).map((word, index, words) => (
        <span className="word-mask" aria-hidden="true" key={`${word}-${index}`}>
          <span className="word-unit">
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
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

export function ExperienceShell() {
  const root = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

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
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.05,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-rv]").forEach((element) => {
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
          xPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-akari]", {
          yPercent: -8,
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((media) => {
          gsap.fromTo(
            media.querySelector("img"),
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
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
  }, []);

  const enter = async (withSound: boolean) => {
    setEntered(true);
    setSoundOn(withSound);
    if (withSound && audioRef.current) {
      try {
        audioRef.current.volume = 0.42;
        await audioRef.current.play();
      } catch {
        setSoundOn(false);
      }
    }
  };

  const toggleSound = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try {
        audioRef.current.volume = 0.42;
        await audioRef.current.play();
        setSoundOn(true);
      } catch {
        setSoundOn(false);
      }
    } else {
      audioRef.current.pause();
      setSoundOn(false);
    }
  };

  return (
    <div ref={root} className="site-shell">
      <audio ref={audioRef} src="/audio/tsukihara-theme.mp3" loop preload="none" />
      <WorldCanvas />
      <div className="vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      {!entered && (
        <div className="entry-gate">
          <div className="entry-gate-copy">
            <span>月の原</span>
            <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={520} height={293} priority />
            <p>Enter beneath the moon.</p>
            <div>
              <button type="button" onClick={() => enter(true)}>Enter with sound</button>
              <button type="button" onClick={() => enter(false)}>Enter silently</button>
            </div>
          </div>
        </div>
      )}

      <header className="site-nav">
        <Link href="#top" className="brand-mark" aria-label="Tsukihara — início">
          <span className="brand-moon" />
          <span>TSUKIHARA</span>
          <small>月の原</small>
        </Link>
        <nav className="nav-index" aria-label="Navegação principal">
          {chapterNav.map((item) => (
            <Link key={item.href} href={item.href} className={active === item.href.slice(1) ? "is-active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="sound-toggle" onClick={toggleSound} aria-pressed={soundOn}>
          <span>{soundOn ? "Sound on" : "Sound off"}</span><i />
        </button>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu">
          <span>{menuOpen ? "Close" : "Menu"}</span><i />
        </button>
      </header>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Navegação mobile">
            {chapterNav.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>{item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <aside className="chapter-rail" aria-label="Progresso dos capítulos">
        {["top", "gate", "realms", "akari", "lore", "eclipse"].map((id, index) => (
          <Link key={id} href={`#${id}`} aria-label={`Ir para capítulo ${index}`} className={active === id ? "is-active" : ""}><i /></Link>
        ))}
      </aside>

      <main className="story">
        <section id="top" data-section data-cam="0" className="hero hero-kage">
          <div className="hero-copy-kage">
            <p className="eyebrow" data-rv><b>朱莉</b> Chapter 00 — beneath the eclipse</p>
            <h1><RevealWords text="Where memory becomes a blade." /></h1>
            <p data-rv>Enter sacred thresholds, drowned valleys and forgotten iron as Akari walks toward a moon that remembers every vow.</p>
          </div>
          <div className="hero-akari" data-hero-akari>
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill priority className="object-contain object-bottom" sizes="(max-width: 760px) 78vw, 36vw" />
          </div>
          <div className="hero-logo-kage" data-rv>
            <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={540} height={304} priority />
          </div>
          <div className="hero-word" data-hero-word aria-hidden="true">TSUKIHARA</div>
          <div className="hero-jp-vertical" aria-hidden="true">月蝕ノ道</div>
          <a href="#gate" className="hero-cue" data-rv><span>Scroll to enter</span><span><i /></span></a>
        </section>

        <section id="gate" data-section data-cam="1" className="sec gate-section">
          <div className="sec-label"><span>01 — THE THRESHOLD</span><i /><span>門</span></div>
          <div className="manifesto-grid">
            <h2><RevealWords text="A sacred world, already beginning to fracture." /></h2>
            <div data-rv>
              <p>Tsukihara begins at the edge of a sanctuary. Beauty remains, but every place carries evidence of something older moving beneath it.</p>
              <a href="#realms" className="text-link">Cross the threshold <Arrow /></a>
            </div>
          </div>
          <div className="world-stats" data-rv>
            <div><b>03</b><span>known realms</span></div>
            <div><b>01</b><span>moon in change</span></div>
            <div><b>05</b><span>lore pillars</span></div>
            <div><b>∞</b><span>remembered vows</span></div>
          </div>
        </section>

        <section id="realms" data-section data-cam="2" className="sec realms-archive">
          <div className="sec-label"><span>02 — THE REALMS</span><i /><span>世界</span></div>
          <div className="archive-grid">
            {realms.map((realm, index) => (
              <article key={realm.id} className={`archive-card archive-${index + 1}`} data-shot>
                <div className="archive-media"><Image src={realm.image} alt={realm.title} fill className="object-cover" sizes={index === 0 ? "65vw" : "34vw"} /></div>
                <div className="archive-caption"><span>0{index + 1}</span><div><b>{realm.title}</b><small>{realm.kanji} · {realm.label}</small></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="akari" data-section data-cam="3" className="sec character-spread">
          <div className="character-art"><span aria-hidden="true">朱莉</span><Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill className="object-contain object-bottom" sizes="(max-width: 760px) 86vw, 42vw" /></div>
          <div className="character-copy">
            <p className="eyebrow" data-rv><b>03</b> AKARI NO REI — 朱莉</p>
            <h2><RevealWords text="She enters as a swordswoman. She leaves changed by the moon." /></h2>
            <p data-rv>Akari is the emotional axis of Tsukihara: memory, duty and transformation condensed into a single path through the kingdoms.</p>
            <div className="character-spec" data-rv><span>Weapon — Blade</span><span>Motif — Vermilion / Sakura</span><span>State — Akari no Rei</span></div>
          </div>
        </section>

        <section id="lore" data-section data-cam="4" className="sec lore-section">
          <div className="lore-intro"><h2><RevealWords text="Five pillars. One world under a changing moon." /></h2><p data-rv>Each chapter is a fragment of the mythology that shapes the journey.</p></div>
          <div className="lore-grid">
            {lore.map(([index, title, kanji, copy]) => (
              <article key={title} data-rv><span>{index}</span><h3>{title} <small>{kanji}</small></h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section id="eclipse" data-section data-cam="5" className="sec afterlight-section">
          <div className="afterlight-copy">
            <p className="eyebrow" data-rv>05 — AFTERLIGHT · 月蝕</p>
            <h2><RevealWords text="When the moon closes, the story opens." /></h2>
            <p data-rv>Tsukihara is in development. New characters, gameplay, music and the first trailer will arrive as the world takes shape.</p>
            <div className="closing-actions" data-rv><span><b>Wishlist on Steam</b><small>Coming soon</small></span><a href="#top">Return to the beginning <Arrow /></a></div>
          </div>
          <div className="afterlight-mark" aria-hidden="true">AFTERLIGHT</div>
        </section>
      </main>

      <footer className="site-footer footer-kage">
        <div><Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={300} height={169} /><p>A moonlit action-adventure about memory, sacred places and what awakens beneath an eclipse.</p></div>
        <div><span>Educational interaction study inspired by Kage — Meng To.</span><span>Tsukihara · in development</span></div>
      </footer>
    </div>
  );
}
