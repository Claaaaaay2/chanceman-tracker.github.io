import test from "node:test";
import assert from "node:assert/strict";

import {
    saveImportedTrackerStateWithDependencies
} from "./trackerImportPersistence.js";

function createStoreSpy() {
    const calls = [];

    return {
        calls,
        store: {
            async setRolled(value) {
                calls.push(["rolled", value]);
            },
            async setObtained(value) {
                calls.push(["obtained", value]);
            },
            async setPlayer(value) {
                calls.push(["player", value]);
            },
            async setPlayerBlobText(value) {
                calls.push(["playerBlobText", value]);
            }
        }
    };
}

test("no partial storage writes occur when player blob validation fails", async () => {
    const { calls, store } = createStoreSpy();

    await assert.rejects(
        () => saveImportedTrackerStateWithDependencies({
            rolled: [1],
            obtained: [2],
            playerBlobText: "{\"bad\":true}",
            parsePlayerBlob() {
                throw new Error("Player blob is invalid");
            },
            store
        }),
        /Player blob is invalid/
    );

    assert.deepEqual(calls, []);
});

test("manual upload path still works", async () => {
    const { calls, store } = createStoreSpy();
    const expectedPlayer = { name: "AccountName" };

    const result = await saveImportedTrackerStateWithDependencies({
        rolled: [10],
        obtained: [20],
        playerBlobInput: {
            value: "{\"schemaVersion\":1}"
        },
        parsePlayerBlob(blobText) {
            assert.equal(blobText, "{\"schemaVersion\":1}");
            return expectedPlayer;
        },
        store
    });

    assert.equal(result, expectedPlayer);
    assert.deepEqual(calls, [
        ["rolled", [10]],
        ["obtained", [20]],
        ["player", expectedPlayer],
        ["playerBlobText", "{\"schemaVersion\":1}"]
    ]);
});

test("transactional store path avoids partial writes when the batch write fails", async () => {
    const calls = [];

    await assert.rejects(
        () => saveImportedTrackerStateWithDependencies({
            rolled: [10],
            obtained: [20],
            playerBlobText: "{\"schemaVersion\":1}",
            parsePlayerBlob() {
                return { name: "AccountName" };
            },
            store: {
                async applyImportedTrackerState(value) {
                    calls.push(["batch", value]);
                    throw new Error("IndexedDB transaction aborted");
                },
                async setRolled() {
                    calls.push(["rolled"]);
                },
                async setObtained() {
                    calls.push(["obtained"]);
                },
                async setPlayer() {
                    calls.push(["player"]);
                }
            }
        }),
        /IndexedDB transaction aborted/
    );

    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "batch");
    assert.equal(calls[0][1].playerBlobText, "{\"schemaVersion\":1}");
});

test("fallback sequential store writes can still fail partway through when no batch API exists", async () => {
    const calls = [];

    await assert.rejects(
        () => saveImportedTrackerStateWithDependencies({
            rolled: [10],
            obtained: [20],
            playerBlobText: "{\"schemaVersion\":1}",
            parsePlayerBlob() {
                return { name: "AccountName" };
            },
            store: {
                async setRolled(value) {
                    calls.push(["rolled", value]);
                },
                async setObtained(value) {
                    calls.push(["obtained", value]);
                    throw new Error("setObtained failed");
                },
                async setPlayer(value) {
                    calls.push(["player", value]);
                },
                async setPlayerBlobText(value) {
                    calls.push(["playerBlobText", value]);
                }
            }
        }),
        /setObtained failed/
    );

    assert.deepEqual(calls, [
        ["rolled", [10]],
        ["obtained", [20]]
    ]);
});
