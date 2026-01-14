import { loadFromDB, saveToDB } from "./fileStoreHelpers.js";

let memory = {
    rolled: null,
    unlocked: null,
    filters: {
        search: "",
        hideRolled: true,
        onlyUnlocked: false,
        hideClue: true,
        allowOthersHouses: false,
        hasFlatpacks: true,
        hasItemsets: true,
        hasSuperiors: false,
        isIronman: false,
        hideBosses: false,
        hideRaids: false,
        isSlayerLocked: false,
        isHunterRumourLocked: false,
        hideLMS: false,
        hideJon: false,
        isFreeToPlay: false,
        overrideWoodcutting: false,
        overrideMining: false,
        overrideFishing: false,
        overrideCooking: false,
        overrideFletching: false,
        overrideCrafting: false,
        overrideConstruction: false,
        hunterRumoursCompleted: 0,
        hideCompletedQuests: false,
        hideIncompletableQuests: false,
        questSearch: ""
    },
    player: null
};

// ---- Public API ----
export const fileStore = {
    rolled: null,
    unlocked: null,
    items: null,
    itemsSource: null,
    player: null,

    async ensureItemsLoaded() {
        const isF2P = this.filters?.isFreeToPlay;
        const url = isF2P ? "/data/items_f2p.json" : "/data/items.json";
        if (!this.items || this.itemsSource != url) {
            this.items = await fetch(url).then(r => r.json());
            this.itemsSource = url;
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
