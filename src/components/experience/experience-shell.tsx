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

function EditorialLabel({ jp, en, index }: { jp: string; en: string; index: string }) {
  return (
    <div className="editorial-label" data-fade>
      <span>{index}</span>
      <b>{jp}</b>
      <i />
      <small>{en}</small>
    </div>
  );
}

export function ExperienceShell() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");

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
            stagger: 0.045,
            duration: 1.05,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element,
          { y: 24, opacity: 0, filter: "blur(9px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 87%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        if (reduced) return;
        const amount = Number(element.dataset.parallax ?? 7);
        gsap.fromTo(
          element,
          { yPercent: amount * 0.55 },
          {
            yPercent: -amount * 0.55,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 52%",
          end: "bottom 48%",
          onToggle: ({ isActive }) => isActive && setActive(section.id),
        });
      });

      if (!reduced) {
        gsap.to("[data-hero-character]", {
          yPercent: -10,
          xPercent: 4,
          scale: 1.04,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -24,
          opacity: 0.12,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom 16%", scrub: true },
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

  return (
    <div ref={root} className="site-shell">
      <WorldCanvas />
      <div className="atmosphere-vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <header className="site-nav">
        <Link href="#top" className="brand-mark" aria-label="Tsukihara — início">
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
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Navegação mobile">
            {chapterNav.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <aside className="chapter-rail" aria-label="Progresso dos capítulos">
        {["top", "akari", "realms", "bonds", "eclipse"].map((id) => (
          <Link key={id} href={`#${id}`} aria-label={`Ir para ${id}`} className={active === id ? "is-active" : ""}>
            <i />
          </Link>
        ))}
      </aside>

      <main className="story">
        <section id="top" data-section className="hero">
          <div className="hero-jp" aria-hidden="true">
            月蝕ノ記憶
          </div>
          <div className="hero-character" data-hero-character>
            <Image
              src="/images/akari-no-rei.webp"
              alt="Akari no Rei"
              fill
              priority
              className="object-contain object-bottom"
              sizes="(max-width: 760px) 86vw, 42vw"
            />
          </div>
          <div className="hero-copy" data-hero-copy>
            <p className="micro-label" data-fade>
              月の原 · BENEATH THE MOON
            </p>
            <div className="hero-logo" data-fade>
              <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={620} height={350} priority />
            </div>
            <h1>
              <RevealWords text="A vow. A blade. A moon that should never have turned red." />
            </h1>
            <p className="hero-deck" data-fade>
              A cinematic action-adventure through sacred realms, forgotten memories and the awakening of Akari no Rei.
            </p>
            <a href="#akari" className="enter-world" data-fade>
              <span>Enter the eclipse</span>
              <i />
            </a>
          </div>
          <div className="hero-footnote" data-fade>
            <span>AN ORIGINAL GAME IN DEVELOPMENT</span>
            <span>SCROLL · 01 / 05</span>
          </div>
        </section>

        <section id="akari" data-section className="character-chapter character-chapter-akari">
          <div className="chapter-ghost" aria-hidden="true">
            朱莉
          </div>
          <div className="character-art character-art-left" data-parallax="9">
            <Image
              src="/images/akari-no-rei.webp"
              alt="Akari no Rei"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 760px) 82vw, 42vw"
            />
          </div>
          <div className="character-copy character-copy-right">
            <EditorialLabel jp="朱莉" en="AKARI NO REI" index="01" />
            <h2>
              <RevealWords text="The blade that walks between light and eclipse." />
            </h2>
            <p data-fade>
              Akari carries more than a sword. Her journey crosses memory, duty and an awakening that changes the shape of every realm she touches.
            </p>
            <dl className="character-meta" data-fade>
              <div>
                <dt>Weapon</dt>
                <dd>Blade</dd>
              </div>
              <div>
                <dt>Motif</dt>
                <dd>Vermilion · Sakura</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>Akari no Rei</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="bonds" data-section className="character-chapter character-chapter-haku">
          <div className="chapter-ghost chapter-ghost-right" aria-hidden="true">
            白
          </div>
          <div className="character-copy character-copy-left">
            <EditorialLabel jp="白" en="HAKU · GUARDIAN SPIRIT" index="02" />
            <h2>
              <RevealWords text="Some spirits choose who they will follow." />
            </h2>
            <p data-fade>
              Guardian, omen and witness — Haku is one of the presences bound to Akari&apos;s path as the eclipse moves closer.
            </p>
          </div>
          <div className="haku-frame" data-parallax="7">
            <Image
              src="/images/haku-eclipse.webp"
              alt="Haku beneath the eclipse"
              fill
              className="object-cover"
              sizes="(max-width: 760px) 92vw, 52vw"
            />
            <span className="frame-cross" aria-hidden="true" />
          </div>
        </section>

        <section id="realms" data-section className="realms-chapter">
          <div className="realms-heading">
            <EditorialLabel jp="九界" en="THREE CANTOS OF THE NINE REALMS" index="03" />
            <h2>
              <RevealWords text="Every place remembers a different version of the moon." />
            </h2>
          </div>
          <div className="realm-stack">
            {realms.map((realm, index) => (
              <article className={`realm-spread realm-spread-${index + 1}`} key={realm.id} id={realm.id}>
                <div className="realm-image" data-parallax={index % 2 === 0 ? "5" : "7"}>
                  <Image src={realm.image} alt={realm.title} fill className="object-cover" sizes="(max-width: 760px) 94vw, 66vw" />
                  <span />
                </div>
                <div className="realm-caption" data-fade>
                  <small>0{index + 1} · {realm.kanji}</small>
                  <h3>{realm.title}</h3>
                  <b>{realm.label}</b>
                  <p>{realm.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="eclipse" data-section className="eclipse-chapter">
          <div className="eclipse-copy">
            <EditorialLabel jp="月蝕" en="THE ECLIPSE" index="04" />
            <h2>
              <RevealWords text="When the moon closes, every vow is tested." />
            </h2>
            <p data-fade>
              The eclipse is not a chapter added at the end of Tsukihara. It is the force that has been following Akari through the entire journey.
            </p>
            <div className="closing-actions" data-fade>
              <span>
                <b>Wishlist on Steam</b>
                <small>Coming soon</small>
              </span>
              <a href="#top">Return to the beginning</a>
            </div>
          </div>
          <div className="eclipse-akari" data-parallax="5">
            <Image
              src="/images/akari-no-rei.webp"
              alt="Akari beneath the eclipse"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 760px) 80vw, 38vw"
            />
          </div>
          <div className="eclipse-jp" aria-hidden="true">
            終章
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={360} height={203} />
        <p>An original game currently in development.</p>
        <span>© 2026 TSUKIHARA · BENEATH THE MOON</span>
      </footer>
    </div>
  );
}
