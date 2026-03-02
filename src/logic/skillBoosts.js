import { capitalizeFirstLetter } from "./utils.js";

const boostSummaryCache = new WeakMap();

function normalizeSkillName(skill) {
    const normalized = capitalizeFirstLetter(String(skill || "").trim());
    return normalized || "";
}

function getPlayerLevel(levelsMap, skill) {
    if (!levelsMap) return null;
    const key = String(skill || "").toLowerCase();
    if (levelsMap.has(key)) return levelsMap.get(key);
    return null;
}

function buildLevelsMap(ctx) {
    const levels = ctx?.player?.levels;
    if (!levels || typeof levels !== "object") return null;
    return new Map(Object.entries(levels).map(([key, value]) => [String(key).toLowerCase(), value]));
}

export function resolveBoostAmount(boost, levelsMap) {
    const amount = boost?.amount;
    if (typeof amount === "number") {
        return { value: amount, known: true };
    }
    if (amount && typeof amount === "object" && amount.type === "tiered") {
        const basedOn = amount.basedOn || boost?.skill;
        const level = getPlayerLevel(levelsMap, basedOn);
        if (level === null || level === undefined) {
            return { value: null, known: false };
        }
        const tiers = Array.isArray(amount.tiers) ? amount.tiers : [];
        for (const tier of tiers) {
            if (level >= tier.min && level <= tier.max) {
                return { value: tier.amount, known: true };
            }
        }
        return { value: null, known: false };
    }
    return { value: null, known: false };
}

function computeBoostSummary(ctx) {
    const items = Array.isArray(ctx?.items) ? ctx.items : [];
    const obtained = Array.isArray(ctx?.obtained) ? ctx.obtained : [];
    const rolled = Array.isArray(ctx?.rolled) ? ctx.rolled : [];
    if (!items.length || !obtained.length || !rolled.length) {
        return new Map();
    }

    const rolledSet = new Set(rolled);
    const unlockedSet = new Set();
    for (const id of obtained) {
        if (rolledSet.has(id)) {
            unlockedSet.add(id);
        }
    }
    if (!unlockedSet.size) {
        return new Map();
    }

    const levelsMap = buildLevelsMap(ctx);
    const boostsBySkill = new Map();

    for (const item of items) {
        if (!unlockedSet.has(item.id)) continue;
        if (!Array.isArray(item.boosts)) continue;

        for (const boost of item.boosts) {
            const skill = normalizeSkillName(boost?.skill);
            if (!skill) continue;

            const amountInfo = resolveBoostAmount(boost, levelsMap);
            const amount = amountInfo.value;
            if (!amountInfo.known || typeof amount !== "number" || amount <= 0) continue;

            const existing = boostsBySkill.get(skill) ?? 0;
            if (amount > existing) {
                boostsBySkill.set(skill, amount);
            }
        }
    }

    return boostsBySkill;
}

function getBoostSummary(ctx) {
    if (!ctx || typeof ctx !== "object") {
        return new Map();
    }

    const cached = boostSummaryCache.get(ctx);
    const itemsRef = ctx.items;
    const obtainedRef = ctx.obtained;
    const rolledRef = ctx.rolled;
    const levelsRef = ctx?.player?.levels;

    if (
        cached
        && cached.itemsRef === itemsRef
        && cached.obtainedRef === obtainedRef
        && cached.rolledRef === rolledRef
        && cached.levelsRef === levelsRef
    ) {
        return cached.summary;
    }

    const summary = computeBoostSummary(ctx);
    boostSummaryCache.set(ctx, {
        itemsRef,
        obtainedRef,
        rolledRef,
        levelsRef,
        summary
    });
    return summary;
}

function getBaseSkillLevel(ctx, skill) {
    const normalizedSkill = normalizeSkillName(skill);
    if (!normalizedSkill) return null;
    const baseLevel = ctx?.player?.levels?.[normalizedSkill];
    return typeof baseLevel === "number" ? baseLevel : null;
}

export function getSkillBoostAmount(ctx, skill) {
    if (!ctx?.filters?.countSkillBoosts) return 0;
    const normalizedSkill = normalizeSkillName(skill);
    if (!normalizedSkill) return 0;
    const summary = getBoostSummary(ctx);
    return summary.get(normalizedSkill) ?? 0;
}

export function getEffectiveSkillLevel(ctx, skill) {
    const baseLevel = getBaseSkillLevel(ctx, skill);
    if (baseLevel === null) return null;
    return baseLevel + getSkillBoostAmount(ctx, skill);
}

export function getBoostedRequirementLabel(ctx, skill, requiredLevel) {
    if (!ctx?.filters?.countSkillBoosts) return null;
    if (!Number.isFinite(requiredLevel)) return null;

    const normalizedSkill = normalizeSkillName(skill);
    if (!normalizedSkill) return null;

    const baseLevel = getBaseSkillLevel(ctx, normalizedSkill);
    if (baseLevel === null) return null;

    const boost = getSkillBoostAmount(ctx, normalizedSkill);
    if (boost <= 0) return null;

    const boostedLevel = baseLevel + boost;
    if (baseLevel >= requiredLevel || boostedLevel < requiredLevel) return null;

    return `${baseLevel}+${boost} ${normalizedSkill}`;
}
