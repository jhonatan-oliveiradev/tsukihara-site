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

  yumegakureBroken: `${imageBase}/yumegakure/remember-yumegakure-broken.png`,
  yumegakureRestored: `${imageBase}/yumegakure/remember-yumegakure-restored.png`,
  yumegakureFalseFragment01: `${imageBase}/yumegakure/remember-yumegakure-false-fragment-01.png`,
  yumegakureFalseFragment02: `${imageBase}/yumegakure/remember-yumegakure-false-fragment-02.png`,
  yumegakureDistortionOverlay: `${imageBase}/yumegakure/remember-yumegakure-distortion-overlay.png`,

  gekkaiStateA: `${imageBase}/gekkai/remember-gekkai-state-a.png`,
  gekkaiStateB: `${imageBase}/gekkai/remember-gekkai-state-b.png`,
  gekkaiRestored: `${imageBase}/gekkai/remember-gekkai-restored.png`,
  gekkaiLunarFocusOverlay: `${imageBase}/gekkai/remember-gekkai-lunar-focus-overlay.png`,

  memoryArchiveBackground: `${imageBase}/archive/remember-memory-archive-background.png`,
  memoryArchiveSigil: `${imageBase}/archive/remember-memory-archive-sigil.png`,
  akr001Signature: `${imageBase}/archive/remember-akr001-signature.png`,
  interludeUnknownMemory: `${imageBase}/interludes/remember-interlude-01-unknown-memory.png`,
  interludeMemoryNetwork: `${imageBase}/interludes/remember-interlude-02-memory-network.png`,

  signatureFoundBurst: `${imageBase}/fx/remember-signature-found-burst.png`,
  stageLockOverlay: `${imageBase}/fx/remember-stage-lock-overlay.png`,
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
