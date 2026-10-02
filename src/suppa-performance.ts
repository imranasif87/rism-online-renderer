import { SuppAElement, Relationships, Reference, Citation } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppAPerformance {

  export class EvidenceItem extends SuppAElement {
    reference?: string;
    evidenceType?: string;

    constructor(data: SuppATypes.EvidenceItemData) {
      super();
      if (data) {
        this.reference = data.reference;
        this.evidenceType = data.evidenceType;
      }
    }
  }

  export class Evidence extends SuppAElement {
    items?: EvidenceItem[];

    constructor(data?: SuppATypes.EvidenceData) {
      super();
      if (data) this.items = (data.items || []).map((i) => new EvidenceItem(i));
    }
  }

  export class Performance extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    date?: string;
    relationships?: Relationships;
    descriptionLabel?: string;
    description?: string;
    reviews?: Citation[];
    evidence?: Evidence;

    constructor(data: SuppATypes.PerformanceData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.date = data.date;
        this.relationships = new Relationships(data.relationships);
        this.descriptionLabel = data.descriptionLabel;
        this.description = data.description;
        this.reviews = (data.reviews?.items || []).map((i) => new Citation(i));
        this.evidence = new Evidence(data.evidence);
      }
    }
  }
}