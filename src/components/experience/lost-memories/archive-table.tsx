"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { ArchiveRealmRecords } from "@/components/experience/lost-memories/archive-realm-records";
import {
  getArchiveImageSource,
  getArchiveImageStyle,
  unindexedSpiritPhotograph,
} from "@/components/experience/lost-memories/archive-image-crop";
import type {
  ArchiveRecord,
  LostMemoriesCopy,
} from "@/components/experience/lost-memories/lost-memories-types";

type ArchiveTableProps = {
  copy: LostMemoriesCopy;
  onOpen: (record: ArchiveRecord, trigger: HTMLButtonElement) => void;
};

type ArchiveItemProps = {
  record: ArchiveRecord;
  onOpen: ArchiveTableProps["onOpen"];
  className?: string;
  style?: CSSProperties;
};

function ArchiveItem({ record, onOpen, className = "", style }: ArchiveItemProps) {
  return (
    <button
      type="button"
      className={`ix-archive-item ${className}`}
      data-archive-item
      data-archive-kind={record.kind}
      style={style}
      onClick={(event) => onOpen(record, event.currentTarget)}
      aria-label={`${record.code}: ${record.title}`}
    >
      <span className="ix-archive-item__visual" aria-hidden="true">
        <Image
          src={getArchiveImageSource(record)}
          alt=""
          fill
          sizes="(max-width: 900px) 92vw, 34vw"
          style={getArchiveImageStyle(record, "surface")}
          className="ix-archive-item__image"
        />
        {record.kind === "photograph" && <i className="ix-archive-item__glass" />}
      </span>
      <span className="ix-archive-item__meta">
        <small>{record.code}</small>
        <b>{record.status}</b>
      </span>
      <span className="ix-archive-item__label">{record.title}</span>
    </button>
  );
}

function ArchiveGroupHeader({ index, title }: { index: string; title: string }) {
  return (
    <header className="ix-archive-group__header" data-archive-reveal>
      <span>{index}</span>
      <h3>{title}</h3>
      <i aria-hidden="true" />
    </header>
  );
}

export function ArchiveTable({ copy, onOpen }: ArchiveTableProps) {
  const letters = copy.records.filter((record) => record.group === "letters");
  const photographs = copy.records.filter((record) => record.group === "photographs");
  const relics = copy.records.filter((record) => record.group === "relics");
  const lunarRecords = copy.records.filter((record) => record.group === "lunar");

  return (
    <div className="ix-archive-table" data-archive-table>
      <section
        id="archive-letters"
        className="ix-archive-group ix-archive-group--letters"
        data-archive-panel
      >
        <ArchiveGroupHeader index="01" title={copy.groupHeadlines.letters} />
        <div className="ix-archive-letters__surface" data-archive-surface>
          {letters.map((record, index) => (
            <ArchiveItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              className={`ix-archive-letter ix-archive-letter--${index + 1}`}
              style={{ "--archive-tilt": `${[-1.5, 1.2, -0.7][index]}deg` } as CSSProperties}
            />
          ))}
        </div>
      </section>

      <section
        id="archive-photographs"
        className="ix-archive-group ix-archive-group--photographs"
        data-archive-panel
      >
        <ArchiveGroupHeader index="02" title={copy.groupHeadlines.photographs} />
        <div className="ix-archive-photos__surface" data-archive-surface>
          {photographs.map((record, index) => (
            <ArchiveItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              className={`ix-archive-photo ix-archive-photo--${index + 1}`}
              style={
                { "--archive-tilt": `${[-1.2, 1.5, -0.5, 1.1, -1.6][index]}deg` } as CSSProperties
              }
            />
          ))}
          <div className="ix-archive-photo-fragment" aria-hidden="true">
            <Image
              src={unindexedSpiritPhotograph}
              alt=""
              fill
              sizes="18vw"
              className="ix-archive-photo-fragment__image"
            />
          </div>
        </div>
      </section>

      <section
        id="archive-relics"
        className="ix-archive-group ix-archive-group--relics"
        data-archive-panel
      >
        <ArchiveGroupHeader index="03" title={copy.groupHeadlines.relics} />
        <div className="ix-archive-relics__surface" data-archive-surface>
          {relics.map((record, index) => (
            <ArchiveItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              className={`ix-archive-relic ix-archive-relic--${index + 1}`}
              style={
                { "--archive-tilt": `${[-1.5, 1.1, -0.4, 1.3, -1][index]}deg` } as CSSProperties
              }
            />
          ))}
        </div>
      </section>

      <section
        id="archive-realms"
        className="ix-archive-group ix-archive-group--realms"
        data-archive-panel
      >
        <ArchiveGroupHeader index="04" title={copy.groupHeadlines.realms} />
        <ArchiveRealmRecords
          records={copy.realmRecords}
          mapAsset={copy.assets.realms}
          onOpen={onOpen}
        />
      </section>

      <section
        id="archive-lunar"
        className="ix-archive-group ix-archive-group--lunar"
        data-archive-panel
      >
        <ArchiveGroupHeader index="05" title={copy.groupHeadlines.lunar} />
        <div className="ix-archive-lunar__surface" data-archive-surface>
          {lunarRecords.map((record, index) => (
            <ArchiveItem
              key={record.id}
              record={record}
              onOpen={onOpen}
              className={`ix-archive-lunar-record ix-archive-lunar-record--${index + 1}`}
              style={{ "--archive-tilt": `${index === 0 ? -0.8 : 1.2}deg` } as CSSProperties}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
