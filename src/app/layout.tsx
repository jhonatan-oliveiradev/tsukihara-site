import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./immersive-v2.css";
import "./hero-parallax.css";
import "./immersive-polish.css";

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