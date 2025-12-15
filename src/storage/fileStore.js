import { loadFromDB, saveToDB } from "./fileStoreHelpers.js";

let memory = {
    rolled: null,
    unlocked: null,
    filters: {
        search: "",
        hideRolled: true,
        onlyUnlocked: false,
        onlyObtainable: false,
        hideClue: true
    }
};

// ---- Public API ----
export const fileStore = {
    rolled: null,
    unlocked: null,
    items: null,

    async ensureItemsLoaded() {
        if (!this.items) {
            this.items = await fetch("/data/items.json").then(r => r.json());
        }
    },

    async init() {
        memory.rolled = await loadFromDB("rolled");
        memory.unlocked = await loadFromDB("unlocked");

        const loadedFilters = await loadFromDB("filters");
        if (loadedFilters) {
            memory.filters = loadedFilters;
        }
    },

    async setRolled(json) {
        memory.rolled = json;
        await saveToDB("rolled", json);
    },

    async setUnlocked(json) {
        memory.unlocked = json;
        await saveToDB("unlocked", json);
    },

    async setFilters(filters) {
        memory.filters = filters;
        await saveToDB("filters", filters);
    },

    get rolled() {
        return memory.rolled;
    },

    get unlocked() {
        return memory.unlocked;
    },

    get filters() {
        return memory.filters;
    }
};
