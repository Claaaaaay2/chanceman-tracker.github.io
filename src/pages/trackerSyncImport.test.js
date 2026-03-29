import test from "node:test";
import assert from "node:assert/strict";

import { parseTrackerSyncImportPayload } from "./trackerSyncImport.js";

function createValidPayload() {
    return {
        schemaVersion: 1,
        generatedAt: "2026-03-29T08:15:00.000Z",
        source: "chanceman-tracker-sync",
        playerName: "AccountName",
        trackerBlob: {
            schemaVersion: 1,
            player: {
                name: "AccountName"
            }
        },
        chancemanObtained: [1, 2, 3],
        chancemanRolled: [4, 5, 6]
    };
}

test("valid payload is normalized", () => {
    const payload = createValidPayload();
    const result = parseTrackerSyncImportPayload(payload);

    assert.deepEqual(result.chancemanObtained, payload.chancemanObtained);
    assert.deepEqual(result.chancemanRolled, payload.chancemanRolled);
    assert.equal(result.playerBlobText, JSON.stringify(payload.trackerBlob));
});

test("wrong schema version is rejected", () => {
    assert.throws(
        () => parseTrackerSyncImportPayload({
            ...createValidPayload(),
            schemaVersion: 2
        }),
        /Unsupported import schema: 2/
    );
});

test("missing required fields are rejected", () => {
    const payload = createValidPayload();
    delete payload.trackerBlob;

    assert.throws(
        () => parseTrackerSyncImportPayload(payload),
        /Import payload is missing trackerBlob/
    );
});
