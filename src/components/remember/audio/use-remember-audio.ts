"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  configureAudioElement,
  fadeAudio,
  getRestorationDuckVolume,
  rememberAudioTracks,
  type RememberAudioTrack,
} from "@/components/remember/audio/remember-audio";

type TrackKey = "menu" | "phase" | "harp";
type BaseTracks = Partial<Record<TrackKey, HTMLAudioElement>>;

export type RememberAudioController = {
  unlockMenu: () => Promise<void>;
  startMemory: () => Promise<void>;
  duckMemoryForRestoration: () => Promise<void>;
  restoreMemoryLevel: () => Promise<void>;
  pauseGameplay: () => void;
  resumeGameplay: () => Promise<void>;
  playPieceComplete: () => void;
  playKintsugi: () => void;
  playRestored: () => void;
  enterAkariReveal: () => Promise<void>;
  enterCredits: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  stopAll: () => void;
};

const createAudio = (track: RememberAudioTrack) => {
  const audio = new Audio();
  configureAudioElement(audio, track);
  return audio;
};

export function useRememberAudio(): RememberAudioController {
  const tracksRef = useRef<BaseTracks>({});
  const kintsugiTemplateRef = useRef<HTMLAudioElement | null>(null);
  const transientsRef = useRef<Set<HTMLAudioElement>>(new Set());
  const mutedRef = useRef(false);
  const unlockedRef = useRef(false);
  const fadeAbortRef = useRef<AbortController | null>(null);
  const pausedPhaseVolumeRef = useRef<number>(rememberAudioTracks.phase.volume);

  const getTrack = useCallback((key: TrackKey) => {
    const existing = tracksRef.current[key];
    if (existing) return existing;

    const audio = createAudio(rememberAudioTracks[key]);
    audio.muted = mutedRef.current;
    tracksRef.current[key] = audio;
    return audio;
  }, []);

  const abortFades = useCallback(() => {
    fadeAbortRef.current?.abort();
    fadeAbortRef.current = null;
  }, []);

  const prepareEffects = useCallback(() => {
    const harp = getTrack("harp");
    harp.preload = "auto";
    harp.load();

    if (!kintsugiTemplateRef.current) {
      const template = createAudio(rememberAudioTracks.kintsugi);
      template.preload = "auto";
      template.load();
      kintsugiTemplateRef.current = template;
    }
  }, [getTrack]);

  const playKintsugiTransient = useCallback(() => {
    const active = transientsRef.current;
    if (active.size >= 3) return;

    const template = kintsugiTemplateRef.current ?? createAudio(rememberAudioTracks.kintsugi);
    const audio = template.cloneNode(true) as HTMLAudioElement;
    audio.volume = rememberAudioTracks.kintsugi.volume;
    audio.muted = mutedRef.current;
    active.add(audio);

    const cleanup = () => {
      active.delete(audio);
      audio.removeEventListener("ended", cleanup);
      audio.removeEventListener("error", cleanup);
    };

    audio.addEventListener("ended", cleanup);
    audio.addEventListener("error", cleanup);
    void audio.play().catch(cleanup);
  }, []);

  const playHarp = useCallback(() => {
    const harp = getTrack("harp");
    harp.pause();
    harp.currentTime = 0;
    harp.volume = rememberAudioTracks.harp.volume;
    harp.muted = mutedRef.current;
    void harp.play().catch(() => undefined);
  }, [getTrack]);

  const stopAll = useCallback(() => {
    abortFades();

    Object.values(tracksRef.current).forEach((audio) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    });
    tracksRef.current = {};

    const template = kintsugiTemplateRef.current;
    if (template) {
      template.pause();
      template.removeAttribute("src");
      template.load();
      kintsugiTemplateRef.current = null;
    }

    transientsRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    });
    transientsRef.current.clear();
    unlockedRef.current = false;
  }, [abortFades]);

  useEffect(() => stopAll, [stopAll]);

  return useMemo<RememberAudioController>(
    () => ({
      unlockMenu: async () => {
        if (unlockedRef.current) return;

        const menu = getTrack("menu");
        menu.currentTime = 0;
        menu.volume = rememberAudioTracks.menu.volume;
        menu.muted = mutedRef.current;
        await menu.play();
        unlockedRef.current = true;
      },
      startMemory: async () => {
        const menu = getTrack("menu");
        const phase = getTrack("phase");
        prepareEffects();

        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;

        phase.preload = "auto";
        phase.currentTime = 0;
        phase.volume = 0;
        phase.muted = mutedRef.current;
        if (phase.paused) await phase.play().catch(() => undefined);

        await Promise.all([
          fadeAudio(menu, menu.volume, 0, 1400, controller.signal),
          fadeAudio(phase, 0, rememberAudioTracks.phase.volume, 1800, controller.signal),
        ]);

        if (!controller.signal.aborted) menu.pause();
      },
      duckMemoryForRestoration: async () => {
        const phase = getTrack("phase");
        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;

        await fadeAudio(
          phase,
          phase.volume,
          getRestorationDuckVolume(rememberAudioTracks.phase.volume),
          700,
          controller.signal,
        );
      },
      restoreMemoryLevel: async () => {
        const phase = getTrack("phase");
        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;

        phase.muted = mutedRef.current;
        if (phase.paused) await phase.play().catch(() => undefined);
        await fadeAudio(
          phase,
          phase.volume,
          rememberAudioTracks.phase.volume,
          1600,
          controller.signal,
        );
      },
      pauseGameplay: () => {
        abortFades();
        const phase = tracksRef.current.phase;
        if (phase) {
          pausedPhaseVolumeRef.current = phase.volume;
          phase.pause();
        }
        transientsRef.current.forEach((audio) => audio.pause());
      },
      resumeGameplay: async () => {
        const phase = tracksRef.current.phase;
        if (!phase) return;
        phase.volume = pausedPhaseVolumeRef.current;
        phase.muted = mutedRef.current;
        if (phase.paused) await phase.play().catch(() => undefined);
      },
      playPieceComplete: playKintsugiTransient,
      playKintsugi: playKintsugiTransient,
      playRestored: playHarp,
      enterAkariReveal: async () => {
        const phase = getTrack("phase");
        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;
        playHarp();
        await fadeAudio(
          phase,
          phase.volume,
          rememberAudioTracks.phase.volume * 0.5,
          1500,
          controller.signal,
        );
      },
      enterCredits: async () => {
        const menu = getTrack("menu");
        const phase = getTrack("phase");

        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;

        menu.currentTime = 0;
        menu.volume = 0;
        menu.muted = mutedRef.current;
        if (menu.paused) await menu.play().catch(() => undefined);

        await Promise.all([
          fadeAudio(phase, phase.volume, 0, 1500, controller.signal),
          fadeAudio(menu, 0, rememberAudioTracks.menu.volume, 1800, controller.signal),
        ]);

        if (!controller.signal.aborted) phase.pause();
      },
      setMuted: (muted) => {
        mutedRef.current = muted;
        Object.values(tracksRef.current).forEach((audio) => {
          if (audio) audio.muted = muted;
        });
        transientsRef.current.forEach((audio) => {
          audio.muted = muted;
        });
      },
      stopAll,
    }),
    [abortFades, getTrack, playHarp, playKintsugiTransient, prepareEffects, stopAll],
  );
}
