import { NPC_DATA } from "./npcData.js";
import { REQUIREMENT_CHECKS, has, hasSkillLevel } from "./requirements.js";
import { capitalizeFirstLetter } from "./utils.js";

const BUTTERFLY_NET_ID = 10010;
const HOUSE_RULE_BYPASS_RULES = new Set([
    "canTrainConstruction",
    "canMakeWoodenCats",
    "canMakeWoodenWorkbench",
    "canMakeOakWorkbench",
    "canMakeSteelFramedWorkbench",
    "canMakeOakLectern",
    "canMakeEagleLectern",
    "canMakeDemonLectern",
    "canMakeTeakEagleLectern",
    "canMakeTeakDemonLectern",
    "canMakeMahoganyEagleLectern",
    "canMakeMahoganyDemonLectern",
    "canMakeMarbleLectern",
    "canMakeCraftingTableI",
    "canMakeCraftingTableII",
    "canMakeRepairBench",
    "canMakeWhetstone",
    "canMakeArmourStand",
    "canMakeToolStore",
    "canMakeWoodenLarder",
    "canMakeOakLarder",
    "canMakeTeakLarder",
    "canMakeWoodenShelvesI",
    "canMakeWoodenShelvesII",
    "canMakeOakShelves",
    "canMakeTeakShelvesI",
    "canMakeTeakShelvesII",
]);
const IMPLING_JAR_LEVEL_DOWNGRADES = new Map([
    [27, 17],
    [32, 22],
    [38, 28],
    [46, 36],
    [52, 42],
    [60, 50],
    [68, 58],
    [75, 65],
    [84, 74],
    [90, 80],
    [93, 83],
    [99, 89],
]);

function adjustImplingJarRuleLevels(subrules, ctx) {
    if (!Array.isArray(subrules) || !ctx || !has(ctx, BUTTERFLY_NET_ID)) return null;

    let hasImplingJar = false;
    let hunterRuleIndex = -1;
    let hunterLevel = null;

    for (let i = 0; i < subrules.length; i++) {
        const sub = subrules[i];
        if (sub?.has === 11260) hasImplingJar = true;
        if (sub?.skill && sub?.level !== undefined) {
            const skillName = capitalizeFirstLetter(sub.skill);
            if (skillName === "Hunter") {
                hunterRuleIndex = i;
                hunterLevel = sub.level;
            }
        }
    }

    if (!hasImplingJar || hunterRuleIndex < 0) return null;
    const loweredLevel = IMPLING_JAR_LEVEL_DOWNGRADES.get(hunterLevel);
    if (!loweredLevel) return null;

    const adjusted = [...subrules];
    adjusted[hunterRuleIndex] = {
        ...subrules[hunterRuleIndex],
        level: loweredLevel,
    };
    return adjusted;
}

/* ===========================================================
   NPC ACCESS
   =========================================================== */

export async function canReachNpc(npcName, ctx) {
    ctx.npcReachCache ??= new Map();

    if (ctx.npcReachCache.has(npcName)) {
        return ctx.npcReachCache.get(npcName);
    }

    const npc = NPC_DATA[npcName];

    if (!npc) {
        console.warn("NPC missing from NPC_DATA:", npcName);
        ctx.npcReachCache.set(npcName, false);
        return false;
    }

    const rule = npc.rule;
    let result = false;
    if (ctx.filters?.allowOthersHouses && npc.tags?.includes("house")) {
        const prevBypass = ctx.houseRuleBypass;
        ctx.houseRuleBypass = true;
        try {
            result = !rule ? true : await evaluateRule(rule, ctx);
        } finally {
            ctx.houseRuleBypass = prevBypass;
        }
    } else {
        result = !rule ? true : await evaluateRule(rule, ctx);
    }

    ctx.npcReachCache.set(npcName, result);
    return result;
}


/* ===========================================================
   OTHER METHODS
   =========================================================== */

export async function canDoOtherMethod(rule, ctx) {
    return await evaluateRule(rule, ctx);
}


/* ===========================================================
   CORE RULE EVALUATION
   =========================================================== */

export async function evaluateRule(rule, ctx) {
    const ruleCache = ctx?.cacheRules ? ctx?.ruleEvalCache : null;
    const ruleCacheKey = ctx?.ruleEvalKey || "base";
    if (ruleCache) {
        const cachedByRule = ruleCache.get(rule);
        if (cachedByRule?.has(ruleCacheKey)) {
            return cachedByRule.get(ruleCacheKey);
        }
    }

    let result = false;

    // Empty or null = always allowed
    if (!rule) {
        result = true;
    } else if (typeof rule === "string") {
        // String -> requirement function
        if (ctx?.houseRuleBypass && HOUSE_RULE_BYPASS_RULES.has(rule)) {
            result = true;
        } else {
        const fn = REQUIREMENT_CHECKS[rule];
        if (!fn) {
            console.warn("Unknown rule:", rule);
            result = false;
        } else {
            result = await fn(ctx);
        }
        }
    } else if (Array.isArray(rule)) {
        // Legacy data sometimes stores "no requirements" as [].
        // Treat empty arrays as reachable/obtainable.
        if (rule.length === 0) {
            result = true;
        } else {
        // Array -> OR
        for (const r of rule) {
            if (await evaluateRule(r, ctx)) {
                result = true;
                break;
            }
        }
        }
    } else if (typeof rule === "object") {
        // Object structures

        // has {id}
        if (rule.has !== undefined) {
            result = has(ctx, rule.has);
        } else if (rule.skill && rule.level !== undefined) {
            // skill level requirement: { skill: "Farming", level: 50 }
            const skillName = capitalizeFirstLetter(rule.skill);
            result = hasSkillLevel(ctx, skillName, rule.level);
        } else if (Array.isArray(rule.skills)) {
            // skill level requirements list: { skills: [{ skill, level }, ...] }
            result = true;
            for (const req of rule.skills) {
                if (!req?.skill || req.level === undefined) {
                    result = false;
                    break;
                }
                const skillName = capitalizeFirstLetter(req.skill);
                if (!hasSkillLevel(ctx, skillName, req.level)) {
                    result = false;
                    break;
                }
            }
        } else if (rule.any) {
            // any
            for (const sub of rule.any) {
                if (await evaluateRule(sub, ctx)) {
                    result = true;
                    break;
                }
            }
        } else if (rule.all) {
            // all
            const adjustedRules = adjustImplingJarRuleLevels(rule.all, ctx);
            const subrules = adjustedRules || rule.all;
            result = true;
            for (const sub of subrules) {
                if (!(await evaluateRule(sub, ctx))) {
                    result = false;
                    break;
                }
            }
        } else {
            console.warn("Unknown rule structure:", rule);
            result = false;
        }
    } else {
        console.warn("Unknown rule structure:", rule);
        result = false;
    }

    if (ruleCache) {
        let cachedByRule = ruleCache.get(rule);
        if (!cachedByRule) {
            cachedByRule = new Map();
            ruleCache.set(rule, cachedByRule);
        }
        cachedByRule.set(ruleCacheKey, result);
    }

    return result;
}

