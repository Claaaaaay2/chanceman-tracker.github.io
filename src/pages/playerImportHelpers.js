import { parsePlayerBlob } from "../api/playerBlobApi.js";

export async function importPlayerData(options) {
    const {
        playerBlobInput,
        setStatus
    } = options;

    const blobText = readPlayerBlobText(playerBlobInput);
    if (!blobText) {
        throw new Error("Paste a Chanceman Tracker Sync blob.");
    }

    setStatus?.("Importing player blob...");
    return parsePlayerBlob(blobText);
}

function readPlayerBlobText(playerBlobInput) {
    return String(playerBlobInput?.value || "").trim();
}
