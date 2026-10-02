var SuppAOnline = (function (exports) {
    'use strict';

    class ROElement {
        constructor() {
            this.hidden = ["@context", "type"];
        }
        hide(member) {
            this.hidden.push(member);
        }
        createHTMLElement() {
            const container = document.createElement("div");
            container.className = "ro-" + this.constructor.name.toLowerCase();
            return container;
        }
        createHTMLTextElement(content) {
            const container = document.createElement("div");
            container.textContent = content;
            return container;
        }
        toHTML(lang) {
            const container = this.createHTMLElement();
            for (let member in this) {
                // console.log(member);
                if (this.isHidden(member))
                    continue;
                //
                if (this[member] instanceof ROElement) {
                    const child = this[member].toHTML(lang);
                    // Only add elements with children
                    if (child.hasChildNodes()) {
                        container.appendChild(child);
                    }
                    else {
                        child.remove();
                    }
                }
                else if (Array.isArray(this[member])) {
                    this[member].forEach((item) => {
                        if (item instanceof ROElement) {
                            container.appendChild(item.toHTML(lang));
                        }
                    });
                }
                else if (typeof this[member] === "string") {
                    const text = document.createElement("div");
                    text.textContent = this[member];
                    container.appendChild(text);
                }
                else if (typeof this[member] === "number") {
                    const text = document.createElement("div");
                    text.textContent = this[member].toString();
                    container.appendChild(text);
                }
            }
            return container;
        }
        isHidden(member) {
            if (this.hidden.includes(member))
                return true;
            return false;
        }
    }
    class URI extends ROElement {
        constructor(link, displayText) {
            super();
            this.link = link;
            this.displayText = displayText;
        }
        toHTML() {
            const a = document.createElement("a");
            a.textContent = (this.displayText) ? this.displayText : this.link;
            a.setAttribute("href", this.link);
            a.setAttribute("target", "_blank");
            return a;
        }
    }
    class I18n extends ROElement {
        constructor(initialMap) {
            super();
            this.map = initialMap;
        }
        get(language) {
            return (this.has(language) ? this.map[language] : []);
        }
        has(language) {
            return Object.prototype.hasOwnProperty.call(this.map, language);
        }
        getPreferredLanguage(lang) {
            if (!this.map)
                return undefined;
            if (lang && this.has(lang))
                return lang;
            return Object.keys(this.map)[0];
        }
        toHTML(lang) {
            const container = document.createElement("div");
            container.className = "ro-" + this.constructor.name.toLowerCase();
            if (this.map) {
                lang = this.getPreferredLanguage(lang);
                if (!lang)
                    return container;
                const langContainer = document.createElement("span");
                langContainer.className = `lang-${lang}`;
                this.get(lang).forEach((item) => {
                    const itemContainer = document.createElement("span");
                    itemContainer.textContent = item;
                    langContainer.appendChild(itemContainer);
                });
                container.appendChild(langContainer);
            }
            return container;
        }
    }
    class HtmlI18n extends I18n {
        toHTML(lang) {
            const container = document.createElement("div");
            container.className = "ro-" + this.constructor.name.toLowerCase();
            if (this.map) {
                lang = this.getPreferredLanguage(lang);
                if (!lang)
                    return container;
                const langContainer = document.createElement("span");
                langContainer.className = `lang-${lang}`;
                this.get(lang).forEach((item) => {
                    const itemContainer = document.createElement("span");
                    itemContainer.innerHTML = item;
                    langContainer.appendChild(itemContainer);
                });
                container.appendChild(langContainer);
            }
            return container;
        }
    }
    class Label extends I18n {
    }
    class LabelledLink extends ROElement {
        constructor(label, id) {
            super();
            this.hide("label");
            this.hide("id");
            this.label = new I18n(label);
            this.id = new URI(id);
        }
        toHTML(lang) {
            const container = document.createElement("div");
            container.className = "ro-" + this.constructor.name.toLowerCase();
            const a = this.id.toHTML();
            a.textContent = "";
            a.appendChild(this.label.toHTML(lang));
            container.appendChild(a);
            return container;
        }
    }
    class Data extends ROElement {
        constructor(format, data) {
            super();
            this.format = format;
            this.data = data;
        }
        toHTML() {
            if (this.format === "image/svg+xml") {
                const div = document.createElement("div");
                div.className = "ro-" + this.constructor.name.toLowerCase();
                const parser = new DOMParser();
                const doc = parser.parseFromString(this.data, "image/svg+xml");
                div.appendChild(doc.documentElement);
                return div;
            }
        }
    }

    /////////////////////////////
    var Works;
    (function (Works) {
        class Work extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                this.hide("sources");
                if (data) {
                    this["@context"] = data["@context"];
                    this.labelledLink = new LabelledLink(data.label, data.id);
                    this.type = data.type;
                    this.creator = new Creator(data.creator);
                    this.summary = (data.summary || []).map((item) => new Summary(item));
                    this.partOf = new PartOf(data.partOf);
                    this.recordHistory = new RecordHistory(data.recordHistory);
                    this.incipits = new Incipits(data.incipits);
                    this.sources = new Sources(data.sources);
                    this.externalAuthorities = new ExternalAuthorities(data.externalAuthorities);
                    this.formOfWork = new FormOfWork(data.formOfWork);
                    this.referencesNotes = new ReferencesNotes(data.referencesNotes);
                    this.relationships = new Relationships(data.relationships);
                }
            }
        }
        Works.Work = Work;
        /////
        class Created extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Created = Created;
        class Creator extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.Creator = Creator;
        class Encodings extends ROElement {
            constructor(data) {
                super();
                this.hide("label");
                this.hide("format");
                this.hide("data");
                this.hide("url");
                if (data) {
                    this.label = new Label(data.label);
                    this.format = data.format;
                    this.data = new PAE(data.data);
                    this.url = data.url;
                }
            }
        }
        Works.Encodings = Encodings;
        class ExternalAuthorities extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.items = (data.items || []).map((item) => new ExternalAuthoritiesItem(item));
                    this.type = data.type;
                }
            }
        }
        Works.ExternalAuthorities = ExternalAuthorities;
        class ExternalAuthoritiesItem extends ROElement {
            constructor(data) {
                super();
                this.hide("url");
                this.hide("base");
                this.hide("value");
                if (data) {
                    this.url = data.url;
                    this.base = data.base;
                    this.labelledLinked = new LabelledLink(data.label, data.url);
                    this.value = data.value;
                    this.type = data.type;
                }
            }
        }
        Works.ExternalAuthoritiesItem = ExternalAuthoritiesItem;
        class FormOfWork extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new FormOfWorkItem(item));
                    this.type = data.type;
                }
            }
        }
        Works.FormOfWork = FormOfWork;
        class FormOfWorkItem extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                this.hide("base");
                this.hide("value");
                if (data) {
                    this.id = data.id;
                    this.label = new Label(data.label);
                    this.value = data.value;
                    this.type = data.type;
                }
            }
        }
        Works.FormOfWorkItem = FormOfWorkItem;
        class Incipits extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new IncipitsItem(item));
                }
            }
        }
        Works.Incipits = Incipits;
        class IncipitsItem extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                this.hide("properties");
                if (data) {
                    this.id = new URI(data.id);
                    this.type = data.type;
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.label = new Label(data.label);
                    this.summary = (data.summary || []).map((item) => new IncipitSummary(item));
                    this.rendered = (data.rendered || []).map((item) => new Rendered(item));
                    this.encodings = (data.encodings || []).map((item) => new Encodings(item));
                    this.properties = new Properties(data.properties);
                }
            }
        }
        Works.IncipitsItem = IncipitsItem;
        class IncipitSummary extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new I18n(data.value);
                }
            }
        }
        Works.IncipitSummary = IncipitSummary;
        class Item extends ROElement {
            constructor(data) {
                super();
                this.hide("relationshipType");
                if (data) {
                    this.relationshipType = data.relationshipType;
                    this.workNumber = data.workNumber;
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.Item = Item;
        class NotesItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new NotesItemValue(data.value);
                }
            }
        }
        Works.NotesItem = NotesItem;
        class NotesItemValue extends HtmlI18n {
        }
        Works.NotesItemValue = NotesItemValue;
        class PAE extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.clef = data.clef;
                    this.keysig = data.keysig;
                    this.timesig = data.timesig;
                    this.key = data.key;
                    this.data = data.data;
                }
            }
        }
        Works.PAE = PAE;
        class PartOf extends ROElement {
            constructor(data) {
                super();
                this.hide("id");
                if (data) {
                    this.type = data.type;
                    this.label = new Label(data.label);
                    this.items = (data.items || []).map((item) => new Item(item));
                }
            }
        }
        Works.PartOf = PartOf;
        class Properties extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.clef = data.clef;
                    this.keysig = data.keysig;
                    this.timesig = data.timesig;
                    this.notation = data.notation;
                }
            }
        }
        Works.Properties = Properties;
        class RecordHistory extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.type = data.type;
                    this.created = new Created(data.created);
                    this.updated = new Updated(data.updated);
                }
            }
        }
        Works.RecordHistory = RecordHistory;
        class ReferencesNotes extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.type = data.type;
                    this.notes = (data.notes || []).map((note) => new NotesItem(note));
                }
            }
        }
        Works.ReferencesNotes = ReferencesNotes;
        class RelatedTo extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.labelledLink = new LabelledLink(data.label, data.id);
                    this.type = data.type;
                    this.status = new Status(data.status);
                }
            }
        }
        Works.RelatedTo = RelatedTo;
        class Relationships extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.sectionLabel = new Label(data.sectionLabel);
                    this.items = (data.items || []).map((item) => new RelationshipsItem(item));
                }
            }
        }
        Works.Relationships = Relationships;
        class RelationshipsItem extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.role = new Role(data.role);
                    this.relatedTo = new RelatedTo(data.relatedTo);
                }
            }
        }
        Works.RelationshipsItem = RelationshipsItem;
        class Rendered extends ROElement {
            constructor(data) {
                super();
                this.hide("format");
                this.hide("url");
                if (data) {
                    this.format = data.format;
                    if (data.data) {
                        this.data = new Data(data.format, data.data);
                    }
                    this.url = data.url;
                }
            }
        }
        Works.Rendered = Rendered;
        class Role extends ROElement {
            constructor(data) {
                super();
                this.hide("value");
                this.hide("id");
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                    this.id = data.id;
                }
            }
        }
        Works.Role = Role;
        class Status extends ROElement {
            constructor(data) {
                super();
                this.hide("value");
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Status = Status;
        class Sources extends ROElement {
            constructor(data) {
                super();
                this.hide("totalItems");
                if (data) {
                    this.url = new URI(data.url, data.totalItems.toString());
                    this.totalItems = data.totalItems;
                }
            }
        }
        Works.Sources = Sources;
        class Summary extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = new I18n(data.value);
                }
            }
        }
        Works.Summary = Summary;
        class Updated extends ROElement {
            constructor(data) {
                super();
                if (data) {
                    this.label = new Label(data.label);
                    this.value = data.value;
                }
            }
        }
        Works.Updated = Updated;
        /*
        class ContentType extends ROElement {
          label?: I18n;
          type?: string;
        
          constructor(data: Sources.ContentTypeData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.type = data.type;
            }
          }
        }
        
        class Contents extends ROElement {
          sectionLabel?: I18n;
          summary?: SummaryItem[];
          subjects?: Subjects;
        
          constructor(data: Sources.ContentsData) {
            super();
            if (data) {
              this.sectionLabel = new I18n(data.sectionLabel);
              this.summary = (data.summary || []).map((item: Sources.SummaryItemData) => new SummaryItem(item));
              this.subjects = new Subjects(data.subjects);
            }
          }
        }
        
        class Creator extends ROElement {
          role?: Role;
          relatedTo?: RelatedTo;
        
          constructor(data: Sources.CreatorData) {
            super();
            if (data) {
              this.role = new Role(data.role);
              this.relatedTo = new RelatedTo(data.relatedTo);
            }
          }
        }
        
        class Dates extends ROElement {
          earliestDate?: number;
          latestDate?: number;
          dateStatement?: string;
        
          constructor(data: Sources.DatesData) {
            super();
            if (data) {
              this.earliestDate = data.earliestDate;
              this.latestDate = data.latestDate;
              this.dateStatement = data.dateStatement;
            }
          }
        }
        
        class Exemplars extends ROElement {
          id?: URI;
          type?: string;
          sectionLabel?: I18n;
          items?: ExemplarsItem[];
        
          constructor(data: Sources.ExemplarsData) {
            super();
            this.hide("id");
            if (data) {
              this.id = new URI(data.id);
              this.type = data.type;
              this.sectionLabel = new I18n(data.sectionLabel);
              this.items = (data.items || []).map((item: Sources.ExemplarsItemData) => new ExemplarsItem(item));
            }
          }
        }
        
        class ExemplarsItem extends ROElement {
          id?: URI;
          type?: string;
          sectionLabel?: I18n;
          label?: I18n;
          summary?: MaterialSummary[];
          notes?: NotesItem[];
          heldBy?: RelatedTo;
        
          constructor(data: Sources.ExemplarsItemData) {
            super();
            this.hide("id");
            if (data) {
              this.id = new URI(data.id);
              this.type = data.type;
              this.sectionLabel = new I18n(data.sectionLabel);
              this.label = new I18n(data.label);
              this.summary = (data.summary || []).map(
                (item: Sources.MaterialSummaryData) => new MaterialSummary(item)
              );
              this.notes = (data.notes || []).map((note: Sources.NotesItemData) => new NotesItem(note));
              this.heldBy = new RelatedTo(data.heldBy);
            }
          }
        }
        
        class MaterialGroupItem extends ROElement {
          label?: I18n;
          summary?: MaterialSummary[];
        
          constructor(data: Sources.MaterialGroupItemData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.summary = (data.summary || []).map(
                (item: Sources.MaterialSummaryData) => new MaterialSummary(item)
              );
            }
          }
        }
        
        class MaterialGroups extends ROElement {
          sectionLabel?: I18n;
          items?: MaterialGroupItem[];
        
          constructor(data: Sources.MaterialGroupsData) {
            super();
            if (data) {
              this.sectionLabel = new I18n(data.sectionLabel);
              this.items = (data.items || []).map((item: Sources.MaterialGroupItemData) => new MaterialGroupItem(item));
            }
          }
        }
        
        class MaterialSummary extends ROElement {
          label?: I18n;
          value?: MaterialSummaryValue;
          type?: string[];
        
          constructor(data: Sources.MaterialSummaryData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.value = new MaterialSummaryValue(data.value);
              this.type = data.type;
            }
          }
        }
        
        class MaterialSummaryValue extends I18n { }
        
        class NotesItem extends ROElement {
          label?: I18n;
          value?: NotesItemValue;
        
          constructor(data: Sources.NotesItemData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.value = new NotesItemValue(data.value);
            }
          }
        }
        
        class NotesItemValue extends I18n { }
        
        class RecordHistory extends ROElement {
          type?: string;
          createdLabel?: I18n;
          updatedLabel?: I18n;
          created?: string;
          updated?: string;
        
          constructor(data: Sources.RecordHistoryData) {
            super();
            if (data) {
              this.type = data.type;
              this.createdLabel = new I18n(data.createdLabel);
              this.updatedLabel = new I18n(data.updatedLabel);
              this.created = data.created;
              this.updated = data.updated;
            }
          }
        
          toHTML(lang?: string): HTMLElement {
            const container = this.createHTMLElement();
            if (this.created && this.createdLabel) {
              const createdDiv = document.createElement("div");
              createdDiv.appendChild(this.createdLabel.toHTML(lang));
              createdDiv.appendChild(this.createHTMLTextElement(this.created));
              container.appendChild(createdDiv);
            }
            if (this.updated && this.updatedLabel) {
              const updatedDiv = document.createElement("div");
              updatedDiv.appendChild(this.updatedLabel.toHTML(lang));
              updatedDiv.appendChild(this.createHTMLTextElement(this.updated));
              container.appendChild(updatedDiv);
            }
            return container;
          }
        }
        
        class ReferencesNotes extends ROElement {
          sectionLabel?: I18n;
          type?: string;
          notes?: NotesItem[];
        
          constructor(data: Sources.ReferencesNotesData) {
            super();
            if (data) {
              this.sectionLabel = new I18n(data.sectionLabel);
              this.type = data.type;
              this.notes = (data.notes || []).map((note: Sources.NotesItemData) => new NotesItem(note));
            }
          }
        }
        
        class Relationships extends ROElement {
          sectionLabel?: I18n;
          items?: RelationshipsItem[];
        
          constructor(data: Sources.RelationshipsData) {
            super();
            if (data) {
              this.sectionLabel = new I18n(data.sectionLabel);
              this.items = (data.items || []).map((item: Sources.RelationshipsItemData) => new RelationshipsItem(item));
            }
          }
        }
        
        class RelationshipsItem extends ROElement {
          role?: Role;
          relatedTo?: RelatedTo;
        
          constructor(data: Sources.RelationshipsItemData) {
            super();
            if (data) {
              this.role = new Role(data.role);
              this.relatedTo = new RelatedTo(data.relatedTo);
            }
          }
        }
        
        class RelatedTo extends ROElement {
          labelledLink?: LabelledLink;
          type?: string;
        
          constructor(data: Sources.RelatedToData) {
            super();
            if (data) {
              this.labelledLink = new LabelledLink(data.label, data.id);
              this.type = data.type;
            }
          }
        }
        
        class Role extends ROElement {
          label?: I18n;
          value?: string;
          id?: string;
        
          constructor(data: Sources.RoleData) {
            super();
            this.hide("value");
            this.hide("id");
            if (data) {
              this.label = new I18n(data.label);
              this.value = data.value;
              this.id = data.id;
            }
          }
        }
        
        class SourceItems extends ROElement {
          labelledLink?: LabelledLink;
          totalItems?: number;
          items?: Source[];
        
          constructor(data: Sources.SourceItemsData) {
            super();
            if (data) {
              this.labelledLink = new LabelledLink(data.sectionLabel, data.url);
              this.totalItems = data.totalItems;
              this.items = (data.items || []).map((item: Sources.SourceData) => new Source(item));
            }
          }
        }
        
        class SourceType extends ROElement {
          label?: I18n;
          type?: string;
        
          constructor(data: Sources.SourceTypeData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.type = data.type;
            }
          }
        }
        
        class SourceTypes extends ROElement {
          recordType?: SourceType;
          sourceType?: SourceType;
          contentTypes?: ContentType[];
        
          constructor(data: Sources.SourceTypesData) {
            super();
            if (data) {
              this.recordType = new SourceType(data.recordType);
              this.sourceType = new SourceType(data.sourceType);
              this.contentTypes = (data.contentTypes || []).map(
                (ct: Sources.ContentTypeData) => new ContentType(ct)
              );
            }
          }
        }
        
        class Subjects extends ROElement {
          sectionLabel?: I18n;
          items?: SubjectsItem[];
        
          constructor(data: Sources.SubjectsData) {
            super();
            if (data) {
              this.sectionLabel = new I18n(data.sectionLabel);
              this.items = (data.items || []).map((item: Sources.SubjectsItemData) => new SubjectsItem(item));
            }
          }
        }
        
        class SubjectsItem extends ROElement {
          id?: URI;
          type?: string[];
          label?: I18n;
          value?: string;
        
          constructor(data: Sources.SubjectsItemData) {
            super();
            if (data) {
              this.id = new URI(data.id);
              this.type = data.type;
              this.label = new I18n(data.label);
              this.value = data.value;
            }
          }
        }
        
        class SummaryItem extends ROElement {
          label?: I18n;
          value?: SummaryValue;
          type?: string[];
        
          constructor(data: Sources.SummaryItemData) {
            super();
            if (data) {
              this.label = new I18n(data.label);
              this.value = new SummaryValue(data.value);
              this.type = data.type;
            }
          }
        }
        
        class SummaryValue extends I18n { }
        
        */
    })(Works || (Works = {}));

    class SuppAElement extends ROElement {
        createHTMLElement() {
            const container = super.createHTMLElement();
            container.classList.add("suppa");
            return container;
        }
    }
    /** Renders as a link when the value is an absolute URI, otherwise as
     *  plain text — handles ETC's mixed bare-identifier / full-URI values. */
    class Reference extends SuppAElement {
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
    class Relationship extends SuppAElement {
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
    class Relationships extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.items = (data.items || []).map((item) => new Relationship(item));
            }
        }
    }
    /** Shared by Correspondence and Postcard */
    class ItemLocation extends SuppAElement {
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
    class LinkItem extends SuppAElement {
        constructor(data) {
            super();
            if (data) {
                this.link = data.uri ? new URI(data.uri, data.linkLabel) : undefined;
            }
        }
    }
    /** Shared for { citation } items — Person.literature, Performance.reviews */
    class Citation extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.citation = data.citation;
        }
    }
    /** Shared for { title } items — Correspondence.printedReproductions */
    class TitledItem extends SuppAElement {
        constructor(data) {
            super();
            if (data)
                this.title = data.title;
        }
    }

    var SuppAWork;
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

    var SuppAPerson;
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

    var SuppAPerformance;
    (function (SuppAPerformance) {
        class EvidenceItem extends SuppAElement {
            constructor(data) {
                super();
                if (data) {
                    this.reference = data.reference;
                    this.evidenceType = data.evidenceType;
                }
            }
        }
        SuppAPerformance.EvidenceItem = EvidenceItem;
        class Evidence extends SuppAElement {
            constructor(data) {
                super();
                if (data)
                    this.items = (data.items || []).map((i) => new EvidenceItem(i));
            }
        }
        SuppAPerformance.Evidence = Evidence;
        class Performance extends SuppAElement {
            constructor(data) {
                var _a;
                super();
                if (data) {
                    this.etcIdentifier = data.etcIdentifier;
                    this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
                    this.created = data.created;
                    this.updated = data.updated;
                    this.date = data.date;
                    this.relationships = new Relationships(data.relationships);
                    this.descriptionLabel = data.descriptionLabel;
                    this.description = data.description;
                    this.reviews = (((_a = data.reviews) === null || _a === void 0 ? void 0 : _a.items) || []).map((i) => new Citation(i));
                    this.evidence = new Evidence(data.evidence);
                }
            }
        }
        SuppAPerformance.Performance = Performance;
    })(SuppAPerformance || (SuppAPerformance = {}));

    var SuppACorrespondence;
    (function (SuppACorrespondence) {
        class Correspondence extends SuppAElement {
            constructor(data) {
                var _a, _b;
                super();
                if (data) {
                    this.etcIdentifier = data.etcIdentifier;
                    this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
                    this.created = data.created;
                    this.updated = data.updated;
                    this.referenceType = data.referenceType;
                    this.relationships = new Relationships(data.relationships);
                    this.date = data.date;
                    this.itemLocation = new ItemLocation(data.itemLocation);
                    this.printedReproductions = (((_a = data.printedReproductions) === null || _a === void 0 ? void 0 : _a.items) || []).map((i) => new TitledItem(i));
                    this.digitalResources = (((_b = data.digitalResources) === null || _b === void 0 ? void 0 : _b.items) || []).map((i) => new LinkItem(i));
                    this.notes = data.notes;
                }
            }
        }
        SuppACorrespondence.Correspondence = Correspondence;
    })(SuppACorrespondence || (SuppACorrespondence = {}));

    var SuppAPlace;
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

    var SuppAPostcard;
    (function (SuppAPostcard) {
        class Postcard extends SuppAElement {
            constructor(data) {
                super();
                if (data) {
                    this.etcIdentifier = data.etcIdentifier;
                    this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
                    this.created = data.created;
                    this.updated = data.updated;
                    this.postmarkDate = data.postmarkDate;
                    this.relationships = new Relationships(data.relationships);
                    this.itemLocation = new ItemLocation(data.itemLocation);
                    this.messageTranscription = data.messageTranscription;
                    this.notes = data.notes;
                }
            }
        }
        SuppAPostcard.Postcard = Postcard;
    })(SuppAPostcard || (SuppAPostcard = {}));

    var SuppARecording;
    (function (SuppARecording) {
        class AudioAccess extends SuppAElement {
            constructor(data) {
                super();
                if (data) {
                    this.audioUrl = data.audioUrl ? new URI(data.audioUrl, "Listen") : undefined;
                    this.charmRecordingId = data.charmRecordingId;
                    this.notes = data.notes;
                }
            }
        }
        SuppARecording.AudioAccess = AudioAccess;
        class Recording extends SuppAElement {
            constructor(data) {
                super();
                if (data) {
                    this.etcIdentifier = data.etcIdentifier;
                    this.derivedFrom = data.derivedFrom ? new Reference(data.derivedFrom) : undefined;
                    this.created = data.created;
                    this.updated = data.updated;
                    this.recordingDate = data.recordingDate;
                    this.recordingLabel = data.recordingLabel;
                    this.catalogueNumber = data.catalogueNumber;
                    this.format = data.format;
                    this.relationships = new Relationships(data.relationships);
                    this.audioAccess = new AudioAccess(data.audioAccess);
                }
            }
        }
        SuppARecording.Recording = Recording;
    })(SuppARecording || (SuppARecording = {}));

    class SupplementaryRenderer {
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
    class SupplementaryWorkRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppAWork.Work, transform);
        }
        renderLinkedRismRecord() {
            return true; // only Work has a reusable RISM model (Works.Work) today
        }
    }
    class SupplementaryPersonRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppAPerson.Person, transform);
        }
    }
    class SupplementaryPerformanceRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppAPerformance.Performance, transform);
        }
    }
    class SupplementaryCorrespondenceRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppACorrespondence.Correspondence, transform);
        }
    }
    class SupplementaryPlaceRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppAPlace.Place, transform);
        }
    }
    class SupplementaryPostcardRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppAPostcard.Postcard, transform);
        }
    }
    class SupplementaryRecordingRenderer extends SupplementaryRenderer {
        constructor(uri, containerId, transform) {
            super(uri, containerId, SuppARecording.Recording, transform);
        }
    }

    exports.SupplementaryCorrespondenceRenderer = SupplementaryCorrespondenceRenderer;
    exports.SupplementaryPerformanceRenderer = SupplementaryPerformanceRenderer;
    exports.SupplementaryPersonRenderer = SupplementaryPersonRenderer;
    exports.SupplementaryPlaceRenderer = SupplementaryPlaceRenderer;
    exports.SupplementaryPostcardRenderer = SupplementaryPostcardRenderer;
    exports.SupplementaryRecordingRenderer = SupplementaryRecordingRenderer;
    exports.SupplementaryRenderer = SupplementaryRenderer;
    exports.SupplementaryWorkRenderer = SupplementaryWorkRenderer;

    return exports;

})({});
