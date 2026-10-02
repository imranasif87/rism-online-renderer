import { ROElement, URI } from "./base";
import {
  RelationshipItemData, RelationshipsData,
  ItemLocationData, LinkItemData, CitationItemData, TitledItemData
} from "./suppa-types";

export class SuppAElement extends ROElement {
  createHTMLElement(): HTMLElement {
    const container = super.createHTMLElement();
    container.classList.add("suppa");
    return container;
  }
}

/** Renders as a link when the value is an absolute URI, otherwise as
 *  plain text — handles ETC's mixed bare-identifier / full-URI values. */
export class Reference extends SuppAElement {
  raw?: string;

  constructor(value?: string) {
    super();
    this.raw = value;
  }

  private isAbsoluteUri(value: string): boolean {
    return /^https?:\/\//i.test(value);
  }

  toHTML(): HTMLElement {
    const container = this.createHTMLElement();
    if (this.raw) {
      if (this.isAbsoluteUri(this.raw)) {
        container.appendChild(new URI(this.raw).toHTML());
      } else {
        container.appendChild(this.createHTMLTextElement(this.raw));
      }
    }
    return container;
  }
}

export class Relationship extends SuppAElement {
  role?: string;
  qualifier?: string;
  targetType?: string;
  relatedTo?: Reference;
  note?: string;
  certainty?: string;
  authorityFile?: Reference;
  entityType?: string;
  migrationStatus?: string;

  constructor(data: RelationshipItemData) {
    super();
    this.hide("migrationStatus"); // internal workflow metadata — unhide if you want it shown
    if (data) {
      this.role = data.role;
      this.qualifier = data.qualifier;
      this.targetType = data.targetType;
      this.relatedTo = data.relatedTo ? new Reference(data.relatedTo) : undefined;
      this.note = data.note;
      this.certainty = data.certainty;
      this.authorityFile = data.authorityFile ? new Reference(data.authorityFile) : undefined;
      this.entityType = data.entityType;
      this.migrationStatus = data.migrationStatus;
    }
  }
}

export class Relationships extends SuppAElement {
  items?: Relationship[];

  constructor(data?: RelationshipsData) {
    super();
    if (data) {
      this.items = (data.items || []).map((item) => new Relationship(item));
    }
  }
}

/** Shared by Correspondence and Postcard */
export class ItemLocation extends SuppAElement {
  repositoryName?: string;
  rismSiglum?: string;
  shelfmark?: string;
  link?: URI;

  constructor(data?: ItemLocationData) {
    super();
    if (data) {
      this.repositoryName = data.repositoryName;
      this.rismSiglum = data.rismSiglum;
      this.shelfmark = data.shelfmark;
      this.link = data.uri ? new URI(data.uri, data.linkLabel) : undefined;
    }
  }
}

/** Shared for any { uri, linkLabel } pair, e.g. digitalResources items */
export class LinkItem extends SuppAElement {
  link?: URI;

  constructor(data?: LinkItemData) {
    super();
    if (data) {
      this.link = data.uri ? new URI(data.uri, data.linkLabel) : undefined;
    }
  }
}

/** Shared for { citation } items — Person.literature, Performance.reviews */
export class Citation extends SuppAElement {
  citation?: string;

  constructor(data?: CitationItemData) {
    super();
    if (data) this.citation = data.citation;
  }
}

/** Shared for { title } items — Correspondence.printedReproductions */
export class TitledItem extends SuppAElement {
  title?: string;

  constructor(data?: TitledItemData) {
    super();
    if (data) this.title = data.title;
  }
}