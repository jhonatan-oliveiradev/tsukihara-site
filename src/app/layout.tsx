import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./immersive-v2.css";
import "./hero-parallax.css";
import "./immersive-polish.css";

export const metadata: Metadata = {
  title: "Tsukihara — Sob a Lua / Beneath the Moon",
  description:
    "Atravesse o universo de Tsukihara com Akari em uma experiência cinematográfica entre santuários, espíritos e um eclipse que transforma tudo o que toca.",
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
