import { loadFromDB, saveToDB } from "./fileStoreHelpers.js";

let memory = {
    obtained: null,
    rolled: null,
    filters: {
        search: "",
        hideObtained: true,
        onlyRolled: false,
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
    obtained: null,
    rolled: null,
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
        memory.obtained = await loadFromDB("rolled");
        memory.rolled = await loadFromDB("unlocked");
        memory.player = await loadFromDB("player");

        const loadedFilters = await loadFromDB("filters");
        if (loadedFilters) {
            const normalizedFilters = { ...memory.filters, ...loadedFilters };
            if (normalizedFilters.hideObtained === undefined && loadedFilters.hideRolled !== undefined) {
                normalizedFilters.hideObtained = loadedFilters.hideRolled;
            }
            if (normalizedFilters.onlyRolled === undefined && loadedFilters.onlyUnlocked !== undefined) {
                normalizedFilters.onlyRolled = loadedFilters.onlyUnlocked;
            }
            delete normalizedFilters.hideRolled;
            delete normalizedFilters.onlyUnlocked;
            memory.filters = normalizedFilters;
        }
    },

    async setObtained(json) {
        memory.obtained = json;
        await saveToDB("rolled", json);
    },

    async setRolled(json) {
        memory.rolled = json;
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

    get obtained() {
        return memory.obtained;
    },

    get rolled() {
        return memory.rolled;
    },

    get filters() {
        return memory.filters;
    },

    get player() {
        return memory.player;
    }
};
