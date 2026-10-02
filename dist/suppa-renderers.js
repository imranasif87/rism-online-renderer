import { Works } from "./works";
import { SuppAWork } from "./suppa-works";
import { SuppAPerson } from "./suppa-person";
import { SuppAPerformance } from "./suppa-performance";
import { SuppACorrespondence } from "./suppa-correspondence";
import { SuppAPlace } from "./suppa-place";
import { SuppAPostcard } from "./suppa-postcard";
import { SuppARecording } from "./suppa-recording";
export class SupplementaryRenderer {
    constructor(uri, containerId, ElementCtor, transform) {
        this.uri = uri;
        this.containerId = containerId;
        this.ElementCtor = ElementCtor;
        this.transform = transform;
    }
    /** Override to true only for entities where a matching RISM class
     *  already exists in this repo and can be fetched/rendered inline. */
    renderLinkedRismRecord() {
        return false;
    }
    async render(language = "en") {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }
        try {
            const response = await fetch(this.uri, { headers: { Accept: "application/ld+json" } });
            let data = (await response.json());
            if (typeof this.transform === "function") {
                data = await this.transform(data);
            }
            if (this.renderLinkedRismRecord() && data.derivedFrom) {
                try {
                    const rismResponse = await fetch(data.derivedFrom, {
                        headers: { Accept: "application/ld+json" },
                    });
                    const rismData = (await rismResponse.json());
                    container.appendChild(new Works.Work(rismData).toHTML(language));
                }
                catch (err) {
                    console.warn("Could not fetch linked RISM record:", err);
                }
            }
            container.appendChild(new this.ElementCtor(data).toHTML(language));
        }
        catch (error) {
            console.error("Failed to fetch or render supplementary data:", error);
        }
    }
}
export class SupplementaryWorkRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppAWork.Work, transform);
    }
    renderLinkedRismRecord() {
        return true; // only Work has a reusable RISM model (Works.Work) today
    }
}
export class SupplementaryPersonRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppAPerson.Person, transform);
    }
}
export class SupplementaryPerformanceRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppAPerformance.Performance, transform);
    }
}
export class SupplementaryCorrespondenceRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppACorrespondence.Correspondence, transform);
    }
}
export class SupplementaryPlaceRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppAPlace.Place, transform);
    }
}
export class SupplementaryPostcardRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppAPostcard.Postcard, transform);
    }
}
export class SupplementaryRecordingRenderer extends SupplementaryRenderer {
    constructor(uri, containerId, transform) {
        super(uri, containerId, SuppARecording.Recording, transform);
    }
}
//# sourceMappingURL=suppa-renderers.js.map