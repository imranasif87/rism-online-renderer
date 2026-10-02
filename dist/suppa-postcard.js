import { SuppAElement, Relationships, Reference, ItemLocation } from "./suppa-common";
export var SuppAPostcard;
(function (SuppAPostcard) {
    class Postcard extends SuppAElement {
        constructor(data) {
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
    SuppAPostcard.Postcard = Postcard;
})(SuppAPostcard || (SuppAPostcard = {}));
//# sourceMappingURL=suppa-postcard.js.map