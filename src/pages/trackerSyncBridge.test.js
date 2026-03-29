import test from "node:test";
import assert from "node:assert/strict";

import { consumeTrackerSyncBridgeImport } from "./trackerSyncBridge.js";

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
        chancemanObtained: [11, 22],
        chancemanRolled: [33, 44]
    };
}

test("successful bridge import from valid bridgeUrl and bridgeToken", async () => {
    const calls = [];
    const imported = [];
    const localSuccesses = [];

    const result = await consumeTrackerSyncBridgeImport({
        currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123&foo=bar",
        fetchImpl: async (url, options = {}) => {
            calls.push({ url, options });
            if (url.includes("/payload?")) {
                return {
                    ok: true,
                    json: async () => createValidPayload()
                };
            }

            return {
                ok: true,
                json: async () => ({})
            };
        },
        onImport: async (importData) => {
            imported.push(importData);
        },
        onLocalImportSuccess: ({ sanitizedUrl }) => {
            localSuccesses.push(sanitizedUrl);
        }
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "http://127.0.0.1:51234/payload?bridgeToken=abc123");
    assert.deepEqual(calls[0].options, { cache: "no-store" });
    assert.equal(calls[1].url, "http://127.0.0.1:51234/ack?bridgeToken=abc123");
    assert.deepEqual(calls[1].options, { method: "POST", keepalive: true });
    assert.equal(imported.length, 1);
    assert.equal(localSuccesses[0], "/upload?foo=bar");
    assert.equal(result?.sanitizedUrl, "/upload?foo=bar");
    assert.deepEqual(await result?.ackPromise, { ok: true });
});

test("invalid bridgeUrl is rejected", async () => {
    await assert.rejects(
        () => consumeTrackerSyncBridgeImport({
            currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=https%3A%2F%2Fevil.example&bridgeToken=abc123",
            fetchImpl: async () => {
                throw new Error("should not fetch");
            }
        }),
        /Bridge URL must be http:\/\/127\.0\.0\.1:<port> or http:\/\/localhost:<port>\./
    );
});

test("payload fetch failure is surfaced cleanly", async () => {
    await assert.rejects(
        () => consumeTrackerSyncBridgeImport({
            currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123",
            fetchImpl: async () => ({
                ok: false,
                status: 502,
                json: async () => ({})
            })
        }),
        /Failed to fetch tracker payload \(502\)\./
    );
});

test("invalid payload shape or schema is rejected", async () => {
    await assert.rejects(
        () => consumeTrackerSyncBridgeImport({
            currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123",
            fetchImpl: async (url) => ({
                ok: true,
                json: async () => url.includes("/payload?")
                    ? { ...createValidPayload(), schemaVersion: 2 }
                    : {}
            })
        }),
        /Unsupported import schema: 2/
    );
});

test("ack failure is surfaced cleanly", async () => {
    const warnings = [];
    const steps = [];

    const result = await consumeTrackerSyncBridgeImport({
        currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123",
        fetchImpl: async (url) => {
            if (url.includes("/payload?")) {
                return {
                    ok: true,
                    json: async () => createValidPayload()
                };
            }

            return {
                ok: false,
                status: 500,
                json: async () => ({})
            };
        },
        onImport: async () => {
            steps.push("import");
        },
        onLocalImportSuccess: ({ sanitizedUrl }) => {
            steps.push(`success:${sanitizedUrl}`);
        },
        onAckFailure: (error) => {
            warnings.push(error.message);
            steps.push("ack-failed");
        }
    });

    assert.ok(result);
    assert.deepEqual(steps.slice(0, 2), ["import", "success:/upload"]);
    const ackResult = await result.ackPromise;
    assert.equal(ackResult.ok, false);
    assert.match(ackResult.error.message, /Failed to acknowledge tracker import \(500\)\./);
    assert.deepEqual(warnings, ["Failed to acknowledge tracker import (500)."]);
});

test("bridge params are stripped from the URL on successful local import even if ack fails", async () => {
    const sanitizedUrls = [];

    const result = await consumeTrackerSyncBridgeImport({
        currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123&foo=bar",
        fetchImpl: async (url) => {
            if (url.includes("/payload?")) {
                return {
                    ok: true,
                    json: async () => createValidPayload()
                };
            }

            return {
                ok: false,
                status: 503,
                json: async () => ({})
            };
        },
        onImport: async () => {},
        onLocalImportSuccess: ({ sanitizedUrl }) => {
            sanitizedUrls.push(sanitizedUrl);
        }
    });

    assert.equal(result?.sanitizedUrl, "/upload?foo=bar");
    assert.deepEqual(sanitizedUrls, ["/upload?foo=bar"]);
    assert.equal((await result.ackPromise).ok, false);
});

test("no hard failure is thrown solely because ack fails after successful save", async () => {
    const result = await consumeTrackerSyncBridgeImport({
        currentUrl: "https://chanceman-tracker.github.io/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A51234&bridgeToken=abc123",
        fetchImpl: async (url) => {
            if (url.includes("/payload?")) {
                return {
                    ok: true,
                    json: async () => createValidPayload()
                };
            }

            return {
                ok: false,
                status: 500,
                json: async () => ({})
            };
        },
        onImport: async () => {},
        onLocalImportSuccess: async () => {}
    });

    assert.ok(result);
    assert.equal((await result.ackPromise).ok, false);
});
