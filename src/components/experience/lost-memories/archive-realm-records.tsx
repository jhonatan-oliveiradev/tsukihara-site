"use client";

import Image from "next/image";
import type { ArchiveRecord, RealmArchiveRecord } from "./lost-memories-types";

type ArchiveRealmRecordsProps = {
  records: RealmArchiveRecord[];
  mapAsset: string;
  onOpen: (record: ArchiveRecord, trigger: HTMLButtonElement) => void;
};

export function ArchiveRealmRecords({ records, mapAsset, onOpen }: ArchiveRealmRecordsProps) {
  return (
    <div className="ix-archive-realms__surface" data-archive-surface>
      <div className="ix-archive-realms__map" aria-hidden="true">
        <Image
          src={mapAsset}
          alt=""
          fill
          sizes="(max-width: 900px) 92vw, 68vw"
          className="ix-archive-realms__map-image"
        />
      </div>

      <div className="ix-archive-realms__records">
        {records.map((record, index) => (
          <button
            key={record.id}
            type="button"
            className={`ix-archive-realm ix-archive-realm--${index + 1}`}
            data-archive-item
            data-archive-kind="realm"
            onClick={(event) => onOpen(record, event.currentTarget)}
            aria-label={`${record.code}: ${record.realm}`}
          >
            <span className="ix-archive-realm__code">{record.code}</span>
            <strong>{record.realm}</strong>
            <dl>
              <div>
                <dt>STATUS</dt>
                <dd>{record.status}</dd>
              </div>
              <div>
                <dt>MEMORY TYPE</dt>
                <dd>{record.memoryType}</dd>
              </div>
              <div>
                <dt>LAST VERIFIED</dt>
                <dd>{record.lastVerified}</dd>
              </div>
            </dl>
            <p>{record.story[0]}</p>
            <i className="ix-archive-realm__line" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
