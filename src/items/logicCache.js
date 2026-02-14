let rankedItemsCache = null;

export function getRankedItemsCache() {
    return rankedItemsCache;
}

export function setRankedItemsCache(nextCache) {
    rankedItemsCache = nextCache;
}

export function invalidateLogicCaches(ctx) {
    rankedItemsCache = null;
    ctx.itemAvailability = new Map();
    ctx.npcReachCache = new Map();
    ctx.npcObtainableCache = new Map();
    ctx.npcDropExclusionSet = null;
}
