import type { Metadata, Viewport } from "next";
import { AkariMosaicPin } from "@/components/experience/akari-mosaic-pin";
import "./globals.css";
import "./immersive-v2.css";
import "./hero-parallax.css";
import "./immersive-polish.css";
import "./cinematic-handoff.css";
import "./immersive-overhaul.css";
import "./hero-eclipse-sequence.css";
import "./hero-scene-refinement.css";
import "./entry-gateway.css";
import "./memory-bridge.css";
import "./akari-chapter.css";
import "./akari-chapter-refinement.css";
import "./akari-mosaic.css";
import "./akari-mosaic-mobile-fix.css";
import "./akari-mosaic-copy-balance.css";
import "./kintsugi-lunar-chapter.css";
import "./kintsugi-lunar-refinement.css";
import "./gameplay-chapter.css";
import "./gameplay-typography-fix.css";
import "./companions-chapter.css";
import "./bestiary-bosses.css";
import "./bestiary-inspector-refinement.css";
import "./bestiary-bosses-framing.css";
import "./mother-moon-chapter.css";
import "./mother-moon-text-motion.css";
import "./mother-moon-density-refinement.css";
import "./mother-moon-fragment-drag.css";
import "./lost-memories-chapter.css";
import "./lost-memories-crops-refinement.css";
import "./lost-memories-horizontal.css";
import "./final-journey-closing.css";
import "./final-journey-closing-refinement.css";
import "./final-journey-continuity.css";
import "./smooth-anchor-scroll.css";
import "./nine-realms-world.css";
import "./nine-realms-world-calibration.css";
import "./nine-realms-world-stability.css";
import "./nine-realms-inspector-motion.css";
import "./global-rhythm-refinement.css";
import "./viewport-rhythm-fixes.css";
import "./viewport-rhythm-reduced-motion.css";
import "./archive-header-width-refinement.css";
import "./shared-sound-toggle.css";

export const metadata: Metadata = {
  title: "Tsukihara — Eclipse of the Nine Realms",
  description:
    "Nove reinos presos sob um eclipse permanente. Conheça Akari no Rei e os guardiões de Tsukihara.",
};

export const viewport: Viewport = {
  themeColor: "#040609",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <AkariMosaicPin />
      </body>
    </html>
  );
}
