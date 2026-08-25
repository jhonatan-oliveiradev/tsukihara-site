"use client";

import { useSyncExternalStore } from "react";

let cachedWebglAvailable: boolean | undefined;

const subscribeStaticCapability = () => () => undefined;

const getWebglSnapshot = () => {
  if (cachedWebglAvailable !== undefined) return cachedWebglAvailable;

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cachedWebglAvailable = Boolean(context);

    if (context) {
      const loseContext = context.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    }
  } catch {
    cachedWebglAvailable = false;
  }

  return cachedWebglAvailable;
};

const getServerSnapshot = () => false;

export function useRememberWebglAvailability() {
  return useSyncExternalStore(subscribeStaticCapability, getWebglSnapshot, getServerSnapshot);
}
