import { parseTrackerSyncImportPayload } from "./trackerSyncImport.js";

export function parseTrackerSyncBridgeParams(currentUrl) {
    const url = new URL(currentUrl, "https://chanceman-tracker.invalid");
    const bridgeUrlParam = url.searchParams.get("bridgeUrl");
    const bridgeTokenParam = url.searchParams.get("bridgeToken");

    if (bridgeUrlParam === null && bridgeTokenParam === null) {
        return null;
    }

    const bridgeToken = String(bridgeTokenParam || "").trim();
    if (!bridgeUrlParam || !bridgeToken) {
        throw new Error("Bridge params are invalid.");
    }

    let parsedBridgeUrl;
    try {
        parsedBridgeUrl = new URL(bridgeUrlParam);
    } catch (err) {
        throw new Error("Bridge params are invalid.");
    }

    if (!isAllowedBridgeUrl(parsedBridgeUrl)) {
        throw new Error("Bridge URL must be http://127.0.0.1:<port> or http://localhost:<port>.");
    }

    return {
        bridgeUrl: parsedBridgeUrl.origin,
        bridgeToken
    };
}

export async function fetchTrackerSyncPayload(options) {
    const {
        bridgeUrl,
        bridgeToken,
        fetchImpl = fetch
    } = options;

    let response;
    try {
        response = await fetchImpl(buildBridgeUrl(bridgeUrl, "payload", bridgeToken), {
            cache: "no-store"
        });
    } catch (err) {
        throw new Error("Failed to fetch tracker payload.");
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch tracker payload (${response.status}).`);
    }

    let payload;
    try {
        payload = await response.json();
    } catch (err) {
        throw new Error("Failed to parse tracker payload JSON.");
    }

    return parseTrackerSyncImportPayload(payload);
}

export async function postTrackerSyncAck(options) {
    const {
        bridgeUrl,
        bridgeToken,
        fetchImpl = fetch
    } = options;

    let response;
    try {
        response = await fetchImpl(buildBridgeUrl(bridgeUrl, "ack", bridgeToken), {
            method: "POST",
            keepalive: true
        });
    } catch (err) {
        throw new Error("Failed to acknowledge tracker import.");
    }

    if (!response.ok) {
        throw new Error(`Failed to acknowledge tracker import (${response.status}).`);
    }
}

export async function consumeTrackerSyncBridgeImport(options) {
    const {
        currentUrl,
        fetchImpl = fetch,
        onImport,
        onLocalImportSuccess,
        onAckFailure
    } = options;

    const bridgeImport = await loadTrackerSyncBridgeImport({
        currentUrl,
        fetchImpl
    });
    if (!bridgeImport) {
        return null;
    }

    await onImport?.(bridgeImport.importData);
    await onLocalImportSuccess?.(bridgeImport);

    const ackPromise = postTrackerSyncAck({
        bridgeUrl: bridgeImport.bridgeUrl,
        bridgeToken: bridgeImport.bridgeToken,
        fetchImpl
    })
        .then(() => ({ ok: true }))
        .catch((error) => {
            onAckFailure?.(error, bridgeImport);
            return {
                ok: false,
                error
            };
        });

    return {
        ...bridgeImport,
        ackPromise
    };
}

export async function loadTrackerSyncBridgeImport(options) {
    const {
        currentUrl,
        fetchImpl = fetch
    } = options;

    const bridgeParams = parseTrackerSyncBridgeParams(currentUrl);
    if (!bridgeParams) {
        return null;
    }

    const importData = await fetchTrackerSyncPayload({
        ...bridgeParams,
        fetchImpl
    });

    return {
        bridgeUrl: bridgeParams.bridgeUrl,
        bridgeToken: bridgeParams.bridgeToken,
        importData,
        sanitizedUrl: stripTrackerSyncBridgeParams(currentUrl)
    };
}

export function stripTrackerSyncBridgeParams(currentUrl) {
    const url = new URL(currentUrl, "https://chanceman-tracker.invalid");
    url.searchParams.delete("bridgeUrl");
    url.searchParams.delete("bridgeToken");
    return `${url.pathname}${url.search}${url.hash}`;
}

function buildBridgeUrl(bridgeUrl, path, bridgeToken) {
    const url = new URL(`${bridgeUrl}/${path}`);
    url.searchParams.set("bridgeToken", bridgeToken);
    return url.toString();
}

function isAllowedBridgeUrl(bridgeUrl) {
    if (bridgeUrl.protocol !== "http:") return false;
    if (bridgeUrl.username || bridgeUrl.password) return false;
    if (bridgeUrl.search || bridgeUrl.hash) return false;
    if (!bridgeUrl.port || !/^\d+$/.test(bridgeUrl.port)) return false;
    if (bridgeUrl.pathname !== "/" && bridgeUrl.pathname !== "") return false;
    return bridgeUrl.hostname === "127.0.0.1" || bridgeUrl.hostname === "localhost";
}
