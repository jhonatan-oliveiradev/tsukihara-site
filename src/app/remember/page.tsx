import type { Metadata } from "next";
import { RememberExperience } from "@/components/remember/remember-experience";
import "./remember.css";
import "./remember-refinement.css";
import "./remember-game.css";
import "./remember-puzzle.css";
import "./remember-restoration.css";

export const metadata: Metadata = {
  title: "REMEMBER — Tsukihara",
  description: "Restore a memory before the Eclipse erases it.",
};

export default function RememberPage() {
  return <RememberExperience />;
}
