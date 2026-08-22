"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type CharacterSpotlightProps = {
  copy: Copy;
  locale: Locale;
};

const narrative = {
  pt: {
    eyebrow: "A GUARDIÃ DO KINTSUGI LUNAR",
    title: "Se até a Lua pode esquecer, alguém precisa lembrar por ela.",
    titleJp: "月さえ忘れるなら、誰かがその代わりに覚えていなければならない。",
    lead: [
      "Akari atravessa os Nove Reinos carregando mais do que uma espada.",
      "Cada lugar que desaparece deixa nela uma marca. Cada memória perdida se torna uma cicatriz. E enquanto o Eclipse Carmesim apaga nomes, caminhos e histórias inteiras, ela escolhe fazer o oposto: lembrar, restaurar e seguir em frente com aquilo que foi quebrado.",
    ],
    thesis: [
      "Seu poder não nasce da ausência de feridas.",
      "Nasce da capacidade de carregá-las.",
    ],
    identity: "Espadachim • Guardiã Lunar • Portadora do Kintsugi",
    editorial:
      "Entre o mundo que existiu e aquele que está sendo esquecido, Akari permanece como uma das últimas ligações entre os dois.",
    lines: [
      "Sua katana responde à energia lunar.",
      "Sua máscara desperta aquilo que estava adormecido.",
      "E suas cicatrizes revelam um poder que não busca esconder o dano, mas transformá-lo.",
    ],
    quote:
      "Eu não preciso que o mundo volte a ser como era. Preciso que ele se lembre do que ainda pode ser.",
    detailLabel: "ANATOMIA DE UMA MEMÓRIA",
    details: [
      {
        label: "OLHAR",
        title: "Memórias deixam vestígios.",
        body: "Akari consegue perceber fragmentos que já desapareceram para todos os outros.",
        image: "/akari-details/detail_01.png",
        jp: "眼差し",
      },
      {
        label: "MÁSCARA KITSUNE",
        title: "O rosto entre duas existências.",
        body: "Ao vestir a máscara, Akari rompe parcialmente a fronteira entre memória, matéria e energia lunar.",
        image: "/akari-details/detail_02.png",
        jp: "狐面",
      },
      {
        label: "KATANA",
        title: "Uma lâmina feita para cortar aquilo que não deveria existir.",
        body: "Sua espada canaliza o Kintsugi Lunar e responde às fissuras deixadas pelo Eclipse.",
        image: "/akari-details/detail_03.png",
        jp: "刀",
      },
      {
        label: "VESTES",
        title: "História transformada em armadura.",
        body: "Cada camada combina tradição, combate e elementos dos antigos guardiões lunares.",
        image: "/akari-details/detail_04.png",
        jp: "装束",
      },
      {
        label: "KINTSUGI LUNAR",
        title: "Não esconda a ruptura. Transforme-a.",
        body: "As fissuras que percorrem seu corpo e equipamento não representam corrupção: são a manifestação visível de algo quebrado que se recusou a desaparecer.",
        image: "/akari-details/detail_05.png",
        jp: "月継",
      },
    ],
    closingA: "Ela não foi escolhida para salvar um mundo perfeito.",
    closingB: "Foi escolhida para salvar um mundo quebrado.",
  },
  en: {
    eyebrow: "GUARDIAN OF LUNAR KINTSUGI",
    title: "If even the Moon can forget, someone has to remember for her.",
    titleJp: "月さえ忘れるなら、誰かがその代わりに覚えていなければならない。",
    lead: [
      "Akari crosses the Nine Realms carrying more than a sword.",
      "Every place that disappears leaves a mark on her. Every lost memory becomes a scar. And while the Crimson Eclipse erases names, paths and entire histories, she chooses the opposite: to remember, restore and move forward with what was broken.",
    ],
    thesis: [
      "Her power is not born from the absence of wounds.",
      "It is born from carrying them.",
    ],
    identity: "Swordswoman • Lunar Guardian • Bearer of Kintsugi",
    editorial:
      "Between the world that existed and the one being forgotten, Akari remains one of the last links between them.",
    lines: [
      "Her katana answers to lunar energy.",
      "Her mask awakens what had fallen dormant.",
      "And her scars reveal a power that does not hide damage, but transforms it.",
    ],
    quote:
      "I don't need the world to return to what it was. I need it to remember what it can still become.",
    detailLabel: "ANATOMY OF A MEMORY",
    details: [
      {
        label: "GAZE",
        title: "Memories leave traces.",
        body: "Akari can perceive fragments that have already disappeared for everyone else.",
        image: "/akari-details/detail_01.png",
        jp: "眼差し",
      },
      {
        label: "KITSUNE MASK",
        title: "The face between two existences.",
        body: "When she wears the mask, Akari partially breaks the boundary between memory, matter and lunar energy.",
        image: "/akari-details/detail_02.png",
        jp: "狐面",
      },
      {
        label: "KATANA",
        title: "A blade made to cut what should not exist.",
        body: "Her sword channels Lunar Kintsugi and responds to the fractures left by the Eclipse.",
        image: "/akari-details/detail_03.png",
        jp: "刀",
      },
      {
        label: "GARMENTS",
        title: "History transformed into armor.",
        body: "Every layer combines tradition, combat and elements inherited from the ancient lunar guardians.",
        image: "/akari-details/detail_04.png",
        jp: "装束",
      },
      {
        label: "LUNAR KINTSUGI",
        title: "Do not hide the fracture. Transform it.",
        body: "The fissures crossing her body and equipment are not corruption: they are the visible manifestation of something broken that refused to disappear.",
        image: "/akari-details/detail_05.png",
        jp: "月継",
      },
    ],
    closingA: "She was not chosen to save a perfect world.",
    closingB: "She was chosen to save a broken one.",
  },
} as const;

export function CharacterSpotlight({ locale }: CharacterSpotlightProps) {
  const rootRef = useRef<HTMLElement>(null);
  const beat = narrative[locale];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images = gsap.utils.toArray<HTMLElement>("[data-akari-detail-image]", root);
    const items = gsap.utils.toArray<HTMLElement>("[data-akari-detail-item]", root);
    const progress = root.querySelector<HTMLElement>("[data-akari-detail-progress]");
    const introVisual = root.querySelector<HTMLElement>("[data-akari-intro-visual]");
    const detailStage = root.querySelector<HTMLElement>("[data-akari-details-stage]");

    const setActive = (activeIndex: number) => {
      images.forEach((image, index) => image.classList.toggle("is-active", index === activeIndex));
      items.forEach((item, index) => item.classList.toggle("is-active", index === activeIndex));
    };

    setActive(0);

    if (reduced) return;

    const ctx = gsap.context(() => {
      if (introVisual) {
        gsap.fromTo(
          introVisual,
          { yPercent: 5, scale: 1.04 },
          {
            yPercent: -4,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "38% top",
              scrub: 1.1,
            },
          },
        );
      }

      if (detailStage) {
        ScrollTrigger.create({
          trigger: detailStage,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: ({ progress: value }) => {
            const next = Math.min(images.length - 1, Math.floor(value * images.length));
            setActive(next);
            if (progress) gsap.set(progress, { scaleX: Math.max(0.02, value) });
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-akari-reveal]", root).forEach((element) => {
        gsap.fromTo(
          element,
          { y: 30, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section ref={rootRef} id="akari" data-section className="akari-chapter">
      <div className="akari-chapter__kanji" aria-hidden="true">
        朱莉
      </div>

      <div className="akari-intro">
        <div className="akari-intro__copy">
          <p className="akari-overline" data-akari-reveal>
            <span>04</span>
            {beat.eyebrow}
          </p>
          <span className="akari-intro__jp" lang="ja" data-akari-reveal>
            {beat.titleJp}
          </span>
          <h2 data-akari-reveal>{beat.title}</h2>
          <div className="akari-intro__body" data-akari-reveal>
            {beat.lead.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="akari-intro__thesis" data-akari-reveal>
            <span>{beat.thesis[0]}</span>
            <strong>{beat.thesis[1]}</strong>
          </div>
        </div>

        <div className="akari-intro__visual" data-akari-intro-visual>
          <div className="akari-intro__halo" aria-hidden="true" />
          <Image
            src="/akari-details/akari_focus.png"
            alt="Akari no Rei"
            fill
            sizes="(max-width: 760px) 100vw, 56vw"
            className="akari-intro__focus"
          />
          <Image
            src="/akari-details/akari_full_body.png"
            alt=""
            fill
            sizes="(max-width: 760px) 90vw, 44vw"
            className="akari-intro__figure"
          />
          <span className="akari-intro__vertical" lang="ja">
            月継ノ守護者
          </span>
        </div>
      </div>

      <div className="akari-editorial">
        <div className="akari-editorial__identity" data-akari-reveal>
          <span>AKARI NO REI</span>
          <strong>{beat.identity}</strong>
        </div>
        <div className="akari-editorial__copy" data-akari-reveal>
          <p>{beat.editorial}</p>
          <ul>
            {beat.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <blockquote data-akari-reveal>“{beat.quote}”</blockquote>
        <div className="akari-editorial__relic" aria-hidden="true">
          <Image src="/akari-details/detail_06.png" alt="" fill sizes="28vw" />
        </div>
      </div>

      <div className="akari-details" data-akari-details-stage>
        <div className="akari-details__sticky">
          <div className="akari-details__visuals" aria-hidden="true">
            <div className="akari-details__frame">
              {beat.details.map((detail, index) => (
                <div
                  key={detail.image}
                  className={`akari-details__image${index === 0 ? " is-active" : ""}`}
                  data-akari-detail-image
                >
                  <Image src={detail.image} alt="" fill sizes="(max-width: 760px) 100vw, 55vw" />
                </div>
              ))}
              <div className="akari-details__scan" />
            </div>
            <div className="akari-details__counter">
              <span>01</span>
              <i />
              <span>05</span>
            </div>
          </div>

          <div className="akari-details__content">
            <p className="akari-overline">
              <span>朱莉</span>
              {beat.detailLabel}
            </p>
            <div className="akari-details__items">
              {beat.details.map((detail, index) => (
                <article
                  key={detail.label}
                  className={`akari-detail${index === 0 ? " is-active" : ""}`}
                  data-akari-detail-item
                >
                  <div className="akari-detail__index">
                    <span>0{index + 1}</span>
                    <em lang="ja">{detail.jp}</em>
                  </div>
                  <div>
                    <small>{detail.label}</small>
                    <h3>{detail.title}</h3>
                    <p>{detail.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="akari-details__progress" aria-hidden="true">
              <i data-akari-detail-progress />
            </div>
          </div>
        </div>
      </div>

      <div className="akari-closing">
        <div className="akari-closing__portrait" aria-hidden="true">
          <Image src="/akari-details/akari_exaltada.png" alt="" fill sizes="55vw" />
        </div>
        <div className="akari-closing__copy">
          <span lang="ja" data-akari-reveal>
            傷は記憶になる
          </span>
          <p data-akari-reveal>{beat.closingA}</p>
          <strong data-akari-reveal>{beat.closingB}</strong>
        </div>
      </div>
    </section>
  );
}
