const HIGHLIGHT_WINDOW_MS = 30000;
const newAt = new Map();
const changedAt = new Map();
let lastVisible = new Set();
const lastSignature = new Map();

export function markNewItems(currentIds) {
    const now = Date.now();
    if (lastVisible.size === 0) {
        lastVisible = new Set(currentIds);
        return;
    }
    for (const id of currentIds) {
        if (!lastVisible.has(id)) {
            newAt.set(id, now);
        }
    }
    lastVisible = new Set(currentIds);
}

export function markSourceSignature(itemId, signature) {
    const now = Date.now();
    const prev = lastSignature.get(itemId);
    if (prev !== undefined && prev !== signature) {
        changedAt.set(itemId, now);
    }
    lastSignature.set(itemId, signature);
}

function isRecent(map, itemId) {
    const timestamp = map.get(itemId);
    return Boolean(timestamp && Date.now() - timestamp <= HIGHLIGHT_WINDOW_MS);
}

export function isItemNew(itemId) {
    return isRecent(newAt, itemId);
}

export function isItemSourcesChanged(itemId) {
    return isRecent(changedAt, itemId);
}

export function getHighlightClasses(itemId) {
    const classes = [];
    if (isItemNew(itemId)) classes.push("is-new");
    if (isItemSourcesChanged(itemId)) classes.push("is-sources-changed");
    return classes.join(" ");
}
