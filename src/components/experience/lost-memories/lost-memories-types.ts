export type ArchiveStatus = "PRESERVED" | "FRAGMENTED" | "UNSTABLE" | "CORRUPTED" | "SEALED";

export type ArchiveGroupId = "letters" | "photographs" | "relics" | "realms" | "lunar";

export type ArchiveItemKind = "letter" | "photograph" | "relic" | "realm" | "lunar" | "black";

export type ArchiveAssetCrop = {
  objectPosition?: string;
  clipPath?: string;
};

export type ArchiveHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ArchiveRecord = {
  id: string;
  group: ArchiveGroupId;
  kind: ArchiveItemKind;
  code: string;
  title: string;
  status: ArchiveStatus;
  asset: string;
  story: string[];
  annotation?: string;
  crop?: ArchiveAssetCrop;
  decay?: boolean;
  hotspot?: ArchiveHotspot;
};

export type RealmArchiveRecord = ArchiveRecord & {
  kind: "realm";
  group: "realms";
  realm: string;
  memoryType: string;
  lastVerified: string;
  sealed?: boolean;
};

export type LostMemoriesIndexItem = {
  id: ArchiveGroupId;
  number: string;
  label: string;
};

export type LostMemoriesCopy = {
  eyebrow: string;
  headline: string;
  support: string[];
  index: LostMemoriesIndexItem[];
  groupHeadlines: Record<ArchiveGroupId, string>;
  records: ArchiveRecord[];
  realmRecords: RealmArchiveRecord[];
  assets: {
    table: string;
    fragments: string;
    realms: string;
    relics: string;
    akari: string;
    transition: string;
  };
  transition: {
    first: string;
    second: string;
  };
  akariRecord: {
    code: string;
    ownerLabel: string;
    owner: string;
    statusLabel: string;
    status: string;
  };
  signature: string;
  polarity: {
    forget: string;
    remember: string;
  };
  closeLabel: string;
  inspectLabel: string;
};
