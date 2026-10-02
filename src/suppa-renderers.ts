import { ROElement } from "./base";
import { WorkTypes } from "./types";
import { Works } from "./works";
import { SuppATypes } from "./suppa-types";
import { SuppAWork } from "./suppa-works";
import { SuppAPerson } from "./suppa-person";
import { SuppAPerformance } from "./suppa-performance";
import { SuppACorrespondence } from "./suppa-correspondence";
import { SuppAPlace } from "./suppa-place";
import { SuppAPostcard } from "./suppa-postcard";
import { SuppARecording } from "./suppa-recording";

export class SupplementaryRenderer<TData extends { derivedFrom?: string | null }> {
  constructor(
    protected uri: string,
    protected containerId: string,
    protected ElementCtor: new (data: TData) => ROElement,
    protected transform?: (data: any) => any
  ) {}

  /** Override to true only for entities where a matching RISM class
   *  already exists in this repo and can be fetched/rendered inline. */
  protected renderLinkedRismRecord(): boolean {
    return false;
  }

  async render(language: string = "en"): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID "${this.containerId}" not found.`);
      return;
    }

    try {
      const response = await fetch(this.uri, { headers: { Accept: "application/ld+json" } });
      let data = (await response.json()) as TData;

      if (typeof this.transform === "function") {
        data = await this.transform(data);
      }

      if (this.renderLinkedRismRecord() && data.derivedFrom) {
        try {
          const rismResponse = await fetch(data.derivedFrom, {
            headers: { Accept: "application/ld+json" },
          });
          const rismData = (await rismResponse.json()) as WorkTypes.WorkData;
          container.appendChild(new Works.Work(rismData).toHTML(language));
        } catch (err) {
          console.warn("Could not fetch linked RISM record:", err);
        }
      }

      container.appendChild(new this.ElementCtor(data).toHTML(language));
    } catch (error) {
      console.error("Failed to fetch or render supplementary data:", error);
    }
  }
}

export class SupplementaryWorkRenderer extends SupplementaryRenderer<SuppATypes.WorkData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppAWork.Work, transform);
  }
  protected renderLinkedRismRecord(): boolean {
    return true; // only Work has a reusable RISM model (Works.Work) today
  }
}

export class SupplementaryPersonRenderer extends SupplementaryRenderer<SuppATypes.PersonData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppAPerson.Person, transform);
  }
}

export class SupplementaryPerformanceRenderer extends SupplementaryRenderer<SuppATypes.PerformanceData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppAPerformance.Performance, transform);
  }
}

export class SupplementaryCorrespondenceRenderer extends SupplementaryRenderer<SuppATypes.CorrespondenceData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppACorrespondence.Correspondence, transform);
  }
}

export class SupplementaryPlaceRenderer extends SupplementaryRenderer<SuppATypes.PlaceData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppAPlace.Place, transform);
  }
}

export class SupplementaryPostcardRenderer extends SupplementaryRenderer<SuppATypes.PostcardData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppAPostcard.Postcard, transform);
  }
}

export class SupplementaryRecordingRenderer extends SupplementaryRenderer<SuppATypes.RecordingData> {
  constructor(uri: string, containerId: string, transform?: (data: any) => any) {
    super(uri, containerId, SuppARecording.Recording, transform);
  }
}