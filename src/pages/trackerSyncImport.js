const TRACKER_SYNC_SCHEMA_VERSION = 1;
const TRACKER_SYNC_SOURCE = "chanceman-tracker-sync";

export function parseTrackerSyncImportPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("Import payload is invalid");
    }

    if (payload.schemaVersion !== TRACKER_SYNC_SCHEMA_VERSION) {
        throw new Error(`Unsupported import schema: ${payload.schemaVersion ?? "unknown"}`);
    }

    if (payload.source !== TRACKER_SYNC_SOURCE) {
        throw new Error("Import payload has an unsupported source");
    }

    if (!isValidIsoDateString(payload.generatedAt)) {
        throw new Error("Import payload is missing a valid generatedAt timestamp");
    }

    const playerName = String(payload.playerName || "").trim();
    if (!playerName) {
        throw new Error("Import payload is missing playerName");
    }

    if (!isPlainObject(payload.trackerBlob)) {
        throw new Error("Import payload is missing trackerBlob");
    }

    const chancemanObtained = validateIdList(payload.chancemanObtained, "chancemanObtained");
    const chancemanRolled = validateIdList(payload.chancemanRolled, "chancemanRolled");

    return {
        schemaVersion: payload.schemaVersion,
        generatedAt: payload.generatedAt,
        source: payload.source,
        playerName,
        playerBlobText: JSON.stringify(payload.trackerBlob),
        trackerBlob: payload.trackerBlob,
        chancemanObtained,
        chancemanRolled
    };
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidIsoDateString(value) {
    if (typeof value !== "string" || !value.trim()) return false;
    return Number.isFinite(Date.parse(value));
}

function validateIdList(value, fieldName) {
    if (!Array.isArray(value)) {
        throw new Error(`Import payload is missing ${fieldName}`);
    }

    if (!value.every(isValidId)) {
        throw new Error(`Import payload has invalid ${fieldName} values`);
    }

    return [...value];
}

function isValidId(value) {
    return Number.isInteger(value) && value >= 0;
}
