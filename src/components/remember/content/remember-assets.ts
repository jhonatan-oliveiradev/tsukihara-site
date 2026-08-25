const imageBase = "/remember-experience/assets/images";
const videoBase = "/remember-experience/assets/videos";

export const rememberAssets = {
  menuBackground: `${imageBase}/remember-menu-background.png`,

  hanamoriRealm: "/reinos/01_hanamori.png",
  hanamoriBroken: "/assets_hq/templo-hanamori_2.png",
  hanamoriRestored: "/assets_hq/templo-hanamori.png",
  mizukyoBroken: `${imageBase}/remember-mizukyo-broken.png`,
  mizukyoRestored: `${imageBase}/remember-mizukyo-restored.png`,
  kuroganeBroken: `${imageBase}/remember-kurogane-broken.png`,
  kuroganeRestored: `${imageBase}/remember-kurogane-restored.png`,

  kintsugiCrackOverlay: `${imageBase}/mr01-kintsugi-crack-overlay.png`,
  memoryParticles: `${imageBase}/mr02-memory-particles.png`,
  memoryPulseRing: `${imageBase}/mr03-memory-pulse-ring.png`,
  restoredScarOverlay: `${imageBase}/mr06-restored-scar-overlay.png`,
  completionBurst: `${imageBase}/remember-completion-burst.png`,

  akariReveal: `${imageBase}/remember-akari-reveal.png`,
  epilogueEclipse: `${videoBase}/remember-epilogue-eclipse.mp4`,
  creditsLoop: `${videoBase}/remember-credits-loop.mp4`,
  mobileSakuraTransition: `${videoBase}/remember-mobile-sakura-transition.mp4`,

  sakuraBranch: "/secret-pathways-assets/foreground/png/sakura-branch.webp",
  shrineRuins: "/secret-pathways-assets/foreground/png/shrine-ruins.webp",
  stoneLantern: "/secret-pathways-assets/foreground/png/stone-lantern.webp",
  tallGrass: "/secret-pathways-assets/foreground/png/tall-grass.webp",
} as const;
