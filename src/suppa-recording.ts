import { SuppAElement, Relationships, Reference } from "./suppa-common";
import { SuppATypes } from "./suppa-types";
import { URI } from "./base";

export namespace SuppARecording {

  export class AudioAccess extends SuppAElement {
    audioUrl?: URI;
    charmRecordingId?: string;
    notes?: string;

    constructor(data?: SuppATypes.AudioAccessData) {
      super();
      if (data) {
        this.audioUrl = data.audioUrl ? new URI(data.audioUrl, "Listen") : undefined;
        this.charmRecordingId = data.charmRecordingId;
        this.notes = data.notes;
      }
    }
  }

  export class Recording extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    recordingDate?: string;
    recordingLabel?: string;
    catalogueNumber?: string;
    format?: string;
    relationships?: Relationships;
    audioAccess?: AudioAccess;

    constructor(data: SuppATypes.RecordingData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.recordingDate = data.recordingDate;
        this.recordingLabel = data.recordingLabel;
        this.catalogueNumber = data.catalogueNumber;
        this.format = data.format;
        this.relationships = new Relationships(data.relationships);
        this.audioAccess = new AudioAccess(data.audioAccess);
      }
    }
  }
}