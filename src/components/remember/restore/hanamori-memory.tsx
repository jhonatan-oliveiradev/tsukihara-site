"use client";

import Image from "next/image";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import { rememberCopy } from "@/components/remember/content/remember-copy";
import { hanamoriFragments } from "./restore-geometry";
import { MemoryFragment } from "./memory-fragment";
import { KintsugiSeams } from "./kintsugi-seams";

type HanamoriMemoryProps = {
  restoredFragmentIds: string[];
  reducedMotion: boolean;
  interactive: boolean;
  onRestore: (fragmentId: string) => void;
};

export function HanamoriMemory({
  restoredFragmentIds,
  reducedMotion,
  interactive,
  onRestore,
}: HanamoriMemoryProps) {
  const restored = new Set(restoredFragmentIds);
  const complete = restoredFragmentIds.length === hanamoriFragments.length;

  return (
    <div
      className={["remember-memory", complete && "is-complete", !interactive && "is-locked"]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label="Restore the fragmented memory of Hanamori"
    >
      <div className="remember-memory__atmosphere" aria-hidden="true">
        <Image
          src={rememberAssets.sakuraBranch}
          alt=""
          fill
          sizes="40vw"
          className="remember-memory__sakura"
        />
        <Image
          src={rememberAssets.shrineRuins}
          alt=""
          fill
          sizes="40vw"
          className="remember-memory__ruins"
        />
        <Image
          src={rememberAssets.stoneLantern}
          alt=""
          fill
          sizes="20vw"
          className="remember-memory__lantern"
        />
        <Image
          src={rememberAssets.tallGrass}
          alt=""
          fill
          sizes="45vw"
          className="remember-memory__grass"
        />
      </div>

      <div className="remember-memory__surface" data-remember-memory-surface>
        <Image
          src={rememberAssets.hanamoriBroken}
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 94vw, 76vw"
          className="remember-memory__ghost"
        />

        <div className="remember-memory__fragments">
          {hanamoriFragments.map((fragment) => (
            <MemoryFragment
              key={fragment.id}
              definition={fragment}
              source={rememberAssets.hanamoriBroken}
              restored={restored.has(fragment.id)}
              reducedMotion={reducedMotion}
              keyboardLabel={rememberCopy.restore.keyboardAction}
              onRestore={interactive ? onRestore : () => undefined}
            />
          ))}
        </div>

        <KintsugiSeams restoredFragmentIds={restoredFragmentIds} complete={complete} />

        <div className="remember-memory__restored" aria-hidden="true">
          <Image
            src={rememberAssets.hanamoriRestored}
            alt=""
            fill
            sizes="(max-width: 900px) 94vw, 76vw"
            className="remember-memory__restored-image"
          />
        </div>

        <span className="remember-memory__edge" aria-hidden="true" />
      </div>
    </div>
  );
}
