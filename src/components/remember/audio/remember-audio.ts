export type RememberAudioTrack = {
  src: string;
  volume: number;
  loop: boolean;
};

export const rememberAudioTracks = {
  menu: {
    src: "/remember-experience/sound-effects/trilha-sonora-menu-do-jogo.mp3",
    volume: 0.2,
    loop: true,
  },
  phase: {
    src: "/remember-experience/sound-effects/trilha-sonora-phase.mp3",
    volume: 0.16,
    loop: true,
  },
  kintsugi: {
    src: "/remember-experience/sound-effects/kintsugi-sound-effect.mp3",
    volume: 0.28,
    loop: false,
  },
  harp: {
    src: "/remember-experience/sound-effects/harp-sound-effect.mp3",
    volume: 0.42,
    loop: false,
  },
} as const satisfies Record<string, RememberAudioTrack>;

export const RESTORATION_DUCK_RATIO = 0.12;

export function getRestorationDuckVolume(baseVolume: number) {
  return Math.min(1, Math.max(0, baseVolume * RESTORATION_DUCK_RATIO));
}

export function configureAudioElement(audio: HTMLAudioElement, track: RememberAudioTrack) {
  audio.src = track.src;
  audio.loop = track.loop;
  audio.preload = "metadata";
  audio.volume = track.volume;
}

export function fadeAudio(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  durationMs: number,
  signal?: AbortSignal,
) {
  return new Promise<void>((resolve) => {
    const startedAt = performance.now();
    const safeDuration = Math.max(1, durationMs);
    let frame = 0;

    audio.volume = Math.min(1, Math.max(0, from));

    const finish = () => {
      if (frame) cancelAnimationFrame(frame);
      resolve();
    };

    const tick = (now: number) => {
      if (signal?.aborted) {
        finish();
        return;
      }

      const progress = Math.min(1, Math.max(0, (now - startedAt) / safeDuration));
      const eased = progress * progress * (3 - 2 * progress);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * eased));

      if (progress >= 1) {
        finish();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    if (signal) {
      signal.addEventListener("abort", finish, { once: true });
    }

    frame = requestAnimationFrame(tick);
  });
}
