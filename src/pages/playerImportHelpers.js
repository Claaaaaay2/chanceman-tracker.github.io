import { parsePlayerBlob } from "../api/playerBlobApi.js";
import { fileStore } from "../storage/fileStore.js";
import {
    saveImportedTrackerStateWithDependencies,
    validateImportedPlayerData
} from "./trackerImportPersistence.js";

export async function importPlayerData(options) {
    return validateImportedPlayerData({
        ...options,
        parsePlayerBlob
    });
}

export async function saveImportedTrackerState(options) {
    return saveImportedTrackerStateWithDependencies({
        ...options,
        parsePlayerBlob,
        store: options.store || fileStore
    });
}
