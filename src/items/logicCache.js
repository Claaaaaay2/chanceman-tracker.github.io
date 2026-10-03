let rankedItemsCache = null;
let rankedItemsCacheKey = null;

function getRankedItemsCacheKey(ctx) {
    return JSON.stringify({
        allowOthersHouses: Boolean(ctx?.filters?.allowOthersHouses),
    });
}

export function getRankedItemsCache(ctx) {
    if (!rankedItemsCache) {
        return null;
    }

    const currentKey = getRankedItemsCacheKey(ctx);

    if (rankedItemsCacheKey !== currentKey) {
        return null;
    }

    return rankedItemsCache;
}

export function setRankedItemsCache(nextCache, ctx) {
    rankedItemsCache = nextCache;
    rankedItemsCacheKey = getRankedItemsCacheKey(ctx);
}

export function invalidateLogicCaches(ctx) {
    rankedItemsCache = null;
    rankedItemsCacheKey = null;

    ctx.itemAvailability = new Map();
    ctx.npcReachCache = new Map();
    ctx.npcObtainableCache = new Map();
    ctx.npcDropExclusionSet = null;
}