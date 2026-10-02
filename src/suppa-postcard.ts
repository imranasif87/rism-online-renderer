import { SuppAElement, Relationships, Reference, ItemLocation } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppAPostcard {

  export class Postcard extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    postmarkDate?: string;
    relationships?: Relationships;
    itemLocation?: ItemLocation;
    messageTranscription?: string;
    notes?: string;

    constructor(data: SuppATypes.PostcardData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.postmarkDate = data.postmarkDate;
        this.relationships = new Relationships(data.relationships);
        this.itemLocation = new ItemLocation(data.itemLocation);
        this.messageTranscription = data.messageTranscription;
        this.notes = data.notes;
      }
    }
  }
}