import { SuppAElement, Reference, Citation } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppAPerson {

  export class ActivityByPlaceItem extends SuppAElement {
    place?: Reference;
    activities?: string[];

    constructor(data: SuppATypes.ActivityByPlaceItemData) {
      super();
      if (data) {
        this.place = data.place ? new Reference(data.place) : undefined;
        this.activities = data.activities;
      }
    }
  }

  export class ActivityByPlace extends SuppAElement {
    items?: ActivityByPlaceItem[];

    constructor(data?: SuppATypes.ActivityByPlaceData) {
      super();
      if (data) this.items = (data.items || []).map((i) => new ActivityByPlaceItem(i));
    }
  }

  export class RelatedWorkItem extends SuppAElement {
    role?: string;
    relatedTo?: Reference;

    constructor(data: SuppATypes.RelatedWorkItemData) {
      super();
      if (data) {
        this.role = data.role;
        this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
      }
    }
  }

  export class RelatedWorks extends SuppAElement {
    items?: RelatedWorkItem[];

    constructor(data?: SuppATypes.RelatedWorksData) {
      super();
      if (data) this.items = (data.items || []).map((i) => new RelatedWorkItem(i));
    }
  }

  export class EventItem extends SuppAElement {
    eventType?: string; // JSON key is "type" — see note above
    place?: Reference;
    date?: string;
    relatedTo?: Reference;

    constructor(data: SuppATypes.EventItemData) {
      super();
      if (data) {
        this.eventType = data.type;
        this.place = data.place ? new Reference(data.place) : undefined;
        this.date = data.date;
        this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
      }
    }
  }

  export class Events extends SuppAElement {
    items?: EventItem[];

    constructor(data?: SuppATypes.EventsData) {
      super();
      if (data) this.items = (data.items || []).map((i) => new EventItem(i));
    }
  }

  export class DocumentItem extends SuppAElement {
    format?: string;
    date?: string;
    relatedTo?: Reference;

    constructor(data: SuppATypes.DocumentItemData) {
      super();
      if (data) {
        this.format = data.format;
        this.date = data.date;
        this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
      }
    }
  }

  export class Documents extends SuppAElement {
    items?: DocumentItem[];

    constructor(data?: SuppATypes.DocumentsData) {
      super();
      if (data) this.items = (data.items || []).map((i) => new DocumentItem(i));
    }
  }

  export class Person extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    activityByPlace?: ActivityByPlace;
    biography?: string;
    biographyNote?: string;
    relatedWorks?: RelatedWorks;
    events?: Events;
    documents?: Documents;
    literature?: Citation[];
    personNotes?: string;

    constructor(data: SuppATypes.PersonData) {
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
        this.literature = (data.literature?.items || []).map((i) => new Citation(i));
        this.personNotes = data.personNotes;
      }
    }
  }
}