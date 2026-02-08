import { canDoOtherMethod, canReachNpc } from "./itemAvailability.js";
import { NPC_DATA } from "./npcData.js";
import { capitalizeFirstLetter } from "./utils.js";

const REWARD_POOL_35_39 = "Reward pool 35\u201339 Fishing";
const HIDDEN_ITEM_TAGS = new Set(["deadman", "leagues", "gridmaster"]);
const SLAYER_ONLY_DROP_ITEMS = new Set([23490, 21257]);

function hasTag(tags, tag) {
    if (!tags) return false;
    if (Array.isArray(tags)) return tags.includes(tag);
    return tags === tag;
}

function isDropEntrySlayerLocked(entry) {
    return hasTag(entry?.tags, "slayer-task-only")
        || entry?.slayerTaskOnly
        || hasTag(entry?.tags, "superior")
        || entry?.superiorOnly;
}

export function isDropSlayerLocked(item, npcName, drops) {
    const itemId = Number(item?.id);
    if (SLAYER_ONLY_DROP_ITEMS.has(itemId)) {
        if (itemId === 23490 && npcName?.includes("Muddy chest")) {
            return false;
        }
        return true;
    }

    if (Array.isArray(drops)) {
        return drops.length > 0 && drops.every((entry) => isDropEntrySlayerLocked(entry));
    }

    return isDropEntrySlayerLocked(drops);
}

export function isItemHiddenByTag(item) {
    const tags = item?.tags;
    if (!tags) return false;
    if (Array.isArray(tags)) {
        return tags.some((tag) => HIDDEN_ITEM_TAGS.has(tag));
    }
    return HIDDEN_ITEM_TAGS.has(tags);
}

export function isSourceHiddenByFilters(source, ctx) {
    const f = ctx.filters ?? {};
    if (f.hideLMS && source?.tags?.includes("LMS")) return true;
    if (f.hideJon && source?.tags?.includes("jon")) return true;
    if (f.isIronman && (source?.tags?.includes("notForIronmen") || source?.tags?.includes("jon"))) return true;
    return false;
}

export function isNpcBlockedByFilters(npcName, ctx) {
    const npc = NPC_DATA[npcName];
    if (!npc) return true;

    const f = ctx.filters ?? {};

    if (f.isFreeToPlay && !npc.f2p) return true;
    if (!f.allowOthersHouses && npc.tags?.includes("house")) return true;
    if (!f.hasSuperiors && npc.tags?.includes("superior")) return true;
    if (f.hideClue && npc.tags?.includes("clue")) return true;
    if (f.hideBosses && npc.tags?.includes("boss")) return true;
    if (f.hideRaids && npc.tags?.includes("raid")) return true;
    if (f.hideLMS && npc.tags?.includes("LMS")) return true;
    if (f.isHunterRumourLocked && npc.tags?.includes("hunterRumour")) return true;
    if (f.isIronman && (npc.tags?.includes("notForIronmen") || npc.tags?.includes("jon"))) return true;
    if (f.hideJon && npc.tags?.includes("jon")) return true;

    if (f.isSlayerLocked) {
        if (npc.tags?.includes("slayer-task-only") || npc.tags?.includes("superior")) return true;
        if (npc.skill?.includes("Slayer")) {
            if (!ctx.player?.levels?.Slayer && ctx.player?.levels?.Slayer !== 0) return true;
            const slayerIndex = npc.skill.indexOf("Slayer");
            if (slayerIndex >= 0 && ctx.player.levels.Slayer < npc.level[slayerIndex]) return true;
        }
    }

    return false;
}

export function areNpcSkillsMet(npcName, ctx) {
    const npc = NPC_DATA[npcName];
    if (!npc) return false;

    if (npcName == REWARD_POOL_35_39) {
        const level = ctx.player?.levels?.Fishing;
        if (level === undefined || level === null) return false;
        if (level < 35 || level > 39) return false;
    }

    if (!npc.skill?.length) return true;
    if (!ctx.player?.levels) return false;

    for (let i = 0; i < npc.skill.length; i++) {
        const skill = npc.skill[i];
        const level = npc.level[i];

        if (ctx.player.levels[capitalizeFirstLetter(skill)] < level) {
            return false;
        }
    }

    return true;
}

export async function isNpcObtainable(npcName, ctx) {
    ctx.npcObtainableCache ??= new Map();
    if (ctx.npcObtainableCache.has(npcName)) {
        return ctx.npcObtainableCache.get(npcName);
    }

    if (isNpcBlockedByFilters(npcName, ctx)) {
        ctx.npcObtainableCache.set(npcName, false);
        return false;
    }
    if (!(await canReachNpc(npcName, ctx))) {
        ctx.npcObtainableCache.set(npcName, false);
        return false;
    }
    if (!areNpcSkillsMet(npcName, ctx)) {
        ctx.npcObtainableCache.set(npcName, false);
        return false;
    }

    ctx.npcObtainableCache.set(npcName, true);
    return true;
}

export async function isRuleObtainable(rule, ctx) {
    if (!rule || rule == "No requirements") return true;
    return await canDoOtherMethod(rule, ctx);
}
