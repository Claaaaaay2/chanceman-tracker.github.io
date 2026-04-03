import { loadFromDB, saveManyToDB, saveToDB } from "./fileStoreHelpers.js";

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
        hideBosses: false,
        hideRaids: false,
        isSlayerLocked: false,
        hideUnreachableSlayerMasters: true,
        hideUnassignableSlayerTasks: false,
        ignoreSlayerMasterCombatLevel: false,
        isHunterRumourLocked: false,
        hideLMS: false,
        hideJon: false,
        isFreeToPlay: false,
        hideSourcelessItems: false,
        countSkillBoosts: false,
        overrideWoodcutting: false,
        overrideMining: false,
        overrideFishing: false,
        overrideCooking: false,
        overrideFarming: false,
        overrideFletching: false,
        overrideCrafting: false,
        overrideConstruction: false,
        overrideSmithing: false,
        highlightChanges: false,
        showSectionCounts: false,
        itemSortByDroprate: true,
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
        hideIncompletableDiaries: false,
        hasDoneEasterEvent: false,
        npcDropExclusions: []
    },
    player: null,
    playerBlobText: null,
};

let pendingFilterSave = Promise.resolve();

// ---- Public API ----
export const fileStore = {
    obtained: null,
    rolled: null,
    items: null,
    itemsSource: null,
    itemMeta: null,
    player: null,
    playerBlobText: null,

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
        memory.playerBlobText = await loadFromDB("playerBlobText");

        const loadedFilters = await loadFromDB("filters");
        if (loadedFilters) {
            const normalizedFilters = { ...memory.filters, ...loadedFilters };
            if (normalizedFilters.hideObtained === undefined && loadedFilters.hideRolled !== undefined) {
                normalizedFilters.hideObtained = loadedFilters.hideRolled;
            }
            if (normalizedFilters.onlyRolled === undefined && loadedFilters.onlyUnlocked !== undefined) {
                normalizedFilters.onlyRolled = loadedFilters.onlyUnlocked;
            }
            if (loadedFilters.itemSortByDroprate === undefined && loadedFilters.otherDropsSortByDroprate !== undefined) {
                normalizedFilters.itemSortByDroprate = loadedFilters.otherDropsSortByDroprate;
            }
            delete normalizedFilters.hideRolled;
            delete normalizedFilters.onlyUnlocked;
            delete normalizedFilters.otherDropsSortByDroprate;
            delete normalizedFilters.hasSuperiors;
            delete normalizedFilters.isIronman;
            delete normalizedFilters.hasEasyCasCompleted;
            delete normalizedFilters.hasAntiDragonShield;
            delete normalizedFilters.hazeelCultLocked;
            delete normalizedFilters.overrideBarbarianFiremaking1ForWaterfiends;
            delete normalizedFilters.hunterRumoursCompleted;
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

    async applyImportedTrackerState(nextState) {
        const {
            rolled,
            obtained,
            player,
            playerBlobText
        } = nextState;

        const entries = [];
        if (rolled !== undefined) {
            entries.push(["unlocked", rolled]);
        }
        if (obtained !== undefined) {
            entries.push(["rolled", obtained]);
        }
        entries.push(["player", player]);
        if (playerBlobText !== undefined) {
            entries.push(["playerBlobText", playerBlobText]);
        }

        // Persist all imported keys in one IndexedDB transaction so the DB is not left half-updated.
        await saveManyToDB(entries);

        if (rolled !== undefined) {
            memory.rolled = rolled;
        }
        if (obtained !== undefined) {
            memory.obtained = obtained;
        }
        memory.player = player;
        if (playerBlobText !== undefined) {
            memory.playerBlobText = playerBlobText;
        }
    },

    async setFilters(filters) {
        const normalizedFilters = { ...filters };
        delete normalizedFilters.otherDropsSortByDroprate;
        delete normalizedFilters.hasSuperiors;
        delete normalizedFilters.isIronman;
        delete normalizedFilters.hasEasyCasCompleted;
        delete normalizedFilters.hasAntiDragonShield;
        delete normalizedFilters.hazeelCultLocked;
        delete normalizedFilters.overrideBarbarianFiremaking1ForWaterfiends;
        delete normalizedFilters.hunterRumoursCompleted;
        memory.filters = normalizedFilters;
        pendingFilterSave = pendingFilterSave
            .catch(() => {})
            .then(() => saveToDB("filters", normalizedFilters));
        await pendingFilterSave;
    },


    async setPlayer(player) {
        memory.player = player;
        await saveToDB("player", player);
    },

    async setPlayerBlobText(playerBlobText) {
        memory.playerBlobText = playerBlobText;
        await saveToDB("playerBlobText", playerBlobText);
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
    },

    get playerBlobText() {
        return memory.playerBlobText;
    }
};
