import { NPC_DATA } from "./npcData.js";
import { REQUIREMENT_CHECKS, has, hasSkillLevel } from "./requirements.js";
import { capitalizeFirstLetter } from "./utils.js";

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

    if (ctx.filters?.allowOthersHouses && npc.tags?.includes("house")) {
        ctx.npcReachCache.set(npcName, true);
        return true;
    }

    const rule = npc.rule;
    const result = !rule ? true : await evaluateRule(rule, ctx);

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
        const fn = REQUIREMENT_CHECKS[rule];
        if (!fn) {
            console.warn("Unknown rule:", rule);
            result = false;
        } else {
            result = await fn(ctx);
        }
    } else if (Array.isArray(rule)) {
        // Array -> OR
        for (const r of rule) {
            if (await evaluateRule(r, ctx)) {
                result = true;
                break;
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
            result = true;
            for (const sub of rule.all) {
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

