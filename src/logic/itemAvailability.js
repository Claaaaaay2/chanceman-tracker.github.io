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
    // Empty or null = always allowed
    if (!rule) return true;

    // String → requirement function
    if (typeof rule === "string") {
        const fn = REQUIREMENT_CHECKS[rule];
        if (!fn) {
            console.warn("Unknown rule:", rule);
            return false;
        }
        return await fn(ctx);
    }

    // Array → OR
    if (Array.isArray(rule)) {
        for (const r of rule) {
            if (await evaluateRule(r, ctx)) return true;
        }
        return false;
    }

    // Object structures
    if (typeof rule === "object") {

        // has {id}
        if (rule.has !== undefined) {
            return has(ctx, rule.has)
        }

        // skill level requirement: { skill: "Farming", level: 50 }
        if (rule.skill && rule.level !== undefined) {
            const skillName = capitalizeFirstLetter(rule.skill);
            return hasSkillLevel(ctx, skillName, rule.level);
        }

        // skill level requirements list: { skills: [{ skill, level }, ...] }
        if (Array.isArray(rule.skills)) {
            for (const req of rule.skills) {
                if (!req?.skill || req.level === undefined) return false;
                const skillName = capitalizeFirstLetter(req.skill);
                if (!hasSkillLevel(ctx, skillName, req.level)) return false;
            }
            return true;
        }

        // any
        if (rule.any) {
            for (const sub of rule.any) {
                if (await evaluateRule(sub, ctx)) return true;
            }
            return false;
        }

        // all
        if (rule.all) {
            for (const sub of rule.all) {
                if (!(await evaluateRule(sub, ctx))) return false;
            }
            return true;
        }
    }

    console.warn("Unknown rule structure:", rule);
    return false;
}
