"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  configureAudioElement,
  fadeAudio,
  rememberAudioTracks,
  type RememberAudioTrack,
} from "@/components/remember/audio/remember-audio";

type TrackKey = "menu" | "phase" | "harp";

type BaseTracks = Partial<Record<TrackKey, HTMLAudioElement>>;

export type RememberAudioController = {
  unlock: () => Promise<void>;
  enterRestore: () => Promise<void>;
  playKintsugi: () => void;
  playReveal: () => void;
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
  const transientsRef = useRef<Set<HTMLAudioElement>>(new Set());
  const mutedRef = useRef(false);
  const unlockedRef = useRef(false);
  const fadeAbortRef = useRef<AbortController | null>(null);

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
      unlock: async () => {
        if (unlockedRef.current) return;

        const menu = getTrack("menu");
        menu.currentTime = 0;
        menu.volume = rememberAudioTracks.menu.volume;
        menu.muted = mutedRef.current;
        await menu.play();
        unlockedRef.current = true;
      },
      enterRestore: async () => {
        const menu = getTrack("menu");
        const phase = getTrack("phase");

        abortFades();
        const controller = new AbortController();
        fadeAbortRef.current = controller;

        phase.currentTime = 0;
        phase.volume = 0;
        phase.muted = mutedRef.current;
        if (phase.paused) {
          await phase.play().catch(() => undefined);
        }

        await Promise.all([
          fadeAudio(menu, menu.volume, 0, 1400, controller.signal),
          fadeAudio(phase, 0, rememberAudioTracks.phase.volume, 1800, controller.signal),
        ]);

        if (!controller.signal.aborted) {
          menu.pause();
        }
      },
      playKintsugi: () => {
        const active = transientsRef.current;
        if (active.size >= 3) return;

        const audio = createAudio(rememberAudioTracks.kintsugi);
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
      },
      playReveal: () => {
        const harp = getTrack("harp");
        harp.pause();
        harp.currentTime = 0;
        harp.volume = rememberAudioTracks.harp.volume;
        harp.muted = mutedRef.current;
        void harp.play().catch(() => undefined);
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
    [abortFades, getTrack, stopAll],
  );
}
