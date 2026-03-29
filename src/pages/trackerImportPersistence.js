export function readPlayerBlobText(options) {
    const {
        playerBlobInput,
        playerBlobText
    } = options;

    if (playerBlobText !== undefined && playerBlobText !== null) {
        return String(playerBlobText).trim();
    }

    return String(playerBlobInput?.value || "").trim();
}

export function validateImportedPlayerData(options) {
    const {
        playerBlobInput,
        playerBlobText,
        parsePlayerBlob,
        setStatus
    } = options;

    const blobText = readPlayerBlobText({
        playerBlobInput,
        playerBlobText
    });
    if (!blobText) {
        throw new Error("Paste a Chanceman Tracker Sync blob.");
    }

    setStatus?.("Importing player blob...");
    return parsePlayerBlob(blobText);
}

export async function saveImportedTrackerStateWithDependencies(options) {
    const {
        obtained,
        rolled,
        store
    } = options;

    const player = validateImportedPlayerData(options);

    if (typeof store.applyImportedTrackerState === "function") {
        await store.applyImportedTrackerState({
            rolled,
            obtained,
            player
        });
        return player;
    }

    // Fallback for stores that do not provide a transactional import write path.
    // This path cannot guarantee rollback across multiple keys if a later write fails.
    if (rolled !== undefined) {
        await store.setRolled(rolled);
    }

    if (obtained !== undefined) {
        await store.setObtained(obtained);
    }

    await store.setPlayer(player);
    return player;
}
