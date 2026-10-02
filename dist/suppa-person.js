import { SuppAElement, Reference, Citation } from "./suppa-common";
export var SuppAPerson;
(function (SuppAPerson) {
    class ActivityByPlaceItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.place = data.place ? new Reference(data.place) : undefined;
                this.activities = data.activities;
            }
        }
    }
    SuppAPerson.ActivityByPlaceItem = ActivityByPlaceItem;
    class ActivityByPlace extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.items = (data.items || []).map((i) => new ActivityByPlaceItem(i));
        }
    }
    SuppAPerson.ActivityByPlace = ActivityByPlace;
    class RelatedWorkItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.role = data.role;
                this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
            }
        }
    }
    SuppAPerson.RelatedWorkItem = RelatedWorkItem;
    class RelatedWorks extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.items = (data.items || []).map((i) => new RelatedWorkItem(i));
        }
    }
    SuppAPerson.RelatedWorks = RelatedWorks;
    class EventItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.eventType = data.type;
                this.place = data.place ? new Reference(data.place) : undefined;
                this.date = data.date;
                this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
            }
        }
    }
    SuppAPerson.EventItem = EventItem;
    class Events extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.items = (data.items || []).map((i) => new EventItem(i));
        }
    }
    SuppAPerson.Events = Events;
    class DocumentItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.format = data.format;
                this.date = data.date;
                this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
            }
        }
    }
    SuppAPerson.DocumentItem = DocumentItem;
    class Documents extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.items = (data.items || []).map((i) => new DocumentItem(i));
        }
    }
    SuppAPerson.Documents = Documents;
    class Person extends SuppAElement {
        constructor(data) {
            var _a;
            super();
            if (data) {
                this.etcIdentifier = data.etcIdentifier;
                this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
                this.created = data.created;
                this.updated = data.updated;
                this.activityByPlace = new ActivityByPlace(data.activityByPlace);
                this.biography = data.biography;
                this.biographyNote = data.biographyNote;
                this.relatedWorks = new RelatedWorks(data.relatedWorks);
                this.events = new Events(data.events);
                this.documents = new Documents(data.documents);
                this.literature = (((_a = data.literature) === null || _a === void 0 ? void 0 : _a.items) || []).map((i) => new Citation(i));
                this.personNotes = data.personNotes;
            }
        }
    }
    SuppAPerson.Person = Person;
})(SuppAPerson || (SuppAPerson = {}));
//# sourceMappingURL=suppa-person.js.map