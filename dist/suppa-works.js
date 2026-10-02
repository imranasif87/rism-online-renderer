import { SuppAElement, Relationships, Reference } from "./suppa-common";
export var SuppAWork;
(function (SuppAWork) {
    class Work extends SuppAElement {
        constructor(data) {
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
    SuppAWork.Work = Work;
})(SuppAWork || (SuppAWork = {}));
//# sourceMappingURL=suppa-works.js.map