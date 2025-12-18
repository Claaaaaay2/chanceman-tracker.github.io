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
    },
    player: null
};

// ---- Public API ----
export const fileStore = {
    rolled: null,
    unlocked: null,
    items: null,
    player: null,

    async ensureItemsLoaded() {
        if (!this.items) {
            this.items = await fetch("/data/items.json").then(r => r.json());
        }
    },

    async init() {
        memory.rolled = await loadFromDB("rolled");
        memory.unlocked = await loadFromDB("unlocked");
        memory.player = await loadFromDB("player");

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

    async setPlayer(player) {
        memory.player = player;
        await saveToDB("player", player);
    },

    get rolled() {
        return memory.rolled;
    },

    get unlocked() {
        return memory.unlocked;
    },

    get filters() {
        return memory.filters;
    },

    get player() {
        return memory.player;
    }
};
