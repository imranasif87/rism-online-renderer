import { Sources } from "./sources";
import { Works } from "./works";
export class SourceRenderer {
    constructor(uri, containerId, transform) {
        this.uri = uri;
        this.containerId = containerId;
        this.transform = transform;
    }
    async render(language = "en") {
        try {
            const response = await fetch(this.uri, {
                headers: { Accept: "application/ld+json" },
            });
            let data = await response.json();
            if (typeof this.transform === "function") {
                data = await this.transform(data);
            }
            const source = new Sources.Source(data);
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container with ID "${this.containerId}" not found.`);
                return;
            }
            container.appendChild(source.toHTML(language));
        }
        catch (error) {
            console.error("Failed to fetch or render JSON-LD:", error);
        }
    }
}
export class WorkRenderer {
    constructor(uri, containerId, transform) {
        this.uri = uri;
        this.containerId = containerId;
        this.transform = transform;
    }
    async render(language = "en") {
        try {
            const response = await fetch(this.uri, {
                headers: { Accept: "application/ld+json" },
            });
            let data = await response.json();
            if (typeof this.transform === "function") {
                data = await this.transform(data);
            }
            const work = new Works.Work(data);
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container with ID "${this.containerId}" not found.`);
                return;
            }
            container.appendChild(work.toHTML(language));
        }
        catch (error) {
            console.error("Failed to fetch or render JSON-LD:", error);
        }
    }
}
//# sourceMappingURL=renderers.js.map