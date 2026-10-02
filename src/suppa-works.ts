import { SuppAElement, Relationships, Reference } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppAWork {
  export class Work extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    relationships?: Relationships;
    workNotes?: string;

    constructor(data: SuppATypes.WorkData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.relationships = new Relationships(data.relationships);
        this.workNotes = data.workNotes;
      }
    }
  }
}