import { SuppAElement, Relationships, Reference } from "./suppa-common";
import { URI } from "./base";
export var SuppARecording;
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
//# sourceMappingURL=suppa-recording.js.map