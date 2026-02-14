import { areNpcSkillsMet, isNpcBlockedByFilters, isNpcObtainable, isRuleObtainable, isSourceHiddenByFilters } from "./itemVisibility.js";
import { fileStore } from "../storage/fileStore.js";
import { canReachNpc, evaluateRule } from "./itemAvailability.js";
import { NPC_DATA } from "./npcData.js";

export async function isItemObtainable(item, ctx) {
    const src = item.sources || {};

    if (fileStore.rolled.includes(item.id)) {
        // === Shops ===
        if (src.shops) {
            for (const rule of Object.values(src.shops)) {
                if (await isRuleObtainable(rule, ctx)) return true;
            }
        }

        // === Spawns ===
        if (src.spawns) {
            for (const rule of Object.values(src.spawns)) {
                if (await isRuleObtainable(rule, ctx)) return true;
            }
        }
    }

    // === Drops ===
    if (src.drops) {
        for (const npc of Object.keys(src.drops)) {
            if (await isNpcObtainable(npc, ctx)) return true;
        }
    }

    // === Other ===
    if (src.other) {
        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;
            if (await isRuleObtainable(obj.rule, ctx)) return true;
        }
    }

    return false;
}

/*
    LOWER rank = appears first.
    Obtainable → shop/spawn > drop > other → alphabetical
*/
export async function getObtainabilityRank(item, ctx) {
    const src = item.sources || {};
    const name = item.name.toLowerCase();
    const id = item.id;
    const player = ctx.player;

    const rolled = fileStore.rolled?.includes(id);

    // 1. Shop (obtainable)
    if (rolled && src.shops) {
        for (const rule of Object.values(src.shops)) {
            if (await isRuleObtainable(rule, ctx)) {
                return { rank: 1, name };
            }
        }
    }

    // 2. Spawn (obtainable)
    if (rolled && src.spawns) {
        for (const rule of Object.values(src.spawns)) {
            if (await isRuleObtainable(rule, ctx)) {
                return { rank: 2, name };
            }
        }
    }

    // Drops handling EASY
    if (src.drops) {
        for (const npcName of Object.keys(src.drops)) {
            if (!(await isNpcObtainable(npcName, ctx))) continue;

            const npc = NPC_DATA[npcName];
            if (npc?.tags?.includes("easy") || (npc?.tags?.includes("jon") && !ctx.filters?.isIronman)) {
                return { rank: 3, name };
            }
        }
    }

    // Other sources (crafting, etc.)
    if (src.other) {
        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;
            if (await isRuleObtainable(obj.rule, ctx)) {
                return { rank: 4, name };
            }
        }
    }

    // Other sources that are trainable but level-gated
    if (src.other) {
        const levelIgnoredCtx = {
            ...ctx,
            ignoreSkillLevels: "levelsOnly",
            suppressMissing: true,
            ruleEvalKey: `${ctx.ruleEvalKey || "base"}:ignoreLevels`,
            missing: {
                ...ctx.missing,
                suppressMissing: true,
            },
        };

        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;
            if (!obj?.rule) continue;

            // If the rule becomes obtainable when we ignore skill levels but
            // still require trainability, treat it like rank 7 (level-gated).
            if (await evaluateRule(obj.rule, levelIgnoredCtx)) {
                return { rank: 7, name };
            }
        }
    }

    // Drops handling OTHERS
    if (src.drops) {
        let hasAnyReachable = false;
        let hasAnyWithUnmetSkill = false;

        for (const npcName of Object.keys(src.drops)) {
            if (!(await canReachNpc(npcName, ctx))) continue;
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

            hasAnyReachable = true;

            const npc = NPC_DATA[npcName];

            // No skill required -> reachable drop
            if (!npc?.skill?.length) {
                return { rank: 6, name };
            }

            if (!player) continue;

            if (areNpcSkillsMet(npcName, ctx)) {
                return { rank: 5, name };
            }

            hasAnyWithUnmetSkill = true;
        }

        if (hasAnyReachable && hasAnyWithUnmetSkill) {
            return { rank: 7, name };
        }
    }

    // 7. Unobtainable
    return { rank: 8, name };
}
