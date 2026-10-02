import { SuppAElement, Relationships, Reference } from "./suppa-common";
export var SuppAPlace;
(function (SuppAPlace) {
    class Place extends SuppAElement {
        constructor(data) {
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
    SuppAPlace.Place = Place;
})(SuppAPlace || (SuppAPlace = {}));
//# sourceMappingURL=suppa-place.js.map