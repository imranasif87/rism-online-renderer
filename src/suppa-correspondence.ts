import { SuppAElement, Relationships, Reference, ItemLocation, TitledItem, LinkItem } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppACorrespondence {

  export class Correspondence extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    referenceType?: string;
    relationships?: Relationships;
    date?: string;
    itemLocation?: ItemLocation;
    printedReproductions?: TitledItem[];
    digitalResources?: LinkItem[];
    notes?: string;

    constructor(data: SuppATypes.CorrespondenceData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.referenceType = data.referenceType;
        this.relationships = new Relationships(data.relationships);
        this.date = data.date;
        this.itemLocation = new ItemLocation(data.itemLocation);
        this.printedReproductions = (data.printedReproductions?.items || []).map((i) => new TitledItem(i));
        this.digitalResources = (data.digitalResources?.items || []).map((i) => new LinkItem(i));
        this.notes = data.notes;
      }
    }
  }
}