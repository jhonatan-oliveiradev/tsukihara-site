"use client";

import Image from "next/image";
import {
  canOpenArchiveRecord,
  deriveArchiveProgress,
  getAkariArchiveRecordState,
  getArchiveRecordState,
  type ArchiveRecordState,
} from "@/components/remember/archive/archive-policy";
import { memoryDefinitions } from "@/components/remember/content/memory-definitions";
import { rememberAssets } from "@/components/remember/content/remember-assets";
import type { RememberLocaleCopy } from "@/components/remember/content/remember-locales";
import type { RememberSaveV1 } from "@/components/remember/state/remember-save";
import type { MemoryId, RememberStageId } from "@/components/remember/state/remember-state";

type MemoryArchiveProps = {
  copy: RememberLocaleCopy["archive"];
  save: RememberSaveV1 | null;
  currentStage: RememberStageId;
  onClose: () => void;
  onReplayMemory: (memoryId: MemoryId) => void;
};

const memoryIds = memoryDefinitions.map((memory) => memory.id);

const completedMemoryIdsFromSave = (save: RememberSaveV1 | null): MemoryId[] => {
  if (!save) return [];
  return memoryIds.filter(
    (memoryId) => save.completedStages.includes(memoryId) || save.memories[memoryId]?.completed === true,
  );
};

const statusLabel = (state: ArchiveRecordState, copy: RememberLocaleCopy["archive"]) => {
  if (state === "RESTORED") return copy.restored;
  if (state === "UNSTABLE") return copy.unstable;
  if (state === "LOCKED") return copy.locked;
  return copy.unknown;
};

export function MemoryArchive({
  copy,
  save,
  currentStage,
  onClose,
  onReplayMemory,
}: MemoryArchiveProps) {
  const completedMemoryIds = completedMemoryIdsFromSave(save);
  const progress = deriveArchiveProgress(completedMemoryIds);
  const gameCompleted = save?.gameCompleted === true;
  const akariState = getAkariArchiveRecordState(save?.discoveredAkariRecord === true);

  return (
    <section className="remember-archive" role="dialog" aria-modal="true" aria-labelledby="remember-archive-title">
      <Image
        src={rememberAssets.memoryArchiveBackground}
        alt=""
        fill
        sizes="100vw"
        className="remember-archive__background"
        aria-hidden="true"
      />
      <div className="remember-archive__veil" aria-hidden="true" />

      <header className="remember-archive__header">
        <Image src={rememberAssets.memoryArchiveSigil} alt="" width={92} height={92} aria-hidden="true" />
        <div>
          <span>{copy.eyebrow}</span>
          <h2 id="remember-archive-title">{copy.title}</h2>
        </div>
        <p>
          <strong>{progress}%</strong>
          <span>{copy.recovered}</span>
        </p>
      </header>

      <div className="remember-archive__records" role="list">
        {memoryDefinitions.map((memory) => {
          const state = getArchiveRecordState({
            memoryId: memory.id,
            completedMemoryIds,
            currentStage,
          });
          const replayable = canOpenArchiveRecord(gameCompleted, state);

          return (
            <article key={memory.id} className="remember-archive-record" data-record-state={state} role="listitem">
              <div className="remember-archive-record__index">
                <span>{String(memory.index).padStart(2, "0")}</span>
                <i aria-hidden="true" />
              </div>
              <div className="remember-archive-record__name">
                <small>{memory.titleJp}</small>
                <strong>{memory.title}</strong>
              </div>
              <span className="remember-archive-record__status">{statusLabel(state, copy)}</span>
              {replayable ? (
                <button type="button" onClick={() => onReplayMemory(memory.id)}>{copy.replay}</button>
              ) : (
                <span className="remember-archive-record__mark" aria-hidden="true">月</span>
              )}
            </article>
          );
        })}

        <article className="remember-archive-record remember-archive-record--akari" data-record-state={akariState} role="listitem">
          <div className="remember-archive-record__index">
            <span>∞</span>
            <i aria-hidden="true" />
          </div>
          <div className="remember-archive-record__name">
            <small>{akariState === "LOCKED" ? "—" : "AKR-001"}</small>
            <strong>{akariState === "LOCKED" ? copy.akariUnknown : "AKARI"}</strong>
          </div>
          <span className="remember-archive-record__status">{statusLabel(akariState, copy)}</span>
          {akariState !== "LOCKED" ? (
            <Image src={rememberAssets.akr001Signature} alt="" width={88} height={40} className="remember-archive-record__signature" />
          ) : (
            <span className="remember-archive-record__mark" aria-hidden="true">?</span>
          )}
        </article>
      </div>

      <button type="button" className="remember-archive__close" onClick={onClose}>{copy.close}</button>
    </section>
  );
}
