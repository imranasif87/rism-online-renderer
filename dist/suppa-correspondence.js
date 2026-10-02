import { SuppAElement, Relationships, Reference, ItemLocation, TitledItem, LinkItem } from "./suppa-common";
export var SuppACorrespondence;
(function (SuppACorrespondence) {
    class Correspondence extends SuppAElement {
        constructor(data) {
            var _a, _b;
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
                this.printedReproductions = (((_a = data.printedReproductions) === null || _a === void 0 ? void 0 : _a.items) || []).map((i) => new TitledItem(i));
                this.digitalResources = (((_b = data.digitalResources) === null || _b === void 0 ? void 0 : _b.items) || []).map((i) => new LinkItem(i));
                this.notes = data.notes;
            }
        }
    }
    SuppACorrespondence.Correspondence = Correspondence;
})(SuppACorrespondence || (SuppACorrespondence = {}));
//# sourceMappingURL=suppa-correspondence.js.map