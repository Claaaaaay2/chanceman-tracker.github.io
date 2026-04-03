import { hasBarbarianFiremakingTraining, isIronmanAccount } from "./playerState.js";
import { getEffectiveSkillLevel } from "./skillBoosts.js";

function shouldTrackMissing(ctx) {
    return !ctx?.suppressMissing && !ctx?.missing?.suppressMissing;
}

function getRequirementItemLookupState(ctx) {
    if (!ctx) return null;

    const itemsRef = ctx.items;
    const rolledRef = ctx.rolled;
    const obtainedRef = ctx.obtained;
    const itemsLength = Array.isArray(itemsRef) ? itemsRef.length : -1;
    const rolledLength = Array.isArray(rolledRef) ? rolledRef.length : -1;
    const obtainedLength = Array.isArray(obtainedRef) ? obtainedRef.length : -1;
    const cached = ctx.requirementsItemLookupState;

    if (
        cached
        && cached.itemsRef === itemsRef
        && cached.itemsLength === itemsLength
        && cached.rolledRef === rolledRef
        && cached.rolledLength === rolledLength
        && cached.obtainedRef === obtainedRef
        && cached.obtainedLength === obtainedLength
    ) {
        return cached;
    }

    const knownItemIds = new Set((itemsRef || []).map((item) => item.id));
    const rolledSet = new Set(rolledRef || []);
    const obtainedItemIds = new Set(obtainedRef || []);
    const ownedItemIds = new Set();
    for (const id of obtainedRef || []) {
        if (rolledSet.has(id)) {
            ownedItemIds.add(id);
        }
    }

    const state = {
        itemsRef,
        itemsLength,
        rolledRef,
        rolledLength,
        obtainedRef,
        obtainedLength,
        knownItemIds,
        obtainedItemIds,
        ownedItemIds,
        elementalRuneResultCache: new Map()
    };
    ctx.requirementsItemLookupState = state;
    return state;
}

function hasItem(ctx, id, options = {}) {
    const lookupState = getRequirementItemLookupState(ctx);
    if (!lookupState?.knownItemIds.has(id)) return false;

    const hasItemValue = lookupState.ownedItemIds.has(id);
    if (!hasItemValue && options.trackMissing !== false && ctx?.missing?.items && shouldTrackMissing(ctx)) {
        ctx.missing.items.add(id);
    }
    return hasItemValue;
}

function hasObtainedItem(ctx, id, options = {}) {
    const lookupState = getRequirementItemLookupState(ctx);
    if (!lookupState?.knownItemIds.has(id)) return false;

    const hasItemValue = lookupState.obtainedItemIds.has(id);
    if (!hasItemValue && options.trackMissing !== false && ctx?.missing?.items && shouldTrackMissing(ctx)) {
        ctx.missing.items.add(id);
    }
    return hasItemValue;
}

function addMissingItemGroup(ctx, ids) {
    if (!ctx?.missing || !shouldTrackMissing(ctx)) return;
    if (!ctx.missing.itemGroups) {
        ctx.missing.itemGroups = [];
    }
    if (!ctx.missing.itemGroupKeys) {
        ctx.missing.itemGroupKeys = new Set();
    }
    const key = [...ids].sort((a, b) => a - b).join(",");
    if (ctx.missing.itemGroupKeys.has(key)) return;
    ctx.missing.itemGroupKeys.add(key);
    ctx.missing.itemGroups.push(ids);
}
function addMissingItemOptionGroup(ctx, options) {
    if (!ctx?.missing || !shouldTrackMissing(ctx)) return;
    if (!ctx.missing.itemGroups) {
        ctx.missing.itemGroups = [];
    }
    if (!ctx.missing.itemGroupKeys) {
        ctx.missing.itemGroupKeys = new Set();
    }
    const normalized = options
        .map((option) => [...option].map((entry) => String(entry)).sort().join(","))
        .sort()
        .join("|");
    const key = `options:${normalized}`;
    if (ctx.missing.itemGroupKeys.has(key)) return;
    ctx.missing.itemGroupKeys.add(key);
    ctx.missing.itemGroups.push({ options });
}

const ELEMENTAL_RUNE_ELEMENTS = ["air", "water", "earth", "fire"];
const ELEMENTAL_RUNE_ELEMENT_TO_MASK = Object.freeze({
    air: 1,
    water: 2,
    earth: 4,
    fire: 8
});
const ELEMENTAL_RUNE_RULE_TO_ELEMENT = Object.freeze({
    hasAirRuneSource: "air",
    hasWaterRuneSource: "water",
    hasEarthRuneSource: "earth",
    hasFireRuneSource: "fire"
});
const ELEMENTAL_RUNE_PROVIDERS = Object.freeze([
    { ids: [556], slot: "inventory", elements: ["air"] },  // Air rune
    { ids: [555], slot: "inventory", elements: ["water"] }, // Water rune
    { ids: [557], slot: "inventory", elements: ["earth"] }, // Earth rune
    { ids: [554], slot: "inventory", elements: ["fire"] },  // Fire rune
    { ids: [4695], slot: "inventory", elements: ["air", "water"] },   // Mist rune
    { ids: [4696], slot: "inventory", elements: ["air", "earth"] },   // Dust rune
    { ids: [4697], slot: "inventory", elements: ["air", "fire"] },    // Smoke rune
    { ids: [4698], slot: "inventory", elements: ["water", "earth"] }, // Mud rune
    { ids: [4694], slot: "inventory", elements: ["water", "fire"] },  // Steam rune
    { ids: [4699], slot: "inventory", elements: ["earth", "fire"] },  // Lava rune
    { ids: [28929], slot: "inventory", elements: ["fire"] },          // Sunfire rune
    { ids: [1381], slot: "mainhand", elements: ["air"] },   // Staff of air
    { ids: [1383], slot: "mainhand", elements: ["water"] }, // Staff of water
    { ids: [1385], slot: "mainhand", elements: ["earth"] }, // Staff of earth
    { ids: [1387], slot: "mainhand", elements: ["fire"] },  // Staff of fire
    { ids: [1397], slot: "mainhand", elements: ["air"] },   // Air battlestaff
    { ids: [1395], slot: "mainhand", elements: ["water"] }, // Water battlestaff
    { ids: [1399], slot: "mainhand", elements: ["earth"] }, // Earth battlestaff
    { ids: [1393], slot: "mainhand", elements: ["fire"] },  // Fire battlestaff
    { ids: [1405], slot: "mainhand", elements: ["air"] },   // Mystic air staff
    { ids: [1403], slot: "mainhand", elements: ["water"] }, // Mystic water staff
    { ids: [1407], slot: "mainhand", elements: ["earth"] }, // Mystic earth staff
    { ids: [1401], slot: "mainhand", elements: ["fire"] },  // Mystic fire staff
    { ids: [20730], slot: "mainhand", elements: ["air", "water"] },   // Mist battlestaff
    { ids: [20733], slot: "mainhand", elements: ["air", "water"] },   // Mystic mist staff
    { ids: [20736], slot: "mainhand", elements: ["air", "earth"] },   // Dust battlestaff
    { ids: [20739], slot: "mainhand", elements: ["air", "earth"] },   // Mystic dust staff
    { ids: [11998], slot: "mainhand", elements: ["air", "fire"] },    // Smoke battlestaff
    { ids: [12000], slot: "mainhand", elements: ["air", "fire"] },    // Mystic smoke staff
    { ids: [6562], slot: "mainhand", elements: ["water", "earth"] },  // Mud battlestaff
    { ids: [6563], slot: "mainhand", elements: ["water", "earth"] },  // Mystic mud staff
    { ids: [11787], slot: "mainhand", elements: ["water", "fire"] },  // Steam battlestaff
    { ids: [11789], slot: "mainhand", elements: ["water", "fire"] },  // Mystic steam staff
    { ids: [3053], slot: "mainhand", elements: ["earth", "fire"] },   // Lava battlestaff
    { ids: [3054], slot: "mainhand", elements: ["earth", "fire"] },   // Mystic lava staff
    { ids: [25576, 25578], slot: "offhand", elements: ["water"] },    // Tome of water (empty) + Soaked page
    { ids: [30066, 30068], slot: "offhand", elements: ["earth"] },    // Tome of earth (empty) + Soiled page
    { ids: [20716, 20718], slot: "offhand", elements: ["fire"] },     // Tome of fire (empty) + Burnt page
].map((provider) => Object.freeze({
    ...provider,
    mask: provider.elements.reduce((mask, element) => mask | (ELEMENTAL_RUNE_ELEMENT_TO_MASK[element] || 0), 0)
})));
const ELEMENTAL_RUNE_PROVIDERS_BY_SLOT = Object.freeze({
    inventory: ELEMENTAL_RUNE_PROVIDERS.filter((provider) => provider.slot === "inventory"),
    mainhand: ELEMENTAL_RUNE_PROVIDERS.filter((provider) => provider.slot === "mainhand"),
    offhand: ELEMENTAL_RUNE_PROVIDERS.filter((provider) => provider.slot === "offhand")
});
const ELEMENTAL_RUNE_LOADOUT_OPTIONS = new Map();
const ELEMENTAL_RUNE_INVENTORY_OPTIONS = new Map();

function normalizeElementalRuneElements(elements) {
    const required = new Set(Array.isArray(elements) ? elements : [elements]);
    return ELEMENTAL_RUNE_ELEMENTS.filter((element) => required.has(element));
}

function getElementalRuneMask(elements) {
    return normalizeElementalRuneElements(elements).reduce(
        (mask, element) => mask | (ELEMENTAL_RUNE_ELEMENT_TO_MASK[element] || 0),
        0
    );
}

function isOptionSubset(subset, option) {
    return subset.every((id) => option.includes(id));
}

function getMinimalInventoryLoadoutOptions(requiredMask) {
    if (requiredMask === 0) return [[]];
    if (ELEMENTAL_RUNE_INVENTORY_OPTIONS.has(requiredMask)) {
        return ELEMENTAL_RUNE_INVENTORY_OPTIONS.get(requiredMask) || [];
    }

    const relevantProviders = ELEMENTAL_RUNE_PROVIDERS_BY_SLOT.inventory.filter((provider) => (provider.mask & requiredMask) !== 0);
    const candidateOptions = [];
    const subsetCount = 1 << relevantProviders.length;

    for (let subsetMask = 1; subsetMask < subsetCount; subsetMask++) {
        let coveredMask = 0;
        const optionIds = [];

        for (let index = 0; index < relevantProviders.length; index++) {
            if ((subsetMask & (1 << index)) === 0) continue;
            const provider = relevantProviders[index];
            coveredMask |= provider.mask;
            optionIds.push(...provider.ids);
        }

        if ((coveredMask & requiredMask) !== requiredMask) continue;

        candidateOptions.push({
            subsetMask,
            option: optionIds.sort((a, b) => a - b)
        });
    }

    const options = candidateOptions
        .filter((candidate, index) => !candidateOptions.some((other, otherIndex) =>
            otherIndex !== index
            && other.subsetMask !== candidate.subsetMask
            && (other.subsetMask & candidate.subsetMask) === other.subsetMask
        ))
        .map((candidate) => candidate.option)
        .sort((a, b) => {
            if (a.length !== b.length) return a.length - b.length;
            return a.join(",").localeCompare(b.join(","));
        });

    ELEMENTAL_RUNE_INVENTORY_OPTIONS.set(requiredMask, options);
    return options;
}

function buildElementalRuneLoadoutOptions(elements) {
    const requiredElements = normalizeElementalRuneElements(elements);
    if (!requiredElements.length) return [];

    const requiredMask = getElementalRuneMask(requiredElements);
    const mainhandProviders = [null, ...ELEMENTAL_RUNE_PROVIDERS_BY_SLOT.mainhand.filter((provider) => (provider.mask & requiredMask) !== 0)];
    const offhandProviders = [null, ...ELEMENTAL_RUNE_PROVIDERS_BY_SLOT.offhand.filter((provider) => (provider.mask & requiredMask) !== 0)];
    const options = [];
    const seen = new Set();

    for (const mainhandProvider of mainhandProviders) {
        for (const offhandProvider of offhandProviders) {
            const combinedMask = (mainhandProvider?.mask || 0) | (offhandProvider?.mask || 0);
            const remainingMask = requiredMask & ~combinedMask;
            const inventoryOptions = getMinimalInventoryLoadoutOptions(remainingMask);

            for (const inventoryOption of inventoryOptions) {
                const option = [
                    ...(mainhandProvider?.ids || []),
                    ...(offhandProvider?.ids || []),
                    ...inventoryOption
                ].sort((a, b) => a - b);
                const key = option.join(",");
                if (!seen.has(key)) {
                    seen.add(key);
                    options.push(option);
                }
            }
        }
    }

    return options
        .filter((option, index) => !options.some((other, otherIndex) =>
            otherIndex !== index
            && other.length < option.length
            && isOptionSubset(other, option)
        ))
        .sort((a, b) => {
            if (a.length !== b.length) return a.length - b.length;
            const aKey = a.join(",");
            const bKey = b.join(",");
            return aKey.localeCompare(bKey);
        });
}

function getElementalRuneLoadoutOptions(elements) {
    const requiredElements = normalizeElementalRuneElements(elements);
    const key = requiredElements.join("|");
    if (!ELEMENTAL_RUNE_LOADOUT_OPTIONS.has(key)) {
        ELEMENTAL_RUNE_LOADOUT_OPTIONS.set(key, buildElementalRuneLoadoutOptions(requiredElements));
    }
    return ELEMENTAL_RUNE_LOADOUT_OPTIONS.get(key) || [];
}

export function isElementalRuneRule(rule) {
    return typeof rule === "string"
        && Object.prototype.hasOwnProperty.call(ELEMENTAL_RUNE_RULE_TO_ELEMENT, rule);
}

export function hasElementalRuneSources(ctx, elements, options = {}) {
    const requiredElements = normalizeElementalRuneElements(elements);
    if (!requiredElements.length) return true;

    const trackMissing = options.trackMissing !== false;
    const requiredMask = getElementalRuneMask(requiredElements);
    const lookupState = getRequirementItemLookupState(ctx);
    const cacheKey = `${requiredMask}:${trackMissing ? "track" : "fast"}`;
    const cached = lookupState?.elementalRuneResultCache?.get(cacheKey);
    if (cached) {
        if (!cached.matched && trackMissing && ctx?.missing && shouldTrackMissing(ctx) && cached.missingOptions.length) {
            addMissingItemOptionGroup(ctx, cached.missingOptions.slice(0, 8));
        }
        return cached.matched;
    }

    const loadoutOptions = getElementalRuneLoadoutOptions(requiredElements);
    const missingOptions = [];

    for (const option of loadoutOptions) {
        const missingIds = [];
        let ownedCount = 0;

        for (const id of option) {
            if (hasItem(ctx, id, { trackMissing: false })) {
                ownedCount++;
            } else {
                missingIds.push(id);
            }
        }

        if (missingIds.length === 0) {
            if (lookupState?.elementalRuneResultCache) {
                lookupState.elementalRuneResultCache.set(cacheKey, {
                    matched: true,
                    missingOptions: []
                });
            }
            return true;
        }

        missingOptions.push({
            option,
            ownedCount,
            missingIds
        });
    }

    if (trackMissing && ctx?.missing && shouldTrackMissing(ctx) && missingOptions.length) {
        const uniqueMissingOptions = [];
        const seen = new Set();

        missingOptions
            .sort((a, b) => {
                if (a.ownedCount !== b.ownedCount) return b.ownedCount - a.ownedCount;
                if (a.missingIds.length !== b.missingIds.length) return a.missingIds.length - b.missingIds.length;
                if (a.option.length !== b.option.length) return a.option.length - b.option.length;
                return a.option.join(",").localeCompare(b.option.join(","));
            })
            .forEach(({ missingIds }) => {
                const normalized = [...missingIds].sort((a, b) => a - b);
                const key = normalized.join(",");
                if (!key || seen.has(key)) return;
                seen.add(key);
                uniqueMissingOptions.push(normalized);
            });

        if (uniqueMissingOptions.length) {
            addMissingItemOptionGroup(ctx, uniqueMissingOptions.slice(0, 8));
        }

        if (lookupState?.elementalRuneResultCache) {
            lookupState.elementalRuneResultCache.set(cacheKey, {
                matched: false,
                missingOptions: uniqueMissingOptions
            });
        }
        return false;
    }

    if (lookupState?.elementalRuneResultCache) {
        lookupState.elementalRuneResultCache.set(cacheKey, {
            matched: false,
            missingOptions: []
        });
    }
    return false;
}

export function hasElementalRuneRules(ctx, rules, options = {}) {
    const requiredElements = normalizeElementalRuneElements(
        rules
            .map((rule) => ELEMENTAL_RUNE_RULE_TO_ELEMENT[rule])
            .filter(Boolean)
    );
    return hasElementalRuneSources(ctx, requiredElements, options);
}


function hasAnyItems(ctx, ids) {
    for (const id of ids) {
        if (hasItem(ctx, id, { trackMissing: false })) {
            return true;
        }
    }
    addMissingItemGroup(ctx, ids);
    return false;
}

function hasClueSpadeRequirement(ctx) {
    if (ctx.filters?.hasDoneEasterEvent) return true;
    return hasAnyItems(ctx, [
        952,    // Spade
    ]);
}

const DIARY_SKILL_OVERRIDES = {
    Woodcutting: "overrideWoodcutting",
    Mining: "overrideMining",
    Fishing: "overrideFishing",
    Cooking: "overrideCooking",
    Farming: "overrideFarming",
    Fletching: "overrideFletching",
    Crafting: "overrideCrafting",
    Construction: "overrideConstruction",
    Smithing: "overrideSmithing"
};

let achievementDiaryDataPromise = null;

async function loadAchievementDiaryData() {
    if (achievementDiaryDataPromise) return achievementDiaryDataPromise;
    achievementDiaryDataPromise = (async () => {
        try {
            const response = await fetch("/data/achievement_diaries.json");
            if (!response.ok) return null;
            return await response.json();
        } catch (err) {
            return null;
        }
    })();
    return achievementDiaryDataPromise;
}

function hasDiarySkillRequirement(ctx, skill, level) {
    const overrideKey = DIARY_SKILL_OVERRIDES[skill];
    if (overrideKey && ctx.filters?.[overrideKey]) return true;
    const current = ctx.player?.levels?.[skill];
    return typeof current === "number" && current >= level;
}

function hasDiaryQuestRequirement(ctx, questName, requirementType) {
    const status = ctx.player?.quests?.[questName] ?? 0;
    if (requirementType === "completed") return status === 2;
    if (requirementType === "started") return status > 0;
    return false;
}

function hasDiaryItemRequirement(ctx, item) {
    if (!item?.id) return false;
    const obtained = ctx.obtained || [];
    const rolled = ctx.rolled || [];
    return obtained.includes(item.id) && rolled.includes(item.id);
}

function normalizeDiaryItemGroup(group) {
    return (group || []).map((entry) => {
        if (typeof entry === "number") return { id: entry };
        if (typeof entry === "object") return entry;
        return { name: String(entry) };
    });
}

async function diaryRequirementsMet(requirements, ctx) {
    for (const [skill, level] of Object.entries(requirements?.skills || {})) {
        if (!hasDiarySkillRequirement(ctx, skill, level)) {
            return false;
        }
    }

    for (const [questName, requirementType] of Object.entries(requirements?.quests || {})) {
        if (!hasDiaryQuestRequirement(ctx, questName, requirementType)) {
            return false;
        }
    }

    for (const item of requirements?.items || []) {
        if (!hasDiaryItemRequirement(ctx, item)) {
            return false;
        }
    }

    for (const group of requirements?.itemsAny || []) {
        const normalizedGroup = normalizeDiaryItemGroup(group);
        const hasAny = normalizedGroup.some((entry) => hasDiaryItemRequirement(ctx, entry));
        if (!hasAny) {
            return false;
        }
    }

    const elementalRuneRules = (requirements?.rulesAll || []).filter(isElementalRuneRule);
    const skippedRuleKeys = new Set(elementalRuneRules);
    if (elementalRuneRules.length && !hasElementalRuneRules(ctx, elementalRuneRules, { trackMissing: false })) {
        return false;
    }

    for (const ruleKey of requirements?.rulesAll || []) {
        if (skippedRuleKeys.has(ruleKey)) continue;
        const ruleFn = REQUIREMENT_CHECKS[ruleKey];
        if (!ruleFn) return false;
        if (!(await ruleFn(ctx))) {
            return false;
        }
    }

    const anyRules = requirements?.rulesAny || [];
    if (anyRules.length) {
        let anyMet = false;
        for (const ruleKey of anyRules) {
            const ruleFn = REQUIREMENT_CHECKS[ruleKey];
            if (!ruleFn) continue;
            if (await ruleFn(ctx)) {
                anyMet = true;
                break;
            }
        }
        if (!anyMet) {
            return false;
        }
    }

    if (requirements?.untracked?.length) {
        return false;
    }

    return true;
}

async function canCompleteDiaryTier(ctx, diaryName, tierName) {
    if (!ctx?.player) return false;

    const diaryState = ctx.player?.achievementDiaries?.[diaryName]?.[tierName];
    if (diaryState?.complete) return true;

    const data = await loadAchievementDiaryData();
    const tasks = data?.diaries?.[diaryName]?.[tierName];
    if (!Array.isArray(tasks) || !tasks.length) {
        return false;
    }

    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        const isCompleted = Boolean(diaryState?.tasks?.[index]);
        if (isCompleted) continue;
        const met = await diaryRequirementsMet(task?.requirements, ctx);
        if (!met) return false;
    }

    return true;
}

function allTrue(checks) {
    let ok = true;
    for (const check of checks) {
        if (!check) {
            ok = false;
        }
    }
    return ok;
}

export function canTrainSkill(ctx, skill) {
    switch (skill) {
        case "Construction":
            return canTrainConstruction(ctx);
        case "Cooking":
            return canTrainCooking(ctx);
        case "Crafting":
            return canTrainCrafting(ctx);
        case "Farming":
            return canTrainFarming(ctx);
        case "Firemaking":
            return canTrainFiremaking(ctx);
        case "Fishing":
            return canTrainFishing(ctx);
        case "Fletching":
            return canTrainFletching(ctx);
        case "Herblore":
            return canTrainHerblore(ctx);
        case "Hunter":
            return canTrainHunter(ctx);
        case "Mining":
            return canTrainMining(ctx);
        case "Prayer":
            return canTrainPrayer(ctx);
        case "Slayer":
            return canTrainSlayer(ctx);
        case "Smithing":
            return canTrainSmithing(ctx);
        case "Woodcutting":
            return canTrainWoodcutting(ctx);
        case "Herblore":
            return canCompleteDruidicRitual(ctx);
        case "Sailing":
            return canCompletePandemonium(ctx);
        default:
            // Most skills are assumed trainable without special item gates.
            return true;
    }
}

export function hasSkillLevel(ctx, skill, level, options = {}) {
    const overrideKey = options.overrideKey;
    const trackMissing = options.trackMissing !== false;
    if (overrideKey && ctx.filters?.[overrideKey]) return true;

    if (ctx?.ignoreSkillLevels === "levelsOnly") {
        return true;
    }

    // In "ignore skill levels" mode, treat skill checks as satisfied only if the
    // player can train that skill at all. This lets sorting distinguish between
    // "trainable but level-gated" (rank 7) and "fully unobtainable" (rank 8).
    if (ctx?.ignoreSkillLevels) {
        return canTrainSkill(ctx, skill);
    }

    const current = getEffectiveSkillLevel(ctx, skill) ?? 1;
    if (typeof current === "number" && current >= level) return true;
    if (trackMissing && ctx?.missing && shouldTrackMissing(ctx)) {
        if (!ctx.missing.skills) {
            ctx.missing.skills = [];
        }
        if (!ctx.missing.skillKeys) {
            ctx.missing.skillKeys = new Set();
        }
        const key = `${skill} ${level}`;
        if (!ctx.missing.skillKeys.has(key)) {
            ctx.missing.skillKeys.add(key);
            ctx.missing.skills.push(key);
        }
    }
    return false;
}


export function has(ctx, id) {
    return hasItem(ctx, id);
}

function hasQuestPoints(ctx, required) {
    const current = ctx.player?.questPoints ?? 0;
    if (current >= required) return true;
    if (ctx?.missing && shouldTrackMissing(ctx)) {
        const existing = ctx.missing.questPointsRequired ?? 0;
        if (required > existing) {
            ctx.missing.questPointsRequired = required;
            ctx.missing.questPointsCurrent = current;
        }
    }
    return false;
}

function requiresQuest(ctx, questKey, fn) {
    const nestedCtx = {
        ...ctx,
        suppressMissing: true,
        missing: {
            ...ctx.missing,
            suppressMissing: true
        }
    };
    const ok = fn(nestedCtx);
    if (!ok && ctx?.missing) {
        if (!ctx.missing.prereqQuests) {
            ctx.missing.prereqQuests = [];
        }
        if (!ctx.missing.prereqQuestKeys) {
            ctx.missing.prereqQuestKeys = new Set();
        }
        if (!ctx.missing.prereqQuestKeys.has(questKey)) {
            ctx.missing.prereqQuestKeys.add(questKey);
            ctx.missing.prereqQuests.push(questKey);
        }
    }
    return ok;
}

export const REQUIREMENT_CHECKS = {
    canGetRingOfDuelling(ctx) {
        return has(ctx, 2552) || canCompleteHauntedMine(ctx);
    },
    canEnterWizardsGuild(ctx) {
        return hasSkillLevel(ctx, "Magic", 66);
    },
    canCompleteTutorialIsland(ctx) {
        return true;
    },
    hasTelegrabRunesOrCompleteDragonSlayerI(ctx) {
        return hasTelegrabRunes(ctx) || canCompleteDragonSlayerI(ctx);
    },
    canAccessSunbleakIsland(ctx) {
        return canAccessSunbleakIsland(ctx);
    },
    canCompleteDeviousMinds(ctx) {
        return canCompleteDeviousMinds(ctx);
    },
    canCompleteGoblinDiplomacy(ctx) {
        return canCompleteGoblinDiplomacy(ctx);
    },
    canEnterCraftingGuild(ctx) {
        return canEnterCraftingGuild(ctx);
    },
    hasHighLevelHerb(ctx) {
        return hasAnyItems(ctx, [
            211,
            261,
            213,
            263,
            3051,
            3000,
            215,
            265,
            2485,
            2481,
            217,
            267,
            219,
            269,
        ]) // Torstol
    },
    hasClueSpade(ctx) {
        return hasClueSpadeRequirement(ctx);
    },
    canCompleteMisthalinMystery(ctx) {
        return canCompleteMisthalinMystery(ctx);
    },
    hasFishForFineOffcuts(ctx) {
        return hasAnyItems(ctx, [
            383,
            395,
            13439,
            11934,
            32325,
            32333,
            32341,
            31561,
            32349,
            389,
        ]) // Raw manta ray;  // Raw manta ray
    },
    hasFishForOffcuts(ctx) {
        return hasAnyItems(ctx, [
            11328,
            11330,
            11332,
            22826,
            22829,
            22832,
            22835,
            317,
            321,
            335,
            331,
            377,
            341,
            349,
            353,
            363,
            345,
            7944,
            327,
            371,
            32309,
            32317,
            31553,
            359,
        ]) // Raw tuna;  // Raw tuna
    },
    canCompleteTempleOfTheEye(ctx) {
        return canCompleteTempleOfTheEye(ctx);
    },
    has50HunterRumoursDone(ctx) {
        return (!ctx.filters?.isHunterRumourLocked && canTrainHunter(ctx)) //
            || (ctx.player?.hunterRumoursCompleted ?? 0) >= 50;
    },
    has25HunterRumoursDone(ctx) {
        return (!ctx.filters?.isHunterRumourLocked && canTrainHunter(ctx)) //
            || (ctx.player?.hunterRumoursCompleted ?? 0) >= 25;
    },
    canEnterNightmareZone(ctx) {
        return canEnterNightmareZone(ctx);
    },
    canCompleteRecruitmentDrive(ctx) {
        return canCompleteRecruitmentDrive(ctx);
    },
    canFillFishFoodBox(ctx) {
        return canFillFishFoodBox(ctx);
    },
    hasAnyFilledBowl(ctx) {
        return hasAnyFilledBowl(ctx);
    },
    hasAnyFilledVial(ctx) {
        return hasAnyFilledVial(ctx);
    },
    hasAnyFilledCup(ctx) {
        return hasAnyFilledCup(ctx);
    },
    hasAnyFilledBucket(ctx) {
        return hasAnyFilledBucket(ctx);
    },
    hasAnyFilledJug(ctx) {
        return hasAnyFilledJug(ctx);
    },
    hasAnyFilledPot(ctx) {
        return hasAnyFilledPot(ctx);
    },
    hasAnyAle(ctx) {
        return hasAnyAle(ctx);
    },
    hasAnyGnomeCocktail(ctx) {
        return hasAnyGnomeCocktail(ctx);
    },
    canMakeSplitLog(ctx) {
        return canMakeSplitLog(ctx);
    },
    canCureYakHide(ctx) {
        return canCureYakHide(ctx);
    },
    canMakeYakhideArmour(ctx) {
        return canMakeYakhideArmour(ctx);
    },
    canMakeNeitiznotShield(ctx) {
        return canMakeNeitiznotShield(ctx);
    },
    hasAnyLog(ctx) {
        return hasAnyLog(ctx);
    },
    hasAnyFletchableLog(ctx) {
        return hasAnyFletchableLog(ctx);
    },
    canUseSilverSickle(ctx) {
        return canUseSilverSickle(ctx);
    },
    canCompleteRogueTrader(ctx) {
        return canCompleteRogueTrader(ctx);
    },
    canMakeWoodenCats(ctx) {
        return canMakeWoodenCats(ctx);
    },
    canGetWillowBlackjack(ctx) {
        return canGetWillowBlackjack(ctx);
    },
    hasAnyNormalCape(ctx) {
        return hasAnyItems(ctx, [
            1023,
            1007,
            1021,
            1019,
            1031,
            6959,
            1029,
            1027,
        ]);
    },
    hasAnyCookedMeatFish(ctx) {
        return hasAnyCookedMeatFish(ctx);
    },
    hasAnyLeaves(ctx) {
        return hasAnyItems(ctx, [
            6020,
            6030,
            6028,
            6022,
            6024,
            6026,
        ]);
    },
    hasAnyNails(ctx) {
        return hasAnyNails(ctx);
    },
    canMakeWoodenWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && hasAnyNails(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && has(ctx, 960); // Plank
    },
    canMakeOakWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeSteelFramedWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 2353); // Steel bar
    },
    canMakeOakLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeEagleLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeDemonLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeTeakEagleLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8780); // Teak plank
    },
    canMakeTeakDemonLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8780); // Teak plank
    },
    canMakeMahoganyEagleLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8782)  // Mahogany plank
            && has(ctx, 8784); // Gold leaf
    },
    canMakeMahoganyDemonLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8782)  // Mahogany plank
            && has(ctx, 8784); // Gold leaf
    },
    canMakeMarbleLectern(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8786)  // Marble block
            && has(ctx, 8788)  // Magic stone
            && has(ctx, 8784); // Gold leaf
    },
    canMakeCraftingTableI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeCraftingTableII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 1775); // Molten glass
    },
    canMakeRepairBench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeWhetstone(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 3420); // Limestone brick
    },
    canMakeArmourStand(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 3420); // Limestone brick
    },
    canMakeToolStore(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeWoodenLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 960); // Plank
    },
    canMakeOakLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeTeakLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8790)  // Bolt of cloth
            && has(ctx, 8780); // Teak plank
    },
    canMakeWoodenShelvesI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 960); // Plank
    },
    canMakeWoodenShelvesII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 1761) // Soft clay
            && has(ctx, 960); // Plank
    },
    canMakeOakShelves(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8778); // Oak plank
    },
    canMakeTeakShelvesI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8780); // Teak plank
    },
    canMakeTeakShelvesII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8780)  // Teak plank
            && has(ctx, 8784); // Gold leaf
    },
    canCompleteTaiBwoWannaiTrio(ctx) {
        return canCompleteTaiBwoWannaiTrio(ctx);
    },
    canCompleteGertrudesCat(ctx) {
        return canCompleteGertrudesCat(ctx);
    },
    canCompleteGhostsAhoy(ctx) {
        return canCompleteGhostsAhoy(ctx);
    },
    canCompleteHazeelCult(ctx) {
        return canCompleteHazeelCult(ctx);
    },
    canCompleteHisFaithfulServants(ctx) {
        return canCompleteHisFaithfulServants(ctx);
    },
    canCompleteDeathOnTheIsle(ctx) {
        return requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun);
    },
    canCompleteFightArena(ctx) {
        return true;
    },
    canCompleteHolyGrail(ctx) {
        return canCompleteHolyGrail(ctx);
    },
    canCompleteHopespearsWill(ctx) {
        return canCompleteHopespearsWill(ctx);
    },
    canCompleteLandOfTheGoblins(ctx) {
        return canCompleteLandOfTheGoblins(ctx);
    },
    canCompleteMageArenaI(ctx) {
        return canCompleteMageArenaI(ctx);
    },
    canCompleteMageArenaII(ctx) {
        return canCompleteMageArenaII(ctx);
    },
    canCompleteMakingHistory(ctx) {
        return canCompleteMakingHistory(ctx);
    },
    canCompleteMeatAndGreet(ctx) {
        return canCompleteMeatAndGreet(ctx);
    },
    canGetKPSpears(ctx) {
        return canGetKPSpears(ctx);
    },
    canGetKarambwanVessel(ctx) {
        return canGetKarambwanVessel(ctx);
    },
    canCompleteDragonSlayerII(ctx) {
        return canCompleteDragonSlayerII(ctx);
    },
    canCompleteDragonSlayerI(ctx) {
        return canCompleteDragonSlayerI(ctx);
    },
    canCompleteDesertTreasureII(ctx) {
        return canCompleteDesertTreasureII(ctx);
    },
    canCompleteDesertTreasureI(ctx) {
        return canCompleteDesertTreasureI(ctx);
    },
    canCompleteRatcatchers(ctx) {
        return canCompleteRatcatchers(ctx);
    },
    canCompleteMyArmsBigAdventure(ctx) {
        return canCompleteMyArmsBigAdventure(ctx);
    },
    canCompleteInAidOfTheMyreque(ctx) {
        return canCompleteInAidOfTheMyreque(ctx);
    },
    canCompleteShadowsOfCustodia(ctx) {
        return canCompleteShadowsOfCustodia(ctx);
    },
    canCompleteSongOfTheElves(ctx) {
        return canCompleteSongOfTheElves(ctx);
    },
    canCompleteWhileGuthixSleeps(ctx) {
        return canCompleteWhileGuthixSleeps(ctx);
    },
    canStartTheGreatBrainRobbery(ctx) {
        return canStartTheGreatBrainRobbery(ctx);
    },
    canCompleteTheGreatBrainRobbery(ctx) {
        return canCompleteTheGreatBrainRobbery(ctx);
    },
    canCompleteEthicallyAcquiredAntiquities(ctx) {
        return canCompleteEthicallyAcquiredAntiquities(ctx);
    },
    canCompleteBlackKnightsFortress(ctx) {
        return canCompleteBlackKnightsFortress(ctx);
    },
    canCompleteBiohazard(ctx) {
        return canCompleteBiohazard(ctx);
    },
    canCompleteClientOfKourend(ctx) {
        return canCompleteClientOfKourend(ctx);
    },
    canCompleteCurseOfTheEmptyLord(ctx) {
        return canCompleteCurseOfTheEmptyLord(ctx);
    },
    canCompleteBearYourSoul(ctx) {
        return canCompleteBearYourSoul(ctx);
    },
    canCompleteFishingContest(ctx) {
        return canCompleteFishingContest(ctx);
    },
    canCompleteInSearchOfKnowledge(ctx) {
        return canCompleteInSearchOfKnowledge(ctx);
    },
    canCompleteKingsRansom(ctx) {
        return canCompleteKingsRansom(ctx);
    },
    canCompleteLairOfTarnRazorlor(ctx) {
        return canCompleteLairOfTarnRazorlor(ctx);
    },
    canCompleteIntoTheTombs(ctx) {
        return canCompleteIntoTheTombs(ctx);
    },
    canCompleteTheGeneralsShadow(ctx) {
        return canCompleteTheGeneralsShadow(ctx);
    },
    canCompleteValeTotems(ctx) {
        return canDoValeTotems(ctx);
    },
    canCompleteVampyreSlayer(ctx) {
        return canCompleteVampyreSlayer(ctx);
    },
    canCompleteWitchsPotion(ctx) {
        return canCompleteWitchsPotion(ctx);
    },
    canCompleteXMarksTheSpot(ctx) {
        return canCompleteXMarksTheSpot(ctx);
    },
    canStartATasteOfHope(ctx) {
        return canStartATasteOfHope(ctx);
    },
    canCompleteATasteOfHope(ctx) {
        return canCompleteATasteOfHope(ctx);
    },
    canCompleteTrollStronghold(ctx) {
        return canCompleteTrollStronghold(ctx);
    },
    canCompleteSinsOfTheFather(ctx) {
        return canCompleteSinsOfTheFather(ctx);
    },
    canCompleteWhatLiesBelow(ctx) {
        return canCompleteWhatLiesBelow(ctx);
    },
    canStartMageArenaII(ctx) {
        return canStartMageArenaII(ctx);
    },
    canCompleteErnestTheChicken(ctx) {
        return canCompleteErnestTheChicken(ctx);
    },
    canCompleteTheFremennikExiles(ctx) {
        return canCompleteTheFremennikExiles(ctx);
    },
    canCompleteCabinFever(ctx) {
        return canCompleteCabinFever(ctx);
    },
    canCompleteWanted(ctx) {
        return canCompleteWanted(ctx);
    },
    canCompleteTheFinalDawn(ctx) {
        return canCompleteTheFinalDawn(ctx);
    },
    canCompleteShadesOfMortton(ctx) {
        return canCompleteShadesOfMortton(ctx);
    },
    canCompleteSleepingGiants(ctx) {
        return canCompleteSleepingGiants(ctx);
    },
    canCompleteBelowIceMountain(ctx) {
        return canCompleteBelowIceMountain(ctx);
    },
    canCompleteAKingdomDivided(ctx) {
        return canCompleteAKingdomDivided(ctx);
    },
    canCompleteTaleOfTheRighteous(ctx) {
        return canCompleteTaleOfTheRighteous(ctx);
    },
    canCompleteTheSlugMenace(ctx) {
        return canCompleteTheSlugMenace(ctx);
    },
    canCompleteTreeGnomeVillage(ctx) {
        return canCompleteTreeGnomeVillage(ctx);
    },
    canCompleteMountainDaughter(ctx) {
        return canCompleteMountainDaughter(ctx);
    },
    canCompleteAPorcineOfInterest(ctx) {
        return canCompleteAPorcineOfInterest(ctx);
    },
    canCompleteTempleOfIkov(ctx) {
        return canCompleteTempleOfIkov(ctx);
    },
    canCompleteInSearchOfTheMyreque(ctx) {
        return canCompleteInSearchOfTheMyreque(ctx);
    },
    canCompleteTheCorsairCurse(ctx) {
        return canCompleteTheCorsairCurse(ctx);
    },
    hasNarwhalKnife(ctx) {
        return hasNarwhalKnife(ctx);
    },
    hasKnifeOrNarwhalKnife(ctx) {
        return hasKnifeOrNarwhalKnife(ctx);
    },
    canCompleteTheEyesOfGlouphrie(ctx) {
        return canCompleteTheEyesOfGlouphrie(ctx);
    },
    canCompleteCreatureOfFenkenstrain(ctx) {
        return canCompleteCreatureOfFenkenstrain(ctx);
    },
    canStartHazeelCult(ctx) {
        return ctx.player.quests["Hazeel Cult"] < 2;
    },
    canCompleteRFDAnotherCooksQuest(ctx) {
        return canCompleteRFDAnotherCooksQuest(ctx);
    },
    canCompleteRFDFreeingTheMountainDwarf(ctx) {
        return canCompleteRFDFreeingTheMountainDwarf(ctx);
    },
    canCompleteRFDFreeingTheGoblinGenerals(ctx) {
        return canCompleteRFDFreeingTheGoblinGenerals(ctx);
    },
    canCompleteRFDFreeingPiratePete(ctx) {
        return canCompleteRFDFreeingPiratePete(ctx);
    },
    canCompleteRFDFreeingTheLumbridgeGuide(ctx) {
        return canCompleteRFDFreeingTheLumbridgeGuide(ctx);
    },
    canCompleteRFDFreeingEvilDave(ctx) {
        return canCompleteRFDFreeingEvilDave(ctx);
    },
    canCompleteRFDFreeingSkrachUglologwee(ctx) {
        return canCompleteRFDFreeingSkrachUglologwee(ctx);
    },
    canCompleteRFDFreeingSirAmikVarse(ctx) {
        return canCompleteRFDFreeingSirAmikVarse(ctx);
    },
    canCompleteRFDFreeingKingAwowogei(ctx) {
        return canCompleteRFDFreeingKingAwowogei(ctx);
    },
    canCompleteRecipeForDisasterCulinaromancer(ctx) {
        return canCompleteRecipeForDisasterCulinaromancer(ctx);
    },
    canCompleteTheEnchantedKey(ctx) {
        return canCompleteTheEnchantedKey(ctx);
    },
    canCompleteTheGardenOfDeath(ctx) {
        return canCompleteTheGardenOfDeath(ctx);
    },
    canCompleteShiloVillage(ctx) {
        return canCompleteShiloVillage(ctx);
    },
    canEnterLumbridgeSwampCaves(ctx) {
        return canEnterLumbridgeSwampCaves(ctx);
    },
    canCompleteMakingFriendsWithMyArm(ctx) {
        return canCompleteMakingFriendsWithMyArm(ctx);
    },
    canCompleteSwanSong(ctx) {
        return canCompleteSwanSong(ctx);
    },
    canCompleteGrimTales(ctx) {
        return canCompleteGrimTales(ctx);
    },
    canCompleteObservatoryQuest(ctx) {
        return canCompleteObservatoryQuest(ctx);
    },
    canCompleteBetweenARock(ctx) {
        return canCompleteBetweenARock(ctx);
    },
    canGetGoutweed(ctx) {
        return canGetGoutweed(ctx);
    },
    canCompleteRegicide(ctx) {
        return canCompleteRegicide(ctx);
    },
    canCompleteTheAscentOfArceuus(ctx) {
        return canCompleteTheAscentOfArceuus(ctx);
    },
    canCompleteOlafsQuest(ctx) {
        return canCompleteOlafsQuest(ctx);
    },
    canCompleteDefenderOfVarrock(ctx) {
        return canCompleteDefenderOfVarrock(ctx);
    },
    canCompleteTheCurseOfArrav(ctx) {
        return canCompleteTheCurseOfArrav(ctx);
    },
    canCompleteDreamMentor(ctx) {
        return canCompleteDreamMentor(ctx);
    },
    canCompleteTrollRomance(ctx) {
        return canCompleteTrollRomance(ctx);
    },
    canCompleteRovingElves(ctx) {
        return canCompleteRovingElves(ctx);
    },
    canEnterTheChampionsGuild(ctx) {
        return hasQuestPoints(ctx, 32);
    },
    canStartDragonSlayerI(ctx) {
        return canStartDragonSlayerI(ctx);
    },
    canStartMourningsEndPartI(ctx) {
        return canStartMourningsEndPartI(ctx);
    },
    canCompleteMourningsEndPartI(ctx) {
        return canCompleteMourningsEndPartI(ctx);
    },
    canCompleteMourningsEndPartII(ctx) {
        return canCompleteMourningsEndPartII(ctx);
    },
    has50JunkItems(ctx) {
        return has50JunkItems(ctx);
    },
    canStartDarknessOfHallowvale(ctx) {
        return canStartDarknessOfHallowvale(ctx);
    },
    canCompleteDarknessOfHallowvale(ctx) {
        return canCompleteDarknessOfHallowvale(ctx);
    },
    canCompleteGardenOfTranquillity(ctx) {
        return canCompleteGardenOfTranquillity(ctx);
    },
    canCompleteLostCity(ctx) {
        return canCompleteLostCity(ctx);
    },
    canAccessChampionsGuild(ctx) {
        return hasQuestPoints(ctx, 32);
    },
    canCompleteShadowOfTheStorm(ctx) {
        return canCompleteShadowOfTheStorm(ctx);
    },
    canCompleteASoulsBane(ctx) {
        return canCompleteASoulsBane(ctx);
    },
    canCompleteMerlinsCrystal(ctx) {
        return canCompleteMerlinsCrystal(ctx);
    },
    canCompletePlagueCity(ctx) {
        return canCompletePlagueCity(ctx);
    },
    canCompleteGettingAhead(ctx) {
        return canCompleteGettingAhead(ctx);
    },
    canCompleteTheFremennikTrials(ctx) {
        return canCompleteTheFremennikTrials(ctx);
    },
    canAccessDessicatedPagesBosses(ctx) {
        return canAccessDessicatedPagesBosses(ctx);
    },
    hasNotCompletedTheFremennikTrials(ctx) {
        return (ctx.player?.quests?.["The Fremennik Trials"] ?? 0) < 2;
    },
    canCompleteTheFeud(ctx) {
        return canCompleteTheFeud(ctx);
    },
    canCompleteTheFremennikIsles(ctx) {
        return canCompleteTheFremennikIsles(ctx);
    },
    canCompletePrinceAliRescue(ctx) {
        return canCompletePrinceAliRescue(ctx);
    },
    canCompleteTowerOfLife(ctx) {
        return canCompleteTowerOfLife(ctx);
    },
    canCompleteEnlightenedJourney(ctx) {
        return canCompleteEnlightenedJourney(ctx);
    },
    async canAccessCooksGuild(ctx) {
        return (hasAnyItems(ctx, [1949, 20205]) && canTrainCooking(ctx)) || await canCompleteVarrockDiaryHard(ctx);
    },
    canCompleteRumDeal(ctx) {
        return canCompleteRumDeal(ctx);
    },
    canCompleteTheGiantDwarf(ctx) {
        return canCompleteTheGiantDwarf(ctx);
    },
    canCompleteAnotherSliceOfHAM(ctx) {
        return canCompleteAnotherSliceOfHAM(ctx);
    },
    canCompleteHorrorFromTheDeep(ctx) {
        return canCompleteHorrorFromTheDeep(ctx);
    },
    canCompleteNatureSpirit(ctx) {
        return canCompleteNatureSpirit(ctx);
    },
    canCompleteSecretsOfTheNorth(ctx) {
        return canCompleteSecretsOfTheNorth(ctx);
    },
    canCompleteLunarDiplomacy(ctx) {
        return canCompleteLunarDiplomacy(ctx);
    },
    canReachLunarIsle(ctx) {
        return canReachLunarIsle(ctx);
    },
    canReachPiratesCove(ctx) {
        return canReachPiratesCove(ctx);
    },
    canCompleteEaglesPeak(ctx) {
        return canCompleteEaglesPeak(ctx);
    },
    canCompleteUndergroundPass(ctx) {
        return canCompleteUndergroundPass(ctx);
    },
    canCompleteWatchtower(ctx) {
        return canCompleteWatchtower(ctx);
    },
    canCompleteFairytaleIICureAQueen(ctx) {
        return canCompleteFairytaleIICureAQueen(ctx);
    },
    canCompleteRecipeForDisaster(ctx) {
        return canCompleteRecipeForDisaster(ctx);
    },
    canCompleteRecipeForDisaster0(ctx) {
        return canCompleteRecipeForDisaster0(ctx);
    },
    canCompleteRecipeForDisaster1(ctx) {
        return canCompleteRecipeForDisaster1(ctx);
    },
    canCompleteRecipeForDisaster2(ctx) {
        return canCompleteRecipeForDisaster2(ctx);
    },
    canCompleteRecipeForDisaster3(ctx) {
        return canCompleteRecipeForDisaster3(ctx);
    },
    canCompleteRecipeForDisaster4(ctx) {
        return canCompleteRecipeForDisaster4(ctx);
    },
    canCompleteRecipeForDisaster5(ctx) {
        return canCompleteRecipeForDisaster5(ctx);
    },
    canCompleteRecipeForDisaster6(ctx) {
        return canCompleteRecipeForDisaster6(ctx);
    },
    canCompleteRecipeForDisaster7(ctx) {
        return canCompleteRecipeForDisaster7(ctx);
    },
    canCompleteRecipeForDisaster8(ctx) {
        return canCompleteRecipeForDisaster8(ctx);
    },
    canCompleteEnakhrasLament(ctx) {
        return canCompleteEnakhrasLament(ctx);
    },
    canCompleteScorpionCatcher(ctx) {
        return canCompleteScorpionCatcher(ctx);
    },
    canCompleteTheGrandTree(ctx) {
        return canCompleteTheGrandTree(ctx);
    },
    canEnterBraindeathIsland(ctx) {
        return canEnterBraindeathIsland(ctx);
    },
    canDoMixology(ctx) {
        return canDoMixology(ctx);
    },
    canDoMageTrainingArena(ctx) {
        return canDoMageTrainingArena(ctx);
    },
    async canCompleteVarrockDiaryEasy(ctx) {
        return await canCompleteDiaryTier(ctx, "Varrock", "Easy");
    },
    async canCompleteVarrockDiaryMedium(ctx) {
        return await canCompleteDiaryTier(ctx, "Varrock", "Easy")
            && await canCompleteDiaryTier(ctx, "Varrock", "Medium");
    },
    async canCompleteVarrockDiaryHard(ctx) {
        return await canCompleteVarrockDiaryHard(ctx);
    },
    async canCompleteVarrockDiaryElite(ctx) {
        return await canCompleteDiaryTier(ctx, "Varrock", "Easy")
            && await canCompleteDiaryTier(ctx, "Varrock", "Medium")
            && await canCompleteDiaryTier(ctx, "Varrock", "Hard")
            && await canCompleteDiaryTier(ctx, "Varrock", "Elite");
    },
    async canCompleteWildernessDiaryEasy(ctx) {
        return await canCompleteDiaryTier(ctx, "Wilderness", "Easy");
    },
    async canCompleteWildernessDiaryMedium(ctx) {
        return await canCompleteDiaryTier(ctx, "Wilderness", "Easy")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Medium");
    },
    async canCompleteWildernessDiaryHard(ctx) {
        return await canCompleteDiaryTier(ctx, "Wilderness", "Easy")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Medium")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Hard");
    },
    async canCompleteWildernessDiaryElite(ctx) {
        return await canCompleteDiaryTier(ctx, "Wilderness", "Easy")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Medium")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Hard")
            && await canCompleteDiaryTier(ctx, "Wilderness", "Elite");
    },
    canDoTombsOfAmascut(ctx) {
        return canDoTombsOfAmascut(ctx);
    },
    canCompleteHeroesQuest(ctx) {
        return canCompleteHeroesQuest(ctx);
    },
    canCompleteRuneMysteries(ctx) {
        return canCompleteRuneMysteries(ctx);
    },
    canBirdSnare(ctx) {
        return canBirdSnare(ctx);
    },
    canNooseWand(ctx) {
        return canNooseWand(ctx);
    },
    canCatchImplingsInJars(ctx) {
        return canCatchImplingsInJars(ctx);
    },
    canDeadfallTrap(ctx) {
        return canDeadfallTrap(ctx);
    },
    canPitfallTrap(ctx) {
        return canPitfallTrap(ctx);
    },
    canCatchSalamanders(ctx) {
        return canCatchSalamanders(ctx);
    },
    canCatchCrabs(ctx) {
        return canCatchCrabs(ctx);
    },
    canCatchButterflies(ctx) {
        return canCatchButterflies(ctx);
    },
    hasRabbitSnare(ctx) {
        return has(ctx, 10031);
    },
    hasBoxTrap(ctx) {
        return has(ctx, 10008);
    },
    canCompleteTheFrozenDoor(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canStartPerilousMoons(ctx) {
        return canStartPerilousMoons(ctx);
    },
    canStartPerilousMoonsAndReachWyrmlings(ctx) {
        return canStartPerilousMoonsAndReachWyrmlings(ctx);
    },
    canCompleteFairytaleIGrowingPains(ctx) {
        return canCompleteFairytaleIGrowingPains(ctx)
    },
    canCompleteBoneVoyage(ctx) {
        return canCompleteBoneVoyage(ctx);
    },
    canGet50Kudos(ctx) {
        return canGet50Kudos(ctx);
    },
    canGet153Kudos(ctx) {
        return canGet153Kudos(ctx);
    },
    canCompleteShieldOfArrav(ctx) {
        return canCompleteShieldOfArrav(ctx);
    },
    canCompleteSheepHerder(ctx) {
        return canCompleteSheepHerder(ctx);
    },
    canCompleteScrambled(ctx) {
        return canCompleteScrambled(ctx);
    },
    canCompleteChildrenOfTheSun(ctx) {
        return canCompleteChildrenOfTheSun(ctx);
    },
    canCompleteTheRestlessGhost(ctx) {
        return canCompleteTheRestlessGhost(ctx);
    },
    canCompleteRomeoAndJuliet(ctx) {
        return canCompleteRomeoAndJuliet(ctx);
    },
    canCompleteRagAndBoneManI(ctx) {
        return canCompleteRagAndBoneManI(ctx);
    },
    canCompleteRagAndBoneManII(ctx) {
        return canCompleteRagAndBoneManII(ctx);
    },
    canCompleteTwilightsPromise(ctx) {
        return canCompleteTwilightsPromise(ctx);
    },
    canCompleteTheForsakenTower(ctx) {
        return canCompleteTheForsakenTower(ctx);
    },
    canCompleteTheDepthsOfDespair(ctx) {
        return canCompleteTheDepthsOfDespair(ctx);
    },
    canCompleteTearsOfGuthix(ctx) {
        return canCompleteTearsOfGuthix(ctx);
    },
    canCompleteSpiritsOfTheElid(ctx) {
        return canCompleteSpiritsOfTheElid(ctx);
    },
    canCompleteMurderMystery(ctx) {
        return canCompleteMurderMystery(ctx);
    },
    canCompleteMonksFriend(ctx) {
        return canCompleteMonksFriend(ctx);
    },
    canCompleteBigChompyBirdHunting(ctx) {
        return canCompleteBigChompyBirdHunting(ctx);
    },
    canCompleteTheGolem(ctx) {
        return canCompleteTheGolem(ctx);
    },
    canCompleteSheepShearer(ctx) {
        return canCompleteSheepShearer(ctx);
    },
    canCompleteATailOfTwoCats(ctx) {
        return canCompleteATailOfTwoCats(ctx);
    },
    canCompleteANightAtTheTheatre(ctx) {
        return canCompleteANightAtTheTheatre(ctx);
    },
    canCompleteThroneOfMiscellania(ctx) {
        return canCompleteThroneOfMiscellania(ctx);
    },
    hasLarransKey(ctx) {
        return has(ctx, 23490) && (isIronmanAccount(ctx.player) ? canTrainSlayer(ctx) : true);
    },
    canCompleteDeathPlateau(ctx) {
        return canCompleteDeathPlateau(ctx);
    },
    canCompleteJunglePotion(ctx) {
        return canCompleteJunglePotion(ctx);
    },
    canCompleteBeneathCursedSands(ctx) {
        return canCompleteBeneathCursedSands(ctx);
    },
    canCompleteTheHeartOfDarkness(ctx) {
        return canCompleteTheHeartOfDarkness(ctx);
    },
    canStartIcthlarinsLittleHelper(ctx) {
        return canStartIcthlarinsLittleHelper(ctx);
    },
    canCompleteIcthlarinsLittleHelper(ctx) {
        return canCompleteIcthlarinsLittleHelper(ctx);
    },
    canCompleteEadgarsRuse(ctx) {
        return canCompleteEadgarsRuse(ctx);
    },
    canCompleteCooksAssistant(ctx) {
        return canCompleteCooksAssistant(ctx);
    },
    canCompleteContact(ctx) {
        return canCompleteContact(ctx);
    },
    canCompleteClockTower(ctx) {
        return canCompleteClockTower(ctx);
    },
    canCompleteDruidicRitual(ctx) {
        return canCompleteDruidicRitual(ctx);
    },
    canCompleteDoricsQuest(ctx) {
        return canCompleteDoricsQuest(ctx);
    },
    canCompleteDemonSlayer(ctx) {
        return canCompleteDemonSlayer(ctx);
    },
    canCompleteCurrentAffairs(ctx) {
        return canCompleteCurrentAffairs(ctx);
    },
    canCompleteEnterTheAbyss(ctx) {
        return canCompleteEnterTheAbyss(ctx);
    },
    canCompleteForgettableTale(ctx) {
        return canCompleteForgettableTale(ctx);
    },
    canBuyFromGabootysStore(ctx) {
        return has(ctx, 6306) //
            && canCompleteJunglePotion(ctx);
    },
    canSellGemsToGabooty(ctx) {
        return hasAnyItems(ctx, [
            1629, // Uncut red topaz
            1625, // Uncut opal
            1627, // Uncut jade
            1611, // Jade
            1609, // Opal
            1613, // Red topaz
            6311  // Gout tuber
        ]);
    },
    canReachAbyssalSire(ctx) {
        return !ctx.filters.isSlayerLocked //
            && (canCompleteEnterTheAbyss(ctx)
                || canCompleteFairytaleIGrowingPains(ctx)
            );
    },
    canReachTrollheim(ctx) {
        return canReachTrollheim(ctx);
    },
    canGetBirdNestWyson(ctx) {
        return canGetBirdNestWyson(ctx);
    },
    canDoGuardiansOfTheRift(ctx) {
        return canDoGuardiansOfTheRift(ctx);
    },
    canTrainFarming(ctx) {
        return canTrainFarming(ctx);
    },
    canTrainFishing(ctx) {
        return canTrainFishing(ctx);
    },
    canTrainWoodcutting(ctx) {
        return canTrainWoodcutting(ctx);
    },
    canTrainMining(ctx) {
        return canTrainMining(ctx);
    },
    hasUsableAxe(ctx) {
        return hasUsableAxe(ctx);
    },
    hasUsablePickaxe(ctx) {
        return hasUsablePickaxe(ctx);
    },
    canTrainCooking(ctx) {
        return canTrainCooking(ctx);
    },
    canDoGnomeRestaurant(ctx) {
        return canDoGnomeRestaurant(ctx);
    },
    canDoValeTotems(ctx) {
        return canDoValeTotems(ctx);
    },
    canDoWintertodt(ctx) {
        return canDoWintertodt(ctx);
    },
    canDoHallowedSepulchre(ctx) {
        return canCompleteSinsOfTheFather(ctx);
    },
    canDoSalvaging(ctx) {
        return canDoSalvaging(ctx);
    },
    canCompleteMonkeyMadnessII(ctx) {
        return canCompleteMonkeyMadnessII(ctx);
    },
    canCompleteMonkeyMadnessI(ctx) {
        return canCompleteMonkeyMadnessI(ctx);
    },
    canCompletePryingTimes(ctx) {
        return canCompletePryingTimes(ctx);
    },
    canCompleteWitchsHouse(ctx) {
        return canCompleteWitchsHouse(ctx);
    },
    canDoMahoganyHomes(ctx) {
        return canDoMahoganyHomes(ctx);
    },
    canCompleteOneSmallFavour(ctx) {
        return canCompleteOneSmallFavour(ctx);
    },
    canMakePotLids(ctx) {
        return canMakePotLids(ctx);
    },
    canMakeGuthixRests(ctx) {
        return canMakeGuthixRests(ctx);
    },
    canCompletePriestInPeril(ctx) {
        return canCompletePriestInPeril(ctx);
    },
    canCompleteZogreFleshEaters(ctx) {
        return canCompleteZogreFleshEaters(ctx);
    },
    canStartZogreFleshEaters(ctx) {
        return canStartZogreFleshEaters(ctx);
    },
    canEnterKaruulmSlayerDungeon(ctx) {
        return canEnterKaruulmSlayerDungeon(ctx);
    },
    canCompleteTheHandInTheSand(ctx) {
        return canCompleteTheHandInTheSand(ctx);
    },
    canCompleteWaterfallQuest(ctx) {
        return canCompleteWaterfallQuest(ctx);
    },
    hasSardine(ctx) {
        return has(ctx, 327);
    },
    hasRedSpidersEggs(ctx) {
        return has(ctx, 223);
    },
    hasMoleParts(ctx) {
        return hasAnyItems(ctx, [7418, 7416]);
    },
    hasSinisterKey(ctx) {
        return has(ctx, 993);
    },
    hasEyeOfNewt(ctx) {
        return has(ctx, 221);
    },
    hasOpal(ctx) {
        return hasAnyItems(ctx, [1625, 1609]);
    },
    hasFeather(ctx) {
        return has(ctx, 314);
    },
    hasFacemask(ctx) {
        return has(ctx, 4164);
    },
    hasUnlitBugLantern(ctx) {
        return has(ctx, 7051);
    },
    hasBagOfSalt(ctx) {
        return has(ctx, 4161);
    },
    hasPileOfSalt(ctx) {
        return has(ctx, 4689);
    },
    hasBrineSabre(ctx) {
        return has(ctx, 11037);
    },
    canKillGargoyles(ctx) {
        return canKillGargoyles(ctx);
    },
    canKillFossilIslandWyverns(ctx) {
        return canKillFossilIslandWyverns(ctx);
    },
    hasAccessToWyvernProtection(ctx) {
        return hasAccessToWyvernProtection(ctx);
    },
    canTrainFletching(ctx) {
        return canTrainFletching(ctx);
    },
    canFishKarambwan(ctx) {
        return canFishKarambwan(ctx);
    },
    canTrainSmithing(ctx) {
        return canTrainSmithing(ctx);
    },
    canCompleteDwarfCannon(ctx) {
        return canCompleteDwarfCannon(ctx);
    },
    canCompleteTheKnightsSword(ctx) {
        return canCompleteTheKnightsSword(ctx);
    },
    canCompleteBarbarianTraining(ctx) {
        return canCompleteBarbarianTraining(ctx);
    },
    canCompleteTheRestlessGhost(ctx) {
        return true;
    },
    canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx) {
        return canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx);
    },
    canCompleteAlfredGrimhandsBarcrawl(ctx) {
        return canCompleteAlfredGrimhandsBarcrawl(ctx);
    },
    canCompleteTheIdesOfMilk(ctx) {
        return canCompleteTheIdesOfMilk(ctx);
    },
    canCompleteAnExistentialCrisis(ctx) {
        return canCompleteAnExistentialCrisis(ctx);
    },
    canCompleteImpendingChaos(ctx) {
        return canCompleteImpendingChaos(ctx);
    },
    canCompleteBurialAtSea(ctx) {
        return canCompleteBurialAtSea(ctx);
    },
    canCompleteTheRedReef(ctx) {
        return canCompleteTheRedReef(ctx);
    },
    canCompleteFamilyPest(ctx) {
        return canCompleteFamilyPest(ctx);
    },
    canCompleteTroubledTortugans(ctx) {
        return canCompleteTroubledTortugans(ctx);
    },
    canLongrange(ctx) {
        return canLongrange(ctx);
    },
    canCastStrikeSpells(ctx) {
        return canCastStrikeSpells(ctx);
    },
    canShortrange(ctx) {
        return canShortrange(ctx);
    },
    canSailToTheNorthernOcean(ctx) {
        return canSailToTheNorthernOcean(ctx);
    },
    canDoSailingCombat(ctx) {
        return canDoSailingCombat(ctx);
    },
    canEnterTheCharredDungeon(ctx) {
        return canEnterTheCharredDungeon(ctx);
    },
    canReachWyrmsTask(ctx) {
        return canReachWyrmsTask(ctx);
    },
    canSailToBrittleIsle(ctx) {
        return canSailToBrittleIsle(ctx);
    },
    canSailToGrimstone(ctx) {
        return canSailToGrimstone(ctx);
    },
    canEnterAncientCavern(ctx) {
        return canEnterAncientCavern(ctx);
    },
    canEnterKalphiteLair(ctx) {
        return canEnterKalphiteLair(ctx);
    },
    canKillKalphitesOutsideLair(ctx) {
        return canKillKalphitesOutsideLair(ctx);
    },
    canCompleteRoyalTrouble(ctx) {
        return canCompleteRoyalTrouble(ctx);
    },
    canCompleteTheTouristTrap(ctx) {
        return canCompleteTheTouristTrap(ctx);
    },
    canCompletePandemonium(ctx) {
        return canCompletePandemonium(ctx);
    },
    canCompleteEnchantedKey(ctx) {
        return canCompleteMakingHistory(ctx);
    },
    canStartLegendsQuest(ctx) {
        return canStartLegendsQuest(ctx);
    },
    canReachKharaziJungle(ctx) {
        return canReachKharaziJungle(ctx);
    },
    canEnterHardwoodGrove(ctx) {
        return canEnterHardwoodGrove(ctx);
    },
    canStartTheQueenOfThieves(ctx) {
        return canStartTheQueenOfThieves(ctx);
    },
    canCompleteTheQueenOfThieves(ctx) {
        canCompleteTheQueenOfThieves(ctx);
    },
    canCompleteTribalTotem(ctx) {
        return true;
    },
    canCompleteThePathOfGlouphrie(ctx) {
        return canCompleteThePathOfGlouphrie(ctx);
    },
    canCompleteSeaSlug(ctx) {
        return canCompleteSeaSlug(ctx);
    },
    canCompleteDaddysHome(ctx) {
        return canCompleteDaddysHome(ctx);
    },
    canCompleteSkippyAndTheMogres(ctx) {
        return canCompleteSkippyAndTheMogres(ctx);
    },
    canCompleteLegendsQuest(ctx) {
        return canCompleteLegendsQuest(ctx);
    },
    canCompleteFamilyCrest(ctx) {
        return canCompleteFamilyCrest(ctx);
    },
    canDoYama(ctx) {
        return canCompleteAKingdomDivided(ctx);
    },
    canDoNex(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canCompleteTheFrozenDoor(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canDoZulrah(ctx) {
        return canDoZulrah(ctx);
    },
    canStartAtFirstLight(ctx) {
        return canStartAtFirstLight(ctx);
    },
    canCompleteAtFirstLight(ctx) {
        return canCompleteAtFirstLight(ctx);
    },
    canCompleteColdWar(ctx) {
        return canCompleteColdWar(ctx);
    },
    canDoHuntersRumours(ctx) {
        return canTrainHunter(ctx);
    },
    canTrainHunter(ctx) {
        return canTrainHunter(ctx);
    },
    canCompleteTheDigSite(ctx) {
        return canCompleteTheDigSite(ctx);
    },
    canCompleteAnimalMagnetism(ctx) {
        return canCompleteAnimalMagnetism(ctx);
    },
    canCompleteDeathToTheDorgeshuun(ctx) {
        return canCompleteDeathToTheDorgeshuun(ctx);
    },
    canCompleteTheLostTribe(ctx) {
        return canCompleteTheLostTribe(ctx);
    },
    canCompletePerilousMoons(ctx) {
        return canCompletePerilousMoons(ctx);
    },
    canCompletePiratesTreasure(ctx) {
        return canCompletePiratesTreasure(ctx);
    },
    canFishFromRewardPool(ctx) {
        return canFishFromRewardPool(ctx);
    },
    canReachGemRocks(ctx) {
        return canReachGemRocks(ctx);
    },
    hasRawSwordfish(ctx) {
        return has(ctx, 371);
    },
    hasRawChicken(ctx) {
        return has(ctx, 2138);
    },
    hasGnomeSpice(ctx) {
        return has(ctx, 2169);
    },
    hasDragonClaws(ctx) {
        return has(ctx, 13652);
    },
    hasRunePlatelegs(ctx) {
        return has(ctx, 1079);
    },
    hasAdamantScimitar(ctx) {
        return has(ctx, 1331);
    },
    hasMithrilLimbs(ctx) {
        return has(ctx, 9427);
    },
    hasSteelDagger(ctx) {
        return has(ctx, 1207);
    },
    hasKwuarmPotionUnf(ctx) {
        return has(ctx, 105);
    },
    hasCowhide(ctx) {
        return has(ctx, 1739);
    },
    hasUnicornHorn(ctx) {
        return has(ctx, 237);
    },
    hasGiantFrogLegs(ctx) {
        return has(ctx, 4517);
    },
    hasRawCaveEel(ctx) {
        return has(ctx, 5001);
    },
    hasRawJubbly(ctx) {
        return has(ctx, 7566);
    },
    hasRawLobster(ctx) {
        return has(ctx, 377);
    },
    hasBirdhouse(ctx) {
        return has(ctx, 21512);
    },
    hasMagicBirdhouse(ctx) {
        return has(ctx, 22201);
    },
    hasMahoganyBirdhouse(ctx) {
        return has(ctx, 22195);
    },
    hasMapleBirdhouse(ctx) {
        return has(ctx, 22192);
    },
    hasOakBirdhouse(ctx) {
        return has(ctx, 21515);
    },
    hasRedwoodBirdhouse(ctx) {
        return has(ctx, 22204);
    },
    hasTeakBirdhouse(ctx) {
        return has(ctx, 21521);
    },
    hasWillowBirdhouse(ctx) {
        return has(ctx, 21518);
    },
    hasYewBirdhouse(ctx) {
        return has(ctx, 22198);
    },
    hasSteelArrow(ctx) {
        return has(ctx, 886);
    },
    hasMithrilArrow(ctx) {
        return has(ctx, 888);
    },
    hasSecateurs(ctx) {
        return has(ctx, 5329);
    },
    hasGardeningTrowel(ctx) {
        return has(ctx, 5325);
    },
    hasSaltpetre(ctx) {
        return has(ctx, 13421);
    },
    hasMuddyKey(ctx) {
        return has(ctx, 991);
    },
    canCompleteHauntedMine(ctx) {
        return canCompleteHauntedMine(ctx);
    },
    hasGrubbyKey(ctx) {
        return has(ctx, 23499);
    },
    hasLockpick(ctx) {
        return has(ctx, 1523);
    },
    hasSmallFishingNet(ctx) {
        return has(ctx, 303);
    },
    hasBigFishingNet(ctx) {
        return has(ctx, 305);
    },
    hasHarpoon(ctx) {
        return hasAnyItems(ctx, [311, 10129, 21028]);
    },
    has96FishingForBarbarianFishing(ctx) {
        return hasSkillLevel(ctx, "Fishing", 96);
    },
    canMakeTrawlingNet(ctx) {
        return canMakeTrawlingNet(ctx);
    },
    canDeepSeaFish(ctx) {
        return canDeepSeaFish(ctx);
    },
    hasAnyLantern(ctx) {
        return hasAnyLantern(ctx);
    },
    hasFishingRod(ctx) {
        return has(ctx, 307);
    },
    hasFishingBait(ctx) {
        return has(ctx, 313);
    },
    hasSandworms(ctx) {
        return has(ctx, 13431);
    },
    hasLobsterPot(ctx) {
        return has(ctx, 301);
    },
    hasFlyFishingRod(ctx) {
        return has(ctx, 309);
    },
    hasAnyFeather(ctx) {
        return hasAnyFeather(ctx);
    },
    hasAnyFeatherButStripy(ctx) {
        return hasAnyFeatherButStripy(ctx);
    },
    hasStripyFeather(ctx) {
        return has(ctx, 10087);
    },
    hasDarkFishingBait(ctx) {
        return has(ctx, 11940);
    },
    hasKarambwanVesselBaited(ctx) {
        return has(ctx, 3159);
    },
    canCompleteElementalWorkshopI(ctx) {
        return canCompleteElementalWorkshopI(ctx);
    },
    canCompleteElementalWorkshopII(ctx) {
        return canCompleteElementalWorkshopII(ctx);
    },
    canCompleteImpCatcher(ctx) {
        return canCompleteImpCatcher(ctx);
    },
    canAerialFish(ctx) {
        return hasAnyItems(ctx, [11334, 2162]);
    },
    canBarbarianFish(ctx) {
        return hasAnyItems(ctx, [314, 313, 11324, 11326]);
    },
    canReachFrogSpawnSpot(ctx) {
        return canCompleteBelowIceMountain(ctx) || canEnterLumbridgeSwampCaves(ctx);
    },
    hasOgreCoffinKey(ctx) {
        return has(ctx, 4850);
    },
    hasZombiePirateKey(ctx) {
        return has(ctx, 29449);
    },
    hasMirrorShield(ctx) {
        return has(ctx, 4156);
    },
    hasSpinyHelmet(ctx) {
        return has(ctx, 4551);
    },
    canMakeAdamantKeel(ctx) {
        return canMakeAdamantKeel(ctx);
    },
    hasNosePegOrCanLongRange(ctx) {
        return has(ctx, 4168) || canLongrange(ctx);
    },
    hasSlayerBell(ctx) {
        return has(ctx, 10952);
    },
    hasEarmuffs(ctx) {
        return has(ctx, 4166);
    },
    hasEarmuffsOrLongrange(ctx) {
        return has(ctx, 4166) || canLongrange(ctx);
    },
    hasCrystalKey(ctx) {
        return has(ctx, 989);
    },
    hasMachete(ctx) {
        return hasMachete(ctx);
    },
    hasSpade(ctx) {
        return has(ctx, 952);
    },
    hasBucket(ctx) {
        return has(ctx, 1925);
    },
    hasAvantoeSeed(ctx) {
        return has(ctx, 5298);
    },
    hasCadantineSeed(ctx) {
        return has(ctx, 5301);
    },
    hasDwarfWeedSeed(ctx) {
        return has(ctx, 5303);
    },
    hasGuamSeed(ctx) {
        return has(ctx, 5291);
    },
    hasHarralanderSeed(ctx) {
        return has(ctx, 5294);
    },
    hasHuascaSeed(ctx) {
        return has(ctx, 30088);
    },
    hasIritSeed(ctx) {
        return has(ctx, 5297);
    },
    hasKwuarmSeed(ctx) {
        return has(ctx, 5299);
    },
    hasLantadymeSeed(ctx) {
        return has(ctx, 5302);
    },
    hasMarrentillSeed(ctx) {
        return has(ctx, 5292);
    },
    hasRanarrSeed(ctx) {
        return has(ctx, 5295);
    },
    hasSnapdragonSeed(ctx) {
        return has(ctx, 5300);
    },
    hasTarrominSeed(ctx) {
        return has(ctx, 5293);
    },
    hasToadflaxSeed(ctx) {
        return has(ctx, 5296);
    },
    hasTorstolSeed(ctx) {
        return has(ctx, 5304);
    },
    hasAvantoe(ctx) {
        return has(ctx, 261);
    },
    hasCadantine(ctx) {
        return has(ctx, 265);
    },
    hasDwarfWeed(ctx) {
        return has(ctx, 267);
    },
    hasGuam(ctx) {
        return has(ctx, 249);
    },
    hasHarralander(ctx) {
        return has(ctx, 255);
    },
    hasHuasca(ctx) {
        return has(ctx, 30097);
    },
    hasIrit(ctx) {
        return has(ctx, 259);
    },
    hasKwuarm(ctx) {
        return has(ctx, 263);
    },
    hasLantadyme(ctx) {
        return has(ctx, 2481);
    },
    hasMarrentill(ctx) {
        return has(ctx, 251);
    },
    hasRanarr(ctx) {
        return has(ctx, 257);
    },
    hasSnapdragon(ctx) {
        return has(ctx, 3000);
    },
    hasTarromin(ctx) {
        return has(ctx, 253);
    },
    hasToadflax(ctx) {
        return has(ctx, 2998);
    },
    hasTorstol(ctx) {
        return has(ctx, 269);
    },
    hasWillowSapling(ctx) {
        return has(ctx, 5371);
    },
    hasOakSapling(ctx) {
        return has(ctx, 5370);
    },
    hasYewSapling(ctx) {
        return has(ctx, 5373);
    },
    hasMapleSapling(ctx) {
        return has(ctx, 5372);
    },
    hasMagicSapling(ctx) {
        return has(ctx, 5374);
    },
    hasRedwoodSapling(ctx) {
        return has(ctx, 22859);
    },
    hasTeakSapling(ctx) {
        return has(ctx, 21477);
    },
    hasMahoganySapling(ctx) {
        return has(ctx, 21480);
    },
    hasCamphorSapling(ctx) {
        return has(ctx, 31502);
    },
    hasIronwoodSapling(ctx) {
        return has(ctx, 31505);
    },
    hasRosewoodSapling(ctx) {
        return has(ctx, 31508);
    },
    hasBananaSapling(ctx) {
        return has(ctx, 5497);
    },
    hasAppleSapling(ctx) {
        return has(ctx, 5496);
    },
    hasCurrySapling(ctx) {
        return has(ctx, 5499);
    },
    hasOrangeSapling(ctx) {
        return has(ctx, 5498);
    },
    hasPalmSapling(ctx) {
        return has(ctx, 5502);
    },
    hasPapayaSapling(ctx) {
        return has(ctx, 5501);
    },
    hasPineappleSapling(ctx) {
        return has(ctx, 5500);
    },
    hasDragonfruitSapling(ctx) {
        return has(ctx, 22866);
    },
    hasCelastrusSapling(ctx) {
        return has(ctx, 22856);
    },
    hasGrapeSeed(ctx) {
        return has(ctx, 13657);
    },
    hasMarigoldSeed(ctx) {
        return has(ctx, 5096);
    },
    hasNasturtiumSeed(ctx) {
        return has(ctx, 5098);
    },
    hasRosemarySeed(ctx) {
        return has(ctx, 5097);
    },
    hasWoadSeed(ctx) {
        return has(ctx, 5099);
    },
    hasLimpwurtSeed(ctx) {
        return has(ctx, 5100);
    },
    hasPotatoSeed(ctx) {
        return has(ctx, 5318);
    },
    hasOnionSeed(ctx) {
        return has(ctx, 5319);
    },
    hasCabbageSeed(ctx) {
        return has(ctx, 5324);
    },
    hasTomatoSeed(ctx) {
        return has(ctx, 5322);
    },
    hasSweetcornSeed(ctx) {
        return has(ctx, 5320);
    },
    hasStrawberrySeed(ctx) {
        return has(ctx, 5323);
    },
    hasWatermelonSeed(ctx) {
        return has(ctx, 5321);
    },
    hasSnapeGrassSeed(ctx) {
        return has(ctx, 22879);
    },
    hasBarleySeed(ctx) {
        return has(ctx, 5305);
    },
    hasJuteSeed(ctx) {
        return has(ctx, 5306);
    },
    hasHammerstoneSeed(ctx) {
        return has(ctx, 5307);
    },
    hasAsgarnianSeed(ctx) {
        return has(ctx, 5308);
    },
    hasYanillianSeed(ctx) {
        return has(ctx, 5309);
    },
    hasKrandorianSeed(ctx) {
        return has(ctx, 5310);
    },
    hasWildbloodSeed(ctx) {
        return has(ctx, 5311);
    },
    hasRedberrySeed(ctx) {
        return has(ctx, 5101);
    },
    hasCadavaberrySeed(ctx) {
        return has(ctx, 5102);
    },
    hasDwellberrySeed(ctx) {
        return has(ctx, 5103);
    },
    hasJangerberrySeed(ctx) {
        return has(ctx, 5104);
    },
    hasWhiteberrySeed(ctx) {
        return has(ctx, 5105);
    },
    hasPoisonIvySeed(ctx) {
        return has(ctx, 5106);
    },
    hasMushroomSpore(ctx) {
        return has(ctx, 5282);
    },
    hasSeaweedSpore(ctx) {
        return has(ctx, 21490);
    },
    hasCactusSeed(ctx) {
        return has(ctx, 5280);
    },
    hasPotatoCactusSeed(ctx) {
        return has(ctx, 22873);
    },
    hasCalquatSapling(ctx) {
        return has(ctx, 5503);
    },
    hasWhiteLilySeed(ctx) {
        return has(ctx, 22887);
    },
    hasCottonSeed(ctx) {
        return has(ctx, 31545);
    },
    hasHempSeed(ctx) {
        return has(ctx, 31543);
    },
    hasElkhornFrag(ctx) {
        return has(ctx, 31511);
    },
    hasPillarFrag(ctx) {
        return has(ctx, 31513);
    },
    hasUmbralFrag(ctx) {
        return has(ctx, 31515);
    },
    hasCupOfTea(ctx) {
        return hasCupOfTea(ctx);
    },
    hasLeatherGloves(ctx) {
        return has(ctx, 1059);
    },
    hasSlashWeapon(ctx) {
        return hasSlashWeapon(ctx);
    },
    hasSlashWeaponOrKnife(ctx) {
        return hasSlashWeaponOrKnife(ctx);
    },
    hasDriftNet(ctx) {
        return has(ctx, 21652);
    },
    hasNumulite(ctx) {
        return has(ctx, 21555);
    },
    hasHammer(ctx) {
        return has(ctx, 2347);
    },
    hasOyster(ctx) {
        return has(ctx, 407);
    },
    hasRope(ctx) {
        return has(ctx, 954);
    },
    hasCasket(ctx) {
        return has(ctx, 405);
    },
    hasPoison(ctx) {
        return has(ctx, 273);
    },
    hasAnyGuthixBalance(ctx) {
        return hasAnyGuthixBalance(ctx);
    },
    hasAnySerum207(ctx) {
        return hasAnySerum207(ctx);
    },
    canPlantTrees(ctx) {
        return canPlantTrees(ctx);
    },
    canPlantHardwoodTrees(ctx) {
        return canPlantHardwoodTrees(ctx);
    },
    canPlantPlants(ctx) {
        return canPlantPlants(ctx);
    },
    hasHunterMeat(ctx) {
        return hasHunterMeat(ctx);
    },
    hasAirRuneSource(ctx) {
        return hasAirRuneSource(ctx);
    },
    hasWaterRuneSource(ctx) {
        return hasWaterRuneSource(ctx);
    },
    hasEarthRuneSource(ctx) {
        return hasEarthRuneSource(ctx);
    },
    hasFireRuneSource(ctx) {
        return hasFireRuneSource(ctx);
    },
    canEnterGodWarsDungeon(ctx) {
        return canEnterGodWarsDungeon(ctx);
    },
    canDoCommanderZilyana(ctx) {
        return canDoCommanderZilyana(ctx);
    },
    canDoGeneralGraardor(ctx) {
        return canDoGeneralGraardor(ctx);
    },
    canDoKreearra(ctx) {
        return canDoKreearra(ctx);
    },
    canDoKrilTsutsaroth(ctx) {
        return canDoKrilTsutsaroth(ctx);
    },
    canDoNex(ctx) {
        return canDoNex(ctx);
    },
    canCompleteBarbarianHerblore(ctx) {
        return canCompleteBarbarianHerblore(ctx);
    },
    canCompleteBarbarianSmithing(ctx) {
        return canCompleteBarbarianSmithing(ctx);
    },
    canCompleteBarbarianFishing(ctx) {
        return canCompleteBarbarianFishing(ctx);
    },
    canCompleteBarbarianFarming(ctx) {
        return canCompleteBarbarianFarming(ctx);
    },
    hasTinderbox(ctx) {
        return has(ctx, 590);
    },
    canCompleteBarbarianFiremaking1(ctx) {
        return canCompleteBarbarianFiremaking1(ctx);
    },
    canAssignWaterfiendsBarbarianFiremaking1(ctx) {
        return hasBarbarianFiremakingTraining(ctx.player);
    },
    hasAntiDragonShieldForDragonSlayerTasks(ctx) {
        return hasObtainedItem(ctx, 1540);
    },
    canCompleteBarbarianFiremaking2(ctx) {
        return canCompleteBarbarianFiremaking2(ctx);
    },
    canTrainHerblore(ctx) {
        return canTrainHerblore(ctx);
    },
    canTrainPrayer(ctx) {
        return canTrainPrayer(ctx);
    },
    canTrainCrafting(ctx) {
        return canTrainCrafting(ctx);
    },
    canTrainFiremaking(ctx) {
        return canTrainFiremaking(ctx);
    },
    canBurnLoarShades(ctx) {
        return canBurnLoarShades(ctx);
    },
    canBurnPhrinShades(ctx) {
        return canBurnPhrinShades(ctx);
    },
    canBurnRiylShades(ctx) {
        return canBurnRiylShades(ctx);
    },
    canBurnAsynShades(ctx) {
        return canBurnAsynShades(ctx);
    },
    canBurnFiyrShades(ctx) {
        return canBurnFiyrShades(ctx);
    },
    canBurnUriumShades(ctx) {
        return canBurnUriumShades(ctx);
    },
    hasFremennikIslesStartingOres(ctx) {
        return hasFremennikIslesStartingOres(ctx);
    },
    canUseFairyRings(ctx) {
        return canCompleteFairytaleIGrowingPains(ctx);
    },
    hasBlightedIceSack(ctx) {
        return has(ctx, 24607);
    },
    hasIceBarrageRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 560)  // Death rune
            && has(ctx, 565); // Blood rune
    },
    hasFaladorTeleportRunes(ctx) {
        return hasElementalRuneSources(ctx, ["water", "air"]) //
            && has(ctx, 563); // Law rune
    },
    hasVarrockTeleportRunes(ctx) {
        return hasElementalRuneSources(ctx, ["fire", "air"]) //
            && has(ctx, 563); // Law rune
    },
    hasLumbridgeTeleportRunes(ctx) {
        return hasElementalRuneSources(ctx, ["earth", "air"]) //
            && has(ctx, 563); // Law rune
    },
    hasCamelotTeleportRunes(ctx) {
        return hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasTrollheimTeleportRunes(ctx) {
        return hasFireRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasWaterbirthIslandTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 9075) // Astral rune
            && has(ctx, 563); // Law rune
    },
    hasCatherbyTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 9075) // Astral rune
            && has(ctx, 563); // Law rune
    },
    hasGhorrockTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasHumidifyRunes(ctx) {
        return hasElementalRuneSources(ctx, ["water", "fire"]) //
            && has(ctx, 9075); // Astral rune
    },
    hasTelegrabRunes(ctx) {
        return hasTelegrabRunes(ctx);
    },
    hasChargeWaterOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasWaterRuneSource(ctx);
    },
    hasChargeEarthOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasEarthRuneSource(ctx);
    },
    hasChargeAirOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasAirRuneSource(ctx);
    },
    hasMonsterExamineRunes(ctx) {
        return has(ctx, 564)  // Cosmic rune
            && has(ctx, 9075) // Astral rune
            && has(ctx, 558); // Mind rune
    },
    hasApeAtollTeleportRunes(ctx) {
        return hasElementalRuneSources(ctx, ["fire", "water"]) //
            && has(ctx, 563); // Law rune
    },
    hasApeAtollStandardTeleportRunes(ctx) {
        return hasAnyItems(ctx, [566, 30843]) // Soul rune or Aether rune
            && has(ctx, 565)  // Blood rune
            && has(ctx, 563); // Law rune
    },
    hasLvl4EnchantRunes(ctx) {
        return hasAnyItems(ctx, [564, 30843]) // Cosmic rune or Aether rune
            && hasEarthRuneSource(ctx);
    },
    hasTeleportToPaddewwaRunes(ctx) {
        return hasElementalRuneSources(ctx, ["fire", "air"]) //
            && has(ctx, 563); // Law rune
    },
    hasPlankMakeRunes(ctx) {
        return has(ctx, 9075) // Astral rune
            && has(ctx, 561); // Nature rune
    },
    canCastFertileSoil(ctx) {
        return has(ctx, 561)  // Nature rune
            && has(ctx, 9075) // Astral rune
            && hasEarthRuneSource(ctx);
    },
    canEnterMindAltar(ctx) {
        return canEnterMindAltar(ctx);
    },
    canEnterAirAltar(ctx) {
        return canEnterAirAltar(ctx);
    },
    canEnterWaterAltar(ctx) {
        return canEnterWaterAltar(ctx);
    },
    canEnterEarthAltar(ctx) {
        return canEnterEarthAltar(ctx);
    },
    canEnterChaosAltar(ctx) {
        return canEnterChaosAltar(ctx);
    },
    canEnterNatureAltar(ctx) {
        return canEnterNatureAltar(ctx);
    },
    canEnterNatureAltarNoGuardiansOfTheRift(ctx) {
        return canEnterNatureAltarNoGuardiansOfTheRift(ctx);
    },
    canEnterFireAltar(ctx) {
        return canEnterFireAltar(ctx);
    },
    canEnterCosmicAltar(ctx) {
        return canEnterCosmicAltar(ctx);
    },
    canGetFishbowlWithWater(ctx) {
        return canGetFishbowlWithWater(ctx);
    },
    canKillMogreSailing(ctx) {
        return canKillMogreSailing(ctx);
    },
    hasBonesForBonesToPeaches(ctx) {
        return hasBonesForBonesToPeaches(ctx);
    },
    hasAFullBarrowsSet(ctx) {
        return hasAFullBarrowsSet(ctx);
    },
    never(ctx) {
        return false;
    }
};

function canCompleteAKingdomDivided(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheDepthsOfDespair", canCompleteTheDepthsOfDespair), //
        requiresQuest(ctx, "canCompleteTheQueenOfThieves", canCompleteTheQueenOfThieves), //
        requiresQuest(ctx, "canCompleteTheAscentOfArceuus", canCompleteTheAscentOfArceuus), //
        requiresQuest(ctx, "canCompleteTheForsakenTower", canCompleteTheForsakenTower), //
        requiresQuest(ctx, "canCompleteTaleOfTheRighteous", canCompleteTaleOfTheRighteous), //
        hasSkillLevel(ctx, "Agility", 54), //
        hasSkillLevel(ctx, "Thieving", 52), //
        hasSkillLevel(ctx, "Woodcutting", 52), //
        hasSkillLevel(ctx, "Herblore", 50), //
        hasSkillLevel(ctx, "Mining", 42), //
        hasSkillLevel(ctx, "Crafting", 38), //
        hasSkillLevel(ctx, "Magic", 35), //
        hasElementalRuneSources(ctx, ["air", "fire"]), //
        hasAnyItems(ctx, [558, 562, 560, 565]),
        hasAnyItems(ctx, [133, 2432]),
        hasAnyItems(ctx, [2126, 4164]),
        has(ctx, 1775), // Molten glass
        has(ctx, 1755), // Chisel
        hasUsableAxe(ctx),
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteAlfredGrimhandsBarcrawl(ctx) {
    return true;
}

function canCompleteTheIdesOfMilk(ctx) {
    return true;
}

function canCompleteAnExistentialCrisis(ctx) {
    return false; // TODO
}

function canCompleteANightAtTheTheatre(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteATasteOfHope", canCompleteATasteOfHope), //
        has(ctx, 8794), // Saw
    ]);
}

function canCompleteAnimalMagnetism(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 18),
        hasSkillLevel(ctx, "Crafting", 19),
        hasSkillLevel(ctx, "Ranged", 30),
        hasSkillLevel(ctx, "Woodcutting", 35),
        requiresQuest(ctx, "canCompleteErnestTheChicken", canCompleteErnestTheChicken), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 1355), // Mithril axe
        has(ctx, 2351), // Iron bar
        has(ctx, 2347), // Hammer
        has(ctx, 1743), // Hard leather
        has(ctx, 1718), // Holy symbol
        has(ctx, 10496), // Polished buttons
        has(ctx, 1931), // Pot
    ]);
}

function canCompleteAnotherSliceOfHAM(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Attack", 15),
        hasSkillLevel(ctx, "Prayer", 25),
        requiresQuest(ctx, "canCompleteDeathToTheDorgeshuun", canCompleteDeathToTheDorgeshuun), //
        requiresQuest(ctx, "canCompleteTheGiantDwarf", canCompleteTheGiantDwarf), //
        requiresQuest(ctx, "canCompleteTheDigSite", canCompleteTheDigSite), //
    ]); //
}

function canCompleteAPorcineOfInterest(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteASoulsBane(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteATailOfTwoCats(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteIcthlarinsLittleHelper", canCompleteIcthlarinsLittleHelper), //
        has(ctx, 560), // Death rune
        has(ctx, 1897), // Chocolate cake
        has(ctx, 1511), // Logs
        has(ctx, 590), // Tinderbox
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1735), // Shears
        has(ctx, 5318), // Potato seed
        has(ctx, 5341), // Rake
        has(ctx, 227), // Vial of water
        hasAnyItems(ctx, [1833, 540]), //
        hasAnyItems(ctx, [1835, 538]), // Desert robe or Druid's robe
    ]);
}

function canCompleteATasteOfHope(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 48),
        hasSkillLevel(ctx, "Agility", 45),
        hasSkillLevel(ctx, "Attack", 40),
        hasSkillLevel(ctx, "Herblore", 40),
        hasSkillLevel(ctx, "Slayer", 38),
        requiresQuest(ctx, "canCompleteDarknessOfHallowvale", canCompleteDarknessOfHallowvale), //
        has(ctx, 1605), // Emerald
        has(ctx, 1755), // Chisel
        has(ctx, 233), // Pestle and mortar
        has(ctx, 227), // Vial of water
        hasAnyItems(ctx, [946, 2961]), // Knife or Silver sickle
    ]);
}

function canCompleteAtFirstLight(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 46),
        hasSkillLevel(ctx, "Herblore", 30),
        hasSkillLevel(ctx, "Construction", 27),
        requiresQuest(ctx, "canCompleteEaglesPeak", canCompleteEaglesPeak), //
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun), //
        has(ctx, 4055), // Toy mouse (wound)
        has(ctx, 29166), // Jerboa tail
        has(ctx, 2347), // Hammer
    ]);
}

function canCompleteBarbarianFarming(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 15),
        canPlantTrees(ctx), //
        hasAnySapling(ctx),
    ]);
}

function canCompleteBarbarianFiremaking1(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 35),
        has(ctx, 1521), // Oak logs
    ]);
}

function canCompleteBarbarianFiremaking2(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteBarbarianFiremaking1", canCompleteBarbarianFiremaking1), //
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx),
    ]);
}

function canCompleteBarbarianFishing(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fishing", 55),
        hasSkillLevel(ctx, "Agility", 15),
        hasSkillLevel(ctx, "Strength", 35),
        hasAnyItems(ctx, [313, 314, 11334, 11324, 11326]),
        hasAnyFeather(ctx),
    ]);
}

function canCompleteBarbarianHerblore(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 4),
        requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual), //
        requiresQuest(ctx, "canCompleteBarbarianFiremaking1", canCompleteBarbarianFiremaking1), //
        requiresQuest(ctx, "canCompleteBarbarianFishing", canCompleteBarbarianFishing), //
        has(ctx, 123), // Attack potion(2)
        hasAnyItems(ctx, [11324, 11326]), // Roe or Caviar
    ]);
}

function canCompleteBarbarianSmithing(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 5),
        requiresQuest(ctx, "canCompleteBarbarianFishing", canCompleteBarbarianFishing), //
        requiresQuest(ctx, "canCompleteTaiBwoWannaiTrio", canCompleteTaiBwoWannaiTrio), //
        ( //
            (has(ctx, 2349) && has(ctx, 1511)) // Bronze bar & Logs
            || (has(ctx, 2351) && has(ctx, 1521)) // Iron bar & Oak Logs
            || (has(ctx, 2353) && has(ctx, 1519)) // Steel bar & Willow Logs
            || (has(ctx, 2359) && has(ctx, 1517)) // Mithril bar & Maple Logs
            || (has(ctx, 2361) && has(ctx, 1515)) // Adamantite bar & Yew Logs
            || (has(ctx, 2363) && has(ctx, 1513)) // Runite bar & Magic Logs
        ),
    ]);
}

function canCompleteBarbarianTraining(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteBarbarianFishing", canCompleteBarbarianFishing), //
        requiresQuest(ctx, "canCompleteBarbarianFiremaking2", canCompleteBarbarianFiremaking2), //
        requiresQuest(ctx, "canCompleteBarbarianFarming", canCompleteBarbarianFarming), //
        requiresQuest(ctx, "canCompleteBarbarianSmithing", canCompleteBarbarianSmithing), //
        requiresQuest(ctx, "canCompleteBarbarianHerblore", canCompleteBarbarianHerblore), //
    ]);
}

function canCompleteBearYourSoul(ctx) {
    return has(ctx, 952); // Spade
}

function canCompleteBelowIceMountain(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 16), //
        has(ctx, 2142), // Cooked meat
        has(ctx, 2309), // Bread
        hasKnifeOrNarwhalKnife(ctx), // Knife or Narwhal knife
        hasAnyItems(ctx, [1917, 1905, 1913, 1907]), // Beer, Asgarnian ale, Dwarven stout or Wizard's mind bomb
    ]);
}

function canCompleteBeneathCursedSands(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 62),
        hasSkillLevel(ctx, "Crafting", 55),
        hasSkillLevel(ctx, "Firemaking", 55),
        requiresQuest(ctx, "canCompleteContact", canCompleteContact), //
        has(ctx, 453), // Coal
        has(ctx, 2351), // Iron bar
        has(ctx, 590), // Tinderbox
        has(ctx, 952), // Spade
        hasAnyItems(ctx, [2136, 2134, 2132, 2138, 3226, 25833, 1859, 9978]),
    ]);
}

function canCompleteBetweenARock(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Defence", 30),
        hasSkillLevel(ctx, "Mining", 40),
        hasSkillLevel(ctx, "Smithing", 50),
        requiresQuest(ctx, "canCompleteDwarfCannon", canCompleteDwarfCannon), //
        requiresQuest(ctx, "canCompleteFishingContest", canCompleteFishingContest), //
        has(ctx, 2357), // Gold bar
        has(ctx, 2347), // Hammer
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteBigChompyBirdHunting(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fletching", 5),
        hasSkillLevel(ctx, "Cooking", 30),
        hasSkillLevel(ctx, "Ranged", 30),
        has(ctx, 314), // Feather
        hasKnifeOrNarwhalKnife(ctx), // Knife
        has(ctx, 1755), // Chisel
        has(ctx, 1965), // Cabbage
        has(ctx, 1982), // Tomato
        has(ctx, 1957), // Onion
        has(ctx, 1942), // Potato
        has(ctx, 2128), // Equa leaves
        has(ctx, 1573), // Doogle leaves
        has(ctx, 2862), // Achey tree logs
        has(ctx, 2864), // Ogre arrow shaft
        has(ctx, 2865), // Flighted ogre arrow
        has(ctx, 2859), // Wolf bones
        has(ctx, 2861), // Wolfbone arrowtips
        has(ctx, 2866), // Ogre arrow
        has(ctx, 2876), // Raw chompy
    ]);
}

async function canCompleteVarrockDiaryHard(ctx) {
    return await canCompleteDiaryTier(ctx, "Varrock", "Easy")
        && await canCompleteDiaryTier(ctx, "Varrock", "Medium")
        && await canCompleteDiaryTier(ctx, "Varrock", "Hard");
}

function canCompleteBiohazard(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompletePlagueCity", canCompletePlagueCity), //
        has(ctx, 428), // Priest gown (bottom)
        has(ctx, 426), // Priest gown (top)
    ]);
}

function canCompleteBlackKnightsFortress(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 12), //
        has(ctx, 1965), // Cabbage
        (
            // Original route: bronze med helm + iron chainbody
            (
                has(ctx, 1101) // Iron chainbody
                && has(ctx, 1139) // Bronze med helm
            )
            // Alternative route: any black full helm + platebody + platelegs (including (t)/(g))
            || (
                hasAnyItems(ctx, [1165, 2595, 2587]) // Black full helm / (g) / (t)
                && hasAnyItems(ctx, [1125, 2591, 2583]) // Black platebody / (g) / (t)
                && hasAnyItems(ctx, [1077, 2593, 2585]) // Black platelegs / (g) / (t)
            )
        ),
    ]);
}

function canCompleteBoneVoyage(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheDigSite", canCompleteTheDigSite), //
        has(ctx, 2015), // Vodka
        has(ctx, 93)   // Marrentill potion (unf)
        // 100 kudos needed
        // 28 kudos from natural history museum quiz
        , // 50 from cleaning finds
        has(ctx, 1059), // Leather gloves
        has(ctx, 1061) // Leather boots
        , // 22 kudos needed = 5 quests
        countCompletableKudosquests(ctx) >= 5,
    ]);
}

function canCompleteBurialAtSea(ctx) {
    return false; // TODO
}

function canCompleteCabinFever(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 42),
        hasSkillLevel(ctx, "Crafting", 45),
        hasSkillLevel(ctx, "Smithing", 50),
        hasSkillLevel(ctx, "Ranged", 40),
        requiresQuest(ctx, "canCompletePiratesTreasure", canCompletePiratesTreasure), //
        requiresQuest(ctx, "canCompleteRumDeal", canCompleteRumDeal), //
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 1941), // Swamp paste
        has(ctx, 954), // Rope
    ]);
}

function canCompleteChildrenOfTheSun(ctx) {
    return true;
}

function canCompleteClientOfKourend(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteXMarksTheSpot", canCompleteXMarksTheSpot), //
        hasAnyFeather(ctx),
    ]);
}

function canCompleteClockTower(ctx) {
    return allTrue([
        (hasAnyItems(ctx, [1929, 1937]) // Bucket of water or Jug of water
            || hasUsablePickaxe(ctx)) // Ice gloves
    ]);
}

function canCompleteColdWar(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 10),
        hasSkillLevel(ctx, "Agility", 30),
        hasSkillLevel(ctx, "Crafting", 30),
        hasSkillLevel(ctx, "Construction", 34),
        hasSkillLevel(ctx, "Thieving", 15),
        has(ctx, 8778), // Oak plank
        has(ctx, 1539), // Steel nails
        has(ctx, 2347), // Hammer
        has(ctx, 952), // Spade
        has(ctx, 8792), // Clockwork
        has(ctx, 960), // Plank
        has(ctx, 950), // Silk
        (has(ctx, 341) || requiresQuest(ctx, "canCompleteGardenOfTranquillity", canCompleteGardenOfTranquillity)), // Raw cod or Ring of Charos (a)
        has(ctx, 1939), // Swamp tar
        has(ctx, 8782), // Mahogany plank
        has(ctx, 1741), // Leather
        has(ctx, 2347), // Hammer
        has(ctx, 314), // Feather
    ]);
}

function canCompleteContact(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompletePrinceAliRescue", canCompletePrinceAliRescue), //
        requiresQuest(ctx, "canCompleteIcthlarinsLittleHelper", canCompleteIcthlarinsLittleHelper), //
    ]);
}

function hasBucketOfMilkIfF2P(ctx) {
    return !ctx.filters?.isFreeToPlay || has(ctx, 1927); // Bucket of milk
}

function canCompleteCooksAssistant(ctx) {
    return allTrue([
        has(ctx, 1944), // Egg
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1933), // Pot of flour
    ]);
}

function canCompleteCreatureOfFenkenstrain(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Thieving", 25),
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 2355), // Silver bar
        has(ctx, 1794), // Bronze wire
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        has(ctx, 952), // Spade
    ]);
}

function canCompleteCurrentAffairs(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Sailing", 22),
        hasSkillLevel(ctx, "Fishing", 10),
        requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium), //
        has(ctx, 973), // Charcoal
    ]);
}

function canCompleteCurseOfTheEmptyLord(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 31),
        hasSkillLevel(ctx, "Thieving", 53),
        requiresQuest(ctx, "canGetRingOfVisibility", canGetRingOfVisibility), //
    ]);
}

function canGetRingOfVisibility(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheDigSite", canCompleteTheDigSite), //
        requiresQuest(ctx, "canCompleteTempleOfIkov", canCompleteTempleOfIkov), //
        requiresQuest(ctx, "canCompleteTheTouristTrap", canCompleteTheTouristTrap), //
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest), //
        has(ctx, 1513), // Magic logs
        has(ctx, 1775), // Molten glass
        has(ctx, 2353), // Steel bar
        has(ctx, 592), // Ashes
        has(ctx, 565), // Blood rune
        has(ctx, 526), // Bones
        has(ctx, 973), // Charcoal
        has(ctx, 1523), // Lockpick
    ]);
}

function canCompleteDaddysHome(ctx) {
    return allTrue([
        has(ctx, 960), // Plank
        has(ctx, 8790), // Bolt of cloth
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
    ]);
}

function canCompleteDarknessOfHallowvale(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 5),
        hasSkillLevel(ctx, "Mining", 20),
        hasSkillLevel(ctx, "Thieving", 22),
        hasSkillLevel(ctx, "Agility", 26),
        hasSkillLevel(ctx, "Crafting", 32),
        hasSkillLevel(ctx, "Magic", 33),
        hasSkillLevel(ctx, "Strength", 40),
        requiresQuest(ctx, "canCompleteInAidOfTheMyreque", canCompleteInAidOfTheMyreque), //
        hasAnyNails(ctx), //
        has(ctx, 960), // Plank
        has(ctx, 2347), // Hammer
        hasKnifeOrNarwhalKnife(ctx), // Knife
        hasAirRuneSource(ctx), //
        has(ctx, 563), // Law rune
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteDeathPlateau(ctx) {
    return allTrue([
        has(ctx, 2309), // Bread
        has(ctx, 333), // Trout
        has(ctx, 2351), // Iron bar
        has(ctx, 1905), // Asgarnian ale
        has(ctx, 3105), // Climbing boots
    ]);
}

function canCompleteDeathToTheDorgeshuun(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 23),
        hasSkillLevel(ctx, "Thieving", 23),
        requiresQuest(ctx, "canCompleteTheLostTribe", canCompleteTheLostTribe), //
        has(ctx, 4310), // Ham boots
        has(ctx, 4304), // Ham cloak
        has(ctx, 4308), // Ham gloves
        has(ctx, 4302), // Ham hood
        has(ctx, 4306), // Ham logo
        has(ctx, 4300), // Ham robe
        has(ctx, 4298), // Ham shirt
    ]);
}

function canCompleteDefenderOfVarrock(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 55),
        hasSkillLevel(ctx, "Hunter", 52),
        requiresQuest(ctx, "canCompleteTempleOfIkov", canCompleteTempleOfIkov), //
        requiresQuest(ctx, "canCompleteBelowIceMountain", canCompleteBelowIceMountain), //
        requiresQuest(ctx, "canCompleteFamilyCrest", canCompleteFamilyCrest), //
        requiresQuest(ctx, "canCompleteGardenOfTranquillity", canCompleteGardenOfTranquillity), //
        requiresQuest(ctx, "canCompleteWhatLiesBelow", canCompleteWhatLiesBelow), //
        requiresQuest(ctx, "canCompleteRomeoAndJuliet", canCompleteRomeoAndJuliet), //
        requiresQuest(ctx, "canCompleteDemonSlayer", canCompleteDemonSlayer), //
        hasUsablePickaxe(ctx),
    ]);
}

function canCompleteDemonSlayer(ctx) {
    const hasWaterForF2P = hasAnyItems(ctx, [
        1929, // Bucket of water
        1937, // Jug of water
        1921, // Bowl of water
        227,  // Vial of water
    ]);

    return allTrue([
        has(ctx, 526), // Bones
        ctx.filters?.isFreeToPlay ? hasWaterForF2P : true,
    ]);
}

function canCompleteDesertTreasureI(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheDigSite", canCompleteTheDigSite), //
        requiresQuest(ctx, "canCompleteTempleOfIkov", canCompleteTempleOfIkov), //
        requiresQuest(ctx, "canCompleteTheTouristTrap", canCompleteTheTouristTrap), //
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest), //
        canReachTrollheim(ctx),
        hasAnyItems(ctx, [2126, 4164]),
        has(ctx, 1513), // Magic logs
        has(ctx, 1775), // Molten glass
        has(ctx, 2353), // Steel bar
        has(ctx, 592), // Ashes
        has(ctx, 565), // Blood rune
        has(ctx, 526), // Bones
        has(ctx, 973), // Charcoal
        has(ctx, 2355), // Silver bar
        has(ctx, 4668), // Garlic powder
        has(ctx, 2007), // Spice
        has(ctx, 3107), // Spiked boots
        has(ctx, 1523), // Lockpick
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteDesertTreasureII(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteDesertTreasureI", canCompleteDesertTreasureI), //
        requiresQuest(ctx, "canCompleteSecretsOfTheNorth", canCompleteSecretsOfTheNorth), //
        requiresQuest(ctx, "canCompleteEnakhrasLament", canCompleteEnakhrasLament), //
        requiresQuest(ctx, "canCompleteTempleOfTheEye", canCompleteTempleOfTheEye), //
        requiresQuest(ctx, "canCompleteGardenOfDeath", canCompleteGardenOfDeath), //
        requiresQuest(ctx, "canCompleteBelowIceMountain", canCompleteBelowIceMountain), //
        requiresQuest(ctx, "canCompleteHisFaithfulServants", canCompleteHisFaithfulServants), //
        has(ctx, 560), // Death rune
        has(ctx, 565), // Blood rune
        has(ctx, 562), // Chaos rune
        has(ctx, 566), // Soul rune
        hasElementalRuneSources(ctx, ["air", "water", "fire"]), //
        has(ctx, 590), // Tinderbox
        has(ctx, 4164), // Facemask
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteDeviousMinds(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 65),
        hasSkillLevel(ctx, "Runecraft", 50),
        hasSkillLevel(ctx, "Fletching", 50),
        requiresQuest(ctx, "canCompleteWanted", canCompleteWanted), //
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        requiresQuest(ctx, "canCompleteDoricsQuest", canCompleteDoricsQuest), //
        has(ctx, 1315), // Mithril 2h sword
        has(ctx, 1777), // Bow string
    ]);
}

function canCompleteDoricsQuest(ctx) {
    return allTrue([
        has(ctx, 440), // Iron ore
        has(ctx, 436), // Copper ore
        has(ctx, 434), // Clay
    ]);
}

function canCompleteDragonSlayerI(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 32), //
        has(ctx, 1791), // Unfired bowl
        has(ctx, 1761), // Soft clay
        has(ctx, 1907), // Wizards mind bomb
        has(ctx, 301), // Lobster pot
        has(ctx, 950), // Silk
        has(ctx, 1540), // Anti-dragon shield
        has(ctx, 2347), // Hammer
        has(ctx, 1539), // Steel nails
        has(ctx, 960), // Plank
    ]);
}

function canCompleteDragonSlayerII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 75),
        hasSkillLevel(ctx, "Smithing", 70),
        hasSkillLevel(ctx, "Mining", 68),
        hasSkillLevel(ctx, "Crafting", 62),
        hasSkillLevel(ctx, "Agility", 60),
        hasSkillLevel(ctx, "Thieving", 60),
        hasSkillLevel(ctx, "Construction", 50),
        hasSkillLevel(ctx, "Hitpoints", 50),
        hasQuestPoints(ctx, 200), //
        requiresQuest(ctx, "canCompleteLegendsQuest", canCompleteLegendsQuest), //
        requiresQuest(ctx, "canCompleteDreamMentor", canCompleteDreamMentor), //
        requiresQuest(ctx, "canCompleteATailOfTwoCats", canCompleteATailOfTwoCats), //
        requiresQuest(ctx, "canCompleteAnimalMagnetism", canCompleteAnimalMagnetism), //
        requiresQuest(ctx, "canCompleteGhostsAhoy", canCompleteGhostsAhoy), //
        requiresQuest(ctx, "canCompleteBoneVoyage", canCompleteBoneVoyage), //
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend), //
        canEnterAncientCavern(ctx), //
        has(ctx, 8778), // Oak plank
        has(ctx, 1941), // Swamp paste
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 975), // Machete
        has(ctx, 8794), // Saw
        has(ctx, 1615), // Dragonstone
        has(ctx, 1775), // Molten glass
        has(ctx, 1785), // Glassblowing pipe
        has(ctx, 952), // Spade
        has(ctx, 9075), // Astral rune
        has(ctx, 590), // Tinderbox
        has(ctx, 233), // Pestle and mortar
        hasElementalRuneSources(ctx, ["fire", "air"]), //
        has(ctx, 565), // Blood rune
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteDreamMentor(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteLunarDiplomacy", canCompleteLunarDiplomacy), //
        requiresQuest(ctx, "canCompleteEadgarsRuse", canCompleteEadgarsRuse), //
        has(ctx, 9075), // Astral rune
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteDruidicRitual(ctx) {
    return allTrue([
        has(ctx, 2136), // Raw bear meat
        has(ctx, 2134), // Raw rat meat
        has(ctx, 2132), // Raw beef
        has(ctx, 2138), // Raw chicken
    ]);
}

function canCompleteDwarfCannon(ctx) {
    return has(ctx, 2347); // Hammer
}

function canCompleteEadgarsRuse(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 31),
        requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual), //
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        has(ctx, 3105), // Climbing boots
        has(ctx, 2015), // Vodka
        has(ctx, 2116), // Pineapple chunks
        has(ctx, 1511), // Logs
        has(ctx, 1947), // Grain
        has(ctx, 2138), // Raw chicken
        has(ctx, 233), // Pestle and mortar
        has(ctx, 99), // Rannar potion (unf)
    ]);
}

function canCompleteEaglesPeak(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 27),
        has(ctx, 1765), // Yellow dye
        has(ctx, 1939), // Swamp tar
    ]);
}

function canCompleteElementalWorkshopI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 20),
        hasSkillLevel(ctx, "Crafting", 20),
        has(ctx, 2347), // Hammer
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        has(ctx, 1741), // Leather
        has(ctx, 453), // Coal
    ]);
}

function canCompleteElementalWorkshopII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 20),
        hasSkillLevel(ctx, "Smithing", 30),
        requiresQuest(ctx, "canCompleteElementalWorkshopI", canCompleteElementalWorkshopI),
    ]);
}

function canCompleteEnakhrasLament(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 50),
        hasSkillLevel(ctx, "Firemaking", 45),
        hasSkillLevel(ctx, "Prayer", 43),
        hasSkillLevel(ctx, "Magic", 39),
        has(ctx, 1755), // Chisel
        has(ctx, 590), // Tinderbox
        has(ctx, 36), // Candle
        has(ctx, 1511), // Logs
        has(ctx, 1521), // Oak logs
        has(ctx, 1519), // Willow logs
        has(ctx, 1517), // Maple logs
        has(ctx, 1761), // Soft clay
        has(ctx, 453), // Coal
        hasAnyItems(ctx, [6977, 6971, 6973, 6975]),
        has(ctx, 6983), // Granite (5kg)
        hasElementalRuneSources(ctx, ["air", "fire", "earth"]), //
        has(ctx, 562), // Chaos rune
    ]);
}

function canCompleteEnlightenedJourney(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 20),
        hasSkillLevel(ctx, "Farming", 30),
        hasSkillLevel(ctx, "Crafting", 36),
        hasQuestPoints(ctx, 20), //
        has(ctx, 970), // Papyrus
        has(ctx, 1759), // Ball of wool
        has(ctx, 5438), // Potatoes(10)
        has(ctx, 5418), // Empty sack
        hasCandle(ctx), //
        has(ctx, 1765), // Yellow dye
        has(ctx, 1763), // Red dye
        has(ctx, 950), // Silk
        has(ctx, 1923), // Bowl
        has(ctx, 1511), // Logs
        has(ctx, 1511), // Logs
        has(ctx, 5933), // Willow branch
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteEnterTheAbyss(ctx) {
    return requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries);
}

function canCompleteErnestTheChicken(ctx) {
    return allTrue([
        has(ctx, 952), // Spade
        has(ctx, 272), // Fish food
        has(ctx, 273), // Poison (item)
    ]);
}

function canCompleteEthicallyAcquiredAntiquities(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 25),
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun), //
        requiresQuest(ctx, "canCompleteShieldOfArrav", canCompleteShieldOfArrav),
    ]);
}

function canCompleteFairytaleIGrowingPains(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteLostCity", canCompleteLostCity), //
        requiresQuest(ctx, "canCompleteNatureSpirit", canCompleteNatureSpirit), //
        has(ctx, 5329), // Secateurs
        has(ctx, 952)  // Spade
        , // TODO other item reqs?
    ]);
}

function canCompleteFairytaleIICureAQueen(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 40),
        hasSkillLevel(ctx, "Farming", 49),
        hasSkillLevel(ctx, "Herblore", 57),
        requiresQuest(ctx, "canCompleteFairytaleIGrowingPains", canCompleteFairytaleIGrowingPains), //
        has(ctx, 227), // Vial of water
    ]);
}

function canCompleteFamilyCrest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 40),
        hasSkillLevel(ctx, "Smithing", 40),
        hasSkillLevel(ctx, "Magic", 59),
        hasSkillLevel(ctx, "Crafting", 40),
        has(ctx, 315), // Shrimps
        has(ctx, 329), // Salmon
        has(ctx, 361), // Tuna
        has(ctx, 365), // Bass
        has(ctx, 373), // Swordfish
        has(ctx, 1603), // Ruby
        has(ctx, 1592), // Ring mould
        has(ctx, 1597), // Necklace mould
        has(ctx, 560), // Death rune
        hasElementalRuneSources(ctx, ["air", "water", "earth", "fire"]), //
        hasAnyItems(ctx, [185, 183, 181, 2448, 11475, 11473, 11435, 11433, 179, 177, 175, 2446, 5949, 5947, 5945, 5943, 5958, 5956, 5954, 5952, 11503, 11501, 10931, 10929, 10927, 10925, 464, 29784, 12911, 12909, 12907, 12905, 12919, 12917, 12915, 12913, 29833, 29830, 29827, 29824]),
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteFamilyPest(ctx) {
    return requiresQuest(ctx, "canCompleteFamilyCrest", canCompleteFamilyCrest);
}

function canCompleteFightArena(ctx) {
    return true;
}

function canCompleteFishingContest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fishing", 10),
        has(ctx, 1550), // Garlic
        has(ctx, 307), // Fishing rod
        has(ctx, 952), // Spade
    ]);
}

function canCompleteForgettableTale(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheGiantDwarf", canCompleteTheGiantDwarf), //
        requiresQuest(ctx, "canCompleteFishingContest", canCompleteFishingContest), //
        has(ctx, 6008), // Barley malt
        has(ctx, 1929), // Bucket of water
        has(ctx, 5341), // Rake
        has(ctx, 5767), // Ale yeast
        has(ctx, 1971), // Kebab
        has(ctx, 1917), // Beer
        has(ctx, 1919), // Beer glass
    ]);
}

function canCompleteGardenOfDeath(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 20),
        has(ctx, 5329),
    ]);
}

function canCompleteGardenOfTranquillity(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteCreatureOfFenkenstrain", canCompleteCreatureOfFenkenstrain), //
        has(ctx, 5341), // Rake
        has(ctx, 952),  // Spade
        has(ctx, 5329), // Secateurs
        has(ctx, 5331), // Watering can
        has(ctx, 5325), // Gardening trowel
        has(ctx, 6036), // Plant cure
        has(ctx, 5096), // Marigold seed
        has(ctx, 5324), // Cabbage seed
        has(ctx, 5319), // Onion seed
        has(ctx, 2347), // Hammer
        hasAnyItems(ctx, [7936, 1436]),
        has(ctx, 233),  // Pestle and mortar
        has(ctx, 5354), // Filled plant pot
        hasAnyItems(ctx, [6032, 6034, 21483]), // Compost, Supercompost or Ultracompost
    ]);
}

function canCompleteGertrudesCat(ctx) {
    return allTrue([
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1552), // Seasoned sardine
        has(ctx, 327),  // Raw sardine
        has(ctx, 1573), // Doogle leaves
    ]);
}

function canCompleteGettingAhead(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 30),
        hasSkillLevel(ctx, "Construction", 26),
        hasAnyItems(ctx, [948, 6814, 958]),
        has(ctx, 1761), // Soft clay
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 960), // Plank
        hasAnyNails(ctx), //
        has(ctx, 1763), // Red dye
        has(ctx, 1933), // Pot of flour
        hasKnifeOrNarwhalKnife(ctx), // Knife
    ]);
}

function canCompleteGhostsAhoy(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Cooking", 20),
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 950), // Silk
        has(ctx, 1763), // Red dye
        has(ctx, 1765), // Yellow dye
        has(ctx, 1767), // Blue dye
        has(ctx, 952), // Spade
        has(ctx, 845), // Oak longbow
        has(ctx, 1921), // Bowl of water for Nettle tea
        hasKnifeOrNarwhalKnife(ctx), // Knife
    ]);
}

function canCompleteGoblinDiplomacy(ctx) {
    return allTrue([
        has(ctx, 288), // Goblin mail
        has(ctx, 1769), // Orange dye
        has(ctx, 1767), // Blue dye
    ]);
}

function canCompleteGrimTales(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 45),
        hasSkillLevel(ctx, "Herblore", 52),
        hasSkillLevel(ctx, "Thieving", 58),
        hasSkillLevel(ctx, "Agility", 59),
        hasSkillLevel(ctx, "Woodcutting", 71),
        requiresQuest(ctx, "canCompleteWitchsHouse", canCompleteWitchsHouse), //
        has(ctx, 95), // Tarromin potion (unf)
        hasUsableAxe(ctx),
    ]);
}

function canCompleteHauntedMine(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 35),
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 1755), // Chisel
    ]);
}

function canCompleteHazeelCult(ctx) {
    if (isHazeelCultLocked(ctx)) {
        return has(ctx, 273); // Poison (item)
    }
    return true;
}

function isHazeelCultLocked(ctx) {
    const poisonItemId = 273;
    const obtained = ctx?.obtained || [];
    const rolled = ctx?.rolled || [];

    return obtained.includes(poisonItemId) && !rolled.includes(poisonItemId);
}

function canCompleteHeroesQuest(ctx) {
    const heroesQuestGang = ctx.filters?.heroesQuestGang ?? "phoenix";
    const isBlackArmGang = heroesQuestGang === "black_arm";
    const gangRequirement = isBlackArmGang
        ? (
            has(ctx, 1165) // Black full helm
            && has(ctx, 1125) // Black platebody
            && has(ctx, 1077) // Black platelegs
        )
        : canShortrange(ctx);
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 53),
        hasSkillLevel(ctx, "Fishing", 53),
        hasSkillLevel(ctx, "Herblore", 25),
        hasSkillLevel(ctx, "Mining", 50),
        hasQuestPoints(ctx, 55), //
        requiresQuest(ctx, "canCompleteLostCity", canCompleteLostCity), //
        requiresQuest(ctx, "canCompleteMerlinsCrystal", canCompleteMerlinsCrystal), //
        requiresQuest(ctx, "canCompleteDragonSlayerI", canCompleteDragonSlayerI), //
        has(ctx, 307), // Fishing rod
        has(ctx, 313), // Fishing bait
        has(ctx, 97), // Harralander potion (unf)
        has(ctx, 255), // Harralander
        has(ctx, 227), // Vial of water
        gangRequirement,
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteHisFaithfulServants(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 952), // Spade
    ]);
}

function canCompleteHolyGrail(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Attack", 20),
        requiresQuest(ctx, "canCompleteMerlinsCrystal", canCompleteMerlinsCrystal),
    ]);
}

function canCompleteHopespearsWill(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 50),
        requiresQuest(ctx, "canCompleteTheRestlessGhost", canCompleteTheRestlessGhost), //
        requiresQuest(ctx, "canCompleteDesertTreasureI", canCompleteDesertTreasureI), //
        requiresQuest(ctx, "canCompleteFairytaleIICureAQueen", canCompleteFairytaleIICureAQueen), //
        requiresQuest(ctx, "canCompleteLandOfTheGoblins", canCompleteLandOfTheGoblins), //
        has(ctx, 3002), // Toadflax potion (unf)
    ]);
}

function canCompleteHorrorFromTheDeep(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 35),
        has(ctx, 556), // Air rune
        has(ctx, 555), // Water rune
        has(ctx, 557), // Earth rune
        has(ctx, 554)  // Fire rune
        , // This assumes ice arrows can be used and swords/longsword from an event/castle wars
        has(ctx, 1775), // Molten glass
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 1539), // Steel nails
        has(ctx, 1939), // Swamp tar
        has(ctx, 960), // Plank
    ]);
}

function canCompleteIcthlarinsLittleHelper(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteGertrudesCat", canCompleteGertrudesCat), //
        has(ctx, 590), // Tinderbox
        has(ctx, 1519), // Willow logs
        (has(ctx, 4161) || (has(ctx, 1925) && has(ctx, 4689))), // Bag of salt or (Bucket and Pile of salt)
        has(ctx, 4687), // Bucket of sap
        has(ctx, 1823), // Waterskin(4)
        has(ctx, 4684), // Linen
    ]);
}

function canCompleteImpCatcher(ctx) {
    return allTrue([
        has(ctx, 1470), // Red bead
        has(ctx, 1472), // Yellow bead
        has(ctx, 1474), // Black bead
        has(ctx, 1476), // White bead
    ]);
}

function canCompleteImpendingChaos(ctx) {
    return false; // TODO
}

function canCompleteInAidOfTheMyreque(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Crafting", 25),
        hasSkillLevel(ctx, "Mining", 15),
        hasSkillLevel(ctx, "Magic", 7),
        requiresQuest(ctx, "canCompleteInSearchOfTheMyreque", canCompleteInSearchOfTheMyreque), //
        has(ctx, 952), // Spade
        has(ctx, 1925), // Bucket
        has(ctx, 2347), // Hammer
        has(ctx, 960), // Plank
        hasAnyNails(ctx), //
        has(ctx, 1941), // Swamp paste
        hasAnyItems(ctx, [353, 355, 3363, 3365, 3367]),
        has(ctx, 1351), // Bronze axe
        has(ctx, 590), // Tinderbox
        has(ctx, 2353), // Steel bar
        has(ctx, 453), // Coal
        has(ctx, 1761), // Soft clay
        has(ctx, 2355), // Silver bar
        has(ctx, 2359), // Mithril bar
        has(ctx, 1607), // Sapphire
        has(ctx, 954), // Rope
        hasUsablePickaxe(ctx),
    ]);
}

function canCompleteInSearchOfKnowledge(ctx) {
    return hasAnyCookedMeatFish(ctx) //
        || hasAnyItems(ctx, [6701, 1965]); // Baked potato or Cabbage
}

function canCompleteInSearchOfTheMyreque(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        requiresQuest(ctx, "canCompleteNatureSpirit", canCompleteNatureSpirit), //
        has(ctx, 1295), // Steel longsword
        has(ctx, 1281), // Stel sword
        has(ctx, 1424), // Steel mace
        has(ctx, 1339), // Steel warhammer
        has(ctx, 1207), // Steel dagger
        has(ctx, 1539), // Steel nails
        has(ctx, 2347), // Hammer
        has(ctx, 960), // Plank
    ]);
}

function canCompleteIntoTheTombs(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteBeneathCursedSands", canCompleteBeneathCursedSands), //
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteJunglePotion(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 3),
        requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual),
    ]);
}

function canCompleteKingsRansom(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 45),
        hasSkillLevel(ctx, "Defence", 65),
        requiresQuest(ctx, "canCompleteBlackKnightsFortress", canCompleteBlackKnightsFortress), //
        requiresQuest(ctx, "canCompleteHolyGrail", canCompleteHolyGrail), //
        requiresQuest(ctx, "canCompleteMurderMystery", canCompleteMurderMystery), //
        requiresQuest(ctx, "canCompleteOneSmallFavour", canCompleteOneSmallFavour), //
        hasAnyItems(ctx, [6979, 6981, 6983]),
        hasTelegrabRunes(ctx), //
        (
            requiresQuest(ctx, "canCompleteWhileGuthixSleeps", canCompleteWhileGuthixSleeps) // For full Elite black armour
            || (
                hasAnyItems(ctx, [1165, 2587, 2595]) // Black full helm, Black full helm (t) or Black full helm (g)
                && hasAnyItems(ctx, [1125, 2583, 2591]) // Black platebody, Black platebody (t) or Black platebody (g)
                && hasAnyItems(ctx, [1077, 2585, 2593, 1089, 3472, 3473]) // Black platelegs, Black platelegs (t), Black platelegs (g), Black plateskirt, Black plateskirt (t) or Black plateskirt (g)
            )
        ), //
        has(ctx, 1139), // Bronze med helm
        has(ctx, 1101), // Iron chainbody
    ]);
}

function canCompleteLairOfTarnRazorlor(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 40),
        requiresQuest(ctx, "canCompleteHauntedMine", canCompleteHauntedMine), //
    ]);
}

function canCompleteLandOfTheGoblins(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 38),
        hasSkillLevel(ctx, "Fishing", 40),
        hasSkillLevel(ctx, "Thieving", 45),
        hasSkillLevel(ctx, "Herblore", 48),
        requiresQuest(ctx, "canCompleteAnotherSliceOfHAM", canCompleteAnotherSliceOfHAM), //
        requiresQuest(ctx, "canCompleteFishingContest", canCompleteFishingContest), //
        has(ctx, 3002), // Toadflax potion (unf)
        has(ctx, 288), // Goblin mail
        has(ctx, 1765), // Yellow dye
        has(ctx, 1767), // Blue dye
        has(ctx, 1769), // Orange dye
        has(ctx, 1773), // Purple dye
        has(ctx, 229), // Vial
        has(ctx, 233), // Pestle and mortar
        has(ctx, 3379), // Raw slimy eel
        has(ctx, 307), // Fishing rod
    ]);
}

function canCompleteLegendsQuest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 50),
        hasSkillLevel(ctx, "Crafting", 50),
        hasSkillLevel(ctx, "Herblore", 45),
        hasSkillLevel(ctx, "Magic", 56),
        hasSkillLevel(ctx, "Mining", 52),
        hasSkillLevel(ctx, "Prayer", 42),
        hasSkillLevel(ctx, "Smithing", 50),
        hasSkillLevel(ctx, "Strength", 50),
        hasSkillLevel(ctx, "Thieving", 50),
        hasSkillLevel(ctx, "Woodcutting", 50),
        hasQuestPoints(ctx, 107), //
        requiresQuest(ctx, "canCompleteFamilyCrest", canCompleteFamilyCrest), //
        requiresQuest(ctx, "canCompleteHeroesQuest", canCompleteHeroesQuest), //
        requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage), //
        requiresQuest(ctx, "canCompleteUndergroundPass", canCompleteUndergroundPass), //
        requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest), //
        hasMachete(ctx), //
        has(ctx, 2357), // Gold bar
        has(ctx, 2347), // Hammer
        has(ctx, 954), // Rope
        hasAnyItems(ctx, [1359, 6739]),
        has(ctx, 973), // Charcoal
        has(ctx, 970), // Papyrus
        has(ctx, 1523), // Lockpick
        has(ctx, 227), // Vial of water
        has(ctx, 1607), // Sapphire
        has(ctx, 1605), // Emerald
        has(ctx, 1603), // Ruby
        has(ctx, 1601), // Diamond
        has(ctx, 1611), // Jade
        has(ctx, 1609), // Opal
        has(ctx, 1613), // Red topaz
        has(ctx, 566), // Soul rune
        has(ctx, 558), // Mind rune
        has(ctx, 563), // Law rune
        has(ctx, 557), // Earth rune
        has(ctx, 567), // Unpowered orb
        has(ctx, 564), // Cosmic rune
        (hasAirRuneSource(ctx) || hasFireRuneSource(ctx) || hasWaterRuneSource(ctx)), //
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteLostCity(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 31),
        hasSkillLevel(ctx, "Woodcutting", 36),
        hasAnyItems(ctx, [1351, 1353, 1361, 1357, 1359]), // Bronze axe, Steel axe, Black axe, Adamant axe, Rune axe (clue boxes)
        hasKnifeOrNarwhalKnife(ctx), // Knife or Narwhal knife
    ]);
}

function canCompleteLunarDiplomacy(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 5),
        hasSkillLevel(ctx, "Crafting", 61),
        hasSkillLevel(ctx, "Defence", 40),
        hasSkillLevel(ctx, "Firemaking", 49),
        hasSkillLevel(ctx, "Magic", 65),
        hasSkillLevel(ctx, "Mining", 60),
        hasSkillLevel(ctx, "Woodcutting", 55),
        requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials), //
        requiresQuest(ctx, "canCompleteLostCity", canCompleteLostCity), //
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage), //
        has(ctx, 590), // Tinderbox
        has(ctx, 249), // Guam leaf
        has(ctx, 251), // Marrentill
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2347), // Hammer
        has(ctx, 952), // Spade
        has(ctx, 4548), // Bullseye lantern
        hasUsableAxe(ctx), //
        hasUsablePickaxe(ctx), //
        (canDoGuardiansOfTheRift(ctx) //
            || requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
            || (
                hasAnyItems(ctx, [1438, 5527]) // Air talisman or Air tiara
                && hasAnyItems(ctx, [1444, 5531]) // Water talisman or Water tiara
                && hasAnyItems(ctx, [1440, 5535]) // Earth talisman or Earth tiara
                && hasAnyItems(ctx, [1442, 5537]) // Fire talisman or Fire tiara
            )
        ),
    ]);
}

function canCompleteMageArenaI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 60),
        hasAirRuneSource(ctx), //
        hasAnyItems(ctx, [
            558,
            562,
            560,
            565,
        ]),
    ]);
}

function canCompleteMageArenaII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 75),
        requiresQuest(ctx, "canCompleteMageArenaI", canCompleteMageArenaI), //
        has(ctx, 565), // Blood rune
        hasElementalRuneSources(ctx, ["air", "fire"]), //
    ]);
}

function canCompleteMakingFriendsWithMyArm(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 66),
        hasSkillLevel(ctx, "Mining", 72),
        hasSkillLevel(ctx, "Construction", 35),
        hasSkillLevel(ctx, "Agility", 68),
        requiresQuest(ctx, "canCompleteMyArmsBigAdventure", canCompleteMyArmsBigAdventure), //
        requiresQuest(ctx, "canCompleteSwanSong", canCompleteSwanSong), //
        requiresQuest(ctx, "canCompleteColdWar", canCompleteColdWar), //
        requiresQuest(ctx, "canCompleteRomeoAndJuliet", canCompleteRomeoAndJuliet), //
        has(ctx, 1925), // Bucket
        has(ctx, 8794), // Saw
        has(ctx, 8790), // Bolt of cloth
        has(ctx, 8782), // Mahogany plank
        has(ctx, 753), // Cadava berries
        has(ctx, 1929), // Bucket of water
        has(ctx, 2347), // Hammer
        has(ctx, 954), // Rope
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteMakingHistory(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril),
        has(ctx, 1694), // Sapphire amulet
        has(ctx, 952), // Spade
    ]);
}

function canCompleteMeatAndGreet(ctx) {
    return requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun);
}

function canCompleteMerlinsCrystal(ctx) {
    return allTrue([
        has(ctx, 2309), // Bread
        has(ctx, 590), // Tinderbox
        has(ctx, 30), // Bucket of wax
        has(ctx, 530), // Bat bones
    ]);
}

function canCompleteMisthalinMystery(ctx) {
    return allTrue([
        has(ctx, 1925), // Bucket
        has(ctx, 590), // Tinderbox
        hasKnifeOrNarwhalKnife(ctx), // Knife
    ]);
}

function canCompleteMonkeyMadnessI(ctx) {
    const hasMonkeyBones = hasItem(ctx, 3183, { trackMissing: false });
    const junglePotionPathCtx = {
        ...ctx,
        suppressMissing: true,
        missing: null
    };
    const canUseJunglePotionPath = canCompleteJunglePotion(junglePotionPathCtx);
    const hasMonkeyBonesOrJunglePotionPath = hasMonkeyBones || canUseJunglePotionPath;
    if (!hasMonkeyBonesOrJunglePotionPath) {
        addMissingItemOptionGroup(ctx, [[3183], ["Monkey corpse (Jungle potion required)"]]);
    }

    return allTrue([
        requiresQuest(ctx, "canCompleteTheGrandTree", canCompleteTheGrandTree), //
        requiresQuest(ctx, "canCompleteTreeGnomeVillage", canCompleteTreeGnomeVillage), //
        has(ctx, 2357), // Gold bar
        has(ctx, 1759), // Ball of wool
        has(ctx, 1963), // Bananas
        hasMonkeyBonesOrJunglePotionPath, // Monkey bones OR Jungle Potion path
    ]);
}

function canCompleteMonkeyMadnessII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 69),
        hasSkillLevel(ctx, "Crafting", 70),
        hasSkillLevel(ctx, "Hunter", 60),
        hasSkillLevel(ctx, "Agility", 55),
        hasSkillLevel(ctx, "Thieving", 55),
        hasSkillLevel(ctx, "Firemaking", 60),
        requiresQuest(ctx, "canCompleteEnlightenedJourney", canCompleteEnlightenedJourney), //
        has(ctx, 1513), // Magic logs
        requiresQuest(ctx, "canCompleteTheEyesOfGlouphrie", canCompleteTheEyesOfGlouphrie), //
        requiresQuest(ctx, "canCompleteRFDFreeingKingAwowogei", canCompleteRFDFreeingKingAwowogei), //
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        has(ctx, 2102), // Lemon
        has(ctx, 1987), // Grapes
        has(ctx, 1511), // Logs
        has(ctx, 2347), // Hammer
        has(ctx, 1755), // Chisel
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteMonksFriend(ctx) {
    return allTrue([
        has(ctx, 1937), // Jug of water
        hasAnyItems(ctx, [1511, 960]), // Logs or Plank
    ]);
}

function canCompleteMountainDaughter(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 20),
        has(ctx, 954), // Rope
        has(ctx, 960), // Plank
        hasUsablePickaxe(ctx),
    ]);
}

function canCompleteMourningsEndPartI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Ranged", 60),
        hasSkillLevel(ctx, "Thieving", 50),
        canStartMourningsEndPartI(ctx), //
        has(ctx, 948), // Bear fur
        has(ctx, 950), // Silk
        has(ctx, 1763), // Red dye
        has(ctx, 1765), // Yellow dye
        has(ctx, 1771), // Green dye
        has(ctx, 1767), // Blue dye
        has(ctx, 1929), // Bucket of water
        has(ctx, 314), // Feather
        hasAnyItems(ctx, [2217, 2243]),
        has(ctx, 1513), // Magic logs
        has(ctx, 1741), // Leather
        has(ctx, 3216), // Barrel
        has(ctx, 453), // Coal
    ]);
}

function canCompleteMourningsEndPartII(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteMourningsEndPartI", canCompleteMourningsEndPartI), //
        has(ctx, 1755), // Chisel
        has(ctx, 954), // Rope
        hasDeathTalismanSource(ctx),
    ]);
}

function canCompleteMurderMystery(ctx) {
    return has(ctx, 1933); // Pot of flour
}

function canCompleteMyArmsBigAdventure(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 29),
        hasSkillLevel(ctx, "Woodcutting", 10),
        requiresQuest(ctx, "canCompleteEadgarsRuse", canCompleteEadgarsRuse), //
        requiresQuest(ctx, "canCompleteTheFeud", canCompleteTheFeud), //
        requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion), //
        hasMachete(ctx), //
        has(ctx, 1925), // Bucket
        has(ctx, 6034), // Supercompost
        has(ctx, 952), // Spade
        has(ctx, 5341), // Rake
        has(ctx, 5343), // Seed dibber
        canReachTrollheim(ctx),
    ]);
}

function canCompleteNatureSpirit(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        hasAnyItems(ctx, [2970, 2974, 2972]),
        has(ctx, 2961), // Silver sickle
        has(ctx, 2355), // Silver bar
        has(ctx, 2976), // Sickle mould
    ]);
}

function canCompleteObservatoryQuest(ctx) {
    return allTrue([
        has(ctx, 2349), // Bronze bar
        has(ctx, 1775), // Molten glass
        has(ctx, 960), // Plank
    ]);
}

function canCompleteOlafsQuest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 40),
        hasSkillLevel(ctx, "Woodcutting", 50),
        requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials),
        has(ctx, 590), // Tinderbox
        has(ctx, 952), // Spade
        has(ctx, 954), // Rope
        hasUsableAxe(ctx),
    ]);
}

function canCompleteOneSmallFavour(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 36),
        hasSkillLevel(ctx, "Crafting", 25),
        hasSkillLevel(ctx, "Herblore", 18),
        hasSkillLevel(ctx, "Smithing", 30),
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage), //
        has(ctx, 2353), // Steel bar
        has(ctx, 2349), // Bronze bar
        has(ctx, 2351), // Iron bar
        has(ctx, 1755), // Chisel
        has(ctx, 4419), // Guthix rest(3)
        has(ctx, 2347), // Hammer
        has(ctx, 1931), // Pot
        has(ctx, 1761), // Soft clay
        has(ctx, 1609), // Opal
        has(ctx, 1611), // Jade
        has(ctx, 1613), // Red topaz
        has(ctx, 1607), // Sapphire
        has(ctx, 4436), // Airtight pot
    ]);
}

function canCompletePandemonium(ctx) {
    return allTrue([
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
    ]);
}

function canCompletePerilousMoons(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 48),
        hasSkillLevel(ctx, "Hunter", 20),
        hasSkillLevel(ctx, "Fishing", 20),
        hasSkillLevel(ctx, "Runecraft", 20),
        hasSkillLevel(ctx, "Construction", 10),
        canStartPerilousMoons(ctx), //
        hasKnifeOrNarwhalKnife(ctx), // Knife
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 1444), // Water talisman
        has(ctx, 1440), // Earth talisman
        has(ctx, 305), // Big fishing net
        has(ctx, 954), // Rope
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompletePiratesTreasure(ctx) {
    return allTrue([
        has(ctx, 1005), // White apron
        has(ctx, 952), // Spade
        has(ctx, 1963), // Banana
    ]);
}

function canCompletePlagueCity(ctx) {
    return allTrue([
        has(ctx, 2126), // Dwellberries
        has(ctx, 952), // Spade
        has(ctx, 1929), // Bucket of water
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1975), // Chocolate dust
        has(ctx, 231), // Snape grass
        has(ctx, 954), // Rope
    ]);
}

function canCompletePriestInPeril(ctx) {
    return allTrue([
        has(ctx, 1925), // Bucket
        hasAnyItems(ctx, [7936, 1436]),
    ]);
}

function canCompletePrinceAliRescue(ctx) {
    return allTrue([
        has(ctx, 1761), // Soft clay
        has(ctx, 1759), // Ball of wool
        has(ctx, 1765), // Yellow dye
        has(ctx, 1951), // Redberries
        has(ctx, 592), // Ashes
        hasAnyItems(ctx, [1929, 1937, 1921]),
        has(ctx, 1933), // Pot of flour
        has(ctx, 2349), // Bronze bar
        has(ctx, 1013), // Pink skirt
        has(ctx, 1917), // Beer
        has(ctx, 954), // Rope
    ]);
}

function canCompletePryingTimes(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 30),
        hasSkillLevel(ctx, "Sailing", 12),
        requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium), //
        requiresQuest(ctx, "canCompleteTheKnightsSword", canCompleteTheKnightsSword), //
        has(ctx, 2347), // Hammer
        has(ctx, 2325), // Redberry pie
        has(ctx, 2353), // Steel bar
    ]);
}

function canCompleteRagAndBoneManI(ctx) {
    return allTrue([
        has(ctx, 1931), // Pot
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx),
    ]);
}

function canCompleteRagAndBoneManII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 40),
        hasSkillLevel(ctx, "Defence", 20),
        requiresQuest(ctx, "canCompleteRagAndBoneManI", canCompleteRagAndBoneManI), //
        has(ctx, 1931), // Pot
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx), //
        (requiresQuest(ctx, "canCompleteSkippyAndTheMogres", canCompleteSkippyAndTheMogres) || canShortrange(ctx)), //
        (canStartZogreFleshEaters(ctx) || (hasTelegrabRunes(ctx) && canShortrange(ctx))), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        requiresQuest(ctx, "canCompleteCreatureOfFenkenstrain", canCompleteCreatureOfFenkenstrain), //
        canEnterLumbridgeSwampCaves(ctx), //
    ]);
}

function canCompleteRatcatchers(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteIcthlarinsLittleHelper", canCompleteIcthlarinsLittleHelper), //
        has(ctx, 1985), // Cheese
        has(ctx, 251), // Marrentill
        has(ctx, 235), // Unicorn horn dust
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 6055), // Weeds
        has(ctx, 1931), // Pot
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteRecipeForDisaster(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteRFDFreeingTheMountainDwarf", canCompleteRFDFreeingTheMountainDwarf), //
        requiresQuest(ctx, "canCompleteRFDFreeingTheGoblinGenerals", canCompleteRFDFreeingTheGoblinGenerals), //
        requiresQuest(ctx, "canCompleteRFDFreeingPiratePete", canCompleteRFDFreeingPiratePete), //
        requiresQuest(ctx, "canCompleteRFDFreeingTheLumbridgeGuide", canCompleteRFDFreeingTheLumbridgeGuide), //
        requiresQuest(ctx, "canCompleteRFDFreeingEvilDave", canCompleteRFDFreeingEvilDave), //
        requiresQuest(ctx, "canCompleteRFDFreeingSkrachUglologwee", canCompleteRFDFreeingSkrachUglologwee), //
        requiresQuest(ctx, "canCompleteRFDFreeingSirAmikVarse", canCompleteRFDFreeingSirAmikVarse), //
        requiresQuest(ctx, "canCompleteRFDFreeingKingAwowogei", canCompleteRFDFreeingKingAwowogei), //
        requiresQuest(ctx, "canCompleteDesertTreasureI", canCompleteDesertTreasureI), //
        requiresQuest(ctx, "canCompleteHorrorFromTheDeep", canCompleteHorrorFromTheDeep), //
        hasQuestPoints(ctx, 175),
    ]);
}

function canCompleteRecipeForDisaster0(ctx) {
    return requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest);
}

function canCompleteRecipeForDisaster1(ctx) {
    return countCompletableRFDSubquests(ctx) >= 1;
}

function canCompleteRecipeForDisaster2(ctx) {
    return countCompletableRFDSubquests(ctx) >= 2;
}

function canCompleteRecipeForDisaster3(ctx) {
    return countCompletableRFDSubquests(ctx) >= 3;
}

function canCompleteRecipeForDisaster4(ctx) {
    return countCompletableRFDSubquests(ctx) >= 4;
}

function canCompleteRecipeForDisaster5(ctx) {
    return countCompletableRFDSubquests(ctx) >= 5;
}

function canCompleteRecipeForDisaster6(ctx) {
    return countCompletableRFDSubquests(ctx) >= 6;
}

function canCompleteRecipeForDisaster7(ctx) {
    return countCompletableRFDSubquests(ctx) >= 7;
}

function canCompleteRecipeForDisaster8(ctx) {
    return countCompletableRFDSubquests(ctx) >= 8;
}

function canCompleteRecipeForDisasterCulinaromancer(ctx) {
    return requiresQuest(ctx, "canCompleteRecipeForDisaster", canCompleteRecipeForDisaster);
}

function canCompleteRecruitmentDrive(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteBlackKnightsFortress", canCompleteBlackKnightsFortress), //
        requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual), //
        hasAnyItems(ctx, [946, 1755, 1794]), // Knife, Chisel or Bronze wire
    ]);
}

function canCompleteRegicide(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 10),
        hasSkillLevel(ctx, "Agility", 56),
        requiresQuest(ctx, "canCompleteUndergroundPass", canCompleteUndergroundPass), //
        , // Bow and arrows needed, but thats a huge one... TODO
        has(ctx, 453), // Coal
        has(ctx, 954), // Rope
        has(ctx, 952), // Spade
        has(ctx, 3211), // Limestone
        has(ctx, 590), // Tinderbox
        has(ctx, 1759), // Ball of wool
        has(ctx, 233), // Pestle and mortar
        has(ctx, 1931), // Pot
        hasAnyItems(ctx, [3228, 7223]), // Cooked rabbit or Roast rabbit
    ]);
}

function canCompleteRFDAnotherCooksQuest(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteCooksAssistant", canCompleteCooksAssistant), //
        has(ctx, 221), // Eye of newt
        has(ctx, 1909), // Greenman's ale
        has(ctx, 2084), // Fruit blast
        has(ctx, 592), // Ashes
    ]);
}

function canCompleteRFDFreeingEvilDave(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteGertrudesCat", canCompleteGertrudesCat), //
        requiresQuest(ctx, "canCompleteShadowOfTheStorm", canCompleteShadowOfTheStorm), //
        has(ctx, 2003), // Stew
    ]);
}

function canCompleteRFDFreeingKingAwowogei(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 70),
        hasSkillLevel(ctx, "Agility", 48),
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteMonkeyMadnessI", canCompleteMonkeyMadnessI), //
        has(ctx, 954), // Rope
        hasSlashWeapon(ctx), //
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteRFDFreeingPiratePete(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 31),
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        has(ctx, 341), // Raw cod
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2309), // Bread
        has(ctx, 6667), // Empty fishbowl
        has(ctx, 1794), // Bronze wire
        has(ctx, 1733), // Needle
        hasKnifeOrNarwhalKnife(ctx), // Knife
    ]);
}

function canCompleteRFDFreeingSirAmikVarse(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 107),
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        canStartLegendsQuest(ctx), //
        canReachKharaziJungle(ctx), //
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 2130), // Pot of cream
        has(ctx, 7468), // Pot of cornflour
        has(ctx, 2138), // Raw chicken
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteRFDFreeingSkrachUglologwee(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 41),
        hasSkillLevel(ctx, "Firemaking", 20),
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteBigChompyBirdHunting", canCompleteBigChompyBirdHunting), //
        has(ctx, 2876), // Raw chompy
        has(ctx, 7225), // Iron spit
        has(ctx, 1759), // Ball of wool
        has(ctx, 7566), // Raw Jubbly
    ]);
}

function canCompleteRFDFreeingTheGoblinGenerals(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteGoblinDiplomacy", canCompleteGoblinDiplomacy), //
        has(ctx, 2309), // Bread
        has(ctx, 2112), // Orange slices
        (hasAnyItems(ctx, [1767, 1771, 1773]) || (has(ctx, 229) && has(ctx, 233))), // Blue dye, Green dye, Purple dye or a Vial and Pestle and mortar for black dye
        hasAnyItems(ctx, [2007, 2169]),
        has(ctx, 313), // Fishing bait
        has(ctx, 1929), // Bucket of water
        has(ctx, 973), // Charcoal
    ]);
}

function canCompleteRFDFreeingTheLumbridgeGuide(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 40),
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteBigChompyBirdHunting", canCompleteBigChompyBirdHunting), //
        requiresQuest(ctx, "canCompleteBiohazard", canCompleteBiohazard), //
        requiresQuest(ctx, "canCompleteDemonSlayer", canCompleteDemonSlayer), //
        requiresQuest(ctx, "canCompleteMurderMystery", canCompleteMurderMystery), //
        requiresQuest(ctx, "canCompleteNatureSpirit", canCompleteNatureSpirit), //
        requiresQuest(ctx, "canCompleteWitchsHouse", canCompleteWitchsHouse), //
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1944), // Egg
        has(ctx, 1933), // Pot of flour
        has(ctx, 1887), // Cake tin
    ]);
}

function canCompleteRFDFreeingTheMountainDwarf(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRFDAnotherCooksQuest", canCompleteRFDAnotherCooksQuest), //
        requiresQuest(ctx, "canCompleteFishingContest", canCompleteFishingContest), //
        has(ctx, 1944), // Egg
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1933), // Pot of flour
        has(ctx, 1921), // Bowl of water
        has(ctx, 1905), // Asgarnian ale
    ]);
}

function canCompleteRogueTrader(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTheFeud", canCompleteTheFeud), //
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        requiresQuest(ctx, "canCompleteIcthlarinsLittleHelper", canCompleteIcthlarinsLittleHelper), //
        countDyes(ctx) >= 3, //
        hasAnyItems(ctx, [1739, 958, 6289, 948, 1737]),
    ]);
}

function canCompleteRomeoAndJuliet(ctx) {
    return has(ctx, 753); // Cadava berries
}

function canCompleteRovingElves(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRegicide", canCompleteRegicide), //
        requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest), //
        has(ctx, 952), // Spade
        has(ctx, 954), // Rope
    ]);
}

function canCompleteRoyalTrouble(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteThroneOfMiscellania", canCompleteThroneOfMiscellania), //
        has(ctx, 954), // Rope
        has(ctx, 453), // Coal
        has(ctx, 960), // Plank
    ]);
}

function canCompleteRumDeal(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 42),
        hasSkillLevel(ctx, "Farming", 40),
        hasSkillLevel(ctx, "Prayer", 47),
        hasSkillLevel(ctx, "Slayer", 42),
        hasSkillLevel(ctx, "Fishing", 50),
        requiresQuest(ctx, "canCompleteZogreFleshEaters", canCompleteZogreFleshEaters), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 5341), // Rake
        has(ctx, 1925), // Bucket
    ]);
}

function canCompleteRuneMysteries(ctx) {
    return has(ctx, 1438); // Air talisman
}

function canCompleteScorpionCatcher(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 31),
    ]);
}

function canCompleteScrambled(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 38),
        hasSkillLevel(ctx, "Cooking", 36),
        hasSkillLevel(ctx, "Smithing", 35),
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun), //
        has(ctx, 1921), // Bowl of water
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 960),  // Plank
        has(ctx, 1980), // Empty cup
    ]);
}

function canCompleteSeaSlug(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 30),
        has(ctx, 1941), // Swamp paste
        has(ctx, 596), // Unlit torch
    ]);
}

function canCompleteSecretsOfTheNorth(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 69),
        hasSkillLevel(ctx, "Thieving", 64),
        hasSkillLevel(ctx, "Hunter", 56),
        requiresQuest(ctx, "canCompleteMakingFriendsWithMyArm", canCompleteMakingFriendsWithMyArm), //
        requiresQuest(ctx, "canCompleteTheGeneralsShadow", canCompleteTheGeneralsShadow), //
        requiresQuest(ctx, "canCompleteDeviousMinds", canCompleteDeviousMinds), //
        has(ctx, 1523), // Lockpick
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteShadesOfMortton(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Herblore", 15),
        hasSkillLevel(ctx, "Firemaking", 5),
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        has(ctx, 3410), // Serum 207 (3)
        has(ctx, 95), // Tarromin potion (unf) (might not be needed?)
        has(ctx, 592), // Ashes (might not be needed?)
        has(ctx, 590), // Tinderbox (might not be needed?)
        has(ctx, 1511), // Logs (might not be needed?)
        hasAnyItems(ctx, [2347, 3678]),
        hasAnyItems(ctx, [3438, 3440, 3442, 6211, 10808, 3444, 6213, 31383, 3446, 3448, 31386, 19672, 31389]),
        has(ctx, 3396), // Loar remains
    ]);
}

function canCompleteShadowOfTheStorm(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 30),
        requiresQuest(ctx, "canCompleteDemonSlayer", canCompleteDemonSlayer), //
        requiresQuest(ctx, "canCompleteTheGolem", canCompleteTheGolem), //
        (has(ctx, 229) && has(ctx, 233)), // Vial and Pestle and mortar for black dye
        has(ctx, 2355), // Silver bar
    ]);
}

function canCompleteShadowsOfCustodia(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 54),
        hasSkillLevel(ctx, "Fishing", 45),
        hasSkillLevel(ctx, "Construction", 41),
        hasSkillLevel(ctx, "Hunter", 36),
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun), //
        has(ctx, 847), // Willow longbow
        has(ctx, 1517), // Maple logs
        has(ctx, 2347), // Hammer
        has(ctx, 307), // Fishing rod
    ]);
}

function canCompleteSheepHerder(ctx) {
    return true;
}

function canCompleteSheepShearer(ctx) {
    return has(ctx, 1759); // Ball of wool
}

function canCompleteShieldOfArrav(ctx) {
    return true;
}

function canCompleteShiloVillage(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Agility", 32),
        requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion), //
        has(ctx, 952), // Spade
        has(ctx, 954), // Rope
        has(ctx, 1794), // Bronze wire
        has(ctx, 1755), // Chisel
        has(ctx, 526), // Bones
    ]);
}

function canCompleteSinsOfTheFather(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Woodcutting", 62),
        hasSkillLevel(ctx, "Fletching", 60),
        hasSkillLevel(ctx, "Crafting", 56),
        hasSkillLevel(ctx, "Agility", 52),
        hasSkillLevel(ctx, "Attack", 50),
        hasSkillLevel(ctx, "Slayer", 50),
        hasSkillLevel(ctx, "Magic", 49),
        requiresQuest(ctx, "canCompleteVampyreSlayer", canCompleteVampyreSlayer), //
        requiresQuest(ctx, "canCompleteATasteOfHope", canCompleteATasteOfHope), //
        has(ctx, 1603), // Ruby
        has(ctx, 1755), // Chisel
        has(ctx, 2347), // Hammer
        hasKnifeOrNarwhalKnife(ctx), // Knife
        hasUsableAxe(ctx),
    ]);
}

function canCompleteSkippyAndTheMogres(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 20),
        has(ctx, 1929), // Bucket of water
        hasBucketOfMilkIfF2P(ctx),
        has(ctx, 1975), // Chocolate dust
        has(ctx, 1921), // Bowl of water
        has(ctx, 231), // Snape grass
    ]);
}

function canCompleteSleepingGiants(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 15),
        hasAnyNails(ctx), //
        has(ctx, 1521), // Oak logs
        has(ctx, 1737), // Wool
        has(ctx, 2347), // Hammer
        has(ctx, 1755), // Chisel
        (has(ctx, 1929) || hasUsablePickaxe(ctx)),  // Bucket of water or Ice gloves
    ]);
}

function canCompleteSongOfTheElves(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 70),
        hasSkillLevel(ctx, "Construction", 70),
        hasSkillLevel(ctx, "Farming", 70),
        hasSkillLevel(ctx, "Herblore", 70),
        hasSkillLevel(ctx, "Hunter", 70),
        hasSkillLevel(ctx, "Mining", 70),
        hasSkillLevel(ctx, "Smithing", 70),
        hasSkillLevel(ctx, "Woodcutting", 70),
        requiresQuest(ctx, "canCompleteMourningsEndPartII", canCompleteMourningsEndPartII), //
        requiresQuest(ctx, "canCompleteMakingHistory", canCompleteMakingHistory), //
        requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual), //
        has(ctx, 1157), // Steel full helm
        has(ctx, 1119), // Steel platebody
        has(ctx, 1069), // Steel platelegs
        has(ctx, 1763), // Red dye
        has(ctx, 1773), // Purple dye
        has(ctx, 950), // Silk
        has(ctx, 2363), // Runite bar
        has(ctx, 3420), // Limestone brick
        has(ctx, 590), // Tinderbox
        has(ctx, 954), // Rope
        has(ctx, 561), // Nature rune
        hasAnyItems(ctx, [2472, 2462, 2466, 2464, 2470, 2468, 2460, 2476, 2474, 259]),
        has(ctx, 1111), // Adamant chainbody
        hasAnyItems(ctx, [245, 2450]),
        hasAnyItems(ctx, [869, 1217]),
        has(ctx, 5301), // Cadantine seed
        has(ctx, 227), // Vial of water
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 952), // Spade
        hasUsableAxe(ctx),
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteSpiritsOfTheElid(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 33),
        hasSkillLevel(ctx, "Ranged", 37),
        hasSkillLevel(ctx, "Mining", 37),
        hasSkillLevel(ctx, "Thieving", 37),
        hasTelegrabRunes(ctx), //
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        hasKnifeOrNarwhalKnife(ctx), // Knife
        has(ctx, 954), // Rope
        canShortrange(ctx),
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteSwanSong(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 66),
        hasSkillLevel(ctx, "Cooking", 62),
        hasSkillLevel(ctx, "Fishing", 62),
        hasSkillLevel(ctx, "Smithing", 45),
        hasSkillLevel(ctx, "Firemaking", 42),
        hasSkillLevel(ctx, "Crafting", 40),
        requiresQuest(ctx, "canCompleteOneSmallFavour", canCompleteOneSmallFavour), //
        requiresQuest(ctx, "canCompleteGardenOfTranquillity", canCompleteGardenOfTranquillity), //
        hasQuestPoints(ctx, 100),
        has(ctx, 4695), // Mist rune
        has(ctx, 4699), // Lava rune
        has(ctx, 565), // Blood rune
        has(ctx, 4436), // Airtight pot
        has(ctx, 2351), // Iron bar
        hasAnyLog(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 303), // Small fishing net
        has(ctx, 1757), // Brown apron
        has(ctx, 7944), // Raw monkfish
        has(ctx, 526), // Bones
    ]);
}

function canCompleteTaiBwoWannaiTrio(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 15),
        hasSkillLevel(ctx, "Cooking", 30),
        hasSkillLevel(ctx, "Fishing", 65),
        requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion), //
        hasSlashWeapon(ctx), //
        has(ctx, 3162), // Sliced banana
        has(ctx, 303),  // Small fishing net
        // && has(ctx, 233) // Pestle and mortar not needed because crusher guy in Nardah
        has(ctx, 3032), // Agility potion(4)
        canShortrange(ctx), //
        has(ctx, 3125), // Jogre bones
        has(ctx, 401), // Seaweed
        hasAnyItems(ctx, [1239, 1241, 1243, 1245, 1247, 1249]),
        has(ctx, 3157), // Karambwan vessel
        has(ctx, 3159), // Karambwan vessel (baited)
        has(ctx, 3142), // Raw Karambwan
    ]);
}

function canCompleteTaleOfTheRighteous(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 10),
        hasSkillLevel(ctx, "Strength", 16),
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend), //
        has(ctx, 954), // Rope
        hasAirRuneSource(ctx), //
        hasAnyItems(ctx, [558, 562, 560, 565]), // Mind rune, Chaos rune, Death rune or Blood rune
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteTearsOfGuthix(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 43), //
        hasSkillLevel(ctx, "Firemaking", 49),
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Mining", 20),
        has(ctx, 4548), // Bullseye lantern
        has(ctx, 1607), // Sapphire
        has(ctx, 1755), // Chisel
        has(ctx, 590), // Tinderbox
        canEnterLumbridgeSwampCaves(ctx), //
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteTempleOfIkov(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 42),
        has(ctx, 225), // Limpwurt root
        hasAnyItems(ctx, [864, 870, 863, 865, 869, 866, 867, 868, 5667, 22804, 806, 807, 813, 808, 3093, 809, 810, 816, 811, 817, 11230, 6522, 10033, 10034, 11959, 800, 801, 802, 803, 804, 805, 20849, 857, 855, 10282, 861, 859, 10284, 11235]),
    ]);
}

function canCompleteTempleOfTheEye(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Runecraft", 10),
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        has(ctx, 1929), // Bucket of water
        has(ctx, 1755), // Chisel
    ]);
}

function canCompleteTheAscentOfArceuus(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 12),
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend),
    ]);
}

function canCompleteTheCorsairCurse(ctx) {
    return allTrue([
        has(ctx, 590), // Tinderbox
        has(ctx, 952), // Spade
    ]);
}

function canCompleteTheCurseOfArrav(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 64),
        hasSkillLevel(ctx, "Ranged", 62),
        hasSkillLevel(ctx, "Thieving", 62),
        hasSkillLevel(ctx, "Agility", 61),
        hasSkillLevel(ctx, "Strength", 58),
        hasSkillLevel(ctx, "Slayer", 37),
        requiresQuest(ctx, "canCompleteDefenderOfVarrock", canCompleteDefenderOfVarrock), //
        requiresQuest(ctx, "canCompleteTrollRomance", canCompleteTrollRomance), //
        has(ctx, 2126), // Dwellberries
        has(ctx, 2570), // Ring of life
        has(ctx, 9419), // Mith grapple
        has(ctx, 7159), // Insulated boots
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteTheDepthsOfDespair(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 18),
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend)
    ]);
}

function canCompleteTheDigSite(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 10),
        hasSkillLevel(ctx, "Herblore", 10),
        hasSkillLevel(ctx, "Thieving", 25),
        has(ctx, 233), // Pestle and mortar
        has(ctx, 229), // Vial
        has(ctx, 590), // Tinderbox
        hasCupOfTea(ctx), //
        has(ctx, 954), // Rope
        hasAnyItems(ctx, [1609, 1625]),
        has(ctx, 973), // Charcoal
    ]);
}

function canCompleteTheEnchantedKey(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteMakingHistory", canCompleteMakingHistory), //
        has(ctx, 952), // Spade
    ]);
}

function canCompleteTheEyesOfGlouphrie(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 5),
        hasSkillLevel(ctx, "Magic", 46),
        requiresQuest(ctx, "canCompleteTheGrandTree", canCompleteTheGrandTree), //
        has(ctx, 4687), // Bucket of sap
        has(ctx, 4698), // Mud rune
        has(ctx, 1517), // Maple logs
        has(ctx, 1521), // Oak logs
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 233), // Pestle and mortar
    ]);
}

function canCompleteTheFeud(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 30),
        has(ctx, 4591), // Kharidian headpiece
        has(ctx, 4593), // Fake beard
        has(ctx, 1917), // Beer
        has(ctx, 1925), // Bucket
    ]);
}

function canCompleteTheFinalDawn(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 66),
        hasSkillLevel(ctx, "Runecraft", 52),
        hasSkillLevel(ctx, "Fletching", 52),
        requiresQuest(ctx, "canCompleteTheHeartOfDarkness", canCompleteTheHeartOfDarkness), //
        requiresQuest(ctx, "canCompletePerilousMoons", canCompletePerilousMoons), //
        hasKnifeOrNarwhalKnife(ctx), // Knife
        has(ctx, 1917), // Beer
        hasAnyItems(ctx, [3183, 4834, 4832, 3123, 31726, 22124, 2859, 22780, 28899, 6812, 4812, 534, 530, 532, 526, 528, 6729, 536, 22783, 4830, 31729, 22786, 3125, 11943, 2136, 2134, 2132, 25833, 10816, 2142]),
    ]);
}

function canCompleteTheForsakenTower(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend),
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteTheFremennikExiles(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 65),
        hasSkillLevel(ctx, "Slayer", 60),
        hasSkillLevel(ctx, "Smithing", 60),
        hasSkillLevel(ctx, "Fishing", 60),
        hasSkillLevel(ctx, "Runecraft", 55),
        hasSkillLevel(ctx, "Mining", 60),
        requiresQuest(ctx, "canCompleteTheFremennikIsles", canCompleteTheFremennikIsles), //
        requiresQuest(ctx, "canCompleteLunarDiplomacy", canCompleteLunarDiplomacy), //
        requiresQuest(ctx, "canCompleteMountainDaughter", canCompleteMountainDaughter), //
        requiresQuest(ctx, "canCompleteHeroesQuest", canCompleteHeroesQuest), //
        has(ctx, 4156), // Mirror shield
        has(ctx, 3801), // Keg of beer
        has(ctx, 1775), // Molten glass
        has(ctx, 9075), // Astral rune
        hasAnyItems(ctx, [307, 309]),
        has(ctx, 2347), // Hammer
        has(ctx, 1785), // Glassblowing pipe
    ]);
}

function canCompleteTheFremennikIsles(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 20),
        requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials), //
        has(ctx, 359), // Raw tuna
        (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)), // Mithril ore
        has(ctx, 10812), // Split log
        has(ctx, 10826), // Neitiznot shield
        has(ctx, 10824), // Yak-hide armour (legs)
        has(ctx, 10822), // Yak-hide armour (top)
        has(ctx, 954), // Rope
    ]);
}

function canCompleteTheFremennikTrials(ctx) {
    return allTrue([
        hasAnyItems(ctx, [1917, 3803]), // Beer or Beer tankard
        has(ctx, 590), // Tinderbox
        hasAnyItems(ctx, [383, 389, 395]), // Raw shark, Raw sea turtle or Raw manta ray
    ]);
}

function canAccessDessicatedPagesBosses(ctx) {
    const f = ctx.filters ?? {};
    if (f.hideBosses) return false;
    const exclusions = new Set(f.npcDropExclusions || []);
    const bosses = ["Branda the Fire Queen", "Eldric the Ice King"];
    return !bosses.every((name) => exclusions.has(name));
}

function canCompleteTheFrozenDoor(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hitpoints", 70),
        hasSkillLevel(ctx, "Strength", 70),
        hasSkillLevel(ctx, "Agility", 70),
        hasSkillLevel(ctx, "Ranged", 70),
        requiresQuest(ctx, "canCompleteDesertTreasureI", canCompleteDesertTreasureI), //
        canDoKreearra(ctx), //
        canDoGeneralGraardor(ctx), //
        canDoCommanderZilyana(ctx), //
        canDoKrilTsutsaroth(ctx),
    ]);
}

function canCompleteTheGardenOfDeath(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 20),
        has(ctx, 5329), // Secateurs
    ]);
}

function canCompleteTheGeneralsShadow(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteFightArena", canCompleteFightArena), //
        requiresQuest(ctx, "canCompleteCurseOfTheEmptyLord", canCompleteCurseOfTheEmptyLord), //
    ]);
}

function canCompleteTheGiantDwarf(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 12),
        hasSkillLevel(ctx, "Firemaking", 16),
        hasSkillLevel(ctx, "Magic", 33),
        hasSkillLevel(ctx, "Thieving", 14),
        has(ctx, 563), // Law rune
        hasAirRuneSource(ctx), //
        hasAnyLog(ctx), //
        has(ctx, 453), // Coal
        has(ctx, 2351), // Iron bar
        has(ctx, 1607), // Sapphire
        has(ctx, 2325), // Redberry pie
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteTheGolem(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Thieving", 25),
        has(ctx, 229), // Vial
        has(ctx, 233), // Pestle and mortar
        has(ctx, 1761), // Soft clay
        has(ctx, 970), // Papyrus
    ]);
}

function canCompleteTheGrandTree(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
    ]);
}

function canCompleteTheGreatBrainRobbery(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 16), //
        hasSkillLevel(ctx, "Construction", 30), //
        hasSkillLevel(ctx, "Prayer", 50), //
        requiresQuest(ctx, "canCompleteCreatureOfFenkenstrain", canCompleteCreatureOfFenkenstrain), //
        requiresQuest(ctx, "canCompleteCabinFever", canCompleteCabinFever), //
        requiresQuest(ctx, "canCompleteRFDFreeingPiratePete", canCompleteRFDFreeingPiratePete), //
        has(ctx, 10891), // Wooden cat
        has(ctx, 2347), // Hammer
        hasAnyNails(ctx), //
        has(ctx, 960), // Plank
        has(ctx, 1718), // Holy symbol
    ]);
}

function canStartTheGreatBrainRobbery(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 16), //
        hasSkillLevel(ctx, "Construction", 30), //
        hasSkillLevel(ctx, "Prayer", 50), //
        requiresQuest(ctx, "canCompleteCreatureOfFenkenstrain", canCompleteCreatureOfFenkenstrain), //
        requiresQuest(ctx, "canCompleteCabinFever", canCompleteCabinFever), //
        requiresQuest(ctx, "canCompleteRFDFreeingPiratePete", canCompleteRFDFreeingPiratePete) //
    ]);
}

function canCompleteTheHandInTheSand(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 17),
        hasSkillLevel(ctx, "Crafting", 49),
        has(ctx, 1917), // Beer
        has(ctx, 229), // Vial
        has(ctx, 1951), // Redberries
        has(ctx, 239), // White berries
        has(ctx, 4542), // Lantern lens
        has(ctx, 1783), // Bucket of sand
        has(ctx, 557), // Earth rune
    ]);
}

function canCompleteTheHeartOfDarkness(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 55), //
        hasSkillLevel(ctx, "Thieving", 48), //
        hasSkillLevel(ctx, "Slayer", 48), //
        hasSkillLevel(ctx, "Agility", 46), //
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteTheKnightsSword(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 10),
        has(ctx, 2351), // Iron bar
        has(ctx, 2325), // Redberry pie
        hasUsablePickaxe(ctx),
    ]);
}

function canCompleteTheLostTribe(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 13),
        hasSkillLevel(ctx, "Thieving", 13),
        hasSkillLevel(ctx, "Mining", 17),
        requiresQuest(ctx, "canCompleteGoblinDiplomacy", canCompleteGoblinDiplomacy), //
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        hasUsablePickaxe(ctx), //
    ]); //
}

function canCompleteThePathOfGlouphrie(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Strength", 60),
        hasSkillLevel(ctx, "Slayer", 56),
        hasSkillLevel(ctx, "Thieving", 56),
        hasSkillLevel(ctx, "Ranged", 47),
        hasSkillLevel(ctx, "Agility", 45),
        requiresQuest(ctx, "canCompleteTheEyesOfGlouphrie", canCompleteTheEyesOfGlouphrie), //
        requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest), //
        requiresQuest(ctx, "canCompleteTreeGnomeVillage", canCompleteTreeGnomeVillage), //
        has(ctx, 9419), // Mith Grapple (Phoenix crossbow is available)
    ]);
}

function canCompleteTheQueenOfThieves(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 20),
        requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend),
        has(ctx, 2003), // Stew
    ]);
}

function canCompleteTheRedReef(ctx) {
    return false; // TODO
}

function canCompleteTheRestlessGhost(ctx) {
    return true;
}

function canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Woodcutting", 15),
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun),
        hasUsableAxe(ctx),
    ]);
}

function canCompleteTheSlugMenace(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 30),
        hasSkillLevel(ctx, "Runecraft", 30),
        hasSkillLevel(ctx, "Slayer", 30),
        hasSkillLevel(ctx, "Thieving", 30),
        requiresQuest(ctx, "canCompleteWanted", canCompleteWanted), //
        requiresQuest(ctx, "canCompleteSeaSlug", canCompleteSeaSlug), //
        has(ctx, 1941), // Swamp paste
        hasAnyItems(ctx, [1436, 7936]),
        has(ctx, 1755), // Chisel
        (
            canDoGuardiansOfTheRift(ctx) //
            || requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
            || (
                hasAnyItems(ctx, [1438, 5527]) // Air talisman or Air tiara
                && hasAnyItems(ctx, [1444, 5531]) // Water talisman or Water tiara
                && hasAnyItems(ctx, [1440, 5535]) // Earth talisman or Earth tiara
                && hasAnyItems(ctx, [1442, 5537]) // Fire talisman or Fire tiara
            )
        ),
    ]);
}

function canCompleteTheTouristTrap(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fletching", 10),
        hasSkillLevel(ctx, "Smithing", 20),
        has(ctx, 1833), // Desert shirt
        has(ctx, 1835), // Desert robe
        has(ctx, 1837), // Desert boots
        has(ctx, 2347), // Hammer
        has(ctx, 2349), // Bronze bar
        has(ctx, 314), // Feather
    ]);
}

function canCompleteThroneOfMiscellania(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteHeroesQuest", canCompleteHeroesQuest), //
        requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials), //
        has(ctx, 2351), // Iron bar
        hasAnyItems(ctx, [1635, 1637, 1639, 1641, 1643]),
        has(ctx, 1511), // Logs
    ]);
}

function canCompleteTowerOfLife(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 10),
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 1917), // Beer
    ]);
}

function canCompleteTreeGnomeVillage(ctx) {
    return has(ctx, 1511); // Logs
}

function canCompleteTrollRomance(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 28),
        requiresQuest(ctx, "canCompleteTrollStronghold", canCompleteTrollStronghold), //
        has(ctx, 2351), // Iron bar
        hasAnyItems(ctx, [1517, 1515]),
        canReachTrollheim(ctx), //
        has(ctx, 30), // Bucket of wax
        has(ctx, 1887), // Cake tin
        has(ctx, 1939), // Swamp tar
        has(ctx, 954), // Rope
    ]);
}

function canCompleteTrollStronghold(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20), //
        requiresQuest(ctx, "canCompleteDeathPlateau", canCompleteDeathPlateau), //
    ]);
}

function canCompleteTroubledTortugans(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 51), //
        hasSkillLevel(ctx, "Construction", 48), //
        hasSkillLevel(ctx, "Sailing", 45), //
        hasSkillLevel(ctx, "Hunter", 45), //
        hasSkillLevel(ctx, "Woodcutting", 40), //
        hasSkillLevel(ctx, "Crafting", 34), //
        requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium), //
        hasUsableAxe(ctx),
        has(ctx, 401), // Seaweed
    ]);
}

function canCompleteTwilightsPromise(ctx) {
    return allTrue([
        canShortrange(ctx),
        requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun), //
    ]);

}

function canCompleteUndergroundPass(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Ranged", 25),
        requiresQuest(ctx, "canCompleteBiohazard", canCompleteBiohazard) //
        , // Bow and arrows needed, but thats a huge one... TODO
        has(ctx, 954), // Rope
        has(ctx, 952), // Spade
        has(ctx, 1925), // Bucket
        has(ctx, 590), // Tinderbox
    ]);
}

function canCompleteVampyreSlayer(ctx) {
    return allTrue([
        has(ctx, 1917), // Beer
        has(ctx, 2347), // Hammer
        has(ctx, 1550), // Garlic
    ]);
}

function canCompleteWanted(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteRecruitmentDrive", canCompleteRecruitmentDrive), //
        requiresQuest(ctx, "canCompleteTheLostTribe", canCompleteTheLostTribe), //
        requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril), //
        requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss), //
        hasAnyItems(ctx, [7936, 1436]),
        hasQuestPoints(ctx, 32),
    ]);
}

function canCompleteWatchtower(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 14),
        hasSkillLevel(ctx, "Thieving", 15),
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Herblore", 14),
        hasSkillLevel(ctx, "Mining", 40),
        has(ctx, 560), // Death rune
        has(ctx, 2357), // Gold bar
        has(ctx, 536), // Dragon bones
        has(ctx, 954), // Rope
        has(ctx, 91), // Guam potion (unf)
        has(ctx, 233), // Pestle and mortar
        has(ctx, 530), // Bat bones
        has(ctx, 247), // Jangerberries
        hasUsablePickaxe(ctx), //
    ]);
}

function canCompleteWaterfallQuest(ctx) {
    return allTrue([
        has(ctx, 556), // Air rune
        has(ctx, 555), // Water rune
        has(ctx, 557), // Earth rune
        has(ctx, 954), // Rope
    ]);
}

function canCompleteWhatLiesBelow(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Runecraft", 35),
        requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries), //
        has(ctx, 1923), // Bowl
        has(ctx, 562), // Chaos rune
        (
            hasAnyItems(ctx, [1452, 5543]) // Chaos talisman or Chaos tiara
            || requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
            || canDoGuardiansOfTheRift(ctx)
        ),
    ]);
}

function canCompleteWhileGuthixSleeps(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 72),
        hasSkillLevel(ctx, "Magic", 67),
        hasSkillLevel(ctx, "Agility", 66),
        hasSkillLevel(ctx, "Farming", 65),
        hasSkillLevel(ctx, "Herblore", 65),
        hasSkillLevel(ctx, "Hunter", 62),
        hasQuestPoints(ctx, 180), //
        requiresQuest(ctx, "canCompleteDefenderOfVarrock", canCompleteDefenderOfVarrock), //
        requiresQuest(ctx, "canCompleteThePathOfGlouphrie", canCompleteThePathOfGlouphrie), //
        requiresQuest(ctx, "canCompleteDreamMentor", canCompleteDreamMentor), //
        requiresQuest(ctx, "canCompleteTheHandInTheSand", canCompleteTheHandInTheSand), //
        requiresQuest(ctx, "canCompleteWanted", canCompleteWanted), //
        requiresQuest(ctx, "canCompleteTempleOfTheEye", canCompleteTempleOfTheEye), //
        requiresQuest(ctx, "canCompleteTearsOfGuthix", canCompleteTearsOfGuthix), //
        requiresQuest(ctx, "canCompleteNatureSpirit", canCompleteNatureSpirit), //
        requiresQuest(ctx, "canCompleteATailOfTwoCats", canCompleteATailOfTwoCats), //
        hasKnifeOrNarwhalKnife(ctx), // Knife
        has(ctx, 4542), // Lantern lens
        has(ctx, 567), // Unpowered orb
        has(ctx, 1139), // Bronze med helm
        has(ctx, 1101), // Iron chainbody
        has(ctx, 4548), // Bullseye lantern
        has(ctx, 1607), // Sapphire
        has(ctx, 1951), // Redberries
        has(ctx, 239), // White berries
        hasElementalRuneSources(ctx, ["air", "water", "earth", "fire"]), //
        has(ctx, 564), // Cosmic rune
        has(ctx, 9075), // Astral rune
        hasAnyItems(ctx, [559, 566]),
        has(ctx, 561), // Nature rune
        has(ctx, 563), // Law rune
        has(ctx, 558), // Mind rune
        has(ctx, 560), // Death rune
        has(ctx, 2970), // Mort myre fungus
        hasAnyLog(ctx), //
        has(ctx, 5300), // Snapdragon seed
        has(ctx, 2430), // Restore potion(4)
        has(ctx, 970), // Papyrus
        has(ctx, 973), // Charcoal
    ]);
}

function canCompleteWitchsHouse(ctx) {
    return has(ctx, 1985); // Cheese
}

function canCompleteWitchsPotion(ctx) {
    return allTrue([
        has(ctx, 221), // Eye of newt
        has(ctx, 1957), // Onion
    ]);
}

function canCompleteXMarksTheSpot(ctx) {
    return has(ctx, 952); // Spade
}

function canCompleteZogreFleshEaters(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 4),
        hasSkillLevel(ctx, "Herblore", 8),
        hasSkillLevel(ctx, "Ranged", 30),
        requiresQuest(ctx, "canCompleteBigChompyBirdHunting", canCompleteBigChompyBirdHunting), //
        requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion), //
    ]);
}

function hasAFullBarrowsSet(ctx) {
    return (has(ctx, 4757) && has(ctx, 4755) && has(ctx, 4753) && has(ctx, 4759)) //
        || (has(ctx, 4708) && has(ctx, 4712) && has(ctx, 4714) && has(ctx, 4710)) //
        || (has(ctx, 4732) && has(ctx, 4736) && has(ctx, 4738) && has(ctx, 4734)) //
        || (has(ctx, 4716) && has(ctx, 4720) && has(ctx, 4722) && has(ctx, 4718)) //
        || (has(ctx, 4745) && has(ctx, 4749) && has(ctx, 4751) && has(ctx, 4747)) //
        || (has(ctx, 4724) && has(ctx, 4728) && has(ctx, 4730) && has(ctx, 4726));
}

function hasBonesForBonesToPeaches(ctx) {
    return hasAnyItems(ctx, [
        526,
        528,
        530,
    ])
        || canBurnLoarShades(ctx) // For bleached bones from Undead zealots
        || hasAnyItems(ctx, [
            3125,
            2859,
            3183,
            532,
        ]) // Big bones
}

function canGetFishbowlWithWater(ctx) {
    return (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 32) //
        || has(ctx, 6667); // Empty fishbowl
}

function canKillMogreSailing(ctx) {
    return ctx.player.levels.Slayer >= 32 //
        && (canShortrange(ctx) || canDoSailingCombat(ctx));
}

function canEnterMindAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1448,
            5529,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterAirAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1438,
            5527,
            5516,
            26804,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterWaterAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1444,
            5531,
            5516,
            26804,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterEarthAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1440,
            5535,
            5516,
            26804,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterChaosAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1452,
            5543,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterNatureAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1462,
            5541,
            26798,
            26801,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterNatureAltarNoGuardiansOfTheRift(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1462,
            5541,
            26798,
            26801,
        ]);
}

function canEnterFireAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1442,
            5537,
            5516,
            26804,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterCosmicAltar(ctx) {
    return requiresQuest(ctx, "canCompleteEnterTheAbyss", canCompleteEnterTheAbyss) //
        || hasAnyItems(ctx, [
            1454,
            5539,
            26798,
            26801,
        ])
        || canDoGuardiansOfTheRift(ctx);
}

function canDoTombsOfAmascut(ctx) {
    return requiresQuest(ctx, "canCompleteIntoTheTombs", canCompleteIntoTheTombs) //
        && canTrainMining(ctx);
}

function canDoMageTrainingArena(ctx) {
    return has(ctx, 564) // Cosmic rune
        && has(ctx, 561) // Nature rune
        && has(ctx, 563) // Law rune
        && hasElementalRuneSources(ctx, ["air", "water", "earth", "fire"]);
}

function hasAnyFeather(ctx) {
    return hasAnyItems(ctx, [
        314,
        10089,
        10091,
        10088,
        10087,
        10090,
    ]);
}

function hasAnyFeatherButStripy(ctx) {
    return hasAnyItems(ctx, [
        314,
        10089,
        10091,
        10088,
        10090,
    ]);
}

function hasAnyLantern(ctx) {
    return canTrainFiremaking(ctx) //
        && has(ctx, 590) // Tinderbox
        && (canDoGuardiansOfTheRift(ctx) //
            || hasAnyItems(ctx, [
                4548,
                4532,
                4529,
                7051,
                4537,
            ])
            || requiresQuest(ctx, "canCompleteDesertTreasureII", canCompleteDesertTreasureII) //
        );
}

function canDeepSeaFish(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && canTrainFishing(ctx) //
        && has(ctx, 307) // Fishing rod
        && (has(ctx, 11334) || has(ctx, 32307)); // Fish offcuts or Fine fish offcuts
}

function canMakeTrawlingNet(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && canTrainFishing(ctx) //
        && (
            ( // Rope trawling net
                has(ctx, 954) // Rope
                && has(ctx, 8780) // Teak plank
                && has(ctx, 2353) // Steel bar
                && has(ctx, 32889) // Lead bar
                && hasSkillLevel(ctx, "Sailing", 56) //
                && hasSkillLevel(ctx, "Construction", 45) //
            )
            || ( // Linen trawling net
                has(ctx, 31463) // Linen yarn
                && has(ctx, 8782) // Mahogany plank
                && has(ctx, 954) // Rope
                && has(ctx, 2359) // Mithril bar
                && has(ctx, 32889) // Lead bar
                && hasSkillLevel(ctx, "Sailing", 65) //
                && hasSkillLevel(ctx, "Construction", 61) //
            )
            || ( // Hemp trawling net
                has(ctx, 31466) // Hemp yarn
                && has(ctx, 31432) // Camphor plank
                && has(ctx, 954) // Rope
                && has(ctx, 2361) // Adamantite bar
                && has(ctx, 32892) // Cupronickel bar
                && has(ctx, 31959) // Ray barbs
                && hasSkillLevel(ctx, "Sailing", 76) //
                && hasSkillLevel(ctx, "Construction", 70) //
            )
            || ( // Cotton trawling net
                has(ctx, 31469) // Cotton yarn
                && has(ctx, 31435) // Ironwood plank
                && has(ctx, 954) // Rope
                && has(ctx, 2363) // Runite bar
                && has(ctx, 32892) // Cupronickel bar
                && has(ctx, 31959) // Ray barbs
                && hasSkillLevel(ctx, "Sailing", 84) //
                && hasSkillLevel(ctx, "Construction", 73) //
            )
        );
}

function canEnterLumbridgeSwampCaves(ctx) {
    return has(ctx, 954) // Rope
        || canStartTheLostTribe(ctx) && canTrainMining(ctx);
}

function canStartTheLostTribe(ctx) {
    return requiresQuest(ctx, "canCompleteGoblinDiplomacy", canCompleteGoblinDiplomacy) //
        && requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries);
}

function canStartMourningsEndPartI(ctx) {
    return ctx.player.levels.Ranged >= 60 //
        && ctx.player.levels.Thieving >= 50 //
        && requiresQuest(ctx, "canCompleteRovingElves", canCompleteRovingElves) //
        && requiresQuest(ctx, "canCompleteBigChompyBirdHunting", canCompleteBigChompyBirdHunting) //
        && requiresQuest(ctx, "canCompleteSheepHerder", canCompleteSheepHerder);
}

function hasDeathTalismanSource(ctx) {
    return hasAnyItems(ctx, [
        1456,
        5547,
    ])
        || canDoGuardiansOfTheRift(ctx) // For Catalytic talisman
        || ctx.player.levels.Runecraft >= 99
        || has50JunkItems(ctx)
}

function has50JunkItems(ctx) {
    return has(ctx, 534)  // Babydragon bones
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 1139) // Bronze med helm
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 1887) // Cake tin
        && has(ctx, 1985) // Cheese
        && has(ctx, 1755) // Chisel
        && has(ctx, 2142) // Cooked meat
        && has(ctx, 1944) // Egg
        && has(ctx, 4164) // Facemask
        && has(ctx, 307)  // Fishing rod
        && has(ctx, 1779) // Flax
        && has(ctx, 1635) // Gold ring
        && has(ctx, 2347) // Hammer
        && has(ctx, 1349) // Iron axe
        && has(ctx, 4820) // Iron nails
        && has(ctx, 1267) // Iron pickaxe
        && has(ctx, 1993) // Jug of wine
        && has(ctx, 1971) // Kebab
        && has(ctx, 946)  // Knife
        && has(ctx, 1061) // Leather boots
        && has(ctx, 1059) // Leather gloves
        && has(ctx, 301)  // Lobster pot
        && has(ctx, 1523) // Lockpick
        && has(ctx, 1597) // Necklace mould
        && has(ctx, 1733) // Needle
        && has(ctx, 1521) // Oak logs
        && has(ctx, 2313) // Pie dish
        && has(ctx, 960)  // Plank
        && has(ctx, 1933) // Pot of flour
        && has(ctx, 3138) // Potato cactus
        && has(ctx, 5438) // Potatoes(10)
        && has(ctx, 7936) // Pure essence
        && has(ctx, 1951) // Redberries
        && has(ctx, 954)  // Rope
        && has(ctx, 1735) // Shears
        && has(ctx, 952)  // Spade
        && has(ctx, 1941) // Swamp paste
        && has(ctx, 1734) // Thread
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 235)  // Unicorn horn dust
        && has(ctx, 227)  // Vial of water
        && has(ctx, 1005) // White apron
        && has(ctx, 239); // White berries
}

function canBurnLoarShades(ctx) {
    return requiresQuest(ctx, "canCompleteShadesOfMortton", canCompleteShadesOfMortton);
}

function canBurnPhrinShades(ctx) {
    return canBurnLoarShades(ctx) //
        && has(ctx, 3398); // Phrin remains
}

function canBurnRiylShades(ctx) {
    return canBurnPhrinShades(ctx) //
        && has(ctx, 3400) // Riyl remains
        && hasAnyItems(ctx, [
            3442,
            6211,
            10808,
            3444,
            6213,
            31383,
            3446,
            3448,
            31386,
            19672,
            31389,
        ]);
}

function canBurnAsynShades(ctx) {
    return canBurnRiylShades(ctx) //
        && has(ctx, 3402) // Asyn remains
        && hasAnyItems(ctx, [
            31383,
            3446,
            3448,
            31386,
            19672,
            31389,
        ]);
}

function canBurnFiyrShades(ctx) {
    return canBurnAsynShades(ctx) //
        && has(ctx, 3404) // Fiyr remains
        && hasAnyItems(ctx, [
            3448,
            31386,
            19672,
            31389,
        ]);
}

function canBurnUriumShades(ctx) {
    return canBurnFiyrShades(ctx) //
        && has(ctx, 25419) // Urium remains
        && hasAnyItems(ctx, [
            19672,
            31389,
        ]);
}

function hasCupOfTea(ctx) {
    return has(ctx, 1978) // Cup of tea
        || (has(ctx, 1980) && has(ctx, 1921)) // Empty cup and Bowl of water
}

function hasAnyGuthixBalance(ctx) {
    return hasAnyItems(ctx, [
        7660,
        7662,
        7664,
        7666,
    ]);
}

function hasAnySerum207(ctx) {
    return hasAnyItems(ctx, [
        3408,
        3410,
        3412,
        3414,
    ]);
}

function hasAirRuneSource(ctx) {
    return hasElementalRuneSources(ctx, ["air"]);
}

function hasWaterRuneSource(ctx) {
    return hasElementalRuneSources(ctx, ["water"]);
}

function hasEarthRuneSource(ctx) {
    return hasElementalRuneSources(ctx, ["earth"]);
}

function hasFireRuneSource(ctx) {
    return hasElementalRuneSources(ctx, ["fire"]);
}

function canReachTrollheim(ctx) {
    if (ctx.player?.combatAchievementTiers?.easy) return true;
    const combatAchievementsCount = ctx.player?.combatAchievementsCount
        ?? ctx.player?.combatAchievements?.length
        ?? 0;
    return requiresQuest(ctx, "canCompleteDeathPlateau", canCompleteDeathPlateau) //
        || combatAchievementsCount >= 38;
}

function hasHunterMeat(ctx) {
    return hasAnyItems(ctx, [29104, 29122, 29101, 29119, 29125, 29110, 29116, 29107, 29113])
}

function canGetBirdNestWyson(ctx) {
    return has(ctx, 7418)  // Mole skin
        && has(ctx, 7416); // Mole claw
}

function hasRope(ctx) {
    return has(ctx, 954); // Rope
}

function hasHammer(ctx) {
    return has(ctx, 2347); // Hammer
}

function canEnterGodWarsDungeon(ctx) {
    return canReachTrollheim(ctx) //
        && hasRope(ctx);
}

function canDoCommanderZilyana(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Agility >= 70
        && hasRope(ctx);
}

function canDoGeneralGraardor(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Strength >= 70
        && hasGWDBandosAreaSuitableHammer(ctx);
}

function hasGWDBandosAreaSuitableHammer(ctx) {
    return ( // Any hammer/warhammer https://oldschool.runescape.wiki/w/Warhammer#Other_warhammers < these dont work
        hasHammer(ctx) //
        || hasAnyItems(ctx, [
            1345,
            1341,
            1337,
            13576,
            1335,
            1343,
            1347,
            1339,
            6613,
            21003,
        ])
    );
}

function canDoKreearra(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Ranged >= 70
        && has(ctx, 9419); // Mith Grapple (phoenix crossbow is available)
}

function canDoKrilTsutsaroth(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Hitpoints >= 70;
}

function canDoNex(ctx) {
    return requiresQuest(ctx, "canCompleteTheFrozenDoor", canCompleteTheFrozenDoor);
}

function canBirdSnare(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10006); // Bird snare
}

function canNooseWand(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10150); // Bird snare
}

function canCatchImplingsInJars(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10010)  // Butterfly net
        && has(ctx, 11260); // Impling jar
}

function canDeadfallTrap(ctx) {
    return canTrainHunter(ctx) //
        && hasKnifeOrNarwhalKnife(ctx) // Knife
        && hasAnyLog(ctx);
}

function hasAnyLog(ctx) {
    return hasAnyItems(ctx, [
        1511,
        1521,
        1519,
        6333,
        1517,
        6332,
        32904,
        1515,
        1513,
        32907,
        32910,
        19669,
    ])
        || canTrainWoodcutting(ctx); // for untradable Juniper logs
}

function canEnterCraftingGuild(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 20208) // Golden apron
        && has(ctx, 1757); // Brown apron
}

function hasAnyFletchableLog(ctx) {
    return has(ctx, 1511) // Logs
        || (has(ctx, 1521) && hasSkillLevel(ctx, "Fletching", 15)) // Oak logs
        || (has(ctx, 1519) && hasSkillLevel(ctx, "Fletching", 30)) // Willow logs
        || (has(ctx, 1517) && hasSkillLevel(ctx, "Fletching", 45)) // Maple logs
        || (has(ctx, 1515) && hasSkillLevel(ctx, "Fletching", 60)) // Yew logs
        || (has(ctx, 1513) && hasSkillLevel(ctx, "Fletching", 75)) // Magic logs
        || (has(ctx, 19669) && hasSkillLevel(ctx, "Fletching", 90)); // Redwood logs
}

function canPitfallTrap(ctx) {
    return canTrainHunter(ctx) //
        && hasKnifeOrNarwhalKnife(ctx) // Knife
        && hasAnyItems(ctx, [10029, 29305]) // Teasing stick of Hunter's spear
        && (
            hasAnyItems(ctx, [
                1511,
                1521,
                1519,
                6333,
                1517,
                6332,
                32904,
                1515,
                1513,
                32907,
                32910,
            ])
        );
}

function canCatchSalamanders(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 954) // Rope
        && has(ctx, 303); // Small fishing net
}

function canCatchCrabs(ctx) {
    return canTrainConstruction(ctx) //
        && canTrainHunter(ctx) //
        && has(ctx, 2347)      // Hammer
        && has(ctx, 8794)      // Saw
        && has(ctx, 1925)      // Bucket
        && has(ctx, 960)       // Plank
        && hasAnyNails(ctx)    //
        && (has(ctx, 32307) || has(ctx, 11334)); // Fine fish offcuts or Fish offcuts
}

function canCatchButterflies(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10010)     // Butterfly net
        && has(ctx, 10012);    // Butterfly jar
}

function hasAnyNails(ctx) {
    return hasAnyItems(ctx, [
        4819,
        4820,
        1539,
        4821,
        4822,
        4823,
        4824,
        31406,
    ]);
}

function canEnterKalphiteLair(ctx) {
    return has(ctx, 954); // Rope
}

function canKillKalphitesOutsideLair(ctx) {
    if (ctx.filters?.isSlayerLocked) {
        return canEnterKalphiteLair(ctx);
    }
    // Outside of Slayer-locked mode, these are available in the Kalphite Cave on task.
    return true;
}

function canEnterAncientCavern(ctx) {
    return requiresQuest(ctx, "canCompleteBarbarianFiremaking1", canCompleteBarbarianFiremaking1);
}

function canFishKarambwan(ctx) {
    return requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion) //
        && has(ctx, 3157) // Karambwan vessel
        && has(ctx, 3159) // Karambwan vessel (baited)
        && has(ctx, 303); // Small fishing net
}

function canGetKarambwanVessel(ctx) {
    return requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion) //
        && has(ctx, 303); // Small fishing net
}

function canGetKPSpears(ctx) {
    return requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion) //
        && canTrainCooking(ctx) //
        && has(ctx, 303)  // Small fishing net
        && has(ctx, 3157) // Karambwan vessel
        && has(ctx, 3159) // Karambwan vessel (baited)
        && has(ctx, 3142) // Raw Karambwan
        // && has(ctx, 233) // Pestle and mortar not needed because crusher guy in Nardah
        && (
            has(ctx, 1237)    // Bronze spear
            && has(ctx, 1239) // Iron spear
            && has(ctx, 1241) // Steel spear
            && has(ctx, 1243) // Mithril spear
            && has(ctx, 1245) // Adamant spear
            && has(ctx, 1247) // Rune spear
            && has(ctx, 1249) // Dragon spear
        )
}

function canDoZulrah(ctx) {
    return canShortrange(ctx) //
        && requiresQuest(ctx, "canCompleteRegicide", canCompleteRegicide);
}

function canStartAtFirstLight(ctx) {
    return canTrainHunter(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainConstruction(ctx) //
        && requiresQuest(ctx, "canCompleteEaglesPeak", canCompleteEaglesPeak) //
        && requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun);
}

function canSailToTheNorthernOcean(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && canTrainConstruction(ctx) //
        && has(ctx, 31435) // Ironwood plank
        && has(ctx, 4824)  // Rune nails
        && has(ctx, 32892) // Cupronickel bar
        && has(ctx, 22593) // Te salt
        && has(ctx, 22595) // Efh salt
        && has(ctx, 22597) // Urt salt
        && has(ctx, 2363); // Runite bar
}

function canSailToGrimstone(ctx) {
    return canSailToTheNorthernOcean(ctx);
}

function canSailToBrittleIsle(ctx) {
    return canSailToTheNorthernOcean(ctx);
}

function canEnterTheCharredDungeon(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && hasSkillLevel(ctx, "Sailing", 60) //
        && has(ctx, 954); // Rope
}

function canReachWyrmsTask(ctx) {
    return canEnterTheCharredDungeon(ctx)
        || canStartPerilousMoonsAndReachWyrmlings(ctx)
        || hasAnyItems(ctx, [21643, 23037, 22951]); // Granite boots, Boots of stone, Boots of brimstone
}

function canLongrange(ctx) {
    return hasAnyItems(ctx, [882, 884]) // Bronze arrow or Iron arrow (with cursed goblin bow)
        || has(ctx, 877) // Bronze bolts (with phoenix crossbow)
        || (hasAirRuneSource(ctx) //
            && hasAnyItems(ctx, [558, 562, 560, 565]) // Mind rune, Chaos rune, Death rune or Blood rune
        ); //
}

function canCastStrikeSpells(ctx) {
    return hasAirRuneSource(ctx) //
        && has(ctx, 558); // Mind rune
}

function canShortrange(ctx) {
    return canLongrange(ctx) //
        || hasAnyItems(ctx, [
            864,
            870,
            863,
            865,
            869,
            866,
            867,
            868,
            5667,
            22804,
            806,
            807,
            813,
            808,
            3093,
            809,
            810,
            816,
            811,
            817,
            11230,
            6522,
            10033,
            10034,
            11959,
            800,
            801,
            802,
            803,
            804,
            805,
            20849,
        ]) // Dragon thrownaxe;// Dragon thrownaxe
}

function canKillGargoyles(ctx) {
    return hasAnyItems(ctx, [
        4162,
        21754,
    ]) // Rock thrownhammer
}

function canEnterKaruulmSlayerDungeon(ctx) {
    return hasAnyItems(ctx, [
        23037,
        21643,
    ]) // Granite boots
}

function canKillFossilIslandWyverns(ctx) {
    return requiresQuest(ctx, "canCompleteBoneVoyage", canCompleteBoneVoyage) && hasAccessToWyvernProtection(ctx);
}

function hasAccessToWyvernProtection(ctx) {
    return requiresQuest(ctx, "canCompleteElementalWorkshopI", canCompleteElementalWorkshopI) //
        && (has(ctx, 2890) // Elemental shield
            || (has(ctx, 9731) && requiresQuest(ctx, "canCompleteElementalWorkshopII", canCompleteElementalWorkshopII)) // Mind shield
        );
}

function canStartPerilousMoons(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTwilightsPromise", canCompleteTwilightsPromise), //
        hasSkillLevel(ctx, "Hunter", 20), //
        hasSkillLevel(ctx, "Slayer", 48), //
        hasSkillLevel(ctx, "Fishing", 20), //
        hasSkillLevel(ctx, "Runecraft", 20), //
        hasSkillLevel(ctx, "Construction", 10) //
    ]);
}

function canStartPerilousMoonsAndReachWyrmlings(ctx) {
    return allTrue([
        requiresQuest(ctx, "canCompleteTwilightsPromise", canCompleteTwilightsPromise), //
        hasSkillLevel(ctx, "Hunter", 20), //
        hasSkillLevel(ctx, "Slayer", 48), //
        hasSkillLevel(ctx, "Fishing", 20), //
        hasSkillLevel(ctx, "Runecraft", 20), //
        hasSkillLevel(ctx, "Construction", 10), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 1440), // Earth talisman
        has(ctx, 1444), // Water talisman
    ]);
}

function canReachGemRocks(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        || requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage) //
        || canReachLunarIsle(ctx);
}

function canReachLunarIsle(ctx) {
    return canReachPiratesCove(ctx) //
        && has(ctx, 590)   // Tinderbox
        && has(ctx, 4548); // Bullseye lantern
}

function canReachPiratesCove(ctx) {
    return requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials) //
        && requiresQuest(ctx, "canCompleteLostCity", canCompleteLostCity) //
        && requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries) //
        && requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage) //
        && canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainMining(ctx) //
        && canTrainWoodcutting(ctx); //
}

function canFishFromRewardPool(ctx) {
    return hasAnyItems(ctx, [
        305,
        303,
    ]) // Small fishing net
}

function canDoGuardiansOfTheRift(ctx) {
    return requiresQuest(ctx, "canCompleteTempleOfTheEye", canCompleteTempleOfTheEye);
}



const DYES = [
    hasRedDye,
    hasYellowDye,
    hasBlueDye,
    hasGreenDye,
    hasPurpleDye,
    hasOrangeDye,
];

function hasRedDye(ctx) {
    return has(ctx, 1763);
}

function hasYellowDye(ctx) {
    return has(ctx, 1765);
}

function hasBlueDye(ctx) {
    return has(ctx, 1767);
}

function hasGreenDye(ctx) {
    return has(ctx, 1771);
}

function hasPurpleDye(ctx) {
    return has(ctx, 1773);
}

function hasOrangeDye(ctx) {
    return has(ctx, 1769);
}

function countDyes(ctx) {
    return DYES.filter(fn => fn(ctx)).length;
}

function canUseSilverSickle(ctx) {
    return requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril) //
        && canTrainCrafting(ctx) //
        && has(ctx, 2961)  // Silver sickle
        && has(ctx, 2355)  // Silver bar
        && has(ctx, 2976); // Sickle mould
}

function canStartDragonSlayerI(ctx) {
    return hasQuestPoints(ctx, 32);
}

function hasAnySapling(ctx) {
    const hardwoodSaplings = [
        21477, // Teak sapling
        21480, // Mahogany sapling
        31505, // Ironwood sapling
        31508, // Rosewood sapling
        31502  // Camphor sapling
    ];

    const regularSaplings = [
        5496,  // Apple sapling
        5497,  // Banana sapling
        5503,  // Calquat sapling
        22856, // Celastrus sapling
        5499,  // Curry sapling
        22866, // Dragonfruit sapling
        5374,  // Magic sapling
        5372,  // Maple sapling
        5370,  // Oak sapling
        5498,  // Orange sapling
        5502,  // Palm sapling
        5501,  // Papaya sapling
        5500,  // Pineapple sapling
        22859, // Redwood sapling
        5371,  // Willow sapling
        5373  // Yew sapling
    ];

    return hasAnyItems(ctx, regularSaplings)
        || (hasAnyItems(ctx, hardwoodSaplings) && canPlantHardwoodTrees(ctx));
}

function hasMachete(ctx) {
    return hasAnyItems(ctx, [975, 6313, 6315, 6317]);
}

function canGetGoutweed(ctx) {
    return requiresQuest(ctx, "canCompleteEadgarsRuse", canCompleteEadgarsRuse) // Goutweed crate
        || (has(ctx, 6311) && canTrainFarming(ctx)) // Gout tuber
        || (canReachTrollheim(ctx) && canDoGnomeRestaurant(ctx)); // Brambickle
}

function canDoMahoganyHomes(ctx) {
    return canTrainConstruction(ctx) //
        && has(ctx, 2347) // Hammer
        && has(ctx, 8794) // Saw
        && has(ctx, 2353) // Steel bar
        && hasAnyItems(ctx, [
            960,
            8778,
            8780,
            8782,
        ]);
}

function canMakeGuthixRests(ctx) {
    return requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries) //
        && requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2353); // Steel bar
}

function canMakePotLids(ctx) {
    return requiresQuest(ctx, "canCompleteRuneMysteries", canCompleteRuneMysteries) //
        && requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2353) // Steel bar
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 2351) // Iron bar
        && has(ctx, 1755) // Chisel
        && has(ctx, 4419) // Guthix rest(3)
        && has(ctx, 2347) // Hammer
        && has(ctx, 1761) // Soft clay
        && has(ctx, 1609) // Opal
        && has(ctx, 1611) // Jade
        && has(ctx, 1613) // Red topaz
        && has(ctx, 1607); // Sapphire
}

const NMZ_QUESTS = [
    canCompleteTheAscentOfArceuus,
    canCompleteTheDepthsOfDespair,
    canCompleteDreamMentor,
    canCompleteFightArena,
    canCompleteTheGrandTree,
    canCompleteHauntedMine,
    canCompleteInSearchOfTheMyreque,
    canCompleteLunarDiplomacy,
    canCompleteMyArmsBigAdventure,
    canCompleteRovingElves,
    canCompleteSongOfTheElves,
    canCompleteTrollRomance,
    canCompleteWhatLiesBelow,
    canCompleteContact,
    canCompleteDesertTreasureI,
    canCompleteFairytaleIGrowingPains,
    canCompleteTheFremennikIsles,
    canCompleteTheGreatBrainRobbery,
    canCompleteHolyGrail,
    canCompleteLegendsQuest,
    canCompleteMonkeyMadnessI,
    canCompleteOneSmallFavour,
    canCompleteShadowOfTheStorm,
    canCompleteTaleOfTheRighteous,
    canCompleteTrollStronghold,
    canCompleteWitchsHouse,
    canCompleteTheCorsairCurse,
    canCompleteDragonSlayerI,
    canCompleteFamilyCrest,
    canCompleteGettingAhead,
    canCompleteGrimTales,
    canCompleteHorrorFromTheDeep,
    canCompleteLostCity,
    canCompleteMountainDaughter,
    canCompleteRecipeForDisaster,
    canCompleteShiloVillage,
    canCompleteTreeGnomeVillage,
    canCompleteVampyreSlayer,
];

function countCompletableNMZQuests(ctx) {
    return NMZ_QUESTS.filter(fn => fn(ctx)).length;
}

function canEnterNightmareZone(ctx) {
    return (countCompletableNMZQuests(ctx) >= 5) && !isIronmanAccount(ctx.player);
}

function hasKnifeOrNarwhalKnife(ctx) {
    if (hasItem(ctx, 946, { trackMissing: false })) return true; // Knife

    const hasHorn = hasItem(ctx, 31954, { trackMissing: false }); // Narwhal horn
    if (hasHorn) {
        return canTrainCrafting(ctx) && has(ctx, 1755); // Chisel
    }

    addMissingItemOptionGroup(ctx, [[946], [31954, 1755]]);
    return false;
}

function hasNarwhalKnife(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 31954) // Narwhal horn
        && has(ctx, 1755); // Chisel
}

function hasAnyCookedMeatFish(ctx) {
    return hasAnyItems(ctx, [
        315,
        325,
        303,
    ])
        || (has(ctx, 305) && requiresQuest(ctx, "canCompleteBelowIceMountain", canCompleteBelowIceMountain)) // Big fishing net, for untradable Tetra and Catfish
        || hasAnyItems(ctx, [
            2140,
            2142,
            1861,
            3228,
            347,
            355,
            333,
            351,
            339,
            329,
            3381,
            361,
            3144,
            319,
            10136,
            5003,
            379,
            7568,
            365,
            373,
            7946,
            32312,
            31556,
            31564,
            32320,
            32328,
            385,
            397,
            32336,
            13441,
            32344,
            11936,
            32352,
            391,
        ]) // Manta ray
}




const RFD_SUBQUESTS = [
    canCompleteRFDFreeingTheMountainDwarf,
    canCompleteRFDFreeingTheGoblinGenerals,
    canCompleteRFDFreeingPiratePete,
    canCompleteRFDFreeingTheLumbridgeGuide,
    canCompleteRFDFreeingEvilDave,
    canCompleteRFDFreeingSkrachUglologwee,
    canCompleteRFDFreeingSirAmikVarse,
    canCompleteRFDFreeingKingAwowogei,
];

function countCompletableRFDSubquests(ctx) {
    return RFD_SUBQUESTS.filter(fn => fn(ctx)).length;
}

function hasSlashWeapon(ctx) {
    return true; // TODO
}

function hasSlashWeaponOrKnife(ctx) {
    return true; // TODO
}

function canEnterBraindeathIsland(ctx) {
    return requiresQuest(ctx, "canCompletePriestInPeril", canCompletePriestInPeril) //
        && requiresQuest(ctx, "canCompleteZogreFleshEaters", canCompleteZogreFleshEaters);
}

function canAccessSunbleakIsland(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && (
            ( // Adamant helm
                has(ctx, 31432) // Camphor plank
                && has(ctx, 2361) // Adamantite bar
                && hasSkillLevel(ctx, "Sailing", 72) //
                && hasSkillLevel(ctx, "Construction", 59) //
            ) // Rune helm
            || (
                has(ctx, 31435) // Ironwood plank
                && has(ctx, 2363) // Runite bar
                && hasSkillLevel(ctx, "Sailing", 87) //
                && hasSkillLevel(ctx, "Construction", 81) //
            )
        );
}

function canDoMixology(ctx) {
    return canTrainHerblore(ctx) //
        && hasAnyItems(ctx, [
            249,
            251,
            253,
            255,
        ])
        && hasAnyItems(ctx, [
            257,
            2998,
            261,
            263,
            3000,
        ])
        && hasAnyItems(ctx, [
            30097,
            259,
            265,
            2481,
            267,
            269,
        ]);
}

function canMakeSplitLog(ctx) {
    return requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10810) // Arctic pine logs
        && has(ctx, 954);  // Rope
}

function canMakeNeitiznotShield(ctx) {
    return requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10810) // Arctic pine logs
        && has(ctx, 4819)  // Bronze nails
        && has(ctx, 2347)  // Hammer
        && has(ctx, 954);  // Rope
}

function hasFremennikIslesStartingOres(ctx) {
    return (ctx.player.levels.Mining === 1 //
        ? has(ctx, 438) // Tin ore
        : ctx.player.levels.Mining <= 54 //
            ? has(ctx, 453) // Coal
            : has(ctx, 447)); // Mithril ore
}

function canMakeYakhideArmour(ctx) {
    return requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10812) // Split log
        && has(ctx, 10820) // Cured yak-hide
        && has(ctx, 954);  // Rope
}

function canCureYakHide(ctx) {
    return requiresQuest(ctx, "canCompleteTheFremennikTrials", canCompleteTheFremennikTrials) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10812) // Split log
        && has(ctx, 10818) // Yak-hide
        && has(ctx, 954);  // Rope
}

function canReachKharaziJungle(ctx) {
    return canStartLegendsQuest(ctx)
        && canTrainWoodcutting(ctx) //
        && hasMachete(ctx);
}

function canEnterHardwoodGrove(ctx) {
    return requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion) //
        && has(ctx, 6306); // Trading sticks
}

function canStartLegendsQuest(ctx) {
    return hasQuestPoints(ctx, 107) //
        && requiresQuest(ctx, "canCompleteFamilyCrest", canCompleteFamilyCrest) //
        && requiresQuest(ctx, "canCompleteHeroesQuest", canCompleteHeroesQuest) //
        && requiresQuest(ctx, "canCompleteShiloVillage", canCompleteShiloVillage) //
        && requiresQuest(ctx, "canCompleteUndergroundPass", canCompleteUndergroundPass) //
        && requiresQuest(ctx, "canCompleteWaterfallQuest", canCompleteWaterfallQuest); //
}

function canStartDarknessOfHallowvale(ctx) {
    return requiresQuest(ctx, "canCompleteInAidOfTheMyreque", canCompleteInAidOfTheMyreque) //
        && canTrainConstruction(ctx) //
        && canTrainMining(ctx) //
        && canTrainCrafting(ctx); //
}

function canStartATasteOfHope(ctx) {
    return requiresQuest(ctx, "canCompleteDarknessOfHallowvale", canCompleteDarknessOfHallowvale) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 38) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx); //
}

function canStartMageArenaII(ctx) {
    return has(ctx, 565) // Blood rune
        && hasElementalRuneSources(ctx, ["air", "fire"]); //
}

function canStartTheQueenOfThieves(ctx) {
    return requiresQuest(ctx, "canCompleteClientOfKourend", canCompleteClientOfKourend);
}

function hasTelegrabRunes(ctx) {
    return has(ctx, 563) // Law rune
        && hasAirRuneSource(ctx);
}

function canStartIcthlarinsLittleHelper(ctx) {
    return requiresQuest(ctx, "canCompleteGertrudesCat", canCompleteGertrudesCat);
}

function hasCandle(ctx) {
    return hasAnyItems(ctx, [
        36,
        30,
    ])
}



const BONE_VOYAGE_KUDOS_QUESTS = [
    canCompleteDemonSlayer,
    canCompleteRuneMysteries,
    canCompleteShieldOfArrav,
    canCompleteATailOfTwoCats,
    canCompleteHazeelCult,
    canCompleteInAidOfTheMyreque,
    canCompleteMakingHistory,
    canCompleteMerlinsCrystal,
    canCompleteObservatoryQuest,
    canCompletePriestInPeril,
    canCompleteTempleOfIkov,
    canCompleteTheGrandTree,
    canCompleteWhatLiesBelow,
    canCompleteCurseOfTheEmptyLord,
    canCompleteDefenderOfVarrock,
];

function countCompletableKudosquests(ctx) {
    const nestedCtx = {
        ...ctx,
        suppressMissing: true,
        missing: {
            ...ctx.missing,
            suppressMissing: true
        }
    };
    return BONE_VOYAGE_KUDOS_QUESTS.filter(fn => fn(nestedCtx)).length;
}

function canGet153Kudos(ctx) {
    return requiresQuest(ctx, "canCompleteBoneVoyage", canCompleteBoneVoyage) // 153 kudos needed
        // 28 kudos from natural history museum quiz
        // 50 from cleaning finds
        // 72 from fossils
        // 3 kudos needed = 1 quests
        && countCompletableKudosquests(ctx) >= 1;
}

function canGet50Kudos(ctx) {
    return ( // 50 kudos needed
        // 28 kudos from natural history museum quiz
        requiresQuest(ctx, "canCompleteTheDigSite", canCompleteTheDigSite) // 50 from cleaning finds
        && has(ctx, 1059) // Leather gloves
        && has(ctx, 1061) // Leather boots
    ) //
        // OR 22 kudos needed = 5 quests
        || countCompletableKudosquests(ctx) >= 5;
}

function canStartZogreFleshEaters(ctx) {
    return requiresQuest(ctx, "canCompleteBigChompyBirdHunting", canCompleteBigChompyBirdHunting) //
        && requiresQuest(ctx, "canCompleteJunglePotion", canCompleteJunglePotion);
}

function canTrainCrafting(ctx) {
    if (ctx.filters?.overrideCrafting) return true;
    return hasAnyItems(ctx, [
        1737, // Wool
        1761, // Soft clay
    ])
        || (has(ctx, 1741) // Leather
            && (ctx.filters?.isFreeToPlay
                ? (has(ctx, 1733) && has(ctx, 1734)) // Needle and Thread
                : true)
        ) //
        || (has(ctx, 1775) // Molten glass
            && has(ctx, 1785) // Glassblowing pipe
        )
        || (has(ctx, 1625) // Uncut opal
            && has(ctx, 1755) // Chisel
        )
        || (has(ctx, 1592) // Ring mould
            && has(ctx, 1609) // Opal
            && has(ctx, 2355) // Silver bar
        )
        || (has(ctx, 1592) // Ring mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 5
        )
        || (has(ctx, 1597) // Necklace mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 6
        )
        || (has(ctx, 11065) // Bracelet mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 7
        )
        || (has(ctx, 1595) // Amulet mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 8
        ); // TODO could add more.
}

function canTrainPrayer(ctx) {
    return hasAnyItems(ctx, [
        3183,
        4834,
        4832,
        3123,
        31726,
    ])
        || (has(ctx, 22124) && ctx.player.levels.Prayer >= 70) // Superior dragon bones
        || hasAnyItems(ctx, [
            2859,
            22780,
            28899,
            6812,
            4812,
            534,
            530,
            532,
            526,
            528,
            6729,
            536,
            22783,
            4830,
            31729,
            22786,
            3125,
            11943,
            25769,
            25775,
            25766,
            25778,
            25772,
        ])
        || ( // Basic reanimation
            (has(ctx, 559) && has(ctx, 561)) // Body rune and Nature rune
            && hasAnyItems(ctx, [
                13448,
                13451,
                13454,
                13457,
                13460,
                13463,
                13466,
            ])
        ) //
        || ( // Adept reanimation
            (has(ctx, 559) && has(ctx, 561) && has(ctx, 566)) // Body rune and Nature rune and Soul rune
            && hasAnyItems(ctx, [
                13469,
                13472,
                13475,
                13478,
                13481,
                13484,
                13487,
            ])
        ) //
        || ( // Expert reanimation
            (has(ctx, 565) && has(ctx, 561) && has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && hasAnyItems(ctx, [
                13490,
                13493,
                13496,
                13499,
                13502,
                26997,
            ])
        ) //
        || ( // Master reanimation
            (has(ctx, 565) && has(ctx, 561) && has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && hasAnyItems(ctx, [
                13505,
                13508,
                13511,
            ])
        ); //
}

function getUsableAxeIds(level) {
    const usableAxeIds = [];
    if (level >= 1) {
        usableAxeIds.push(
            1351, // Bronze axe
            1349  // Iron axe
        );
    }
    if (level >= 6) {
        usableAxeIds.push(1353); // Steel axe
    }
    if (level >= 11) {
        usableAxeIds.push(1361); // Black axe
    }
    if (level >= 21) {
        usableAxeIds.push(1355); // Mithril axe
    }
    if (level >= 31) {
        usableAxeIds.push(1357); // Adamant axe
    }
    if (level >= 41) {
        usableAxeIds.push(1359); // Rune axe
    }
    if (level >= 61) {
        usableAxeIds.push(
            6739,  // Dragon axe
            20011  // 3rd age axe
        );
    }
    return usableAxeIds;
}

function hasUsableAxe(ctx) {
    const level = ctx.player?.levels?.Woodcutting ?? 1;
    const usableAxeIds = getUsableAxeIds(level);
    if (usableAxeIds.length === 0) return false;
    return hasAnyItems(ctx, usableAxeIds);
}

function canTrainWoodcutting(ctx) {
    if (ctx.filters?.overrideWoodcutting) return true;
    return hasUsableAxe(ctx);
}

function getUsablePickaxeIds(level) {
    const usablePickaxeIds = [];
    if (level >= 1) {
        usablePickaxeIds.push(
            1265, // Bronze pickaxe
            1267  // Iron pickaxe
        );
    }
    if (level >= 6) {
        usablePickaxeIds.push(1269); // Steel pickaxe
    }
    if (level >= 11) {
        usablePickaxeIds.push(12297); // Black pickaxe
    }
    if (level >= 21) {
        usablePickaxeIds.push(1273); // Mithril pickaxe
    }
    if (level >= 31) {
        usablePickaxeIds.push(1271); // Adamant pickaxe
    }
    if (level >= 41) {
        usablePickaxeIds.push(1275); // Rune pickaxe
    }
    if (level >= 61) {
        usablePickaxeIds.push(
            11920, // Dragon pickaxe
            20014  // 3rd age pickaxe
        );
    }
    return usablePickaxeIds;
}

function hasUsablePickaxe(ctx) {
    const level = ctx.player?.levels?.Mining ?? 1;
    const usablePickaxeIds = getUsablePickaxeIds(level);
    if (usablePickaxeIds.length === 0) return false;
    return hasAnyItems(ctx, usablePickaxeIds);
}

function canTrainMining(ctx) {
    if (ctx.filters?.overrideMining) return true;
    return hasUsablePickaxe(ctx);
}

function canTrainHerblore(ctx) {
    return requiresQuest(ctx, "canCompleteDruidicRitual", canCompleteDruidicRitual);
}

function canTrainFishing(ctx) {
    if (ctx.filters?.overrideFishing) return true;
    return hasAnyItems(ctx, [
        303,
        305,
    ])
        || (has(ctx, 307) && has(ctx, 313)); // Fishing rod & Fishing bait
}

function canTrainSlayer(ctx) {
    if (ctx.filters?.isSlayerLocked) return false;
    return true;
}

function canTrainHunter(ctx) {
    return hasAnyItems(ctx, [
        10006,
        10150,
        10010,
    ])
        || ctx.player.levels.Hunter >= 25; // Barehanding butterflies
}

function canTrainCooking(ctx) {
    if (ctx.filters?.overrideCooking) return true;
    return hasAnyItems(ctx, [
        25833,
        2132,
        2136,
        2134,
        2138,
        317,
        3226,
        327,
        321,
        1859,
        2307,
        3142,
        345,
    ]) // Raw herring
}

function canFillFishFoodBox(ctx) {
    return has(ctx, 6681) // Ground guam
        && has(ctx, 401); // Seaweed
}

function hasAnyFilledBowl(ctx) {
    return hasAnyItems(ctx, [
        1921,
        4456,
        2003,
        4016,
        2011,
        7074,
        1871,
        1869,
        7086,
        1873,
        7070,
        7080,
        7088,
        7068,
        7076,
    ]);
}

function hasAnyFilledVial(ctx) {
    if (ctx.filters?.hideBosses === false) return true;
    return hasAnyItems(ctx, [
        11463,
        11461,
        3038,
        3036,
        3034,
        3032,
        26346,
        26344,
        26342,
        26340,
        26353,
        26350,
        11475,
        11473,
        12911,
        12909,
        12907,
        12905,
        12919,
        12917,
        12915,
        12913,
        11503,
        11501,
        5949,
        5947,
        5945,
        5943,
        5958,
        5956,
        5954,
        5952,
        11507,
        11505,
        2458,
        2456,
        2454,
        2452,
        11435,
        11433,
        179,
        177,
        175,
        2446,
        31659,
        31656,
        31653,
        31650,
        11431,
        11429,
        125,
        123,
        121,
        2428,
        103,
        22470,
        22467,
        22464,
        22461,
        22458,
        22455,
        22452,
        22449,
        29640,
        29637,
        29634,
        29631,
        24598,
        22443,
        107,
        11447,
        11445,
        9745,
        9743,
        9741,
        9739,
        6476,
        6474,
        6472,
        6470,
        11459,
        11457,
        137,
        135,
        133,
        2432,
        24644,
        24641,
        24638,
        24635,
        24632,
        24629,
        24626,
        24623,
        23754,
        23751,
        23748,
        23745,
        23742,
        23739,
        23736,
        23733,
        23706,
        23703,
        23700,
        23697,
        23694,
        23691,
        23688,
        23685,
        23730,
        23727,
        23724,
        23721,
        23718,
        23715,
        23712,
        23709,
        109,
        31662,
        11455,
        11453,
        3014,
        3012,
        3010,
        3008,
        29833,
        29830,
        29827,
        29824,
        11962,
        11960,
        11957,
        11955,
        11953,
        11951,
        31647,
        31644,
        31641,
        31638,
        22224,
        22221,
        22218,
        22215,
        22212,
        22209,
        31623,
        31620,
        31617,
        31614,
        11479,
        11477,
        155,
        153,
        151,
        2438,
        27638,
        27635,
        27632,
        27629,
        30146,
        30143,
        30140,
        30137,
        91,
        7666,
        7664,
        7662,
        7660,
        4423,
        4421,
        4419,
        4417,
        97,
        30100,
        10004,
        10002,
        10000,
        9998,
        11519,
        11517,
        101,
        105,
        2483,
        11491,
        11489,
        11515,
        11513,
        3046,
        3044,
        3042,
        3040,
        93,
        27211,
        27208,
        27205,
        27202,
        31665,
        11467,
        11465,
        143,
        141,
        139,
        2434,
        30134,
        30131,
        30128,
        30125,
        99,
        11511,
        11509,
        173,
        171,
        169,
        2444,
        4848,
        4846,
        4844,
        4842,
        11439,
        11437,
        11451,
        11449,
        131,
        129,
        127,
        2430,
        10931,
        10929,
        10927,
        10925,
        6691,
        6689,
        6687,
        6685,
        3414,
        3412,
        3410,
        3408,
        3004,
        29201,
        29183,
        12635,
        12633,
        12631,
        12629,
        12627,
        12625,
        11441,
        11443,
        119,
        117,
        115,
        113,
        21997,
        21994,
        21987,
        21984,
        21981,
        21978,
        149,
        147,
        145,
        2436,
        12701,
        12699,
        12697,
        12695,
        11499,
        11497,
        167,
        165,
        163,
        2442,
        11483,
        11481,
        3022,
        3020,
        3018,
        3016,
        31611,
        31608,
        31605,
        31602,
        31635,
        31632,
        31629,
        31626,
        11495,
        11493,
        3030,
        3028,
        3026,
        3024,
        11487,
        11485,
        161,
        159,
        157,
        2440,
        185,
        183,
        181,
        2448,
        11471,
        11469,
        95,
        3002,
        111,
        31668,
        3406,
        22446,
        227,
        193,
        191,
        189,
        2450,
        11523,
        11521,
    ]) // Zamorak mix(2)
}

function hasAnyFilledCup(ctx) {
    return hasAnyItems(ctx, [
        4460,
        1978,
        4458,
        4423,
        4421,
        4419,
        4417,
    ]);
}

function hasAnyFilledBucket(ctx) {
    return hasAnyItems(ctx, [
        1927,
        1783,
        4687,
        1929,
        30,
    ]);
}

function hasAnyFilledJug(ctx) {
    return hasAnyItems(ctx, [
        1937,
        1993,
        1989,
    ]);
}

function hasAnyFilledPot(ctx) {
    return hasAnyItems(ctx, [
        1933,
        7468,
        4436,
    ]);
}

function hasAnyAle(ctx) {
    return hasAnyItems(ctx, [
        1905,
        5739,
        5751,
        5753,
        4627,
        1917,
        5755,
        5757,
        5763,
        5929,
        1911,
        5745,
        1913,
        5747,
        1909,
        5743,
        1915,
        25826,
        2955,
        5749,
        5761,
        5761,
        29412,
        29409,
        29277,
        24774,
        22430,
        22430,
        5741,
        23948,
    ]);
}

function hasAnyGnomeCocktail(ctx) {
    return hasAnyItems(ctx, [
        2084, // Fruit blast
        2034, // Premade fr' blast
        2048, // Pineapple punch
        2036, // Premade p' punch
        2054, // Wizard blizzard
        2040, // Premade wiz blz'd
        2080, // Short green guy
        2038, // Premade sgg
        2092, // Drunk dragon
        2032, // Premade dr' dragon
        2074, // Choc saturday
        2030, // Premade choc s'dy
        2064, // Blurberry special
        2028, // Premade blurb' sp.
    ]);
}

function canTrainFarming(ctx) {
    if (ctx.filters?.overrideFarming) return true;
    return hasAnyItems(ctx, [
        5341,
        8431,
        8433,
        1925,
    ]); // Rake or Bagged plant 1/2 or Bucket
}

function canPlantTrees(ctx) {
    return has(ctx, 5341) // Rake
        && has(ctx, 952); // Spade
}

function canPlantHardwoodTrees(ctx) {
    return canPlantTrees(ctx) //
        && (
            requiresQuest(ctx, "canCompleteBoneVoyage", canCompleteBoneVoyage) //
            || requiresQuest(ctx, "canCompleteTheRibbitingTaleOfALilyPadLabourDispute", canCompleteTheRibbitingTaleOfALilyPadLabourDispute) //
            || requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        );
}

function canPlantPlants(ctx) {
    return has(ctx, 5341); // Rake
}

function canTrainConstruction(ctx) {
    if (ctx.filters?.overrideConstruction) return true;
    return has(ctx, 8431) // Bagged plant 1
        || (
            (has(ctx, 2347) && has(ctx, 8794)) // Hammer and Saw
            && (has(ctx, 2351) || (has(ctx, 960) && hasAnyNails(ctx)))  // Iron bar or Plank and any nails
        );
}

function canTrainFletching(ctx) {
    if (ctx.filters?.overrideFletching) return true;
    return (hasKnifeOrNarwhalKnife(ctx) && has(ctx, 1511)) // Knife & Logs
        || (has(ctx, 52) && hasAnyFeather(ctx)) // Arrow shaft & Feather
        || (has(ctx, 53) && has(ctx, 39)) // Headless arrow & Bronze arrowtip
}

function canTrainFiremaking(ctx) {
    return has(ctx, 590) // Tinderbox
        || canTrainWoodcutting(ctx); // For training FM in COX
}

function canTrainSmithing(ctx) {
    if (ctx.filters?.overrideSmithing) return true;
    return has(ctx, 2347); // Hammer
}

function canDoGnomeRestaurant(ctx) {
    return canTrainCooking(ctx) //
        && has(ctx, 2171) // Gianne dough
        && has(ctx, 2165) // Crunchy tray
        && has(ctx, 2169) // Gnome spice
        && has(ctx, 2128) // Equa leaves
        && has(ctx, 2217) // Toad crunchies
        && has(ctx, 2025) // Cocktail shaker
        && has(ctx, 2026) // Cocktail glass
        && has(ctx, 2114) // Pineapple
        && has(ctx, 2102) // Lemon
        && has(ctx, 2108) // Orange
        && has(ctx, 2106) // Lemon slices
        && has(ctx, 2084); // Fruit blast
}

function canDoValeTotems(ctx) {
    return canTrainFletching(ctx) //
        && requiresQuest(ctx, "canCompleteChildrenOfTheSun", canCompleteChildrenOfTheSun) //
        && hasKnifeOrNarwhalKnife(ctx) //
        && ( //
            (has(ctx, 1521) // Oak logs
                && hasAnyItems(ctx, [
                    843,
                    845,
                    9442,
                    22251,
                    54,
                    56,
                ]) //
            ) //
            || (has(ctx, 1519) // Willow logs
                && hasAnyItems(ctx, [
                    849,
                    847,
                    9444,
                    60,
                    58,
                    22254,
                ]) //
            ) //
            || (has(ctx, 1517) // Maple logs
                && hasAnyItems(ctx, [
                    853,
                    851,
                    9448,
                    64,
                    62,
                    22257,
                ]) //
            ) //
            || (has(ctx, 1515) // Yew logs
                && hasAnyItems(ctx, [
                    857,
                    855,
                    68,
                    66,
                    22260,
                    9452,
                ]) //
            ) //
            || (has(ctx, 1513) // Magic logs
                && hasAnyItems(ctx, [
                    861,
                    859,
                    72,
                    70,
                    22263,
                    21952,
                ]) //
            ) //
            || (has(ctx, 19669) // Redwood logs
                && hasAnyItems(ctx, [
                    31049,
                    22266,
                ]) //
            ) //
        ); //
}

function canDoWintertodt(ctx) {
    return canTrainFiremaking(ctx);
}

function canDoSalvaging(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium) //
        && (
            ( // Bronze salvaging hook
                has(ctx, 960)      // Plank
                && has(ctx, 4819)  // Bronze nails
                && has(ctx, 2349)  // Bronze bar
                && has(ctx, 954)   // Rope
            )
            || ( // Iron salvaging hook
                has(ctx, 8778)     // Oak plank
                && has(ctx, 4820)  // Iron nails
                && has(ctx, 2351)  // Iron bar
                && has(ctx, 954)   // Rope
            )
            || ( // Steel salvaging hook
                has(ctx, 8780)     // Teak plank
                && has(ctx, 1539)  // Steel nails
                && has(ctx, 2353)  // Steel bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Mithril salvaging hook
                has(ctx, 8782)     // Mahogany plank
                && has(ctx, 4822)  // Mithril nails
                && has(ctx, 2359)  // Mithril bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Adamant salvaging hook
                has(ctx, 31432)    // Camphor plank
                && has(ctx, 4823)  // Adamantite nails
                && has(ctx, 2361)  // Adamantite bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Rune salvaging hook
                has(ctx, 31435)    // Ironwood plank
                && has(ctx, 4824)  // Rune nails
                && has(ctx, 2363)  // Runite bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32892) // Cupronickel bar
            )
            || ( // Dragon salvaging hook
                has(ctx, 31438)    // Rosewood plank
                && has(ctx, 31406) // Dragon nails
                && has(ctx, 31996) // Dragon metal sheet
                && has(ctx, 954)   // Rope
                && has(ctx, 32892) // Cupronickel bar
                && has(ctx, 31961) // Broken dragon hook
            )
        );
}

function canMakeAdamantKeel(ctx) {
    return (
        (has(ctx, 32889) // Lead bar
            && (has(ctx, 32011) // Adamant keel parts
                || has(ctx, 32032)) // Large adamant keel parts
        ) || (has(ctx, 32892) // Cupronickel bar
            || (has(ctx, 32014) // Rune keel parts
                || has(ctx, 32035)) // Large rune keel parts
        ) || (has(ctx, 32892) // Cupronickel bar
            || (has(ctx, 32017) // Dragon keel parts
                || has(ctx, 32038)) // Large dragon keel parts
        )
    );
}

function canDoSailingCombat(ctx) {
    return requiresQuest(ctx, "canCompletePandemonium", canCompletePandemonium);
}
