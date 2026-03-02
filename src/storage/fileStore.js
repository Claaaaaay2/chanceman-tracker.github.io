import { loadFromDB, saveToDB } from "./fileStoreHelpers.js";

let memory = {
    obtained: null,
    rolled: null,
    filters: {
        search: "",
        hideObtained: true,
        onlyRolled: false,
        hideUnobtainable: true,
        hideClue: true,
        allowOthersHouses: false,
        hasFlatpacks: true,
        hasItemsets: true,
        hasSuperiors: false,
        isIronman: false,
        hideBosses: false,
        hideRaids: false,
        isSlayerLocked: false,
        hideUnreachableSlayerMasters: true,
        hideUnassignableSlayerTasks: false,
        ignoreSlayerMasterCombatLevel: false,
        overrideBarbarianFiremaking1ForWaterfiends: false,
        isHunterRumourLocked: false,
        hideLMS: false,
        hideJon: false,
        isFreeToPlay: false,
        hideSourcelessItems: false,
        hasEasyCasCompleted: false,
        countSkillBoosts: false,
        otherDropsSortByDroprate: true,
        overrideWoodcutting: false,
        overrideMining: false,
        overrideFishing: false,
        overrideCooking: false,
        overrideFarming: false,
        overrideFletching: false,
        overrideCrafting: false,
        overrideConstruction: false,
        overrideSmithing: false,
        hunterRumoursCompleted: 0,
        highlightChanges: false,
        showSectionCounts: false,
        hideCompletedQuests: false,
        hideIncompletableQuests: false,
        questSearch: "",
        diceSelectedItemId: null,
        diceSelectedNpcName: "",
        clueSearch: "",
        npcSearch: "",
        npcSortByRate: false,
        npcOnlyRolled: false,
        npcCollapseDrops: false,
        hideCompletableClues: false,
        hideIncompletableClues: false,
        hideCompletedDiaries: false,
        showOnlyCompletableTiers: false,
        hazeelCultLocked: false,
        hideIncompletableDiaries: false,
        hasDoneEasterEvent: false,
        npcDropExclusions: []
    },
    player: null,
};

// ---- Public API ----
export const fileStore = {
    obtained: null,
    rolled: null,
    items: null,
    itemsSource: null,
    itemMeta: null,
    player: null,

    async ensureItemsLoaded() {
        const isF2P = this.filters?.isFreeToPlay;
        const url = isF2P ? "/data/items_f2p.json" : "/data/items.json";
        if (!this.items || this.itemsSource != url) {
            this.items = await fetch(url).then(r => r.json());
            this.itemsSource = url;
            this.itemMeta = new Map(
                (this.items || []).map((item) => {
                    const tags = item?.tags
                        ? (Array.isArray(item.tags) ? item.tags : [item.tags])
                        : [];
                    const tagsSet = new Set(tags);
                    const sources = item?.sources || {};
                    const drops = sources.drops || null;
                    const shops = sources.shops || null;
                    const spawns = sources.spawns || null;
                    const other = sources.other || null;
                    const hasEntries = (value) => value && typeof value === "object" && Object.keys(value).length > 0;
                    return [
                        item.id,
                        {
                            nameLower: String(item?.name || "").toLowerCase(),
                            tagsSet,
                            hasFlatpack: tagsSet.has("flatpack"),
                            hasItemset: tagsSet.has("itemset"),
                            isClueRewardOnly: tagsSet.has("clue-reward-only"),
                            hasAnySource: hasEntries(drops) || hasEntries(shops) || hasEntries(spawns) || hasEntries(other),
                            dropNpcs: drops ? Object.keys(drops) : [],
                            otherSources: other ? Object.values(other) : []
                        }
                    ];
                })
            );
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
