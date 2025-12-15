import { NPC_DATA } from "./npcData.js";
import { canObtainItem, REQUIREMENT_CHECKS } from "./requirements.js";

/* ===========================================================
   NPC ACCESS
   =========================================================== */

export async function canReachNpc(npcName, ctx) {
    ctx.npcReachCache ??= new Map();

    if (ctx.npcReachCache.has(npcName)) {
        return ctx.npcReachCache.get(npcName);
    }

    const rule = NPC_DATA[npcName].rule;
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

            const id = rule.has;
            const item = ctx.items.find(i => i.id === id);

            if (!item) return false;

            // must be unlocked AND obtainable
            return (
                ctx.unlocked.includes(id) &&
                (await canObtainItem(item, ctx, ctx.items))
            );
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
