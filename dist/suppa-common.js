import { ROElement, URI } from "./base";
export class SuppAElement extends ROElement {
    createHTMLElement() {
        const container = super.createHTMLElement();
        container.classList.add("suppa");
        return container;
    }
}
/** Renders as a link when the value is an absolute URI, otherwise as
 *  plain text — handles ETC's mixed bare-identifier / full-URI values. */
export class Reference extends SuppAElement {
    constructor(value) {
        super();
        this.raw = value;
    }
    isAbsoluteUri(value) {
        return /^https?:\/\//i.test(value);
    }
    toHTML() {
        const container = this.createHTMLElement();
        if (this.raw) {
            if (this.isAbsoluteUri(this.raw)) {
                container.appendChild(new URI(this.raw).toHTML());
            }
            else {
                container.appendChild(this.createHTMLTextElement(this.raw));
            }
        }
        return container;
    }
}
export class Relationship extends SuppAElement {
    constructor(data) {
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
    constructor(data) {
        super();
        if (data) {
            this.items = (data.items || []).map((item) => new Relationship(item));
        }
    }
}
/** Shared by Correspondence and Postcard */
export class ItemLocation extends SuppAElement {
    constructor(data) {
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
    constructor(data) {
        super();
        if (data) {
            this.link = data.uri ? new URI(data.uri, data.linkLabel) : undefined;
        }
    }
}
/** Shared for { citation } items — Person.literature, Performance.reviews */
export class Citation extends SuppAElement {
    constructor(data) {
        super();
        if (data)
            this.citation = data.citation;
    }
}
/** Shared for { title } items — Correspondence.printedReproductions */
export class TitledItem extends SuppAElement {
    constructor(data) {
        super();
        if (data)
            this.title = data.title;
    }
}
//# sourceMappingURL=suppa-common.js.map