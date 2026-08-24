"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ArchiveRecordViewer } from "@/components/experience/lost-memories/archive-record-viewer";
import { ArchiveTable } from "@/components/experience/lost-memories/archive-table";
import type { ArchiveRecord } from "@/components/experience/lost-memories/lost-memories-types";
import { useLostMemoriesMotion } from "@/components/experience/lost-memories/use-lost-memories-motion";
import { lostMemoriesCopy } from "@/content/lost-memories";
import type { Locale } from "@/content/immersive-copy";

export function LostMemoriesChapter({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [openRecordId, setOpenRecordId] = useState<string | null>(null);
  const copy = lostMemoriesCopy[locale];

  useLostMemoriesMotion(rootRef);

  const allRecords = useMemo(
    () => [...copy.records, ...copy.realmRecords] as ArchiveRecord[],
    [copy.records, copy.realmRecords],
  );
  const openRecord = allRecords.find((record) => record.id === openRecordId) ?? null;

  const handleOpen = (record: ArchiveRecord, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setOpenRecordId(record.id);
  };

  const handleClose = () => {
    setOpenRecordId(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  return (
    <section
      id="lore"
      ref={rootRef}
      data-section
      data-archive-open={openRecord ? "true" : undefined}
      className="ix-archive"
      aria-labelledby="lost-memories-title"
    >
      <div className="ix-archive__background" aria-hidden="true">
        <Image
          src={copy.assets.table}
          alt=""
          fill
          sizes="100vw"
          className="ix-archive__background-image"
        />
      </div>
      <div className="ix-archive__fragments" data-archive-fragments aria-hidden="true">
        <Image
          src={copy.assets.fragments}
          alt=""
          fill
          sizes="100vw"
          className="ix-archive__fragments-image"
        />
      </div>

      <div className="ix-archive__content" inert={openRecord ? true : undefined}>
        <header className="ix-archive-intro" data-archive-intro>
          <div className="ix-archive-intro__copy">
            <p className="ix-archive-eyebrow" data-archive-intro-part>
              {copy.eyebrow}
            </p>
            <h2 id="lost-memories-title" data-archive-intro-part>
              {copy.headline}
            </h2>
            <div className="ix-archive-intro__support" data-archive-intro-part>
              {copy.support.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <nav className="ix-archive-index" aria-label="Archive index" data-archive-intro-part>
            {copy.index.map((item) => (
              <a key={item.id} href={`#archive-${item.id}`}>
                <span>{item.number}</span>
                <b>{item.label}</b>
              </a>
            ))}
          </nav>
        </header>

        <ArchiveTable copy={copy} onOpen={handleOpen} />

        <section className="ix-archive-thesis" aria-label="Archive conclusion">
          <p data-archive-thesis="first">{copy.transition.first}</p>
          <p data-archive-thesis="second">{copy.transition.second}</p>
        </section>

        <section className="ix-archive-akari" data-archive-akari aria-label="Akari memory record">
          <div className="ix-archive-akari__record">
            <div className="ix-archive-akari__asset" aria-hidden="true">
              <Image
                src={copy.assets.akari}
                alt=""
                fill
                sizes="(max-width: 900px) 88vw, 46vw"
                className="ix-archive-akari__image"
              />
            </div>
            <div className="ix-archive-akari__meta">
              <span>{copy.akariRecord.code}</span>
              <dl>
                <div>
                  <dt>{copy.akariRecord.ownerLabel}</dt>
                  <dd>{copy.akariRecord.owner}</dd>
                </div>
                <div>
                  <dt>{copy.akariRecord.statusLabel}</dt>
                  <dd>{copy.akariRecord.status}</dd>
                </div>
              </dl>
            </div>
          </div>
          <strong className="ix-archive-signature">{copy.signature}</strong>
        </section>

        <section className="ix-archive-transition" data-archive-transition>
          <Image
            src={copy.assets.transition}
            alt=""
            fill
            sizes="100vw"
            className="ix-archive-transition__image"
          />
          <span className="ix-archive-transition__word ix-archive-transition__word--forget">
            {copy.polarity.forget}
          </span>
          <i aria-hidden="true" />
          <span className="ix-archive-transition__word ix-archive-transition__word--remember">
            {copy.polarity.remember}
          </span>
        </section>
      </div>

      <ArchiveRecordViewer record={openRecord} onClose={handleClose} closeLabel={copy.closeLabel} />
    </section>
  );
}
