"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { chapterNav, characters, realms } from "@/content/game";

const WorldCanvas = dynamic(
  () => import("@/components/experience/world-canvas").then((module) => module.WorldCanvas),
  { ssr: false },
);

function Arrow() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 14 14 4M7 4h7v7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
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
    const lenis = reduced ? null : new Lenis({ lerp: 0.07, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(raf);
    };
    if (lenis) frame = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((element) => {
        const text = element.textContent?.trim() ?? "";
        element.textContent = "";
        const words = text.split(/\s+/);
        words.forEach((word, index) => {
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const span = document.createElement("span");
          span.className = "word-unit";
          span.textContent = word + (index < words.length - 1 ? "\u00a0" : "");
          mask.appendChild(span);
          element.appendChild(mask);
        });
        if (reduced) return;
        gsap.fromTo(
          element.querySelectorAll(".word-unit"),
          { yPercent: 112, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.055,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element,
          { y: 28, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        if (reduced) return;
        const amount = Number(element.dataset.parallax ?? 8);
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
          start: "top 48%",
          end: "bottom 48%",
          onToggle: ({ isActive }) => isActive && setActive(section.id),
        });
      });

      if (!reduced) {
        gsap.to("[data-akari-hero]", {
          yPercent: -7,
          xPercent: 3,
          scale: 1.035,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-title]", {
          yPercent: -28,
          opacity: 0.22,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom 20%", scrub: true },
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
      <div className="vignette" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

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
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-menu">
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i />
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
        {["top", "akari", "realms", "bonds", "eclipse"].map((id, index) => (
          <Link key={id} href={`#${id}`} aria-label={`Ir para capítulo ${index}`} className={active === id ? "is-active" : ""}>
            <i />
          </Link>
        ))}
      </aside>

      <main className="story">
        <section id="top" data-section className="hero">
          <div className="hero-wash" />
          <div className="hero-jp" aria-hidden="true">月蝕ノ記憶</div>
          <div className="hero-character" data-akari-hero>
            <Image src="/images/akari-no-rei-cutout.webp" alt="Akari no Rei" fill priority quality={95} className="object-contain object-bottom" sizes="(max-width: 760px) 86vw, 48vw" />
          </div>
          <div className="hero-copy" data-hero-title>
            <p className="micro-label" data-fade>AN ORIGINAL ACTION ADVENTURE</p>
            <h1 className="hero-title" data-words>Where the moon remembers every vow.</h1>
            <p className="hero-deck" data-fade>
              Enter a world of sacred temples, drowned valleys and ruined iron — and follow Akari toward an eclipse that changes everything it touches.
            </p>
          </div>
          <div className="hero-logo" data-fade>
            <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={620} height={350} priority quality={95} />
          </div>
          <div className="hero-meta" data-fade>
            <span>In development</span>
            <span>Scroll to enter</span>
          </div>
          <a className="hero-preview" href="#realms" data-fade>
            <span className="preview-image">
              <Image src="/images/akari-moon.webp" alt="Akari under the moon" fill quality={92} className="object-cover" sizes="280px" />
            </span>
            <span className="preview-caption"><b>Prologue</b><small>Under the crimson moon</small></span>
          </a>
        </section>

        <section id="akari" data-section className="chapter akari-chapter">
          <div className="chapter-rule"><span>朱莉 — AKARI</span><i /><span>THE PROTAGONIST</span></div>
          <div className="akari-layout">
            <div className="akari-statement">
              <p className="micro-label" data-fade>BETWEEN LIGHT & ECLIPSE</p>
              <h2 data-words>She carries a blade into a world already breaking.</h2>
              <p data-fade>
                Akari is the visual and emotional center of Tsukihara. Her silhouette is restrained; her transformation is not. The deeper she travels, the more the world around her begins to answer back.
              </p>
            </div>
            <div className="akari-figure" data-parallax="10">
              <span className="akari-kanji" aria-hidden="true">朱莉</span>
              <Image src="/images/akari-standard.webp" alt="Akari" fill quality={95} className="object-contain object-bottom" sizes="(max-width: 760px) 92vw, 42vw" />
            </div>
            <div className="character-notes" data-fade>
              <div><span>Weapon</span><b>Blade</b></div>
              <div><span>Path</span><b>Moonlit realms</b></div>
              <div><span>State</span><b>Akari no Rei</b></div>
              <div><span>Motif</span><b>Vermilion / Sakura</b></div>
            </div>
          </div>
          <div className="transformation-strip" data-fade>
            <figure>
              <Image src="/images/akari-standard.webp" alt="Akari standard" fill quality={92} className="object-contain object-bottom" sizes="240px" />
              <figcaption><span>Standard</span><small>01</small></figcaption>
            </figure>
            <span className="transformation-line"><i /></span>
            <figure>
              <Image src="/images/akari-exalted.webp" alt="Akari exalted" fill quality={92} className="object-contain object-bottom" sizes="240px" />
              <figcaption><span>Awakened</span><small>02</small></figcaption>
            </figure>
            <span className="transformation-line"><i /></span>
            <figure>
              <Image src="/images/akari-no-rei-cutout.webp" alt="Akari no Rei" fill quality={92} className="object-contain object-bottom" sizes="240px" />
              <figcaption><span>No Rei</span><small>03</small></figcaption>
            </figure>
          </div>
        </section>

        <section id="realms" data-section className="chapter realms-chapter">
          <div className="realms-intro">
            <p className="micro-label" data-fade>THE WORLD OF TSUKIHARA</p>
            <h2 data-words>Three realms. Three different memories of the same moon.</h2>
            <p data-fade>Each region has its own weather, vertical rhythm, architecture and emotional temperature.</p>
          </div>

          <div className="realm-mosaic">
            {realms.map((realm, index) => (
              <article key={realm.id} id={realm.id} className={`realm-panel realm-panel-${index + 1}`} data-parallax={index === 0 ? "5" : "8"}>
                <div className="realm-media">
                  <Image src={realm.image} alt={realm.title} fill quality={95} className="object-cover" sizes={index === 0 ? "75vw" : "42vw"} />
                  <span className="realm-grade" />
                </div>
                <div className="realm-copy">
                  <span className="realm-index">0{index + 1}</span>
                  <p>{realm.kanji}</p>
                  <h3>{realm.title}</h3>
                  <small>{realm.label}</small>
                  <div>{realm.copy}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="world-note" data-fade>
            <span>WORLD DIRECTION</span>
            <p>From blossom-lit sanctuaries to collapsed iron ruins, Tsukihara should feel beautiful enough to invite you forward and haunted enough to make you hesitate.</p>
          </div>
        </section>

        <section id="bonds" data-section className="chapter bonds-chapter">
          <div className="bonds-backdrop" data-parallax="5">
            <Image src="/images/haku-eclipse.webp" alt="Haku beneath the eclipse" fill quality={95} className="object-cover" sizes="100vw" />
            <span />
          </div>
          <div className="bonds-title">
            <p className="micro-label" data-fade>SPIRITS · ALLIES · OMENS</p>
            <h2 data-words>No journey through Tsukihara is walked alone.</h2>
          </div>
          <div className="character-rail">
            {characters.map((character, index) => (
              <article key={character.name} data-fade style={{ "--i": index } as CSSProperties}>
                <div className="character-art">
                  <span className="character-kanji">{character.kanji}</span>
                  <Image src={character.image} alt={character.name} fill quality={92} className="object-contain object-bottom" sizes="(max-width: 760px) 62vw, 22vw" />
                </div>
                <div className="character-caption"><span>{character.name}</span><small>{character.role}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="chapter antagonists">
          <div className="antagonist-figure antagonist-lady" data-parallax="7">
            <Image src="/images/lady-tsukino.webp" alt="Lady Tsukino" fill quality={94} className="object-contain object-bottom" sizes="40vw" />
          </div>
          <div className="antagonist-figure antagonist-emperor" data-parallax="9">
            <Image src="/images/faceless-emperor.webp" alt="The Faceless Emperor" fill quality={94} className="object-contain object-bottom" sizes="40vw" />
          </div>
          <div className="antagonist-copy">
            <span className="jp-vertical" aria-hidden="true">月影ノ敵</span>
            <p className="micro-label" data-fade>BEYOND THE SHRINES</p>
            <h2 data-words>The eclipse has faces. Not all of them are human.</h2>
            <p data-fade>Lady Tsukino and the Faceless Emperor belong to the darker edge of the world — figures revealed as the journey moves from wonder into threat.</p>
          </div>
        </section>

        <section id="eclipse" data-section className="eclipse-chapter">
          <div className="eclipse-disc" aria-hidden="true"><i /><b /></div>
          <div className="eclipse-copy">
            <p className="micro-label" data-fade>月蝕 — THE ECLIPSE</p>
            <h2 data-words>When the moon turns red, every vow is tested.</h2>
            <p data-fade>Tsukihara is currently in development. This site will evolve alongside the game — new characters, gameplay, music and the first trailer will arrive here.</p>
            <div className="closing-actions" data-fade>
              <span className="coming-action"><b>Wishlist on Steam</b><small>Coming soon</small></span>
              <a href="#top"><span>Return to the beginning</span><Arrow /></a>
            </div>
          </div>
          <div className="eclipse-akari" data-parallax="4">
            <Image src="/images/akari-no-rei-cutout.webp" alt="Akari no Rei" fill quality={95} className="object-contain object-bottom" sizes="52vw" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-manifesto">
          <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={400} height={225} quality={95} />
          <p>A moonlit action-adventure about memory, duty and the things that awaken when sacred places stop being silent.</p>
        </div>
        <div className="footer-base"><span>TSUKIHARA — IN DEVELOPMENT</span><span>月の原</span><span>2026</span></div>
      </footer>
    </div>
  );
}
