import { isItemHiddenByTag, isNpcObtainable } from "./itemVisibility.js";
import { parseDropRate } from "./utils.js";

const SLAYER_TASK_ONLY_ITEM_IDS = new Set([23490, 21257]);

function shouldHideTaskOnlyDropItem(item, npcName, filters) {
    if (!filters?.isSlayerLocked) return false;
    const itemId = Number(item?.id);
    if (!SLAYER_TASK_ONLY_ITEM_IDS.has(itemId)) return false;
    if (itemId === 23490 && npcName?.includes("Muddy chest")) return false;
    return true;
}

function normalizeRateScore(value) {
    if (!Number.isFinite(value) || value <= 0) return 0;
    return value > 1 ? 1 : value;
}

function normalizeIdArray(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.map((entry) => (entry && typeof entry === "object" ? entry.id : entry));
}

function isItemEligible(item, obtainedSet, rolledSet, filters) {
    if (!item) return false;
    if (obtainedSet.has(item.id)) return false;
    if (filters.onlyRolled && !rolledSet.has(item.id)) return false;
    if (filters.npcOnlyRolled && !rolledSet.has(item.id)) return false;
    if (isItemHiddenByTag(item)) return false;
    if (!filters.hasFlatpacks && item.tags?.includes("flatpack")) return false;
    if (!filters.hasItemsets && item.tags?.includes("itemset")) return false;
    if (filters.hideClue && item.tags?.includes("clue-reward-only")) return false;
    return true;
}

export function buildRolledSet(rolled) {
    return new Set(normalizeIdArray(rolled));
}

export function getBestDropRateValue(drops) {
    if (!drops) return 0;
    let bestValue = 0;

    if (Array.isArray(drops)) {
        for (const drop of drops) {
            if (!drop?.droprate) continue;
            const value = parseDropRate(drop.droprate);
            if (value > bestValue) {
                bestValue = value;
            }
        }
    } else if (drops?.droprate) {
        bestValue = parseDropRate(drops.droprate);
    }

    if (!Number.isFinite(bestValue) || bestValue < 0) return 0;
    return bestValue;
}

export function getDropRateLabel(drops) {
    if (!drops) return "";
    let best = null;
    let bestValue = 0;

    if (Array.isArray(drops)) {
        for (const drop of drops) {
            if (!drop?.droprate) continue;
            const value = parseDropRate(drop.droprate);
            if (value > bestValue) {
                bestValue = value;
                best = drop.droprate;
            }
        }
    } else if (drops?.droprate) {
        best = drops.droprate;
    }

    return best ? ` (${best})` : "";
}

export function formatCumulativeRate(value) {
    if (!Number.isFinite(value) || value <= 0) return "0%";
    const clamped = Math.min(value, 1);
    const percent = clamped * 100;
    if (value > 1) return ">=100%";
    return `${percent.toFixed(2)}%`;
}

export async function buildNpcDropEntries({
    items,
    obtained,
    rolled,
    player,
    filters
}) {
    const allItems = Array.isArray(items) ? items : [];
    const allObtained = normalizeIdArray(obtained);
    const allRolled = Array.isArray(rolled) ? rolled : [];
    const activeFilters = filters || {};
    const rolledSet = buildRolledSet(allRolled);
    const obtainedSet = new Set(allObtained);

    const ctx = {
        items: allItems,
        obtained: allObtained,
        rolled: allRolled,
        player,
        filters: activeFilters
    };

    const itemsByNpc = new Map();
    for (const item of allItems) {
        if (!isItemEligible(item, obtainedSet, rolledSet, activeFilters)) continue;
        const drops = item.sources?.drops;
        if (!drops) continue;
        for (const npcName of Object.keys(drops)) {
            if (shouldHideTaskOnlyDropItem(item, npcName, activeFilters)) continue;
            const list = itemsByNpc.get(npcName) || [];
            list.push(item);
            itemsByNpc.set(npcName, list);
        }
    }

    const entries = [];
    for (const [npcName, npcItems] of itemsByNpc.entries()) {
        if (!npcItems.length) continue;
        if (!(await isNpcObtainable(npcName, ctx))) continue;

        let totalRateScore = 0;
        for (const item of npcItems) {
            const drops = item.sources?.drops?.[npcName];
            if (!drops) continue;
            let bestRate = -Infinity;
            if (Array.isArray(drops)) {
                for (const drop of drops) {
                    if (!drop?.droprate) continue;
                    bestRate = Math.max(bestRate, parseDropRate(drop.droprate));
                }
            } else if (drops?.droprate) {
                bestRate = parseDropRate(drops.droprate);
            }
            totalRateScore += normalizeRateScore(bestRate);
        }

        entries.push({ npcName, items: npcItems, totalRateScore });
    }

    entries.sort((a, b) => {
        if (activeFilters.npcSortByRate) {
            const rateDiff = b.totalRateScore - a.totalRateScore;
            if (rateDiff !== 0) return rateDiff;
        }
        const countDiff = b.items.length - a.items.length;
        if (countDiff !== 0) return countDiff;
        return a.npcName.localeCompare(b.npcName);
    });

    return { entries, rolledSet };
}
