import test from "node:test";
import assert from "node:assert/strict";

import {
    consumeGithubPagesRedirect,
    GITHUB_PAGES_REDIRECT_KEY
} from "./githubPagesRedirect.js";

function createSessionStorage(initialValue) {
    const store = new Map();
    const removed = [];

    if (initialValue !== undefined) {
        store.set(GITHUB_PAGES_REDIRECT_KEY, initialValue);
    }

    return {
        removed,
        getItem(key) {
            return store.has(key) ? store.get(key) : null;
        },
        removeItem(key) {
            removed.push(key);
            store.delete(key);
        }
    };
}

test("consumes a preserved GitHub Pages redirect including query string and hash", () => {
    const sessionStorageLike = createSessionStorage("/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A1234&bridgeToken=abc#done");

    const redirect = consumeGithubPagesRedirect({
        sessionStorageLike,
        locationLike: {
            pathname: "/",
            search: "",
            hash: ""
        }
    });

    assert.equal(redirect, "/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A1234&bridgeToken=abc#done");
    assert.deepEqual(sessionStorageLike.removed, [GITHUB_PAGES_REDIRECT_KEY]);
});

test("consumes a preserved redirect from the current query string", () => {
    const sessionStorageLike = createSessionStorage();

    const redirect = consumeGithubPagesRedirect({
        sessionStorageLike,
        locationLike: {
            pathname: "/",
            search: "?redirect=%2Fupload%3FbridgeUrl%3Dhttp%253A%252F%252F127.0.0.1%253A1234%26bridgeToken%3Dabc",
            hash: ""
        }
    });

    assert.equal(redirect, "/upload?bridgeUrl=http%3A%2F%2F127.0.0.1%3A1234&bridgeToken=abc");
    assert.deepEqual(sessionStorageLike.removed, []);
});

test("ignores missing redirect state", () => {
    const sessionStorageLike = createSessionStorage();

    const redirect = consumeGithubPagesRedirect({
        sessionStorageLike,
        locationLike: {
            pathname: "/",
            search: "",
            hash: ""
        }
    });

    assert.equal(redirect, null);
    assert.deepEqual(sessionStorageLike.removed, []);
});

test("ignores unsafe redirect values", () => {
    const sessionStorageLike = createSessionStorage("//evil.example/path");

    const redirect = consumeGithubPagesRedirect({
        sessionStorageLike,
        locationLike: {
            pathname: "/",
            search: "",
            hash: ""
        }
    });

    assert.equal(redirect, null);
    assert.deepEqual(sessionStorageLike.removed, [GITHUB_PAGES_REDIRECT_KEY]);
});

test("ignores redirect values that already match the current location", () => {
    const sessionStorageLike = createSessionStorage("/upload?foo=bar#hash");

    const redirect = consumeGithubPagesRedirect({
        sessionStorageLike,
        locationLike: {
            pathname: "/upload",
            search: "?foo=bar",
            hash: "#hash"
        }
    });

    assert.equal(redirect, null);
    assert.deepEqual(sessionStorageLike.removed, [GITHUB_PAGES_REDIRECT_KEY]);
});
