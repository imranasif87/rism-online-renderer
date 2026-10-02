import { SuppAElement, Relationships, Reference, Citation } from "./suppa-common";
export var SuppAPerformance;
(function (SuppAPerformance) {
    class EvidenceItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.reference = data.reference;
                this.evidenceType = data.evidenceType;
            }
        }
    }
    SuppAPerformance.EvidenceItem = EvidenceItem;
    class Evidence extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.items = (data.items || []).map((i) => new EvidenceItem(i));
        }
    }
    SuppAPerformance.Evidence = Evidence;
    class Performance extends SuppAElement {
        constructor(data) {
            var _a;
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
                this.reviews = (((_a = data.reviews) === null || _a === void 0 ? void 0 : _a.items) || []).map((i) => new Citation(i));
                this.evidence = new Evidence(data.evidence);
            }
        }
    }
    SuppAPerformance.Performance = Performance;
})(SuppAPerformance || (SuppAPerformance = {}));
//# sourceMappingURL=suppa-performance.js.map