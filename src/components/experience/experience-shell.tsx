"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { chapterNav, loreChapters, realms } from "@/content/game";

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

const railChapters = ["top", "manifesto", "realms", "akari", "bonds", "lore", "eclipse"];

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
            scrollTrigger: { trigger: element, start: "top 89%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((element) => {
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

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        if (reduced) return;
        gsap.fromTo(
          element,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 1.15,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        if (reduced) return;
        const amount = Number(element.dataset.parallax ?? 6);
        gsap.fromTo(
          element,
          { yPercent: amount * 0.5 },
          {
            yPercent: -amount * 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
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
        gsap.to("[data-hero-akari]", {
          yPercent: -8,
          xPercent: 2.5,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-word]", {
          xPercent: -10,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom 25%", scrub: true },
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
      <div className="scan-lines" aria-hidden="true" />

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
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i />
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
        {railChapters.map((id, index) => (
          <Link key={id} href={`#${id}`} aria-label={`Ir para capítulo ${index}`} className={active === id ? "is-active" : ""}>
            <i />
          </Link>
        ))}
      </aside>

      <main className="story">
        <section id="top" data-section className="sanctuary-hero">
          <div className="hero-atmosphere" />
          <div className="hero-kicker" data-fade>
            <span>序章 — PROLOGUE</span>
            <i />
            <span>THE MOON CLOSES ITS EYE</span>
          </div>
          <div className="hero-copy-stack" data-hero-copy>
            <p className="micro-label">A MOONLIT ACTION ADVENTURE</p>
            <div className="hero-logo-lockup" data-fade>
              <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={640} height={360} priority />
            </div>
            <h1>
              <RevealWords text="When memory wakes, the path forward becomes a blade." />
            </h1>
            <p data-fade>
              Cross sacred temples, drowned valleys and ruined iron as Akari follows an eclipse that changes every place it touches.
            </p>
            <a href="#manifesto" className="enter-world" data-fade>
              <span>Enter the sanctuary</span>
              <Arrow />
            </a>
          </div>
          <div className="hero-akari" data-hero-akari>
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill priority className="object-contain object-bottom" sizes="(max-width: 760px) 82vw, 34vw" />
          </div>
          <div className="hero-vertical-jp" aria-hidden="true">月蝕ノ記憶</div>
          <div className="hero-word" data-hero-word aria-hidden="true">TSUKIHARA</div>
          <div className="hero-progress" data-fade>
            <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
            <i />
            <small>Scroll to enter</small>
          </div>
        </section>

        <section id="manifesto" data-section className="chapter manifesto-section">
          <div className="chapter-index">
            <span>01 — WORLD PREMISE</span>
            <i />
            <span>世界観</span>
          </div>
          <div className="manifesto-grid">
            <h2><RevealWords text="Three realms. One eclipse. Nothing returns unchanged." /></h2>
            <div className="manifesto-copy" data-fade>
              <p>
                Tsukihara is a world where sacred places remember what people try to forget. Shrines hold names, spirits choose who they follow, and every path eventually turns toward the moon.
              </p>
              <p>
                Akari&apos;s journey begins as a pursuit through beautiful ruins and becomes a confrontation with memory, duty and the power awakened by the eclipse.
              </p>
              <a href="#realms" className="text-link"><span>Cross the threshold</span><Arrow /></a>
            </div>
          </div>
          <div className="world-stats" data-fade>
            <div><b>03</b><span>Known realms</span></div>
            <div><b>01</b><span>Crimson eclipse</span></div>
            <div><b>∞</b><span>Remembered vows</span></div>
            <div><b>月</b><span>One moon above all</span></div>
          </div>
        </section>

        <section id="realms" data-section className="chapter realm-archive">
          <div className="chapter-index">
            <span>02 — REALM ARCHIVE</span>
            <i />
            <span>三界</span>
          </div>
          <div className="archive-heading">
            <h2><RevealWords text="Places beautiful enough to invite you in — and old enough to remember why you should leave." /></h2>
            <p data-fade>Each realm changes the rhythm of the journey: blossom-lit sanctuaries, vertical water paths and scorched ruins of forgotten iron.</p>
          </div>
          <div className="realm-gallery">
            <article className="realm-feature" data-parallax="4">
              <div className="realm-image">
                <Image src={realms[0].image} alt={realms[0].title} fill className="object-cover" sizes="(max-width: 760px) 92vw, 62vw" />
                <span className="media-shade" />
              </div>
              <div className="realm-meta"><span>01</span><b>{realms[0].title}</b><small>{realms[0].kanji} · {realms[0].label}</small></div>
            </article>
            <div className="realm-stack">
              {realms.slice(1).map((realm, index) => (
                <article key={realm.id} className="realm-secondary" data-parallax={index === 0 ? "6" : "5"}>
                  <div className="realm-image">
                    <Image src={realm.image} alt={realm.title} fill className="object-cover" sizes="(max-width: 760px) 92vw, 30vw" />
                    <span className="media-shade" />
                  </div>
                  <div className="realm-meta"><span>0{index + 2}</span><b>{realm.title}</b><small>{realm.kanji} · {realm.label}</small></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="akari" data-section className="chapter character-spread akari-spread">
          <div className="character-ghost" aria-hidden="true">朱莉</div>
          <div className="character-figure" data-parallax="7">
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill className="object-contain object-bottom" sizes="(max-width: 760px) 78vw, 34vw" />
          </div>
          <div className="character-copy">
            <div className="chapter-index compact"><span>03 — PROTAGONIST</span><i /><span>朱莉</span></div>
            <p className="character-eyebrow" data-fade>AKARI NO REI</p>
            <h2><RevealWords text="A blade carried between duty and awakening." /></h2>
            <p data-fade>
              Akari is the emotional center of Tsukihara. Her silhouette is disciplined; what awakens inside her is not. The closer she comes to the eclipse, the more the world begins to answer back.
            </p>
            <div className="state-line" data-fade>
              <span><small>01</small> Standard</span><i /><span><small>02</small> Awakening</span><i /><span><small>03</small> No Rei</span>
            </div>
          </div>
        </section>

        <section id="bonds" data-section className="chapter character-spread haku-spread-section">
          <div className="character-ghost ghost-right" aria-hidden="true">白</div>
          <div className="character-copy haku-copy">
            <div className="chapter-index compact"><span>04 — BONDS</span><i /><span>守霊</span></div>
            <p className="character-eyebrow" data-fade>HAKU · GUARDIAN SPIRIT</p>
            <h2><RevealWords text="Some spirits do not haunt a path. They choose to walk it." /></h2>
            <p data-fade>
              Haku is guardian, omen and witness — a quiet presence beside Akari as the moon changes. In a world where memories can become dangerous, loyalty is its own kind of power.
            </p>
          </div>
          <div className="haku-media" data-parallax="5">
            <Image src="/images/haku-eclipse.webp" alt="Haku beneath the eclipse" fill className="object-cover" sizes="(max-width: 760px) 92vw, 54vw" />
            <span className="media-shade" />
            <div className="haku-caption"><b>Haku</b><small>白 · The quiet before the world changes</small></div>
          </div>
        </section>

        <section id="lore" data-section className="chapter lore-section">
          <div className="chapter-index"><span>05 — WORLD LORE</span><i /><span>記録</span></div>
          <div className="lore-intro">
            <h2><RevealWords text="Five threads bind the world beneath the moon." /></h2>
            <p data-fade>These are not menu items. They are the ideas every realm, character and conflict keeps returning to.</p>
          </div>
          <div className="lore-grid">
            {loreChapters.map((chapter) => (
              <article key={chapter.index} data-fade>
                <span>{chapter.index}</span>
                <div><h3>{chapter.title} <small>{chapter.kanji}</small></h3><p>{chapter.copy}</p></div>
                <b>{chapter.time}</b>
              </article>
            ))}
          </div>
        </section>

        <section id="eclipse" data-section className="afterlight-section">
          <div className="afterlight-vertical" aria-hidden="true">AFTERLIGHT</div>
          <div className="afterlight-copy">
            <div className="chapter-index compact"><span>06 — AFTERLIGHT</span><i /><span>月蝕</span></div>
            <h2><RevealWords text="When the moon turns red, every vow is tested." /></h2>
            <p data-fade>
              Tsukihara is in development. New characters, gameplay, music and the first trailer will arrive here as the world takes shape.
            </p>
            <div className="closing-actions" data-fade>
              <span className="coming-action"><b>Wishlist on Steam</b><small>Coming soon</small></span>
              <a href="#top"><span>Return to the beginning</span><Arrow /></a>
            </div>
          </div>
          <div className="afterlight-akari" data-parallax="4">
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill className="object-contain object-bottom" sizes="(max-width: 760px) 76vw, 34vw" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-lead">
          <span className="brand-moon" />
          <p>A moonlit action-adventure about memory, duty and the things that awaken when sacred places stop being silent.</p>
        </div>
        <div className="footer-grid">
          <div><small>Explore</small><a href="#manifesto">Story</a><a href="#realms">World</a><a href="#akari">Akari</a></div>
          <div><small>Journey</small><a href="#bonds">Bonds</a><a href="#lore">Lore</a><a href="#eclipse">Afterlight</a></div>
          <div><small>Status</small><span>In development</span><span>Trailer · coming soon</span><span>Steam · coming soon</span></div>
        </div>
        <div className="footer-bottom"><span>© 2026 TSUKIHARA</span><span>月の原 — ECLIPSE OF THE NINE REALMS</span></div>
      </footer>
    </div>
  );
}
