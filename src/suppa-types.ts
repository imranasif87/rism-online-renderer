export interface SuppABaseData {
  "@context"?: string;
  id: string;
  type?: string;
  etcIdentifier?: string;
  derivedFrom?: string | null;
  created?: string;
  updated?: string;
}

/** Generic relationship item — covers Work, Performance, Correspondence,
 *  Place, Postcard, Recording. Person does NOT use this shape (see below). */
export interface RelationshipItemData {
  role?: string;
  qualifier?: string;
  targetType?: string;
  relatedTo?: string;
  note?: string;
  certainty?: string;
  authorityFile?: string;
  entityType?: string;
  migrationStatus?: string;
}

export interface RelationshipsData {
  items?: RelationshipItemData[];
}

export namespace SuppATypes {
  export interface WorkData extends SuppABaseData {
    relationships?: RelationshipsData;
    workNotes?: string;
    // parts / themes / dedicatees / textSource / events / documents / literature
    // exist in the @context but aren't exercised by ETC-44 / ETC-44.5 yet —
    // easy to add once we confirm real examples for them.
  }
}

/** Shared sub-shapes */
export interface ItemLocationData {
  repositoryName?: string;
  rismSiglum?: string;
  shelfmark?: string;
  uri?: string;
  linkLabel?: string;
}
export interface LinkItemData {
  uri?: string;
  linkLabel?: string;
}
export interface CitationItemData {
  citation?: string;
}
export interface TitledItemData {
  title?: string;
}

export namespace SuppATypes {

  /* ── Work ── */
  export interface WorkData extends SuppABaseData {
    relationships?: RelationshipsData;
    workNotes?: string;
  }

  /* ── Person ── */
  export interface ActivityByPlaceItemData {
    place?: string;
    activities?: string[];
  }
  export interface ActivityByPlaceData {
    items?: ActivityByPlaceItemData[];
  }
  export interface RelatedWorkItemData {
    role?: string;
    relatedTo?: string;
  }
  export interface RelatedWorksData {
    items?: RelatedWorkItemData[];
  }
  export interface EventItemData {
    type?: string; // renamed to eventType at the class level — see etc-person.ts
    place?: string;
    date?: string;
    relatedTo?: string;
  }
  export interface EventsData {
    items?: EventItemData[];
  }
  export interface DocumentItemData {
    format?: string;
    date?: string;
    relatedTo?: string;
  }
  export interface DocumentsData {
    items?: DocumentItemData[];
  }
  export interface LiteratureData {
    items?: CitationItemData[];
  }
  export interface PersonData extends SuppABaseData {
    activityByPlace?: ActivityByPlaceData;
    biography?: string;
    biographyNote?: string;
    relatedWorks?: RelatedWorksData;
    events?: EventsData;
    documents?: DocumentsData;
    literature?: LiteratureData;
    personNotes?: string;
  }

  /* ── Performance ── */
  export interface EvidenceItemData {
    reference?: string;
    evidenceType?: string;
  }
  export interface EvidenceData {
    items?: EvidenceItemData[];
  }
  export interface PerformanceData extends SuppABaseData {
    date?: string;
    relationships?: RelationshipsData;
    descriptionLabel?: string;
    description?: string;
    reviews?: { items?: CitationItemData[] };
    evidence?: EvidenceData;
  }

  /* ── Correspondence ── */
  export interface CorrespondenceData extends SuppABaseData {
    referenceType?: string;
    relationships?: RelationshipsData;
    date?: string;
    itemLocation?: ItemLocationData;
    printedReproductions?: { items?: TitledItemData[] };
    digitalResources?: { items?: LinkItemData[] };
    notes?: string;
  }

  /* ── Place ── */
  export interface PlaceData extends SuppABaseData {
    placeName?: string;
    placeType?: string;
    cityTown?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    activeDates?: string;
    currentStatus?: string;
    gettyTgnId?: string;
    wikidataQid?: string;
    relationships?: RelationshipsData;
    notes?: string;
  }

  /* ── Postcard ── */
  export interface PostcardData extends SuppABaseData {
    postmarkDate?: string;
    relationships?: RelationshipsData;
    itemLocation?: ItemLocationData;
    messageTranscription?: string;
    notes?: string;
  }

  /* ── Recording ── */
  export interface AudioAccessData {
    audioUrl?: string;
    charmRecordingId?: string;
    notes?: string;
  }
  export interface RecordingData extends SuppABaseData {
    recordingDate?: string;
    recordingLabel?: string;
    catalogueNumber?: string;
    format?: string;
    relationships?: RelationshipsData;
    audioAccess?: AudioAccessData;
  }
}
