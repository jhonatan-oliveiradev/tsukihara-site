import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./editorial-overrides.css";
import "./kage-port.css";

export const metadata: Metadata = {
  title: "Tsukihara — Beneath the Moon",
  description:
    "Enter Tsukihara, a cinematic action-adventure shaped by moonlight, ancient shrines and the path of Akari.",
};

export const viewport: Viewport = {
  themeColor: "#040609",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
