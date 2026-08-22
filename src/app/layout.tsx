import type { Metadata, Viewport } from "next";
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
      <body>{children}</body>
    </html>
  );
}
