"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { chapterNav, realms } from "@/content/game";

const WorldCanvas = dynamic(
  () => import("@/components/experience/world-canvas").then((mod) => mod.WorldCanvas),
  { ssr: false },
);

export function ExperienceShell() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!root.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduceMotion ? null : new Lenis({ lerp: 0.075, smoothWheel: true });
    let raf = 0;

    const tick = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(tick);
    };

    if (lenis) raf = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: reduceMotion ? 0 : 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.01 : 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((section) => {
        const media = section.querySelector<HTMLElement>("[data-scene-media]");
        if (!media || reduceMotion) return;
        gsap.fromTo(
          media,
          { yPercent: 8, scale: 1.07 },
          {
            yPercent: -6,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }, root);

    return () => {
      ctx.revert();
      lenis?.destroy();
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={root} className="relative isolate overflow-clip bg-ink text-bone">
      <WorldCanvas />
      <div className="film-grain pointer-events-none fixed inset-0 z-40" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <Link href="#top" className="group inline-flex items-center gap-3" aria-label="Tsukihara home">
          <span className="font-display text-[0.76rem] tracking-[0.34em] text-bone/90">TSUKIHARA</span>
          <span className="h-px w-8 bg-vermilion transition-all duration-500 group-hover:w-12" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {chapterNav.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="nav-link md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {menuOpen && (
        <div id="mobile-nav" className="fixed inset-0 z-40 grid place-items-center bg-ink/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
            {chapterNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="font-display text-4xl tracking-tight">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <main className="relative z-10">
        <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pb-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(151,34,34,0.2),transparent_32%),linear-gradient(to_bottom,transparent_30%,#08070b_94%)]" />
          <div className="absolute inset-y-0 right-[-18%] w-[95%] opacity-55 md:right-[-5%] md:w-[68%]">
            <Image src="/images/akari-no-rei.webp" alt="Akari no Rei" fill priority className="object-contain object-bottom" sizes="(max-width: 768px) 100vw, 70vw" />
          </div>
          <div className="relative grid w-full gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p data-reveal className="mb-5 text-[0.67rem] uppercase tracking-[0.46em] text-bone/45">月の原 — Beneath the moon</p>
              <h1 data-reveal className="font-display max-w-[8ch] text-[clamp(4.8rem,13vw,12rem)] leading-[0.75] tracking-[-0.065em] text-bone">
                Tsuki<br />hara
              </h1>
            </div>
            <div data-reveal className="max-w-sm justify-self-end pb-1 md:pb-4">
              <p className="text-sm leading-7 text-bone/62 md:text-base">
                A cinematic action-adventure through sacred realms, forgotten vows and a moon that should never have turned red.
              </p>
              <a href="#akari" className="mt-8 inline-flex items-center gap-4 text-[0.68rem] uppercase tracking-[0.36em] text-bone/80">
                Enter the moonlit realm <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section id="akari" data-scene className="section-shell min-h-[120svh] items-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#08070b_2%,transparent_35%,#08070b_98%)]" />
          <div data-scene-media className="absolute right-[-10%] top-[8%] h-[82%] w-[72%] opacity-65 md:right-[3%] md:w-[47%]">
            <Image src="/images/akari-no-rei.webp" alt="Akari, the protagonist of Tsukihara" fill className="object-contain object-center" sizes="(max-width: 768px) 80vw, 50vw" />
          </div>
          <div className="section-grid relative">
            <p className="chapter-index">01 / 主人公</p>
            <div className="max-w-2xl" data-reveal>
              <p className="chapter-kicker">Akari — 朱莉</p>
              <h2 className="chapter-title">The blade that walks between light and eclipse.</h2>
              <p className="chapter-copy max-w-xl">
                Akari carries more than a sword. Her journey crosses memory, duty and the awakening of a power that changes the shape of every realm she touches.
              </p>
            </div>
          </div>
        </section>

        <section id="realms" className="relative py-28 md:py-44">
          <div className="section-grid mb-20 md:mb-32">
            <p className="chapter-index">02—04 / 世界</p>
            <div data-reveal>
              <p className="chapter-kicker">The realms</p>
              <h2 className="chapter-title max-w-4xl">Every place remembers a different version of the moon.</h2>
            </div>
          </div>

          <div className="space-y-32 md:space-y-48">
            {realms.map((realm, index) => (
              <article key={realm.id} id={realm.id} data-scene className="section-shell min-h-[96svh] items-end pb-16 md:pb-24">
                <div data-scene-media className="absolute inset-[8%_0_0_0] overflow-hidden md:inset-[5%_5%_0_22%]">
                  <Image src={realm.image} alt={`${realm.title}, a realm in Tsukihara`} fill className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#08070b_0%,transparent_45%,transparent_75%,#08070b_100%),linear-gradient(to_top,#08070b_2%,transparent_50%)]" />
                </div>
                <div className="section-grid relative">
                  <p className="chapter-index">{realm.index} / {realm.kanji}</p>
                  <div data-reveal className={index % 2 === 0 ? "max-w-xl" : "max-w-xl md:ml-auto"}>
                    <p className="chapter-kicker">{realm.subtitle}</p>
                    <h3 className="font-display text-[clamp(4rem,8vw,8.5rem)] leading-[0.78] tracking-[-0.055em]">{realm.title}</h3>
                    <p className="chapter-copy mt-6 max-w-lg">{realm.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="bonds" data-scene className="section-shell min-h-[115svh] items-center">
          <div data-scene-media className="absolute inset-y-[8%] right-0 w-full md:right-[5%] md:w-[62%]">
            <Image src="/images/haku-eclipse.webp" alt="Haku beneath the eclipse" fill className="object-cover md:object-contain" sizes="(max-width: 768px) 100vw, 65vw" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#08070b_0%,transparent_58%),linear-gradient(to_top,#08070b_0%,transparent_40%,#08070b_100%)]" />
          </div>
          <div className="section-grid relative">
            <p className="chapter-index">05 / 絆</p>
            <div data-reveal className="max-w-xl">
              <p className="chapter-kicker">Bonds</p>
              <h2 className="chapter-title">Some spirits choose who they will follow.</h2>
              <p className="chapter-copy max-w-md">Haku is one of the presences bound to Akari&apos;s path — guardian, omen and witness to the coming eclipse.</p>
            </div>
          </div>
        </section>

        <section id="eclipse" className="relative flex min-h-[110svh] items-center overflow-hidden px-5 py-28 md:px-10">
          <div className="absolute left-1/2 top-1/2 h-[58vw] max-h-[760px] w-[58vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7d1518]/70 shadow-[0_0_140px_rgba(139,31,31,0.22)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#08070b_64%)]" />
          <div className="relative mx-auto w-full max-w-[1500px] text-center" data-reveal>
            <p className="chapter-kicker">月蝕 — The eclipse</p>
            <h2 className="font-display mx-auto max-w-[10ch] text-[clamp(4.6rem,12vw,12rem)] leading-[0.78] tracking-[-0.07em]">When the moon turns, every vow is tested.</h2>
          </div>
        </section>

        <footer className="relative border-t border-bone/10 px-5 py-12 md:px-10 md:py-16">
          <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Image src="/images/tsukihara-logo.webp" alt="Tsukihara" width={280} height={158} className="h-auto w-40 object-contain object-left brightness-0 invert md:w-52" />
              <p className="mt-5 max-w-md text-sm leading-6 text-bone/45">An original game project currently in development. Follow the journey as the world of Tsukihara takes shape.</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-[0.66rem] uppercase tracking-[0.32em] text-bone/58">
              <span>Steam — coming soon</span>
              <span>Trailer — coming soon</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
