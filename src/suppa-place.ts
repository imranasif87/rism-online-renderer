import { SuppAElement, Relationships, Reference } from "./suppa-common";
import { SuppATypes } from "./suppa-types";

export namespace SuppAPlace {

  export class Place extends SuppAElement {
    etcIdentifier?: string;
    derivedFrom?: Reference;
    created?: string;
    updated?: string;
    placeName?: string;
    placeType?: string;
    cityTown?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    activeDates?: string;
    currentStatus?: string;
    gettyTgnId?: string;
    wikidataQid?: string;
    relationships?: Relationships;
    notes?: string;

    constructor(data: SuppATypes.PlaceData) {
      super();
      if (data) {
        this.etcIdentifier = data.etcIdentifier;
        this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
        this.created = data.created;
        this.updated = data.updated;
        this.placeName = data.placeName;
        this.placeType = data.placeType;
        this.cityTown = data.cityTown;
        this.country = data.country;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.activeDates = data.activeDates;
        this.currentStatus = data.currentStatus;
        this.gettyTgnId = data.gettyTgnId;
        this.wikidataQid = data.wikidataQid;
        this.relationships = new Relationships(data.relationships);
        this.notes = data.notes;
      }
    }
  }
}