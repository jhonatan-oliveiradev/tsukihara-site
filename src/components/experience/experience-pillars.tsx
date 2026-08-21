import Image from "next/image";
import { JpRevealText } from "@/components/experience/jp-reveal-text";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type ExperiencePillarsProps = {
  copy: Copy;
  locale: Locale;
};

const pillarAssets = [
  "/secret-pathways-assets/foreground/png/temple-wall.webp",
  "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  "/secret-pathways-assets/foreground/png/garden-bush.webp",
  "/secret-pathways-assets/foreground/png/maple-leaves.webp",
  "/secret-pathways-assets/foreground/png/tall-grass.webp",
] as const;

const pillars = {
  pt: [
    [
      "01",
      "Kintsugi Lunar",
      "月継",
      "Restaure temporariamente plataformas, pontes, portas e mecanismos que a Lua-Mãe apagou — escolhendo o que trazer de volta e quando sustentar essa memória.",
    ],
    [
      "02",
      "Overworld isométrico",
      "界図",
      "Atravesse um diorama vivo dos reinos, descubra rotas bloqueadas, templos, vilas e entradas esquecidas que mudam conforme o eclipse avança.",
    ],
    [
      "03",
      "Metroidvania 2.5D",
      "巡路",
      "Entre em fases laterais construídas para exploração, plataforma, puzzles, backtracking e progressão por habilidades sem abandonar a escala cinematográfica da arte.",
    ],
    [
      "04",
      "Combate e bosses",
      "剣舞",
      "A katana de Akari transforma mobilidade, esquiva e precisão em uma dança rápida de lâmina, pétalas e luz lunar contra encontros grandes e memoráveis.",
    ],
    [
      "05",
      "Haku & Mochi",
      "守護",
      "Haku amplia travessia e poder lunar. Mochi percebe segredos, paredes falsas e memórias escondidas — dois companheiros que também mudam a forma de explorar.",
    ],
  ],
  en: [
    [
      "01",
      "Lunar Kintsugi",
      "月継",
      "Temporarily restore platforms, bridges, doors and mechanisms erased by the Mother Moon — choosing what to bring back and when that memory is worth sustaining.",
    ],
    [
      "02",
      "Isometric overworld",
      "界図",
      "Cross a living diorama of the realms, uncover blocked routes, shrines, villages and forgotten entrances that change as the eclipse advances.",
    ],
    [
      "03",
      "2.5D Metroidvania",
      "巡路",
      "Enter side-scrolling stages built around exploration, platforming, puzzles, backtracking and ability progression without losing the cinematic scale of the art.",
    ],
    [
      "04",
      "Combat and bosses",
      "剣舞",
      "Akari's katana turns mobility, evasion and precision into a fast dance of blade, petals and moonlight against large, memorable encounters.",
    ],
    [
      "05",
      "Haku & Mochi",
      "守護",
      "Haku expands traversal and lunar power. Mochi senses secrets, false walls and hidden memories — companions that change the way the world is explored.",
    ],
  ],
} as const;

export function ExperiencePillars({ copy, locale }: ExperiencePillarsProps) {
  return (
    <section id="lore" data-section className="ix-pillars">
      <div className="ix-pillars-head">
        <div className="ix-section-label">
          <span>{copy.lore.label}</span>
          <i />
          <span>遊戯</span>
        </div>
        <h2>
          <JpRevealText jp={copy.lore.titleJp} text={copy.lore.title} locale={locale} />
        </h2>
        <p data-reveal>{copy.lore.intro}</p>
      </div>

      <div className="ix-pillars-list">
        {pillars[locale].map(([index, title, kanji, body], itemIndex) => (
          <article key={title} className="ix-pillar" data-pillar data-reveal>
            <div className="ix-pillar-index">
              <span>{index}</span>
              <i />
            </div>
            <div className="ix-pillar-title">
              <small lang="ja">{kanji}</small>
              <h3>{title}</h3>
            </div>
            <p>{body}</p>
            <Image
              src={pillarAssets[itemIndex]}
              alt=""
              width={420}
              height={420}
              className="ix-pillar-asset"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
