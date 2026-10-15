
import { evaluateRule } from "./itemAvailability.js";
import { hasTelegrabRunes } from "./requirements.js";

export async function isTelegrabSpawnObtainable(rule, ctx) {
    if (!ctx?.filters?.allowTelegrab) return false;

    if (!(await hasTelegrabRunes(ctx))) return false;

    if (!rule || rule === "No requirements") {
        return true;
    }

    return await evaluateRule(rule, ctx);
}
